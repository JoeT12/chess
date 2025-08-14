const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Chess } = require("chess.js");
const { v4: uuidv4 } = require("uuid");
const EnginePool = require("./EnginePool");
const enginePool = new EnginePool(4, "stockfish");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Map of games, where the key is the game ID and the value is the game state
const games = new Map();
const playerQueue = [];

io.on("connection", (socket) => {
  socket.on("findGame", ({ multiPlayer }) => {
    console.log(`Player ${socket.id} is looking for a game`);

    if (multiPlayer) {
      playerQueue.push(socket);

      if (playerQueue.length >= 2) {
        const [player1, player2] = playerQueue.splice(0, 2);
        const gameId = uuidv4();
        const chess = new Chess();

        games.set(gameId, {
          game: chess,
          players: { w: player1.id, b: player2.id },
          mode: "multiplayer",
        });

        player1.join(gameId);
        player2.join(gameId);

        io.to(gameId).emit("gameStart", {
          gameId,
          board: chess.board(),
          turn: chess.turn(),
          white: player1.id,
          black: player2.id,
        });

        console.log(
          `Game ${gameId} started with ${player1.id} vs ${player2.id}`
        );
      }
    } else {
      const gameId = uuidv4();
      const chess = new Chess();

      games.set(gameId, {
        game: chess,
        mode: "single-player",
        players: { w: socket.id, b: "engine" },
      });

      socket.join(gameId);

      io.to(gameId).emit("gameStart", {
        gameId,
        board: chess.board(),
        turn: chess.turn(),
        white: socket.id,
        black: "engine",
      });

      console.log(`Single-player game ${gameId} started for ${socket.id}`);
    }
  });

  socket.on("makeMove", ({ gameId, from, to, promotion }) => {
    const gameObj = games.get(gameId);
    if (!gameObj) return;

    const game = gameObj.game;
    let playerMoved = false;

    try {
      // Ensure correct player turn
      if (gameObj.players[game.turn()] !== socket.id) {
        socket.emit("error", { message: "It is not your turn" });
        return;
      }

      const move = game.move({ from, to, promotion });

      if (move) {
        const board = game.board();
        const turn = game.turn();
        const gameOver = game.isGameOver();

        let gameEndReason = "";

        if (gameOver) {
          if (game.isCheckmate()) {
            gameEndReason = "checkmate";
          } else if (game.isStalemate()) {
            gameEndReason = "stalemate";
          } else if (game.isThreefoldRepetition()) {
            gameEndReason = "threefold repetition";
          } else if (game.isInsufficientMaterial()) {
            gameEndReason = "insufficient material";
          } else if (game.isDraw()) {
            gameEndReason = "draw";
          } else {
            gameEndReason = "game over";
          }
        }

        io.to(gameId).emit("gameState", {
          board,
          turn,
          gameOver,
          gameEndReason,
          inCheck: game.inCheck(),
        });
        playerMoved = true;
      } else {
        socket.emit("invalidMove", { from, to });
      }
    } catch (error) {
      console.error(`Error processing move: ${error.message}`);
      socket.emit("error", { message: "Invalid move" });
    }

    if (gameObj.mode === "single-player" && !game.isGameOver() && playerMoved) {
      // Handle AI move for single-player mode
      const engine = enginePool.getEngine(); // synchronous
      const fen = game.fen();

      engine.getBestMove(fen, 10).then((aiMove) => {
        if (aiMove) {
          game.move(aiMove);
          const board = game.board();
          const turn = game.turn();
          const gameOver = game.isGameOver();

          let gameEndReason = "";
          if (gameOver) {
            if (game.isCheckmate()) {
              gameEndReason = "checkmate";
            } else if (game.isStalemate()) {
              gameEndReason = "stalemate";
            } else if (game.isThreefoldRepetition()) {
              gameEndReason = "threefold repetition";
            } else if (game.isInsufficientMaterial()) {
              gameEndReason = "insufficient material";
            } else if (game.isDraw()) {
              gameEndReason = "draw";
            } else {
              gameEndReason = "game over";
            }
          }

          io.to(gameId).emit("gameState", {
            board,
            turn,
            gameOver,
            gameEndReason,
            inCheck: game.inCheck(),
          });
        }
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(`Player ${socket.id} disconnected`);

    // Remove player from queue
    const index = playerQueue.findIndex((s) => s.id === socket.id);
    if (index !== -1) {
      playerQueue.splice(index, 1);
    }

    // Remove player from any game
    for (const [gameId, gameObj] of games.entries()) {
      if (gameObj.players.w === socket.id || gameObj.players.b === socket.id) {
        games.delete(gameId);
        io.to(gameId).emit("gameOver", { message: "Opponent disconnected" });
        break;
      }
    }
  });
});

process.on("SIGINT", () => {
  enginePool.quitAll();
  process.exit();
});

server.listen(8081, () => {
  console.log("server running at http://localhost:8081");
});

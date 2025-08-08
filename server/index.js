const express = require('express');
const http = require("http");
const { Server } = require('socket.io');
const { Chess } = require('chess.js');
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Map of games, where the key is the game ID and the value is the game state
const games = new Map();
const playerQueue = [];

io.on('connection', (socket) => {
  socket.on("findMultiplayerGame", () => {
    console.log(`Player ${socket.id} is looking for a game`);
    playerQueue.push(socket);

    // If 2 players are ready, create game
    if (playerQueue.length >= 2) {
      const [player1, player2] = playerQueue.splice(0, 2);
      const gameId = uuidv4();
      const chess = new Chess();

      games.set(gameId, {
        game: chess,
        players: {'w' : player1.id, 'b' : player2.id},
      });

      // Join Socket.IO room
      player1.join(gameId);
      player2.join(gameId);

      // Notify both players with game start info
      io.to(gameId).emit("gameStart", {
        gameId,
        board: chess.board(),
        turn: chess.turn(),
        white: player1.id,
        black: player2.id,
      });

      console.log(`Game ${gameId} started with ${player1.id} vs ${player2.id}`);
    }
    });

  // socket.on("startSinglePlayerGame", () => {
  //   const gameId = uuidv4();
  //   const chess = new Chess();

  //   games.set(gameId, {
  //     game: chess,
  //     players: [socket.id],
  //   });

  //   socket.join(gameId);
  //   socket.emit("gameStart", {
  //     gameId,
  //     fen: chess.fen(),
  //     white: socket.id,
  //     black: null,
  //   });

  //   console.log(`Single player game started with ID ${gameId} for player ${socket.id}`);
  // });

  socket.on('makeMove', ({gameId, from, to, promotion}) => {
    const gameObj = games.get(gameId);
    if (!gameObj) return;
    try {
      // Ensure that the correct player is making the move
      if (gameObj.players[gameObj.game.turn()] !== socket.id) {
        socket.emit('error', { message: 'It is not your turn' });
        return;
      }
      const move = gameObj.game.move({ from, to, promotion });
      if (move) {
        io.to(gameId).emit('gameState', { board: gameObj.game.board(), turn: gameObj.game.turn(), gameover: gameObj.game.isGameOver()});
      } else {
          socket.emit('invalidMove', { from, to });
      }
  } catch (error) {
      console.error(`Error processing move: ${error.message}`);
      socket.emit('error', { message: 'Invalid move' });
  }
});

});

server.listen(8081, () => {
  console.log('server running at http://localhost:8081');
});
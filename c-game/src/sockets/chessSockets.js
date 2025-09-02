import * as chessService from "../services/chessService.js";

export function registerChessSockets(io, socket) {
  socket.on("findGame", ({ multiPlayer, difficulty }) => {
    console.log(`Player ${socket.id} is looking for a game`);
    if (multiPlayer) {
      const game = chessService.queuePlayer(socket.id);
      if (game) {
        const { gameId, white, black } = game;

        const whiteSocket = io.sockets.sockets.get(white);
        const blackSocket = io.sockets.sockets.get(black);

        whiteSocket.join(gameId);
        blackSocket.join(gameId);

        console.log(
          `Multi-player game ${gameId} started for ${whiteSocket} and ${blackSocket}`
        );
        io.to(gameId).emit("gameStart", game);
      }
    } else {
      const game = chessService.createGame(
        socket.id,
        "engine",
        "single-player",
        difficulty
      );
      socket.join(game.gameId);
      console.log(`Single-player game ${game.gameId} started for ${socket.id}`);
      socket.emit("gameStart", game);
    }
  });

  socket.on("makeMove", ({ gameId, from, to, promotion }) => {
    console.log(`Player ${socket.id} making move in game ${gameId}`);
    const obj = chessService.makePlayerMove(
      socket,
      gameId,
      from,
      to,
      promotion
    );
    if (obj.error) {
      socket.emit("error", { message: obj.error });
    } else {
      io.to(gameId).emit("gameState", obj.gameState);
    }
    if (
      !obj.error &&
      !obj.gameState.gameOver &&
      obj.gameMode === "single-player"
    ) {
      chessService.makeAIMove(gameId).then((aiMove) => {
        if (!aiMove.error) {
          io.to(gameId).emit("gameState", aiMove);
        } else {
          // If AI cannot make move, force disconnect as game cannot continue 1-sided.
          io.to(gameId).emit("forceDisconnect");
        }
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(`Player ${socket.id} disconnected`);
    const gameId = chessService.handleDisconnect(socket.id);
    if (gameId) {
      io.to(gameId).emit("gameOver", { message: "Opponent disconnected" });
    }
  });
}

export function closeAllChessSockets(io) {
  console.log("Closing all open sockets...");
  io.sockets.sockets.forEach((socket) => {
    socket.disconnect(true);
  });
  console.log("All sockets closed successfully.");
}

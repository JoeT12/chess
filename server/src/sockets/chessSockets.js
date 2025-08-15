import * as chessService from "../services/chessService.js";

export function registerChessSockets(io, socket) {
  socket.on("findGame", ({multiPlayer}) => {
    console.log(`Player ${socket.id} is looking for a game`);
    const initialGameState = chessService.createGame(socket, multiPlayer);
    io.to(initialGameState.gameId).emit("gameStart", initialGameState);
  });

  socket.on("makeMove", ({ gameId, from, to, promotion }) => {
    console.log(`Player ${socket.id} making move in game ${gameId}`);
    const obj = chessService.makePlayerMove(socket, gameId, from, to, promotion);
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
        if (aiMove) {
          io.to(gameId).emit("gameState", aiMove);
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

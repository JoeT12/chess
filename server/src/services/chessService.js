import * as gameOverUtils from "../utils/gameOver.js";
import { v4 as uuidv4 } from "uuid";
import EnginePool from "./enginePoolService.js";
import { Chess } from "chess.js";
import { numChessEngines } from "../config/env.js";

const enginePool = new EnginePool(numChessEngines, "stockfish");

// Map of games, where the key is the game ID and the value is the game state
const games = new Map();
const playerQueue = [];

export const createGame = (socket, multiPlayer = false) => {
  const gameState = {};

  const createAndStoreGame = (whitePlayer, blackPlayer, mode) => {
    const gameId = uuidv4();
    const chess = new Chess();

    games.set(gameId, {
      game: chess,
      players: { w: whitePlayer, b: blackPlayer },
      mode,
    });

    gameState.gameId = gameId;
    gameState.board = chess.board();
    gameState.turn = chess.turn();
    gameState.white = whitePlayer;
    gameState.black = blackPlayer;

    return { gameId, chess };
  };

  if (multiPlayer) {
    playerQueue.push(socket);

    if (playerQueue.length >= 2) {
      const [player1, player2] = playerQueue.splice(0, 2);
      const { gameId } = createAndStoreGame(
        player1.id,
        player2.id,
        "multiplayer"
      );

      player1.join(gameId);
      player2.join(gameId);
      console.log(`Game ${gameId} started with ${player1.id} vs ${player2.id}`);
    }
  } else {
    const { gameId } = createAndStoreGame(socket.id, "engine", "single-player");
    socket.join(gameId);
    console.log(`Single-player game ${gameId} started for ${socket.id}`);
  }

  return gameState;
};

export const makePlayerMove = (socket, gameId, from, to, promotion) => {
  const gameObj = games.get(gameId);
  if (!gameObj) return;

  const game = gameObj.game;

  if (gameObj.players[game.turn()] !== socket.id) {
    return {
      gameState: {},
      gameMode: gameObj.mode,
      error: "It is not your turn",
    };
  }

  let move;
  try {
    move = game.move({ from, to, promotion });
  } catch (err) {
    const errorMsg = `Error processing move: ${err.message}`;
    console.error(errorMsg);
    return { gameState: {}, gameMode: gameObj.mode, error: errorMsg };
  }

  if (!move) {
    const errorMsg = `Invalid move attempted from ${from} to ${to}`;
    console.error(errorMsg);
    return { gameState: {}, gameMode: gameObj.mode, error: errorMsg };
  }

  const gameOver = game.isGameOver();
  const gameState = {
    board: game.board(),
    turn: game.turn(),
    gameOver,
    gameEndReason: gameOver ? gameOverUtils.getGameEndReason(game) : "",
    inCheck: game.inCheck(),
  };

  return { gameState, gameMode: gameObj.mode, error: null };
};

export const makeAIMove = async (gameId) => {
  const gameObj = games.get(gameId);
  if (!gameObj) return;

  const game = gameObj.game;
  if (game.isGameOver()) return;

  const engine = enginePool.getEngine();
  const fen = game.fen();

  try {
    const aiMove = await engine.getBestMove(fen, 10);
    if (!aiMove) return;

    game.move(aiMove);

    const gameOver = game.isGameOver();
    return {
      board: game.board(),
      turn: game.turn(),
      gameOver,
      gameEndReason: gameOver ? gameOverUtils.getGameEndReason(game) : "",
      inCheck: game.inCheck(),
    };
  } catch (err) {
    console.error(`AI move failed: ${err.message}`);
    return { error: `AI move failed: ${err.message}` };
  }
};

export const handleDisconnect = (socketId) => {
  const index = playerQueue.findIndex((s) => s.id === socketId);
  if (index !== -1) {
    playerQueue.splice(index, 1);
  }

  // Remove player from any game
  for (const [gameId, gameObj] of games.entries()) {
    if (gameObj.players.w === socketId || gameObj.players.b === socketId) {
      games.delete(gameId);
      return gameId;
      break;
    }
  }
};

export const shutDownEngines = () => {
  console.log("Teminated all engines...");
  enginePool.quitAll();
  console.log("All engines terminated successfully.");
}

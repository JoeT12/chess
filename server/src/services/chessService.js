import * as gameOverUtils from "../utils/gameOver.js";
import { v4 as uuidv4 } from "uuid";
import EnginePool from "./enginePoolService.js";
import { Chess } from "chess.js";
import { numChessEngines, easyAI, mediumAI, hardAI } from "../config/env.js";

const enginePool = new EnginePool(numChessEngines, "stockfish");
const AI_LEVELS = {
  easy: easyAI,
  medium: mediumAI,
  hard: hardAI,
};

// Map of games, where the key is the game ID and the value is the game state
const games = new Map();
const playerQueue = [];

export const queuePlayer = (playerId) => {
  playerQueue.push(playerId);
  if (playerQueue.length >= 2) {
    const [p1, p2] = playerQueue.splice(0, 2);
    return createGame(p1, p2, "multiplayer", null);
  }
  return null;
};

export const createGame = (whitePlayer, blackPlayer, mode, difficulty) => {
  const gameId = uuidv4();
  const chess = new Chess();

  const AIConfig = difficulty ? AI_LEVELS[difficulty] ?? null : null;

  games.set(gameId, {
    game: chess,
    players: { w: whitePlayer, b: blackPlayer },
    mode,
    AIConfig: AIConfig,
  });

  return {
    gameId,
    board: chess.board(),
    turn: chess.turn(),
    white: whitePlayer,
    black: blackPlayer,
  };
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

  const fen = game.fen();

  try {
    const aiMove = await enginePool.getBestMove(fen, gameObj.AIConfig);
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
    }
  }
};

export const shutDownEngines = () => {
  console.log("Teminating all engines...");
  enginePool.quitAll();
  console.log("All engines terminated successfully.");
};

export const getGameEndReason = (game) => {
  let gameEndReason = "";

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

  return gameEndReason;
};

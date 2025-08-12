export const pieceNameMap: Record<string, string> = {
  k: "King",
  q: "Queen",
  r: "Rook",
  b: "Bishop",
  n: "Knight",
  p: "Pawn",
};

export type playerColor = "w" | "b";

export type piece = {
  type: string;
  color: playerColor;
  square: string;
};

export type boardState = (piece | null)[][];

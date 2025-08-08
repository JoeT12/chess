export const pieceNameMap: Record<string, string> = {
  k: "King",
  q: "Queen",
  r: "Rook",
  b: "Bishop",
  n: "Knight",
  p: "Pawn",
};

export type piece = {
  type: string;
  color: "w" | "b";
  square: string;
};

export type board = (piece | null)[][];

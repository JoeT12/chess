"use client";

import { useDrop } from "react-dnd";
import Piece from "./Piece";
import { piece } from "@/constants/chess";

interface SquareProps {
  position: [number, number]; // [row, col] on the displayed board
  piece: piece | null;
  movePiece: (from: [number, number], to: [number, number]) => void;
  clicked?: boolean;
  setSelectedSquares: (row: number, col: number) => void;
  mapCoords: (row: number, col: number) => [number, number];
  disabled?: boolean;
}

export default function Square({
  position,
  piece,
  movePiece,
  clicked,
  setSelectedSquares,
  mapCoords,
  disabled = false,
}: SquareProps) {
  const [row, col] = position;
  const isDark = (row + col) % 2 === 1;

  const [, drop] = useDrop(() => ({
    accept: "piece",
    canDrop: () => !disabled,
    drop: (item: { position: [number, number] }) => {
      const from = mapCoords(item.position[0], item.position[1]);
      const to = mapCoords(row, col);
      movePiece(from, to);
    },
  }));

  const isValidPiece =
    piece && typeof piece.type === "string" && typeof piece.color === "string";

  return drop(
    <div
      className={`flex items-center justify-center aspect-square w-full h-full ${
        clicked ? "bg-red-500" : isDark ? "bg-green-700" : "bg-green-100"
      }`}
      onClick={() => setSelectedSquares(row, col)}
    >
      {isValidPiece && (
        <Piece piece={piece} position={position} disabled={disabled} />
      )}
    </div>
  );
}

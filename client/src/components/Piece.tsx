"use client";

import { useDrag } from "react-dnd";
import Image from "next/image";

type PieceProps = {
  piece: {
    type: string;
    color: string;
  };
  position: [number, number];
};

const pieceNameMap: Record<string, string> = {
  k: "King",
  q: "Queen",
  r: "Rook",
  b: "Bishop",
  n: "Knight",
  p: "Pawn",
};

export default function Piece({ piece, position }: PieceProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "piece",
    item: { position },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const color = piece.color === "w" ? "white" : "black";
  const name = pieceNameMap[piece.type];
  const src = `/pieces/${color}${name}.png`;

  return (
    <div
      ref={drag}
      className={`w-full h-full flex items-center justify-center ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <Image
        src={src}
        alt={`${piece.color} ${piece.type}`}
        width={50}
        height={50}
      />
    </div>
  );
}

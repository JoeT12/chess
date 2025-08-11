"use client";

import { useDrag } from "react-dnd";
import Image from "next/image";
import { pieceNameMap, piece } from "@/constants/chess";
import { useRef } from "react";

type PieceProps = {
  piece: piece;
  position: [number, number];
  disabled?: boolean;
};

export default function Piece({
  piece,
  position,
  disabled = false,
}: PieceProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "piece",
    item: { position },
    canDrag: !disabled,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const color = piece.color === "w" ? "white" : "black";
  const name = pieceNameMap[piece.type];
  const src = `/pieces/${color}${name}.png`;

  // Pass Expected Type To Use-Ref Hook to Avoid TypeScript Error
  const dragRef = useRef<HTMLDivElement>(null);
  drag(dragRef);

  return (
    <div
      ref={dragRef}
      className={`w-full h-full flex items-center justify-center ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <Image
        src={src}
        alt={`${piece.color} ${piece.type}`}
        width={50}
        height={50}
        className="w-[75%] h-[75%]"
      />
    </div>
  );
}

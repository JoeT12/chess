"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useCallback, useEffect, useRef, useState } from "react";
import Square from "./Square";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { pieceNameMap, board } from "@/constants/chess";
import { Button } from "@/components/ui/button";

type ChessBoardProps = {
  board: board;
  playerColor: "w" | "b";
  turn: "w" | "b";
  onMove?: (
    from: [number, number],
    to: [number, number],
    promotion: string
  ) => void;
};

export default function ChessBoard({
  board,
  playerColor,
  turn = "w",
  onMove,
}: ChessBoardProps) {
  const [selectedSquares, setSelectedSquares] = useState<Array<[number, number]>>([]);
  const [promotionModalOpen, setPromotionModalOpen] = useState(false);

  // Refs for always-fresh state.
  // This avoids stale values being used for move validation in the handleMove function.
  const boardRef = useRef(board);
  const turnRef = useRef(turn);
  const playerColorRef = useRef(playerColor);

  useEffect(() => {
    boardRef.current = board;
  }, [board]);
  useEffect(() => {
    turnRef.current = turn;
  }, [turn]);
  useEffect(() => {
    playerColorRef.current = playerColor;
  }, [playerColor]);

  // Reverse board for black
  const displayBoard =
    playerColor === "b"
      ? [...board].reverse().map((row) => [...row].reverse())
      : board;

  // Map displayed coordinates to actual board coordinates
  const mapCoords = (row: number, col: number): [number, number] => {
    if (playerColor === "b") {
      return [7 - row, 7 - col];
    }
    return [row, col];
  };

  const handleMove = useCallback(
    (from: [number, number], to: [number, number], promotion?: string) => {
      // clear UI click selection right away
      setSelectedSquares([]);

      const board = boardRef.current;
      const turn = turnRef.current;
      const mycolor = playerColorRef.current;

      const piece = board[from[0]][from[1]];
      if (!piece || piece.color !== mycolor) {
        console.warn("You can only move your own pieces!");
        return;
      }

      if (turn !== mycolor) {
        console.warn("It's not your turn!");
        return;
      }

      const pieceToMoveIsPawn = board[from[0]][from[1]]?.type === "p";
      const pawnEligibleForPromotion =
        (mycolor === "w" && from[0] === 1) ||
        (mycolor === "b" && from[0] === 6);

      if (pieceToMoveIsPawn && pawnEligibleForPromotion && !promotion) {
        setPromotionModalOpen(true);
        setSelectedSquares([from, to]); // store for the modal buttons to read
        return;
      }

      if (onMove) {
        onMove(from, to, promotion || "");
      }
    },
    [onMove]
  );

  const handlePromotion = useCallback(
    (from: [number, number], to: [number, number], promotion: string) => {
      setPromotionModalOpen(false);
      // route through local handleMove to ensure all checks are done.
      handleMove(from, to, promotion);
    },
    [handleMove]
  );

  const setClicked = useCallback(
    (row: number, col: number) => {
      const [actualRow, actualCol] = mapCoords(row, col);

      setSelectedSquares((prevSelectedSquares) => {
        if (
          prevSelectedSquares.length === 0 &&
          board[actualRow][actualCol] != null &&
          board[actualRow][actualCol]?.color === playerColor
        ) {
          return [[actualRow, actualCol]];
        } else if (prevSelectedSquares.length === 1) {
          const newClicked = [...prevSelectedSquares, [actualRow, actualCol]] as [
            [number, number],
            [number, number]
          ];
          handleMove(newClicked[0], newClicked[1]);
          return [];
        } else {
          return [];
        }
      });
    },
    [board, playerColor, handleMove, mapCoords]
  );

  const getFullColorName = (str: string) => {
    if (!str) return "";
    if (str == "w") return "White";
    if (str == "b") return "Black";
    return;
  };

  return (
    <>
      <div className="text-center justify-center">
        <h1 className="text-2xl font-bold mb-4 flex justify-center">
          {getFullColorName(turn)}'s Turn
        </h1>
        <div className="flex justify-center items-center">
          <DndProvider backend={HTML5Backend}>
            <div className="inline-block border-4 border-black">
              {displayBoard.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {row.map((piece, colIndex) => (
                    <Square
                      key={`${rowIndex}-${colIndex}`}
                      position={[rowIndex, colIndex]}
                      piece={piece}
                      movePiece={handleMove}
                      clicked={
                        selectedSquares.length > 0 &&
                        selectedSquares[0][0] ===
                          mapCoords(rowIndex, colIndex)[0] &&
                        selectedSquares[0][1] === mapCoords(rowIndex, colIndex)[1]
                      }
                      setSelectedSquares={setClicked}
                      mapCoords={mapCoords}
                    />
                  ))}
                </div>
              ))}
            </div>
          </DndProvider>
        </div>
      </div>

      {promotionModalOpen && (
        <Dialog open={promotionModalOpen} onOpenChange={setPromotionModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Promote Pawn</DialogTitle>
            </DialogHeader>

            <DialogContent>
              <p>Select a piece to promote your pawn:</p>
              <div className="flex justify-around mt-4">
                {["q", "r", "b", "n"].map((type) => (
                  <Button
                    key={type}
                    onClick={() => {
                      handlePromotion(selectedSquares[0], selectedSquares[1], type);
                    }}
                    className={`bg-white ${
                      playerColor === "b"
                        ? "hover:bg-gray-300"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Image
                      src={`/pieces/${playerColor === "w" ? "white" : "black"}${
                        pieceNameMap[type]
                      }.png`}
                      alt={`${type} piece`}
                      className="w-9 h-9"
                      width={100}
                      height={100}
                    />
                  </Button>
                ))}
              </div>
            </DialogContent>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

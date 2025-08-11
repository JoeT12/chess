"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Square from "./Square";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { pieceNameMap, boardState, playerColor } from "@/constants/chess";
import { Button } from "@/components/ui/button";
import { useChessBoard } from "@/hooks/useChessBoard";

type ChessBoardProps = {
  board: boardState;
  playerColor: playerColor;
  turn: playerColor;
  onMove?: (
    from: [number, number],
    to: [number, number],
    promotion: string
  ) => void;
  disabled?: boolean;
};

export default function ChessBoard(props: ChessBoardProps) {
  const {
    selectedSquares,
    promotionModalOpen,
    setPromotionModalOpen,
    handlePromotion,
    handleMove,
    displayBoard,
    mapCoords,
    setClicked,
  } = useChessBoard(props);

  const getFullColorName = (str: string) =>
    str === "w" ? "White" : str === "b" ? "Black" : "";

  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 flex justify-center">
          {getFullColorName(props.turn)}'s Turn
        </h1>
        <DndProvider backend={HTML5Backend}>
          <div className="grid grid-cols-8 aspect-square w-[min(85vw,85vh)] border-4 border-black">
            {displayBoard.flat().map((piece, index) => {
              const rowIndex = Math.floor(index / 8);
              const colIndex = index % 8;

              return (
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
                  disabled={props.disabled}
                />
              );
            })}
          </div>
        </DndProvider>
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
                      handlePromotion(
                        selectedSquares[0],
                        selectedSquares[1],
                        type
                      );
                    }}
                    className={`bg-white ${
                      props.playerColor === "b"
                        ? "hover:bg-gray-300"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Image
                      src={`/pieces/${
                        props.playerColor === "w" ? "white" : "black"
                      }${pieceNameMap[type]}.png`}
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

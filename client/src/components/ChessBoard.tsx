'use client';

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useCallback, useState } from "react";
import Square from "./Square";

type ChessBoardProps = {
  board: (string | null)[][]; // Needs to be changed as we are not using FEN notation anymore
  playerColor?: 'w' | 'b'; // Optional player color
  turn?: 'white' | 'black';
  onMove?: (from: [number, number], to: [number, number]) => void;
};

export default function ChessBoard({ board, playerColor, turn = 'white', onMove }: ChessBoardProps) {
  const [clickedCells, setClickedCells] = useState<Array<[number, number]>>([]);

  // Reverse board for black
  const displayBoard = playerColor === 'b'
    ? [...board].reverse().map(row => [...row].reverse())
    : board;

  // Map displayed coordinates to actual board coordinates
  const mapCoords = (row: number, col: number): [number, number] => {
    if (playerColor === 'b') {
      return [7 - row, 7 - col];
    }
    return [row, col];
  };

  const handleMove = useCallback(
    (from: [number, number], to: [number, number]) => {
      setClickedCells([]);
      if (onMove) {
        onMove(from, to);
      }
    },
    [onMove]
  );

  const setClicked = useCallback(
    (row: number, col: number) => {
      const [actualRow, actualCol] = mapCoords(row, col);
      setClickedCells((prevClickedCells) => {
        if (prevClickedCells.length === 0 && board[actualRow][actualCol] != null) {
          return [[actualRow, actualCol]];
        } else if (prevClickedCells.length === 1) {
          return [...prevClickedCells, [actualRow, actualCol]];
        } else {
          return [];
        }
      });
    },
    [board, playerColor]
  );

  if (clickedCells.length === 2) {
    handleMove(clickedCells[0], clickedCells[1]);
  }

  return (
    <div className="text-center justify-center">
      <h1 className="text-2xl font-bold mb-4 flex justify-center">Turn {turn}</h1>
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
                      clickedCells.length > 0 &&
                      clickedCells[0][0] === mapCoords(rowIndex, colIndex)[0] &&
                      clickedCells[0][1] === mapCoords(rowIndex, colIndex)[1]
                    }
                    setClicked={setClicked}
                    mapCoords={mapCoords}
                  />
                ))}
              </div>
            ))}
          </div>
        </DndProvider>
      </div>
    </div>
  );
}

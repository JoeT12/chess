'use client';

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useCallback, useEffect, useRef, useState } from "react";
import Square from "./Square";

type ChessBoardProps = {
  board: (any | null)[][];
  playerColor?: 'w' | 'b';
  turn?: 'white' | 'black';
  onMove?: (from: [number, number], to: [number, number]) => void;
};

export default function ChessBoard({ board, playerColor, turn = 'white', onMove }: ChessBoardProps) {
  const [clickedCells, setClickedCells] = useState<Array<[number, number]>>([]);

  // Refs for always-fresh state
  const boardRef = useRef(board);
  const turnRef = useRef(turn);
  const playerColorRef = useRef(playerColor);

  useEffect(() => { boardRef.current = board; }, [board]);
  useEffect(() => { turnRef.current = turn; }, [turn]);
  useEffect(() => { playerColorRef.current = playerColor; }, [playerColor]);

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
      const board = boardRef.current;
      const turn = turnRef.current;
      const mycolor = playerColorRef.current;

      if (!mycolor) return;

      const piece = board[from[0]][from[1]];
      if (!piece || piece.color !== mycolor) {
        console.warn("You can only move your own pieces!");
        return;
      }

      const myTurn = mycolor === "w" ? "white" : "black";
      if (turn !== myTurn) {
        console.warn("It's not your turn!");
        return;
      }

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
        if (
          prevClickedCells.length === 0 &&
          board[actualRow][actualCol] != null &&
          board[actualRow][actualCol]?.color === playerColor
        ) {
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

  useEffect(() => {
    if (clickedCells.length === 2) {
      handleMove(clickedCells[0], clickedCells[1]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedCells]);

  const capitaliseFirstLetter = (str: string) => {
    if (!str) return '';
    return str[0].toUpperCase() + str.slice(1);
  }

  return (
    <div className="text-center justify-center">
      <h1 className="text-2xl font-bold mb-4 flex justify-center">{capitaliseFirstLetter(turn)}'s Turn</h1>
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

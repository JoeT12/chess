import { useCallback, useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { boardState } from "@/constants/chess";

type PlayerColor = "w" | "b";

export function useChessBoard({
  board,
  playerColor,
  turn,
  onMove,
  disabled,
}: {
  board: boardState;
  playerColor: PlayerColor;
  turn: PlayerColor;
  onMove?: (
    from: [number, number],
    to: [number, number],
    promotion: string
  ) => void;
  disabled?: boolean;
}) {
  const [selectedSquares, setSelectedSquares] = useState<[number, number][]>(
    []
  );
  const [promotionModalOpen, setPromotionModalOpen] = useState(false);

  // Keep refs fresh to avoid stale closure issues
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

  // Reverse board if playing black
  const displayBoard =
    playerColor === "b"
      ? [...board].reverse().map((row) => [...row].reverse())
      : board;

  const mapCoords = (row: number, col: number): [number, number] =>
    playerColor === "b" ? [7 - row, 7 - col] : [row, col];

  const handleMove = useCallback(
    (from: [number, number], to: [number, number], promotion?: string) => {
      setSelectedSquares([]);

      const currentBoard = boardRef.current;
      const currentTurn = turnRef.current;
      const myColor = playerColorRef.current;

      const piece = currentBoard[from[0]][from[1]];
      if (!piece || piece.color !== myColor) {
        toast.error("You can only move your own pieces!");
        return;
      }
      if (currentTurn !== myColor) {
        toast.error("It's not your turn!");
        return;
      }

      const isPawn = piece.type === "p";
      const eligibleForPromotion =
        (myColor === "w" && from[0] === 1) ||
        (myColor === "b" && from[0] === 6);

      if (isPawn && eligibleForPromotion && !promotion) {
        setPromotionModalOpen(true);
        setSelectedSquares([from, to]);
        return;
      }

      onMove?.(from, to, promotion || "");
    },
    [onMove]
  );

  const handlePromotion = useCallback(
    (from: [number, number], to: [number, number], promotion: string) => {
      setPromotionModalOpen(false);
      handleMove(from, to, promotion);
    },
    [handleMove]
  );

  const setClicked = useCallback(
    (row: number, col: number) => {
      if (disabled) return;
      const [actualRow, actualCol] = mapCoords(row, col);

      setSelectedSquares((prev) => {
        if (
          prev.length === 0 &&
          board[actualRow][actualCol] &&
          board[actualRow][actualCol]?.color === playerColor
        ) {
          return [[actualRow, actualCol]];
        } else if (prev.length === 1) {
          const newClick = [...prev, [actualRow, actualCol]] as [
            [number, number],
            [number, number]
          ];
          handleMove(newClick[0], newClick[1]);
          return [];
        } else {
          return [];
        }
      });
    },
    [board, playerColor, handleMove, mapCoords, disabled]
  );

  return {
    selectedSquares,
    promotionModalOpen,
    setPromotionModalOpen,
    handlePromotion,
    handleMove,
    displayBoard,
    mapCoords,
    setClicked,
  };
}

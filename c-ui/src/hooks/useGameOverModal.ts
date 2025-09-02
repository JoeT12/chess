import { useState, useCallback, useMemo } from "react";

export function useGameOverModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState<String | null>(null);
  const [winner, setWinner] = useState<String | null>(null);
  const [localPlayerColor, setLocalPlayerColor] = useState<String | null>(null);

  const openModal = useCallback(
    (reason: String, winner: String, playerColor: String) => {
      setReason(reason);
      setWinner(winner);
      setLocalPlayerColor(playerColor);
      setIsOpen(true);
    },
    []
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const message = useMemo(() => {
    if (!reason) return "";
    return reason === "draw"
      ? "It's a draw!"
      : winner === localPlayerColor
      ? `You won by ${reason}!`
      : `You lost by ${reason}!`;
  }, [reason, winner, localPlayerColor]);

  return {
    isOpen,
    reason,
    winner,
    localPlayerColor,
    message,
    openModal,
    closeModal,
  };
}

import { useEffect, useState, useRef } from "react";
import { getSocket } from "@/lib/socket";
import { toast } from "sonner";
import { useGameOverModal } from "./useGameOverModal";
import { UUID } from "crypto";
import { boardState, playerColor } from "@/constants/chess";
import isServerHealthy from "@/lib/api/serverHealth";

export function useChessGame(mode: string, accessToken: string | null) {
  const [matchingOpponent, setMatchingOpponent] = useState(false);
  const [gameId, setGameId] = useState<UUID | null>(null);
  const [board, setBoard] = useState<boardState>([]);
  const [activeColor, setActiveColor] = useState<playerColor>("w");
  const [localPlayerColor, setLocalPlayerColor] = useState<playerColor>("w");
  const [AIDifficulty, setAIDifficulty] = useState<string>("easy");

  const playerColorRef = useRef<playerColor>("w");
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);
  const { isOpen, message, openModal, closeModal } = useGameOverModal();

  useEffect(() => {
    // Decide token for socket: single-player can be guest
    if (!accessToken) return;

    const socket = getSocket(accessToken);
    socketRef.current = socket;

    const moveSound = new Audio("/move.wav");

    // Event registration
    socket.on("gameStart", ({ gameId, board, turn, white }) => {
      setMatchingOpponent(false);
      setGameId(gameId);
      setBoard(board);
      setActiveColor(turn);

      const color: playerColor = socket.id === white ? "w" : "b";
      playerColorRef.current = color;
      setLocalPlayerColor(color);
    });

    socket.on(
      "gameState",
      ({ board, turn, gameOver, gameEndReason, inCheck }) => {
        setBoard(board);
        moveSound.play();
        setActiveColor(turn);
        if (inCheck) toast.info("Check!");
        if (gameOver) {
          openModal(
            gameEndReason,
            turn === "w" ? "b" : "w",
            playerColorRef.current
          );
        }
      }
    );

    socket.on("gameOver", () => {
      socket.off("findGame");
      socket.off("gameState");
      openModal("forefit", playerColorRef.current, playerColorRef.current);
    });

    socket.on("error", (error) => toast.error(`Error: ${error.message}`));

    socket.on("connect_error", () => {
      toast.error("Unable to connect to game server. Please try again later.");
      setMatchingOpponent(false);
      socket.disconnect();
    });

    socket.on("disconnect", () => {
      toast.error("Error: server disconnected.");
      resetGame();
    });

    // Cleanup on unmount
    return () => {
      socket.off("gameStart");
      socket.off("gameState");
      socket.off("gameOver");
      socket.off("error");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, [accessToken, mode]);

  async function findOpponent() {
    const socket = socketRef.current;
    if (!socket) return;

    if (!(await isServerHealthy())) {
      toast.error("Error: Unable to connect to server.");
      return;
    }
    if (!socket.connected) socket.connect();

    setMatchingOpponent(true);
    const payload =
      mode === "single-player"
        ? { multiPlayer: false, difficulty: AIDifficulty }
        : { multiPlayer: true };
    socket.emit("findGame", payload);
  }

  function makeMove(
    from: [number, number],
    to: [number, number],
    promotion?: string
  ) {
    const socket = socketRef.current;
    if (!socket || !gameId) return;

    socket.emit("makeMove", {
      gameId,
      from: toChessNotation(from),
      to: toChessNotation(to),
      ...(promotion && { promotion }),
    });
  }

  function resetGame() {
    closeModal();
    setGameId(null);
    setBoard([]);
    setActiveColor("w");
    setLocalPlayerColor("w");
  }

  return {
    matchingOpponent,
    gameId,
    board,
    activeColor,
    localPlayerColor,
    isOpen,
    message,
    findOpponent,
    makeMove,
    resetGame,
    setAIDifficulty,
  };
}

export function toChessNotation([row, col]: [number, number]) {
  const files = "abcdefgh";
  return files[col] + (8 - row);
}

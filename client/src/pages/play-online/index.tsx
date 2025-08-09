"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import socket from "@/lib/socket";
import { UUID } from "crypto";
import ChessBoard from "@/components/ChessBoard";
import { board } from "@/constants/chess";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function PlayOnline() {
  const [matchingApponent, setMatchingOpponent] = useState(false);
  const [gameid, setGameId] = useState<UUID | null>(null);

  const [board, setBoard] = useState<board>([]);
  const [activeColor, setActiveColor] = useState<"w" | "b">("w");
  const [localPlayerColor, setLocalPlayerColor] = useState<"w" | "b">("w");

  const [gameInCheck, setGameInCheck] = useState(false);
  const [winner, setWinner] = useState<String>("");
  const [gameOverReason, setGameOverReason] = useState<String>("");
  const [gameOverModalOpen, setGameOverModalOpen] = useState(false);

  useEffect(() => {
    socket.on("gameStart", ({ gameId, board, turn, white }) => {
      setMatchingOpponent(false);
      setGameId(gameId);
      setBoard(board);
      setActiveColor(turn);

      // Interpret the turn to get our color
      if (socket.id === white) {
        setLocalPlayerColor("w");
      } else {
        setLocalPlayerColor("b");
      }
    });

    socket.on("gameState", ({ board, turn, gameOver, gameEndReason, inCheck }) => {
      setBoard(board);
      setActiveColor(turn);
      if (inCheck) {
        // Handle check state
        console.log("Check!");
        setGameInCheck(true);
      } else {
        setGameInCheck(false);
      }
      // Check if the game is over after receiving the latest game state
      if (gameOver) {
        // On a win, the winner is opposite of the current turn
        // If it's white's turn, black won and vice versa
        setWinner(turn === "w" ? "b" : "w");
        setGameOverReason(gameEndReason);
        setGameOverModalOpen(true);
      }
    });

    return () => {
      // Player has navigated away from page...
      // Clean up socket listeners
      socket.off("findMultiplayerGame");
      socket.off("gameState");
      // Emit signal to server to end game with forfeit
    };
  }, []);

  const handleFindOpponent = () => {
    setMatchingOpponent(true);
    socket.emit("findMultiplayerGame");
  };

  // Convert board coordinates to chess notation
  function toChessNotation([row, col]: [number, number]) {
    const files = "abcdefgh";
    return files[col] + (8 - row);
  }

  const handleMove = (
    from: [number, number],
    to: [number, number],
    promotion: string
  ) => {
    if (!gameid) return;
    // get current piece in the from position
    if (promotion === "") {
      socket.emit("makeMove", {
        gameId: gameid,
        from: toChessNotation(from),
        to: toChessNotation(to),
      });
    } else {
      socket.emit("makeMove", {
        gameId: gameid,
        from: toChessNotation(from),
        to: toChessNotation(to),
        promotion: promotion,
      });
    }
  };

  return (
    <>
      {gameid === null ? (
        <>
          <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[url('/Background.png')] bg-cover bg-center" />
          <div className="flex flex-col justify-center items-center min-h-full py-8">
            <Card className="w-full max-w-screen-md">
              <CardHeader className="flex justify-center">
                <CardTitle className="text-center">
                  <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
                    Play Online
                  </h1>
                </CardTitle>
              </CardHeader>

              {!matchingApponent ? (
                <CardContent>
                  <p className="leading-7 [&:not(:first-child)]:mt-6 text-center">
                    To get matched with an opponent, please click on the button
                    below.
                  </p>
                  <Button
                    className="w-full bg-chessGreen text-white py-2 mb-3 rounded-md mt-4"
                    onClick={() => {
                      handleFindOpponent();
                    }}
                  >
                    Find Opponent
                  </Button>
                </CardContent>
              ) : (
                <CardContent>
                  <p className="leading-7 [&:not(:first-child)]:mt-6 text-center">
                    Matching...
                  </p>
                </CardContent>
              )}
            </Card>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-row gap-4 justify-center items-center mt-4">
            <Card className="w-25 max-w-sm text-center p-2">
              <CardHeader className="flex justify-center">
                <CardTitle className="text-center">White</CardTitle>
              </CardHeader>
              <p>{localPlayerColor === "w" ? <>You</> : <>chessbro123</>}</p>
            </Card>
            <ChessBoard
              board={board}
              playerColor={localPlayerColor}
              turn={activeColor}
              onMove={handleMove}
              disabled={winner !== "" || gameOverReason === "draw"}
            />
            <Card className="w-25 max-w-sm text-center p-2">
              <CardHeader className="flex justify-center">
                <CardTitle className="text-center">Black</CardTitle>
              </CardHeader>
              <p>{localPlayerColor === "b" ? <>You</> : <>chessbro123</>}</p>
            </Card>
          </div>
          {gameInCheck && (
            <>
              <br />
              <p className="text-center">CHECK!</p>
            </>
          )}

          {gameOverModalOpen && (
            <>
              <Dialog open={gameOverModalOpen} onOpenChange={() => {}}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-center">
                      Game Over!
                    </DialogTitle>
                    <DialogDescription className="text-center">
                      {gameOverReason === "draw"
                        ? "It's a draw!"
                        : winner === localPlayerColor
                        ? `You won by ${gameOverReason}!`
                        : `You lost by ${gameOverReason}!`}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex justify-around mt-1">
                    <Button
                      className="mt-2 bg-chessGreen text-white py-2 rounded-md"
                      onClick={() => {
                        // Reset game state to initial values
                        setGameId(null);
                        setBoard([]);
                        setActiveColor("w");
                        setLocalPlayerColor("w");
                        setWinner("");
                        setGameOverModalOpen(false);
                      }}
                    >
                      Return to Lobby
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="text-center mt-4">
                <h2 className="text-2xl font-bold"></h2>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}

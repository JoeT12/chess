"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import socket from "@/lib/socket";
import { UUID } from "crypto";
import ChessBoard from "@/components/ChessBoard";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function PlayOnline() {
  const [matchingApponent, setMatchingOpponent] = useState(false);
  const [gameid, setGameId] = useState<UUID | null>(null);
  const [board, setBoard] = useState<(string | null)[][]>([]);
  const [turn, setTurn] = useState<"white" | "black">("white");
  const [mycolor, setMyColor] = useState<"w" | "b" | null>(null);
  const [promotionModalOpen, setPromotionModalOpen] = useState(false);
  const [clickedCells, setClickedCells] = useState<Array<[number, number]>>([]);

  // Map for promotion piece type to piece name
  const pieceNameMap: Record<string, string> = {
    q: "Queen",
    r: "Rook",
    b: "Bishop",
    n: "Knight",
  };

  useEffect(() => {
    socket.on("gameStart", ({ gameId, board, turn, white }) => {
      setMatchingOpponent(false);
      setGameId(gameId);
      setBoard(board);
      setTurn(turn === "w" ? "white" : "black");

      // Interpret the turn to get our color
      if (socket.id === white) {
        setMyColor("w");
      } else {
        setMyColor("b");
      }
    });

    socket.on("gameState", ({ board, turn }) => {
      setBoard(board);
      setTurn(turn === "w" ? "white" : "black");
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

  const handleMove = (from: [number, number], to: [number, number]) => {
    if (!gameid) return;
    // get current piece in the from position
    const pieceToMoveIsPawn = board[from[0]][from[1]]?.type === "p";
    const pawnEligibleForPromotion =
      (mycolor === "w" && from[0] === 1) || (mycolor === "b" && from[0] === 6);
    if (pieceToMoveIsPawn && pawnEligibleForPromotion) {
      // Handle pawn promotion logic here
      setPromotionModalOpen(true);
      // Open Modal or similar to choose promotion piece
      setClickedCells([from, to]);
    } else {
      socket.emit("makeMove", {
        gameId: gameid,
        from: toChessNotation(from),
        to: toChessNotation(to),
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
          
          <ChessBoard
            board={board}
            playerColor={mycolor}
            turn={turn}
            onMove={handleMove}
          />
          <br/>
          <div className="flex flex-row gap-4 justify-center items-center mt-4">
            <Card className="w-25 max-w-sm text-center p-2">
              <CardHeader className="flex justify-center">
                <CardTitle className="text-center">White</CardTitle>
              </CardHeader>
              <p>{mycolor === 'w' ? (<>You</>) : (<>chessbro123</>)}</p>
            </Card>
            <p>VS</p>
            <Card className="w-25 max-w-sm text-center p-2">
              <CardHeader className="flex justify-center">
                <CardTitle className="text-center">Black</CardTitle>
              </CardHeader>
              <p>{mycolor === 'b' ? (<>You</>) : (<>chessbro123</>)}</p>
            </Card>
          </div>
          {promotionModalOpen && (
            <Dialog
              open={promotionModalOpen}
              onOpenChange={setPromotionModalOpen}
            >
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
                          socket.emit("makeMove", {
                            gameId: gameid,
                            from: toChessNotation(clickedCells[0]),
                            to: toChessNotation(clickedCells[1]),
                            promotion: type,
                          });
                          setPromotionModalOpen(false);
                        }}
                        className={`bg-white ${
                          mycolor === "b"
                            ? "hover:bg-gray-300"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <Image
                          src={`/pieces/${mycolor === 'w' ? "white" : "black"}${pieceNameMap[type]}.png`}
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
      )}
    </>
  );
}

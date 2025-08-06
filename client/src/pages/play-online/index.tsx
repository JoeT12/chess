"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import socket from "@/lib/socket";
import { UUID } from "crypto";
import ChessBoard from "@/components/ChessBoard";

export default function PlayOnline() {
  const [matchingApponent, setMatchingOpponent] = useState(false);
  const [gameid, setGameId] = useState<UUID | null>(null);
  const [board, setBoard] = useState<(string | null)[][]>([]);
  const [turn, setTurn] = useState<'white' | 'black'>('white');
  const [mycolor, setMyColor] = useState<'w' | 'b' | null>(null);

  const handleFindOpponent = () => {
    setMatchingOpponent(true);
    socket.emit("findMultiplayerGame");
  };

  useEffect(() => {
    socket.on('gameStart', ({ gameId, board, turn, white }) => {
      setMatchingOpponent(false);
      setGameId(gameId);
      setBoard(board);
      setTurn(turn === 'w' ? 'white' : 'black');

      // Interpret the turn to get our color
      if(socket.id === white) {
        setMyColor('w');
      }
      else {
        setMyColor('b');
      }
    });

    socket.on('gameState', ({ board, turn }) => {
      setBoard(board);
      setTurn(turn === 'w' ? 'white' : 'black');
    });

    return () => {
      // Player has navigated away from page...
      // Clean up socket listeners
      socket.off('findMultiplayerGame');
      socket.off('gameState');
      // Emit signal to server to end game with forfeit
      
    };
  }, []);

  // Convert board coordinates to chess notation
  function toChessNotation([row, col]: [number, number]) {
    const files = 'abcdefgh';
    return files[col] + (8 - row);
  }

  const handleMove = (from: [number, number], to: [number, number]) => {
    if (!gameid) return;
    socket.emit('makeMove', {
      gameId: gameid,
      from: toChessNotation(from),
      to: toChessNotation(to),
    });
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
          <p>You are {mycolor}</p>
          <ChessBoard board={board} playerColor={mycolor} turn={turn} onMove={handleMove} />
        </>
      )}
    </>
  );
}

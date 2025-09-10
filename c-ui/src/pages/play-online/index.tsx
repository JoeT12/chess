"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ChessBoard from "@/components/ChessBoard";
import GameOverModal from "@/components/GameOverModal";
import { useChessGame } from "@/hooks/useChessGame";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";

export default function PlayOnline() {
  const { accessToken, user, loading } = useAuth();
  const router = useRouter();
  const {
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
  } = useChessGame("multiplayer", accessToken);

  if (!user && !loading) {
    router.push("/login");
  }

  return (
    <>
      {gameId === null ? (
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

              {!matchingOpponent ? (
                <CardContent>
                  <p className="leading-7 [&:not(:first-child)]:mt-6 text-center">
                    To get matched with an opponent, please click on the button
                    below.
                  </p>
                  <Button
                    className="w-full bg-chessGreen text-white py-2 mb-3 rounded-md mt-4"
                    onClick={() => {
                      findOpponent();
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
            {/* <Card className="w-25 max-w-sm text-center p-2">
              <CardHeader className="flex justify-center">
                <CardTitle className="text-center">White</CardTitle>
              </CardHeader>
              <p>{localPlayerColor === "w" ? <>You</> : <>chessbro123</>}</p>
            </Card> */}
            <ChessBoard
              board={board}
              playerColor={localPlayerColor}
              turn={activeColor}
              onMove={makeMove}
              disabled={false} // No need to disable board - as game end modal blocks interaction.
            />
            {/* <Card className="w-25 max-w-sm text-center p-2">
              <CardHeader className="flex justify-center">
                <CardTitle className="text-center">Black</CardTitle>
              </CardHeader>
              <p>{localPlayerColor === "b" ? <>You</> : <>chessbro123</>}</p>
            </Card> */}
          </div>

          <GameOverModal
            isOpen={isOpen}
            message={message}
            onClose={() => {}}
            onClick={resetGame}
          />
        </>
      )}
    </>
  );
}

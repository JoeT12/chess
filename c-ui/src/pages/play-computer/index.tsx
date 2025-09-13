"use client";

import ChessBoard from "@/components/ChessBoard";
import { Button } from "@/components/ui/button";
import { useChessGame } from "@/hooks/useChessGame";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GameOverModal from "@/components/GameOverModal";
import ComboBox from "@/components/ComboBox";
import { useComboBox } from "@/hooks/useComboBox";
import { useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";

const AI_OPTIONS = [
  {
    value: "easy",
    label: "easy",
  },
  {
    value: "medium",
    label: "medium",
  },
  {
    value: "hard",
    label: "hard",
  },
];

export default function Play() {
  const { accessToken, user, loading } = useAuth();
  const router = useRouter();
  const {
    gameId,
    board,
    activeColor,
    localPlayerColor,
    isOpen,
    message,
    matchingOpponent,
    findOpponent,
    makeMove,
    resetGame,
    setAIDifficulty,
  } = useChessGame("single-player", accessToken);

  const { open, setOpen, value, setValue } = useComboBox();

  useEffect(() => {
    setAIDifficulty(value);
  }, [value]);

  if (!loading && !user) {
    router.push("/login");
  }

  return gameId === null ? (
    <>
      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[url('/Background.png')] bg-cover bg-center" />
      <div className="flex flex-col justify-center items-center min-h-full py-8">
        <Card className="w-full max-w-screen-md">
          <CardHeader className="flex justify-center">
            <CardTitle className="text-center">
              <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
                Play Computer/Engine
              </h1>
            </CardTitle>
          </CardHeader>

          {!matchingOpponent ? (
            <CardContent className="text-center justify-center items-center">
              <p className="leading-7 [&:not(:first-child)]:mt-6 text-center">
                To start a game against the engine, please select a difficulty
                and then click on the button below.
              </p>
              <br />
              <ComboBox
                options={AI_OPTIONS}
                isOpen={open}
                onClose={setOpen}
                value={value}
                setValue={setValue}
              ></ComboBox>
              <br />
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
      <ChessBoard
        board={board}
        playerColor={localPlayerColor}
        turn={activeColor}
        onMove={makeMove}
        disabled={false} // No need to disable board - as game end modal blocks interaction.
      />
      <GameOverModal
        isOpen={isOpen}
        message={message}
        onClose={() => {}}
        onClick={resetGame}
      />
    </>
  );
}

"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/authContext";
import { Button } from "@/components/ui/button";
import { Globe, Cpu, Newspaper } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[url('/Background.png')] bg-cover bg-center" />
      <div className="flex flex-col justify-center items-center min-h-full py-8">
        <Card className="w-full max-w-screen-md shadow-lg">
          <CardHeader className="flex justify-center">
            <CardTitle className="text-center">
              <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
                Chess
              </h1>
              {user && (
                <p className="mt-2 text-muted-foreground text-lg">
                  Welcome back, {user.email}
                </p>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {user ? (
              <>
                <p className="leading-7 [&:not(:first-child)]:mt-6 text-center">
                  Choose your mode to begin your game:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  <Button
                    size="lg"
                    className="h-28 flex flex-col items-center justify-center rounded-2xl shadow-md hover:shadow-xl transition-all"
                    onClick={() => {
                      router.push("/play-online");
                    }}
                  >
                    <Globe className="w-8 h-8 mb-2" />
                    <span className="text-lg font-semibold">Play Online</span>
                  </Button>

                  <Button
                    size="lg"
                    variant="secondary"
                    className="h-28 flex flex-col items-center justify-center rounded-2xl shadow-md hover:shadow-xl transition-all"
                    onClick={() => router.push("/play-computer")}
                  >
                    <Cpu className="w-8 h-8 mb-2" />
                    <span className="text-lg font-semibold">Play Computer</span>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="leading-7 [&:not(:first-child)]:mt-6 text-center">
                  Welcome to chess.com, where strategy meets excitement! Whether
                  you're a beginner or an experienced player, our platform
                  offers a welcoming space to challenge yourself, improve your
                  skills, and enjoy classic chess games...
                </p>
                <p className="leading-7 [&:not(:first-child)]:mt-6 text-center">
                  Please login to start playing, or use the button below to
                  browse available options.
                </p>

                <div className="grid grid-cols-1 mt-8">
                  <Button
                    size="lg"
                    className="h-28 flex flex-col items-center justify-center rounded-2xl shadow-md hover:shadow-xl transition-all"
                    onClick={() => router.push("/feed")}
                  >
                    <Newspaper className="w-8 h-8 mb-2" />
                    <span className="text-lg font-semibold">News</span>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

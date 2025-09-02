"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";

export default function Login() {
  const { login, user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setError(null);
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  if (user) {
    router.push("/");
    return null;
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[url('/Background.png')] bg-cover bg-center" />
      <div className="flex flex-col justify-center items-center min-h-full py-8">
        <Card className="w-full max-w-screen-md">
          <CardHeader className="flex justify-center">
            <CardTitle className="text-center">
              <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
                Log In
              </h1>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {error && <p className="text-red-500 text-center mb-3">{error}</p>}

            <form onSubmit={handleLogin}>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <br />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
              <button
                type="submit"
                className="w-full bg-chessGreen text-white py-2 mb-3 rounded-md"
              >
                Sign In
              </button>
            </form>

            <button
              onClick={() => router.push("/create-account")}
              className="w-full bg-lightGrey text-white py-2 mb-3 rounded-md"
            >
              Create a Free Account
            </button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

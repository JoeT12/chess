import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <>
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[url('/Background.png')] bg-cover bg-center" />
    <div className="flex flex-col justify-center items-center min-h-full py-8">
      <Card className="w-full max-w-screen-md">
        <CardHeader className="flex justify-center">
          <CardTitle className="text-center">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
              Chess
            </h1>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="leading-7 [&:not(:first-child)]:mt-6 text-center">
            Welcome to chess.com, where strategy meets excitement! Whether
            you're a beginner or an experienced player, our platform offers
            a welcoming space to challenge yourself, improve your skills,
            and enjoy classic chess games...
          </p>
          <br />
          <hr />
          <br />
          <Input type="email" placeholder="Email" />
          <br />
          <Input type="password" placeholder="Password" />
          <br />
          <button className="w-full bg-chessGreen text-white py-2 mb-3 rounded-md">
            Sign In
          </button>
          <br />
          <button className="w-full bg-lightGrey text-white py-2 mb-3 rounded-md">
            Create a Free Account
          </button>
          <br />
          <br />
        </CardContent>
      </Card>
    </div>
    </>
  );
}

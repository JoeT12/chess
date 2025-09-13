import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { config } from "../../config";

type UserDetails = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
};

export default function CreateAccount() {
  const [UserDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const Router = useRouter();

  const validateInputs = (): boolean => {
    if (!UserDetails) {
      setError("All fields are required");
      return false;
    }
    return true;
  };

  const handleCreateAccount = async () => {
    const valid = validateInputs();
    if (!valid) return;
    else setError(null);

    const res = await fetch(`${config.authServerHost}/api/user/createAccount`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(UserDetails),
      credentials: "include",
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.message || "Account creation failed");
      return;
    } else {
      toast.success("Account created successfully! Redirecting to login...");
      Router.push("/login");
    }
  };

  const setUser = (field: string, value: string) => {
    setUserDetails((prev) => ({
      ...prev!,
      [field]: value,
    }));
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[url('/Background.png')] bg-cover bg-center" />
      <div className="flex flex-col justify-center items-center min-h-full py-8">
        <Card className="w-full max-w-screen-md">
          <CardHeader className="flex justify-center">
            <CardTitle className="text-center">
              <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
                Create Account
              </h1>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {error && <p className="text-red-500 text-center mb-3">{error}</p>}

            <Input
              type="email"
              placeholder="Email"
              value={UserDetails?.email || ""}
              onChange={(e) => setUser("email", e.target.value)}
            />
            <br />
            <Input
              type="email"
              placeholder="First Name(s)"
              value={UserDetails?.firstName || ""}
              onChange={(e) => setUser("firstName", e.target.value)}
            />
            <br />
            <Input
              type="email"
              placeholder="Last Name(s)"
              value={UserDetails?.lastName || ""}
              onChange={(e) => setUser("lastName", e.target.value)}
            />
            <br />
            <Input
              type="password"
              placeholder="Password"
              value={UserDetails?.password || ""}
              onChange={(e) => setUser("password", e.target.value)}
            />
            <br />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={UserDetails?.confirmPassword || ""}
              onChange={(e) => setUser("confirmPassword", e.target.value)}
            />
            <br />
            <button
              onClick={handleCreateAccount}
              className="w-full bg-chessGreen text-white py-2 mb-3 rounded-md"
            >
              Create Account
            </button>
            <br />
            <br />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

import { NextRequest, NextResponse } from "next/server";
import { config } from "./config";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("refresh_token")?.value;

  const protectedRoutes = ["/play-online", "/play-computer"];
  const isProtected = protectedRoutes.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const res = await fetch(`${config.authServerHost}/api/auth/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

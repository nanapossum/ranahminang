import { NextResponse } from "next/server";
import { authCookieName } from "@/lib/auth/cookies";

export async function POST() {
  const response = NextResponse.json({ message: "Logout successful" });

  response.cookies.set(authCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });

  return response;
}

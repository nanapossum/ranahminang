import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { hashPasswordResetToken } from "@/lib/auth/reset-token";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    token?: string;
    password?: string;
  } | null;

  const token = String(body?.token || "");
  const password = String(body?.password || "");

  if (!token || password.length < 8) {
    return NextResponse.json(
      { message: "Reset token and a password of at least 8 characters are required" },
      { status: 400 }
    );
  }

  const tokenHash = hashPasswordResetToken(token);
  const user = await prisma.user.findFirst({
    where: {
      resetTokenHash: tokenHash,
      resetTokenExpiresAt: {
        gt: new Date()
      }
    }
  });

  if (!user) {
    return NextResponse.json({ message: "Reset link is invalid or expired" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(password),
      resetTokenHash: null,
      resetTokenExpiresAt: null
    }
  });

  return NextResponse.json({ message: "Password updated successfully" });
}

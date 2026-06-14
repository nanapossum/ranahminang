import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createPasswordResetToken } from "@/lib/auth/reset-token";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = String(body?.email || "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ message: "Enter a valid email address" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  let resetUrl: string | undefined;

  if (user) {
    const reset = createPasswordResetToken();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetTokenHash: reset.tokenHash,
        resetTokenExpiresAt: reset.expiresAt
      }
    });

    const origin = new URL(request.url).origin;
    resetUrl = `${origin}/reset-password/${reset.token}`;
  }

  return NextResponse.json({
    message: "If that email is registered, a reset link has been generated.",
    resetUrl: process.env.NODE_ENV === "production" ? undefined : resetUrl
  });
}

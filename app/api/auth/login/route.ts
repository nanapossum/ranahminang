import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authCookieName } from "@/lib/auth/cookies";
import { signSessionToken } from "@/lib/auth/jwt";
import { verifyPassword } from "@/lib/auth/password";
import { loginSchema } from "@/lib/auth/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid login data", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;
  console.log("LOGIN START", email);

  const user = await prisma.user.findUnique({
    where: { email }
  });

  console.log("USER FOUND", !!user);

  if (!user) {
    return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
  }

  const passwordIsValid = await verifyPassword(password, user.passwordHash);

  console.log("PASSWORD VALID", passwordIsValid);

  if (!passwordIsValid) {
    return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
  }

  if (user.approvalStatus === "PENDING") {
    return NextResponse.json(
      { message: "Your account is waiting for superadmin approval" },
      { status: 403 }
    );
  }

  if (user.approvalStatus === "REJECTED") {
    return NextResponse.json({ message: "Your account registration was rejected" }, { status: 403 });
  }

  console.log("ABOUT TO SIGN JWT");

  const token = signSessionToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  console.log("JWT CREATED");

  const response = NextResponse.json({
    message: "Login successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      approvalStatus: user.approvalStatus
    }
  });

  response.cookies.set(authCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return response;
}

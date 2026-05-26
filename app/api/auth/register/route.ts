import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { registerSchema } from "@/lib/auth/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid registration data", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, email, password, role } = parsed.data;
  const passwordHash = await hashPassword(password);
  const approvalStatus = role === "tourist" ? "APPROVED" : "PENDING";

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        approvalStatus
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        approvalStatus: true
      }
    });

    return NextResponse.json(
      {
        message:
          user.approvalStatus === "PENDING"
            ? "Registration submitted and waiting for superadmin approval"
            : "Registration successful",
        user
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ message: "Email is already registered" }, { status: 409 });
    }

    return NextResponse.json({ message: "Registration failed" }, { status: 500 });
  }
}

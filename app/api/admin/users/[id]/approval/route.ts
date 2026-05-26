import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { approvalSchema } from "@/lib/auth/validation";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function PATCH(request: Request, { params }: RouteContext) {
  const auth = await requireRole(["superadmin"]);

  if (auth.response) {
    return auth.response;
  }

  const userId = Number(params.id);

  if (!Number.isInteger(userId)) {
    return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = approvalSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid approval data", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { approvalStatus: parsed.data.status },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        approvalStatus: true,
        updatedAt: true
      }
    });

    return NextResponse.json({ message: "User approval status updated", user });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Failed to update user approval status" }, { status: 500 });
  }
}

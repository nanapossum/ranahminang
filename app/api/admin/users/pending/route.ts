import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireRole(["superadmin"]);

  if (auth.response) {
    return auth.response;
  }

  const users = await prisma.user.findMany({
    where: { role: "producer", approvalStatus: "PENDING" },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      approvalStatus: true,
      createdAt: true
    }
  });

  return NextResponse.json({ users });
}

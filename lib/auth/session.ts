import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/db";
import { authCookieName } from "@/lib/auth/cookies";
import { verifySessionToken } from "@/lib/auth/jwt";
import { canAccessRole } from "@/lib/auth/roles";

export async function getCurrentSession() {
  const token = cookies().get(authCookieName)?.value;

  if (!token) {
    return null;
  }

  const session = verifySessionToken(token);

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      approvalStatus: true,
      profileImage: true,
      createdAt: true
    }
  });

  if (!user || user.approvalStatus !== "APPROVED") {
    return null;
  }

  return user;
}

export async function requireRole(allowedRoles: Role[]) {
  const user = await getCurrentSession();

  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    };
  }

  if (!canAccessRole(user.role, allowedRoles)) {
    return {
      user: null,
      response: NextResponse.json({ message: "Forbidden" }, { status: 403 })
    };
  }

  return { user, response: null };
}

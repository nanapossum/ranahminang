import { jwtVerify } from "jose/jwt/verify";
import type { Role } from "@prisma/client";
import { isRole } from "@/lib/auth/roles";

export type EdgeSessionPayload = {
  userId: number;
  email: string;
  role: Role;
};

function getEncodedSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return new TextEncoder().encode(secret);
}

export async function verifyEdgeSessionToken(token: string): Promise<EdgeSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getEncodedSecret());

    if (
      typeof payload.userId === "number" &&
      typeof payload.email === "string" &&
      isRole(payload.role)
    ) {
      return {
        userId: payload.userId,
        email: payload.email,
        role: payload.role
      };
    }

    return null;
  } catch {
    return null;
  }
}

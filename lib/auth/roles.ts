import type { Role } from "@prisma/client";

export const roles = ["superadmin", "producer", "tourist"] as const;
export const selfRegisterRoles = ["producer", "tourist"] as const;

export type AppRole = (typeof roles)[number];
export type SelfRegisterRole = (typeof selfRegisterRoles)[number];

export function isRole(value: unknown): value is AppRole {
  return typeof value === "string" && roles.includes(value as AppRole);
}

export function isSelfRegisterRole(value: unknown): value is SelfRegisterRole {
  return typeof value === "string" && selfRegisterRoles.includes(value as SelfRegisterRole);
}

export function canAccessRole(userRole: Role, allowedRoles: Role[]) {
  return allowedRoles.includes(userRole);
}

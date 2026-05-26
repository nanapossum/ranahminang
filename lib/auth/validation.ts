import { z } from "zod";
import { selfRegisterRoles } from "@/lib/auth/roles";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Email must be valid").toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(selfRegisterRoles).default("tourist")
});

export const loginSchema = z.object({
  email: z.string().trim().email("Email must be valid").toLowerCase(),
  password: z.string().min(1, "Password is required")
});

export const approvalSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"])
});

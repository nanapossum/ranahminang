import { createHash, randomBytes } from "crypto";

export function createPasswordResetToken() {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashPasswordResetToken(token);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

  return { token, tokenHash, expiresAt };
}

export function hashPasswordResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

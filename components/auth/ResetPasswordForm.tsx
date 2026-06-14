"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { PasswordInput } from "@/components/auth/PasswordInput";

type ResetPasswordFormProps = {
  token: string;
};

type Status = {
  type: "idle" | "success" | "error";
  message: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        password: String(formData.get("password") || "")
      })
    });

    const data = (await response.json()) as { message?: string };
    setIsSubmitting(false);

    if (!response.ok) {
      setStatus({ type: "error", message: data.message || "Failed to update password" });
      return;
    }

    setStatus({ type: "success", message: data.message || "Password updated successfully" });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PasswordInput name="password" label="New Password" autoComplete="new-password" minLength={8} />

      {status.message ? (
        <p className={status.type === "error" ? "text-sm text-red-700" : "text-sm text-green-700"}>
          {status.message}
        </p>
      ) : null}

      {status.type === "success" ? (
        <Link href="/login" className="block text-sm font-semibold text-earth-clay transition hover:text-earth-bark">
          Continue to login
        </Link>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting || status.type === "success"}
        className="w-full rounded-md bg-earth-bark px-4 py-2 font-semibold text-earth-rice transition hover:bg-earth-clay disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}

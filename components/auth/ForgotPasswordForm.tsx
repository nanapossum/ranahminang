"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type Status = {
  type: "idle" | "success" | "error";
  message: string;
  resetUrl?: string;
};

export function ForgotPasswordForm() {
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: String(formData.get("email") || "") })
    });

    const data = (await response.json()) as { message?: string; resetUrl?: string };
    setIsSubmitting(false);

    if (!response.ok) {
      setStatus({ type: "error", message: data.message || "Failed to create reset link" });
      return;
    }

    setStatus({
      type: "success",
      message: data.message || "Reset link generated.",
      resetUrl: data.resetUrl
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-earth-bark/80">Email</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-2 w-full rounded-md border border-earth-bark/15 bg-white px-3 py-2 text-earth-bark outline-none transition focus:border-earth-clay"
        />
      </label>

      {status.message ? (
        <p className={status.type === "error" ? "text-sm text-red-700" : "text-sm text-green-700"}>
          {status.message}
        </p>
      ) : null}

      {status.resetUrl ? (
        <Link href={status.resetUrl} className="block break-all text-sm font-semibold text-earth-clay transition hover:text-earth-bark">
          Open reset link
        </Link>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-earth-bark px-4 py-2 font-semibold text-earth-rice transition hover:bg-earth-clay disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Generating..." : "Generate Reset Link"}
      </button>
    </form>
  );
}

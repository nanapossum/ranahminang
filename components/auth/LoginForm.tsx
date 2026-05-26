"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Status = {
  type: "idle" | "success" | "error";
  message: string;
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || "")
    };

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = (await response.json()) as { message?: string };

    setIsSubmitting(false);

    if (!response.ok) {
      setStatus({ type: "error", message: data.message || "Login failed" });
      return;
    }

    const nextPath = searchParams.get("next") || "/";
    router.push(nextPath);
    router.refresh();
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

      <label className="block">
        <span className="text-sm font-medium text-earth-bark/80">Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full rounded-md border border-earth-bark/15 bg-white px-3 py-2 text-earth-bark outline-none transition focus:border-earth-clay"
        />
      </label>

      {status.message ? (
        <p className={status.type === "error" ? "text-sm text-red-700" : "text-sm text-green-700"}>
          {status.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-earth-bark px-4 py-2 font-semibold text-earth-rice transition hover:bg-earth-clay disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PasswordInput } from "@/components/auth/PasswordInput";

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

    const data = (await response.json()) as {
      message?: string;
      user?: { role?: "superadmin" | "producer" | "tourist" };
    };

    setIsSubmitting(false);

    if (!response.ok) {
      setStatus({ type: "error", message: data.message || "Login failed" });
      return;
    }

    const roleHome =
      data.user?.role === "superadmin"
        ? "/dashboard/admin"
        : data.user?.role
          ? `/dashboard/${data.user.role}`
          : "/";
    const nextPath = searchParams.get("next") || roleHome;
    window.dispatchEvent(new Event("ranahminang:auth-changed"));
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

      <PasswordInput name="password" label="Password" autoComplete="current-password" />

      <div className="text-right">
        <Link href="/forgot-password" className="text-sm font-semibold text-earth-clay transition hover:text-earth-bark">
          Forgot Password?
        </Link>
      </div>

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

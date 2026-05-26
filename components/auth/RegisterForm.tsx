"use client";

import { FormEvent, useState } from "react";

type Status = {
  type: "idle" | "success" | "error";
  message: string;
};

export function RegisterForm() {
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      role: String(formData.get("role") || "tourist")
    };

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = (await response.json()) as { message?: string };

    setIsSubmitting(false);

    if (!response.ok) {
      setStatus({ type: "error", message: data.message || "Registration failed" });
      return;
    }

    form.reset();
    setStatus({ type: "success", message: data.message || "Registration successful" });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-earth-bark/80">Name</span>
        <input
          name="name"
          type="text"
          autoComplete="name"
          required
          className="mt-2 w-full rounded-md border border-earth-bark/15 bg-white px-3 py-2 text-earth-bark outline-none transition focus:border-earth-clay"
        />
      </label>

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
          autoComplete="new-password"
          minLength={8}
          required
          className="mt-2 w-full rounded-md border border-earth-bark/15 bg-white px-3 py-2 text-earth-bark outline-none transition focus:border-earth-clay"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-earth-bark/80">Role</span>
        <select
          name="role"
          defaultValue="tourist"
          className="mt-2 w-full rounded-md border border-earth-bark/15 bg-white px-3 py-2 text-earth-bark outline-none transition focus:border-earth-clay"
        >
          <option value="tourist">Tourist</option>
          <option value="producer">Producer</option>
        </select>
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
        {isSubmitting ? "Registering..." : "Register"}
      </button>
    </form>
  );
}

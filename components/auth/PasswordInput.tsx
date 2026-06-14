"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = {
  name: string;
  label: string;
  autoComplete: string;
  minLength?: number;
};

export function PasswordInput({ name, label, autoComplete, minLength }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label className="block">
      <span className="text-sm font-medium text-earth-bark/80">{label}</span>
      <div className="mt-2 flex rounded-md border border-earth-bark/15 bg-white transition focus-within:border-earth-clay">
        <input
          name={name}
          type={isVisible ? "text" : "password"}
          autoComplete={autoComplete}
          minLength={minLength}
          required
          className="min-w-0 flex-1 rounded-md bg-transparent px-3 py-2 text-earth-bark outline-none"
        />
        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          className="inline-flex w-11 items-center justify-center text-earth-bark/65 transition hover:text-earth-clay"
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      </div>
    </label>
  );
}

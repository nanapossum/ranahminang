"use client";

import React, { useState, useRef } from "react";
import { SafeImage } from "@/components/SafeImage";
import { User, Mail, ShieldAlert, Calendar, Camera, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

type UserProfile = {
  id: number;
  name: string;
  email: string;
  role: string;
  profileImage: string | null;
  createdAt: Date;
};

type ProfileFormProps = {
  user: UserProfile;
};

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(user.name);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.profileImage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Only JPG, PNG, and WEBP formats are allowed");
      return;
    }

    // Validate size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("Image must be smaller than 2MB");
      return;
    }

    setErrorMessage("");
    setProfileImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3) {
      setErrorMessage("Username must be at least 3 characters");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setSuccessMessage("Your profile has been updated successfully!");
      
      // Dispatch custom event to notify components like Navbar of auth changes
      window.dispatchEvent(new Event("ranahminang:auth-changed"));
      
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format joined date
  const joinedDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(user.createdAt));

  // Role translation/styling
  const roleDisplay: Record<string, { label: string; bg: string; text: string }> = {
    superadmin: { label: "Super Admin", bg: "bg-red-500/10", text: "text-red-700" },
    producer: { label: "Tourism Producer", bg: "bg-emerald-600/10", text: "text-emerald-700" },
    tourist: { label: "Explorer / Tourist", bg: "bg-amber-500/10", text: "text-amber-700" }
  };

  const currentRole = roleDisplay[user.role] || { label: user.role, bg: "bg-stone-100", text: "text-stone-700" };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-soft lg:grid lg:grid-cols-[0.8fr_1.2fr]">
        
        {/* Left Side: Avatar Card */}
        <section className="flex flex-col items-center justify-center border-b border-stone-100 bg-gradient-to-br from-green-50/50 via-white to-amber-50/30 p-8 text-center lg:border-b-0 lg:border-r">
          <div className="relative group cursor-pointer" onClick={triggerFileInput}>
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-stone-100 shadow-md transition duration-300 group-hover:opacity-90">
              {previewUrl ? (
                <SafeImage
                  src={previewUrl}
                  alt={user.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                  priority
                  fallback={
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-700 to-emerald-800 text-4xl font-extrabold text-white">
                      {name.charAt(0).toUpperCase()}
                    </div>
                  }
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-700 to-emerald-800 text-4xl font-extrabold text-white">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <button
              type="button"
              className="absolute bottom-0 right-0 rounded-full bg-green-700 p-2 text-white shadow transition hover:bg-green-800"
              aria-label="Upload photo"
            >
              <Camera size={16} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <h2 className="mt-5 font-serif text-2xl font-bold text-stone-900">{user.name}</h2>
          <p className="mt-1 text-sm text-stone-500">{user.email}</p>

          <div className="mt-4 flex flex-col gap-2 w-full">
            <span className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${currentRole.bg} ${currentRole.text}`}>
              <ShieldAlert size={13} />
              {currentRole.label}
            </span>
            <span className="inline-flex items-center justify-center gap-1.5 text-xs text-stone-500">
              <Calendar size={13} />
              Joined {joinedDate}
            </span>
          </div>
        </section>

        {/* Right Side: Edit Form */}
        <section className="p-8">
          <h3 className="font-serif text-xl font-bold text-stone-900">Profile Settings</h3>
          <p className="mt-1 text-sm text-stone-500">Update your account name and profile picture.</p>

          {successMessage && (
            <div className="mt-6 flex items-start gap-2.5 rounded-lg bg-green-50 p-4 text-sm text-green-800 border border-green-200">
              <CheckCircle2 className="mt-0.5 shrink-0 text-green-600" size={18} />
              <p>{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="mt-6 flex items-start gap-2.5 rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-200">
              <ShieldAlert className="mt-0.5 shrink-0 text-red-600" size={18} />
              <p>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-stone-700">
                Display Name
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="text-stone-400" size={18} aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={3}
                  className="block w-full rounded-md border border-stone-300 py-2.5 pl-10 pr-4 text-sm text-stone-900 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-stone-600">
                Email Address
              </label>
              <div className="relative mt-2 rounded-md bg-stone-50 shadow-sm cursor-not-allowed">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="text-stone-400" size={18} aria-hidden="true" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={user.email}
                  disabled
                  className="block w-full rounded-md border border-stone-200 bg-stone-50/50 py-2.5 pl-10 pr-4 text-sm text-stone-500 cursor-not-allowed"
                />
              </div>
              <p className="mt-1.5 text-xs text-stone-400">Email addresses are verified and cannot be edited.</p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => {
                  setName(user.name);
                  setPreviewUrl(user.profileImage);
                  setProfileImageFile(null);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                disabled={isSubmitting}
                className="rounded-md border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-md bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-green-800 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                {isSubmitting ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

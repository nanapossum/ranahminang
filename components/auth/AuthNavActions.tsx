"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, LogIn, LogOut, UserPlus, User } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Role } from "@prisma/client";
import { SafeImage } from "@/components/SafeImage";

type AuthUser = {
  id: number;
  name: string;
  role: Role;
  approved: boolean;
  profileImage: string | null;
};

const dashboardHref: Record<Role, string> = {
  producer: "/dashboard/producer",
  tourist: "/dashboard/tourist",
  superadmin: "/dashboard/admin"
};

const outlineClass =
  "inline-flex h-9 items-center gap-2 rounded-md border border-earth-bark/15 px-3 text-sm font-semibold text-earth-bark transition hover:border-earth-clay hover:text-earth-clay";

const solidClass =
  "inline-flex h-9 items-center gap-2 rounded-md bg-earth-bark px-3 text-sm font-semibold text-earth-rice transition hover:bg-earth-clay";

export function AuthNavActions() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const loadSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store"
      });

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = (await response.json()) as { user?: AuthUser | null };
      setUser(data.user?.approved ? data.user : null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();

    function handleAuthChange() {
      setIsLoading(true);
      loadSession();
    }

    window.addEventListener("ranahminang:auth-changed", handleAuthChange);

    return () => {
      window.removeEventListener("ranahminang:auth-changed", handleAuthChange);
    };
  }, [loadSession]);

  useEffect(() => {
    window.addEventListener("focus", loadSession);

    return () => {
      window.removeEventListener("focus", loadSession);
    };
  }, [loadSession]);

  async function handleLogout() {
    setIsLoggingOut(true);
 
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
    } finally {
      setUser(null);
      setIsLoggingOut(false);
      window.dispatchEvent(new Event("ranahminang:auth-changed"));
      router.push("/");
      router.refresh();
    }
  }

  if (isLoading) {
    return (
      <div className="order-2 flex items-center gap-2 md:order-3" aria-label="Checking session">
        <span className="h-9 w-10 rounded-md border border-earth-bark/10 bg-earth-bark/5 sm:w-20" />
        <span className="h-9 w-10 rounded-md bg-earth-bark/10 sm:w-24" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="order-2 flex items-center gap-2 md:order-3">
        <Link 
          href="/profile" 
          className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-earth-bark/15 bg-white shadow-sm transition hover:border-earth-clay"
          title="View profile"
        >
          {user.profileImage ? (
            <SafeImage
              src={user.profileImage}
              alt={user.name}
              width={36}
              height={36}
              className="h-full w-full object-cover"
              fallback={
                <span className="flex h-full w-full items-center justify-center bg-green-800 text-sm font-bold text-white uppercase">
                  {user.name.charAt(0)}
                </span>
              }
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-green-800 text-sm font-bold text-white uppercase">
              {user.name.charAt(0)}
            </span>
          )}
        </Link>
        <Link 
          href={dashboardHref[user.role]} 
          className="inline-flex h-9 items-center gap-2 rounded-md bg-green-800 px-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
        >
          <LayoutDashboard size={16} aria-hidden="true" />
          <span className="hidden sm:inline">
            {user.role === "superadmin" ? "Admin Dashboard" : user.role === "producer" ? "Producer Dashboard" : "Tourist Dashboard"}
          </span>
        </Link>
        <button type="button" onClick={handleLogout} disabled={isLoggingOut} className={solidClass}>
          <LogOut size={16} aria-hidden="true" />
          <span className="hidden sm:inline">{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="order-2 flex items-center gap-2 md:order-3">
      <Link href="/login" className={outlineClass}>
        <LogIn size={16} aria-hidden="true" />
        <span className="hidden sm:inline">Login</span>
      </Link>
      <Link href="/register" className={solidClass}>
        <UserPlus size={16} aria-hidden="true" />
        <span className="hidden sm:inline">Register</span>
      </Link>
    </div>
  );
}

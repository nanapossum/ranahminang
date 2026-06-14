import Link from "next/link";
import { MapPin } from "lucide-react";
import { AuthNavActions } from "@/components/auth/AuthNavActions";

const navItems = [
  { href: "/#luhak", label: "Luhak" },
  { href: "/#map", label: "Map" },
  { href: "/#destinations", label: "Destinations" },
  { href: "/articles", label: "Articles" },
  { href: "/#culture", label: "Culture" },
  { href: "/#history", label: "History" }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-earth-bark/10 bg-earth-rice/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-earth-bark">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-earth-bark text-earth-rice">
            <MapPin size={18} aria-hidden="true" />
          </span>
          <span>RanahMinang</span>
        </Link>

        <div className="order-3 flex w-full items-center gap-4 overflow-x-auto pb-1 text-sm font-medium text-earth-bark/75 md:order-2 md:w-auto md:gap-6 md:overflow-visible md:pb-0">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="shrink-0 transition hover:text-earth-clay">
              {item.label}
            </a>
          ))}
        </div>

        <AuthNavActions />
      </nav>
    </header>
  );
}

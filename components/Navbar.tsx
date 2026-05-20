import Link from "next/link";
import { MapPin } from "lucide-react";

const navItems = [
  { href: "#luhak", label: "Luhak" },
  { href: "#map", label: "Map" },
  { href: "#culture", label: "Culture" },
  { href: "#history", label: "History" }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-earth-bark/10 bg-earth-rice/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-earth-bark">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-earth-bark text-earth-rice">
            <MapPin size={18} aria-hidden="true" />
          </span>
          <span>RanahMinang</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium text-earth-bark/75 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-earth-clay">
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}

import Link from "next/link";
import type { Role } from "@prisma/client";
import { Navbar } from "@/components/Navbar";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import {
  BookOpenText,
  ClipboardCheck,
  Compass,
  MapPinned,
  Upload,
  FileText
} from "lucide-react";

type DashboardShellProps = {
  role: Role;
  name: string;
  title: string;
  description: string;
  activeTab?: string;
  children?: React.ReactNode;
};

const roleFeatures: Record<Role, Array<{ href: string; label: string; description: string; icon: typeof Upload }>> = {
  tourist: [
    {
      href: "/#destinations",
      label: "Explore Destinations",
      description: "Browse live destinations, weather snippets, and cultural places across the platform.",
      icon: Compass
    },
    {
      href: "/dashboard/tourist/bookmarks",
      label: "Bookmarked Destinations",
      description: "View and manage the destinations you've bookmarked for later reference.",
      icon: MapPinned
    }
  ],
  producer: [
    {
      href: "/dashboard/producer",
      label: "Upload Destinations",
      description: "Create, review, and maintain your published tourism destination entries.",
      icon: Upload
    },
    {
      href: "/dashboard/producer/articles",
      label: "Article Management",
      description: "Write, edit, and publish cultural studies, folklore, or history essays.",
      icon: FileText
    },
    {
      href: "/#culture",
      label: "Culture Exchange",
      description: "Connect producer knowledge with public cultural encyclopedia content.",
      icon: BookOpenText
    }
  ],
  superadmin: [
    {
      href: "/dashboard/admin/pending-users",
      label: "Pending Producer Users",
      description: "Approve producer accounts before they enter operational dashboards.",
      icon: ClipboardCheck
    },
    {
      href: "/dashboard/admin/destinations",
      label: "Destination Moderation",
      description: "Edit or remove producer-submitted tourism destinations.",
      icon: Compass
    },
    {
      href: "/dashboard/admin/articles",
      label: "Article Moderation",
      description: "Approve, edit, or remove cultural essays published across the platform.",
      icon: FileText
    }
  ]
};

export function DashboardShell({ role, name, title, description, activeTab, children }: DashboardShellProps) {
  const features = roleFeatures[role];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-earth-rice px-4 py-8 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-7xl">
          {/* Header Card */}
          <div className="rounded-lg border border-earth-bark/10 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-earth-clay">
              {role === "superadmin" ? "Admin" : role} Dashboard
            </p>
            <h1 className="mt-2 font-serif text-3xl font-bold text-earth-bark">{title}</h1>
            <p className="mt-2.5 max-w-3xl text-sm leading-6 text-earth-ink/75">
              {description} Signed in as <span className="font-semibold text-earth-bark">{name}</span>.
            </p>
          </div>

          {/* Sub Navigation if admin */}
          {role === "superadmin" && activeTab && (
            <AdminSubNav activeTab={activeTab} />
          )}

          {/* Body Content */}
          <div className="mt-6">
            {children ? (
              children
            ) : (
              <section className="rounded-lg border border-earth-bark/10 bg-white p-6 shadow-sm">
                <h2 className="font-serif text-xl font-bold text-earth-bark">Dashboard Actions</h2>
                <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {features.map((feature) => {
                    const Icon = feature.icon;

                    return (
                      <Link
                        key={feature.label}
                        href={feature.href}
                        className="rounded-lg border border-earth-bark/10 p-5 transition-all hover:-translate-y-1 hover:border-earth-clay hover:shadow-soft"
                      >
                        <Icon className="text-earth-moss" size={24} aria-hidden="true" />
                        <h3 className="mt-4 font-serif text-lg font-bold text-earth-bark">{feature.label}</h3>
                        <p className="mt-2 text-xs leading-6 text-earth-ink/65">{feature.description}</p>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

import { redirect } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { ClipboardCheck, Compass, FileText, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SuperadminDashboardPage() {
  const user = await getCurrentSession();

  if (!user) {
    redirect("/login?next=/superadmin");
  }

  if (user.role !== "superadmin") {
    redirect("/");
  }

  const [pendingCount, destinationsCount, articlesCount] = await Promise.all([
    prisma.user.count({
      where: { role: "producer", approvalStatus: "PENDING" }
    }),
    prisma.destination.count(),
    prisma.article.count()
  ]);

  const stats = [
    {
      label: "Pending Producers",
      count: pendingCount,
      description: "Approve or reject new tourism producer registration requests.",
      href: "/dashboard/admin/pending-users",
      icon: ClipboardCheck,
      color: "text-amber-700 bg-amber-50 border-amber-100",
      cta: "Review requests"
    },
    {
      label: "Total Destinations",
      count: destinationsCount,
      description: "Manage and moderate tourism spots uploaded by producers.",
      href: "/dashboard/admin/destinations",
      icon: Compass,
      color: "text-green-700 bg-green-50 border-green-100",
      cta: "Moderate spots"
    },
    {
      label: "Cultural Articles",
      count: articlesCount,
      description: "Review cultural studies and folklore narratives written for the platform.",
      href: "/dashboard/admin/articles",
      icon: FileText,
      color: "text-blue-700 bg-blue-50 border-blue-100",
      cta: "Moderate articles"
    }
  ];

  return (
    <DashboardShell
      role={user.role}
      name={user.name}
      title="Admin Dashboard"
      description="Superadmin operations panel to approve new producers, edit destinations, and review cultural articles."
      activeTab="overview"
    >
      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div 
                key={stat.label} 
                className="flex flex-col justify-between overflow-hidden rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:shadow-soft"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">{stat.label}</span>
                    <span className={`flex h-10 w-10 items-center justify-center rounded-lg border ${stat.color}`}>
                      <Icon size={20} />
                    </span>
                  </div>
                  <p className="mt-4 font-serif text-4xl font-extrabold text-stone-900">{stat.count}</p>
                  <p className="mt-2 text-xs leading-5 text-stone-600">{stat.description}</p>
                </div>
                <div className="mt-6 border-t border-stone-100 pt-4">
                  <Link
                    href={stat.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 hover:text-green-800 transition"
                  >
                    {stat.cta}
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}

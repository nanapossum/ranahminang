import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Compass, FileText } from "lucide-react";
import { ProducerDestinationList } from "@/components/producer/ProducerDestinationList";
import { ProducerArticleList } from "@/components/producer/ProducerArticleList";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function ProducerDashboardPage({
  searchParams
}: {
  searchParams: { tab?: string };
}) {
  const user = await getCurrentSession();

  if (!user) {
    redirect("/login?next=/dashboard/producer");
  }

  if (user.role !== "producer") {
    redirect("/");
  }

  const activeTab = searchParams.tab === "articles" ? "articles" : "destinations";

  const [destinations, articles] = await Promise.all([
    prisma.destination.findMany({
      where: { createdBy: user.id },
      orderBy: { createdAt: "desc" }
    }),
    prisma.article.findMany({
      where: { createdBy: user.id },
      orderBy: { createdAt: "desc" }
    })
  ]);

  return (
    <DashboardShell
      role={user.role}
      name={user.name}
      title="Producer Dashboard"
      description="Manage your published destinations and cultural articles about Minangkabau tourism."
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Destinations Stat */}
          <Link
            href="/dashboard/producer?tab=destinations"
            className={`flex items-center justify-between rounded-xl border p-5 shadow-sm transition hover:shadow-soft bg-white ${
              activeTab === "destinations" ? "border-green-750 ring-1 ring-green-700" : "border-stone-250"
            }`}
          >
            <div>
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Your Destinations</span>
              <p className="mt-2 font-serif text-3xl font-bold text-stone-900">{destinations.length}</p>
            </div>
            <span className={`flex h-12 w-12 items-center justify-center rounded-lg border ${
              activeTab === "destinations" ? "text-green-700 bg-green-50 border-green-200" : "text-stone-500 bg-stone-50 border-stone-200"
            }`}>
              <Compass size={24} />
            </span>
          </Link>

          {/* Articles Stat */}
          <Link
            href="/dashboard/producer?tab=articles"
            className={`flex items-center justify-between rounded-xl border p-5 shadow-sm transition hover:shadow-soft bg-white ${
              activeTab === "articles" ? "border-green-750 ring-1 ring-green-700" : "border-stone-250"
            }`}
          >
            <div>
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Your Articles</span>
              <p className="mt-2 font-serif text-3xl font-bold text-stone-900">{articles.length}</p>
            </div>
            <span className={`flex h-12 w-12 items-center justify-center rounded-lg border ${
              activeTab === "articles" ? "text-green-700 bg-green-50 border-green-200" : "text-stone-500 bg-stone-50 border-stone-200"
            }`}>
              <FileText size={24} />
            </span>
          </Link>
        </div>

        {/* Tab Content Container */}
        <div className="rounded-xl border border-earth-bark/10 bg-white p-6 shadow-sm">
          {/* Tab Selector Headers */}
          <div className="flex border-b border-stone-100 pb-3 gap-6">
            <Link
              href="/dashboard/producer?tab=destinations"
              className={`text-sm font-semibold border-b-2 pb-3 -mb-[14px] transition-all duration-200 ${
                activeTab === "destinations"
                  ? "border-green-700 text-green-700 font-bold"
                  : "border-transparent text-stone-500 hover:text-green-700"
              }`}
            >
              Destinations
            </Link>
            <Link
              href="/dashboard/producer?tab=articles"
              className={`text-sm font-semibold border-b-2 pb-3 -mb-[14px] transition-all duration-200 ${
                activeTab === "articles"
                  ? "border-green-700 text-green-700 font-bold"
                  : "border-transparent text-stone-500 hover:text-green-700"
              }`}
            >
              Articles
            </Link>
          </div>

          {/* Active Tab Panel */}
          <div className="mt-6">
            {activeTab === "destinations" ? (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-stone-900">Manage Destinations</h2>
                    <p className="text-xs text-stone-500">Edit or delete your uploaded tourist destinations.</p>
                  </div>
                  <Link
                    href="/dashboard/producer/create"
                    className="inline-flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-green-800"
                  >
                    <Plus size={14} />
                    Add Destination
                  </Link>
                </div>
                <ProducerDestinationList
                  destinations={destinations.map((d) => ({
                    id: d.id,
                    title: d.title,
                    description: d.description,
                    image: d.image,
                    location: d.location,
                    category: d.category,
                    latitude: d.latitude,
                    longitude: d.longitude,
                    createdBy: d.createdBy,
                    createdAt: d.createdAt.toISOString()
                  }))}
                />
              </div>
            ) : (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-stone-900">Manage Articles</h2>
                    <p className="text-xs text-stone-500">Edit or delete your cultural narratives and essays.</p>
                  </div>
                  <Link
                    href="/dashboard/producer/articles/create"
                    className="inline-flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-green-800"
                  >
                    <Plus size={14} />
                    Write Article
                  </Link>
                </div>
                <ProducerArticleList
                  articles={articles.map((a) => ({
                    id: a.id,
                    title: a.title,
                    category: a.category,
                    image: a.image,
                    createdAt: a.createdAt.toISOString()
                  }))}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

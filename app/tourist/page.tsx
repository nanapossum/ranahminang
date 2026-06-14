import { redirect } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { BookmarkedDestinationsGrid } from "@/components/dashboard/BookmarkedDestinationsGrid";
import { Compass } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TouristDashboardPage() {
  const user = await getCurrentSession();

  if (!user) {
    redirect("/login?next=/tourist");
  }

  if (user.role !== "tourist") {
    redirect("/");
  }

  const bookmarks = await (prisma as any).bookmark.findMany({
    where: { userId: user.id },
    include: {
      destination: {
        select: {
          id: true,
          title: true,
          description: true,
          image: true,
          location: true,
          category: true,
          latitude: true,
          longitude: true,
          creator: {
            select: {
              name: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <DashboardShell
      role={user.role}
      name={user.name}
      title="Tourist Dashboard"
      description="View your saved landmarks, plan your upcoming travels, and explore cultural destinations."
    >
      <section className="rounded-lg border border-earth-bark/10 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-xl font-bold text-earth-bark">Your Bookmarked Destinations</h2>
        <p className="mt-1.5 text-xs text-earth-ink/70">
          {bookmarks.length === 0
            ? "You haven't bookmarked any destinations yet."
            : `You have saved ${bookmarks.length} destination${bookmarks.length === 1 ? "" : "s"} for your next trip.`}
        </p>

        <div className="mt-6">
          {bookmarks.length === 0 ? (
            <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50/50 p-12 text-center">
              <Compass className="mx-auto text-stone-400 mb-4" size={44} aria-hidden="true" />
              <p className="text-sm font-semibold text-stone-850">No bookmarks yet</p>
              <p className="mt-1 text-xs text-stone-500">Explore tourism spots across West Sumatra and save your favorites.</p>
              <Link
                href="/#destinations"
                className="mt-5 inline-flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-800"
              >
                Explore Destinations
              </Link>
            </div>
          ) : (
            <BookmarkedDestinationsGrid
              items={bookmarks.map(({ destination }: { destination: any }) => ({
                id: destination.id,
                title: destination.title,
                description: destination.description,
                image: destination.image,
                location: destination.location,
                category: destination.category,
                latitude: destination.latitude,
                longitude: destination.longitude,
                creatorName: destination.creator.name
              }))}
            />
          )}
        </div>
      </section>
    </DashboardShell>
  );
}

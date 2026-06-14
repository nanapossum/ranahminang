import { redirect } from "next/navigation";
import { AdminDestinationManager } from "@/components/admin/AdminDestinationManager";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminDestinationsPage() {
  const user = await getCurrentSession();

  if (!user) {
    redirect("/login?next=/dashboard/admin/destinations");
  }

  if (user.role !== "superadmin") {
    redirect("/");
  }

  const destinations = await prisma.destination.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      creator: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  return (
    <DashboardShell
      role={user.role}
      name={user.name}
      title="Destination Moderation"
      description="Review, edit, and remove tourism destinations submitted by producers."
      activeTab="destinations"
    >
      <AdminDestinationManager
        destinations={destinations.map((destination) => ({
          id: destination.id,
          title: destination.title,
          description: destination.description,
          image: destination.image,
          location: destination.location,
          category: destination.category,
          createdAt: destination.createdAt.toISOString(),
          creator: destination.creator
        }))}
      />
    </DashboardShell>
  );
}

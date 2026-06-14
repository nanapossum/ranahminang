import { redirect } from "next/navigation";
import { PendingUsersManager } from "@/components/admin/PendingUsersManager";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function PendingUsersPage() {
  const user = await getCurrentSession();

  if (!user) {
    redirect("/login?next=/dashboard/admin/pending-users");
  }

  if (user.role !== "superadmin") {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    where: { role: "producer", approvalStatus: "PENDING" },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      approvalStatus: true,
      createdAt: true
    }
  });

  return (
    <DashboardShell
      role={user.role}
      name={user.name}
      title="Pending Producer Users"
      description="Approve producer registrations before they can access producer dashboard workflows."
      activeTab="producers"
    >
      <PendingUsersManager
        initialUsers={users.map((pendingUser) => ({
          ...pendingUser,
          createdAt: pendingUser.createdAt.toISOString()
        }))}
      />
    </DashboardShell>
  );
}

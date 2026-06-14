import { redirect } from "next/navigation";
import { AdminArticleList } from "@/components/admin/AdminArticleList";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminArticlesDashboard() {
  const user = await getCurrentSession();

  if (!user) {
    redirect("/login?next=/dashboard/admin/articles");
  }

  if (user.role !== "superadmin") {
    redirect("/");
  }

  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      creator: {
        select: {
          name: true
        }
      }
    }
  });

  return (
    <DashboardShell
      role={user.role}
      name={user.name}
      title="Article Moderation"
      description="Review, edit, publish, and delete any cultural studies or historical articles submitted across the platform."
      activeTab="articles"
    >
      <AdminArticleList
        articles={articles.map((a) => ({
          id: a.id,
          title: a.title,
          category: a.category,
          image: a.image,
          createdAt: a.createdAt.toISOString(),
          creatorName: a.creator.name
        }))}
      />
    </DashboardShell>
  );
}

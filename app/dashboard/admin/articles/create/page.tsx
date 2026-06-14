import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { ArticleForm } from "@/components/articles/ArticleForm";

export const dynamic = "force-dynamic";

export default async function AdminCreateArticlePage() {
  const user = await getCurrentSession();

  if (!user) {
    redirect("/login?next=/dashboard/admin/articles/create");
  }

  if (user.role !== "superadmin") {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-earth-rice px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-4xl">
        <div className="rounded-lg border border-earth-bark/10 bg-white p-6 shadow-sm mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-earth-clay">admin write</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-earth-bark">Write Platform Article</h1>
          <p className="mt-3 text-sm leading-7 text-earth-ink/70">
            Publish a high-visibility essay or editorial content directly onto the public platform homepage.
          </p>
        </div>

        <ArticleForm
          mode="create"
          redirectPath="/dashboard/admin/articles"
        />
      </section>
    </main>
  );
}

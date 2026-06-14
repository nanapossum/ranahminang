import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { ArticleForm } from "@/components/articles/ArticleForm";

export const dynamic = "force-dynamic";

export default async function ProducerCreateArticlePage() {
  const user = await getCurrentSession();

  if (!user) {
    redirect("/login?next=/dashboard/producer/articles/create");
  }

  if (user.role !== "producer") {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-earth-rice px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-4xl">
        <div className="rounded-lg border border-earth-bark/10 bg-white p-6 shadow-sm mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-earth-clay">new article</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-earth-bark">Write Cultural Essay</h1>
          <p className="mt-3 text-sm leading-7 text-earth-ink/70">
            Publish an essay, study, or documentation on Minangkabau historical events or cultural practices.
          </p>
        </div>

        <ArticleForm 
          mode="create" 
          redirectPath="/dashboard/producer/articles" 
        />
      </section>
    </main>
  );
}

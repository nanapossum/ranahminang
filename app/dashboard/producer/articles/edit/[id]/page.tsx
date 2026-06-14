import { redirect, notFound } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { ArticleForm } from "@/components/articles/ArticleForm";

type EditArticlePageProps = {
  params: {
    id: string;
  };
};

export const dynamic = "force-dynamic";

export default async function ProducerEditArticlePage({ params }: EditArticlePageProps) {
  const user = await getCurrentSession();

  if (!user) {
    redirect(`/login?next=/dashboard/producer/articles/edit/${params.id}`);
  }

  if (user.role !== "producer") {
    redirect("/");
  }

  const article = await prisma.article.findUnique({
    where: { id: params.id }
  });

  if (!article) {
    notFound();
  }

  // Ensure producer owns the article
  if (article.createdBy !== user.id) {
    redirect("/dashboard/producer/articles");
  }

  return (
    <main className="min-h-screen bg-earth-rice px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-4xl">
        <div className="rounded-lg border border-earth-bark/10 bg-white p-6 shadow-sm mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-earth-clay">edit article</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-earth-bark">Edit Cultural Essay</h1>
          <p className="mt-3 text-sm leading-7 text-earth-ink/70">
            Modify the content or update the image cover of your published article.
          </p>
        </div>

        <ArticleForm
          mode="edit"
          initialData={{
            id: article.id,
            title: article.title,
            content: article.content,
            category: article.category,
            image: article.image
          }}
          redirectPath="/dashboard/producer/articles"
        />
      </section>
    </main>
  );
}

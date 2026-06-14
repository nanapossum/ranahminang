import React from "react";
import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft, User, Calendar, BookOpen, Clock } from "lucide-react";

type ArticleDetailPageProps = {
  params: {
    id: string;
  };
};

export const dynamic = "force-dynamic";

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const article = await prisma.article.findUnique({
    where: { id: params.id },
    include: {
      creator: {
        select: {
          name: true,
          profileImage: true
        }
      }
    }
  });

  if (!article) {
    notFound();
  }

  // Calculate reading time (roughly 200 words per minute)
  const wordCount = article.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(wordCount / 200));

  // Format publish date
  const publishDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(article.createdAt));

  // Fetch 3 related articles from same category, excluding current one
  const related = await prisma.article.findMany({
    where: {
      category: article.category,
      id: { not: article.id }
    },
    take: 3,
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
    <>
      <Navbar />
      <main className="min-h-screen bg-stone-50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          {/* Back button */}
          <div className="mb-8">
            <Link 
              href="/articles"
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition hover:text-stone-900"
            >
              <ArrowLeft size={16} />
              Back to articles
            </Link>
          </div>

          <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-soft">
            {/* Hero Image */}
            <div className="relative aspect-[21/9] w-full overflow-hidden bg-stone-100 border-b">
              <SafeImage
                src={article.image}
                alt=""
                fill
                priority
                className="object-cover"
                fallback={
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-900 to-emerald-800">
                    <BookOpen className="text-white/35" size={48} />
                  </div>
                }
              />
            </div>

            {/* Content Container */}
            <div className="px-6 py-10 sm:p-10 lg:p-12">
              
              {/* Category Badging */}
              <span className="inline-flex rounded-full bg-green-700/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-green-800">
                {article.category}
              </span>

              {/* Title */}
              <h1 className="mt-4 font-serif text-3xl font-extrabold leading-tight text-stone-900 sm:text-4xl lg:text-5xl">
                {article.title}
              </h1>

              {/* Author & Date Metadata */}
              <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-stone-100 py-4 text-sm text-stone-600">
                <div className="flex items-center gap-2">
                  <div className="relative h-8 w-8 overflow-hidden rounded-full border bg-stone-100">
                    <SafeImage
                      src={article.creator.profileImage}
                      alt=""
                      fill
                      sizes="32px"
                      className="object-cover"
                      fallback={
                        <div className="flex h-full w-full items-center justify-center bg-green-800 text-xs font-bold text-white uppercase">
                          {article.creator.name.charAt(0)}
                        </div>
                      }
                    />
                  </div>
                  <span className="font-semibold text-stone-900">{article.creator.name}</span>
                </div>
                
                <span className="hidden text-stone-300 sm:inline">|</span>
                
                <span className="flex items-center gap-1">
                  <Calendar size={15} />
                  Published {publishDate}
                </span>

                <span className="hidden text-stone-300 sm:inline">|</span>

                <span className="flex items-center gap-1">
                  <Clock size={15} />
                  {readingTime} min read ({wordCount} words)
                </span>
              </div>

              {/* Main Body */}
              <div className="mt-8 font-sans text-stone-850 text-base sm:text-lg leading-relaxed whitespace-pre-line space-y-6">
                {article.content}
              </div>

            </div>
          </article>

          {/* Related Articles Section */}
          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">
                Related Cultural Studies
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/articles/${item.id}`}
                    className="flex flex-col rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-green-700">
                      {item.category}
                    </span>
                    <h3 className="mt-2 font-serif text-base font-bold text-stone-900 line-clamp-2 leading-snug hover:text-green-700">
                      {item.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-stone-500">
                      {item.content}
                    </p>
                    <span className="mt-4 text-[10px] text-stone-400">
                      By {item.creator.name}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}

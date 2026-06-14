import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { FileText, Award } from "lucide-react";

export const dynamic = "force-dynamic";

type ArticlesPageProps = {
  searchParams: {
    category?: string;
  };
};

const categories = [
  "All",
  "History",
  "Culture",
  "Tradition",
  "Culinary",
  "Architecture",
  "Philosophy",
  "Folklore"
];

export default async function ArticlesListPage({ searchParams }: ArticlesPageProps) {
  const activeCategory = searchParams.category || "All";

  // Query database
  const where: any = {};
  if (activeCategory !== "All") {
    where.category = activeCategory;
  }

  const articles = await prisma.article.findMany({
    where,
    include: {
      creator: {
        select: {
          name: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-stone-50">
        
        {/* Banner */}
        <section className="bg-green-800 py-16 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-25" style={{ backgroundImage: `url('/uploads/placeholder-istano-pagaruyung.jpg')` }} />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-green-200">
              <Award size={14} />
              Minangkabau Cultural Studies
            </span>
            <h1 className="mt-4 font-serif text-4xl font-extrabold sm:text-5xl lg:text-6xl max-w-3xl leading-tight">
              RanahMinang Chronicles
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-green-100">
              Delve into deep studies of historical events, architectural achievements, local folklore, culinary heritage, and social philosophies of West Sumatra.
            </p>
          </div>
        </section>

        {/* Categories Navigation */}
        <section className="border-b border-stone-200 bg-white sticky top-[61px] z-40 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto py-4 scrollbar-none">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                const href = cat === "All" ? "/articles" : `/articles?category=${cat}`;

                return (
                  <Link
                    key={cat}
                    href={href}
                    className={`shrink-0 rounded-full px-4.5 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-green-700 text-white shadow"
                        : "border border-stone-200 bg-white text-stone-700 hover:border-green-700 hover:text-green-700"
                    }`}
                  >
                    {cat}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {articles.length === 0 ? (
            <div className="rounded-xl border border-dashed border-stone-300 bg-white p-16 text-center">
              <FileText className="mx-auto text-stone-400 mb-4" size={48} />
              <h3 className="font-serif text-2xl font-bold text-stone-900">No articles found</h3>
              <p className="mt-2 text-sm text-stone-500 max-w-md mx-auto">
                {activeCategory === "All" 
                  ? "No cultural essays or historical studies have been published yet. Check back soon!" 
                  : `There are no published articles under the "${activeCategory}" category yet.`}
              </p>
              {activeCategory !== "All" && (
                <Link
                  href="/articles"
                  className="mt-5 inline-flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
                >
                  View All Categories
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  category={article.category}
                  content={article.content}
                  image={article.image}
                  createdAt={article.createdAt.toISOString()}
                  creatorName={article.creator.name}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

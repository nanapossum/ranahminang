"use client";

import React from "react";
import Link from "next/link";
import { ArticleCard } from "./ArticleCard";
import { SectionHeading } from "../SectionHeading";
import { BookOpen } from "lucide-react";

type ArticleItem = {
  id: string;
  title: string;
  category: string;
  content: string;
  image: string | null;
  createdAt: string;
  creatorName: string;
};

type FeaturedArticlesProps = {
  articles: ArticleItem[];
};

export function FeaturedArticles({ articles }: FeaturedArticlesProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section id="featured-articles" className="bg-[#fbf6ec] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Cultural Chronicles"
          title="Minangkabau History & Heritage"
          description="Read through cultural essays, historical documentations, and local heritage studies curated by producers and experts."
        />

        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              title={article.title}
              category={article.category}
              content={article.content}
              image={article.image}
              createdAt={article.createdAt}
              creatorName={article.creatorName}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 rounded-md bg-green-700 px-6 py-3 font-semibold text-white shadow transition hover:bg-green-800"
          >
            Explore All Articles
            <BookOpen size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

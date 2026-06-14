"use client";

import React from "react";
import { SafeImage } from "@/components/SafeImage";
import Link from "next/link";
import { User, Calendar, BookOpen, FileText } from "lucide-react";

type ArticleCardProps = {
  id: string;
  title: string;
  category: string;
  content: string;
  image: string | null;
  createdAt: string;
  creatorName: string;
};

export function ArticleCard({
  id,
  title,
  category,
  content,
  image,
  createdAt,
  creatorName
}: ArticleCardProps) {
  // Format date
  const dateStr = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(createdAt));

  // Excerpt content (first 140 chars)
  const excerpt = content.length > 140 
    ? `${content.substring(0, 140)}...` 
    : content;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
        <SafeImage
          src={image}
          alt={title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-900 to-emerald-800">
              <FileText className="text-white/40" size={32} />
            </div>
          }
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-green-700 shadow-sm">
          {category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
          <span className="flex items-center gap-1">
            <User size={13} />
            {creatorName}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={13} />
            {dateStr}
          </span>
        </div>

        <h3 className="mt-3 font-serif text-xl font-bold leading-tight text-stone-900 transition hover:text-green-700">
          <Link href={`/articles/${id}`}>{title}</Link>
        </h3>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-600 line-clamp-3">
          {excerpt}
        </p>

        <div className="mt-5 border-t border-stone-100 pt-4 flex items-center justify-between">
          <Link
            href={`/articles/${id}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-700 transition hover:text-green-800"
          >
            Read Article
            <BookOpen size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}

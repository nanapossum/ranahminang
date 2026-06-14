"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";
import { Edit, Trash2, FileText, Calendar, ImageIcon } from "lucide-react";

type ArticleItem = {
  id: string;
  title: string;
  category: string;
  image: string | null;
  createdAt: string;
};

type ProducerArticleListProps = {
  articles: ArticleItem[];
};

export function ProducerArticleList({ articles }: ProducerArticleListProps) {
  const [items, setItems] = useState(articles);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this article?")) {
      return;
    }

    setActiveId(id);
    setMessage("");

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete article");
      }

      setItems((prev) => prev.filter((item) => item.id !== id));
      setMessage("Article deleted successfully.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Deletion failed");
    } finally {
      setActiveId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(new Date(dateStr));
  };

  return (
    <div className="mt-4">
      {message && (
        <div className="mb-6 rounded-lg bg-stone-50 border border-stone-200 p-4 text-sm text-stone-700 font-medium">
          {message}
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-lg border border-earth-bark/10 bg-white p-10 text-center shadow-sm">
          <FileText className="mx-auto text-stone-450 mb-4" size={40} />
          <p className="text-sm font-semibold text-stone-800">No articles found.</p>
          <p className="mt-2 text-xs text-stone-500">Add cultural narratives or historical essays about Minangkabau.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article 
              key={item.id} 
              className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
            >
              {/* Cover thumbnail */}
              <div className="relative aspect-[16/10] bg-stone-105 overflow-hidden">
                  <SafeImage
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                    fallback={
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-800/5 via-emerald-700/5 to-amber-500/5">
                        <ImageIcon className="text-stone-300" size={32} />
                      </div>
                    }
                  />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-bold text-green-700 shadow-sm">
                  {item.category}
                </span>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <Calendar size={13} />
                  <span>{formatDate(item.createdAt)}</span>
                </div>
                
                <h3 className="mt-3 font-serif text-lg font-bold text-stone-900 line-clamp-2 min-h-[3.25rem] group-hover:text-green-700 transition">
                  {item.title}
                </h3>
                
                {/* Actions */}
                <div className="mt-auto pt-4 flex gap-2 border-t border-stone-100">
                  <Link
                    href={`/dashboard/producer/articles/edit/${item.id}`}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-stone-300 bg-white py-2 text-xs font-semibold text-stone-700 transition hover:border-earth-clay hover:text-earth-clay"
                  >
                    <Edit size={13} />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={activeId === item.id}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-stone-950 py-2 text-xs font-semibold text-white transition hover:bg-red-655 disabled:opacity-50"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

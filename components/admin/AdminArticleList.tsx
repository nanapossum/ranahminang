"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";
import { Edit, Trash2, Plus, FileText, Calendar, ImageIcon, User } from "lucide-react";

type ArticleItem = {
  id: string;
  title: string;
  category: string;
  image: string | null;
  createdAt: string;
  creatorName: string;
};

type AdminArticleListProps = {
  articles: ArticleItem[];
};

export function AdminArticleList({ articles }: AdminArticleListProps) {
  const [items, setItems] = useState(articles);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this article? (Admin Action)")) {
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
      setMessage("Article deleted successfully by administrator.");
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
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="font-serif text-2xl font-bold text-earth-bark">Manage Platform Articles</h2>
        <Link
          href="/dashboard/admin/articles/create"
          className="inline-flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
        >
          <Plus size={16} />
          Create Article
        </Link>
      </div>

      {message && (
        <div className="mb-4 rounded-lg bg-stone-100 border border-stone-200 p-4 text-sm text-stone-700 font-medium">
          {message}
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-lg border border-earth-bark/10 bg-white p-10 text-center shadow-sm">
          <FileText className="mx-auto text-stone-400 mb-4" size={40} />
          <p className="text-sm font-semibold text-stone-800">No articles on the platform.</p>
          <p className="mt-2 text-xs text-stone-500">Superadmins and approved producers can submit articles.</p>
          <Link
            href="/dashboard/admin/articles/create"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
          >
            Write First Article
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-200 text-left text-sm text-stone-700">
              <thead className="bg-stone-50 text-xs font-bold uppercase tracking-wider text-stone-500">
                <tr>
                  <th scope="col" className="px-6 py-4">Cover</th>
                  <th scope="col" className="px-6 py-4">Title</th>
                  <th scope="col" className="px-6 py-4">Author</th>
                  <th scope="col" className="px-6 py-4">Category</th>
                  <th scope="col" className="px-6 py-4">Published</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="relative h-12 w-16 overflow-hidden rounded bg-stone-100 border">
                          <SafeImage
                            src={item.image}
                            alt=""
                            fill
                            sizes="64px"
                            className="object-cover"
                            fallback={
                              <div className="flex h-full w-full items-center justify-center bg-stone-100">
                                <ImageIcon className="text-stone-300" size={18} />
                              </div>
                            }
                          />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-stone-900 line-clamp-2 max-w-xs md:max-w-sm mt-3 border-0">
                      {item.title}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-stone-600">
                      <span className="flex items-center gap-1.5 text-xs">
                        <User size={13} className="text-stone-400" />
                        {item.creatorName}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} />
                        {formatDate(item.createdAt)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/admin/articles/edit/${item.id}`}
                          className="inline-flex items-center gap-1.5 rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:border-earth-clay hover:text-earth-clay"
                        >
                          <Edit size={13} />
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          disabled={activeId === item.id}
                          className="inline-flex items-center gap-1.5 rounded-md bg-stone-950 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

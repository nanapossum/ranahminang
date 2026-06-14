"use client";

import React, { useState, useRef } from "react";
import { SafeImage } from "@/components/SafeImage";
import { useRouter } from "next/navigation";
import { FileText, Image as ImageIcon, Loader2, ArrowLeft, Check, AlertCircle } from "lucide-react";
import Link from "next/link";

type ArticleData = {
  id?: string;
  title: string;
  content: string;
  category: string;
  image: string | null;
};

type ArticleFormProps = {
  mode: "create" | "edit";
  initialData?: ArticleData;
  redirectPath: string;
};

const categories = [
  "History",
  "Culture",
  "Tradition",
  "Culinary",
  "Architecture",
  "Philosophy",
  "Folklore"
];

export function ArticleForm({ mode, initialData, redirectPath }: ArticleFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initialData?.title || "");
  const [category, setCategory] = useState(initialData?.category || categories[0]);
  const [content, setContent] = useState(initialData?.content || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image || null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2MB");
      return;
    }

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Only JPG, PNG, and WEBP formats are allowed");
      return;
    }

    setError("");
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }

    if (content.trim().length < 10) {
      setError("Content must be at least 10 characters");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("category", category);
      formData.append("content", content.trim());
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const url = mode === "create" 
        ? "/api/articles" 
        : `/api/articles/${initialData?.id}`;
      
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save article");
      }

      setSuccess(true);
      router.push(redirectPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <Link 
          href={redirectPath}
          className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition hover:text-stone-900"
        >
          <ArrowLeft size={16} />
          Back to list
        </Link>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-start gap-2.5 rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-200">
              <AlertCircle className="mt-0.5 shrink-0 text-red-600" size={18} />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2.5 rounded-lg bg-green-50 p-4 text-sm text-green-800 border border-green-200">
              <Check className="mt-0.5 shrink-0 text-green-600" size={18} />
              <p>Article saved successfully! Redirecting...</p>
            </div>
          )}

          {/* Title input */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-stone-700">
              Article Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={3}
              className="mt-2 block w-full rounded-md border border-stone-300 px-4 py-2.5 text-sm text-stone-900 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
              placeholder="e.g. History of Pagaruyung Kingdom"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Category Select */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-stone-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-2 block w-full rounded-md border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-stone-700">
                Cover Image
              </label>
              <div className="mt-2 flex gap-4 items-center">
                <div 
                  onClick={triggerFileInput}
                  className="relative flex h-20 w-28 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-dashed border-stone-300 bg-stone-50 overflow-hidden hover:bg-stone-100 transition"
                >
                  {previewUrl ? (
                    <SafeImage
                      src={previewUrl}
                      alt="Cover preview"
                      fill
                      sizes="112px"
                      className="object-cover"
                      fallback={<ImageIcon className="text-stone-400" size={24} />}
                    />
                  ) : (
                    <ImageIcon className="text-stone-400" size={24} />
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="rounded-md border border-stone-300 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50"
                  >
                    Select Cover Photo
                  </button>
                  <p className="mt-1 text-[10px] text-stone-400">JPG, PNG, or WEBP. Max 2MB.</p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Large Content Editor */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="content" className="block text-sm font-semibold text-stone-700">
                Article Body Content
              </label>
              <span className="text-xs text-stone-400">Supports standard paragraph breaks</span>
            </div>
            <textarea
              id="content"
              name="content"
              rows={16}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              minLength={10}
              className="mt-2 block w-full rounded-md border border-stone-300 px-4 py-3 text-sm text-stone-900 leading-relaxed font-sans placeholder-stone-400 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
              placeholder="Start writing the cultural studies or historical narrative..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-stone-100">
            <Link
              href={redirectPath}
              className="rounded-md border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-md bg-green-700 px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-green-800 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isSubmitting ? "Saving Article..." : mode === "create" ? "Publish Article" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

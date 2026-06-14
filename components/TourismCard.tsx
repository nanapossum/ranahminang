"use client";

import { useEffect, useState } from "react";
import { SafeImage } from "@/components/SafeImage";
import Link from "next/link";
import { Compass, ImageIcon, MapPin } from "lucide-react";
import { BookmarkButton } from "@/components/destinations/BookmarkButton";
import { WeatherBadge } from "@/components/weather/WeatherBadge";

type ProducerDestination = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  location: string;
  category: string;
  latitude?: number | null;
  longitude?: number | null;
  creator?: {
    name: string;
  };
};

type TourismCardProps = ProducerDestination & {
  source: string;
};

function normalizeCategory(category: string) {
  const value = category.toLowerCase();

  if (value.includes("nature") || value.includes("lake") || value.includes("geological")) return "Nature";
  if (value.includes("histor")) return "Historical";
  if (value.includes("culinary")) return "Culinary";
  if (value.includes("culture") || value.includes("palace") || value.includes("heritage")) return "Cultural";
  if (value.includes("beach")) return "Beach";
  if (value.includes("mountain") || value.includes("highland")) return "Mountain";
  return category;
}

export function TourismCard({ 
  id,
  title, 
  description, 
  image, 
  location, 
  category,
  latitude,
  longitude,
  creator,
  source
}: TourismCardProps) {
  const [canBookmark, setCanBookmark] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) {
          setCanBookmark(false);
          return;
        }

        const data = (await response.json()) as { user?: { role?: string } };
        setCanBookmark(data.user?.role === "tourist");
      } catch {
        setCanBookmark(false);
      }
    }

    void checkAuth();
  }, []);

  return (
    <article className="group overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition duration-305 hover:-translate-y-1 hover:shadow-soft">
      <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-stone-205">
        <SafeImage
          src={image}
          alt={title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-800 via-emerald-700 to-amber-500">
              <ImageIcon className="text-white/70" size={30} aria-hidden="true" />
            </div>
          }
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-bold text-green-700 shadow-sm">
          {normalizeCategory(category)}
        </span>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-md bg-green-700/10 px-2.5 py-0.5 text-xs font-semibold text-green-700">
            <MapPin size={12} aria-hidden="true" />
            {location}
          </span>
          <WeatherBadge
            location={location}
            latitude={latitude}
            longitude={longitude}
          />
        </div>
        <h3 className="mt-3 font-serif text-xl font-bold text-stone-900 leading-snug">{title}</h3>
        <p className="mt-2.5 line-clamp-3 text-xs leading-6 text-stone-700">{description}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-3">
          <span className="text-[10px] font-semibold text-stone-500">{source}</span>
          <div className="flex gap-2">
            <BookmarkButton 
              destinationId={id} 
              canBookmark={canBookmark}
            />
            <Link
              href={`/destinations/${id}`}
              className="inline-flex items-center gap-1.5 rounded-md bg-amber-400 px-3 py-1.5 text-xs font-semibold text-stone-955 transition hover:bg-amber-300"
            >
              Details
              <Compass size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

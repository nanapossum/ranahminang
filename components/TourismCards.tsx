"use client";

import { useEffect, useState } from "react";
import { SafeImage } from "@/components/SafeImage";
import Link from "next/link";
import { Compass, ImageIcon, MapPin } from "lucide-react";
import { BookmarkButton } from "@/components/destinations/BookmarkButton";
import { WeatherBadge } from "@/components/weather/WeatherBadge";
import { SectionHeading } from "./SectionHeading";

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

type TourismCardsProps = {
  destinations?: ProducerDestination[];
};

const filters = ["All", "Nature", "Historical", "Culinary", "Cultural", "Beach", "Mountain"];

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

export function TourismCards({ destinations = [] }: TourismCardsProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [canBookmark, setCanBookmark] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadUserState() {
      try {
        const response = await fetch("/api/auth/me");

        if (!response.ok) {
          setCanBookmark(false);
          setBookmarkedIds([]);
          return;
        }

        const data = (await response.json()) as { user?: { role?: string } };
        const isTourist = data.user?.role === "tourist";
        setCanBookmark(isTourist);

        if (!isTourist) {
          setBookmarkedIds([]);
          return;
        }

        const bookmarksResponse = await fetch("/api/bookmarks");
        if (!bookmarksResponse.ok) {
          setBookmarkedIds([]);
          return;
        }

        const bookmarksData = (await bookmarksResponse.json()) as {
          bookmarks?: Array<{ destination?: { id: string } }>;
        };
        setBookmarkedIds(
          (bookmarksData.bookmarks ?? [])
            .map((bookmark) => bookmark.destination?.id)
            .filter((value): value is string => Boolean(value))
        );
      } catch {
        setCanBookmark(false);
        setBookmarkedIds([]);
      }
    }

    void loadUserState();
  }, []);

  const producerDestinations = destinations.map((destination) => ({
    ...destination,
    href: `/destinations/${destination.id}`,
    source: destination.creator ? `Uploaded by ${destination.creator.name}` : "producer"
  }));

  const visibleDestinations =
    activeFilter === "All"
      ? producerDestinations
      : producerDestinations.filter((destination) => normalizeCategory(destination.category) === activeFilter);

  return (
    <section id="destinations" className="bg-stone-100 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Destinations"
          title="Tourism and Historical Locations"
          description="Explore producer-uploaded destinations, heritage landmarks, highland scenery, and cultural places across West Sumatra."
        />

        {visibleDestinations.length === 0 ? (
          <div className="mt-8 rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-semibold text-stone-700">No destinations available yet.</p>
            <p className="mt-2 text-sm text-stone-600">Check back soon for tourism destinations across West Sumatra.</p>
          </div>
        ) : (
          <>
            <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={
                    activeFilter === filter
                      ? "shrink-0 rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition"
                      : "shrink-0 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-amber-400 hover:text-green-700"
                  }
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visibleDestinations.map((destination) => (
                <article
                  key={destination.id}
                  className="group overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition duration-305 hover:-translate-y-1 hover:shadow-soft"
                >
                  <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-stone-205">
                    <SafeImage
                      src={destination.image}
                      alt={destination.title}
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
                      {normalizeCategory(destination.category)}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-md bg-green-700/10 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                        <MapPin size={12} aria-hidden="true" />
                        {destination.location}
                      </span>
                      <WeatherBadge
                        location={destination.location}
                        latitude={destination.latitude}
                        longitude={destination.longitude}
                      />
                    </div>
                    <h3 className="mt-3 font-serif text-xl font-bold text-stone-900 leading-snug">{destination.title}</h3>
                    <p className="mt-2.5 line-clamp-3 text-xs leading-6 text-stone-700">{destination.description}</p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-3">
                      <span className="text-[10px] font-semibold text-stone-500">{destination.source}</span>
                      <div className="flex gap-2">
                        <BookmarkButton 
                          destinationId={destination.id}
                          canBookmark={canBookmark}
                          initialBookmarked={bookmarkedIds.includes(destination.id)}
                        />
                        <Link
                          href={destination.href}
                          className="inline-flex items-center gap-1.5 rounded-md bg-amber-400 px-3 py-1.5 text-xs font-semibold text-stone-955 transition hover:bg-amber-300"
                        >
                          Details
                          <Compass size={14} aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

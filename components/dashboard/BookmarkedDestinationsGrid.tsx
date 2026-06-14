"use client";

import { useState } from "react";
import { SafeImage } from "@/components/SafeImage";
import Link from "next/link";
import { Compass, ImageIcon, MapPin, Trash2 } from "lucide-react";
import { WeatherBadge } from "@/components/weather/WeatherBadge";

type BookmarkedDestination = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  location: string;
  category: string;
  latitude: number | null;
  longitude: number | null;
  creatorName: string;
};

type BookmarkedDestinationsGridProps = {
  items: BookmarkedDestination[];
};

export function BookmarkedDestinationsGrid({ items }: BookmarkedDestinationsGridProps) {
  const [destinations, setDestinations] = useState(items);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function removeBookmark(destinationId: string) {
    setActiveId(destinationId);
    setMessage("");

    try {
      const response = await fetch(`/api/bookmarks/${destinationId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        setMessage(data?.message || "Failed to remove bookmark.");
        return;
      }

      setDestinations((currentItems) => currentItems.filter((item) => item.id !== destinationId));
      setMessage("Bookmark removed.");
    } finally {
      setActiveId(null);
    }
  }

  if (destinations.length === 0) {
    return (
      <div className="mt-8 rounded-lg border border-dashed border-stone-300 bg-white p-12 text-center shadow-sm">
        <Compass className="mx-auto text-stone-400" size={48} aria-hidden="true" />
        <p className="mt-4 font-serif text-2xl font-bold text-stone-900">
          You haven&apos;t bookmarked any destinations yet.
        </p>
        <p className="mt-2 text-sm text-stone-600">
          Explore destinations and save the places you want to revisit.
        </p>
        <Link
          href="/#destinations"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
        >
          <Compass size={16} aria-hidden="true" />
          Explore Destinations
        </Link>
      </div>
    );
  }

  return (
    <section className="mt-8">
      {message ? <p className="mb-4 text-sm font-medium text-stone-600">{message}</p> : null}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {destinations.map((destination) => (
          <article
            key={destination.id}
            className="group overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft"
          >
            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-stone-200">
              <SafeImage
                src={destination.image}
                alt={destination.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-105"
                fallback={
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-800 via-emerald-700 to-amber-500">
                    <ImageIcon className="text-white/70" size={34} aria-hidden="true" />
                  </div>
                }
              />
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-green-700 shadow-sm">
                {destination.category}
              </span>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-green-700/10 px-3 py-1 text-xs font-semibold text-green-700">
                  <MapPin size={13} aria-hidden="true" />
                  {destination.location}
                </span>
                <WeatherBadge
                  location={destination.location}
                  latitude={destination.latitude}
                  longitude={destination.longitude}
                />
              </div>
              <h3 className="mt-4 font-serif text-2xl font-bold text-stone-900">
                {destination.title}
              </h3>
              <p className="mt-3 line-clamp-3 text-sm leading-7 text-stone-700">
                {destination.description}
              </p>
              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-stone-500">
                  By {destination.creatorName}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => removeBookmark(destination.id)}
                    disabled={activeId === destination.id}
                    className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 size={15} aria-hidden="true" />
                    Remove
                  </button>
                  <Link
                    href={`/destinations/${destination.id}`}
                    className="inline-flex items-center gap-2 rounded-md bg-amber-400 px-3 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-300"
                  >
                    View
                    <Compass size={15} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

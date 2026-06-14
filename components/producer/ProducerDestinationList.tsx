"use client";

import { useState } from "react";
import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";
import { Edit, ImageIcon, Trash2 } from "lucide-react";

type DestinationItem = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  location: string;
  category: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  createdBy: number;
};

type ProducerDestinationListProps = {
  destinations: DestinationItem[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function ProducerDestinationList({ destinations }: ProducerDestinationListProps) {
  const [items, setItems] = useState(destinations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function deleteDestination(id: string) {
    if (!window.confirm("Delete this destination?")) {
      return;
    }

    setActiveId(id);
    setMessage("");

    const response = await fetch(`/api/destinations/${id}`, {
      method: "DELETE"
    });

    setActiveId(null);

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      setMessage(data?.message || "Failed to delete destination");
      return;
    }

    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
    setMessage("Destination deleted.");
  }

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-2xl font-bold text-earth-bark">Your Destinations</h2>
        <Link
          href="/dashboard/producer/create"
          className="inline-flex items-center rounded-md border border-earth-bark/15 px-3 py-2 text-sm font-semibold text-earth-bark transition hover:border-earth-clay hover:text-earth-clay"
        >
          Add Destination
        </Link>
      </div>

      {message ? <p className="mt-4 text-sm font-medium text-earth-clay">{message}</p> : null}

      {items.length === 0 ? (
        <div className="mt-6 rounded-lg border border-earth-bark/10 bg-white p-6 text-sm leading-7 text-earth-ink/70 shadow-sm">
          No destinations yet. Add your first destination to publish it on the public homepage.
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((destination) => (
            <article
              key={destination.id}
              className="overflow-hidden rounded-lg border border-earth-bark/10 bg-white shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="relative flex aspect-[16/10] items-center justify-center bg-earth-bark/5">
                    <SafeImage
                      src={destination.image}
                      alt={destination.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                      fallback={<ImageIcon className="text-earth-bark/35" size={30} aria-hidden="true" />}
                    />
                </div>
                <div className="p-5 pb-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded-md bg-earth-clay/10 px-2.5 py-0.5 text-xs font-semibold text-earth-clay">
                      {destination.category}
                    </span>
                    <span className="rounded-md bg-earth-moss/10 px-2.5 py-0.5 text-xs font-semibold text-earth-moss">
                      {destination.location}
                    </span>
                  </div>
                  <h3 className="mt-3 font-serif text-xl font-bold text-earth-bark leading-snug">{destination.title}</h3>
                  <p className="mt-2.5 line-clamp-3 text-xs leading-6 text-earth-ink/70">
                    {destination.description}
                  </p>
                </div>
              </div>
              <div className="p-5 pt-3">
                <p className="text-[10px] font-semibold text-earth-bark/60">
                  Created {formatDate(destination.createdAt)}
                </p>
                <div className="mt-3.5 flex gap-2 border-t border-stone-100 pt-3">
                  <Link
                    href={`/dashboard/producer/edit/${destination.id}`}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-earth-bark/15 px-3 py-2 text-xs font-semibold text-earth-bark transition hover:border-earth-clay hover:text-earth-clay"
                  >
                    <Edit size={14} aria-hidden="true" />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => deleteDestination(destination.id)}
                    disabled={activeId === destination.id}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-earth-bark px-3 py-2 text-xs font-semibold text-earth-rice transition hover:bg-earth-clay disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 size={14} aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

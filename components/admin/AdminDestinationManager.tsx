"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";
import { Edit, ImageIcon, Search, Trash2 } from "lucide-react";

type AdminDestination = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  location: string;
  category: string;
  createdAt: string;
  creator: {
    name: string;
    email: string;
  };
};

type AdminDestinationManagerProps = {
  destinations: AdminDestination[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function AdminDestinationManager({ destinations }: AdminDestinationManagerProps) {
  const [items, setItems] = useState(destinations);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) =>
      [item.title, item.location, item.category, item.creator.name, item.creator.email]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [items, query]);

  async function deleteDestination(id: string) {
    if (!window.confirm("Delete this destination permanently?")) {
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
    <section className="mt-8 rounded-lg border border-earth-bark/10 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-2xl font-bold text-earth-bark">All Destinations</h2>
        <div className="flex min-w-0 items-center gap-2 rounded-md border border-earth-bark/15 px-3 py-2">
          <Search size={16} className="shrink-0 text-earth-bark/55" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search destinations"
            className="min-w-0 bg-transparent text-sm text-earth-bark outline-none"
          />
        </div>
      </div>

      {message ? <p className="mt-4 text-sm font-medium text-earth-clay">{message}</p> : null}

      {filteredItems.length === 0 ? (
        <p className="mt-6 rounded-md border border-earth-bark/10 bg-earth-rice p-4 text-sm text-earth-ink/70">
          No destinations match the current search.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-left text-sm">
            <thead className="border-b border-earth-bark/10 text-earth-bark">
              <tr>
                <th className="py-3 pr-4 font-semibold">Destination</th>
                <th className="py-3 pr-4 font-semibold">Category</th>
                <th className="py-3 pr-4 font-semibold">Creator</th>
                <th className="py-3 pr-4 font-semibold">Created</th>
                <th className="py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-bark/10">
              {filteredItems.map((destination) => (
                <tr key={destination.id}>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md bg-earth-bark/5">
                        <SafeImage
                          src={destination.image}
                          alt={destination.title}
                          fill
                          sizes="5rem"
                          className="object-cover"
                          fallback={<ImageIcon size={22} className="text-earth-bark/35" aria-hidden="true" />}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-earth-bark">{destination.title}</p>
                        <p className="mt-1 text-earth-ink/65">{destination.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-earth-ink/75">{destination.category}</td>
                  <td className="py-4 pr-4">
                    <p className="font-semibold text-earth-bark">{destination.creator.name}</p>
                    <p className="mt-1 text-earth-ink/65">{destination.creator.email}</p>
                  </td>
                  <td className="py-4 pr-4 text-earth-ink/75">{formatDate(destination.createdAt)}</td>
                  <td className="py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dashboard/admin/destinations/edit/${destination.id}`}
                        className="inline-flex items-center gap-2 rounded-md border border-earth-bark/15 px-3 py-2 font-semibold text-earth-bark transition hover:border-earth-clay hover:text-earth-clay"
                      >
                        <Edit size={16} aria-hidden="true" />
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => deleteDestination(destination.id)}
                        disabled={activeId === destination.id}
                        className="inline-flex items-center gap-2 rounded-md bg-earth-bark px-3 py-2 font-semibold text-earth-rice transition hover:bg-earth-clay disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 size={16} aria-hidden="true" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

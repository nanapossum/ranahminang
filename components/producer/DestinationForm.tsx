"use client";

import { FormEvent, useState } from "react";
import { SafeImage } from "@/components/SafeImage";
import { useRouter } from "next/navigation";
import { ImageIcon } from "lucide-react";

type DestinationFormValues = {
  id?: string;
  title: string;
  description: string;
  location: string;
  category: string;
  latitude?: number | null;
  longitude?: number | null;
  image?: string | null;
};

type DestinationFormProps = {
  mode: "create" | "edit";
  destination?: DestinationFormValues;
  returnTo?: string;
};

export function DestinationForm({ mode, destination, returnTo = "/dashboard/producer" }: DestinationFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const url = mode === "edit" && destination?.id ? `/api/destinations/${destination.id}` : "/api/destinations";
    const method = mode === "edit" ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      body: formData
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      setMessage(data?.message || "Failed to save destination");
      return;
    }

    router.push(returnTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 rounded-lg border border-earth-bark/10 bg-white p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-earth-bark/80">Title</span>
          <input
            name="title"
            required
            minLength={3}
            defaultValue={destination?.title}
            className="mt-2 w-full rounded-md border border-earth-bark/15 bg-white px-3 py-2 text-earth-bark outline-none transition focus:border-earth-clay"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-earth-bark/80">Category</span>
          <input
            name="category"
            required
            minLength={2}
            defaultValue={destination?.category}
            placeholder="Nature, Culture, Heritage"
            className="mt-2 w-full rounded-md border border-earth-bark/15 bg-white px-3 py-2 text-earth-bark outline-none transition focus:border-earth-clay"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-earth-bark/80">Location</span>
          <input
            name="location"
            required
            minLength={3}
            defaultValue={destination?.location}
            placeholder="Bukittinggi, Tanah Datar, Padang"
            className="mt-2 w-full rounded-md border border-earth-bark/15 bg-white px-3 py-2 text-earth-bark outline-none transition focus:border-earth-clay"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-earth-bark/80">Latitude</span>
          <input
            name="latitude"
            type="number"
            step="any"
            defaultValue={destination?.latitude ?? ""}
            placeholder="-0.3052"
            className="mt-2 w-full rounded-md border border-earth-bark/15 bg-white px-3 py-2 text-earth-bark outline-none transition focus:border-earth-clay"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-earth-bark/80">Longitude</span>
          <input
            name="longitude"
            type="number"
            step="any"
            defaultValue={destination?.longitude ?? ""}
            placeholder="100.3692"
            className="mt-2 w-full rounded-md border border-earth-bark/15 bg-white px-3 py-2 text-earth-bark outline-none transition focus:border-earth-clay"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-earth-bark/80">Description</span>
          <textarea
            name="description"
            required
            minLength={10}
            rows={6}
            defaultValue={destination?.description}
            className="mt-2 w-full rounded-md border border-earth-bark/15 bg-white px-3 py-2 text-earth-bark outline-none transition focus:border-earth-clay"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-earth-bark/80">Image</span>
          <input
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="mt-2 w-full rounded-md border border-earth-bark/15 bg-white px-3 py-2 text-earth-bark outline-none transition file:mr-4 file:rounded-md file:border-0 file:bg-earth-bark file:px-3 file:py-2 file:text-sm file:font-semibold file:text-earth-rice hover:file:bg-earth-clay focus:border-earth-clay"
          />
          <span className="mt-2 block text-xs text-earth-ink/60">
            JPG, PNG, or WEBP. Maximum 2MB.
          </span>
        </label>
      </div>

      {destination?.image ? (
        <div className="mt-5">
          <p className="text-sm font-medium text-earth-bark/80">Current image</p>
          <div className="relative mt-2 h-32 w-48 overflow-hidden rounded-md bg-stone-100 flex items-center justify-center">
            <SafeImage 
              src={destination.image} 
              alt={destination.title} 
              fill 
              sizes="12rem" 
              className="object-cover" 
              fallback={<ImageIcon className="text-stone-400" size={24} />} 
            />
          </div>
        </div>
      ) : null}

      {message ? <p className="mt-5 text-sm font-medium text-red-700">{message}</p> : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-earth-bark px-4 py-2 font-semibold text-earth-rice transition hover:bg-earth-clay disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : mode === "edit" ? "Update Destination" : "Create Destination"}
        </button>
      </div>
    </form>
  );
}

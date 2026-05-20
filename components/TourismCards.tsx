import { locations } from "@/data/locations";
import { Compass } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

export function TourismCards() {
  return (
    <section className="bg-earth-rice px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Destinations"
          title="Tourism and Historical Locations"
          description="Explore palaces, city landmarks, canyons, lakes, valleys, and heritage towns connected to Minangkabau identity."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <article
              key={location.id}
              className="rounded-lg border border-earth-bark/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
            >
              <Compass className="text-earth-moss" size={27} aria-hidden="true" />
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-earth-clay/10 px-3 py-1 text-xs font-semibold text-earth-clay">
                  {location.region}
                </span>
                <span className="rounded-md bg-earth-moss/10 px-3 py-1 text-xs font-semibold text-earth-moss">
                  {location.category}
                </span>
              </div>
              <h3 className="mt-4 font-serif text-2xl font-bold text-earth-bark">
                {location.name}
              </h3>
              <p className="mt-3 text-sm leading-7 text-earth-ink/70">
                {location.description}
              </p>
              <p className="mt-4 text-xs font-semibold text-earth-bark/65">
                {location.latitude}, {location.longitude}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

import { cultures } from "@/data/cultures";
import { Landmark } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

export function CultureCards() {
  return (
    <section id="culture" className="bg-[#fbf6ec] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Cultural Knowledge"
          title="Living Heritage of Minangkabau"
          description="Architecture, food, language, performance, and social philosophy form a cultural knowledge system still practiced today."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {cultures.map((culture) => (
            <article
              key={culture.id}
              className="rounded-lg border border-earth-bark/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
            >
              <Landmark className="text-earth-gold" size={25} aria-hidden="true" />
              <h3 className="mt-4 font-serif text-xl font-bold text-earth-bark">
                {culture.title}
              </h3>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-earth-clay">
                {culture.type}
              </p>
              <p className="mt-3 text-sm leading-7 text-earth-ink/70">
                {culture.description}
              </p>
              <p className="mt-4 text-xs font-semibold text-earth-bark/60">
                Origin: {culture.origin}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

import { histories } from "@/data/history";
import { BookOpenText } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

export function HistorySection() {
  return (
    <section id="history" className="bg-earth-bark px-4 py-20 text-earth-rice sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Historical Narratives"
          title="Mountains, Kingdom, and Civilization"
          description="The platform connects geography with memory: Bukit Barisan, Tri Arga, darek, Pagaruyung, and Minangkabau civilization in West Sumatra."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {histories.map((item) => (
            <article
              key={item.id}
              className="rounded-lg border border-earth-rice/12 bg-earth-rice/8 p-6 transition hover:-translate-y-1 hover:bg-earth-rice/12"
            >
              <BookOpenText className="text-earth-gold" size={26} aria-hidden="true" />
              <h3 className="mt-4 font-serif text-2xl font-bold">{item.title}</h3>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-earth-gold">
                {item.region}
              </p>
              <p className="mt-4 text-sm leading-7 text-earth-rice/78">{item.content}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

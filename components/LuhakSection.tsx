import { luhakRegions } from "@/lib/site";
import { MapPinned } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

export function LuhakSection() {
  return (
    <section id="luhak" className="bg-earth-rice px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Darek Minangkabau"
          title="Tiga Luhak di Dataran Tinggi Minangkabau"
          description="The Minangkabau highlands are understood through valleys, peaks, settlements, and adat regions that form the cultural homeland."
        />

        <div className="mt-10 rounded-lg border border-earth-bark/10 bg-white/65 p-6 text-earth-ink shadow-soft">
          <p className="text-base leading-8">
            Dataran Tinggi Minangkabau adalah wilayah pegunungan yang terletak di
            bagian tengah Bukit Barisan dengan tiga puncak tertinggi yang dijuluki
            sebagai puncak Tri Arga. Wilayah yang kini menjadi bagian dari provinsi
            Sumatera Barat ini terdiri dari tiga lembah utama atau juga disebut
            luhak, yaitu: Luhak Agam, Luhak Limopuluah, dan Luhak Tanah Datar.
            Wilayah ini merupakan kampung halaman bagi orang Minangkabau; mereka
            menyebutnya sebagai darek atau alam Minangkabau.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {luhakRegions.map((region) => (
            <article
              key={region.name}
              className="rounded-lg border border-earth-bark/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
            >
              <MapPinned className="text-earth-clay" size={28} aria-hidden="true" />
              <h3 className="mt-5 font-serif text-2xl font-bold text-earth-bark">
                {region.name}
              </h3>
              <p className="mt-3 text-sm leading-7 text-earth-ink/70">{region.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

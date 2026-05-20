import dynamic from "next/dynamic";
import { locations } from "@/data/locations";
import { SectionHeading } from "./SectionHeading";

const CulturalMap = dynamic(
  () => import("./CulturalMap").then((module) => module.CulturalMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[480px] items-center justify-center rounded-lg bg-earth-bark/10 text-sm font-semibold text-earth-bark">
        Loading cultural map...
      </div>
    )
  }
);

export function MapSection() {
  return (
    <section id="map" className="bg-[#fbf6ec] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Geographical Exploration"
          title="Interactive Cultural Map"
          description="Markers use real coordinates for historical landmarks, natural destinations, and cultural regions across West Sumatra."
        />
        <div className="mt-10 overflow-hidden rounded-lg border border-earth-bark/10 bg-white p-2 shadow-soft">
          <CulturalMap locations={locations} />
        </div>
      </div>
    </section>
  );
}

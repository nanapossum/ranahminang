import dynamic from "next/dynamic";
import { SectionHeading } from "./SectionHeading";

type MapDestination = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  location: string;
  category: string;
  latitude: number | null;
  longitude: number | null;
};

type MapSectionProps = {
  destinations?: MapDestination[];
};

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

export function MapSection({ destinations = [] }: MapSectionProps) {
  return (
    <section id="map" className="bg-stone-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Geographical Exploration"
          title="Interactive Cultural Map"
          description="Markers use real coordinates for tourism destinations and cultural regions across West Sumatra."
        />
        <div className="mt-10 overflow-hidden rounded-xl border border-stone-200 bg-white p-2 shadow-soft">
          <CulturalMap destinations={destinations} />
        </div>
      </div>
    </section>
  );
}

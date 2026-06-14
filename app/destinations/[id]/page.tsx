import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { BookmarkButton } from "@/components/destinations/BookmarkButton";
import { WeatherBadge } from "@/components/weather/WeatherBadge";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";

const CulturalMap = dynamic(
  () => import("@/components/CulturalMap").then((module) => module.CulturalMap),
  { ssr: false }
);

const fallbackImageUrl =
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Istano_Basa_Pagaruyung.jpg?width=1800";

type DestinationDetailPageProps = {
  params: {
    id: string;
  };
};

export default async function DestinationDetailPage({ params }: DestinationDetailPageProps) {
  const user = await getCurrentSession();

  const destination = await prisma.destination.findUnique({
    where: { id: params.id },
    include: {
      creator: {
        select: {
          name: true
        }
      }
    }
  });

  if (!destination) {
    notFound();
  }

  const related = await prisma.destination.findMany({
    where: {
      id: { not: destination.id },
      category: destination.category
    },
    take: 3,
    orderBy: { createdAt: "desc" }
  });

  const heroImage = destination.image || fallbackImageUrl;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-stone-100">
        <section className="relative isolate min-h-[540px] overflow-hidden text-white">
          <div className="absolute inset-0 -z-20 bg-cover bg-center" style={{ backgroundImage: `url("${heroImage}")` }} />
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-stone-955/82 via-green-955/62 to-amber-900/28" />
          <div className="mx-auto flex min-h-[540px] max-w-7xl flex-col justify-end px-4 py-10 sm:px-6 lg:px-8">
            <Link href="/#destinations" className="mb-auto inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white/15">
              <ArrowLeft size={16} aria-hidden="true" />
              Back to destinations
            </Link>
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-stone-950">
                {destination.category}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                <MapPin size={13} aria-hidden="true" />
                {destination.location}
              </span>
            </div>
            <h1 className="mt-5 font-serif text-5xl font-extrabold leading-tight text-balance sm:text-6xl">
              {destination.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/88">
              {destination.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <BookmarkButton
                destinationId={destination.id}
                canBookmark={user?.role === "tourist"}
              />
              <WeatherBadge
                location={destination.location}
                latitude={destination.latitude}
                longitude={destination.longitude}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <article className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-3xl font-bold text-stone-900">Destination Story</h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-8 text-stone-700">{destination.description}</p>
          <p className="mt-6 text-sm font-semibold text-green-700">Curated by {destination.creator?.name || "RanahMinang Curator"}</p>
        </article>

        <aside className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-2xl font-bold text-stone-900">Travel Context</h2>
          <div className="mt-5 space-y-4 text-sm text-stone-700">
            <p><span className="font-semibold text-stone-900">Category:</span> {destination.category}</p>
            <p><span className="font-semibold text-stone-900">Location:</span> {destination.location}</p>
            {destination.latitude && destination.longitude ? (
              <p><span className="font-semibold text-stone-900">Coordinates:</span> {destination.latitude}, {destination.longitude}</p>
            ) : null}
          </div>
        </aside>
      </section>

      {destination.latitude && destination.longitude ? (
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-stone-200 bg-white p-2 shadow-sm">
            <CulturalMap
              destinations={[
                {
                  id: destination.id,
                  title: destination.title,
                  latitude: destination.latitude,
                  longitude: destination.longitude,
                  category: destination.category,
                  location: destination.location,
                  image: destination.image,
                  description: destination.description,
                }
              ]}
            />
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-stone-900">Related Destinations</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/destinations/${item.id}`}
                className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
              >
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-700">{item.category}</p>
                <h3 className="mt-3 font-serif text-xl font-bold text-stone-900">{item.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-700">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      </main>
    </>
  );
}

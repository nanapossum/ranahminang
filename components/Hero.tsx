import { ArrowDown, MapPinned, Route } from "lucide-react";

const heroImageUrl =
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Istano_Basa_Pagaruyung.jpg?width=1800";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-stone-900 text-white">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url("${heroImageUrl}")` }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-stone-950/80 via-green-950/58 to-amber-900/30" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-36 bg-gradient-to-b from-transparent to-stone-100" />

      <div className="mx-auto flex min-h-[calc(100vh-65px)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="inline-flex rounded-full bg-amber-400/15 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-200 ring-1 ring-amber-200/25">
            Tourism & Culture Exchange
          </p>
          <h1 className="mt-6 font-serif text-5xl font-extrabold leading-tight text-balance sm:text-6xl lg:text-7xl">
            Discover the Hidden Beauty of Minangkabau
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/88">
            Explore highland landscapes, living heritage, producer-made destination guides, and cultural stories across West Sumatra.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#destinations"
              className="inline-flex items-center gap-2 rounded-md bg-amber-400 px-5 py-3 text-sm font-semibold text-stone-950 shadow-lg shadow-amber-950/20 transition hover:-translate-y-0.5 hover:bg-amber-300"
            >
              Explore Destinations
              <Route size={17} aria-hidden="true" />
            </a>
            <a
              href="#culture"
              className="inline-flex items-center gap-2 rounded-md border border-white/35 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-amber-200 hover:text-amber-100"
            >
              Discover Culture
              <ArrowDown size={17} aria-hidden="true" />
            </a>
          </div>
          <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
            {["Living culture", "Highland nature", "Local producers"].map((item) => (
              <div key={item} className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                <MapPinned className="text-amber-200" size={22} aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

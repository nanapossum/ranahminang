import { ArrowDown, Mountain, Route } from "lucide-react";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-earth-bark text-earth-rice">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(201,146,53,0.22),transparent_28%),linear-gradient(135deg,rgba(63,38,24,0.92),rgba(32,22,16,0.94))]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-[linear-gradient(180deg,transparent,#fbf6ec)]" />

      <div className="mx-auto grid min-h-[calc(100vh-65px)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-earth-gold">
            Tourism & Culture Exchange
          </p>
          <h1 className="mt-5 font-serif text-5xl font-bold leading-tight text-balance sm:text-6xl lg:text-7xl">
            RanahMinang
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-earth-rice/88">
            An interactive cultural tourism platform for Minangkabau heritage,
            hidden highland destinations, historical narratives, and real-world
            exploration across West Sumatra.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#map"
              className="inline-flex items-center gap-2 rounded-md bg-earth-gold px-5 py-3 text-sm font-semibold text-earth-ink transition hover:bg-[#dba746]"
            >
              Explore Map
              <Route size={17} aria-hidden="true" />
            </a>
            <a
              href="#history"
              className="inline-flex items-center gap-2 rounded-md border border-earth-rice/30 px-5 py-3 text-sm font-semibold text-earth-rice transition hover:border-earth-gold hover:text-earth-gold"
            >
              Read Narratives
              <ArrowDown size={17} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-earth-rice/15 bg-earth-rice/8 p-5 shadow-soft">
          <div className="grid h-full grid-cols-3 gap-3">
            {["Marapi", "Singgalang", "Sago"].map((peak, index) => (
              <div
                key={peak}
                className="flex min-h-[280px] flex-col justify-end rounded-md bg-earth-rice/10 p-4"
                style={{ marginTop: `${index * 26}px` }}
              >
                <Mountain className="mb-3 text-earth-gold" size={28} aria-hidden="true" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-earth-gold">
                  Tri Arga
                </p>
                <p className="mt-1 font-serif text-2xl font-semibold">{peak}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

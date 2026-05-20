export function Footer() {
  return (
    <footer className="bg-earth-ink px-4 py-10 text-earth-rice sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-earth-rice/10 pt-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-serif text-2xl font-bold">RanahMinang</p>
          <p className="mt-2 text-sm text-earth-rice/65">
            Cultural tourism, historical geography, and Minangkabau identity.
          </p>
        </div>
        <p className="text-sm text-earth-rice/55">
          Built with Next.js, TypeScript, TailwindCSS, Leaflet.js, and simple API routes.
        </p>
      </div>
    </footer>
  );
}

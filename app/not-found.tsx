import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-earth-rice px-6 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-earth-clay">
          RanahMinang
        </p>
        <h1 className="mt-3 font-serif text-4xl font-bold text-earth-bark">
          Halaman tidak ditemukan
        </h1>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-md bg-earth-bark px-5 py-3 text-sm font-semibold text-white transition hover:bg-earth-clay"
        >
          Kembali ke beranda
        </Link>
      </div>
    </main>
  );
}

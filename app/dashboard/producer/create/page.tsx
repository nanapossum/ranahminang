import Link from "next/link";
import { redirect } from "next/navigation";
import { DestinationForm } from "@/components/producer/DestinationForm";
import { getCurrentSession } from "@/lib/auth/session";

export default async function CreateDestinationPage() {
  const user = await getCurrentSession();

  if (!user) {
    redirect("/login?next=/dashboard/producer/create");
  }

  if (user.role !== "producer") {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-earth-rice px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-3xl">
        <Link href="/dashboard/producer" className="text-sm font-semibold text-earth-clay transition hover:text-earth-bark">
          Back to Producer Dashboard
        </Link>
        <div className="mt-8 rounded-lg border border-earth-bark/10 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-earth-clay">new destination</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-earth-bark">Add Destination</h1>
          <p className="mt-3 text-sm leading-7 text-earth-ink/70">
            Create a destination entry with a local image upload for the public tourism section.
          </p>
        </div>
        <DestinationForm mode="create" />
      </section>
    </main>
  );
}

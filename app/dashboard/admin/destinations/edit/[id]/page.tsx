import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DestinationForm } from "@/components/producer/DestinationForm";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";

type AdminEditDestinationPageProps = {
  params: {
    id: string;
  };
};

export default async function AdminEditDestinationPage({ params }: AdminEditDestinationPageProps) {
  const user = await getCurrentSession();

  if (!user) {
    redirect(`/login?next=/dashboard/admin/destinations/edit/${params.id}`);
  }

  if (user.role !== "superadmin") {
    redirect("/");
  }

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

  return (
    <main className="min-h-screen bg-earth-rice px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-3xl">
        <Link href="/dashboard/admin/destinations" className="text-sm font-semibold text-earth-clay transition hover:text-earth-bark">
          Back to Destination Management
        </Link>
        <div className="mt-8 rounded-lg border border-earth-bark/10 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-earth-clay">moderate destination</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-earth-bark">{destination.title}</h1>
          <p className="mt-3 text-sm leading-7 text-earth-ink/70">
            Submitted by {destination.creator.name}. Superadmin edits preserve the original producer ownership.
          </p>
        </div>
        <DestinationForm
          mode="edit"
          returnTo="/dashboard/admin/destinations"
          destination={{
            id: destination.id,
            title: destination.title,
            description: destination.description,
            location: destination.location,
            category: destination.category,
            latitude: destination.latitude,
            longitude: destination.longitude,
            image: destination.image
          }}
        />
      </section>
    </main>
  );
}

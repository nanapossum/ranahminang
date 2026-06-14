import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProfileForm } from "@/components/profile/ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentSession();

  if (!user) {
    redirect("/login?next=/profile");
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-stone-50">
        <div className="bg-green-800 py-12 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-4xl font-extrabold sm:text-5xl">Your Profile</h1>
            <p className="mt-2 max-w-2xl text-sm text-green-100">
              Manage your personal information, upload an avatar, and review your account details.
            </p>
          </div>
        </div>
        <ProfileForm user={user} />
      </main>
      <Footer />
    </>
  );
}

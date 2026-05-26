import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-earth-rice px-4 py-12">
      <section className="mx-auto w-full max-w-md">
        <Link href="/" className="text-sm font-semibold text-earth-clay transition hover:text-earth-bark">
          RanahMinang
        </Link>
        <div className="mt-6 rounded-lg border border-earth-bark/10 bg-white p-6 shadow-sm">
          <h1 className="font-serif text-3xl font-semibold text-earth-bark">Register</h1>
          <p className="mt-2 text-sm leading-6 text-earth-bark/70">
            Tourist accounts are active immediately. Producer accounts wait for superadmin approval.
          </p>
          <div className="mt-6">
            <RegisterForm />
          </div>
          <p className="mt-5 text-sm text-earth-bark/70">
            Already registered?{" "}
            <Link href="/login" className="font-semibold text-earth-clay transition hover:text-earth-bark">
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-earth-rice px-4 py-12">
      <section className="mx-auto w-full max-w-md">
        <Link href="/" className="text-sm font-semibold text-earth-clay transition hover:text-earth-bark">
          RanahMinang
        </Link>
        <div className="mt-6 rounded-lg border border-earth-bark/10 bg-white p-6 shadow-sm">
          <h1 className="font-serif text-3xl font-semibold text-earth-bark">Forgot Password</h1>
          <p className="mt-2 text-sm leading-6 text-earth-bark/70">
            Generate a temporary reset link for your local RanahMinang account.
          </p>
          <div className="mt-6">
            <ForgotPasswordForm />
          </div>
          <p className="mt-5 text-sm text-earth-bark/70">
            Remember your password?{" "}
            <Link href="/login" className="font-semibold text-earth-clay transition hover:text-earth-bark">
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

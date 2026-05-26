import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-earth-rice px-4 py-12">
      <section className="mx-auto w-full max-w-md">
        <Link href="/" className="text-sm font-semibold text-earth-clay transition hover:text-earth-bark">
          RanahMinang
        </Link>
        <div className="mt-6 rounded-lg border border-earth-bark/10 bg-white p-6 shadow-sm">
          <h1 className="font-serif text-3xl font-semibold text-earth-bark">Login</h1>
          <p className="mt-2 text-sm leading-6 text-earth-bark/70">
            Access approved RanahMinang accounts for tourism and culture exchange.
          </p>
          <div className="mt-6">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
          <p className="mt-5 text-sm text-earth-bark/70">
            Need an account?{" "}
            <Link href="/register" className="font-semibold text-earth-clay transition hover:text-earth-bark">
              Register
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

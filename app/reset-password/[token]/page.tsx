import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

type ResetPasswordPageProps = {
  params: {
    token: string;
  };
};

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  return (
    <main className="min-h-screen bg-earth-rice px-4 py-12">
      <section className="mx-auto w-full max-w-md">
        <Link href="/" className="text-sm font-semibold text-earth-clay transition hover:text-earth-bark">
          RanahMinang
        </Link>
        <div className="mt-6 rounded-lg border border-earth-bark/10 bg-white p-6 shadow-sm">
          <h1 className="font-serif text-3xl font-semibold text-earth-bark">Reset Password</h1>
          <p className="mt-2 text-sm leading-6 text-earth-bark/70">
            Set a new password. Reset links expire after 30 minutes.
          </p>
          <div className="mt-6">
            <ResetPasswordForm token={params.token} />
          </div>
        </div>
      </section>
    </main>
  );
}

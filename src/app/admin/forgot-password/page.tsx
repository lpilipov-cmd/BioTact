import type { Metadata } from "next";

import { RecoveryForm } from "./recovery-form";

export const metadata: Metadata = {
  title: "Oporavak lozinke",
  robots: { index: false, follow: false },
};

type ForgotPasswordPageProps = Readonly<{
  searchParams: Promise<{ status?: string }>;
}>;

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const { status } = await searchParams;
  const initialMessage =
    status === "invalid"
      ? "Link za oporavak nije važeći ili je istekao. Zatražite novi link."
      : null;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <section className="w-full max-w-md rounded-3xl border border-[#17301f]/15 bg-white/70 p-6 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5b6960]">
          BIOTACT
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          Oporavak lozinke
        </h1>
        <p className="mt-3 leading-7 text-[#5b6960]">
          Unesite administratorski email. Ako nalog postoji, dobićete bezbedan
          link za postavljanje nove lozinke.
        </p>
        <RecoveryForm initialMessage={initialMessage} />
      </section>
    </main>
  );
}

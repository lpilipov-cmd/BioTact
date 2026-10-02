import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getAdministrator } from "@/lib/auth/admin";

import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Nova administratorska lozinka",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage() {
  const administrator = await getAdministrator();

  if (!administrator) {
    redirect("/admin/forgot-password?status=invalid");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <section className="w-full max-w-md rounded-3xl border border-[#17301f]/15 bg-white/70 p-6 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5b6960]">
          BIOTACT
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          Postavite novu lozinku
        </h1>
        <p className="mt-3 leading-7 text-[#5b6960]">
          Unesite novu administratorsku lozinku. Nakon promene prijavićete se
          ponovo.
        </p>
        <ResetPasswordForm />
      </section>
    </main>
  );
}

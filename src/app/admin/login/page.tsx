import { redirect } from "next/navigation";

import { getAdministrator } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";

import { LoginForm } from "./login-form";

type LoginPageProps = Readonly<{
  searchParams: Promise<{ reason?: string; reset?: string }>;
}>;

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const administrator = await getAdministrator();

  if (administrator) {
    redirect("/admin");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { reason, reset } = await searchParams;
  const initialMessage = user
    ? "Nalog nema administratorski pristup."
    : reset === "uspesno"
      ? "Lozinka je uspešno promenjena. Prijavite se novom lozinkom."
      : reason
        ? "Prijavite se da biste pristupili administraciji."
        : null;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <section className="w-full max-w-md rounded-3xl border border-[#17301f]/15 bg-white/70 p-6 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5b6960]">
          BIOTACT
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          Administratorska prijava
        </h1>
        <p className="mt-3 leading-7 text-[#5b6960]">
          Unesite administratorski email i lozinku.
        </p>
        <LoginForm initialMessage={initialMessage} />
      </section>
    </main>
  );
}

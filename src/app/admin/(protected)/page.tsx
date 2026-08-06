import { requireAdministrator } from "@/lib/auth/admin";

export default async function AdminPage() {
  const { user } = await requireAdministrator();

  return (
    <main className="mx-auto flex max-w-6xl items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <section className="w-full max-w-2xl rounded-3xl border border-[#17301f]/15 bg-white/70 p-6 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5b6960]">
          Zaštićen pristup
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          BIOTACT administracija
        </h1>
        <p className="mt-5 leading-7">
          Administrator je uspešno prijavljen.
        </p>
        <p className="mt-2 break-all text-sm text-[#5b6960]">
          {user.email}
        </p>
        <p className="mt-8 text-sm text-[#5b6960]">
          Upravljanje leadovima dostupno je kroz navigaciju.
        </p>
      </section>
    </main>
  );
}

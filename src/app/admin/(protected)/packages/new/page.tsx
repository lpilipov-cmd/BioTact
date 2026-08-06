import Link from "next/link";

import { requireAdministrator } from "@/lib/auth/admin";

import { PackageForm } from "../package-form";

export default async function NewPackagePage() {
  await requireAdministrator();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/admin/packages" className="text-sm font-semibold underline underline-offset-4">
        ← Nazad na pakete
      </Link>
      <section className="mt-6 rounded-3xl border border-[#17301f]/15 bg-white/70 p-5 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b6960]">Administracija</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Novi paket</h1>
        <p className="mt-3 text-[#5b6960]">Unesite proverene podatke. Cena može ostati prazna.</p>
        <PackageForm mode="create" />
      </section>
    </main>
  );
}

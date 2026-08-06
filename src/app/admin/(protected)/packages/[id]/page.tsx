import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { requireAdministrator } from "@/lib/auth/admin";

import { PackageForm } from "../package-form";

type EditPackagePageProps = Readonly<{
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}>;

export default async function EditPackagePage({ params, searchParams }: EditPackagePageProps) {
  const { supabase } = await requireAdministrator();
  const id = z.uuid().safeParse((await params).id);

  if (!id.success) notFound();

  const { data: packageData, error } = await supabase
    .from("packages")
    .select("id,name,slug,category,description,product_codes,price_rsd,active,sort_order")
    .eq("id", id.data)
    .maybeSingle();

  if (!packageData && !error) notFound();

  if (error || !packageData) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <section role="alert" className="rounded-2xl border border-red-900/20 bg-red-50 p-6">
          <h1 className="text-xl font-bold">Paket trenutno nije dostupan.</h1>
          <Link href="/admin/packages" className="mt-5 inline-block font-semibold underline">Nazad na pakete</Link>
        </section>
      </main>
    );
  }

  const created = (await searchParams).created === "1";

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/admin/packages" className="text-sm font-semibold underline underline-offset-4">
        ← Nazad na pakete
      </Link>
      <section className="mt-6 rounded-3xl border border-[#17301f]/15 bg-white/70 p-5 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b6960]">Administracija</p>
        <h1 className="mt-2 break-words text-3xl font-bold tracking-tight">Uredi paket</h1>
        {created ? <p role="status" className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-900">Paket je uspešno kreiran.</p> : null}
        <PackageForm mode="edit" packageData={packageData} />
      </section>
    </main>
  );
}

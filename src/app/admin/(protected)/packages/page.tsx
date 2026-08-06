import Link from "next/link";

import { requireAdministrator } from "@/lib/auth/admin";
import { formatPackagePrice, packageCategoryLabels, packageCategories } from "@/lib/packages/constants";

export default async function AdminPackagesPage() {
  const { supabase } = await requireAdministrator();
  const { data: packages, error } = await supabase
    .from("packages")
    .select("id,name,category,price_rsd,active,sort_order")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b6960]">Administracija</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Paketi</h1>
        </div>
        <Link
          href="/admin/packages/new"
          className="inline-flex min-h-11 items-center rounded-xl bg-[#17301f] px-4 font-bold text-[#f7f3ea]"
        >
          Novi paket
        </Link>
      </div>

      {error ? (
        <section role="alert" className="mt-8 rounded-2xl border border-red-900/20 bg-red-50 p-6">
          <h2 className="font-bold">Paketi trenutno nisu dostupni.</h2>
          <p className="mt-2 text-sm">Osvežite stranicu ili pokušajte ponovo kasnije.</p>
        </section>
      ) : packages?.length ? (
        <div className="mt-8 grid gap-4" data-testid="admin-package-list">
          {packages.map((item) => {
            const category = packageCategories.includes(item.category as (typeof packageCategories)[number])
              ? packageCategoryLabels[item.category as (typeof packageCategories)[number]]
              : "Nepoznata kategorija";

            return (
              <article
                key={item.id}
                data-testid="admin-package-card"
                className="min-w-0 rounded-2xl border border-[#17301f]/15 bg-white/70 p-5 shadow-sm"
              >
                <div className="grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_.7fr_.7fr_auto] lg:items-center">
                  <PackageField label="Naziv" value={item.name} />
                  <PackageField label="Kategorija" value={category} />
                  <PackageField label="Cena" value={formatPackagePrice(item.price_rsd)} />
                  <PackageField label="Aktivno" value={item.active ? "Da" : "Ne"} />
                  <PackageField label="Redosled" value={String(item.sort_order)} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#5b6960]">Akcija</p>
                    <Link
                      href={`/admin/packages/${item.id}`}
                      className="mt-1 inline-flex min-h-10 items-center rounded-lg border border-[#17301f] px-3 text-sm font-semibold hover:bg-[#17301f] hover:text-[#f7f3ea]"
                    >
                      Uredi
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <section className="mt-8 rounded-2xl border border-[#17301f]/15 bg-white/60 p-8 text-center">
          <h2 className="text-xl font-bold">Još nema paketa.</h2>
          <p className="mt-2 text-sm text-[#5b6960]">Kreirajte prvi paket kada su podaci provereni.</p>
        </section>
      )}
    </main>
  );
}

function PackageField({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#5b6960]">{label}</p>
      <p className="mt-1 break-words text-sm">{value}</p>
    </div>
  );
}

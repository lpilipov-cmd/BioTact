import type { Metadata } from "next";
import Link from "next/link";

import {
  formatPackagePrice,
  packageCategories,
  packageCategoryLabels,
  parsePackageCategory,
} from "@/lib/packages/constants";
import { createClient } from "@/lib/supabase/server";

type PackagesPageProps = Readonly<{
  searchParams: Promise<{ category?: string | string[] }>;
}>;

export const metadata: Metadata = {
  title: "Paketi",
  description: "Pregled aktivnih BIOTACT wellness paketa i dostupnih informacija.",
  alternates: { canonical: "/paketi" },
  openGraph: { title: "Paketi | BIOTACT", description: "Pregled aktivnih BIOTACT wellness paketa.", url: "/paketi" },
};

export default async function PackagesPage({ searchParams }: PackagesPageProps) {
  const category = parsePackageCategory((await searchParams).category);
  const supabase = await createClient();
  let query = supabase
    .from("packages")
    .select("slug,name,category,description,price_rsd")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (category) query = query.eq("category", category);

  const { data: packages, error } = await query;

  return (
    <main id="glavni-sadrzaj" className="min-h-screen px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <section className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b6960]">Wellness podrška</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Paketi</h1>
          <p className="mt-4 leading-7 text-[#476050]">
            Istražite aktivne pakete. Za dostupnost, proverene informacije i ručno poručivanje kontaktirajte BIOTACT.
          </p>
        </section>

        <nav aria-label="Kategorije paketa" className="mt-8 flex flex-wrap gap-2">
          <Link href="/paketi" aria-current={!category ? "page" : undefined} className={filterClass(!category)}>Svi</Link>
          {packageCategories.map((item) => (
            <Link
              key={item}
              href={`/paketi?category=${item}`}
              aria-current={category === item ? "page" : undefined}
              className={filterClass(category === item)}
            >
              {packageCategoryLabels[item]}
            </Link>
          ))}
        </nav>

        {error ? (
          <section role="alert" className="mt-10 rounded-2xl border border-red-900/20 bg-red-50 p-6">
            <h2 className="font-bold">Paketi trenutno nisu dostupni.</h2>
            <p className="mt-2 text-sm">Pokušajte ponovo kasnije.</p>
          </section>
        ) : packages?.length ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3" data-testid="public-package-list">
            {packages.map((item) => {
              const itemCategory = packageCategories.includes(item.category as (typeof packageCategories)[number])
                ? packageCategoryLabels[item.category as (typeof packageCategories)[number]]
                : "Wellness";
              return (
                <article key={item.slug} data-testid="public-package-card" className="flex min-w-0 flex-col rounded-3xl border border-[#17301f]/15 bg-white/70 p-6 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5b6960]">{itemCategory}</p>
                  <h2 className="mt-3 break-words text-2xl font-bold">{item.name}</h2>
                  <p className="mt-4 line-clamp-4 flex-1 leading-7 text-[#476050]">{item.description}</p>
                  <p className="mt-5 font-bold">{formatPackagePrice(item.price_rsd)}</p>
                  <Link href={`/paketi/${item.slug}`} className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#17301f] px-4 font-bold text-[#f7f3ea]">
                    Pogledaj paket
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <section className="empty-state">
            <h2 className="text-xl font-bold">Nema aktivnih paketa u ovoj kategoriji.</h2>
            <p className="mt-2 text-sm text-[#5b6960]">Prikazujemo samo proverene i trenutno aktivne pakete. Izaberite drugu kategoriju ili nam pošaljite opšti upit.</p>
            <Link href="/kontakt" className="button-secondary mt-5">Pošalji upit</Link>
          </section>
        )}
      </div>
    </main>
  );
}

function filterClass(active: boolean) {
  return `inline-flex min-h-10 items-center rounded-full border border-[#17301f] px-4 text-sm font-semibold ${
    active ? "bg-[#17301f] text-[#f7f3ea]" : "bg-transparent hover:bg-[#17301f]/10"
  }`;
}

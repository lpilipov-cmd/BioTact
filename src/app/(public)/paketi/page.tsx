import type { Metadata } from "next";
import Link from "next/link";

import { PackageCard } from "@/components/public/package-card";
import { packageCategories, packageCategoryLabels, parsePackageCategory } from "@/lib/packages/constants";
import { approvedPackageSlugs, getApprovedPackagePresentation, hasCanonicalProductMapping } from "@/lib/packages/presentation";
import { createClient } from "@/lib/supabase/server";

type PackagesPageProps = Readonly<{ searchParams: Promise<{ category?: string | string[] }> }>;

export const metadata: Metadata = {
  title: "Paketi",
  description: "Kurirane BIOTACT wellness kolekcije sa jasno prikazanim LR proizvodima i ličnom podrškom.",
  alternates: { canonical: "/paketi" },
  openGraph: { title: "Paketi | BIOTACT", description: "Kurirane wellness kolekcije koje olakšavaju izbor proizvoda.", url: "/paketi" },
};

export default async function PackagesPage({ searchParams }: PackagesPageProps) {
  const category = parsePackageCategory((await searchParams).category);
  const supabase = await createClient();
  let query = supabase
    .from("packages")
    .select("slug,name,category,product_codes,price_rsd")
    .in("slug", approvedPackageSlugs)
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (category) query = query.eq("category", category);
  const { data, error } = await query;
  const productArticleNumbers = approvedPackageSlugs.flatMap((slug) => getApprovedPackagePresentation(slug)?.products.map((product) => product.articleNumber) ?? []);
  const { data: products } = productArticleNumbers.length
    ? await supabase.from("products").select("article_number,slug").in("article_number", productArticleNumbers).eq("active", true)
    : { data: [] };
  const linkedProductSlugs = new Set((products ?? []).map((product) => product.slug));
  const packages = (data ?? []).flatMap((item) => {
    const presentation = getApprovedPackagePresentation(item.slug);
    return presentation && hasCanonicalProductMapping(item.slug, item.product_codes)
      ? [{ ...presentation, name: item.name, category: presentation.category, priceRsd: item.price_rsd }]
      : [];
  });

  return (
    <main id="glavni-sadrzaj" className="packages-page">
      <header className="packages-header">
        <div>
          <p className="package-kicker package-kicker-light">Kurirane BIOTACT kolekcije</p>
          <h1>Paketi koji izbor čine jednostavnijim.</h1>
        </div>
        <p>Svaki paket objedinjuje postojeće LR proizvode u preglednu wellness selekciju. Za dostupnost i poručivanje razgovarate direktno sa BIOTACT podrškom.</p>
      </header>

      <div className="packages-content">
        <nav aria-label="Kategorije paketa" className="package-filters">
          <Link href="/paketi" aria-current={!category ? "page" : undefined} className={filterClass(!category)}>Sve kolekcije</Link>
          {packageCategories.map((item) => (
            <Link key={item} href={`/paketi?category=${item}`} aria-current={category === item ? "page" : undefined} className={filterClass(category === item)}>
              {packageCategoryLabels[item]}
            </Link>
          ))}
        </nav>

        {error ? (
          <section role="alert" className="package-empty-state"><p className="package-kicker">Trenutno nedostupno</p><h2>Pakete nije moguće učitati.</h2><p>Pokušajte ponovo kasnije ili nam pošaljite opšti upit.</p><Link href="/kontakt" className="button-primary">Pošalji upit</Link></section>
        ) : packages.length ? (
          <div className="package-list-grid" data-testid="public-package-list">
            {packages.map((item, index) => <PackageCard key={item.slug} packageData={item} linkedProductSlugs={linkedProductSlugs} priority={index < 2} />)}
          </div>
        ) : (
          <section className="package-empty-state"><p className="package-kicker">Pažljivo biramo</p><h2>Nema aktivnih paketa u ovoj kategoriji.</h2><p>Prikazujemo samo odobrene pakete sa proverenim sastavom. Možete izabrati drugu kategoriju ili poslati opšti upit.</p><Link href="/kontakt" className="button-primary">Pošalji upit</Link></section>
        )}
      </div>
    </main>
  );
}

function filterClass(active: boolean) {
  return `package-filter${active ? " package-filter-active" : ""}`;
}

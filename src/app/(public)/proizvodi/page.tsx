import type { Metadata } from "next";
import Link from "next/link";

import { ProductCatalogue } from "@/components/public/product-catalogue";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Proizvodi",
  description: "Istražite aktivne LR wellness proizvode u BIOTACT katalogu.",
  alternates: { canonical: "/proizvodi" },
};

type ProductsPageProps = Readonly<{ searchParams: Promise<{ subcategory?: string | string[] }> }>;

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const requestedSubcategory = (await searchParams).subcategory;
  const initialSubcategory = typeof requestedSubcategory === "string" && requestedSubcategory.length <= 80 ? requestedSubcategory : "";
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("slug,article_number,name,category,subcategory,short_description,package_content,catalogue_price_eur,image_path")
    .eq("active", true)
    .order("sort_order")
    .order("name");

  return (
    <main id="glavni-sadrzaj" className="catalogue-page">
      <header className="catalogue-header">
        <div>
          <p className="eyebrow text-[#dbc487]!">BIOTACT izbor</p>
          <h1>Proizvodi</h1>
        </div>
        <p>Istražite proverene LR proizvode kroz jasne kolekcije i velike fotografije.</p>
      </header>
      <div className="catalogue-content">
        {error ? <p role="alert" className="rounded-2xl bg-red-50 p-5">Proizvodi trenutno nisu dostupni.</p> : products?.length ? <ProductCatalogue products={products} initialSubcategory={initialSubcategory} /> : <section className="empty-state" data-testid="empty-product-catalogue"><h2 className="text-2xl font-bold">Katalog proizvoda je u pripremi.</h2><p className="mx-auto mt-3 max-w-xl text-[#5b6960]">Objavićemo samo proverene i aktivne proizvode. U međuvremenu nam možete poslati opšti upit.</p><Link className="button-primary mt-6" href="/kontakt">Pošalji opšti upit</Link></section>}
      </div>
    </main>
  );
}

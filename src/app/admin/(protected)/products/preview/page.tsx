import type { Metadata } from "next";
import Link from "next/link";

import { ProductCatalogue } from "@/components/public/product-catalogue";
import { requireAdministrator } from "@/lib/auth/admin";

export const metadata: Metadata = { title: "Pregled kataloga proizvoda", robots: { index: false, follow: false } };

type ProductPreviewPageProps = Readonly<{ searchParams: Promise<{ subcategory?: string | string[] }> }>;

export default async function ProductPreviewPage({ searchParams }: ProductPreviewPageProps) {
  const requestedSubcategory = (await searchParams).subcategory;
  const initialSubcategory = typeof requestedSubcategory === "string" && requestedSubcategory.length <= 80 ? requestedSubcategory : "";
  const { supabase } = await requireAdministrator();
  const { data: products, error } = await supabase.from("products").select("slug,article_number,name,category,subcategory,short_description,package_content,catalogue_price_eur,image_path").order("sort_order").order("name");
  return <main id="glavni-sadrzaj" className="catalogue-page"><header className="catalogue-header"><div><p className="eyebrow text-[#dbc487]!">Vlasnički pregled</p><h1>BIOTACT katalog pre objave.</h1></div><p>Isti katalog namenjen kupcima, sa svih 50 neaktivnih lokalnih proizvoda za bezbedan pregled.</p></header><div className="catalogue-content"><div className="flex flex-wrap gap-5"><Link href="/admin/products" className="product-back-link">← Nazad na administraciju</Link><Link href="/admin/storefront-preview" className="product-back-link">Pregled cele prodavnice →</Link></div>{error ? <p role="alert" className="mt-8 rounded-2xl bg-red-50 p-5">Pregled trenutno nije dostupan.</p> : <div className="mt-8"><ProductCatalogue products={products ?? []} detailBasePath="/admin/products/preview" preview initialSubcategory={initialSubcategory} /></div>}</div></main>;
}

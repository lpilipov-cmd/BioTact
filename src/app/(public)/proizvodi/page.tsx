import type { Metadata } from "next";
import Link from "next/link";

import { ProductImage } from "@/components/public/product-image";
import { formatEurPrice } from "@/lib/products/format";
import { productCategories, productCategoryLabels } from "@/lib/products/validation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Proizvodi", description: "BIOTACT katalog pojedinačnih LR proizvoda.", alternates: { canonical: "/proizvodi" } };
type Props = Readonly<{ searchParams: Promise<{ q?: string; category?: string; subcategory?: string }> }>;

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = params.q?.trim().slice(0, 80) ?? "";
  const category = productCategories.find((value) => value === params.category);
  const subcategory = params.subcategory?.trim().slice(0, 100) ?? "";
  const supabase = await createClient();
  let query = supabase.from("products").select("slug,name,article_number,category,subcategory,package_content,catalogue_price_eur,image_path").eq("active", true).order("sort_order").order("name");
  if (search) query = query.or(`name.ilike.%${search.replaceAll(",", "") }%,article_number.ilike.%${search.replaceAll(",", "")}%`);
  if (category) query = query.eq("category", category);
  if (subcategory) query = query.eq("subcategory", subcategory);
  const { data: products, error } = await query;

  return <main id="glavni-sadrzaj" className="min-h-screen px-4 py-12 sm:px-6"><div className="mx-auto max-w-6xl">
    <p className="eyebrow">Pojedinačni proizvodi</p><h1 className="mt-3 text-4xl font-bold sm:text-5xl">Proizvodi</h1>
    <form className="mt-8 grid gap-3 rounded-2xl border border-[#17301f]/15 bg-white/70 p-4 sm:grid-cols-3" role="search">
      <label className="grid gap-1 text-sm font-semibold">Naziv ili šifra<input className="field-input" name="q" defaultValue={search} /></label>
      <label className="grid gap-1 text-sm font-semibold">Kategorija<select className="field-input" name="category" defaultValue={category ?? ""}><option value="">Sve kategorije</option>{productCategories.map((item)=><option key={item} value={item}>{productCategoryLabels[item]}</option>)}</select></label>
      <label className="grid gap-1 text-sm font-semibold">Potkategorija<input className="field-input" name="subcategory" defaultValue={subcategory} /></label>
      <button className="button-secondary sm:col-span-3 sm:justify-self-start" type="submit">Primeni filtere</button>
    </form>
    {error ? <p role="alert" className="mt-8 rounded-xl bg-red-50 p-4">Proizvodi trenutno nisu dostupni.</p> : products?.length ? <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-testid="product-grid">{products.map((product)=><article key={product.slug} className="flex min-w-0 flex-col rounded-3xl border border-[#17301f]/15 bg-white/70 p-5">
      <ProductImage imagePath={product.image_path} name={product.name} sizes="(max-width: 640px) 100vw, 33vw" />
      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#5b6960]">Artikal {product.article_number}</p><h2 className="mt-2 text-xl font-bold">{product.name}</h2>
      <p className="mt-2 text-sm text-[#5b6960]">{product.package_content ?? "Sadržaj pakovanja na upit"}</p><p className="mt-4 font-bold">{formatEurPrice(product.catalogue_price_eur)}</p>
      <Link className="button-primary mt-5" href={`/proizvodi/${product.slug}`}>Pogledaj proizvod</Link>
    </article>)}</div> : <section className="empty-state" data-testid="empty-product-catalogue"><h2 className="text-xl font-bold">Katalog proizvoda je u pripremi.</h2><p className="mt-2 text-sm text-[#5b6960]">Objavićemo samo proverene i aktivne proizvode.</p><Link className="button-secondary mt-5" href="/kontakt">Pošalji opšti upit</Link></section>}
  </div></main>;
}

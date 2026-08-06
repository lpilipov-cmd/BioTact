import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductImage } from "@/components/public/product-image";
import { formatEurPrice } from "@/lib/products/format";
import { createClient } from "@/lib/supabase/server";

type Props = Readonly<{ params: Promise<{ slug: string }> }>;
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const supabase = await createClient();
  const { data } = await supabase.from("products").select("name,short_description").eq("slug", slug).eq("active", true).maybeSingle();
  return data ? { title: data.name, description: data.short_description ?? `Informacije o proizvodu ${data.name}.`, alternates: { canonical: `/proizvodi/${slug}` } } : { title: "Proizvod nije pronađen" };
}
export default async function ProductPage({ params }: Props) {
  const { slug } = await params; if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) notFound();
  const supabase = await createClient();
  const { data: product, error } = await supabase.from("products").select("id,slug,name,article_number,short_description,package_content,catalogue_price_eur,currency,image_path").eq("slug", slug).eq("active", true).maybeSingle();
  if (!product && !error) notFound(); if (!product) return <main className="min-h-screen p-6"><p role="alert">Proizvod trenutno nije dostupan.</p></main>;
  const { data: relationships } = await supabase.from("package_products").select("package:packages(slug,name)").eq("product_id", product.id).order("sort_order");
  return <main id="glavni-sadrzaj" className="min-h-screen px-4 py-12 sm:px-6"><article className="mx-auto max-w-4xl"><Link href="/proizvodi" className="font-semibold underline">← Nazad na proizvode</Link>
    <div className="mt-6 grid gap-8 rounded-3xl border border-[#17301f]/15 bg-white/70 p-6 md:grid-cols-2 sm:p-9"><ProductImage imagePath={product.image_path} name={product.name} sizes="(max-width: 768px) 100vw, 50vw" />
      <div><p className="eyebrow">Artikal {product.article_number}</p><h1 className="mt-3 text-4xl font-bold">{product.name}</h1><p className="mt-4 text-[#5b6960]">{product.package_content ?? "Sadržaj pakovanja na upit"}</p><p className="mt-6 leading-7">{product.short_description ?? "Detaljan neutralan opis biće objavljen nakon provere sadržaja."}</p><p className="mt-6 text-2xl font-bold">{formatEurPrice(product.catalogue_price_eur)}</p><Link href={`/kontakt?product=${encodeURIComponent(product.slug)}`} className="button-primary mt-5">Pošalji upit</Link></div>
    </div>
    {relationships?.length ? <section className="mt-8"><h2 className="text-2xl font-bold">Povezani BIOTACT paketi</h2><ul className="mt-4 grid gap-2">{relationships.flatMap((item) => item.package ? [<li key={item.package.slug}><Link className="underline" href={`/paketi/${item.package.slug}`}>{item.package.name}</Link></li>] : [])}</ul></section> : null}
    <aside className="mt-8 rounded-xl border border-[#17301f]/15 bg-[#f7f3ea] p-4 text-sm leading-6 text-[#5b6960]">Dodaci ishrani nisu zamena za raznovrsnu ishranu i zdrav način života. Informacije ne zamenjuju savet kvalifikovanog zdravstvenog stručnjaka.</aside>
  </article></main>;
}

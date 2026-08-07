import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetail } from "@/components/public/product-detail";
import { createClient } from "@/lib/supabase/server";

type Props = Readonly<{ params: Promise<{ slug: string }> }>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("name,short_description").eq("slug", slug).eq("active", true).maybeSingle();
  return data ? { title: data.name, description: data.short_description ?? `Informacije o proizvodu ${data.name}.`, alternates: { canonical: `/proizvodi/${slug}` } } : { title: "Proizvod nije pronađen" };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) notFound();
  const supabase = await createClient();
  const { data: product, error } = await supabase.from("products").select("id,slug,name,article_number,category,subcategory,short_description,package_content,catalogue_price_eur,image_path").eq("slug", slug).eq("active", true).maybeSingle();
  if (!product && !error) notFound();
  if (!product) return <main className="min-h-screen p-6"><p role="alert">Proizvod trenutno nije dostupan.</p></main>;
  const [{ data: related }, { data: relationships }] = await Promise.all([
    supabase.from("products").select("slug,name,category,subcategory,short_description,package_content,catalogue_price_eur,image_path").eq("active", true).eq("subcategory", product.subcategory ?? "").neq("id", product.id).limit(3),
    supabase.from("package_products").select("package:packages(slug,name)").eq("product_id", product.id).order("sort_order"),
  ]);
  const relatedPackages = relationships?.flatMap((item) => item.package ? [item.package] : []) ?? [];
  return <ProductDetail product={product} relatedProducts={related ?? []} relatedPackages={relatedPackages} />;
}

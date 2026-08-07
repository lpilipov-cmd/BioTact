import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetail } from "@/components/public/product-detail";
import { requireAdministrator } from "@/lib/auth/admin";

export const metadata: Metadata = { title: "Pregled proizvoda", robots: { index: false, follow: false } };
type Props = Readonly<{ params: Promise<{ slug: string }> }>;

export default async function ProductPreviewDetailPage({ params }: Props) {
  const { slug } = await params;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) notFound();
  const { supabase } = await requireAdministrator();
  const { data: product, error } = await supabase.from("products").select("id,slug,name,article_number,category,subcategory,short_description,package_content,catalogue_price_eur,image_path").eq("slug", slug).maybeSingle();
  if (error || !product) notFound();
  const [{ data: related }, { data: relationships }] = await Promise.all([
    supabase.from("products").select("slug,name,category,subcategory,short_description,package_content,catalogue_price_eur,image_path").eq("subcategory", product.subcategory ?? "").neq("id", product.id).limit(3),
    supabase.from("package_products").select("package:packages(slug,name)").eq("product_id", product.id).order("sort_order"),
  ]);
  return <ProductDetail product={product} relatedProducts={related ?? []} relatedPackages={relationships?.flatMap((item) => item.package ? [item.package] : []) ?? []} cataloguePath="/admin/products/preview" detailBasePath="/admin/products/preview" preview />;
}

import type { Metadata } from "next";

import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { StorefrontPage } from "@/components/storefront/storefront-page";
import { requireAdministrator } from "@/lib/auth/admin";
import { buildStorefrontPackages } from "@/lib/storefront/data";

export const metadata: Metadata = { title: "Pregled BIOTACT prodavnice", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function StorefrontPreviewPage() {
  const { supabase } = await requireAdministrator();
  const [{ data: products }, { data: packages }] = await Promise.all([
    supabase.from("products").select("slug,article_number,name,category,subcategory,short_description,package_content,catalogue_price_eur,image_path").order("sort_order").order("name"),
    supabase.from("packages").select("id,slug,name,category,description,price_rsd").order("sort_order").order("name").limit(4),
  ]);
  const packageIds = (packages ?? []).map((item) => item.id);
  const { data: relations } = packageIds.length ? await supabase.from("package_products").select("package_id,sort_order,product:products(article_number,slug,name,package_content,catalogue_price_eur,image_path)").in("package_id", packageIds).order("sort_order") : { data: [] };
  return <div className="flex min-h-screen flex-col"><a href="#glavni-sadrzaj" className="skip-link">Pređi na glavni sadržaj</a><SiteHeader /><div className="flex-1"><StorefrontPage products={products ?? []} packages={buildStorefrontPackages(packages ?? [], relations ?? [])} cataloguePath="/admin/products/preview" detailBasePath="/admin/products/preview" preview /></div><SiteFooter /></div>;
}

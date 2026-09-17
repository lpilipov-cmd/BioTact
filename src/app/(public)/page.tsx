import type { Metadata } from "next";
import { StorefrontPage } from "@/components/storefront/storefront-page";
import { buildStorefrontPackages } from "@/lib/storefront/data";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: { absolute: "BIOTACT | Priroda. Nauka. Poverenje." },
  description: "Istražite proverene LR wellness proizvode, BIOTACT pakete i ličnu podršku pri izboru.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "BIOTACT | Priroda. Nauka. Poverenje.",
    description: "Provereni wellness proizvodi, jasna selekcija i lični kontakt.",
    url: "/",
  },
};

export default async function Home() {
  const supabase = await createClient();
  const [{ data: products }, { data: packages }] = await Promise.all([
    supabase.from("products").select("slug,article_number,name,category,subcategory,short_description,package_content,catalogue_price_eur,image_path").eq("active", true).order("sort_order").order("name").limit(8),
    supabase.from("packages").select("id,slug,name,category,description,price_rsd").eq("active", true).order("sort_order").order("name").limit(4),
  ]);
  const packageIds = (packages ?? []).map((item) => item.id);
  const { data: relations } = packageIds.length ? await supabase.from("package_products").select("package_id,sort_order,product:products(article_number,slug,name,package_content,catalogue_price_eur,image_path)").in("package_id", packageIds).order("sort_order") : { data: [] };
  return <StorefrontPage products={products ?? []} packages={buildStorefrontPackages(packages ?? [], relations ?? [])} />;
}

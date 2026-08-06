import { createClient } from "@/lib/supabase/server";

export async function getActivePackageBySlug(slug: string) {
  const supabase = await createClient();
  return supabase
    .from("packages")
    .select("slug,name,category,description,product_codes,price_rsd")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
}

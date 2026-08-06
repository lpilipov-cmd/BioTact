import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { getSupabaseEnvironment } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export async function getActivePackageBySlug(slug: string) {
  const supabase = await createClient();
  return supabase
    .from("packages")
    .select("slug,name,category,description,product_codes,price_rsd")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
}

export async function getActivePackageSlugs() {
  const { url, key } = getSupabaseEnvironment();
  const supabase = createSupabaseClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  return supabase
    .from("packages")
    .select("slug,updated_at")
    .eq("active", true)
    .order("sort_order", { ascending: true });
}

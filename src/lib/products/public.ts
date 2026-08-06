import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnvironment } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

export function getActiveProductSlugs() {
  const { url, key } = getSupabaseEnvironment();
  const client = createSupabaseClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  return client.from("products").select("slug,updated_at").eq("active", true).order("sort_order");
}

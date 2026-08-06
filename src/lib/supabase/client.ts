import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnvironment } from "@/lib/env";

import type { Database } from "./database.types";

export function createClient() {
  const { url, key } = getSupabaseEnvironment();

  return createBrowserClient<Database>(url, key);
}

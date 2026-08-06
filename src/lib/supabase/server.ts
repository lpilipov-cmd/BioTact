import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabaseEnvironment } from "@/lib/env";

import type { Database } from "./database.types";

export async function createClient() {
  const cookieStore = await cookies();
  const { url, key } = getSupabaseEnvironment();

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. The Next.js proxy refreshes
          // sessions before protected routes reach a Server Component.
        }
      },
    },
  });
}

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function getAdministrator() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("admin_profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return null;
  }

  return { supabase, user };
}

export async function requireAdministrator() {
  const administrator = await getAdministrator();

  if (!administrator) {
    redirect("/admin/login?reason=pristup");
  }

  return administrator;
}

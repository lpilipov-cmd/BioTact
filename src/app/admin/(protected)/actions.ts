"use server";

import { redirect } from "next/navigation";

import { requireAdministrator } from "@/lib/auth/admin";

export async function logoutAction() {
  const { supabase } = await requireAdministrator();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

"use server";

import { redirect } from "next/navigation";

import { validateLoginInput } from "@/lib/auth/login";
import { createClient } from "@/lib/supabase/server";

import type { LoginState } from "./login-state";

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const validation = validateLoginInput({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validation.success) {
    return { message: validation.message };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(
    validation.data,
  );

  if (error || !data.user) {
    return { message: "Email ili lozinka nisu ispravni." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("admin_profiles")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    return { message: "Nalog nema administratorski pristup." };
  }

  redirect("/admin");
}

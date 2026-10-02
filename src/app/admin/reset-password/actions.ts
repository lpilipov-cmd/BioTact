"use server";

import { redirect } from "next/navigation";

import { getAdministrator } from "@/lib/auth/admin";
import { validateNewPassword } from "@/lib/auth/recovery";

import type { ResetPasswordState } from "./reset-password-state";

export async function resetPasswordAction(
  _previousState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const validation = validateNewPassword({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validation.success) {
    return { message: validation.message };
  }

  const administrator = await getAdministrator();

  if (!administrator) {
    return {
      message: "Link za oporavak nije važeći ili je istekao. Zatražite novi link.",
    };
  }

  const { error } = await administrator.supabase.auth.updateUser({
    password: validation.data.password,
  });

  if (error) {
    return {
      message: "Lozinku nije moguće promeniti. Zatražite novi link i pokušajte ponovo.",
    };
  }

  await administrator.supabase.auth.signOut();
  redirect("/admin/login?reset=uspesno");
}

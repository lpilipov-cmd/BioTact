"use server";

import { getSiteUrl } from "@/lib/env";
import {
  getRecoveryCallbackUrl,
  validateRecoveryEmail,
} from "@/lib/auth/recovery";
import { createClient } from "@/lib/supabase/server";

import type { RecoveryState } from "./recovery-state";

const neutralSuccessMessage =
  "Ako nalog postoji, poslali smo poruku sa bezbednim linkom za promenu lozinke.";

export async function requestPasswordRecoveryAction(
  _previousState: RecoveryState,
  formData: FormData,
): Promise<RecoveryState> {
  const validation = validateRecoveryEmail({ email: formData.get("email") });

  if (!validation.success) {
    return { message: validation.message, success: false };
  }

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(validation.data.email, {
    redirectTo: getRecoveryCallbackUrl(getSiteUrl()),
  });

  return { message: neutralSuccessMessage, success: true };
}

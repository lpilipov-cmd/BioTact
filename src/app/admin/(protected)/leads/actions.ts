"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdministrator } from "@/lib/auth/admin";
import { leadStatusSchema } from "@/lib/leads/constants";

import type { LeadStatusState } from "./status-state";

const updateLeadStatusSchema = z.object({
  leadId: z.uuid(),
  status: leadStatusSchema,
});

export async function updateLeadStatusAction(
  _previousState: LeadStatusState,
  formData: FormData,
): Promise<LeadStatusState> {
  const { supabase } = await requireAdministrator();
  const input = updateLeadStatusSchema.safeParse({
    leadId: formData.get("leadId"),
    status: formData.get("status"),
  });

  if (!input.success) {
    return { status: "error", message: "Izabrani status nije ispravan." };
  }

  const { data, error } = await supabase
    .from("leads")
    .update({ status: input.data.status })
    .eq("id", input.data.leadId)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return {
      status: "error",
      message: "Status nije sačuvan. Pokušajte ponovo.",
    };
  }

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${input.data.leadId}`);

  return { status: "success", message: "Status je uspešno sačuvan." };
}

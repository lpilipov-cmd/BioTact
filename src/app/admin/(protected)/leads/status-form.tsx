"use client";

import { useActionState } from "react";

import {
  leadStatusLabels,
  leadStatuses,
  leadStatusSchema,
} from "@/lib/leads/constants";

import { updateLeadStatusAction } from "./actions";
import { initialLeadStatusState } from "./status-state";

export function LeadStatusForm({
  leadId,
  currentStatus,
}: Readonly<{ leadId: string; currentStatus: string }>) {
  const [state, action, pending] = useActionState(
    updateLeadStatusAction,
    initialLeadStatusState,
  );
  const parsedStatus = leadStatusSchema.safeParse(currentStatus);

  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="leadId" value={leadId} />
      <div className="flex flex-wrap gap-2">
        <label className="sr-only" htmlFor={`status-${leadId}`}>
          Status leada
        </label>
        <select
          id={`status-${leadId}`}
          name="status"
          defaultValue={parsedStatus.success ? parsedStatus.data : "novo"}
          className="min-h-10 rounded-lg border border-[#17301f]/25 bg-white px-3 text-sm"
        >
          {leadStatuses.map((status) => (
            <option key={status} value={status}>
              {leadStatusLabels[status]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={pending}
          className="min-h-10 rounded-lg bg-[#17301f] px-3 text-sm font-semibold text-[#f7f3ea] disabled:opacity-60"
        >
          {pending ? "Čuvanje…" : "Sačuvaj"}
        </button>
      </div>
      {state.message ? (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={`text-xs ${state.status === "error" ? "text-red-800" : "text-[#476050]"}`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

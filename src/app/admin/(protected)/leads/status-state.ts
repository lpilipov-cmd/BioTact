export type LeadStatusState = Readonly<{
  status: "idle" | "success" | "error";
  message: string | null;
}>;

export const initialLeadStatusState: LeadStatusState = {
  status: "idle",
  message: null,
};

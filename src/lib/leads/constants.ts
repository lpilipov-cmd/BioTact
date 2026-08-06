import { z } from "zod";

export const leadStatuses = [
  "novo",
  "kontaktiran",
  "konvertovan",
  "izgubljen",
] as const;

export const leadChannels = [
  "website",
  "instagram",
  "whatsapp",
  "referral",
] as const;

export const leadStatusSchema = z.enum(leadStatuses);
export const leadChannelSchema = z.enum(leadChannels);

export const leadStatusLabels = {
  novo: "Novo",
  kontaktiran: "Kontaktiran",
  konvertovan: "Konvertovan",
  izgubljen: "Izgubljen",
} satisfies Record<(typeof leadStatuses)[number], string>;

export const leadChannelLabels = {
  website: "Veb-sajt",
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  referral: "Preporuka",
} satisfies Record<(typeof leadChannels)[number], string>;

export function parseLeadFilters(input: {
  status?: string | string[];
  channel?: string | string[];
}) {
  const statusValue = Array.isArray(input.status) ? input.status[0] : input.status;
  const channelValue = Array.isArray(input.channel)
    ? input.channel[0]
    : input.channel;

  return {
    status: leadStatusSchema.safeParse(statusValue).data,
    channel: leadChannelSchema.safeParse(channelValue).data,
  };
}

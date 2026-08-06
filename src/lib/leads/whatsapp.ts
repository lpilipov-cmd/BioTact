import { normalizePhoneNumber } from "./contact";

export function createLeadSuccessWhatsAppLink(phone: string | undefined) {
  if (!phone) return null;
  const normalized = normalizePhoneNumber(phone);
  if (!normalized) return null;

  const message = "Zdravo, upravo sam poslao/la upit preko BIOTACT sajta.";
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

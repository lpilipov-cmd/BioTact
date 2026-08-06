import { normalizePhoneNumber } from "../leads/contact";

export function createPackageWhatsAppLink(
  phone: string | undefined,
  packageName: string,
) {
  if (!phone) return null;

  const normalized = normalizePhoneNumber(phone);
  if (!normalized) return null;

  const message = `Zdravo, želeo/la bih više informacija o BIOTACT paketu „${packageName}”.`;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

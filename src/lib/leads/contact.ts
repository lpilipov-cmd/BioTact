import { z } from "zod";

const emailSchema = z.email();
const phoneCharacters = /^[+\d\s().-]+$/;

export function normalizePhoneNumber(value: string) {
  const trimmed = value.trim();

  if (!phoneCharacters.test(trimmed)) {
    return null;
  }

  let compact = trimmed.replace(/[\s().-]/g, "");

  if (compact.startsWith("00")) {
    compact = `+${compact.slice(2)}`;
  } else if (compact.startsWith("0")) {
    compact = `+381${compact.slice(1)}`;
  } else if (compact.startsWith("381")) {
    compact = `+${compact}`;
  }

  if (!/^\+[1-9]\d{7,14}$/.test(compact)) {
    return null;
  }

  return compact.slice(1);
}

export function createContactAction(input: {
  contact: string;
  name: string;
  packageName: string;
}) {
  const contact = input.contact.trim();
  const email = emailSchema.safeParse(contact);

  if (email.success) {
    return {
      kind: "email" as const,
      href: `mailto:${encodeURIComponent(email.data)}`,
      label: "Pošalji email",
    };
  }

  const phone = normalizePhoneNumber(contact);

  if (!phone) {
    return null;
  }

  const message = `Zdravo ${input.name}, javljamo Vam se povodom Vašeg BIOTACT upita za ${input.packageName}.`;

  return {
    kind: "whatsapp" as const,
    href: `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
    label: "Otvori WhatsApp",
  };
}

import { createContactAction } from "@/lib/leads/contact";

export function ContactLink({
  contact,
  name,
  packageName,
}: Readonly<{ contact: string; name: string; packageName: string }>) {
  const action = createContactAction({ contact, name, packageName });

  if (!action) {
    return <span className="text-sm text-[#5b6960]">Kontakt nije dostupan</span>;
  }

  return (
    <a
      href={action.href}
      target={action.kind === "whatsapp" ? "_blank" : undefined}
      rel={action.kind === "whatsapp" ? "noreferrer" : undefined}
      className="inline-flex min-h-10 items-center rounded-lg border border-[#17301f] px-3 text-sm font-semibold hover:bg-[#17301f] hover:text-[#f7f3ea]"
    >
      {action.label}
    </a>
  );
}

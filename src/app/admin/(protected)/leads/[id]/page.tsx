import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { requireAdministrator } from "@/lib/auth/admin";
import {
  leadChannelLabels,
  leadChannels,
  leadStatusLabels,
  leadStatuses,
} from "@/lib/leads/constants";

import { ContactLink } from "../contact-link";
import { LeadStatusForm } from "../status-form";

type LeadDetailPageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

const dateFormatter = new Intl.DateTimeFormat("sr-Latn-RS", {
  dateStyle: "long",
  timeStyle: "medium",
});

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { supabase } = await requireAdministrator();
  const parsedId = z.uuid().safeParse((await params).id);

  if (!parsedId.success) {
    notFound();
  }

  const { data: lead, error } = await supabase
    .from("leads")
    .select(
      "id,name,contact,channel,status,message,consent_given,consent_version,consented_at,created_at,updated_at,package:packages(name)",
    )
    .eq("id", parsedId.data)
    .maybeSingle();

  if (!lead && !error) {
    notFound();
  }

  if (error || !lead) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <section role="alert" className="rounded-2xl border border-red-900/20 bg-red-50 p-6">
          <h1 className="text-xl font-bold">Lead trenutno nije dostupan.</h1>
          <p className="mt-2 text-sm">Vratite se na listu i pokušajte ponovo.</p>
          <Link href="/admin/leads" className="mt-5 inline-block font-semibold underline">
            Nazad na leadove
          </Link>
        </section>
      </main>
    );
  }

  const packageName = lead.package?.name ?? "Nije izabran paket";
  const channel = leadChannels.includes(lead.channel as (typeof leadChannels)[number])
    ? leadChannelLabels[lead.channel as (typeof leadChannels)[number]]
    : "Nepoznat kanal";
  const status = leadStatuses.includes(lead.status as (typeof leadStatuses)[number])
    ? leadStatusLabels[lead.status as (typeof leadStatuses)[number]]
    : "Nepoznat status";

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/admin/leads" className="text-sm font-semibold underline underline-offset-4">
        ← Nazad na leadove
      </Link>
      <div className="mt-6 rounded-3xl border border-[#17301f]/15 bg-white/70 p-5 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b6960]">Detalj leada</p>
        <h1 className="mt-2 break-words text-3xl font-bold tracking-tight">{lead.name}</h1>

        <dl className="mt-8 grid gap-6 sm:grid-cols-2">
          <Detail label="Kontakt" value={lead.contact} breakWords />
          <Detail label="Kanal" value={channel} />
          <Detail label="Paket / interesovanje" value={packageName} />
          <Detail label="Trenutni status" value={status} />
          <Detail label="Poruka" value={lead.message || "Nema poruke"} full />
          <Detail label="Saglasnost" value={lead.consent_given ? "Data" : "Nije data"} />
          <Detail label="Verzija saglasnosti" value={lead.consent_version} />
          <Detail
            label="Vreme saglasnosti"
            value={lead.consented_at ? dateFormatter.format(new Date(lead.consented_at)) : "Nije zabeleženo"}
          />
          <Detail label="Kreiran" value={dateFormatter.format(new Date(lead.created_at))} />
          <Detail label="Poslednja izmena" value={dateFormatter.format(new Date(lead.updated_at))} />
        </dl>

        <div className="mt-8 grid gap-6 border-t border-[#17301f]/15 pt-6 sm:grid-cols-2">
          <div>
            <h2 className="mb-3 font-bold">Promeni status</h2>
            <LeadStatusForm leadId={lead.id} currentStatus={lead.status} />
          </div>
          <div>
            <h2 className="mb-3 font-bold">Kontaktiraj lead</h2>
            <ContactLink contact={lead.contact} name={lead.name} packageName={packageName} />
          </div>
        </div>
      </div>
    </main>
  );
}

function Detail({
  label,
  value,
  full = false,
  breakWords = false,
}: Readonly<{ label: string; value: string; full?: boolean; breakWords?: boolean }>) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-[#5b6960]">{label}</dt>
      <dd className={`mt-1 whitespace-pre-wrap ${breakWords ? "break-all" : "break-words"}`}>{value}</dd>
    </div>
  );
}

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
      "id,name,contact,channel,status,request_type,message,consent_given,consent_version,consented_at,created_at,updated_at,package:packages(name),items:lead_items(id,quantity,unit_catalogue_price_eur,product_name_snapshot)",
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

  const packageName = lead.request_type === "cart_order"
    ? "Zahtev za porudžbinu"
    : lead.package?.name ?? "Nije izabran paket";
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

        {lead.request_type === "cart_order" ? (
          <section className="mt-8 border-t border-[#17301f]/15 pt-6" aria-labelledby="order-items-title">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a6b45]">Porudžbina</p>
            <h2 id="order-items-title" className="mt-2 text-2xl font-bold">Proizvodi u zahtevu</h2>
            {lead.items.length ? (
              <>
                <ul className="mt-5 grid gap-3">
                  {lead.items.map((item) => {
                    const lineTotal = Number(item.unit_catalogue_price_eur) * item.quantity;
                    return (
                      <li key={item.id} className="grid gap-2 rounded-xl border border-[#17301f]/12 bg-[#f8f3e8] p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center">
                        <strong className="break-words">{item.product_name_snapshot}</strong>
                        <span className="text-sm text-[#5b6960]">{item.quantity} × {formatAdminEur(item.unit_catalogue_price_eur)}</span>
                        <strong>{formatAdminEur(lineTotal)}</strong>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-[#17301f] px-4 py-3 text-[#f7f3ea]">
                  <span className="font-semibold">Informativno ukupno</span>
                  <strong className="text-xl">{formatAdminEur(lead.items.reduce((total, item) => total + Number(item.unit_catalogue_price_eur) * item.quantity, 0))}</strong>
                </div>
              </>
            ) : (
              <p role="alert" className="mt-4 text-sm text-red-900">Stavke porudžbine trenutno nisu dostupne.</p>
            )}
          </section>
        ) : null}

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

function formatAdminEur(value: number) {
  return new Intl.NumberFormat("sr-Latn-RS", { style: "currency", currency: "EUR" }).format(Number(value));
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

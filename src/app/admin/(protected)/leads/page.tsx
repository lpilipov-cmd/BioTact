import Link from "next/link";

import { requireAdministrator } from "@/lib/auth/admin";
import {
  leadChannelLabels,
  leadChannels,
  leadStatusLabels,
  leadStatuses,
  parseLeadFilters,
} from "@/lib/leads/constants";

import { ContactLink } from "./contact-link";
import { LeadStatusForm } from "./status-form";

type LeadsPageProps = Readonly<{
  searchParams: Promise<{
    status?: string | string[];
    channel?: string | string[];
  }>;
}>;

const dateFormatter = new Intl.DateTimeFormat("sr-Latn-RS", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const { supabase } = await requireAdministrator();
  const filters = parseLeadFilters(await searchParams);
  let query = supabase
    .from("leads")
    .select(
      "id,name,contact,channel,status,request_type,created_at,package_interest_id,package:packages(name)",
    )
    .order("created_at", { ascending: false });

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  if (filters.channel) {
    query = query.eq("channel", filters.channel);
  }

  const { data: leads, error } = await query;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b6960]">
            Administracija
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Leadovi
          </h1>
        </div>
        <p className="text-sm text-[#5b6960]">Najnoviji upiti su prikazani prvi.</p>
      </div>

      <form
        method="get"
        className="mt-8 grid gap-4 rounded-2xl border border-[#17301f]/15 bg-white/60 p-4 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end"
      >
        <label className="grid gap-1 text-sm font-semibold">
          Status
          <select
            name="status"
            defaultValue={filters.status ?? ""}
            className="min-h-11 rounded-lg border border-[#17301f]/25 bg-white px-3 font-normal"
          >
            <option value="">Svi</option>
            {leadStatuses.map((status) => (
              <option key={status} value={status}>
                {leadStatusLabels[status]}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Kanal
          <select
            name="channel"
            defaultValue={filters.channel ?? ""}
            className="min-h-11 rounded-lg border border-[#17301f]/25 bg-white px-3 font-normal"
          >
            <option value="">Svi</option>
            {leadChannels.map((channel) => (
              <option key={channel} value={channel}>
                {leadChannelLabels[channel]}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="min-h-11 rounded-lg bg-[#17301f] px-4 font-semibold text-[#f7f3ea]"
        >
          Primeni
        </button>
        <Link
          href="/admin/leads"
          className="flex min-h-11 items-center justify-center rounded-lg border border-[#17301f] px-4 font-semibold"
        >
          Svi
        </Link>
      </form>

      {error ? (
        <section role="alert" className="mt-8 rounded-2xl border border-red-900/20 bg-red-50 p-6">
          <h2 className="font-bold">Leadovi trenutno nisu dostupni.</h2>
          <p className="mt-2 text-sm">Osvežite stranicu ili pokušajte ponovo kasnije.</p>
        </section>
      ) : leads?.length ? (
        <div className="mt-8 grid gap-4" data-testid="lead-list">
          {leads.map((lead) => {
            const packageName = lead.request_type === "cart_order"
              ? "Zahtev za porudžbinu"
              : lead.package?.name ?? "Nije izabran paket";
            const channel = leadChannels.includes(
              lead.channel as (typeof leadChannels)[number],
            )
              ? leadChannelLabels[lead.channel as (typeof leadChannels)[number]]
              : "Nepoznat kanal";

            return (
              <article
                key={lead.id}
                data-testid="lead-card"
                className="min-w-0 rounded-2xl border border-[#17301f]/15 bg-white/70 p-5 shadow-sm"
              >
                <div className="grid min-w-0 gap-5 lg:grid-cols-[1.1fr_1.1fr_1.2fr_.8fr_1.25fr_1fr_auto] lg:items-start">
                  <LeadField label="Ime" value={lead.name} />
                  <LeadField label="Kontakt" value={lead.contact} breakWords />
                  <LeadField label="Paket / interesovanje" value={packageName} />
                  <LeadField label="Kanal" value={channel} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#5b6960]">Status</p>
                    <LeadStatusForm leadId={lead.id} currentStatus={lead.status} />
                  </div>
                  <LeadField label="Datum" value={dateFormatter.format(new Date(lead.created_at))} />
                  <div className="flex flex-wrap gap-2 lg:flex-col">
                    <p className="w-full text-xs font-semibold uppercase tracking-wide text-[#5b6960]">Akcija</p>
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#17301f] px-3 text-sm font-semibold text-[#f7f3ea]"
                    >
                      Detalji
                    </Link>
                    <ContactLink contact={lead.contact} name={lead.name} packageName={packageName} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <section className="mt-8 rounded-2xl border border-[#17301f]/15 bg-white/60 p-8 text-center">
          <h2 className="text-xl font-bold">Nema leadova za izabrane filtere.</h2>
          <p className="mt-2 text-sm text-[#5b6960]">Promenite filtere ili prikažite sve leadove.</p>
        </section>
      )}
    </main>
  );
}

function LeadField({
  label,
  value,
  breakWords = false,
}: Readonly<{ label: string; value: string; breakWords?: boolean }>) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#5b6960]">{label}</p>
      <p className={`mt-1 text-sm ${breakWords ? "break-all" : "break-words"}`}>{value}</p>
    </div>
  );
}

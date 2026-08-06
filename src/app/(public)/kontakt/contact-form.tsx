"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { publicLeadSchema, type PublicLeadInput } from "@/lib/leads/public-validation";
import type { Tables } from "@/lib/supabase/database.types";

type PackageOption = Readonly<{ id: string; name: string }>;
type ProductOption = Readonly<Pick<Tables<"products">, "id" | "name" | "article_number">>;

type ContactFormProps = Readonly<{
  formStartedAt: number;
  formToken: string;
  initialPackageId?: string;
  initialProductId?: string;
  packages: readonly PackageOption[];
  products: readonly ProductOption[];
  whatsappLink: string | null;
}>;

export function ContactForm({
  formStartedAt,
  formToken,
  initialPackageId,
  initialProductId,
  packages,
  products,
  whatsappLink,
}: ContactFormProps) {
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PublicLeadInput>({
    defaultValues: {
      name: "",
      contact: "",
      packageInterestId: initialPackageId ?? "",
      productInterestId: initialProductId ?? "",
      message: "",
      consent: false,
      website: "",
      formStartedAt,
      formToken,
      idempotencyKey: "",
    },
  });

  async function submit(values: PublicLeadInput) {
    setServerError(null);
    const parsed = publicLeadSchema.safeParse({
      ...values,
      formStartedAt,
      formToken,
      idempotencyKey,
    });

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && field in values) {
          setError(field as keyof PublicLeadInput, { message: issue.message });
        }
      }
      return;
    }

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = (await response.json()) as { message?: string; ok?: boolean };

      if (!response.ok || !result.ok) {
        setServerError(result.message ?? "Upit trenutno nije moguće poslati. Pokušajte ponovo.");
        return;
      }

      setSubmitted(true);
    } catch {
      setServerError("Upit trenutno nije moguće poslati. Proverite vezu i pokušajte ponovo.");
    }
  }

  if (submitted) {
    return (
      <section role="status" className="rounded-2xl border border-[#17301f]/20 bg-white/80 p-6 sm:p-8">
        <h2 className="text-2xl font-bold">Hvala. Vaš upit je uspešno poslat.</h2>
        <p className="mt-3 leading-7">Javićemo Vam se u najkraćem roku.</p>
        {whatsappLink ? (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-[#17301f] px-5 font-bold text-[#f7f3ea]"
          >
            Nastavite putem WhatsApp-a
          </a>
        ) : null}
      </section>
    );
  }

  const errorFor = (field: keyof PublicLeadInput) => {
    const message = errors[field]?.message;
    return typeof message === "string" ? <p className="mt-1 text-sm text-red-800">{message}</p> : null;
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-5 rounded-2xl border border-[#17301f]/20 bg-white/80 p-5 sm:p-8">
      <div>
        <label htmlFor="name" className="font-bold">Ime i prezime</label>
        <input id="name" autoComplete="name" maxLength={100} className="field-input mt-2" aria-invalid={Boolean(errors.name)} {...register("name")} />
        {errorFor("name")}
      </div>

      <div>
        <label htmlFor="productInterestId" className="font-bold">Proizvod (opciono)</label>
        <select id="productInterestId" className="field-input mt-2" {...register("productInterestId")}>
          <option value="">Nisam izabrao/la proizvod</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>{product.name} ({product.article_number})</option>
          ))}
        </select>
        {errorFor("productInterestId")}
      </div>

      <div>
        <label htmlFor="contact" className="font-bold">Telefon ili email</label>
        <input id="contact" autoComplete="email" maxLength={254} className="field-input mt-2" aria-invalid={Boolean(errors.contact)} {...register("contact")} />
        {errorFor("contact")}
      </div>

      <div>
        <label htmlFor="packageInterestId" className="font-bold">Paket (opciono)</label>
        <select id="packageInterestId" className="field-input mt-2" {...register("packageInterestId")}>
          <option value="">Nisam izabrao/la paket</option>
          {packages.map((packageOption) => (
            <option key={packageOption.id} value={packageOption.id}>{packageOption.name}</option>
          ))}
        </select>
        {errorFor("packageInterestId")}
      </div>

      <div>
        <label htmlFor="message" className="font-bold">Poruka (opciono)</label>
        <textarea id="message" rows={5} maxLength={2000} className="field-input mt-2 min-h-32 resize-y" {...register("message")} />
        {errorFor("message")}
      </div>

      <div className="absolute left-[-10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Veb-sajt</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <label className="flex items-start gap-3 leading-6">
        <input type="checkbox" className="mt-1 size-5 shrink-0 accent-[#17301f]" {...register("consent")} />
        <span>Saglasan/na sam da BIOTACT obradi moje podatke radi odgovora na upit.</span>
      </label>
      {errorFor("consent")}

      {serverError ? <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-900">{serverError}</p> : null}

      <button type="submit" disabled={isSubmitting} className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#17301f] px-6 font-bold text-[#f7f3ea] disabled:cursor-wait disabled:opacity-60 sm:w-auto">
        {isSubmitting ? "Slanje…" : "Pošalji upit"}
      </button>
    </form>
  );
}

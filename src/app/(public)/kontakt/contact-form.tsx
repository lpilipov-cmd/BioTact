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
  selectedContext?: Readonly<{ kind: "Paket" | "Proizvod"; name: string }>;
  whatsappLink: string | null;
}>;

export function ContactForm({
  formStartedAt,
  formToken,
  initialPackageId,
  initialProductId,
  packages,
  products,
  selectedContext,
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
      <section role="status" className="contact-success">
        <span aria-hidden="true">✓</span>
        <p className="eyebrow">Upit je primljen</p>
        <h2>Hvala. Tvoj upit je uspešno poslat.</h2>
        <p>Javićemo se u najkraćem roku putem kontakta koji si ostavio/la.</p>
        {whatsappLink ? (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="button-primary contact-success-action"
          >
            Nastavite putem WhatsApp-a
          </a>
        ) : null}
      </section>
    );
  }

  const errorFor = (field: keyof PublicLeadInput) => {
    const message = errors[field]?.message;
    return typeof message === "string" ? <p className="contact-field-error">{message}</p> : null;
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="contact-form">
      <div className="contact-form-heading">
        <p className="eyebrow">Pošalji upit</p>
        <h2>Kako možemo da pomognemo?</h2>
        <p>Polja označena zvezdicom su obavezna.</p>
      </div>

      {selectedContext ? (
        <div className="contact-selection-context" aria-label={`Upit za: ${selectedContext.name}`}>
          <span>Upit za · {selectedContext.kind}</span>
          <strong>{selectedContext.name}</strong>
        </div>
      ) : null}

      <div className="contact-field-grid">
        <div>
        <label htmlFor="name">Ime i prezime <span aria-hidden="true">*</span></label>
        <input id="name" autoComplete="name" maxLength={100} className="field-input mt-2" aria-invalid={Boolean(errors.name)} {...register("name")} />
        {errorFor("name")}
        </div>

        <div>
        <label htmlFor="contact">Telefon ili email <span aria-hidden="true">*</span></label>
        <input id="contact" autoComplete="email" maxLength={254} className="field-input mt-2" aria-invalid={Boolean(errors.contact)} {...register("contact")} />
        {errorFor("contact")}
        </div>
      </div>

      <div>
        <label htmlFor="productInterestId">Proizvod <small>(opciono)</small></label>
        <select id="productInterestId" className="field-input mt-2" {...register("productInterestId")}>
          <option value="">Nisam izabrao/la proizvod</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>{product.name}</option>
          ))}
        </select>
        {errorFor("productInterestId")}
      </div>

      <div>
        <label htmlFor="packageInterestId">Paket <small>(opciono)</small></label>
        <select id="packageInterestId" className="field-input mt-2" {...register("packageInterestId")}>
          <option value="">Nisam izabrao/la paket</option>
          {packages.map((packageOption) => (
            <option key={packageOption.id} value={packageOption.id}>{packageOption.name}</option>
          ))}
        </select>
        {errorFor("packageInterestId")}
      </div>

      <div>
        <label htmlFor="message">Poruka <small>(opciono)</small></label>
        <textarea id="message" rows={5} maxLength={2000} className="field-input mt-2 min-h-32 resize-y" {...register("message")} />
        {errorFor("message")}
      </div>

      <div className="absolute left-[-10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Veb-sajt</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <label className="contact-consent">
        <input type="checkbox" {...register("consent")} />
        <span>Saglasan/na sam da BIOTACT obradi moje podatke radi odgovora na upit.</span>
      </label>
      {errorFor("consent")}

      {serverError ? <p role="alert" className="contact-server-error">{serverError}</p> : null}

      <button type="submit" disabled={isSubmitting} className="button-primary contact-submit">
        {isSubmitting ? "Slanje…" : "Pošalji upit"}
      </button>
    </form>
  );
}

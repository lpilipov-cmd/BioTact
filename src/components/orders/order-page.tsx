"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useCart } from "@/components/cart/cart-provider";
import { cartOrderSchema, type CartOrderInput } from "@/lib/orders/validation";
import { formatEurPrice } from "@/lib/products/format";

type OrderPageProps = Readonly<{ formStartedAt: number; formToken: string }>;

export function OrderPage({ formStartedAt, formToken }: OrderPageProps) {
  const { items, totalEur, hydrated, clear } = useCart();
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CartOrderInput>({
    defaultValues: {
      name: "",
      contact: "",
      message: "",
      consent: false,
      website: "",
      formStartedAt,
      formToken,
      idempotencyKey: "",
      items: [],
    },
  });

  async function submit(values: CartOrderInput) {
    setServerError(null);
    const parsed = cartOrderSchema.safeParse({
      ...values,
      formStartedAt,
      formToken,
      idempotencyKey,
      items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
    });

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (field === "name" || field === "contact" || field === "message" || field === "consent") {
          setError(field, { message: issue.message });
        }
      }
      if (parsed.error.issues.some((issue) => issue.path[0] === "items")) {
        setServerError("Proverite proizvode u korpi i pokušajte ponovo.");
      }
      return;
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = (await response.json()) as { message?: string; ok?: boolean };

      if (!response.ok || !result.ok) {
        setServerError(result.message ?? "Porudžbinu trenutno nije moguće poslati. Pokušajte ponovo.");
        return;
      }

      clear();
      setSubmitted(true);
    } catch {
      setServerError("Porudžbinu trenutno nije moguće poslati. Proverite vezu i pokušajte ponovo.");
    }
  }

  if (!hydrated) {
    return (
      <main id="glavni-sadrzaj" className="order-page">
        <section className="order-empty" aria-live="polite"><p>Učitavamo porudžbinu…</p></section>
      </main>
    );
  }

  if (submitted) {
    return (
      <main id="glavni-sadrzaj" className="order-page">
        <section role="status" className="order-success">
          <span aria-hidden="true">✓</span>
          <p className="eyebrow">Zahtev je primljen</p>
          <h1>Hvala. Tvoja porudžbina je poslata.</h1>
          <p>BIOTACT će potvrditi dostupnost proizvoda i javiti ti naredne korake putem ostavljenog kontakta.</p>
          <Link href="/proizvodi" className="button-primary">Nastavi pregled proizvoda</Link>
        </section>
      </main>
    );
  }

  if (!items.length) {
    return (
      <main id="glavni-sadrzaj" className="order-page">
        <section className="order-empty">
          <p className="eyebrow">Porudžbina</p>
          <h1>Korpa je prazna.</h1>
          <p>Dodaj proizvode koje želiš pre nego što pošalješ zahtev za porudžbinu.</p>
          <Link href="/proizvodi" className="button-primary">Pogledaj proizvode</Link>
        </section>
      </main>
    );
  }

  const errorFor = (field: "name" | "contact" | "message" | "consent") => {
    const message = errors[field]?.message;
    return typeof message === "string" ? <p className="contact-field-error">{message}</p> : null;
  };

  return (
    <main id="glavni-sadrzaj" className="order-page">
      <header className="order-hero">
        <p className="eyebrow">Zahtev za porudžbinu</p>
        <h1>Završi porudžbinu</h1>
        <p>Unesi kontakt podatke i proveri proizvode pre slanja zahteva.</p>
      </header>

      <div className="order-layout">
        <form onSubmit={handleSubmit(submit)} noValidate className="order-form">
          <div className="order-form-heading">
            <p className="eyebrow">Podaci za kontakt</p>
            <h2>Kako da ti se javimo?</h2>
            <p>Polja označena zvezdicom su obavezna.</p>
          </div>

          <div className="contact-field-grid">
            <div>
              <label htmlFor="order-name">Ime i prezime <span aria-hidden="true">*</span></label>
              <input id="order-name" autoComplete="name" maxLength={100} className="field-input mt-2" aria-invalid={Boolean(errors.name)} {...register("name")} />
              {errorFor("name")}
            </div>
            <div>
              <label htmlFor="order-contact">Telefon ili email <span aria-hidden="true">*</span></label>
              <input id="order-contact" autoComplete="email" maxLength={254} className="field-input mt-2" aria-invalid={Boolean(errors.contact)} {...register("contact")} />
              {errorFor("contact")}
            </div>
          </div>

          <div>
            <label htmlFor="order-message">Napomena <small>(opciono)</small></label>
            <textarea id="order-message" rows={5} maxLength={2000} className="field-input mt-2 min-h-32 resize-y" {...register("message")} />
            {errorFor("message")}
          </div>

          <div className="absolute left-[-10000px] h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="order-website">Veb-sajt</label>
            <input id="order-website" tabIndex={-1} autoComplete="off" {...register("website")} />
          </div>

          <label className="contact-consent">
            <input type="checkbox" {...register("consent")} />
            <span>Saglasan/na sam da BIOTACT obradi moje podatke radi obrade zahteva za porudžbinu.</span>
          </label>
          {errorFor("consent")}

          <p className="order-expectation">Ovim šalješ zahtev za porudžbinu. BIOTACT će potvrditi dostupnost i naredne korake.</p>
          {serverError ? <p role="alert" className="contact-server-error">{serverError}</p> : null}
          <button type="submit" disabled={isSubmitting} className="button-primary order-submit">
            {isSubmitting ? "Slanje…" : "Pošalji porudžbinu"}
          </button>
        </form>

        <aside className="order-summary" aria-labelledby="order-summary-title">
          <p className="eyebrow text-[#dbc487]!">Tvoja korpa</p>
          <h2 id="order-summary-title">Pregled porudžbine</h2>
          <ul>
            {items.map((item) => (
              <li key={item.id} className="order-summary-item">
                <Link href={`/proizvodi/${item.slug}`} className="order-summary-image" aria-label={`Pogledaj ${item.name}`}>
                  {item.imagePath ? <Image src={item.imagePath} alt={item.name} fill sizes="5rem" /> : <span aria-hidden="true">B</span>}
                </Link>
                <div>
                  <h3><Link href={`/proizvodi/${item.slug}`}>{item.name}</Link></h3>
                  <p>{item.quantity} × {formatEurPrice(item.priceEur)}</p>
                </div>
                <strong>{formatEurPrice(item.quantity * item.priceEur)}</strong>
              </li>
            ))}
          </ul>
          <div className="order-summary-total"><span>Ukupno</span><strong>{formatEurPrice(totalEur)}</strong></div>
          <p className="order-summary-note">Informativni zbir javnih kataloških EUR cena. Plaćanje se ne vrši ovom formom.</p>
          <Link href="/korpa" className="order-edit-cart">← Izmeni korpu</Link>
        </aside>
      </div>
    </main>
  );
}

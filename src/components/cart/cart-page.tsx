"use client";

import Image from "next/image";
import Link from "next/link";

import { formatEurPrice } from "@/lib/products/format";

import { useCart } from "./cart-provider";

export function CartPage() {
  const { items, totalEur, hydrated, increase, decrease, remove, clear } = useCart();

  return (
    <main id="glavni-sadrzaj" className="cart-page">
      <header className="cart-hero">
        <p className="eyebrow text-[#dbc487]!">Vaš izbor</p>
        <h1>Korpa</h1>
        <p>Pregledajte odabrane proizvode pre nego što nastavite na dogovor o porudžbini.</p>
      </header>

      <div className="cart-layout">
        {!hydrated ? (
          <section className="cart-empty" aria-live="polite">
            <p>Učitavamo korpu…</p>
          </section>
        ) : items.length ? (
          <section className="cart-items" aria-label="Proizvodi u korpi">
            <div className="cart-items-heading">
              <h2>Odabrani proizvodi</h2>
              <button type="button" onClick={clear}>Isprazni korpu</button>
            </div>
            <ul>
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  <Link href={`/proizvodi/${item.slug}`} className="cart-item-image" aria-label={`Pogledaj ${item.name}`}>
                    {item.imagePath ? (
                      <Image src={item.imagePath} alt={item.name} fill sizes="(max-width: 640px) 6rem, 8rem" />
                    ) : (
                      <span aria-hidden="true">B</span>
                    )}
                  </Link>
                  <div className="cart-item-details">
                    <h2><Link href={`/proizvodi/${item.slug}`}>{item.name}</Link></h2>
                    <p>{formatEurPrice(item.priceEur)} po komadu</p>
                    <button type="button" className="cart-remove" onClick={() => remove(item.id)}>Ukloni</button>
                  </div>
                  <div className="cart-quantity" aria-label={`Količina za ${item.name}`}>
                    <button type="button" onClick={() => decrease(item.id)} disabled={item.quantity <= 1} aria-label={`Smanji količinu za ${item.name}`}>−</button>
                    <span aria-live="polite">{item.quantity}</span>
                    <button type="button" onClick={() => increase(item.id)} aria-label={`Povećaj količinu za ${item.name}`}>+</button>
                  </div>
                  <p className="cart-line-total">{formatEurPrice(item.priceEur * item.quantity)}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <section className="cart-empty">
            <p className="eyebrow">Korpa je prazna</p>
            <h2>Pronađite proizvod za svoju rutinu.</h2>
            <p>Možete mirno istražiti katalog i vratiti se ovde kada napravite izbor.</p>
            <Link href="/proizvodi" className="button-primary">Pogledaj proizvode</Link>
          </section>
        )}

        {hydrated && items.length ? (
          <aside className="cart-summary" aria-labelledby="cart-summary-heading">
            <p className="eyebrow text-[#dbc487]!">Pregled korpe</p>
            <h2 id="cart-summary-heading">Ukupno</h2>
            <p className="cart-total">{formatEurPrice(totalEur)}</p>
            <p className="cart-total-note">Informativni zbir kataloških EUR cena. Dostupnost i konačni koraci potvrđuju se direktno sa BIOTACT podrškom.</p>
            <div className="cart-summary-actions">
              <Link href="/proizvodi" className="button-outline-light">Nastavi kupovinu</Link>
              <Link href="/kontakt?source=cart" className="button-gold">Nastavi na porudžbinu</Link>
            </div>
            <p className="cart-checkout-note">Plaćanje karticom i samostalni checkout još nisu dostupni.</p>
          </aside>
        ) : null}
      </div>
    </main>
  );
}

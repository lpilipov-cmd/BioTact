"use client";

import Link from "next/link";

import { useOptionalCart } from "./cart-provider";

export function CartLink() {
  const cart = useOptionalCart();
  const count = cart?.hydrated ? cart.itemCount : 0;

  return (
    <Link href="/korpa" className="site-cart-link" aria-label={`Korpa (${count})`}>
      <svg aria-hidden="true" viewBox="0 0 24 24" width="19" height="19" fill="none">
        <path d="M3.5 4.5h2l1.7 9.2a2 2 0 0 0 2 1.65h7.65a2 2 0 0 0 1.93-1.48L20.5 7H6.05" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9.5" cy="19" r="1.25" fill="currentColor" />
        <circle cx="17" cy="19" r="1.25" fill="currentColor" />
      </svg>
      <span>Korpa</span>
      <strong aria-live="polite">{count}</strong>
    </Link>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";

import type { CartProduct } from "@/lib/cart/cart";

import { useCart } from "./cart-provider";

export function AddToCart({ product }: Readonly<{ product: CartProduct }>) {
  const { addProduct } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <div className="product-detail-cart-action">
      <button
        type="button"
        className="button-primary product-detail-action"
        onClick={() => {
          addProduct(product);
          setAdded(true);
        }}
      >
        Dodaj u korpu
      </button>
      {added ? (
        <div className="product-cart-feedback" role="status">
          <p>Proizvod je dodat u korpu.</p>
          <div>
            <Link href="/proizvodi">Nastavi kupovinu</Link>
            <Link href="/korpa">Pogledaj korpu</Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

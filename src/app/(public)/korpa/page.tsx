import type { Metadata } from "next";

import { CartPage } from "@/components/cart/cart-page";

export const metadata: Metadata = {
  title: "Korpa",
  description: "Pregled proizvoda odabranih u BIOTACT korpi.",
  alternates: { canonical: "/korpa" },
};

export default function ShoppingCartPage() {
  return <CartPage />;
}

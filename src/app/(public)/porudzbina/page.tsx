import type { Metadata } from "next";

import { OrderPage } from "@/components/orders/order-page";
import { getLeadRateLimitSalt } from "@/lib/env";
import { createLeadFormProof } from "@/lib/leads/protection";

export const metadata: Metadata = {
  title: "Porudžbina",
  description: "Pošaljite BIOTACT zahtev za porudžbinu proizvoda iz korpe.",
  alternates: { canonical: "/porudzbina" },
};

export default function CartOrderPage() {
  const proof = createLeadFormProof(getLeadRateLimitSalt());
  return <OrderPage formStartedAt={proof.formStartedAt} formToken={proof.formToken} />;
}

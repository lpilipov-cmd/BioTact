export function formatEurPrice(value: number | null) {
  if (value === null) return "Cena na upit";
  return new Intl.NumberFormat("sr-Latn-RS", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(value);
}

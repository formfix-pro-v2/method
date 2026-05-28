// Billing utilities — Paddle integration

export function formatPrice(amount: number, currency = "EUR"): string {
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

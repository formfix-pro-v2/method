// Billing utilities — LemonSqueezy integration

export async function startCheckout(plan: "glow" | "elite") {
  return {
    success: true,
    redirect: `/checkout?plan=${plan}`,
  };
}

export function formatPrice(amount: number, currency = "EUR"): string {
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

// ============================================================
// PADDLE BILLING INTEGRATION
// Merchant-of-record payment provider
// ============================================================

const PADDLE_API_BASE = process.env.NEXT_PUBLIC_PADDLE_ENV === "production"
  ? "https://api.paddle.com"
  : "https://sandbox-api.paddle.com";

export const PADDLE_PLANS = {
  glow: {
    priceId: process.env.NEXT_PUBLIC_PADDLE_GLOW_PRICE_ID || "",
    name: "Veronica Glow",
    price: 29,
  },
  elite: {
    priceId: process.env.NEXT_PUBLIC_PADDLE_ELITE_PRICE_ID || "",
    name: "Veronica Elite",
    price: 79,
  },
} as const;

export async function createPaddleCustomer(email: string, userId: string) {
  const res = await fetch(`${PADDLE_API_BASE}/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
    },
    body: JSON.stringify({
      email,
      custom_data: { user_id: userId },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Paddle create customer failed: ${res.status} ${text}`);
  }

  return res.json();
}

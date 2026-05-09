const API_URL = "https://api.lemonsqueezy.com/v1";

function getHeaders() {
  const key = process.env.LEMONSQUEEZY_API_KEY;
  if (!key) throw new Error("LEMONSQUEEZY_API_KEY is not set");

  return {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
    Authorization: `Bearer ${key}`,
  };
}

export const LEMON_PLANS = {
  glow: {
    variantId: process.env.LEMONSQUEEZY_GLOW_VARIANT_ID || "",
    name: "Veronica Glow",
    price: 29,
  },
  elite: {
    variantId: process.env.LEMONSQUEEZY_ELITE_VARIANT_ID || "",
    name: "Veronica Elite",
    price: 79,
  },
} as const;

export async function createCheckout(
  variantId: string,
  options: {
    email?: string;
    userId?: string;
    plan?: string;
    successUrl?: string;
    cancelUrl?: string;
  }
) {
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  if (!storeId) throw new Error("LEMONSQUEEZY_STORE_ID is not set");

  const body = {
    data: {
      type: "checkouts",
      attributes: {
        checkout_options: {
          embed: false,
          media: false,
          button_color: "#d8a7b5",
        },
        checkout_data: {
          email: options.email || undefined,
          custom: {
            user_id: options.userId || "",
            plan: options.plan || "",
          },
        },
        product_options: {
          redirect_url: options.successUrl || "",
        },
      },
      relationships: {
        store: {
          data: { type: "stores", id: storeId },
        },
        variant: {
          data: { type: "variants", id: variantId },
        },
      },
    },
  };

  const res = await fetch(`${API_URL}/checkouts`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Lemon Squeezy error: ${err}`);
  }

  const data = await res.json();
  return data.data.attributes.url as string;
}

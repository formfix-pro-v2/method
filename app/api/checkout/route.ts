import { NextResponse } from "next/server";
import { createCheckout, LEMON_PLANS } from "@/lib/lemonsqueezy";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const body = await request.json();
  const planId = body.plan as "glow" | "elite";

  if (!["glow", "elite"].includes(planId)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const plan = LEMON_PLANS[planId];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const checkoutUrl = await createCheckout(plan.variantId, {
      email: user?.email || undefined,
      userId: user?.id || "",
      plan: planId,
      successUrl: `${appUrl}/checkout/success?plan=${planId}`,
      cancelUrl: `${appUrl}/checkout?plan=${planId}`,
    });

    return NextResponse.json({ url: checkoutUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Checkout error";
    console.error("Checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

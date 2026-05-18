import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PADDLE_PLANS } from "@/lib/paddle";

export const dynamic = "force-dynamic";

// POST /api/checkout - Returns Paddle price ID for client-side checkout
// Paddle uses client-side overlay checkout, so this just validates and returns config
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

  const plan = PADDLE_PLANS[planId];

  if (!plan.priceId) {
    return NextResponse.json(
      { error: "Price ID not configured for this plan" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    priceId: plan.priceId,
    planName: plan.name,
    email: user?.email || null,
    userId: user?.id || null,
  });
}

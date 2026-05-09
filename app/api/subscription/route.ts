import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { subscriptionSchema, validateBody } from "@/lib/validations";
import { checkRateLimit, getRateLimitKey, rateLimitResponse, AUTH_LIMIT } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// POST /api/subscription - Activate a subscription
export async function POST(request: Request) {
  const rlKey = getRateLimitKey(request, "subscription");
  const rl = checkRateLimit(rlKey, AUTH_LIMIT);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: body, error: validationError } = await validateBody(request, subscriptionSchema);
  if (validationError) return validationError;

  const durationDays = body.plan === "elite" ? 90 : 30;
  const now = new Date();
  const expiry = new Date(now);
  expiry.setDate(expiry.getDate() + durationDays);

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        email: user.email,
        plan: body.plan,
        premium: true,
        current_day: 1,
        purchase_date: now.toISOString(),
        expiry_date: expiry.toISOString(),
        updated_at: now.toISOString(),
      },
      { onConflict: "id" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ subscription: data });
}

// DELETE /api/subscription - Cancel subscription
export async function DELETE() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("profiles")
    .update({ premium: false, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

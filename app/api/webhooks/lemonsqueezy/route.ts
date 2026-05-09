import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export const dynamic = "force-dynamic";

// ============================================================
// LEMONSQUEEZY WEBHOOK — with signature verification
// ============================================================
// Set LEMONSQUEEZY_WEBHOOK_SECRET in your environment variables.
// Find it in LemonSqueezy Dashboard → Settings → Webhooks.
// ============================================================

export async function POST(request: Request) {
  // 1. Read raw body for signature verification
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  // 2. Verify webhook signature
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[LemonSqueezy] LEMONSQUEEZY_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  if (!signature) {
    console.warn("[LemonSqueezy] Missing x-signature header");
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(rawBody);
  const digest = hmac.digest("hex");

  if (!crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))) {
    console.warn("[LemonSqueezy] Invalid webhook signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // 3. Parse verified body
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const meta = body.meta as Record<string, unknown> | undefined;
  const eventName = meta?.event_name;

  console.log(`[LemonSqueezy] Event: ${eventName}`);

  // 4. Handle events
  if (eventName === "order_created") {
    return handleOrderCreated(body);
  }

  if (eventName === "subscription_updated") {
    return handleSubscriptionUpdated(body);
  }

  if (eventName === "subscription_cancelled") {
    return handleSubscriptionCancelled(body);
  }

  // Acknowledge unhandled events
  return NextResponse.json({ received: true });
}

// ============================================================
// EVENT HANDLERS
// ============================================================

async function handleOrderCreated(body: Record<string, unknown>) {
  const meta = body.meta as Record<string, unknown>;
  const customData = (meta?.custom_data || {}) as Record<string, string>;
  const userId = customData.user_id;
  const plan = customData.plan as "glow" | "elite";

  const data = body.data as Record<string, unknown>;
  const attributes = (data?.attributes || {}) as Record<string, unknown>;
  const email = attributes.user_email as string | undefined;
  const orderId = attributes.order_number || attributes.identifier;

  if (!plan || !["glow", "elite"].includes(plan)) {
    console.warn(`[LemonSqueezy] Invalid plan in order: ${plan}`);
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const durationDays = plan === "elite" ? 90 : 30;
  const now = new Date();
  const expiry = new Date(now);
  expiry.setDate(expiry.getDate() + durationDays);

  if (userId) {
    try {
      const supabase = getSupabaseAdmin();

      await supabase.from("profiles").upsert(
        {
          id: userId,
          email: email || undefined,
          plan,
          premium: true,
          current_day: 1,
          purchase_date: now.toISOString(),
          expiry_date: expiry.toISOString(),
          updated_at: now.toISOString(),
        },
        { onConflict: "id" }
      );

      console.log(`[LemonSqueezy] Activated ${plan} for user ${userId} (order: ${orderId})`);
    } catch (err) {
      console.error("[LemonSqueezy] Failed to activate subscription:", err);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  } else {
    console.warn(`[LemonSqueezy] Order ${orderId} has no user_id in custom_data`);
  }

  return NextResponse.json({ received: true });
}

async function handleSubscriptionUpdated(body: Record<string, unknown>) {
  const meta = body.meta as Record<string, unknown>;
  const customData = (meta?.custom_data || {}) as Record<string, string>;
  const userId = customData.user_id;

  if (!userId) return NextResponse.json({ received: true });

  const data = body.data as Record<string, unknown>;
  const attributes = (data?.attributes || {}) as Record<string, unknown>;
  const status = attributes.status as string;

  try {
    const supabase = getSupabaseAdmin();

    if (status === "active") {
      await supabase.from("profiles").update({
        premium: true,
        updated_at: new Date().toISOString(),
      }).eq("id", userId);
    } else if (status === "paused" || status === "past_due" || status === "unpaid") {
      await supabase.from("profiles").update({
        premium: false,
        updated_at: new Date().toISOString(),
      }).eq("id", userId);
    }

    console.log(`[LemonSqueezy] Subscription ${status} for user ${userId}`);
  } catch (err) {
    console.error("[LemonSqueezy] Failed to update subscription:", err);
  }

  return NextResponse.json({ received: true });
}

async function handleSubscriptionCancelled(body: Record<string, unknown>) {
  const meta = body.meta as Record<string, unknown>;
  const customData = (meta?.custom_data || {}) as Record<string, string>;
  const userId = customData.user_id;

  if (!userId) return NextResponse.json({ received: true });

  try {
    const supabase = getSupabaseAdmin();

    await supabase.from("profiles").update({
      premium: false,
      updated_at: new Date().toISOString(),
    }).eq("id", userId);

    console.log(`[LemonSqueezy] Subscription cancelled for user ${userId}`);
  } catch (err) {
    console.error("[LemonSqueezy] Failed to cancel subscription:", err);
  }

  return NextResponse.json({ received: true });
}

// ============================================================
// SUPABASE ADMIN CLIENT (uses service role key for webhooks)
// ============================================================
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Fall back to anon key if service role not available
  const key = serviceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase credentials not configured");
  }

  return createClient(url, key);
}

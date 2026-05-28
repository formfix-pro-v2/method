import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Verifies Paddle webhook signature (HMAC SHA256).
 */
function verifySignature(rawBody: string, signature: string): boolean {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) return false;

  // Paddle v2 signature format: ts=TIMESTAMP;h1=HASH
  const parts = signature.split(";");
  const tsPart = parts.find((p) => p.startsWith("ts="));
  const h1Part = parts.find((p) => p.startsWith("h1="));

  if (!tsPart || !h1Part) return false;

  const ts = tsPart.replace("ts=", "");
  const expectedHash = h1Part.replace("h1=", "");

  const payload = `${ts}:${rawBody}`;
  const computed = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(computed),
    Buffer.from(expectedHash)
  );
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("paddle-signature") || "";

  // Verify webhook signature
  if (!verifySignature(rawBody, signature)) {
    console.error("[paddle webhook] Invalid signature");
    return new NextResponse("Invalid signature", { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const eventType = payload.event_type;
  const data = payload.data;

  console.log(`[paddle webhook] ${eventType}`, data?.id);

  const supabase = await createClient();

  switch (eventType) {
    case "transaction.completed": {
      // Payment successful — activate subscription
      const customData = data?.custom_data || {};
      const userId = customData.user_id;
      const plan = customData.plan || "glow";

      if (!userId) {
        console.error("[paddle webhook] No user_id in custom_data");
        break;
      }

      const durationDays = plan === "elite" ? 90 : 30;
      const now = new Date();
      const expiry = new Date(now);
      expiry.setDate(expiry.getDate() + durationDays);

      await supabase
        .from("profiles")
        .upsert(
          {
            id: userId,
            plan,
            premium: true,
            current_day: 1,
            purchase_date: now.toISOString(),
            expiry_date: expiry.toISOString(),
            updated_at: now.toISOString(),
          },
          { onConflict: "id" }
        );

      console.log(`[paddle webhook] Activated ${plan} for user ${userId}`);
      break;
    }

    case "subscription.canceled":
    case "subscription.cancelled": {
      const customData = data?.custom_data || {};
      const userId = customData.user_id;

      if (userId) {
        await supabase
          .from("profiles")
          .update({ premium: false, updated_at: new Date().toISOString() })
          .eq("id", userId);

        console.log(`[paddle webhook] Cancelled subscription for user ${userId}`);
      }
      break;
    }

    case "transaction.refunded": {
      // Refund — revoke premium access
      const customData = data?.custom_data || {};
      const userId = customData.user_id;

      if (userId) {
        await supabase
          .from("profiles")
          .update({ premium: false, plan: "free", updated_at: new Date().toISOString() })
          .eq("id", userId);

        console.log(`[paddle webhook] Refunded — revoked access for user ${userId}`);
      }
      break;
    }

    case "subscription.updated": {
      // Plan change or renewal
      const customData = data?.custom_data || {};
      const userId = customData.user_id;

      if (userId && data?.status === "active") {
        await supabase
          .from("profiles")
          .update({ premium: true, updated_at: new Date().toISOString() })
          .eq("id", userId);

        console.log(`[paddle webhook] Subscription updated for user ${userId}`);
      }
      break;
    }

    default:
      console.log(`[paddle webhook] Unhandled event: ${eventType}`);
  }

  return NextResponse.json({ ok: true });
}

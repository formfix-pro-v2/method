import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export const dynamic = "force-dynamic";

/**
 * GET /api/cron/keepalive
 * 
 * Lightweight ping to prevent Supabase from pausing due to inactivity.
 * Runs daily via Vercel Cron. Just executes SELECT 1.
 */
export async function GET(request: Request) {
  // Timing-safe auth check
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "";
  const token = authHeader?.replace("Bearer ", "") || "";

  if (!cronSecret || token.length !== cronSecret.length ||
    !crypto.timingSafeEqual(Buffer.from(token), Buffer.from(cronSecret))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error } = await supabase.from("profiles").select("id").limit(1);

  if (error) {
    return NextResponse.json({ error: error.message, alive: false }, { status: 500 });
  }

  return NextResponse.json({ alive: true, timestamp: new Date().toISOString() });
}

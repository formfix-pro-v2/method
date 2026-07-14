import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

/**
 * GET /api/cron/keepalive
 * 
 * Lightweight ping to prevent Supabase from pausing due to inactivity.
 * Runs daily via Vercel Cron. No auth required — endpoint is harmless (read-only).
 */
export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(url, key);

    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("[Keepalive] DB ping failed:", error.message);
      return NextResponse.json({ status: "error", error: error.message }, { status: 500 });
    }

    console.log(`[Keepalive] DB alive — ${count} profiles`);
    return NextResponse.json({ status: "ok", profiles: count, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error("[Keepalive] Failed:", err);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkinSchema, validateBody } from "@/lib/validations";
import { checkRateLimit, getRateLimitKey, rateLimitResponse, WRITE_LIMIT } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// POST /api/checkin - Save daily check-in
export async function POST(request: Request) {
  const rlKey = getRateLimitKey(request, "checkin");
  const rl = checkRateLimit(rlKey, WRITE_LIMIT);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: body, error: validationError } = await validateBody(request, checkinSchema);
  if (validationError) return validationError;

  const checkinData = {
    user_id: user.id,
    sleep: body.sleep,
    energy: body.energy,
    stress: body.stress,
    time: body.time || null,
    symptoms: body.symptoms,
    date: new Date().toISOString().split("T")[0],
  };

  const { data, error } = await supabase
    .from("checkins")
    .upsert(checkinData, { onConflict: "user_id,date" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ checkin: data });
}

// GET /api/checkin - Get check-in history
export async function GET(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limitParam = parseInt(searchParams.get("limit") || "7");
  const limit = Math.min(Math.max(limitParam, 1), 90); // clamp 1-90

  const { data, error } = await supabase
    .from("checkins")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ checkins: data || [] });
}

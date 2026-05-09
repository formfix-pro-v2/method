import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sessionSchema, validateBody } from "@/lib/validations";
import { checkRateLimit, getRateLimitKey, rateLimitResponse, WRITE_LIMIT } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// GET /api/sessions — list user's completed sessions
export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(90);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ sessions: data });
}

// POST /api/sessions — save a completed session
export async function POST(request: Request) {
  const rlKey = getRateLimitKey(request, "sessions");
  const rl = checkRateLimit(rlKey, WRITE_LIMIT);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: body, error: validationError } = await validateBody(request, sessionSchema);
  if (validationError) return validationError;

  const { data, error } = await supabase
    .from("sessions")
    .insert({
      user_id: user.id,
      day: body.day,
      phase: body.phase,
      title: body.title || null,
      exercises_count: body.exercises_count,
      duration_seconds: body.duration_seconds,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ session: data }, { status: 201 });
}

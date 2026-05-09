import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { profileSchema, validateBody } from "@/lib/validations";
import { checkRateLimit, getRateLimitKey, rateLimitResponse, STANDARD_LIMIT } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// GET /api/profile - Get current user profile
export async function GET(request: Request) {
  const rlKey = getRateLimitKey(request, "profile");
  const rl = checkRateLimit(rlKey, STANDARD_LIMIT);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
    },
    profile: profile || null,
  });
}

// POST /api/profile - Create or update user profile
export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: body, error: validationError } = await validateBody(request, profileSchema);
  if (validationError) return validationError;

  const profileData = {
    id: user.id,
    email: user.email,
    quiz_data: body.quizData || null,
    plan: body.plan,
    premium: body.premium,
    current_day: body.currentDay,
    purchase_date: body.purchaseDate || null,
    expiry_date: body.expiryDate || null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(profileData, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}

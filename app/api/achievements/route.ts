import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { achievementSchema, validateBody } from "@/lib/validations";

export const dynamic = "force-dynamic";

// GET /api/achievements — list user's unlocked achievements
export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("user_id", user.id)
    .order("unlocked_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ achievements: data });
}

// POST /api/achievements — unlock an achievement
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: body, error: validationError } = await validateBody(request, achievementSchema);
  if (validationError) return validationError;

  const { data, error } = await supabase
    .from("achievements")
    .upsert(
      { user_id: user.id, achievement_id: body.achievement_id },
      { onConflict: "user_id,achievement_id" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ achievement: data }, { status: 201 });
}

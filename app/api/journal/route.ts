import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { journalSchema, validateBody } from "@/lib/validations";

export const dynamic = "force-dynamic";

// GET /api/journal — list user's journal entries
export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("day", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entries: data });
}

// POST /api/journal — create or update a journal entry
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: body, error: validationError } = await validateBody(request, journalSchema);
  if (validationError) return validationError;

  const { data, error } = await supabase
    .from("journal_entries")
    .upsert(
      {
        user_id: user.id,
        day: body.day,
        milestone: body.milestone || null,
        text: body.text,
        mood: body.mood || null,
      },
      { onConflict: "user_id,day" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entry: data });
}

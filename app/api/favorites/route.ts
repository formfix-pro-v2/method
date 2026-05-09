import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { favoriteSchema, validateBody } from "@/lib/validations";

export const dynamic = "force-dynamic";

// GET /api/favorites — list user's favorites
export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ favorites: data });
}

// POST /api/favorites — add a favorite
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: body, error: validationError } = await validateBody(request, favoriteSchema);
  if (validationError) return validationError;

  const { data, error } = await supabase
    .from("favorites")
    .upsert(
      { user_id: user.id, item_type: body.type, item_name: body.name },
      { onConflict: "user_id,item_type,item_name" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ favorite: data }, { status: 201 });
}

// DELETE /api/favorites — remove a favorite
export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: body, error: validationError } = await validateBody(request, favoriteSchema);
  if (validationError) return validationError;

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("item_type", body.type)
    .eq("item_name", body.name);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

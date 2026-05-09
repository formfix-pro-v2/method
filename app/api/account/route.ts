import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// DELETE /api/account — delete all user data (GDPR right to erasure)
export async function DELETE() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;

  // Delete all user data from all tables (cascade from profiles handles most)
  // But we explicitly delete to be thorough
  const tables = [
    "checkins",
    "sessions",
    "journal_entries",
    "favorites",
    "achievements",
    "push_subscriptions",
    "reminders",
    "sync_log",
  ];

  const errors: string[] = [];

  for (const table of tables) {
    const { error } = await supabase.from(table).delete().eq("user_id", userId);
    if (error) errors.push(`${table}: ${error.message}`);
  }

  // Delete referrals where user is referrer or referred
  await supabase.from("referrals").delete().eq("referrer_id", userId);
  await supabase.from("referrals").delete().eq("referred_id", userId);

  // Delete profile (this should cascade, but explicit is safer)
  const { error: profileError } = await supabase.from("profiles").delete().eq("id", userId);
  if (profileError) errors.push(`profiles: ${profileError.message}`);

  if (errors.length > 0) {
    console.error("[account/delete] Partial failure:", errors);
    return NextResponse.json({
      success: false,
      message: "Some data could not be deleted. Contact support.",
      errors,
    }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "All data deleted." });
}

// GET /api/account/export — export all user data (GDPR right to access)
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;

  // Fetch all user data in parallel
  const [profile, checkins, sessions, journal, favorites, achievements] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase.from("checkins").select("*").eq("user_id", userId).order("date"),
    supabase.from("sessions").select("*").eq("user_id", userId).order("completed_at"),
    supabase.from("journal_entries").select("*").eq("user_id", userId).order("day"),
    supabase.from("favorites").select("*").eq("user_id", userId),
    supabase.from("achievements").select("*").eq("user_id", userId),
  ]);

  const exportData = {
    exportedAt: new Date().toISOString(),
    user: { id: user.id, email: user.email },
    profile: profile.data,
    checkins: checkins.data || [],
    sessions: sessions.data || [],
    journalEntries: journal.data || [],
    favorites: favorites.data || [],
    achievements: achievements.data || [],
  };

  return new Response(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="veronica-method-export-${new Date().toISOString().split("T")[0]}.json"`,
    },
  });
}

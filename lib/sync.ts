// ============================================================
// SYNC ENGINE — bidirectional localStorage ↔ Supabase
// ============================================================
// Strategy: "last-write-wins" with server as source of truth.
// On login → pull from server, merge with local, push local-only data.
// On data change → write local first (instant), then push to server.
// ============================================================

import { createClient } from "@/lib/supabase/client";

type SyncStatus = "idle" | "syncing" | "error" | "success";

let syncStatus: SyncStatus = "idle";
const listeners: Set<(status: SyncStatus) => void> = new Set();

function setStatus(s: SyncStatus) {
  syncStatus = s;
  listeners.forEach((fn) => fn(s));
}

export function onSyncStatus(fn: (status: SyncStatus) => void) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

export function getSyncStatus() {
  return syncStatus;
}

// Unique device ID for sync_log
function getDeviceId(): string {
  let id = localStorage.getItem("deviceId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("deviceId", id);
  }
  return id;
}

// ============================================================
// PULL — server → local
// ============================================================
async function pullProfile(supabase: ReturnType<typeof createClient>, userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!data) return;

  // Server wins for profile data
  if (data.plan) localStorage.setItem("plan", data.plan);
  if (data.premium !== null) localStorage.setItem("premium", String(data.premium));
  if (data.current_day) localStorage.setItem("day", String(data.current_day));
  if (data.quiz_data) localStorage.setItem("quizData", JSON.stringify(data.quiz_data));
  if (data.purchase_date) localStorage.setItem("purchaseDate", data.purchase_date);
  if (data.expiry_date) localStorage.setItem("expiryDate", data.expiry_date);
}

async function pullCheckins(supabase: ReturnType<typeof createClient>, userId: string) {
  const { data } = await supabase
    .from("checkins")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(90);

  if (!data || data.length === 0) return;

  // Merge with local history
  const localRaw = localStorage.getItem("checkinHistory");
  const local: Array<{ date: string; sleep: number; energy: number; stress: number; symptoms: string[] }> = [];
  if (localRaw) {
    try { local.push(...JSON.parse(localRaw)); } catch { /* ignore */ }
  }

  const merged = new Map<string, typeof local[0]>();

  // Local entries first
  for (const entry of local) {
    const key = entry.date?.split("T")[0] || "";
    if (key) merged.set(key, entry);
  }

  // Server entries overwrite (server wins)
  for (const row of data) {
    merged.set(row.date, {
      date: new Date(row.date).toISOString(),
      sleep: row.sleep,
      energy: row.energy,
      stress: row.stress,
      symptoms: row.symptoms || [],
    });
  }

  const sorted = [...merged.values()].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  localStorage.setItem("checkinHistory", JSON.stringify(sorted.slice(-90)));
}

async function pullSessions(supabase: ReturnType<typeof createClient>, userId: string) {
  const { data } = await supabase
    .from("sessions")
    .select("*")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false })
    .limit(90);

  if (data && data.length > 0) {
    localStorage.setItem("sessionHistory", JSON.stringify(data));
  }
}

async function pullJournal(supabase: ReturnType<typeof createClient>, userId: string) {
  const { data } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId)
    .order("day", { ascending: true });

  if (data && data.length > 0) {
    const entries = data.map((row) => ({
      day: row.day,
      date: row.updated_at || row.created_at,
      text: row.text,
      mood: row.mood,
      milestone: row.milestone || "",
    }));
    localStorage.setItem("journalEntries", JSON.stringify(entries));
  }
}

async function pullFavorites(supabase: ReturnType<typeof createClient>, userId: string) {
  const { data } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId);

  if (data && data.length > 0) {
    const favs = data.map((row) => ({
      type: row.item_type,
      name: row.item_name,
      addedAt: row.created_at,
    }));
    localStorage.setItem("favorites", JSON.stringify(favs));
  }
}

async function pullAchievements(supabase: ReturnType<typeof createClient>, userId: string) {
  const { data } = await supabase
    .from("achievements")
    .select("*")
    .eq("user_id", userId);

  if (data && data.length > 0) {
    localStorage.setItem("unlockedAchievements", JSON.stringify(data.map((r) => r.achievement_id)));
  }
}

// ============================================================
// PUSH — local → server
// ============================================================
async function pushProfile(supabase: ReturnType<typeof createClient>, userId: string) {
  const quizRaw = localStorage.getItem("quizData");
  let quizData = null;
  if (quizRaw) {
    try { quizData = JSON.parse(quizRaw); } catch { /* ignore */ }
  }

  await supabase.from("profiles").upsert({
    id: userId,
    quiz_data: quizData,
    plan: localStorage.getItem("plan") || "free",
    premium: localStorage.getItem("premium") === "true",
    current_day: Number(localStorage.getItem("day") || "1"),
    purchase_date: localStorage.getItem("purchaseDate") || null,
    expiry_date: localStorage.getItem("expiryDate") || null,
    updated_at: new Date().toISOString(),
  }, { onConflict: "id" });
}

async function pushCheckins(supabase: ReturnType<typeof createClient>, userId: string) {
  const raw = localStorage.getItem("checkinHistory");
  if (!raw) return;

  let entries: Array<{ date: string; sleep: number; energy: number; stress: number; symptoms?: string[]; time?: string }> = [];
  try { entries = JSON.parse(raw); } catch { return; }

  // Push only last 14 days to avoid bulk inserts
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const recent = entries.filter((e) => new Date(e.date) >= twoWeeksAgo);

  for (const entry of recent) {
    const dateStr = entry.date.split("T")[0];
    await supabase.from("checkins").upsert({
      user_id: userId,
      sleep: entry.sleep || null,
      energy: entry.energy || null,
      stress: entry.stress || null,
      time: entry.time || null,
      symptoms: entry.symptoms || [],
      date: dateStr,
    }, { onConflict: "user_id,date" });
  }
}

async function pushJournal(supabase: ReturnType<typeof createClient>, userId: string) {
  const raw = localStorage.getItem("journalEntries");
  if (!raw) return;

  let entries: Array<{ day: number; text: string; mood: number; milestone?: string; date?: string }> = [];
  try { entries = JSON.parse(raw); } catch { return; }

  for (const entry of entries) {
    await supabase.from("journal_entries").upsert({
      user_id: userId,
      day: entry.day,
      milestone: entry.milestone || null,
      text: entry.text,
      mood: entry.mood,
    }, { onConflict: "user_id,day" });
  }
}

async function pushFavorites(supabase: ReturnType<typeof createClient>, userId: string) {
  const raw = localStorage.getItem("favorites");
  if (!raw) return;

  let favs: Array<{ type: string; name: string }> = [];
  try { favs = JSON.parse(raw); } catch { return; }

  // Clear server favorites and re-insert (simple approach for small datasets)
  await supabase.from("favorites").delete().eq("user_id", userId);

  if (favs.length > 0) {
    await supabase.from("favorites").insert(
      favs.map((f) => ({
        user_id: userId,
        item_type: f.type,
        item_name: f.name,
      }))
    );
  }
}

async function pushAchievements(supabase: ReturnType<typeof createClient>, userId: string) {
  const raw = localStorage.getItem("unlockedAchievements");
  if (!raw) return;

  let ids: string[] = [];
  try { ids = JSON.parse(raw); } catch { return; }

  for (const achievementId of ids) {
    await supabase.from("achievements").upsert({
      user_id: userId,
      achievement_id: achievementId,
    }, { onConflict: "user_id,achievement_id" });
  }
}

// ============================================================
// FULL SYNC — orchestrates pull + push
// ============================================================
export async function fullSync(): Promise<boolean> {
  setStatus("syncing");

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setStatus("idle");
      return false;
    }

    // 1. Pull server data (server wins for conflicts)
    await Promise.all([
      pullProfile(supabase, user.id),
      pullCheckins(supabase, user.id),
      pullSessions(supabase, user.id),
      pullJournal(supabase, user.id),
      pullFavorites(supabase, user.id),
      pullAchievements(supabase, user.id),
    ]);

    // 2. Push local data that may not be on server yet
    await Promise.all([
      pushProfile(supabase, user.id),
      pushCheckins(supabase, user.id),
      pushJournal(supabase, user.id),
      pushFavorites(supabase, user.id),
      pushAchievements(supabase, user.id),
    ]);

    // 3. Update sync log
    await supabase.from("sync_log").upsert({
      user_id: user.id,
      device_id: getDeviceId(),
      last_synced_at: new Date().toISOString(),
    }, { onConflict: "user_id,device_id" });

    localStorage.setItem("lastSyncedAt", new Date().toISOString());
    setStatus("success");
    return true;
  } catch (err) {
    console.error("[sync] Full sync failed:", err);
    setStatus("error");
    return false;
  }
}

// ============================================================
// INCREMENTAL PUSH — call after any local data change
// ============================================================
export async function pushSingle(
  table: "checkins" | "journal" | "favorites" | "achievements" | "profile"
): Promise<void> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    switch (table) {
      case "profile":     await pushProfile(supabase, user.id); break;
      case "checkins":    await pushCheckins(supabase, user.id); break;
      case "journal":     await pushJournal(supabase, user.id); break;
      case "favorites":   await pushFavorites(supabase, user.id); break;
      case "achievements": await pushAchievements(supabase, user.id); break;
    }
  } catch (err) {
    console.error(`[sync] Push ${table} failed:`, err);
  }
}

// ============================================================
// PUSH SESSION — save completed session to server
// ============================================================
export async function pushSession(session: {
  day: number;
  phase: string;
  title: string;
  exercisesCount: number;
  durationSeconds: number;
}): Promise<void> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("sessions").insert({
      user_id: user.id,
      day: session.day,
      phase: session.phase,
      title: session.title,
      exercises_count: session.exercisesCount,
      duration_seconds: session.durationSeconds,
    });
  } catch (err) {
    console.error("[sync] Push session failed:", err);
  }
}

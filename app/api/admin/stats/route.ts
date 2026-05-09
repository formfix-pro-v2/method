import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ---- Fetch all data in parallel ----
  const [profilesRes, checkinsRes, sessionsRes, journalRes] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(500),
    supabase.from("checkins").select("user_id, date, sleep, energy, stress").order("date", { ascending: false }).limit(5000),
    supabase.from("sessions").select("user_id, day, phase, duration_seconds, exercises_count, completed_at").order("completed_at", { ascending: false }).limit(5000),
    supabase.from("journal_entries").select("user_id, day").limit(1000),
  ]);

  const profiles = profilesRes.data || [];
  const checkins = checkinsRes.data || [];
  const sessions = sessionsRes.data || [];
  const journalEntries = journalRes.data || [];

  const now = new Date();

  // ============================================================
  // 1. BASIC STATS
  // ============================================================
  const free = profiles.filter((p) => p.plan === "free" || !p.plan).length;
  const glow = profiles.filter((p) => p.plan === "glow").length;
  const elite = profiles.filter((p) => p.plan === "elite").length;
  const active = profiles.filter(
    (p) => p.premium && p.expiry_date && new Date(p.expiry_date) > now
  ).length;
  const expired = profiles.filter(
    (p) => p.premium && p.expiry_date && new Date(p.expiry_date) <= now
  ).length;
  const revenueEstimate = glow * 29 + elite * 79;

  // ============================================================
  // 2. FUNNEL ANALYTICS
  // ============================================================
  const totalSignups = profiles.length;
  const withQuiz = profiles.filter((p) => p.quiz_data).length;
  const withCheckin = new Set(checkins.map((c) => c.user_id)).size;
  const withSession = new Set(sessions.map((s) => s.user_id)).size;
  const converted = profiles.filter((p) => p.plan !== "free" && p.plan).length;

  const funnel = {
    signups: totalSignups,
    quizCompleted: withQuiz,
    firstCheckin: withCheckin,
    firstSession: withSession,
    converted,
    quizRate: totalSignups > 0 ? round((withQuiz / totalSignups) * 100) : 0,
    activationRate: totalSignups > 0 ? round((withSession / totalSignups) * 100) : 0,
    conversionRate: totalSignups > 0 ? round((converted / totalSignups) * 100) : 0,
  };

  // ============================================================
  // 3. ENGAGEMENT METRICS (last 7 & 30 days)
  // ============================================================
  const d7 = daysAgo(7);
  const d30 = daysAgo(30);

  const activeUsers7d = new Set(
    checkins.filter((c) => new Date(c.date) >= d7).map((c) => c.user_id)
  ).size;
  const activeUsers30d = new Set(
    checkins.filter((c) => new Date(c.date) >= d30).map((c) => c.user_id)
  ).size;

  const sessions7d = sessions.filter((s) => new Date(s.completed_at) >= d7);
  const sessions30d = sessions.filter((s) => new Date(s.completed_at) >= d30);

  const totalDuration7d = sessions7d.reduce((s, r) => s + (r.duration_seconds || 0), 0);
  const totalDuration30d = sessions30d.reduce((s, r) => s + (r.duration_seconds || 0), 0);

  const engagement = {
    dau: activeUsers7d > 0 ? round(activeUsers7d / 7) : 0,
    wau: activeUsers7d,
    mau: activeUsers30d,
    stickiness: activeUsers30d > 0 ? round((activeUsers7d / activeUsers30d) * 100) : 0,
    sessions7d: sessions7d.length,
    sessions30d: sessions30d.length,
    avgSessionMin7d: sessions7d.length > 0 ? round(totalDuration7d / sessions7d.length / 60) : 0,
    avgSessionMin30d: sessions30d.length > 0 ? round(totalDuration30d / sessions30d.length / 60) : 0,
    journalEntries: journalEntries.length,
    journalUsers: new Set(journalEntries.map((j) => j.user_id)).size,
  };

  // ============================================================
  // 4. RETENTION — day-based cohorts
  // ============================================================
  const retention: Record<string, { total: number; retained: number; rate: number }> = {};

  for (const milestone of [1, 3, 7, 14, 30]) {
    const eligible = profiles.filter((p) => {
      const created = new Date(p.created_at);
      const daysSince = Math.floor((now.getTime() - created.getTime()) / 86400000);
      return daysSince >= milestone;
    });

    const retained = eligible.filter((p) => {
      return (p.current_day || 1) > milestone;
    });

    retention[`day${milestone}`] = {
      total: eligible.length,
      retained: retained.length,
      rate: eligible.length > 0 ? round((retained.length / eligible.length) * 100) : 0,
    };
  }

  // ============================================================
  // 5. SIGNUP TREND — last 30 days
  // ============================================================
  const signupTrend: { date: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const count = profiles.filter((p) => p.created_at?.startsWith(dateStr)).length;
    signupTrend.push({ date: dateStr, count });
  }

  // ============================================================
  // 6. CHECKIN AVERAGES — overall wellness trends
  // ============================================================
  const recentCheckins = checkins.filter((c) => new Date(c.date) >= d30);
  const avgSleep = recentCheckins.length > 0
    ? round(recentCheckins.reduce((s, c) => s + (c.sleep || 0), 0) / recentCheckins.length)
    : 0;
  const avgEnergy = recentCheckins.length > 0
    ? round(recentCheckins.reduce((s, c) => s + (c.energy || 0), 0) / recentCheckins.length)
    : 0;
  const avgStress = recentCheckins.length > 0
    ? round(recentCheckins.reduce((s, c) => s + (c.stress || 0), 0) / recentCheckins.length)
    : 0;

  const wellnessTrend = { avgSleep, avgEnergy, avgStress, sampleSize: recentCheckins.length };

  // ============================================================
  // 7. TOP USERS — most engaged
  // ============================================================
  const userSessionCounts: Record<string, number> = {};
  for (const s of sessions) {
    userSessionCounts[s.user_id] = (userSessionCounts[s.user_id] || 0) + 1;
  }

  const topUsers = profiles
    .map((p) => ({
      email: p.email || "—",
      plan: p.plan || "free",
      day: p.current_day || 1,
      sessions: userSessionCounts[p.id] || 0,
      premium: p.premium,
    }))
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 10);

  // ============================================================
  // 8. PHASE DISTRIBUTION — where are users in the program
  // ============================================================
  const phaseDistribution = {
    foundation: profiles.filter((p) => (p.current_day || 1) <= 7).length,
    build: profiles.filter((p) => (p.current_day || 1) > 7 && (p.current_day || 1) <= 16).length,
    strengthen: profiles.filter((p) => (p.current_day || 1) > 16 && (p.current_day || 1) <= 24).length,
    master: profiles.filter((p) => (p.current_day || 1) > 24).length,
  };

  return NextResponse.json({
    profiles,
    stats: { total: profiles.length, free, glow, elite, active, expired, revenueEstimate },
    funnel,
    engagement,
    retention,
    signupTrend,
    wellnessTrend,
    topUsers,
    phaseDistribution,
  });
}

// ---- Helpers ----
function round(n: number): number {
  return Math.round(n * 10) / 10;
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

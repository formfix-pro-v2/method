import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail, weeklyDigestEmail, winBackEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * GET /api/cron/weekly-digest
 * 
 * Poziva se jednom nedeljno (Vercel Cron ili eksterni cron servis).
 * Šalje weekly digest aktivnim korisnicima i win-back neaktivnima.
 * 
 * Zaštićeno CRON_SECRET header-om.
 */
export async function GET(request: Request) {
  // Auth provera
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Dohvati aktivne korisnike
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, email, plan, current_day, premium")
    .not("email", "is", null);

  if (error || !profiles) {
    return NextResponse.json({ error: error?.message || "No profiles" }, { status: 500 });
  }

  // Dohvati check-in podatke za poslednju nedelju
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const { data: checkins } = await supabase
    .from("checkins")
    .select("user_id, sleep, energy, stress, symptoms, date")
    .gte("date", weekAgo.toISOString().split("T")[0]);

  const { data: sessions } = await supabase
    .from("sessions")
    .select("user_id, completed_at")
    .gte("completed_at", weekAgo.toISOString());

  const results = {
    digestsSent: 0,
    winBacksSent: 0,
    errors: 0,
    skipped: 0,
  };

  for (const profile of profiles) {
    if (!profile.email) { results.skipped++; continue; }

    // Podaci za ovog korisnika
    const userCheckins = (checkins || []).filter((c) => c.user_id === profile.id);
    const userSessions = (sessions || []).filter((s) => s.user_id === profile.id);

    const week = Math.ceil((profile.current_day || 1) / 7);

    // Ako korisnik nije bio aktivan 3+ dana → win-back email
    if (userCheckins.length === 0 && userSessions.length === 0 && profile.current_day > 1) {
      const daysMissed = 7; // Cela nedelja bez aktivnosti
      const email = winBackEmail(daysMissed);
      const sent = await sendEmail({ to: profile.email, ...email });
      if (sent) results.winBacksSent++;
      else results.errors++;
      continue;
    }

    // Ako je bio aktivan → weekly digest
    if (userCheckins.length > 0 || userSessions.length > 0) {
      const avgSleep = userCheckins.length > 0
        ? Math.round(userCheckins.reduce((s, c) => s + (c.sleep || 0), 0) / userCheckins.length * 10) / 10
        : 0;
      const avgEnergy = userCheckins.length > 0
        ? Math.round(userCheckins.reduce((s, c) => s + (c.energy || 0), 0) / userCheckins.length * 10) / 10
        : 0;

      // Top symptom
      const symptomCount: Record<string, number> = {};
      for (const c of userCheckins) {
        for (const s of (c.symptoms || [])) {
          symptomCount[s] = (symptomCount[s] || 0) + 1;
        }
      }
      const topSymptom = Object.entries(symptomCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

      const email = weeklyDigestEmail({
        week,
        sessionsCompleted: userSessions.length,
        avgSleep,
        avgEnergy,
        streak: userCheckins.length, // Simplified streak
        topSymptom,
      });

      const sent = await sendEmail({ to: profile.email, ...email });
      if (sent) results.digestsSent++;
      else results.errors++;
      continue;
    }

    results.skipped++;
  }

  return NextResponse.json({
    success: true,
    totalProfiles: profiles.length,
    ...results,
  });
}

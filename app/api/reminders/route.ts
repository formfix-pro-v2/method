import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// GET /api/reminders - Get users who need weekly reminders
// This endpoint can be called by a cron job (e.g., Vercel Cron)
export async function GET(request: Request) {
  // Simple auth check via header
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET || "vm-cron-2024"}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Get active premium users
  const { data: users, error } = await supabase
    .from("profiles")
    .select("id, email, plan, current_day, premium")
    .eq("premium", true);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // In production, this would send emails via Resend/SendGrid
  // For now, return the list of users who should receive reminders
  const reminders = (users || []).map((user) => ({
    email: user.email,
    plan: user.plan,
    day: user.current_day,
    subject: `Week ${Math.ceil(user.current_day / 7)} — Your Veronica Method Update`,
    message: getWeeklyMessage(user.current_day, user.plan),
  }));

  return NextResponse.json({
    count: reminders.length,
    reminders,
    note: "In production, connect this to Resend or SendGrid to send actual emails.",
  });
}

function getWeeklyMessage(day: number, plan: string): string {
  const week = Math.ceil(day / 7);

  if (week === 1) {
    return `You're in your first week! Your Foundation phase exercises are building the base for everything ahead. Keep showing up — consistency beats intensity.`;
  }
  if (week === 2) {
    return `Week 2 — you're building momentum! Your body is starting to adapt. Many women notice better sleep and less stiffness around now.`;
  }
  if (week === 3) {
    return `Week 3 — you're in the Strengthen phase now. The exercises are getting more effective. Your body is responding. Don't stop now!`;
  }
  if (week === 4) {
    return `Final week of your ${plan === "glow" ? "Glow" : "first month"}! Look back at Day 1 — you've come so far. Time to celebrate and plan your next chapter.`;
  }

  return `Week ${week} — you're a wellness warrior! Your consistency is inspiring. Keep going, your body thanks you every day.`;
}

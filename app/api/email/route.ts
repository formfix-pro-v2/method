import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail, welcomeEmail, weeklyDigestEmail, winBackEmail } from "@/lib/email";
import crypto from "crypto";

export const dynamic = "force-dynamic";

function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

// POST /api/email — send an email (internal use)
export async function POST(request: Request) {
  // Auth: either logged-in user or cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "";
  const token = authHeader?.replace("Bearer ", "") || "";
  const isCron = cronSecret.length > 0 && token.length > 0 && timingSafeCompare(token, cronSecret);

  if (!isCron) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const body = await request.json();
  const { type, to, data } = body as {
    type: "welcome" | "weekly_digest" | "win_back";
    to: string;
    data?: Record<string, unknown>;
  };

  if (!type || !to) {
    return NextResponse.json({ error: "type and to are required" }, { status: 400 });
  }

  let email: { subject: string; html: string; text: string };

  switch (type) {
    case "welcome":
      email = welcomeEmail(data?.name as string | undefined);
      break;
    case "weekly_digest":
      email = weeklyDigestEmail({
        week: (data?.week as number) || 1,
        sessionsCompleted: (data?.sessionsCompleted as number) || 0,
        avgSleep: (data?.avgSleep as number) || 0,
        avgEnergy: (data?.avgEnergy as number) || 0,
        streak: (data?.streak as number) || 0,
        topSymptom: (data?.topSymptom as string) || "None",
      });
      break;
    case "win_back":
      email = winBackEmail((data?.daysMissed as number) || 3);
      break;
    default:
      return NextResponse.json({ error: "Unknown email type" }, { status: 400 });
  }

  const success = await sendEmail({ to, ...email });

  return NextResponse.json({ success });
}

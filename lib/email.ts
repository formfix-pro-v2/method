// ============================================================
// EMAIL ENGINE — Resend integracija
// ============================================================
// Koristi Resend API za slanje emailova.
// Ako RESEND_API_KEY nije podešen, loguje u konzolu (dev mode).
// ============================================================

const RESEND_API = "https://api.resend.com/emails";
const FROM_EMAIL = process.env.EMAIL_FROM || "Veronica Method <onboarding@resend.dev>";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

/**
 * Šalje email preko Resend API-ja.
 * Ako API ključ nije podešen, loguje u konzolu.
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("[email] RESEND_API_KEY not set — logging email instead:");
    console.log(`  To: ${payload.to}`);
    console.log(`  Subject: ${payload.subject}`);
    console.log(`  Body: ${payload.text || "(HTML only)"}`);
    return true; // Ne failujemo u dev modu
  }

  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[email] Resend error:", err);
      return false;
    }

    console.log(`[email] Sent "${payload.subject}" to ${payload.to}`);
    return true;
  } catch (err) {
    console.error("[email] Failed to send:", err);
    return false;
  }
}

// ============================================================
// EMAIL TEMPLATES
// ============================================================

const BRAND_COLOR = "#d8a7b5";
const TEXT_COLOR = "#4a3f44";
const MUTED_COLOR = "#7b6870";

function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f2e4e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
    <!-- Logo -->
    <div style="text-align:center;margin-bottom:24px;">
      <span style="font-size:24px;font-weight:600;color:${BRAND_COLOR};">Veronica Method</span>
      <div style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:${MUTED_COLOR};margin-top:4px;">
        The Complete Menopause Program
      </div>
    </div>

    <!-- Content card -->
    <div style="background:white;border-radius:20px;padding:32px;border:1px solid #f0e3e8;">
      ${content}
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:24px;font-size:11px;color:${MUTED_COLOR};">
      <p>© ${new Date().getFullYear()} Veronica Method. All rights reserved.</p>
      <p style="margin-top:8px;">
        <a href="https://veronica-method.vercel.app/privacy" style="color:${MUTED_COLOR};">Privacy</a> · 
        <a href="https://veronica-method.vercel.app/terms" style="color:${MUTED_COLOR};">Terms</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

/** Welcome email — šalje se nakon registracije */
export function welcomeEmail(name?: string): { subject: string; html: string; text: string } {
  const greeting = name ? `Hi ${name}` : "Welcome";
  return {
    subject: "Welcome to Veronica Method 🌸",
    text: `${greeting}! Your personalized menopause wellness program is ready. Visit your dashboard to start your first session.`,
    html: emailWrapper(`
      <h1 style="font-size:24px;color:${TEXT_COLOR};margin:0 0 12px;">${greeting}! 🌸</h1>
      <p style="color:${MUTED_COLOR};font-size:15px;line-height:1.6;margin:0 0 20px;">
        Your personalized menopause wellness program is ready. Here's what's waiting for you:
      </p>
      <ul style="color:${TEXT_COLOR};font-size:14px;line-height:2;padding-left:20px;margin:0 0 24px;">
        <li>🧘‍♀️ Daily exercise sessions tailored to your symptoms</li>
        <li>🥗 Budget meal plans under €7/day</li>
        <li>💊 Personalized supplement guide</li>
        <li>📊 Progress tracking with weekly reports</li>
      </ul>
      <div style="text-align:center;margin:24px 0;">
        <a href="https://veronica-method.vercel.app/dashboard" 
           style="background:linear-gradient(135deg,${BRAND_COLOR},#c58d9d);color:white;padding:14px 32px;border-radius:999px;text-decoration:none;font-weight:600;font-size:14px;display:inline-block;">
          Start Your First Session →
        </a>
      </div>
      <p style="color:${MUTED_COLOR};font-size:13px;font-style:italic;text-align:center;margin:0;">
        "Your next chapter can feel amazing."
      </p>
    `),
  };
}

/** Weekly digest — šalje se jednom nedeljno */
export function weeklyDigestEmail(data: {
  week: number;
  sessionsCompleted: number;
  avgSleep: number;
  avgEnergy: number;
  streak: number;
  topSymptom: string;
}): { subject: string; html: string; text: string } {
  const grade = data.sessionsCompleted >= 5 ? "A+" : data.sessionsCompleted >= 3 ? "B" : "C";
  return {
    subject: `Week ${data.week} Report — ${data.sessionsCompleted} sessions completed`,
    text: `Week ${data.week}: ${data.sessionsCompleted} sessions, sleep ${data.avgSleep}/10, energy ${data.avgEnergy}/10, streak ${data.streak} days.`,
    html: emailWrapper(`
      <h1 style="font-size:22px;color:${TEXT_COLOR};margin:0 0 4px;">Week ${data.week} Summary</h1>
      <p style="color:${MUTED_COLOR};font-size:13px;margin:0 0 20px;">Here's how your week went:</p>

      <div style="display:flex;gap:12px;margin-bottom:20px;">
        <div style="flex:1;text-align:center;padding:16px;background:#fdf2f5;border-radius:12px;">
          <div style="font-size:28px;color:${TEXT_COLOR};font-weight:300;">${grade}</div>
          <div style="font-size:10px;color:${MUTED_COLOR};text-transform:uppercase;letter-spacing:1px;">Grade</div>
        </div>
        <div style="flex:1;text-align:center;padding:16px;background:#fdf2f5;border-radius:12px;">
          <div style="font-size:28px;color:${TEXT_COLOR};font-weight:300;">${data.sessionsCompleted}</div>
          <div style="font-size:10px;color:${MUTED_COLOR};text-transform:uppercase;letter-spacing:1px;">Sessions</div>
        </div>
        <div style="flex:1;text-align:center;padding:16px;background:#fdf2f5;border-radius:12px;">
          <div style="font-size:28px;color:${TEXT_COLOR};font-weight:300;">${data.streak}🔥</div>
          <div style="font-size:10px;color:${MUTED_COLOR};text-transform:uppercase;letter-spacing:1px;">Streak</div>
        </div>
      </div>

      <table style="width:100%;font-size:13px;color:${TEXT_COLOR};border-collapse:collapse;margin-bottom:20px;">
        <tr><td style="padding:8px 0;border-bottom:1px solid #f0e3e8;">😴 Sleep Quality</td><td style="text-align:right;padding:8px 0;border-bottom:1px solid #f0e3e8;font-weight:600;">${data.avgSleep}/10</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #f0e3e8;">⚡ Energy Level</td><td style="text-align:right;padding:8px 0;border-bottom:1px solid #f0e3e8;font-weight:600;">${data.avgEnergy}/10</td></tr>
        <tr><td style="padding:8px 0;">🎯 Top Symptom</td><td style="text-align:right;padding:8px 0;font-weight:600;">${data.topSymptom || "None"}</td></tr>
      </table>

      <div style="text-align:center;">
        <a href="https://veronica-method.vercel.app/weekly-summary" 
           style="background:linear-gradient(135deg,${BRAND_COLOR},#c58d9d);color:white;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:600;font-size:13px;display:inline-block;">
          View Full Report →
        </a>
      </div>
    `),
  };
}

/** Win-back email — šalje se kad korisnik ne dođe 3+ dana */
export function winBackEmail(daysMissed: number): { subject: string; html: string; text: string } {
  return {
    subject: "We miss you 🌸 Your program is waiting",
    text: `It's been ${daysMissed} days since your last session. Your body remembers the progress you made — pick up where you left off.`,
    html: emailWrapper(`
      <div style="text-align:center;margin-bottom:20px;">
        <span style="font-size:48px;">🌸</span>
      </div>
      <h1 style="font-size:22px;color:${TEXT_COLOR};text-align:center;margin:0 0 12px;">We miss you!</h1>
      <p style="color:${MUTED_COLOR};font-size:14px;line-height:1.6;text-align:center;margin:0 0 20px;">
        It's been ${daysMissed} days since your last session. That's okay — life happens. 
        Your body remembers the progress you made, and picking up is easier than starting over.
      </p>
      <div style="background:#fdf2f5;border-radius:12px;padding:16px;margin-bottom:20px;text-align:center;">
        <p style="color:${TEXT_COLOR};font-size:13px;font-style:italic;margin:0;">
          "Rest is not giving up. It's powering up. But now it's time to move again."
        </p>
      </div>
      <div style="text-align:center;">
        <a href="https://veronica-method.vercel.app/dashboard" 
           style="background:linear-gradient(135deg,${BRAND_COLOR},#c58d9d);color:white;padding:14px 32px;border-radius:999px;text-decoration:none;font-weight:600;font-size:14px;display:inline-block;">
          Continue My Journey →
        </a>
      </div>
    `),
  };
}

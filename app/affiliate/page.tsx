"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AffiliatePage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [applied, setApplied] = useState(false);
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [code, setCode] = useState("");
  const [stats, setStats] = useState({ clicks: 0, signups: 0, sales: 0, earned: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already an affiliate
    const savedCode = localStorage.getItem("affiliateCode");
    const savedApplied = localStorage.getItem("affiliateApplied");

    if (savedCode) {
      setIsAffiliate(true);
      setCode(savedCode);
      // Load stats
      const savedStats = localStorage.getItem("affiliateStats");
      if (savedStats) {
        try { setStats(JSON.parse(savedStats)); } catch { /* ignore */ }
      }
    } else if (savedApplied) {
      setApplied(true);
    }

    // Check if logged in
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setEmail(user.email);
      setLoading(false);
    });
  }, []);

  function applyAffiliate(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email.includes("@")) return;

    // Generate affiliate code
    const affiliateCode = `VEL-${name.toUpperCase().replace(/\s/g, "").substring(0, 6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Save application
    const application = {
      name,
      email,
      instagram,
      code: affiliateCode,
      date: new Date().toISOString(),
      status: "approved", // Auto-approve for now
    };

    // Store locally
    localStorage.setItem("affiliateCode", affiliateCode);
    localStorage.setItem("affiliateData", JSON.stringify(application));
    localStorage.setItem("affiliateStats", JSON.stringify({ clicks: 0, signups: 0, sales: 0, earned: 0 }));

    // Save to leads
    try {
      const leads = JSON.parse(localStorage.getItem("affiliateApplications") || "[]");
      leads.push(application);
      localStorage.setItem("affiliateApplications", JSON.stringify(leads));
    } catch { /* ignore */ }

    // Try API
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "affiliate", name, instagram }),
    }).catch(() => {});

    setCode(affiliateCode);
    setIsAffiliate(true);
  }

  const affiliateLink = typeof window !== "undefined"
    ? `${window.location.origin}/quiz?aff=${code}`
    : "";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(affiliateLink);
      alert("Link copied!");
    } catch { /* fallback */ }
  }

  if (loading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-[#b98fa1]">Loading...</div>
      </main>
    );
  }

  // AFFILIATE DASHBOARD
  if (isAffiliate) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-10">
        <section className="soft-card p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f8d8df] to-[#d5a6b1] flex items-center justify-center text-white font-bold">
              ✦
            </div>
            <div>
              <h1 className="text-3xl text-[#4a3f44]">Affiliate Dashboard</h1>
              <p className="text-xs text-[#b98fa1]">Code: <span className="font-mono font-bold">{code}</span></p>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Link Clicks", value: stats.clicks, icon: "👆" },
            { label: "Sign Ups", value: stats.signups, icon: "👤" },
            { label: "Sales", value: stats.sales, icon: "💰" },
            { label: "Earned", value: `€${stats.earned.toFixed(2)}`, icon: "🎉" },
          ].map((s) => (
            <div key={s.label} className="soft-card p-5 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-light text-[#4a3f44]">{s.value}</div>
              <div className="text-[9px] uppercase tracking-widest text-[#b98fa1] font-bold mt-1">{s.label}</div>
            </div>
          ))}
        </section>

        {/* LINK */}
        <section className="soft-card p-6 mb-6">
          <h2 className="text-xl text-[#4a3f44] mb-3">Your Affiliate Link</h2>
          <div className="flex gap-2">
            <div className="flex-1 p-3 rounded-xl bg-[#fdf2f5] border border-[#f0e3e8] text-sm text-[#6f5a62] truncate font-mono">
              {affiliateLink}
            </div>
            <button onClick={copyLink} className="btn-primary px-4 text-sm shrink-0">
              Copy
            </button>
          </div>
        </section>

        {/* SHARE TEMPLATES */}
        <section className="soft-card p-6 mb-6">
          <h2 className="text-xl text-[#4a3f44] mb-4">Ready-to-Post Templates</h2>
          <div className="space-y-3">
            {[
              {
                platform: "Instagram Story",
                text: `🌸 I found this amazing wellness app for women 40+. Personalized exercises, meal plans under €7/day, and it actually works!\n\nTry it free → ${affiliateLink}`,
              },
              {
                platform: "Facebook Post",
                text: `Ladies, if you're dealing with menopause symptoms — hot flashes, sleep issues, joint pain — check out Veronica Method. I've been using it and the daily routines are gentle but effective. Plus the meal plans are SO budget-friendly.\n\nFree assessment here: ${affiliateLink}`,
              },
              {
                platform: "WhatsApp Message",
                text: `Hey! Have you heard of Veronica Method? It's a wellness program for women our age. Personalized exercises and meals for under €7/day. I think you'd love it: ${affiliateLink}`,
              },
            ].map((t) => (
              <div key={t.platform} className="p-4 rounded-xl bg-white border border-[#f0e3e8]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#b98fa1] uppercase tracking-widest">{t.platform}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(t.text)}
                    className="text-xs text-[#d8a7b5] hover:text-[#8f5d6f]"
                  >
                    Copy text
                  </button>
                </div>
                <p className="text-xs text-[#6f5a62] whitespace-pre-line">{t.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="soft-card p-6">
          <h2 className="text-xl text-[#4a3f44] mb-4">How You Earn</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { step: "1", title: "Share Your Link", desc: "Post on social media, send to friends, or add to your bio." },
              { step: "2", title: "They Sign Up", desc: "When someone clicks your link and takes the free assessment." },
              { step: "3", title: "You Earn 25%", desc: "For every premium purchase, you earn 25% commission (€7.25 or €19.75)." },
            ].map((s) => (
              <div key={s.step} className="p-4 rounded-xl bg-[#fdf2f5] border border-[#f0e3e8] text-center">
                <div className="w-8 h-8 rounded-full bg-[#d8a7b5] text-white flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  {s.step}
                </div>
                <p className="text-sm font-medium text-[#4a3f44] mb-1">{s.title}</p>
                <p className="text-xs text-[#7b6870]">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  // APPLICATION FORM
  if (applied) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-10">
        <section className="soft-card p-10 text-center">
          <div className="text-4xl mb-4">🌸</div>
          <h1 className="text-3xl text-[#4a3f44] mb-2">Application Received!</h1>
          <p className="text-[#7b6870]">
            We&apos;ll review your application and get back to you within 24 hours.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      {/* HERO */}
      <section className="soft-card p-8 mb-6 text-center">
        <p className="uppercase tracking-[0.25em] text-xs text-[#b98fa1] mb-3 font-bold">
          Partner Program
        </p>
        <h1 className="text-4xl mb-3 text-[#4a3f44]">
          Become a Veronica Method Affiliate
        </h1>
        <p className="text-[#7b6870] max-w-xl mx-auto">
          Earn 25% commission for every woman you help discover Veronica Method.
          Share your unique link, we handle everything else.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        {/* BENEFITS */}
        <section className="soft-card p-6">
          <h2 className="text-xl text-[#4a3f44] mb-4">Why Partner With Us</h2>
          <div className="space-y-3">
            {[
              { icon: "💰", title: "25% Commission", desc: "Earn €7.25 per Glow sale, €19.75 per Elite sale." },
              { icon: "🔗", title: "Unique Tracking Link", desc: "Every click and sale is tracked to your account." },
              { icon: "📱", title: "Ready-to-Post Content", desc: "We give you templates for Instagram, Facebook and WhatsApp." },
              { icon: "📊", title: "Real-Time Dashboard", desc: "See your clicks, signups and earnings instantly." },
              { icon: "🎁", title: "Free Premium Access", desc: "All affiliates get free Elite membership." },
              { icon: "💳", title: "Monthly Payouts", desc: "Earnings paid to your bank account every month." },
            ].map((b) => (
              <div key={b.title} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#f0e3e8]">
                <span className="text-xl shrink-0">{b.icon}</span>
                <div>
                  <p className="text-sm font-medium text-[#4a3f44]">{b.title}</p>
                  <p className="text-xs text-[#7b6870]">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* APPLICATION FORM */}
        <section className="soft-card p-6">
          <h2 className="text-xl text-[#4a3f44] mb-4">Apply Now</h2>
          <form onSubmit={applyAffiliate} className="space-y-4">
            <div>
              <label htmlFor="aff-name" className="text-[10px] uppercase font-bold text-[#b98fa1] tracking-widest ml-1">
                Full Name
              </label>
              <input
                id="aff-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full mt-1 p-3 rounded-xl border border-[#ead8de] outline-none focus:border-[#d6a7b1] text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="aff-email" className="text-[10px] uppercase font-bold text-[#b98fa1] tracking-widest ml-1">
                Email
              </label>
              <input
                id="aff-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full mt-1 p-3 rounded-xl border border-[#ead8de] outline-none focus:border-[#d6a7b1] text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="aff-ig" className="text-[10px] uppercase font-bold text-[#b98fa1] tracking-widest ml-1">
                Instagram (optional)
              </label>
              <input
                id="aff-ig"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@yourhandle"
                className="w-full mt-1 p-3 rounded-xl border border-[#ead8de] outline-none focus:border-[#d6a7b1] text-sm"
              />
            </div>

            <button type="submit" className="btn-primary w-full py-3">
              Apply & Get My Link
            </button>

            <p className="text-[10px] text-[#b98fa1] text-center">
              Applications are reviewed instantly. No followers minimum required.
            </p>
          </form>
        </section>
      </div>

      {/* IDEAL FOR */}
      <section className="soft-card p-6 mt-6">
        <h2 className="text-xl text-[#4a3f44] mb-4 text-center">Perfect For</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            "Fitness coaches",
            "Health bloggers",
            "Yoga instructors",
            "Nutritionists",
            "Menopause advocates",
            "Wellness influencers",
            "Personal trainers",
            "Women's health pros",
          ].map((role) => (
            <div key={role} className="p-3 rounded-xl bg-[#fdf2f5] border border-[#f0e3e8] text-center text-xs text-[#6f5a62]">
              {role}
            </div>
          ))}
        </div>
      </section>

      <div className="text-center mt-6">
        <Link href="/" className="text-sm text-[#b98fa1] hover:underline">← Back to Home</Link>
      </div>
    </main>
  );
}

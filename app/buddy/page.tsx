"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { generateReferralCode, getReferralLink } from "@/lib/referral";

export default function BuddyPage() {
  const [code, setCode] = useState("");
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const c = generateReferralCode(user.id);
        setCode(c);
        setLink(getReferralLink(c));
      }
    });

    try {
      const qd = JSON.parse(localStorage.getItem("quizData") || "{}");
      if (qd.name) setUserName(qd.name);
    } catch {}
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  const shareText = userName
    ? `Hey! I'm using Veronica Method for menopause wellness and it's really helping. Want to be my workout buddy? We can track progress together! Join free: ${link}`
    : `I found this amazing menopause wellness app. Want to be my workout buddy? Join free: ${link}`;

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      {/* HERO */}
      <section className="soft-card p-8 text-center mb-6">
        <div className="text-5xl mb-4">👯‍♀️</div>
        <h1 className="text-3xl text-[#2a1a22] mb-2">Invite a Buddy</h1>
        <p className="text-sm text-[#5a4550] max-w-md mx-auto">
          Everything is better with a friend. Invite someone to join your wellness journey — motivate each other, share progress, stay accountable.
        </p>
      </section>

      {/* BENEFITS */}
      <section className="soft-card p-6 mb-6">
        <h2 className="text-xl text-[#2a1a22] mb-4">Why workout with a buddy?</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "💪", title: "2x more likely to stick with it", desc: "Research shows accountability partners double consistency" },
            { icon: "🎯", title: "Shared goals", desc: "See each other's streaks and celebrate milestones together" },
            { icon: "💬", title: "Daily motivation", desc: "A simple 'did you do your session?' makes all the difference" },
            { icon: "🎁", title: "Both get 7 bonus days", desc: "When your buddy joins, you both get a week of free premium" },
          ].map((b) => (
            <div key={b.title} className="p-3 rounded-xl bg-white/60 border border-[#f0e3e8]">
              <div className="text-xl mb-1">{b.icon}</div>
              <p className="text-xs font-medium text-[#2a1a22] mb-0.5">{b.title}</p>
              <p className="text-[9px] text-[#7d5565]">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INVITE LINK */}
      {link ? (
        <section className="soft-card p-6 mb-6">
          <h2 className="text-xl text-[#2a1a22] mb-4">Send your invite</h2>

          <div className="flex gap-2 mb-4">
            <div className="flex-1 p-3 rounded-xl bg-[#fdf2f5] border border-[#f0e3e8] text-xs text-[#5a4550] truncate font-mono">
              {link}
            </div>
            <button
              onClick={copyLink}
              className={`px-4 py-2 rounded-xl text-xs font-medium shrink-0 transition-all ${
                copied ? "bg-green-50 text-green-600 border border-green-200" : "btn-primary"
              }`}
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-green-50 border border-green-200 text-center hover:bg-green-100 transition-colors"
            >
              <span className="text-xl block">💬</span>
              <span className="text-[9px] text-green-700 font-medium">WhatsApp</span>
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent("Be my wellness buddy!")}&body=${encodeURIComponent(shareText)}`}
              className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center hover:bg-blue-100 transition-colors"
            >
              <span className="text-xl block">✉️</span>
              <span className="text-[9px] text-blue-700 font-medium">Email</span>
            </a>
            <a
              href={`sms:?body=${encodeURIComponent(shareText)}`}
              className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-center hover:bg-purple-100 transition-colors"
            >
              <span className="text-xl block">📱</span>
              <span className="text-[9px] text-purple-700 font-medium">SMS</span>
            </a>
          </div>
        </section>
      ) : (
        <section className="soft-card p-6 mb-6 text-center">
          <p className="text-sm text-[#5a4550] mb-3">Sign in to get your personal invite link</p>
          <Link href="/login?redirect=/buddy" className="btn-primary px-6 py-2">Sign In</Link>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="soft-card p-6 mb-6">
        <h2 className="text-xl text-[#2a1a22] mb-4">How it works</h2>
        <div className="space-y-3">
          {[
            { step: "1", text: "Share your invite link with a friend" },
            { step: "2", text: "They sign up and take the free assessment" },
            { step: "3", text: "You both get 7 bonus days of premium access" },
            { step: "4", text: "Motivate each other daily — check streaks, share wins" },
          ].map((s) => (
            <div key={s.step} className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#a8687a] text-white flex items-center justify-center text-sm font-bold shrink-0">{s.step}</span>
              <p className="text-sm text-[#4a3f44]">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center">
        <Link href="/dashboard" className="text-sm text-[#7d5565] hover:underline">← Back to Dashboard</Link>
      </div>
    </main>
  );
}

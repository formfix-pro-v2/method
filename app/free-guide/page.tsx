"use client";

import { useState } from "react";
import Link from "next/link";

export default function FreeGuidePage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;

    setLoading(true);

    // Save lead
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "free_guide" }),
      });
    } catch {}

    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-10">
        <section className="soft-card p-8 text-center">
          <div className="text-5xl mb-4">📖</div>
          <h1 className="text-3xl text-[#4a3f44] mb-3">Your Guide is Ready!</h1>
          <p className="text-sm text-[#5a4550] mb-6">
            Click below to open your free menopause wellness guide. You can save it as PDF or print it.
          </p>
          <Link
            href="/guide"
            target="_blank"
            className="btn-primary px-8 py-3 text-base inline-block mb-4"
          >
            📖 Open My Free Guide
          </Link>
          <p className="text-xs text-[#7d5565]">
            Tip: Use Ctrl+P (or ⌘+P on Mac) to save as PDF
          </p>
          <div className="mt-6 pt-6 border-t border-[#f0e3e8]">
            <p className="text-sm text-[#5a4550] mb-3">Ready for the full personalized program?</p>
            <Link href="/quiz" className="btn-outline px-6 py-2">
              Take Free Assessment →
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <div className="grid md:grid-cols-2 gap-6">
        {/* LEFT — what's inside */}
        <section className="soft-card p-6">
          <p className="uppercase tracking-[0.2em] text-[10px] text-[#a8687a] font-bold mb-3">Free Download</p>
          <h1 className="text-3xl text-[#4a3f44] mb-4">The Complete Menopause Wellness Guide</h1>
          <p className="text-sm text-[#5a4550] mb-6">
            A 30-page evidence-based guide covering exercises, nutrition, supplements and daily routines for women 40+.
          </p>

          <div className="space-y-3 mb-6">
            {[
              "10 best exercises for hot flashes & sleep",
              "7-day meal plan under €7/day with recipes",
              "Complete supplement guide with doses & timing",
              "Pelvic floor rehabilitation protocol",
              "Daily routine templates (10, 20, 30 min)",
              "Symptom tracker printable worksheet",
              "Budget shopping list template",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-[#4a3f44]">
                <span className="text-[#a8687a]">✓</span>
                {item}
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#fdf2f5] border border-[#f0e3e8]">
            <p className="text-xs text-[#5a4550] italic">
              &ldquo;This guide alone helped me understand what my body needs. The meal plan saved me €80/month.&rdquo;
              <span className="block mt-1 font-medium text-[#4a3f44]">— Sandra, 47</span>
            </p>
          </div>
        </section>

        {/* RIGHT — email form */}
        <section className="soft-card p-6 flex flex-col justify-center">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">📖</div>
            <h2 className="text-xl text-[#4a3f44] mb-1">Get Your Free Copy</h2>
            <p className="text-xs text-[#5a4550]">Enter your email and get instant access</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full p-4 rounded-2xl border border-[#f0e3e8] outline-none focus:border-[#a8687a] text-sm"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Me the Free Guide"}
            </button>
          </form>

          <p className="text-[9px] text-[#7d5565] text-center mt-4">
            No spam. Unsubscribe anytime. We respect your privacy.
          </p>

          {/* Share buttons */}
          <div className="mt-6 pt-4 border-t border-[#f0e3e8]">
            <p className="text-[10px] text-[#7d5565] text-center mb-3">Share with a friend who needs this:</p>
            <div className="flex gap-2 justify-center flex-wrap">
              <a
                href="https://wa.me/?text=Free%20menopause%20wellness%20guide%20%E2%80%94%20exercises%2C%20meal%20plans%20%26%20supplements%20for%20women%2040%2B%20%F0%9F%8C%B8%20https%3A%2F%2Fveronica-method.vercel.app%2Ffree-guide"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-green-50 border border-green-200 text-xs text-green-700 hover:bg-green-100 transition-colors"
              >
                💬 WhatsApp
              </a>
              <a
                href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fveronica-method.vercel.app%2Ffree-guide"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-700 hover:bg-blue-100 transition-colors"
              >
                📘 Facebook
              </a>
              <a
                href="mailto:?subject=Free%20Menopause%20Wellness%20Guide&body=I%20found%20this%20free%20guide%20for%20menopause%20wellness%20%E2%80%94%20exercises%2C%20meal%20plans%20and%20supplements.%20Check%20it%20out%3A%20https%3A%2F%2Fveronica-method.vercel.app%2Ffree-guide"
                className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
              >
                ✉️ Email
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

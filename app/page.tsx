"use client";

import Link from "next/link";
import EmailCapture from "@/components/EmailCapture";
import ExitIntent from "@/components/ExitIntent";
import FaqJsonLd from "@/components/FaqJsonLd";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { buildPlan } from "@/lib/programs";
import { useMemo } from "react";

const FAQ_DATA = [
  {
    question: "Is this program safe for women over 50?",
    answer: "Yes. Every exercise starts gentle (Foundation phase) and progresses gradually. The program is designed specifically for women 40-65+ experiencing menopause symptoms. Always consult your doctor before starting any new exercise program.",
  },
  {
    question: "Do I need any equipment?",
    answer: "No equipment needed. All exercises use your body weight and common household items like a chair or wall. You can do everything at home in a small space.",
  },
  {
    question: "How much time do I need per day?",
    answer: "Sessions range from 10 to 30 minutes depending on your preference. You choose your daily time commitment during the assessment, and the program adapts accordingly.",
  },
  {
    question: "Are the meal plans really under €7 per day?",
    answer: "Yes. All recipes use affordable, widely available ingredients. The average daily cost is €5-7 depending on your location. Shopping lists are auto-generated and organized by category to save time.",
  },
  {
    question: "What if I miss a day?",
    answer: "No problem. The program includes streak freezes and rest days. Missing a day doesn't reset your progress. Consistency over perfection is our philosophy.",
  },
  {
    question: "Is this a subscription or one-time payment?",
    answer: "One-time payment. The Glow plan (€29) gives you 30 days of full access, and the Elite plan (€79) gives you 90 days. No recurring charges, no hidden fees.",
  },
  {
    question: "Can I try it for free first?",
    answer: "Yes. The free plan includes 7 days of exercises, Day 1 full meal plan with recipes, supplement guide preview, and progress tracking. No credit card required.",
  },
  {
    question: "Will this help with hot flashes and sleep problems?",
    answer: "The program includes specific breathing techniques for hot flash relief and evening wind-down routines for better sleep. Many users report improvements within the first two weeks, though individual results vary.",
  },
];

export default function HomePage() {
  const { t } = useTranslation();

  // Sample plan for preview (Day 1, common symptoms)
  const samplePlan = useMemo(() => buildPlan(1, {
    symptoms: ["Hot flashes", "Poor sleep", "Joint pain"],
    goal: "tone",
    time: "20 min",
    age: 48,
  }), []);

  return (
    <main className="relative min-h-screen bg-transparent">
      {/* HERO */}
      <section className="max-w-7xl mx-auto pt-4 pb-6 grid lg:grid-cols-2 gap-5 items-center">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <p className="uppercase tracking-[0.2em] text-[10px] font-bold text-[#d8a7b5] bg-[#fdf2f5]/60 w-fit px-3 py-1 rounded-full">
              {t("Menopause Wellness for Women 40+")}
            </p>

            <h1 className="text-4xl md:text-[52px] leading-[1.08] text-[#4a3f44] tracking-tight">
              {t("Feel Balanced.")}
              <br />
              <span className="italic font-light text-[#d8a7b5]">{t("Move Gracefully.")}</span>
              <br />
              {t("Glow Again.")}
            </h1>

            <p className="text-base text-[#7b6870] max-w-xl leading-relaxed">
              The complete menopause wellness system: <strong className="text-[#4a3f44]">personalized exercises</strong>,{" "}
              <strong className="text-[#4a3f44]">budget meal plans under €7/day</strong>,{" "}
              <strong className="text-[#4a3f44]">supplement guidance</strong> and daily support for hot flashes, sleep, joint pain and confidence.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/quiz" className="btn-primary">{t("Start Free Plan")}</Link>
            <Link href="/pricing" className="btn-outline">{t("View Membership")}</Link>
          </div>

          <div className="flex items-center gap-2 pt-1 opacity-80">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-[#d8a7b5]/30" />
              ))}
            </div>
            <p className="text-[11px] italic text-[#7b6870]">
              {t("Trusted by women building strength through midlife.")}
            </p>
          </div>
        </div>

        {/* WHAT YOU GET CARD */}
        <div className="soft-card p-5 md:p-6">
          <h2 className="text-xl text-[#4a3f44] mb-3 font-light italic text-center lg:text-left">
            Everything In Your Program:
          </h2>
          <div className="space-y-2">
            {[
              { icon: "🧘‍♀️", text: "Daily exercise sessions (10-30 min, no equipment)" },
              { icon: "🥗", text: "Personalized meal plans under €7/day" },
              { icon: "💊", text: "Supplement guide: vitamins, minerals & doses" },
              { icon: "😴", text: "Sleep & hot flash recovery routines" },
              { icon: "📊", text: "Progress tracking with weekly reports" },
              { icon: "🛒", text: "Auto-generated shopping lists" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2.5 text-sm text-[#4a3f44]">
                <span className="text-base shrink-0">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
          <Link href="/quiz" className="btn-primary w-full mt-4 py-2.5 text-xs uppercase tracking-widest">
            Get My Personalized Plan — Free
          </Link>
        </div>
      </section>

      {/* WHAT IS Veronica Method - Clear value proposition */}
      <section className="max-w-7xl mx-auto py-6">
        <div className="soft-card p-6 md:p-8">
          <h2 className="text-3xl text-center text-[#4a3f44] mb-2 italic">
            Built Specifically for Menopause
          </h2>
          <p className="text-center text-sm text-[#7b6870] mb-6 max-w-2xl mx-auto">
            Every exercise, meal and supplement recommendation is designed for the hormonal changes women experience after 40.
          </p>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              {
                icon: "🧘‍♀️",
                title: "Smart Exercises",
                points: ["Tailored to your symptoms", "Progressive 4-phase system", "Gentle start, real results", "No equipment needed"],
              },
              {
                icon: "🥗",
                title: "Budget Nutrition",
                points: ["Full meal plans under €7/day", "32+ hormone-friendly recipes", "Ingredients & prep steps", "Printable shopping lists"],
              },
              {
                icon: "💊",
                title: "Supplement Guide",
                points: ["Vitamins for hormone balance", "Minerals for bone & joints", "Exact daily doses", "Budget-friendly brands"],
              },
              {
                icon: "📈",
                title: "Track & Improve",
                points: ["Daily check-ins", "Sleep & energy graphs", "Achievement badges", "Weekly progress reports"],
              },
            ].map((col) => (
              <div key={col.title} className="text-center">
                <div className="text-3xl mb-2">{col.icon}</div>
                <h3 className="text-lg text-[#4a3f44] font-medium mb-2">{col.title}</h3>
                <ul className="space-y-1">
                  {col.points.map((p) => (
                    <li key={p} className="text-xs text-[#7b6870] flex items-center gap-1.5 justify-center">
                      <span className="text-[#d8a7b5] text-[10px]">✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MENOPAUSE SYMPTOMS WE TARGET */}
      <section className="max-w-7xl mx-auto py-4">
        <h2 className="text-3xl text-center text-[#4a3f44] mb-5 italic">
          We Help With These Symptoms
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { symptom: "Hot Flashes", icon: "🌡️", desc: "Cooling exercises & breathing techniques" },
            { symptom: "Poor Sleep", icon: "😴", desc: "Evening routines & wind-down sequences" },
            { symptom: "Weight Gain", icon: "⚖️", desc: "Metabolism-boosting movement & meals" },
            { symptom: "Joint Pain", icon: "🦴", desc: "Gentle mobility & anti-inflammatory food" },
            { symptom: "Low Energy", icon: "⚡", desc: "Energizing exercises & nutrition" },
            { symptom: "Mood Swings", icon: "🧠", desc: "Breathing, balance & mood-lifting meals" },
            { symptom: "Bloating", icon: "🫧", desc: "Gut-friendly meals & digestive movement" },
            { symptom: "Low Confidence", icon: "💪", desc: "Posture training & strength building" },
            { symptom: "Incontinence", icon: "💧", desc: "Pelvic floor training & Knack technique" },
            { symptom: "Pelvic Prolapse", icon: "🩺", desc: "Hypopressive exercises & organ support" },
          ].map((s) => (
            <div key={s.symptom} className="soft-card p-4 text-center hover:border-[#d8a7b5] transition-colors">
              <div className="text-2xl mb-1">{s.icon}</div>
              <h3 className="text-sm font-medium text-[#4a3f44] mb-0.5">{s.symptom}</h3>
              <p className="text-[11px] text-[#7b6870]">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SAMPLE DAILY PLAN */}
      <section className="max-w-7xl mx-auto py-6">
        <div className="soft-card p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-3">
            <div>
              <p className="uppercase tracking-[0.2em] text-[10px] font-bold text-[#d8a7b5] mb-1">Preview</p>
              <h2 className="text-3xl text-[#4a3f44] italic">Sample Daily Plan</h2>
              <p className="text-sm text-[#7b6870] mt-1">Here&apos;s what a typical day looks like — no sign-up needed to see this.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[#fdf2f5]/80 border border-[#f8d7e1] px-4 py-2 rounded-2xl text-center">
                <p className="text-[9px] uppercase tracking-widest text-[#d8a7b5] font-bold">Duration</p>
                <p className="text-lg font-semibold text-[#4a3f44]">~{samplePlan.totalMinutes} min</p>
              </div>
              <div className="bg-[#fdf2f5]/80 border border-[#f8d7e1] px-4 py-2 rounded-2xl text-center">
                <p className="text-[9px] uppercase tracking-widest text-[#d8a7b5] font-bold">Exercises</p>
                <p className="text-lg font-semibold text-[#4a3f44]">{samplePlan.exercises.length}</p>
              </div>
            </div>
          </div>

          {/* Exercise list */}
          <div className="grid sm:grid-cols-2 gap-2 mb-5">
            {samplePlan.exercises.map((ex, i) => (
              <div
                key={ex.name}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/50 border border-[#f0e3e8]"
              >
                <span className="w-7 h-7 rounded-full bg-[#fdf2f5] flex items-center justify-center text-[#d8a7b5] text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#4a3f44] truncate">{ex.name}</p>
                  <div className="flex items-center gap-2 text-[10px] text-[#b98fa1]">
                    <span>{ex.reps}</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-[#fdf2f5] border border-[#f0e3e8] capitalize">{ex.category}</span>
                  </div>
                </div>
                <span className="text-xs text-[#7b6870] shrink-0">
                  {Math.floor(ex.seconds / 60)}:{String(ex.seconds % 60).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>

          {/* Why it works */}
          <div className="p-4 rounded-xl bg-[#fdf2f5]/50 border border-[#f0e3e8] mb-5">
            <p className="text-xs text-[#6f5a62] leading-relaxed">
              <strong className="text-[#4a3f44]">Why this combination?</strong> This plan starts with a warm-up to prepare your joints, includes breathing exercises for hot flash relief, mobility work for joint pain, and ends with a calming cool-down for better sleep. Every session is built around your specific symptoms.
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-[#7b6870] mb-3">Take the assessment to get a plan personalized for <em>your</em> symptoms, age and goals.</p>
            <Link href="/quiz" className="btn-primary px-8 py-3 text-sm">
              Get My Personalized Plan — Free
            </Link>
          </div>
        </div>
      </section>

      {/* SUPPLEMENT PREVIEW */}
      <section className="max-w-7xl mx-auto py-6">
        <div className="soft-card p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-3">
            <div>
              <p className="uppercase tracking-[0.2em] text-[10px] font-bold text-[#d8a7b5] mb-1">Included In Your Plan</p>
              <h2 className="text-3xl text-[#4a3f44] italic">Menopause Supplement Guide</h2>
            </div>
            <Link href="/quiz" className="btn-outline text-sm shrink-0">Get My Personalized Doses</Link>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            {[
              {
                name: "Vitamin D3",
                dose: "2,000-4,000 IU/day",
                why: "Bone density drops sharply during menopause. D3 is essential for calcium absorption.",
                icon: "☀️",
              },
              {
                name: "Magnesium Glycinate",
                dose: "300-400mg before bed",
                why: "Improves sleep quality, reduces muscle cramps and supports 300+ enzyme reactions.",
                icon: "🌙",
              },
              {
                name: "Omega-3 (EPA/DHA)",
                dose: "1,000-2,000mg/day",
                why: "Reduces joint inflammation, supports brain function and heart health.",
                icon: "🐟",
              },
              {
                name: "Calcium",
                dose: "500-600mg/day",
                why: "Prevents bone loss. Best absorbed in smaller doses with food.",
                icon: "🦴",
              },
              {
                name: "Vitamin B Complex",
                dose: "1 capsule/day",
                why: "Supports energy production, mood regulation and nervous system health.",
                icon: "⚡",
              },
              {
                name: "Ashwagandha",
                dose: "300-600mg/day",
                why: "Adaptogen that reduces cortisol, improves sleep and balances stress hormones.",
                icon: "🌿",
              },
            ].map((supp) => (
              <div key={supp.name} className="p-4 rounded-xl bg-white/50 border border-[#f0e3e8]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{supp.icon}</span>
                  <h3 className="text-sm font-medium text-[#4a3f44]">{supp.name}</h3>
                </div>
                <p className="text-xs font-bold text-[#d8a7b5] mb-1">{supp.dose}</p>
                <p className="text-[11px] text-[#7b6870] leading-relaxed">{supp.why}</p>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-[#b98fa1] mt-4 text-center italic">
            Always consult your doctor before starting supplements. Doses are general guidelines based on current research.
          </p>
        </div>
      </section>

      {/* BUDGET COMPARISON */}
      <section className="max-w-5xl mx-auto py-4">
        <div className="soft-card p-6">
          <h2 className="text-2xl text-center text-[#4a3f44] mb-4 italic">How Much You Save</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-red-50/50 border border-red-100 text-center">
              <p className="text-xs text-red-400 uppercase font-bold tracking-widest mb-1">Without Us</p>
              <p className="text-2xl font-light text-red-500 line-through">€180+/mo</p>
              <p className="text-[10px] text-red-400 mt-1">Gym + nutritionist + supplements advice</p>
            </div>
            <div className="p-4 rounded-xl bg-[#fdf2f5] border-2 border-[#d8a7b5] text-center">
              <p className="text-xs text-[#d8a7b5] uppercase font-bold tracking-widest mb-1">Veronica Glow</p>
              <p className="text-2xl font-light text-[#4a3f44]">€29 <span className="text-sm">one-time</span></p>
              <p className="text-[10px] text-[#7b6870] mt-1">30 days of everything included</p>
            </div>
            <div className="p-4 rounded-xl bg-[#fdf2f5] border border-[#f0e3e8] text-center">
              <p className="text-xs text-[#d8a7b5] uppercase font-bold tracking-widest mb-1">Veronica Elite</p>
              <p className="text-2xl font-light text-[#4a3f44]">€79 <span className="text-sm">one-time</span></p>
              <p className="text-[10px] text-[#7b6870] mt-1">90 days + advanced features</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-5xl mx-auto py-6">
        <h2 className="text-3xl text-center text-[#4a3f44] mb-6 italic">
          What Women Are Saying
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              name: "Maria, 52",
              text: "After 2 weeks my hot flashes reduced significantly. The breathing exercises before bed changed my sleep completely.",
              result: "Sleep improved from 4/10 to 8/10",
              emoji: "😴",
            },
            {
              name: "Sandra, 47",
              text: "I was skeptical about budget meals being tasty, but my family loves them too. We save €80/month on groceries now.",
              result: "Saving €80/month on food",
              emoji: "🥗",
            },
            {
              name: "Jelena, 55",
              text: "The joint pain exercises are gentle but effective. I can walk up stairs without wincing for the first time in years.",
              result: "Joint pain reduced by Day 14",
              emoji: "🦴",
            },
            {
              name: "Ana, 49",
              text: "I love that it's only 20 minutes. No gym, no equipment. I do it in my living room before the kids wake up.",
              result: "Consistent for 30 days straight",
              emoji: "🧘‍♀️",
            },
            {
              name: "Dragana, 51",
              text: "The supplement guide alone was worth it. My doctor confirmed the doses are appropriate. I feel more energetic.",
              result: "Energy up from 3/10 to 7/10",
              emoji: "💊",
            },
            {
              name: "Ivana, 44",
              text: "Started with zero confidence about exercise. The Foundation phase was so gentle I actually stuck with it. Now I'm in Build phase!",
              result: "Completed Foundation + Build phases",
              emoji: "💪",
            },
          ].map((t) => (
            <div key={t.name} className="soft-card p-5">
              <div className="text-2xl mb-2">{t.emoji}</div>
              <p className="text-sm text-[#4a3f44] leading-relaxed mb-3 italic">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#4a3f44]">{t.name}</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#fdf2f5] text-[#8f6878] border border-[#f0e3e8] font-medium">
                  {t.result}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto py-6">
        <div className="soft-card p-6 md:p-8">
          <h2 className="text-3xl text-center text-[#4a3f44] mb-6 italic">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {FAQ_DATA.map((faq, i) => (
              <details
                key={i}
                className="group rounded-xl border border-[#f0e3e8] bg-white/40 overflow-hidden"
              >
                <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-medium text-[#4a3f44] hover:bg-[#fdf2f5]/50 transition-colors list-none">
                  <span>{faq.question}</span>
                  <span className="text-[#d8a7b5] text-lg shrink-0 ml-3 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-sm text-[#7b6870] leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
        <FaqJsonLd faqs={FAQ_DATA} />
      </section>

      {/* GET THE APP — QR + Download */}
      <section className="max-w-5xl mx-auto py-6">
        <div className="soft-card p-5 md:p-8">
          <h2 className="text-xl md:text-2xl text-[#4a3f44] mb-2 text-center md:text-left">Get the App</h2>
          <p className="text-xs md:text-sm text-[#5a4550] mb-4 text-center md:text-left">
            Use it like a native app — offline support, reminders, quick access.
          </p>
          <div className="flex flex-col md:flex-row items-center gap-5">
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <a
                href="/menopause-program.apk"
                download
                className="btn-primary px-5 py-2.5 text-xs text-center w-full md:w-auto"
              >
                Download Android
              </a>
              <Link href="/download" className="btn-outline px-5 py-2.5 text-xs text-center w-full md:w-auto">
                iPhone & More Info
              </Link>
            </div>
            <div className="hidden md:block shrink-0 text-center">
              <div className="inline-block p-2 bg-white rounded-xl border border-[#f0e3e8]">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://veronica-method.vercel.app/download&color=6b3a4d&bgcolor=ffffff"
                  alt="Scan to download"
                  width={120}
                  height={120}
                  className="rounded"
                />
              </div>
              <p className="text-[8px] text-[#7d5565] mt-1">Scan with phone</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-10">
        <div className="soft-card p-8 text-center border-[#d8a7b5]/20">
          <h2 className="text-3xl md:text-4xl mb-3 text-[#4a3f44] tracking-tight leading-tight">
            {t("Your Next Chapter")} {t("Can Feel")} <span className="italic text-[#d8a7b5]">{t("Amazing")}</span>
          </h2>
          <p className="text-sm text-[#7b6870] mb-5 max-w-md mx-auto">
            Take our free 2-minute assessment. Get personalized exercises, meals, supplements and a complete wellness plan.
          </p>
          <Link href="/quiz" className="btn-primary px-10 py-3 text-base">{t("Start Assessment")}</Link>
          <div className="flex flex-wrap gap-3 justify-center mt-3">
            <Link href="/free-guide" className="btn-outline px-6 py-2 text-sm">
              📖 Free Guide
            </Link>
            <Link href="/download" className="btn-outline px-6 py-2 text-sm">
              📱 Download App
            </Link>
          </div>
        </div>
      </section>

      <EmailCapture />
      <ExitIntent />
    </main>
  );
}

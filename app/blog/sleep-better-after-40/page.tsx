import Link from "next/link";
import type { Metadata } from "next";
import BlogJsonLd from "@/components/BlogJsonLd";

export const metadata: Metadata = {
  title: "The Evening Routine That Fixed My Menopause Insomnia",
  description: "A 15-minute wind-down routine combining breathing, stretches and one habit change that dramatically improves sleep during menopause.",
};

export default function SleepArticle() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-14">
      <Link href="/blog" className="text-sm text-[#b98fa1] hover:text-[#8f5d6f] mb-6 inline-block">← Back to Blog</Link>

      <article className="soft-card p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[10px] px-3 py-1 rounded-full bg-[#fdf2f5] text-[#b98fa1] font-bold uppercase tracking-widest border border-[#f0e3e8]">Sleep</span>
          <span className="text-[11px] text-[#b98fa1]">3 min read</span>
        </div>

        <h1 className="text-4xl md:text-5xl text-[#4a3f44] mb-6 leading-tight">
          The Evening Routine That Fixed My Menopause Insomnia
        </h1>

        <p className="text-lg text-[#7b6870] mb-8 leading-relaxed">
          Sleep problems affect over 60% of women during menopause. After months of trying everything, this simple 15-minute routine made the biggest difference.
        </p>

        <div className="space-y-8 text-[#6f5a62] leading-relaxed">
          <section>
            <h2 className="text-2xl text-[#4a3f44] mb-3">The 15-Minute Wind-Down</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-[#f0e3e8]">
                <p className="font-medium text-[#4a3f44] mb-1">Minutes 1-5: Gentle Neck & Shoulder Release</p>
                <p className="text-sm">Slow neck rolls, shoulder shrugs, and gentle twists. This releases the tension that accumulates during the day and triggers nighttime restlessness.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#f0e3e8]">
                <p className="font-medium text-[#4a3f44] mb-1">Minutes 5-10: Forward Fold & Child&apos;s Pose</p>
                <p className="text-sm">These inversions calm the nervous system by activating the parasympathetic response. Hold each for 2-3 minutes with deep breathing.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#f0e3e8]">
                <p className="font-medium text-[#4a3f44] mb-1">Minutes 10-15: Extended Exhale Breathing</p>
                <p className="text-sm">Inhale for 4 counts, exhale for 8 counts. The longer exhale directly signals your brain to prepare for sleep. This is the most important part.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl text-[#4a3f44] mb-3">The One Habit Change</h2>
            <p>
              Stop all screens 30 minutes before bed. Not 10 minutes — 30. Blue light suppresses melatonin production, and during menopause your melatonin levels are already lower. This single change, combined with the breathing routine, improved my sleep within 5 days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-[#4a3f44] mb-3">Bonus: Turmeric Milk</h2>
            <p>
              Warm milk (or oat milk) with turmeric, cinnamon and a tiny pinch of black pepper. The warmth promotes melatonin, turmeric reduces inflammation, and cinnamon stabilizes blood sugar overnight. Cost: about €0.40.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-[#fdf2f5] border border-[#f0e3e8]">
            <h2 className="text-xl text-[#4a3f44] mb-2">Results to Expect</h2>
            <p>Most women notice improvement within 5-10 days. the Veronica Method program includes sleep-specific routines on your rest days and evening breathing exercises in every session.</p>
          </section>
        </div>
      </article>

      <div className="soft-card p-8 mt-8 text-center">
        <h3 className="text-2xl text-[#4a3f44] mb-3">Get a Sleep-Optimized Program</h3>
        <p className="text-[#7b6870] mb-6 text-sm">Tell us about your sleep and we&apos;ll build a plan around it.</p>
        <Link href="/quiz" className="btn-primary">Take Free Assessment</Link>
      </div>
      <BlogJsonLd
        title="The Evening Routine That Fixed My Menopause Insomnia"
        description="A 15-minute wind-down routine combining breathing, stretches and one habit change that dramatically improves sleep during menopause."
        slug="sleep-better-after-40"
        datePublished="2025-02-01"
      />
    </main>
  );
}

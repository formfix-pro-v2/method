import Link from "next/link";
import type { Metadata } from "next";
import BlogJsonLd from "@/components/BlogJsonLd";

export const metadata: Metadata = {
  title: "How Better Posture Changed My Confidence at 52",
  description: "The link between posture, mood and self-image in midlife. Plus a 5-minute daily routine that makes a visible difference.",
};

export default function PostureArticle() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-14">
      <Link href="/blog" className="text-sm text-[#b98fa1] hover:text-[#8f5d6f] mb-6 inline-block">← Back to Blog</Link>

      <article className="soft-card p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[10px] px-3 py-1 rounded-full bg-[#fdf2f5] text-[#b98fa1] font-bold uppercase tracking-widest border border-[#f0e3e8]">Mindset</span>
          <span className="text-[11px] text-[#b98fa1]">3 min read</span>
        </div>

        <h1 className="text-4xl md:text-5xl text-[#4a3f44] mb-6 leading-tight">
          How Better Posture Changed My Confidence at 52
        </h1>

        <p className="text-lg text-[#7b6870] mb-8 leading-relaxed">
          I didn&apos;t realize how much my posture had changed until I saw a photo of myself from the side. Rounded shoulders, forward head, collapsed chest. It wasn&apos;t just how I looked — it was affecting how I felt about myself.
        </p>

        <div className="space-y-8 text-[#6f5a62] leading-relaxed">
          <section>
            <h2 className="text-2xl text-[#4a3f44] mb-3">The Posture-Mood Connection</h2>
            <p>Research shows that upright posture increases testosterone (confidence hormone) by 20% and decreases cortisol (stress hormone) by 25%. Standing tall literally changes your brain chemistry. During menopause, when mood swings and low confidence are common, this is powerful.</p>
          </section>

          <section>
            <h2 className="text-2xl text-[#4a3f44] mb-3">The 5-Minute Daily Routine</h2>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white border border-[#f0e3e8]">
                <p className="font-medium text-[#4a3f44] mb-1">Wall Posture Reset (1 min)</p>
                <p className="text-sm">Stand with back against wall. Press head, shoulders and hips to wall. Hold. This resets your body&apos;s sense of &ldquo;straight.&rdquo;</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#f0e3e8]">
                <p className="font-medium text-[#4a3f44] mb-1">Shoulder Blade Squeeze (1 min)</p>
                <p className="text-sm">Squeeze shoulder blades together and down, hold 5 seconds, release. 12 reps. Strengthens the muscles that hold you upright.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#f0e3e8]">
                <p className="font-medium text-[#4a3f44] mb-1">Chest Opener (1 min)</p>
                <p className="text-sm">Clasp hands behind back, lift arms gently while opening chest. Counteracts the &ldquo;phone hunch.&rdquo;</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#f0e3e8]">
                <p className="font-medium text-[#4a3f44] mb-1">Power Pose Hold (2 min)</p>
                <p className="text-sm">Stand with feet wide, arms in a V shape. Hold for 2 minutes. This is the confidence pose — it works even if you feel silly doing it.</p>
              </div>
            </div>
          </section>

          <section className="p-6 rounded-2xl bg-[#fdf2f5] border border-[#f0e3e8]">
            <h2 className="text-xl text-[#4a3f44] mb-2">What to Expect After 30 Days</h2>
            <p>With consistent daily posture exercises, many women notice their shoulders sitting back more naturally, improved body awareness, and a growing sense of confidence. The physical changes are gradual, but the mental shift often comes sooner.</p>
          </section>
        </div>
      </article>

      <div className="soft-card p-8 mt-8 text-center">
        <h3 className="text-2xl text-[#4a3f44] mb-3">Posture & Confidence Is Built Into Every Session</h3>
        <p className="text-[#7b6870] mb-6 text-sm">Our program includes posture exercises in your daily routine automatically.</p>
        <Link href="/quiz" className="btn-primary">Take Free Assessment</Link>
      </div>
      <BlogJsonLd title="How Better Posture Changed My Confidence at 52" description="The link between posture, mood and self-image in midlife. Plus a 5-minute daily routine that makes a visible difference." slug="confidence-posture-midlife" datePublished="2025-03-01" />
    </main>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import BlogJsonLd from "@/components/BlogJsonLd";

export const metadata: Metadata = {
  title: "Why Your Joints Hurt More After 40 (And What Helps)",
  description: "The hormone-joint connection explained, plus anti-inflammatory foods and mobility exercises that bring real relief during menopause.",
};

export default function JointPainArticle() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-14">
      <Link href="/blog" className="text-sm text-[#b98fa1] hover:text-[#8f5d6f] mb-6 inline-block">← Back to Blog</Link>

      <article className="soft-card p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[10px] px-3 py-1 rounded-full bg-[#fdf2f5] text-[#b98fa1] font-bold uppercase tracking-widest border border-[#f0e3e8]">Health</span>
          <span className="text-[11px] text-[#b98fa1]">5 min read</span>
        </div>

        <h1 className="text-4xl md:text-5xl text-[#4a3f44] mb-6 leading-tight">
          Why Your Joints Hurt More After 40 (And What Actually Helps)
        </h1>

        <p className="text-lg text-[#7b6870] mb-8 leading-relaxed">
          If your knees, hips or shoulders started aching seemingly out of nowhere, you&apos;re not imagining it. Estrogen plays a crucial role in joint lubrication, and as levels drop during menopause, inflammation increases.
        </p>

        <div className="space-y-8 text-[#6f5a62] leading-relaxed">
          <section>
            <h2 className="text-2xl text-[#4a3f44] mb-3">The Hormone-Joint Connection</h2>
            <p>Estrogen has anti-inflammatory properties and helps maintain cartilage and synovial fluid (the lubricant in your joints). When estrogen drops, joints become stiffer, drier, and more prone to pain — especially in the morning.</p>
          </section>

          <section>
            <h2 className="text-2xl text-[#4a3f44] mb-3">4 Anti-Inflammatory Foods</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { food: "Canned Sardines", why: "Richest budget source of omega-3. €1.20 per can." },
                { food: "Turmeric + Black Pepper", why: "Curcumin reduces joint inflammation. Pepper increases absorption 2000%." },
                { food: "Frozen Berries", why: "Anthocyanins reduce inflammatory markers. Cheaper than fresh." },
                { food: "Walnuts", why: "Plant-based omega-3. Just 6 halves per day makes a difference." },
              ].map((item) => (
                <div key={item.food} className="p-4 rounded-2xl bg-[#fdf2f5] border border-[#f0e3e8]">
                  <p className="font-medium text-[#4a3f44] text-sm mb-1">{item.food}</p>
                  <p className="text-xs">{item.why}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl text-[#4a3f44] mb-3">3 Mobility Exercises</h2>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white border border-[#f0e3e8]">
                <p className="font-medium text-[#4a3f44] mb-1">Cat-Cow Flow (2 min)</p>
                <p className="text-sm">Gentle spinal movement that lubricates the entire spine. Do every morning.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#f0e3e8]">
                <p className="font-medium text-[#4a3f44] mb-1">Hip Opener Stretch (1 min each side)</p>
                <p className="text-sm">Releases tight hip flexors that contribute to knee and lower back pain.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#f0e3e8]">
                <p className="font-medium text-[#4a3f44] mb-1">Ankle Circles (1 min)</p>
                <p className="text-sm">Improves circulation to feet and ankles. Reduces morning stiffness.</p>
              </div>
            </div>
          </section>

          <section className="p-6 rounded-2xl bg-[#fdf2f5] border border-[#f0e3e8]">
            <h2 className="text-xl text-[#4a3f44] mb-2">What to Expect</h2>
            <p>Most women notice reduced stiffness within 1-2 weeks of daily mobility work combined with anti-inflammatory nutrition. the Veronica Method program automatically prioritizes joint-friendly exercises when you report joint pain in your assessment.</p>
          </section>
        </div>
      </article>

      <div className="soft-card p-8 mt-8 text-center">
        <h3 className="text-2xl text-[#4a3f44] mb-3">Get a Joint-Friendly Program</h3>
        <p className="text-[#7b6870] mb-6 text-sm">Tell us about your joint pain and we&apos;ll build a gentle plan around it.</p>
        <Link href="/quiz" className="btn-primary">Take Free Assessment</Link>
      </div>
      <BlogJsonLd title="Why Your Joints Hurt More After 40 (And What Helps)" description="The hormone-joint connection explained, plus anti-inflammatory foods and mobility exercises that bring real relief during menopause." slug="joint-pain-menopause" datePublished="2025-02-20" />
    </main>
  );
}

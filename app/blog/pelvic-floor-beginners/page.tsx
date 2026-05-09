import Link from "next/link";
import type { Metadata } from "next";
import BlogJsonLd from "@/components/BlogJsonLd";

export const metadata: Metadata = {
  title: "Pelvic Floor Exercises: A Beginner's Guide for Women 40+",
  description: "Why your pelvic floor weakens during menopause and 3 simple exercises you can do anywhere to strengthen it safely.",
};

export default function PelvicFloorArticle() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-14">
      <Link href="/blog" className="text-sm text-[#b98fa1] hover:text-[#8f5d6f] mb-6 inline-block">← Back to Blog</Link>

      <article className="soft-card p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[10px] px-3 py-1 rounded-full bg-[#fdf2f5] text-[#b98fa1] font-bold uppercase tracking-widest border border-[#f0e3e8]">Exercise</span>
          <span className="text-[11px] text-[#b98fa1]">4 min read</span>
        </div>

        <h1 className="text-4xl md:text-5xl text-[#4a3f44] mb-6 leading-tight">
          Pelvic Floor Exercises: A Beginner&apos;s Guide for Women 40+
        </h1>

        <p className="text-lg text-[#7b6870] mb-8 leading-relaxed">
          During menopause, declining estrogen weakens the pelvic floor muscles that support your bladder, uterus and bowel. The good news: these muscles respond well to exercise at any age.
        </p>

        <div className="space-y-8 text-[#6f5a62] leading-relaxed">
          <section>
            <h2 className="text-2xl text-[#4a3f44] mb-3">Why It Matters</h2>
            <p>A weak pelvic floor can cause bladder leaks when coughing or laughing, lower back pain, and reduced core stability. Strengthening it takes just 5 minutes a day and the results are noticeable within 3-4 weeks.</p>
          </section>

          <section>
            <h2 className="text-2xl text-[#4a3f44] mb-3">Exercise 1: Basic Kegel Hold</h2>
            <div className="p-5 rounded-2xl bg-[#fdf2f5] border border-[#f0e3e8]">
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Sit or lie comfortably with a neutral spine.</li>
                <li>Gently contract your pelvic floor (imagine stopping urine mid-flow).</li>
                <li>Hold for 5 seconds. Breathe normally — don&apos;t hold your breath.</li>
                <li>Release slowly for 5 seconds.</li>
                <li>Repeat 10 times. Do 3 sets per day.</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl text-[#4a3f44] mb-3">Exercise 2: Bridge with Squeeze</h2>
            <p>Lie on your back, knees bent, small pillow between knees. Lift hips while squeezing the pillow. This combines glute strength with pelvic floor activation — double the benefit.</p>
          </section>

          <section>
            <h2 className="text-2xl text-[#4a3f44] mb-3">Exercise 3: Deep Squat Hold</h2>
            <p>Stand with feet wide, toes slightly out. Lower into a deep squat (use a chair for support if needed). Hold for 20 seconds. This stretches and strengthens the pelvic floor in its full range of motion.</p>
          </section>

          <section className="p-6 rounded-2xl bg-[#fdf2f5] border border-[#f0e3e8]">
            <h2 className="text-xl text-[#4a3f44] mb-2">Important</h2>
            <p>If you experience pain or have prolapse symptoms, consult a pelvic floor physiotherapist before starting. These exercises are gentle but should feel comfortable, never painful.</p>
          </section>
        </div>
      </article>

      <div className="soft-card p-8 mt-8 text-center">
        <h3 className="text-2xl text-[#4a3f44] mb-3">Pelvic Floor Recovery Is Part of Our Program</h3>
        <p className="text-[#7b6870] mb-6 text-sm">The Elite plan includes a complete pelvic floor recovery system.</p>
        <Link href="/quiz" className="btn-primary">Take Free Assessment</Link>
      </div>
      <BlogJsonLd title="Pelvic Floor Exercises: A Beginner's Guide for Women 40+" description="Why your pelvic floor weakens during menopause and 3 simple exercises you can do anywhere to strengthen it safely." slug="pelvic-floor-beginners" datePublished="2025-02-10" />
    </main>
  );
}

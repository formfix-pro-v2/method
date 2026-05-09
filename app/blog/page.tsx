import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wellness Blog",
  description:
    "Expert tips on menopause wellness, budget-friendly nutrition, exercise routines and hormone balance for women over 40.",
};

const articles = [
  {
    slug: "exercises-for-hot-flashes",
    title: "5 Gentle Exercises That Help Reduce Hot Flashes",
    excerpt:
      "Breathing techniques and cooling movements that calm your nervous system and reduce hot flash frequency within 2 weeks.",
    category: "Exercise",
    readTime: "4 min",
    date: "2026-04-15",
  },
  {
    slug: "menopause-meal-plan-budget",
    title: "Hormone-Friendly Meals Under €6 Per Day",
    excerpt:
      "A complete day of eating that supports estrogen balance, reduces bloating and costs less than a coffee shop lunch.",
    category: "Nutrition",
    readTime: "5 min",
    date: "2026-04-10",
  },
  {
    slug: "sleep-better-after-40",
    title: "The Evening Routine That Fixed My Menopause Insomnia",
    excerpt:
      "A simple 15-minute wind-down sequence combining breathing, gentle stretches and one surprising habit change.",
    category: "Sleep",
    readTime: "3 min",
    date: "2026-04-05",
  },
  {
    slug: "pelvic-floor-beginners",
    title: "Pelvic Floor Exercises: A Beginner's Guide for Women 40+",
    excerpt:
      "Why your pelvic floor weakens during menopause and 3 simple exercises you can do anywhere to strengthen it.",
    category: "Exercise",
    readTime: "4 min",
    date: "2026-03-28",
  },
  {
    slug: "joint-pain-menopause",
    title: "Why Your Joints Hurt More After 40 (And What Actually Helps)",
    excerpt:
      "The hormone-joint connection explained, plus 4 anti-inflammatory foods and mobility exercises that bring relief.",
    category: "Health",
    readTime: "5 min",
    date: "2026-03-20",
  },
  {
    slug: "confidence-posture-midlife",
    title: "How Better Posture Changed My Confidence at 52",
    excerpt:
      "The link between posture, mood and self-image — plus a 5-minute daily routine that makes a visible difference.",
    category: "Mindset",
    readTime: "3 min",
    date: "2026-03-15",
  },
];

export default function BlogPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-14">
      <section className="soft-card p-10 mb-10">
        <p className="uppercase tracking-[0.25em] text-xs text-[#b98fa1] mb-4 font-bold">
          Wellness Journal
        </p>
        <h1 className="text-5xl mb-4 text-[#4a3f44]">The Veronica Method Blog</h1>
        <p className="text-[#7b6870] text-lg max-w-2xl">
          Expert guidance on menopause wellness, nutrition on a budget, gentle
          exercise and building confidence through midlife.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="soft-card p-8 group hover:border-[#d8a7b5] transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] px-3 py-1 rounded-full bg-[#fdf2f5] text-[#b98fa1] font-bold uppercase tracking-widest border border-[#f0e3e8]">
                {article.category}
              </span>
              <span className="text-[11px] text-[#b98fa1]">
                {article.readTime} read
              </span>
            </div>

            <h2 className="text-2xl text-[#4a3f44] mb-3 group-hover:text-[#d8a7b5] transition-colors">
              {article.title}
            </h2>

            <p className="text-sm text-[#7b6870] leading-relaxed mb-4">
              {article.excerpt}
            </p>

            <span className="text-sm text-[#d8a7b5] font-medium">
              Read more →
            </span>
          </Link>
        ))}
      </div>

      <section className="soft-card p-10 text-center">
        <h2 className="text-3xl text-[#4a3f44] mb-4">
          Ready to Start Your Journey?
        </h2>
        <p className="text-[#7b6870] mb-6">
          Take our free 2-minute assessment and get a personalized plan.
        </p>
        <Link href="/quiz" className="btn-primary px-10 py-4">
          Start Free Assessment
        </Link>
      </section>
    </main>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import BlogJsonLd from "@/components/BlogJsonLd";

export const metadata: Metadata = {
  title: "5 Gentle Exercises That Help Reduce Hot Flashes",
  description:
    "Breathing techniques and cooling movements that calm your nervous system and reduce hot flash frequency. Evidence-based exercises for women in menopause.",
};

export default function HotFlashArticle() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-14">
      <Link
        href="/blog"
        className="text-sm text-[#b98fa1] hover:text-[#8f5d6f] mb-6 inline-block"
      >
        ← Back to Blog
      </Link>

      <article className="soft-card p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[10px] px-3 py-1 rounded-full bg-[#fdf2f5] text-[#b98fa1] font-bold uppercase tracking-widest border border-[#f0e3e8]">
            Exercise
          </span>
          <span className="text-[11px] text-[#b98fa1]">4 min read</span>
        </div>

        <h1 className="text-4xl md:text-5xl text-[#4a3f44] mb-6 leading-tight">
          5 Gentle Exercises That Help Reduce Hot Flashes
        </h1>

        <p className="text-lg text-[#7b6870] mb-8 leading-relaxed">
          Hot flashes affect up to 80% of women during menopause. While they
          can&apos;t be eliminated entirely, specific breathing and movement
          techniques can significantly reduce their frequency and intensity.
        </p>

        <div className="space-y-8 text-[#6f5a62] leading-relaxed">
          <section>
            <h2 className="text-2xl text-[#4a3f44] mb-3">
              Why Exercise Helps Hot Flashes
            </h2>
            <p>
              Hot flashes are triggered by your body&apos;s thermoregulation
              system becoming more sensitive during hormonal changes. Regular
              gentle exercise helps stabilize this system by improving
              circulation, reducing cortisol, and strengthening the
              parasympathetic nervous system (your &ldquo;calm down&rdquo;
              response).
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-[#4a3f44] mb-3">
              1. Diaphragmatic Breathing (3 minutes)
            </h2>
            <p className="mb-3">
              This is the single most effective technique. Deep belly breathing
              activates your vagus nerve, which directly cools the nervous
              system.
            </p>
            <div className="p-5 rounded-2xl bg-[#fdf2f5] border border-[#f0e3e8]">
              <p className="text-sm font-medium text-[#4a3f44] mb-2">How to do it:</p>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Sit comfortably. Place one hand on your chest, one on your belly.</li>
                <li>Breathe in through your nose for 4 counts — your belly should rise.</li>
                <li>Hold for 4 counts.</li>
                <li>Exhale slowly through your mouth for 6 counts.</li>
                <li>Repeat for 3 minutes. Do this when you feel a flash coming.</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl text-[#4a3f44] mb-3">
              2. Cat-Cow Spinal Flow (2 minutes)
            </h2>
            <p>
              This gentle yoga movement improves spinal circulation and helps
              regulate body temperature. The rhythmic motion is naturally
              calming and can be done on any surface.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-[#4a3f44] mb-3">
              3. Cooling Forward Fold (1 minute)
            </h2>
            <p>
              Standing forward folds bring blood flow to the head and have a
              natural cooling effect. They also release tension in the lower
              back and hamstrings, which tighten during stress.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-[#4a3f44] mb-3">
              4. Gentle Walking (15 minutes)
            </h2>
            <p>
              Regular walking — especially in the morning — helps regulate your
              circadian rhythm and body temperature throughout the day. Studies
              show women who walk 30 minutes daily experience 40% fewer hot
              flashes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-[#4a3f44] mb-3">
              5. Evening Neck & Shoulder Release (2 minutes)
            </h2>
            <p>
              Tension in the neck and shoulders can trigger or worsen hot
              flashes. A simple release before bed helps prevent nighttime
              episodes and improves sleep quality.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-[#fdf2f5] border border-[#f0e3e8]">
            <h2 className="text-xl text-[#4a3f44] mb-2">Key Takeaway</h2>
            <p>
              Consistency matters more than intensity. Even 10 minutes of these
              exercises daily can make a noticeable difference within 2 weeks.
              the Veronica Method program includes all of these in your personalized
              daily plan.
            </p>
          </section>
        </div>
      </article>

      <div className="soft-card p-8 mt-8 text-center">
        <h3 className="text-2xl text-[#4a3f44] mb-3">
          Get These Exercises in a Daily Plan
        </h3>
        <p className="text-[#7b6870] mb-6 text-sm">
          Our free assessment creates a personalized program based on your
          symptoms.
        </p>
        <Link href="/quiz" className="btn-primary">
          Take Free Assessment
        </Link>
      </div>
      <BlogJsonLd title="5 Gentle Exercises That Help Reduce Hot Flashes" description="Evidence-based breathing and movement techniques that help regulate body temperature and reduce hot flash frequency during menopause." slug="exercises-for-hot-flashes" datePublished="2025-01-15" />
    </main>
  );
}

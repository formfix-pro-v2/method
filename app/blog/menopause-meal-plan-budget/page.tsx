import Link from "next/link";
import type { Metadata } from "next";
import BlogJsonLd from "@/components/BlogJsonLd";

export const metadata: Metadata = {
  title: "Hormone-Friendly Meals Under €6 Per Day",
  description:
    "A complete day of budget-friendly eating that supports hormone balance during menopause. Breakfast, lunch, dinner and snack — all under €6.",
};

export default function MealPlanArticle() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-14">
      <Link href="/blog" className="text-sm text-[#b98fa1] hover:text-[#8f5d6f] mb-6 inline-block">
        ← Back to Blog
      </Link>

      <article className="soft-card p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[10px] px-3 py-1 rounded-full bg-[#fdf2f5] text-[#b98fa1] font-bold uppercase tracking-widest border border-[#f0e3e8]">Nutrition</span>
          <span className="text-[11px] text-[#b98fa1]">5 min read</span>
        </div>

        <h1 className="text-4xl md:text-5xl text-[#4a3f44] mb-6 leading-tight">
          Hormone-Friendly Meals Under €6 Per Day
        </h1>

        <p className="text-lg text-[#7b6870] mb-8 leading-relaxed">
          Eating well during menopause doesn&apos;t have to be expensive. Here&apos;s a full day of meals that support your hormones, keep you full, and cost less than a takeaway coffee.
        </p>

        <div className="space-y-8 text-[#6f5a62] leading-relaxed">
          <section>
            <h2 className="text-2xl text-[#4a3f44] mb-3">The Principles</h2>
            <ul className="space-y-2">
              <li>• <strong>Protein at every meal</strong> — keeps blood sugar stable and reduces cravings</li>
              <li>• <strong>Anti-inflammatory foods</strong> — turmeric, omega-3 fish, leafy greens</li>
              <li>• <strong>Fiber-rich carbs</strong> — oats, beans, sweet potatoes (not white bread)</li>
              <li>• <strong>Healthy fats</strong> — nuts, seeds, olive oil (support hormone production)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-[#4a3f44] mb-3">Breakfast: Overnight Oats (€0.75)</h2>
            <p>50g oats + 1 tbsp flaxseeds + 1 apple + cinnamon. Mix with water or milk the night before. Flaxseeds contain lignans that support estrogen balance.</p>
          </section>

          <section>
            <h2 className="text-2xl text-[#4a3f44] mb-3">Lunch: Tuna & Bean Salad (€1.60)</h2>
            <p>1 can tuna + half can white beans + spinach + lemon juice. No cooking needed. 38g protein for under €2.</p>
          </section>

          <section>
            <h2 className="text-2xl text-[#4a3f44] mb-3">Dinner: Chickpea Curry (€1.30)</h2>
            <p>1 can chickpeas + spinach + light coconut milk + curry powder over rice. Ready in 15 minutes, plant-based protein, and incredibly satisfying.</p>
          </section>

          <section>
            <h2 className="text-2xl text-[#4a3f44] mb-3">Snack: Apple & Seeds (€0.50)</h2>
            <p>1 apple + cinnamon + sunflower seeds. Stabilizes blood sugar between meals.</p>
          </section>

          <section className="p-6 rounded-2xl bg-[#fdf2f5] border border-[#f0e3e8]">
            <h2 className="text-xl text-[#4a3f44] mb-2">Daily Total: €4.15 | 1,430 kcal | 82g protein</h2>
            <p>the Veronica Method program generates a different meal plan every day, personalized to your calorie needs and symptoms — all under €7/day.</p>
          </section>
        </div>
      </article>

      <div className="soft-card p-8 mt-8 text-center">
        <h3 className="text-2xl text-[#4a3f44] mb-3">Get 30 Days of Personalized Meals</h3>
        <p className="text-[#7b6870] mb-6 text-sm">Different every day, tailored to your body and budget.</p>
        <Link href="/quiz" className="btn-primary">Take Free Assessment</Link>
      </div>
      <BlogJsonLd title="Hormone-Friendly Meals Under €6 Per Day" description="Budget-friendly meal planning for menopause with anti-inflammatory recipes, shopping tips and weekly meal prep guide." slug="menopause-meal-plan-budget" datePublished="2025-01-20" />
    </main>
  );
}

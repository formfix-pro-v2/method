import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Complete Menopause Wellness Guide",
  description: "Free evidence-based guide: exercises, meal plans, supplements and daily routines for women 40+.",
  robots: { index: false },
};

export default function GuidePage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-10 print:px-0 print:py-0 print:max-w-none">
      {/* Print styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          header, footer, nav, .no-print { display: none !important; }
          .soft-card { border: none !important; box-shadow: none !important; background: white !important; padding: 0 !important; }
          main { padding: 1cm !important; max-width: 100% !important; }
          .page-break { page-break-before: always; }
          body { font-size: 11pt !important; line-height: 1.5 !important; color: #333 !important; }
          h1 { font-size: 24pt !important; }
          h2 { font-size: 18pt !important; }
          h3 { font-size: 14pt !important; }
        }
      `}} />

      {/* COVER */}
      <section className="soft-card p-10 mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#a8687a] font-bold mb-4">Veronica Method</p>
        <h1 className="text-5xl text-[#2a1a22] mb-4">The Complete Menopause Wellness Guide</h1>
        <p className="text-lg text-[#5a4550] max-w-xl mx-auto mb-6">
          Evidence-based exercises, budget meal plans, supplement protocols and daily routines for women 40+
        </p>
        <div className="flex justify-center gap-4 text-xs text-[#7d5565]">
          <span>📖 30+ pages</span>
          <span>🧘‍♀️ 20 exercises</span>
          <span>🥗 7-day meal plan</span>
          <span>💊 12 supplements</span>
        </div>
        <p className="text-[10px] text-[#7d5565] mt-6">© 2025 Veronica Method. For personal use only.</p>
      </section>

      {/* TABLE OF CONTENTS */}
      <section className="soft-card p-8 mb-8">
        <h2 className="text-2xl text-[#2a1a22] mb-4">Contents</h2>
        <div className="space-y-2 text-sm text-[#4a3f44]">
          {[
            "1. Understanding Menopause — What's Happening in Your Body",
            "2. The Foundation Exercises (Gentle Start)",
            "3. Breathing Techniques for Hot Flashes & Sleep",
            "4. Pelvic Floor Rehabilitation Protocol",
            "5. 7-Day Budget Meal Plan (Under €7/Day)",
            "6. Complete Supplement Guide with Doses",
            "7. Daily Routine Templates (10, 20, 30 min)",
            "8. Symptom Tracker Worksheet",
            "9. Shopping List Template",
            "10. Your 30-Day Action Plan",
          ].map((item) => (
            <p key={item} className="py-1 border-b border-[#f0e3e8]">{item}</p>
          ))}
        </div>
      </section>

      {/* CHAPTER 1 */}
      <section className="soft-card p-8 mb-8 page-break">
        <h2 className="text-3xl text-[#2a1a22] mb-6">1. Understanding Menopause</h2>
        <p className="text-sm text-[#4a3f44] mb-4">
          Menopause is not a disease — it&apos;s a natural transition. But the symptoms can significantly impact your quality of life. Understanding what&apos;s happening helps you take control.
        </p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-[#fdf2f5] border border-[#f0e3e8]">
            <h3 className="text-sm font-bold text-[#4a3f44] mb-2">Estrogen Decline</h3>
            <p className="text-xs text-[#5a4550]">Estrogen drops 60-80% during menopause, affecting bones, joints, brain, heart, skin, and pelvic floor tissue.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#fdf2f5] border border-[#f0e3e8]">
            <h3 className="text-sm font-bold text-[#4a3f44] mb-2">Progesterone Loss</h3>
            <p className="text-xs text-[#5a4550]">Progesterone (the calming hormone) drops first, causing anxiety, sleep issues, and mood swings before hot flashes begin.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#fdf2f5] border border-[#f0e3e8]">
            <h3 className="text-sm font-bold text-[#4a3f44] mb-2">Metabolism Shift</h3>
            <p className="text-xs text-[#5a4550]">Basal metabolic rate drops 2-4% per decade after 40. Muscle mass decreases without strength training, further slowing metabolism.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#fdf2f5] border border-[#f0e3e8]">
            <h3 className="text-sm font-bold text-[#4a3f44] mb-2">Collagen Breakdown</h3>
            <p className="text-xs text-[#5a4550]">Skin loses 30% of collagen in the first 5 years of menopause. This also affects joints, pelvic floor fascia, and blood vessels.</p>
          </div>
        </div>
        <p className="text-xs text-[#7d5565] italic">The good news: exercise, nutrition and targeted supplements can significantly reduce all of these effects.</p>
      </section>

      {/* CHAPTER 2 — EXERCISES */}
      <section className="soft-card p-8 mb-8 page-break">
        <h2 className="text-3xl text-[#2a1a22] mb-6">2. Foundation Exercises</h2>
        <p className="text-sm text-[#4a3f44] mb-6">Start here. These 10 exercises are gentle, require no equipment, and target the most common menopause symptoms.</p>

        <div className="space-y-4">
          {[
            { name: "Gentle March in Place", time: "2 min", why: "Warms up body, increases blood flow" },
            { name: "Diaphragmatic Breathing", time: "3 min", why: "Reduces cortisol, calms hot flashes" },
            { name: "Cat-Cow Flow", time: "2 min", why: "Restores spinal mobility, relieves stiffness" },
            { name: "Bridge Lift", time: "2 min", why: "Strengthens glutes and pelvic floor" },
            { name: "Chair Squat", time: "2 min", why: "Builds leg strength, supports bone density" },
            { name: "Wall Push-Up", time: "1.5 min", why: "Upper body strength without floor strain" },
            { name: "Single-Leg Stand", time: "1.5 min", why: "Improves balance, reduces fall risk" },
            { name: "Pelvic Floor Activation", time: "2 min", why: "Strengthens pelvic floor muscles" },
            { name: "Neck Release Sequence", time: "1.5 min", why: "Relieves tension headaches" },
            { name: "Child's Pose Rest", time: "2 min", why: "Full-body relaxation, calms nervous system" },
          ].map((ex, i) => (
            <div key={ex.name} className="flex items-center gap-3 p-3 rounded-xl bg-white/60 border border-[#f0e3e8]">
              <span className="w-7 h-7 rounded-full bg-[#fdf2f5] flex items-center justify-center text-xs text-[#a8687a] font-bold shrink-0">{i + 1}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#2a1a22]">{ex.name}</p>
                <p className="text-[10px] text-[#7d5565]">{ex.why}</p>
              </div>
              <span className="text-xs text-[#a8687a] font-medium shrink-0">{ex.time}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-[#5a4550] mt-4 italic">Total session: ~20 minutes. Do this daily for the first 7 days.</p>
      </section>

      {/* CHAPTER 3 — BREATHING */}
      <section className="soft-card p-8 mb-8 page-break">
        <h2 className="text-3xl text-[#2a1a22] mb-6">3. Breathing for Hot Flashes & Sleep</h2>
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-[#fdf2f5] border border-[#f0e3e8]">
            <h3 className="text-base font-bold text-[#2a1a22] mb-2">Cooling Breath (Sitali) — For Hot Flashes</h3>
            <ol className="space-y-1 text-xs text-[#4a3f44]">
              <li>1. Curl your tongue into a tube (or purse lips if you can&apos;t)</li>
              <li>2. Inhale slowly through the curled tongue — feel the cool air</li>
              <li>3. Close mouth, exhale through nose</li>
              <li>4. Repeat 10 times</li>
            </ol>
            <p className="text-[10px] text-[#7d5565] mt-2 italic">Physically cools the body by 1-2°C. Use at the first sign of a hot flash.</p>
          </div>

          <div className="p-5 rounded-xl bg-[#fdf2f5] border border-[#f0e3e8]">
            <h3 className="text-base font-bold text-[#2a1a22] mb-2">4-7-8 Breath — For Sleep</h3>
            <ol className="space-y-1 text-xs text-[#4a3f44]">
              <li>1. Inhale through nose for 4 counts</li>
              <li>2. Hold breath for 7 counts</li>
              <li>3. Exhale through mouth with &ldquo;whoosh&rdquo; sound for 8 counts</li>
              <li>4. Repeat 4 cycles</li>
            </ol>
            <p className="text-[10px] text-[#7d5565] mt-2 italic">Acts as a natural tranquilizer. Do in bed before sleep.</p>
          </div>

          <div className="p-5 rounded-xl bg-[#fdf2f5] border border-[#f0e3e8]">
            <h3 className="text-base font-bold text-[#2a1a22] mb-2">Box Breathing — For Anxiety & Stress</h3>
            <ol className="space-y-1 text-xs text-[#4a3f44]">
              <li>1. Inhale 4 counts</li>
              <li>2. Hold 4 counts</li>
              <li>3. Exhale 4 counts</li>
              <li>4. Hold 4 counts</li>
              <li>5. Repeat 6 cycles</li>
            </ol>
            <p className="text-[10px] text-[#7d5565] mt-2 italic">Used by Navy SEALs for stress management. Balances autonomic nervous system.</p>
          </div>
        </div>
      </section>

      {/* CHAPTER 5 — MEAL PLAN */}
      <section className="soft-card p-8 mb-8 page-break">
        <h2 className="text-3xl text-[#2a1a22] mb-6">5. 7-Day Meal Plan (Under €7/Day)</h2>
        <p className="text-sm text-[#4a3f44] mb-6">All meals are hormone-friendly, anti-inflammatory, and budget-optimized.</p>

        <div className="space-y-4">
          {[
            { day: "Monday", b: "Overnight Hormone Oats", l: "Lemon Tuna & White Bean Salad", d: "Golden Turmeric Egg Scramble", cost: "€5.80" },
            { day: "Tuesday", b: "Greek Yogurt Power Bowl", l: "Chickpea & Spinach Curry", d: "Salmon & Sweet Potato Bake", cost: "€6.40" },
            { day: "Wednesday", b: "Turmeric Scrambled Eggs", l: "Bone Broth Lentil Soup", d: "Turkey & Vegetable Stir-Fry", cost: "€5.90" },
            { day: "Thursday", b: "Collagen Berry Smoothie", l: "Citrus Chicken & Kale Bowl", d: "White Bean & Spinach Stew", cost: "€6.10" },
            { day: "Friday", b: "Sardine Toast with Lemon", l: "Mediterranean Quinoa Bowl", d: "One-Pan Chicken & Vegetables", cost: "€6.50" },
            { day: "Saturday", b: "Warm Oat & Walnut Porridge", l: "Sweet Potato & Black Bean Bowl", d: "Baked Fish with Roasted Veg", cost: "€5.70" },
            { day: "Sunday", b: "Spinach & Red Pepper Egg Muffins", l: "Leftover Soup + Bread", d: "Simple Pasta with Vegetables", cost: "€4.90" },
          ].map((d) => (
            <div key={d.day} className="p-3 rounded-xl bg-white/60 border border-[#f0e3e8]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-[#2a1a22]">{d.day}</span>
                <span className="text-xs text-[#a8687a] font-medium">{d.cost}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px] text-[#5a4550]">
                <span>🌅 {d.b}</span>
                <span>☀️ {d.l}</span>
                <span>🌙 {d.d}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-[#7d5565] mt-4">Average: €5.90/day. Full recipes with ingredients and steps available in the app.</p>
      </section>

      {/* CHAPTER 6 — SUPPLEMENTS */}
      <section className="soft-card p-8 mb-8 page-break">
        <h2 className="text-3xl text-[#2a1a22] mb-6">6. Supplement Guide</h2>
        <p className="text-sm text-[#4a3f44] mb-6">Evidence-based recommendations. Always consult your doctor before starting.</p>

        <div className="space-y-3">
          {[
            { name: "Vitamin D3", dose: "2,000–4,000 IU", timing: "With breakfast", why: "Bone density, calcium absorption, immune function" },
            { name: "Magnesium Glycinate", dose: "300–400mg", timing: "Before bed", why: "Sleep quality, muscle cramps, 300+ enzyme reactions" },
            { name: "Omega-3 (EPA/DHA)", dose: "1,000–2,000mg", timing: "With meal", why: "Joint inflammation, brain function, heart health" },
            { name: "Calcium", dose: "500–600mg", timing: "2× with meals", why: "Bone loss prevention (split doses absorb better)" },
            { name: "Vitamin C", dose: "500–1,000mg", timing: "With breakfast", why: "Collagen synthesis, pelvic floor tissue support" },
            { name: "Collagen Peptides", dose: "10–15g", timing: "Morning", why: "Skin, joints, connective tissue repair" },
            { name: "Vitamin B Complex", dose: "1 capsule", timing: "With breakfast", why: "Energy, mood regulation, nervous system" },
            { name: "Ashwagandha", dose: "300–600mg", timing: "Morning/evening", why: "Reduces cortisol 30%, improves sleep" },
            { name: "Zinc", dose: "15–25mg", timing: "With food", why: "Immune function, tissue repair, thyroid health" },
            { name: "Probiotics", dose: "10–30B CFU", timing: "Empty stomach", why: "Gut health, hormone metabolism, mood" },
            { name: "Vitamin K2 (MK-7)", dose: "100–200mcg", timing: "With Vitamin D", why: "Directs calcium to bones, not arteries" },
            { name: "Hyaluronic Acid", dose: "120–240mg", timing: "Any time", why: "Tissue hydration, vaginal health, joint lubrication" },
          ].map((s) => (
            <div key={s.name} className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-[#f0e3e8]">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#2a1a22]">{s.name}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#fdf2f5] text-[#a8687a] font-bold">{s.dose}</span>
                </div>
                <p className="text-[10px] text-[#5a4550] mt-0.5">{s.why}</p>
              </div>
              <span className="text-[9px] text-[#7d5565] shrink-0">⏰ {s.timing}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CHAPTER 7 — DAILY ROUTINES */}
      <section className="soft-card p-8 mb-8 page-break">
        <h2 className="text-3xl text-[#2a1a22] mb-6">7. Daily Routine Templates</h2>

        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-[#fdf2f5] border border-[#f0e3e8]">
            <h3 className="text-base font-bold text-[#2a1a22] mb-3">⚡ 10-Minute Express</h3>
            <ol className="space-y-1 text-xs text-[#4a3f44]">
              <li>1. Gentle March (1 min)</li>
              <li>2. Cat-Cow Flow (2 min)</li>
              <li>3. Chair Squats (2 min)</li>
              <li>4. Wall Push-Ups (2 min)</li>
              <li>5. Diaphragmatic Breathing (2 min)</li>
              <li>6. Forward Fold (1 min)</li>
            </ol>
          </div>

          <div className="p-5 rounded-xl bg-[#fdf2f5] border border-[#f0e3e8]">
            <h3 className="text-base font-bold text-[#2a1a22] mb-3">🧘‍♀️ 20-Minute Standard</h3>
            <ol className="space-y-1 text-xs text-[#4a3f44]">
              <li>1. Walking Warm-Up (2 min)</li>
              <li>2. Arm Circles + Leg Swings (2 min)</li>
              <li>3. Bodyweight Squats (2 min)</li>
              <li>4. Bridge Lift (2 min)</li>
              <li>5. Bird-Dog (2 min)</li>
              <li>6. Wall Push-Ups (2 min)</li>
              <li>7. Single-Leg Stand (2 min)</li>
              <li>8. Pelvic Floor Activation (2 min)</li>
              <li>9. Neck Release (1 min)</li>
              <li>10. Child&apos;s Pose (2 min)</li>
            </ol>
          </div>

          <div className="p-5 rounded-xl bg-[#fdf2f5] border border-[#f0e3e8]">
            <h3 className="text-base font-bold text-[#2a1a22] mb-3">💪 30-Minute Complete</h3>
            <ol className="space-y-1 text-xs text-[#4a3f44]">
              <li>1. Dynamic Warm-Up (3 min)</li>
              <li>2. Squat to Stand (2 min)</li>
              <li>3. Split Squats (3 min)</li>
              <li>4. Bridge + Single-Leg Bridge (3 min)</li>
              <li>5. Incline Push-Ups (2 min)</li>
              <li>6. Dead Bug Hold (2 min)</li>
              <li>7. Bird-Dog (2 min)</li>
              <li>8. Heel-to-Toe Walk (2 min)</li>
              <li>9. Pelvic Floor + Hypopressive (3 min)</li>
              <li>10. Breathing + Cool-Down (5 min)</li>
            </ol>
          </div>
        </div>
      </section>

      {/* CHAPTER 10 — ACTION PLAN */}
      <section className="soft-card p-8 mb-8 page-break">
        <h2 className="text-3xl text-[#2a1a22] mb-6">10. Your 30-Day Action Plan</h2>
        <div className="space-y-3">
          {[
            { week: "Week 1 (Foundation)", tasks: "Do 10-min routine daily. Start supplements. Follow meal plan. Daily check-in." },
            { week: "Week 2 (Build)", tasks: "Increase to 20-min routine. Add pelvic floor exercises. Track sleep quality." },
            { week: "Week 3 (Strengthen)", tasks: "Try 30-min routine 3x/week. Add balance exercises. Journal your progress." },
            { week: "Week 4 (Integrate)", tasks: "Full routine daily. Review progress. Celebrate wins. Plan next month." },
          ].map((w) => (
            <div key={w.week} className="p-4 rounded-xl bg-white/60 border border-[#f0e3e8]">
              <h3 className="text-sm font-bold text-[#2a1a22] mb-1">{w.week}</h3>
              <p className="text-xs text-[#5a4550]">{w.tasks}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="soft-card p-8 text-center no-print">
        <h2 className="text-2xl text-[#2a1a22] mb-3">Want the Full Personalized Program?</h2>
        <p className="text-sm text-[#5a4550] mb-6">
          This guide is just the beginning. Get daily personalized sessions, rotating meal plans, progress tracking and more.
        </p>
        <Link href="/quiz" className="btn-primary px-8 py-3 text-base inline-block">
          Take Free Assessment →
        </Link>
      </section>
    </main>
  );
}

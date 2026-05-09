"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PrintButton from "@/components/PrintButton";

type QuizData = {
  symptoms?: string[];
  age?: string;
  goal?: string;
};

type Supplement = {
  name: string;
  icon: string;
  dose: string;
  timing: string;
  why: string;
  food_sources: string[];
  priority: "essential" | "recommended" | "optional";
  symptoms: string[];
};

const ALL_SUPPLEMENTS: Supplement[] = [
  {
    name: "Vitamin D3",
    icon: "☀️",
    dose: "2,000–4,000 IU daily",
    timing: "With breakfast (fat-containing meal)",
    why: "Bone density drops 2-3% per year during menopause. D3 is critical for calcium absorption and immune function.",
    food_sources: ["Fatty fish (salmon, sardines)", "Egg yolks", "Fortified milk"],
    priority: "essential",
    symptoms: [],
  },
  {
    name: "Magnesium Glycinate",
    icon: "🌙",
    dose: "300–400mg daily",
    timing: "Before bed (promotes sleep)",
    why: "Supports 300+ enzyme reactions. Reduces muscle cramps, improves sleep quality and calms the nervous system.",
    food_sources: ["Dark chocolate", "Almonds", "Spinach", "Pumpkin seeds"],
    priority: "essential",
    symptoms: ["Poor sleep", "Joint pain", "Mood swings"],
  },
  {
    name: "Omega-3 (EPA/DHA)",
    icon: "🐟",
    dose: "1,000–2,000mg daily",
    timing: "With any meal",
    why: "Reduces joint inflammation, supports brain function, heart health and may reduce hot flash frequency.",
    food_sources: ["Salmon", "Sardines", "Walnuts", "Flaxseeds"],
    priority: "essential",
    symptoms: ["Joint pain", "Hot flashes", "Mood swings"],
  },
  {
    name: "Calcium",
    icon: "🦴",
    dose: "500–600mg daily",
    timing: "Split into 2 doses with meals (better absorption)",
    why: "Prevents bone loss during menopause. Don't exceed 600mg at once — smaller doses absorb better.",
    food_sources: ["Greek yogurt", "Sardines with bones", "Broccoli", "Fortified plant milk"],
    priority: "essential",
    symptoms: ["Joint pain", "Back pain"],
  },
  {
    name: "Vitamin B Complex",
    icon: "⚡",
    dose: "1 capsule daily",
    timing: "With breakfast (can cause energy boost)",
    why: "B6 supports mood regulation, B12 prevents fatigue, folate supports cell repair. Energy and nervous system support.",
    food_sources: ["Eggs", "Chicken", "Lentils", "Bananas"],
    priority: "recommended",
    symptoms: ["Low energy", "Mood swings", "Low confidence"],
  },
  {
    name: "Ashwagandha",
    icon: "🌿",
    dose: "300–600mg daily",
    timing: "Morning or evening (consistent timing matters)",
    why: "Adaptogen that reduces cortisol by up to 30%. Improves sleep, reduces anxiety and helps balance stress hormones.",
    food_sources: [],
    priority: "recommended",
    symptoms: ["Poor sleep", "Mood swings", "Hot flashes", "Low confidence"],
  },
  {
    name: "Vitamin K2 (MK-7)",
    icon: "🥬",
    dose: "100–200mcg daily",
    timing: "With Vitamin D3 (they work together)",
    why: "Directs calcium to bones instead of arteries. Essential partner for Vitamin D3 and calcium.",
    food_sources: ["Natto", "Hard cheese", "Egg yolks", "Sauerkraut"],
    priority: "recommended",
    symptoms: [],
  },
  {
    name: "Collagen Peptides",
    icon: "✨",
    dose: "10–15g daily",
    timing: "In morning coffee, smoothie or water",
    why: "Skin elasticity drops 30% in first 5 years of menopause. Collagen supports skin, hair, nails and joint cartilage.",
    food_sources: ["Bone broth", "Chicken skin", "Fish skin"],
    priority: "optional",
    symptoms: ["Joint pain", "Low confidence"],
  },
  {
    name: "Probiotics",
    icon: "🦠",
    dose: "10–30 billion CFU daily",
    timing: "On empty stomach (morning or before bed)",
    why: "Gut health directly affects hormone metabolism, mood and immune function. Look for Lactobacillus and Bifidobacterium strains.",
    food_sources: ["Greek yogurt", "Kefir", "Sauerkraut", "Kimchi"],
    priority: "recommended",
    symptoms: ["Bloating", "Mood swings", "Weight gain"],
  },
  {
    name: "Evening Primrose Oil",
    icon: "🌸",
    dose: "500–1,000mg daily",
    timing: "With dinner",
    why: "Contains GLA (gamma-linolenic acid) which may reduce hot flash intensity and support skin hydration.",
    food_sources: [],
    priority: "optional",
    symptoms: ["Hot flashes"],
  },
  {
    name: "Iron (if deficient)",
    icon: "🩸",
    dose: "18mg daily (only if blood test confirms deficiency)",
    timing: "On empty stomach with Vitamin C for absorption",
    why: "Fatigue during menopause can be iron deficiency. Don't supplement without testing — excess iron is harmful.",
    food_sources: ["Red meat", "Lentils", "Spinach", "Canned sardines"],
    priority: "optional",
    symptoms: ["Low energy"],
  },
  {
    name: "Zinc",
    icon: "🛡️",
    dose: "15–25mg daily",
    timing: "With food (can cause nausea on empty stomach)",
    why: "Supports immune function, wound healing and thyroid health. Levels often drop during menopause.",
    food_sources: ["Pumpkin seeds", "Beef", "Chickpeas", "Cashews"],
    priority: "recommended",
    symptoms: ["Low energy", "Low confidence", "Incontinence", "Pelvic prolapse"],
  },
  {
    name: "Vitamin C",
    icon: "🍊",
    dose: "500–1,000mg daily",
    timing: "With breakfast (split dose if >500mg)",
    why: "Essential cofactor for collagen synthesis. Supports connective tissue integrity including pelvic floor fascia, ligaments and vaginal wall tissue.",
    food_sources: ["Kiwi", "Bell peppers", "Oranges", "Broccoli", "Strawberries"],
    priority: "recommended",
    symptoms: ["Pelvic prolapse", "Incontinence", "Joint pain"],
  },
  {
    name: "Hyaluronic Acid",
    icon: "💧",
    dose: "120–240mg daily",
    timing: "With water, any time of day",
    why: "Supports tissue hydration and elasticity. Research shows improvement in vaginal dryness and mucosal tissue health within 8 weeks.",
    food_sources: ["Bone broth", "Soy products", "Root vegetables"],
    priority: "optional",
    symptoms: ["Pelvic prolapse", "Incontinence"],
  },
];

const PRIORITY_LABELS = {
  essential: { label: "Essential", cls: "bg-rose-50 text-rose-600 border-rose-100" },
  recommended: { label: "Recommended", cls: "bg-amber-50 text-amber-600 border-amber-100" },
  optional: { label: "Optional", cls: "bg-blue-50 text-blue-600 border-blue-100" },
};

export default function SupplementsPage() {
  const [data, setData] = useState<QuizData>({});

  useEffect(() => {
    const raw = localStorage.getItem("quizData");
    if (raw) {
      try { setData(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  const personalizedSupplements = useMemo(() => {
    const symptoms = data.symptoms || [];
    const age = Number(data.age) || 48;

    return ALL_SUPPLEMENTS.map((supp) => {
      let relevance = 0;

      // Essential always high
      if (supp.priority === "essential") relevance += 10;
      if (supp.priority === "recommended") relevance += 5;

      // Symptom matching
      for (const s of supp.symptoms) {
        if (symptoms.includes(s)) relevance += 3;
      }

      // Age adjustments
      if (age >= 55 && supp.name === "Calcium") relevance += 2;
      if (age >= 50 && supp.name === "Vitamin D3") relevance += 2;

      return { ...supp, relevance };
    }).sort((a, b) => b.relevance - a.relevance);
  }, [data]);

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <section className="soft-card p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
          <div>
            <p className="uppercase tracking-[0.25em] text-xs text-[#b98fa1] mb-2 font-bold">
              {data.symptoms && data.symptoms.length > 0 ? "Personalized For You" : "Supplement Guide"}
            </p>
            <h1 className="text-4xl text-[#4a3f44]">Vitamins & Minerals</h1>
          </div>
          <PrintButton targetId="printable-supplements" label="Print Guide" />
        </div>

        {data.symptoms && data.symptoms.length > 0 ? (
          <p className="text-sm text-[#7b6870]">
            Based on your assessment, here are the supplements recommended for your specific needs.
            <span className="block mt-1 text-[#d8a7b5] font-medium">Your symptoms: {data.symptoms.join(", ")}.</span>
          </p>
        ) : (
          <div className="mt-3 p-4 rounded-2xl bg-[#fff4f7] border border-[#f0e3e8]">
            <p className="text-sm text-[#6f5a62] mb-2">
              📋 Take the assessment to get personalized supplement recommendations based on your symptoms, age and goals.
            </p>
            <Link href="/quiz" className="btn-primary text-xs px-4 py-2">
              Take Assessment
            </Link>
          </div>
        )}
      </section>

      <div id="printable-supplements">
        {/* ESSENTIAL */}
        {["essential", "recommended", "optional"].map((priority) => {
          const supps = personalizedSupplements.filter((s) => s.priority === priority);
          if (supps.length === 0) return null;
          const config = PRIORITY_LABELS[priority as keyof typeof PRIORITY_LABELS];

          return (
            <section key={priority} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest border ${config.cls}`}>
                  {config.label}
                </span>
              </div>

              <div className="space-y-3">
                {supps.map((supp) => {
                  const isRelevant = (data.symptoms || []).some((s) => supp.symptoms.includes(s));

                  return (
                    <div
                      key={supp.name}
                      className={`soft-card p-5 ${isRelevant ? "border-[#d8a7b5]/40" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl shrink-0">{supp.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-base font-medium text-[#4a3f44]">{supp.name}</h3>
                            {isRelevant && (
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#fdf2f5] text-[#d8a7b5] font-bold">
                                Matches your symptoms
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-3 text-xs mb-2">
                            <span className="text-[#d8a7b5] font-bold">{supp.dose}</span>
                            <span className="text-[#7b6870]">⏰ {supp.timing}</span>
                          </div>

                          <p className="text-xs text-[#6f5a62] leading-relaxed mb-2">{supp.why}</p>

                          {supp.food_sources.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              <span className="text-[9px] text-[#b98fa1] font-bold mr-1">Food sources:</span>
                              {supp.food_sources.map((f) => (
                                <span key={f} className="text-[9px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100">
                                  {f}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        <section className="soft-card p-5 text-center">
          <p className="text-xs text-[#b98fa1] italic">
            ⚕️ Always consult your doctor before starting any supplement, especially if you take medication.
            Doses are general guidelines based on current research for women 40+.
          </p>
        </section>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mt-6">
        <Link href="/dashboard" className="btn-primary">Dashboard</Link>
        <Link href="/nutrition" className="btn-outline">Meal Plans</Link>
        <Link href="/shopping" className="btn-outline">Shopping List</Link>
      </div>
    </main>
  );
}

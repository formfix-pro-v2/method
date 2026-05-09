"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getTodayProgram, isRestDay } from "@/lib/programs";
import { calculateNutrition, getDayMealPlan } from "@/lib/nutrition";
import UpsellBanner from "@/components/UpsellBanner";
import PrintButton from "@/components/PrintButton";
import StreakFreeze from "@/components/StreakFreeze";
import MilestoneCelebration from "@/components/MilestoneCelebration";
import OnboardingTutorial from "@/components/OnboardingTutorial";
import FavoriteButton from "@/components/FavoriteButton";
import SwapMealButton from "@/components/SwapMealButton";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { playComplete } from "@/lib/sounds";
import SectionErrorBoundary from "@/components/SectionErrorBoundary";

type QuizData = {
  name?: string;
  symptoms?: string[];
  severity?: Record<string, number>;
  age?: string;
  height?: string;
  weight?: string;
  activity?: string;
  goal?: string;
  time?: string;
  sleep?: number;
};

const PHASE_COLORS = {
  foundation: "bg-blue-50 text-blue-600 border-blue-100",
  build: "bg-amber-50 text-amber-600 border-amber-100",
  strengthen: "bg-rose-50 text-rose-600 border-rose-100",
  master: "bg-purple-50 text-purple-600 border-purple-100",
};

const CATEGORY_LABELS: Record<string, string> = {
  warmup: "Warm-Up",
  cooldown: "Cool-Down",
  core: "Core",
  lower: "Lower Body",
  upper: "Upper Body",
  mobility: "Mobility",
  balance: "Balance",
  breathing: "Breathing",
  pelvic: "Pelvic Floor",
  posture: "Posture",
};

type DailySupp = {
  name: string;
  icon: string;
  dose: string;
  timing: string;
  priority: "essential" | "recommended";
  symptoms: string[];
};

const DAILY_SUPPLEMENTS: DailySupp[] = [
  { name: "Vitamin D3", icon: "☀️", dose: "2,000–4,000 IU", timing: "With breakfast", priority: "essential", symptoms: [] },
  { name: "Magnesium Glycinate", icon: "🌙", dose: "300–400mg", timing: "Before bed", priority: "essential", symptoms: ["Poor sleep", "Joint pain", "Mood swings", "Incontinence"] },
  { name: "Omega-3 (EPA/DHA)", icon: "🐟", dose: "1,000–2,000mg", timing: "With meal", priority: "essential", symptoms: ["Joint pain", "Hot flashes", "Mood swings"] },
  { name: "Calcium", icon: "🦴", dose: "500–600mg", timing: "2× with meals", priority: "essential", symptoms: ["Joint pain", "Back pain"] },
  { name: "Vitamin B Complex", icon: "⚡", dose: "1 capsule", timing: "With breakfast", priority: "recommended", symptoms: ["Low energy", "Mood swings", "Low confidence"] },
  { name: "Ashwagandha", icon: "🌿", dose: "300–600mg", timing: "Morning or evening", priority: "recommended", symptoms: ["Poor sleep", "Mood swings", "Hot flashes", "Low confidence"] },
  { name: "Vitamin K2 (MK-7)", icon: "🥬", dose: "100–200mcg", timing: "With Vitamin D3", priority: "recommended", symptoms: [] },
  { name: "Probiotics", icon: "🦠", dose: "10–30B CFU", timing: "Empty stomach", priority: "recommended", symptoms: ["Bloating", "Mood swings", "Weight gain"] },
  { name: "Vitamin C", icon: "🍊", dose: "500–1,000mg", timing: "With breakfast", priority: "recommended", symptoms: ["Pelvic prolapse", "Incontinence", "Joint pain"] },
  { name: "Collagen Peptides", icon: "✨", dose: "10–15g", timing: "Morning, in water or smoothie", priority: "recommended", symptoms: ["Pelvic prolapse", "Incontinence", "Joint pain"] },
  { name: "Zinc", icon: "🔩", dose: "15–30mg", timing: "With dinner", priority: "recommended", symptoms: ["Pelvic prolapse", "Low energy", "Incontinence"] },
];

// Evidence-based herbal teas matched to symptoms
type DailyTea = {
  name: string;
  icon: string;
  dose: string;
  timing: string;
  priority: "essential" | "recommended";
  symptoms: string[];
  evidence: string;
};

const DAILY_TEAS: DailyTea[] = [
  { name: "Sage Tea", icon: "🌿", dose: "1–2 cups", timing: "Morning & afternoon", priority: "essential", symptoms: ["Hot flashes"], evidence: "RCT: reduced hot flash intensity after 1 week (Salvia officinalis)" },
  { name: "Chamomile Tea", icon: "🌼", dose: "1–2 cups", timing: "Evening, 30 min before bed", priority: "essential", symptoms: ["Poor sleep", "Mood swings"], evidence: "RCT: improved sleep quality and reduced anxiety in menopausal women" },
  { name: "Green Tea", icon: "🍵", dose: "2–3 cups", timing: "Morning & early afternoon", priority: "essential", symptoms: ["Weight gain", "Low energy"], evidence: "Meta-analysis: -1.2kg weight loss vs placebo over 12 weeks in postmenopausal women" },
  { name: "Valerian Root Tea", icon: "🌱", dose: "1 cup", timing: "30–60 min before bed", priority: "recommended", symptoms: ["Poor sleep"], evidence: "Systematic review: improves sleep quality without morning drowsiness" },
  { name: "Red Clover Tea", icon: "🌺", dose: "1–2 cups", timing: "Any time", priority: "recommended", symptoms: ["Hot flashes", "Mood swings"], evidence: "Contains isoflavones (phytoestrogens). Meta-analysis: reduces hot flash frequency" },
  { name: "Nettle Tea", icon: "🌿", dose: "1–2 cups", timing: "With meals", priority: "recommended", symptoms: ["Low energy", "Joint pain"], evidence: "Rich in iron, calcium, magnesium. Supports bone density and reduces fatigue" },
  { name: "Peppermint Tea", icon: "🍃", dose: "1–2 cups", timing: "After meals", priority: "recommended", symptoms: ["Bloating", "Hot flashes"], evidence: "Reduces bloating and digestive discomfort. Cooling effect helps hot flashes" },
  { name: "Ginger Tea", icon: "🫚", dose: "1–2 cups", timing: "Morning or with meals", priority: "recommended", symptoms: ["Joint pain", "Bloating"], evidence: "Anti-inflammatory. RCT: reduces joint pain and stiffness comparable to ibuprofen" },
  { name: "Hibiscus Tea", icon: "🌺", dose: "1–2 cups", timing: "Any time (cold or hot)", priority: "recommended", symptoms: ["Weight gain", "Hot flashes"], evidence: "Lowers blood pressure, rich in antioxidants. Cooling effect. Supports metabolism" },
  { name: "Lemon Balm Tea", icon: "🍋", dose: "1–2 cups", timing: "Afternoon or evening", priority: "recommended", symptoms: ["Mood swings", "Poor sleep", "Low confidence"], evidence: "Reduces anxiety and improves mood. Mild sedative effect without drowsiness" },
];

function WeeklyMiniProgress({ currentDay }: { currentDay: number }) {
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date().getDay(); // 0=Sun, 1=Mon...
  const todayIdx = today === 0 ? 6 : today - 1; // Convert to Mon=0

  const [completed, setCompleted] = useState<boolean[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("weeklyCompleted");
    if (raw) {
      try { setCompleted(JSON.parse(raw)); } catch { setCompleted(Array(7).fill(false)); }
    } else {
      setCompleted(Array(7).fill(false));
    }
  }, []);

  const completedCount = completed.filter(Boolean).length;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-[#7b6870]">
          <span className="font-bold text-[#4a3f44]">{completedCount}</span>/7 sessions this week
        </span>
        {completedCount >= 5 && <span className="text-sm">🔥</span>}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((d, i) => {
          const isDone = completed[i];
          const isToday = i === todayIdx;
          const isPast = i < todayIdx;

          return (
            <div key={d} className="text-center">
              <div
                className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  isDone
                    ? "bg-gradient-to-br from-[#d8a7b5] to-[#c58d9d] text-white shadow-md"
                    : isToday
                    ? "border-2 border-[#d8a7b5] text-[#d8a7b5] bg-[#fdf2f5]"
                    : isPast
                    ? "bg-[#f0e3e8] text-[#b98fa1]"
                    : "bg-white/40 border border-[#f0e3e8] text-[#7b6870]"
                }`}
              >
                {isDone ? "✓" : d[0]}
              </div>
              <span className={`text-[9px] mt-1 block ${isToday ? "font-bold text-[#d8a7b5]" : "text-[#b98fa1]"}`}>
                {d}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WaterTracker({ target }: { target: number }) {
  const [glasses, setGlasses] = useState(0);
  const totalGlasses = Math.ceil(target * 4); // 250ml per glass

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const saved = localStorage.getItem(`water_${today}`);
    if (saved) setGlasses(Number(saved));
  }, []);

  function addGlass() {
    const next = Math.min(glasses + 1, totalGlasses);
    setGlasses(next);
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem(`water_${today}`, String(next));
    if (next === totalGlasses) playComplete();
  }

  function removeGlass() {
    const next = Math.max(glasses - 1, 0);
    setGlasses(next);
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem(`water_${today}`, String(next));
  }

  const percentage = totalGlasses > 0 ? (glasses / totalGlasses) * 100 : 0;

  return (
    <section className="soft-card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="uppercase tracking-[0.25em] text-[10px] text-[#d8a7b5] mb-1 font-bold">
            Hydration
          </p>
          <h2 className="text-2xl text-[#4a3f44] font-light italic">Water Intake</h2>
        </div>
        <div className="text-right">
          <p className="text-2xl font-light text-[#4a3f44]">
            {glasses}<span className="text-sm text-[#7b6870]">/{totalGlasses}</span>
          </p>
          <p className="text-[9px] text-[#b98fa1]">glasses (250ml each)</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-[#fdf2f5] rounded-full overflow-hidden mb-4">
        <div
          className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-300 to-blue-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Glass buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {Array.from({ length: totalGlasses }).map((_, i) => (
          <button
            key={i}
            onClick={() => i < glasses ? removeGlass() : addGlass()}
            className={`w-8 h-8 rounded-full text-sm transition-all ${
              i < glasses
                ? "bg-blue-100 text-blue-600 border border-blue-200"
                : "bg-white/60 text-[#b98fa1] border border-[#f0e3e8] hover:border-blue-200"
            }`}
            aria-label={i < glasses ? `Remove glass ${i + 1}` : `Add glass ${i + 1}`}
          >
            {i < glasses ? "💧" : "○"}
          </button>
        ))}
      </div>

      {/* Quick add */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={addGlass}
          disabled={glasses >= totalGlasses}
          className="btn-outline text-xs px-4 py-2 disabled:opacity-40"
        >
          + Add Glass
        </button>
        {glasses >= totalGlasses && (
          <span className="text-xs text-green-600 font-medium">✓ Daily goal reached!</span>
        )}
        {glasses > 0 && glasses < totalGlasses && (
          <span className="text-xs text-[#7b6870]">
            {totalGlasses - glasses} more to go — {((totalGlasses - glasses) * 250 / 1000).toFixed(1)}L remaining
          </span>
        )}
      </div>

      <p className="text-[9px] text-[#b98fa1] mt-3 italic">
        💡 Proper hydration reduces hot flashes, supports joint lubrication, and improves skin elasticity.
      </p>
    </section>
  );
}

function SmartInsights({ day, plan, symptoms }: { day: number; plan: string; symptoms: string[] }) {
  const [insight, setInsight] = useState("");

  useEffect(() => {
    // Generiši personalizovani savet na osnovu podataka
    const insights: string[] = [];

    // Check-in based
    try {
      const history = JSON.parse(localStorage.getItem("checkinHistory") || "[]");
      const recent = history.slice(-3);
      if (recent.length > 0) {
        const avgSleep = recent.reduce((s: number, e: { sleep: number }) => s + (e.sleep || 0), 0) / recent.length;
        const avgEnergy = recent.reduce((s: number, e: { energy: number }) => s + (e.energy || 0), 0) / recent.length;

        if (avgSleep < 5) insights.push("💡 Your sleep has been low — try the 4-7-8 breathing technique tonight and chamomile tea 30 min before bed.");
        if (avgEnergy < 5) insights.push("💡 Energy dipping? Green tea in the morning and a 10-min walk can boost it by 20%.");
        if (avgSleep >= 7) insights.push("✨ Your sleep is improving! Keep up the evening routine — it's working.");
        if (avgEnergy >= 7) insights.push("✨ Great energy levels! Your body is responding well to the program.");
      }
    } catch {}

    // Symptom based
    if (symptoms.includes("Hot flashes")) insights.push("🌡️ For hot flashes: sage tea + cooling breath technique. Most women see improvement by week 2.");
    if (symptoms.includes("Pelvic prolapse")) insights.push("🩺 Pelvic support tip: do your Kegels before getting out of bed, and try legs-up-the-wall for 3 min daily.");
    if (symptoms.includes("Weight gain")) insights.push("⚖️ Metabolism tip: strength exercises before breakfast can boost fat burning for 24 hours.");

    // Day-based milestones
    if (day === 7) insights.push("🎉 One week complete! Your body is already adapting. Foundation phase is building your base.");
    if (day === 14) insights.push("🎉 Two weeks! Most women report better sleep and less stiffness by now.");
    if (day === 21) insights.push("🎉 Three weeks — habits are forming! You're in the Strengthen phase now.");
    if (day === 30) insights.push("👑 30 days! You've completed a full transformation cycle. Incredible dedication.");

    // Plan countdown
    if (plan === "glow" && day > 23) insights.push(`⏰ ${30 - day} days left in your Glow plan. Make every session count!`);
    if (plan === "elite" && day > 80) insights.push(`⏰ ${90 - day} days left in your Elite plan. You're in the final stretch!`);

    // Pick one random insight for today
    if (insights.length > 0) {
      const todaySeed = new Date().getDate() + day;
      setInsight(insights[todaySeed % insights.length]);
    }
  }, [day, plan, symptoms]);

  if (!insight) return null;

  return (
    <div className="soft-card p-4 mt-3 border-l-4 border-l-amber-300 bg-amber-50/30">
      <p className="text-xs text-[#4a3f44]">{insight}</p>
    </div>
  );
}

function DailyTeaTracker({ symptoms }: { symptoms: string[] }) {
  const relevant = useMemo(() => {
    return DAILY_TEAS
      .map((tea) => {
        let score = tea.priority === "essential" ? 10 : 5;
        for (const sym of tea.symptoms) {
          if (symptoms.includes(sym)) score += 4;
        }
        return { ...tea, score, matches: tea.symptoms.some((s) => symptoms.includes(s)) };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Show top 5 most relevant
  }, [symptoms]);

  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const saved = localStorage.getItem(`teas_${today}`);
    if (saved) {
      try { setChecked(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  function toggle(name: string) {
    const today = new Date().toISOString().slice(0, 10);
    const next = { ...checked, [name]: !checked[name] };
    if (!checked[name]) playComplete();
    setChecked(next);
    localStorage.setItem(`teas_${today}`, JSON.stringify(next));
  }

  const takenCount = Object.values(checked).filter(Boolean).length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-sm text-[#7b6870]">
          <span className="font-bold text-[#4a3f44]">{takenCount}</span> / {relevant.length} today
        </div>
        <div className="flex-1 h-2 bg-[#fdf2f5] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-300 to-green-500 rounded-full transition-all duration-300"
            style={{ width: `${relevant.length > 0 ? (takenCount / relevant.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {relevant.map((tea) => (
          <button
            key={tea.name}
            onClick={() => toggle(tea.name)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
              checked[tea.name]
                ? "bg-green-50 border-green-200 opacity-70"
                : tea.matches
                ? "bg-white/60 border-[#d8a7b5]/30 hover:border-[#d8a7b5]"
                : "bg-white/40 border-[#f0e3e8] hover:border-[#d8a7b5]/50"
            }`}
          >
            <span className="text-xl shrink-0">{checked[tea.name] ? "✅" : tea.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#4a3f44]">{tea.name}</span>
                {tea.matches && !checked[tea.name] && (
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-[#fdf2f5] text-[#d8a7b5] font-bold shrink-0">
                    FOR YOU
                  </span>
                )}
              </div>
              <div className="text-[10px] text-[#7b6870]">
                {tea.dose} • {tea.timing}
              </div>
              <div className="text-[9px] text-[#b98fa1] italic mt-0.5">{tea.evidence}</div>
            </div>
          </button>
        ))}
      </div>

      <p className="text-[9px] text-[#b98fa1] mt-3 italic">
        ☕ Herbal teas complement your supplement routine. Avoid caffeine teas after 2pm if you have sleep issues.
      </p>
    </div>
  );
}

function DailySupplements({ symptoms, age }: { symptoms: string[]; age: number }) {
  const relevant = useMemo(() => {
    return DAILY_SUPPLEMENTS
      .map((s) => {
        let score = s.priority === "essential" ? 10 : 5;
        for (const sym of s.symptoms) {
          if (symptoms.includes(sym)) score += 3;
        }
        if (age >= 55 && s.name === "Calcium") score += 2;
        if (age >= 50 && s.name === "Vitamin D3") score += 2;
        return { ...s, score, matches: s.symptoms.some((sym) => symptoms.includes(sym)) };
      })
      .sort((a, b) => b.score - a.score);
  }, [symptoms, age]);

  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const saved = localStorage.getItem(`supps_${today}`);
    if (saved) {
      try { setChecked(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  function toggle(name: string) {
    const today = new Date().toISOString().slice(0, 10);
    const next = { ...checked, [name]: !checked[name] };
    if (!checked[name]) playComplete();
    setChecked(next);
    localStorage.setItem(`supps_${today}`, JSON.stringify(next));
  }

  const takenCount = Object.values(checked).filter(Boolean).length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-sm text-[#7b6870]">
          <span className="font-bold text-[#4a3f44]">{takenCount}</span> / {relevant.length} taken today
        </div>
        <div className="flex-1 h-2 bg-[#fdf2f5] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#d8a7b5] to-[#b98fa1] rounded-full transition-all duration-300"
            style={{ width: `${(takenCount / relevant.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-2">
        {relevant.map((supp) => (
          <button
            key={supp.name}
            onClick={() => toggle(supp.name)}
            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
              checked[supp.name]
                ? "bg-[#f0fdf4] border-green-200 opacity-70"
                : supp.matches
                ? "bg-white/60 border-[#d8a7b5]/30 hover:border-[#d8a7b5]"
                : "bg-white/40 border-[#f0e3e8] hover:border-[#d8a7b5]/50"
            }`}
          >
            <span className="text-xl shrink-0">{checked[supp.name] ? "✅" : supp.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#4a3f44] truncate">{supp.name}</span>
                {supp.matches && !checked[supp.name] && (
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-[#fdf2f5] text-[#d8a7b5] font-bold shrink-0">
                    FOR YOU
                  </span>
                )}
              </div>
              <div className="text-[10px] text-[#7b6870]">
                {supp.dose} • {supp.timing}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const [day, setDay] = useState(1);
  const [viewDay, setViewDay] = useState(1);
  const [plan, setPlan] = useState("free");
  const [isPremium, setIsPremium] = useState(false);
  const [data, setData] = useState<QuizData>({});

  useEffect(() => {
    const savedDay = localStorage.getItem("day");
    const savedPlan = localStorage.getItem("plan");
    const raw = localStorage.getItem("quizData");

    if (savedDay) { setDay(Number(savedDay)); setViewDay(Number(savedDay)); }
    if (savedPlan) setPlan(savedPlan);

    // Proveri premium status — plan + premium flag + expiry
    const premiumFlag = localStorage.getItem("premium") === "true";
    const expiryDate = localStorage.getItem("expiryDate");
    const isActive = premiumFlag && (!expiryDate || new Date(expiryDate) > new Date());
    const hasPaidPlan = savedPlan === "glow" || savedPlan === "elite";
    setIsPremium(isActive && hasPaidPlan);
    if (raw) {
      try {
        setData(JSON.parse(raw));
      } catch (e) {
        console.error("Error parsing quiz data", e);
      }
    }
  }, []);

  const program = useMemo(() => {
    return getTodayProgram(viewDay);
  }, [viewDay]);

  const nutrition = useMemo(() => {
    return calculateNutrition({
      age: Number(data.age) || 48,
      height: Number(data.height) || 168,
      weight: Number(data.weight) || 72,
      activity: (data.activity as "sedentary" | "light" | "moderate" | "active") || "light",
      goal: (data.goal as "fat_loss" | "maintain" | "tone" | "energy") || "tone",
      symptoms: data.symptoms || [],
    });
  }, [data]);

  const mealPlan = useMemo(() => {
    return getDayMealPlan(day, nutrition.calories, data.symptoms || [], data.goal || "tone");
  }, [nutrition, day, data.symptoms, data.goal]);

  // State za zamenjene obroke
  const [swappedMeals, setSwappedMeals] = useState<Record<string, import("@/lib/nutrition").Meal>>({});

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const dailyQuote = useMemo(() => {
    const quotes = [
      "Your body is not broken. It's adapting. And so are you.",
      "Every small step today builds the woman you'll be tomorrow.",
      "Strength isn't loud. It's showing up, day after day.",
      "You're not starting over. You're starting stronger.",
      "Rest is not giving up. It's powering up.",
      "The woman who moves her body daily changes her whole life.",
      "Progress isn't always visible. Trust the process.",
      "You deserve to feel good in your own skin.",
      "Consistency beats perfection. Always.",
      "Your future self is thanking you right now.",
      "Menopause is not an ending. It's a powerful new chapter.",
      "You are more resilient than you know.",
      "Small daily improvements lead to stunning results.",
      "Listen to your body. It knows what it needs.",
      "You showed up today. That's already a win.",
      "Breathe deeply. Move gently. Trust completely.",
      "The best time to start was yesterday. The next best time is now.",
      "Your wellness journey is uniquely yours. Own it.",
      "Strong women lift each other up. You're one of them.",
      "Today's effort is tomorrow's strength.",
      "Grace over perfection. Always.",
      "You are writing a comeback story.",
      "Healing is not linear, but you're moving forward.",
      "One day at a time. One breath at a time.",
      "The strongest thing you can do is take care of yourself.",
      "You're not too old. You're just getting started.",
      "Movement is medicine. And you're taking yours daily.",
      "Be proud of how far you've come.",
      "Your body hears everything your mind says. Speak kindly.",
      "This is your time. Make it count.",
    ];
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return quotes[dayOfYear % quotes.length];
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-6 py-6 bg-transparent">
      {/* HEADER */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#a8687a] to-[#6b3a4d] flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0">
              {data.name ? data.name.charAt(0).toUpperCase() : "V"}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-light text-[#4a3f44]">
                {greeting}{data.name ? `, ${data.name}` : ""}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-sm text-[#7b6870]">Day {day}</p>
                {day >= 3 && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 font-medium">
                    <span className="animate-pulse">🔥</span> {day} day streak
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/checkin"
              className="btn-outline px-4 py-2 text-[10px] uppercase tracking-widest"
            >
              {t("Daily Check-In")}
            </Link>
            <Link
              href="/"
              className="btn-outline px-4 py-2 text-[10px] uppercase tracking-widest hidden md:inline-flex"
            >
              {t("Home")}
            </Link>
          </div>
        </div>
        <div className="soft-card p-4 border-l-4 border-l-[#d8a7b5]">
          <p className="text-sm text-[#6f5a62] italic">&ldquo;{dailyQuote}&rdquo;</p>
        </div>

        {/* Smart Insights */}
        <SmartInsights day={day} plan={plan} symptoms={data.symptoms || []} />
      </div>

      {/* STREAK FREEZE */}
      <StreakFreeze />

      {/* UPSELL */}
      <UpsellBanner />

      {/* TODAY PROGRAM */}
      <SectionErrorBoundary section="Today's Program">
      <section className="soft-card p-8 mb-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <p className="uppercase tracking-[0.25em] text-[10px] text-[#d8a7b5] font-bold">
              Today&apos;s Focus • Day {day}
            </p>
            <span
              className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest border ${PHASE_COLORS[program.phase]}`}
            >
              {program.phase}
            </span>
          </div>

          <h2 className="text-4xl mb-2 text-[#4a3f44] tracking-tight italic">
            {program.title}
          </h2>

          <p className="text-[#7b6870] text-base italic mb-4">
            &ldquo;{program.theme}&rdquo;
          </p>

          <p className="text-[#7b6870] text-sm mb-6 max-w-2xl">
            {program.description}
          </p>

          {/* Focus areas */}
          <div className="flex flex-wrap gap-2 mb-6">
            {program.focusAreas.map((area) => (
              <span
                key={area}
                className="text-[10px] px-3 py-1 rounded-full bg-[#fdf2f5] text-[#b98fa1] font-medium uppercase tracking-widest border border-[#f0e3e8]"
              >
                {CATEGORY_LABELS[area] || area}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-2xl border border-[#f0e3e8]">
              <span className="text-lg">⏱</span>
              <span className="font-medium text-[#4a3f44] text-sm">
                ~{program.totalMinutes} min
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-2xl border border-[#f0e3e8]">
              <span className="text-lg">✨</span>
              <span className="font-medium text-[#4a3f44] text-sm">
                {program.exercises.length} Exercises
              </span>
            </div>
            {data.symptoms && data.symptoms.length > 0 && (
              <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-2xl border border-[#f0e3e8]">
                <span className="text-lg">🎯</span>
                <span className="font-medium text-[#4a3f44] text-sm">
                  Targeting: {data.symptoms.slice(0, 2).join(", ")}
                </span>
              </div>
            )}
          </div>

          <Link
            href={isRestDay(day) ? "/rest-day" : "/session"}
            className="btn-primary px-10 py-4 text-sm uppercase tracking-widest shadow-xl"
          >
            {isRestDay(day) ? t("Start Rest Day") : t("Start Full Session")}
          </Link>
        </div>
      </section>
      </SectionErrorBoundary>

      {/* NUTRITION */}
      <SectionErrorBoundary section="Nutrition">
      <section className="soft-card p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <p className="uppercase tracking-[0.25em] text-[10px] text-[#d8a7b5] mb-1 font-bold">
              {t("Personalized Nutrition")}
            </p>
            <h2 className="text-3xl text-[#4a3f44] font-light">
              Healthy Eating <span className="italic">On A Budget</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <PrintButton targetId="printable-meals" label={t("Print Meals")} />
            <div className="bg-[#fdf2f5]/80 border border-[#f8d7e1] p-4 rounded-3xl text-center shadow-sm backdrop-blur-sm">
              <p className="text-[9px] uppercase tracking-widest text-[#d8a7b5] mb-1 font-bold">
                {t("Today's Meal Cost")}
              </p>
              <p className="text-2xl font-semibold text-[#4a3f44]">
                €{mealPlan.totalPrice.toFixed(2)}
              </p>
              <p className="text-[9px] text-[#b98fa1] mt-1">{mealPlan.focus}</p>
              <p className="text-[8px] text-[#7b6870] mt-0.5">🍂 {mealPlan.seasonalNote}</p>
            </div>
          </div>
        </div>

        {/* Printable meal content (hidden wrapper for print) */}
        <div id="printable-meals">
          <h2 style={{ display: "none" }}>Day {day} Meal Plan — {mealPlan.focus}</h2>

        {/* Macros */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Calories", value: nutrition.calories, unit: "kcal" },
            { label: "Protein", value: nutrition.protein, unit: "g" },
            { label: "Fiber", value: nutrition.fiber, unit: "g" },
            { label: "Water", value: nutrition.water, unit: "L" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-2xl bg-white/40 border border-[#f0e3e8] text-center"
            >
              <div className="text-[9px] uppercase tracking-widest text-[#d8a7b5] mb-1 font-bold">
                {stat.label}
              </div>
              <div className="text-2xl font-light text-[#4a3f44]">
                {stat.value}
                <span className="text-xs ml-1 opacity-60">{stat.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Meals */}
        <div className="grid md:grid-cols-2 gap-4">
          {mealPlan.meals.map(({ slot, meal: originalMeal }, i) => {
            // Koristi swapped obrok ako postoji
            const meal = swappedMeals[slot] || originalMeal;
            // Premium korisnici vide sve obroke bez ograničenja
            const isFree = !isPremium;
            const freeDayLimit = 7;
            const isFreeExpired = isFree && day > freeDayLimit;
            const isLocked = isFree && (isFreeExpired || (day > 1 && slot !== "breakfast"));
            const slotLabels: Record<string, string> = {
              breakfast: "Breakfast",
              lunch: "Lunch",
              dinner: "Dinner",
              snack: "Snack",
            };

            return (
              <div
                key={meal.title + i}
                className={`p-6 rounded-[30px] bg-white/40 border transition-all ${
                  isLocked
                    ? "opacity-40 grayscale blur-[1px] pointer-events-none border-[#f0e3e8]"
                    : "border-[#f0e3e8] hover:shadow-md"
                }`}
              >
                <div className="flex justify-between gap-3 mb-3">
                  <span className="text-[9px] px-3 py-1 rounded-full bg-[#fdf2f5] text-[#d8a7b5] font-bold uppercase tracking-widest">
                    {slotLabels[slot]}
                  </span>
                  <div className="flex items-center gap-2">
                    <SwapMealButton
                      slot={slot}
                      day={day}
                      calories={nutrition.calories}
                      symptoms={data.symptoms || []}
                      goal={data.goal || "tone"}
                      onSwap={(newMeal) => setSwappedMeals((prev) => ({ ...prev, [slot]: newMeal }))}
                    />
                    <FavoriteButton type="meal" name={meal.title} />
                    <span className="text-sm font-semibold text-[#4a3f44]">
                      €{meal.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl text-[#4a3f44] mb-1 font-medium">
                  {meal.title}
                </h3>
                <p className="text-[#7b6870] mb-4 text-xs italic">
                  {meal.subtitle}
                </p>

                <div className="flex gap-3 text-[10px] text-[#d8a7b5] font-bold uppercase tracking-tight mb-4">
                  <span>⏱ {meal.prep}</span>
                  <span>🔥 {meal.kcal} kcal</span>
                  <span>💪 {meal.protein}g protein</span>
                </div>

                {/* Ingredients with amounts */}
                <div className="mb-4">
                  <h4 className="text-[10px] font-bold uppercase text-[#4a3f44] mb-2 tracking-widest opacity-70">
                    Ingredients
                  </h4>
                  <ul className="grid grid-cols-1 gap-1 text-[#6f5a62] text-xs">
                    {meal.ingredients.map((item, idx) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#d8a7b5]" />
                        <span className="font-medium">{meal.amounts?.[idx]}</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Preparation steps */}
                {!isLocked && (
                  <div>
                    <h4 className="text-[10px] font-bold uppercase text-[#4a3f44] mb-2 tracking-widest opacity-70">
                      How to Make
                    </h4>
                    <ol className="space-y-1 text-[#6f5a62] text-xs">
                      {meal.steps.map((step, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-[#d8a7b5] font-bold shrink-0">{idx + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Benefits */}
                {!isLocked && meal.benefits.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {meal.benefits.map((b) => (
                      <span
                        key={b}
                        className="text-[9px] px-2 py-0.5 rounded-full bg-[#fdf2f5] text-[#b98fa1] border border-[#f0e3e8]"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!isPremium && (
          <div className="mt-8 text-center p-8 rounded-[34px] bg-[#fdf2f5]/60 border border-dashed border-[#d8a7b5]/40 backdrop-blur-sm">
            {day <= 7 ? (
              <>
                <h3 className="text-lg text-[#4a3f44] font-semibold mb-1">
                  Free Trial: Day {day} of 7
                </h3>
                <p className="text-sm text-[#7b6870] mb-4">
                  {day === 1
                    ? "Today you get all 4 meals with full recipes. From tomorrow, only breakfast is free."
                    : `${8 - day} days left in your free trial. Upgrade to unlock all meals.`}
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg text-[#4a3f44] font-semibold mb-1">
                  Your Free Trial Has Ended
                </h3>
                <p className="text-sm text-[#7b6870] mb-4">
                  Upgrade to continue with full meal plans and exercises.
                </p>
              </>
            )}
            <Link
              href="/pricing"
              className="btn-primary px-8 py-3 text-sm inline-block"
            >
              Upgrade to Premium Plan
            </Link>
          </div>
        )}
        </div>{/* close printable-meals */}
      </section>
      </SectionErrorBoundary>

      {/* DAILY SUPPLEMENTS */}
      <SectionErrorBoundary section="Supplements">
      <section className="soft-card p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
          <div>
            <p className="uppercase tracking-[0.25em] text-[10px] text-[#d8a7b5] mb-1 font-bold">
              Daily Supplements
            </p>
            <h2 className="text-3xl text-[#4a3f44] font-light italic">
              Your Vitamins & Minerals
            </h2>
          </div>
          <Link href="/supplements" className="btn-outline text-xs px-4 py-2">
            Full Guide
          </Link>
        </div>

        <DailySupplements symptoms={data.symptoms || []} age={Number(data.age) || 48} />
      </section>
      </SectionErrorBoundary>

      {/* DAILY TEAS */}
      <SectionErrorBoundary section="Herbal Teas">
      <section className="soft-card p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
          <div>
            <p className="uppercase tracking-[0.25em] text-[10px] text-[#d8a7b5] mb-1 font-bold">
              Herbal Medicine
            </p>
            <h2 className="text-2xl text-[#4a3f44] font-light italic">
              Your Daily Teas
            </h2>
          </div>
        </div>
        <DailyTeaTracker symptoms={data.symptoms || []} />
      </section>
      </SectionErrorBoundary>

      {/* WATER TRACKER */}
      <SectionErrorBoundary section="Water Tracker">
      <WaterTracker target={nutrition.water} />
      </SectionErrorBoundary>

      {/* WEEKLY PROGRESS */}
      <SectionErrorBoundary section="Weekly Progress">
      <section className="soft-card p-8 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="uppercase tracking-[0.25em] text-[10px] text-[#d8a7b5] mb-1 font-bold">
              This Week
            </p>
            <h2 className="text-2xl text-[#4a3f44] font-light italic">Weekly Progress</h2>
          </div>
          <Link href="/progress" className="btn-outline text-xs px-4 py-2">
            Full Stats
          </Link>
        </div>
        <WeeklyMiniProgress currentDay={day} />
      </section>
      </SectionErrorBoundary>

      {/* EXERCISES LIST */}
      <SectionErrorBoundary section="Exercises">
      <section className="soft-card p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl text-[#4a3f44] italic">{t("Today's Routine")}</h2>
          <span className="text-[#d8a7b5] text-[10px] font-bold tracking-widest uppercase">
            {program.exercises.length} Movements
          </span>
        </div>

        <div className="grid gap-3">
          {program.exercises.map((item, i) => (
            <div
              key={item.name + i}
              className="p-4 rounded-xl bg-white/40 border border-[#f0e3e8] flex justify-between items-center group hover:border-[#d8a7b5] transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-[#fdf2f5] flex items-center justify-center text-[#d8a7b5] text-xs font-bold group-hover:bg-[#d8a7b5] group-hover:text-white transition-colors">
                  {i + 1}
                </span>
                <div>
                  <div className="text-base text-[#4a3f44] font-medium leading-none mb-1">
                    {item.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-[#d8a7b5] uppercase tracking-[0.2em] font-bold">
                      {item.reps}
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#fdf2f5] text-[#b98fa1] border border-[#f0e3e8]">
                      {CATEGORY_LABELS[item.category] || item.category}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FavoriteButton type="exercise" name={item.name} />
                <div className="text-[#7b6870] font-light text-xs italic opacity-60">
                  {Math.floor(item.seconds / 60)}:{String(item.seconds % 60).padStart(2, "0")}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="mt-4 flex flex-wrap gap-3 justify-center">
          <Link href="/custom-workout" className="text-xs text-[#a8687a] hover:underline font-medium">
            Build Custom Workout →
          </Link>
          <Link href="/measurements" className="text-xs text-[#a8687a] hover:underline font-medium">
            Track Measurements →
          </Link>
          <Link href="/buddy" className="text-xs text-[#a8687a] hover:underline font-medium">
            Invite a Buddy →
          </Link>
        </div>
      </section>
      </SectionErrorBoundary>

      <MilestoneCelebration />
      <OnboardingTutorial />
    </main>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { type Exercise, type ExerciseCategory } from "@/lib/programs";

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

export default function CustomWorkoutPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selected, setSelected] = useState<Exercise[]>([]);
  const [filter, setFilter] = useState<ExerciseCategory | "all">("all");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Dinamički importuj vežbe
    import("@/lib/programs").then((mod) => {
      // Pristupamo EXERCISES nizu kroz buildPlan hack — uzimamo sve vežbe iz velikog plana
      const allExercises: Exercise[] = [];
      for (let day = 1; day <= 30; day++) {
        const plan = mod.buildPlan(day);
        for (const ex of plan.exercises) {
          if (!allExercises.find((e) => e.name === ex.name)) {
            allExercises.push(ex);
          }
        }
      }
      setExercises(allExercises);
    });

    // Učitaj sačuvani custom workout
    const savedWorkout = localStorage.getItem("customWorkout");
    if (savedWorkout) {
      try { setSelected(JSON.parse(savedWorkout)); } catch {}
    }
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return exercises;
    return exercises.filter((e) => e.category === filter);
  }, [exercises, filter]);

  function toggleExercise(ex: Exercise) {
    setSelected((prev) => {
      const exists = prev.find((e) => e.name === ex.name);
      if (exists) return prev.filter((e) => e.name !== ex.name);
      return [...prev, ex];
    });
    setSaved(false);
  }

  function saveWorkout() {
    localStorage.setItem("customWorkout", JSON.stringify(selected));
    setSaved(true);
  }

  const totalMinutes = Math.round(selected.reduce((s, e) => s + e.seconds, 0) / 60);

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <section className="soft-card p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="uppercase tracking-[0.2em] text-[10px] text-[#a8687a] font-bold mb-1">Custom</p>
            <h1 className="text-3xl text-[#2a1a22]">Build Your Workout</h1>
          </div>
          <div className="text-right">
            <p className="text-2xl font-light text-[#2a1a22]">{selected.length}</p>
            <p className="text-[9px] text-[#7d5565]">exercises • ~{totalMinutes} min</p>
          </div>
        </div>
        <p className="text-xs text-[#5a4550]">
          Pick exercises you want for today. Mix and match from any category.
        </p>
      </section>

      {/* Selected exercises */}
      {selected.length > 0 && (
        <section className="soft-card p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg text-[#2a1a22]">Your Workout ({totalMinutes} min)</h2>
            <button onClick={saveWorkout} className="btn-primary px-4 py-1.5 text-xs">
              {saved ? "✓ Saved" : "Save Workout"}
            </button>
          </div>
          <div className="space-y-2">
            {selected.map((ex, i) => (
              <div key={ex.name} className="flex items-center gap-2 p-2 rounded-xl bg-[#fdf2f5] border border-[#f0e3e8]">
                <span className="w-6 h-6 rounded-full bg-[#a8687a] text-white text-[10px] flex items-center justify-center font-bold shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#2a1a22] truncate">{ex.name}</p>
                  <p className="text-[9px] text-[#7d5565]">{ex.reps} • {CATEGORY_LABELS[ex.category]}</p>
                </div>
                <button onClick={() => toggleExercise(ex)} className="text-red-400 text-xs shrink-0">✕</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-all ${filter === "all" ? "bg-[#a8687a] text-white" : "bg-white/60 text-[#5a4550] border border-[#f0e3e8]"}`}
        >
          All ({exercises.length})
        </button>
        {(Object.keys(CATEGORY_LABELS) as ExerciseCategory[]).map((cat) => {
          const count = exercises.filter((e) => e.category === cat).length;
          if (count === 0) return null;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-all ${filter === cat ? "bg-[#a8687a] text-white" : "bg-white/60 text-[#5a4550] border border-[#f0e3e8]"}`}
            >
              {CATEGORY_LABELS[cat]} ({count})
            </button>
          );
        })}
      </div>

      {/* Exercise list */}
      <section className="space-y-2 mb-6">
        {filtered.map((ex) => {
          const isSelected = selected.some((s) => s.name === ex.name);
          return (
            <button
              key={ex.name}
              onClick={() => toggleExercise(ex)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? "bg-[#fdf2f5] border-[#a8687a]"
                  : "bg-white/60 border-[#f0e3e8] hover:border-[#a8687a]/50"
              }`}
            >
              <span className="text-lg shrink-0">{isSelected ? "✓" : "+"}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#2a1a22] truncate">{ex.name}</p>
                <p className="text-[10px] text-[#7d5565]">{ex.reps} • {CATEGORY_LABELS[ex.category]} • Intensity {ex.intensity}/3</p>
              </div>
              <span className="text-xs text-[#7d5565] shrink-0">{Math.floor(ex.seconds / 60)}:{String(ex.seconds % 60).padStart(2, "0")}</span>
            </button>
          );
        })}
      </section>

      <div className="flex gap-3 justify-center">
        <Link href="/dashboard" className="btn-outline px-6 py-2">Dashboard</Link>
        <Link href="/session" className="btn-primary px-6 py-2">Start Session</Link>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { getDayMealPlan, type Meal, type MealSlot } from "@/lib/nutrition";

export default function SwapMealButton({
  slot,
  day,
  calories,
  symptoms,
  goal,
  onSwap,
}: {
  slot: MealSlot;
  day: number;
  calories: number;
  symptoms: string[];
  goal: string;
  onSwap: (newMeal: Meal) => void;
}) {
  const [swapping, setSwapping] = useState(false);
  const [swapCount, setSwapCount] = useState(0);

  function handleSwap() {
    setSwapping(true);

    // Koristi swapCount da svaki put dobije drugačiji obrok
    const altDay = day + 50 + swapCount * 13 + Math.floor(Math.random() * 10);
    const altPlan = getDayMealPlan(altDay, calories, symptoms, goal);
    const altMeal = altPlan.meals.find((m) => m.slot === slot);

    if (altMeal) {
      onSwap(altMeal.meal);
      setSwapCount((c) => c + 1);
    }

    setTimeout(() => setSwapping(false), 300);
  }

  return (
    <button
      onClick={handleSwap}
      disabled={swapping}
      className="no-print text-[10px] text-[#8f6878] hover:text-[#6b3a4d] transition-colors disabled:opacity-50 flex items-center gap-1"
      title="Get a different meal"
      aria-label={`Swap ${slot} meal`}
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      {swapping ? "..." : "Swap"}
    </button>
  );
}

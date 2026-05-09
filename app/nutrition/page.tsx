"use client";

import { useEffect, useMemo, useState } from "react";
import {
  calculateNutrition,
  getDayMealPlan,
} from "@/lib/nutrition";

export default function NutritionPage() {
  const [saved, setSaved] =
    useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const [form, setForm] =
    useState({
      age: "48",
      height: "168",
      weight: "72",
      activity: "light",
      goal: "tone",
    });

  const data = useMemo(() => {
    return calculateNutrition({
      age:
        Number(
          form.age
        ) || 48,
      height:
        Number(
          form.height
        ) || 168,
      weight:
        Number(
          form.weight
        ) || 72,
      activity:
        form.activity as any,
      goal:
        form.goal as any,
      symptoms: [],
    });
  }, [form]);

  const mealPlan =
    useMemo(() => {
      return getDayMealPlan(
        1,
        data.calories,
        [],
        form.goal
      );
    }, [data, form.goal]);

  function savePlan() {
    localStorage.setItem(
      "nutritionData",
      JSON.stringify(form)
    );
    setSaved(true);
  }

  // Proveri premium status
  useEffect(() => {
    const plan = localStorage.getItem("plan");
    const premiumFlag = localStorage.getItem("premium") === "true";
    const expiryDate = localStorage.getItem("expiryDate");
    const isActive = premiumFlag && (!expiryDate || new Date(expiryDate) > new Date());
    setIsPremium(isActive && (plan === "glow" || plan === "elite"));
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-6 py-14">
      {/* HERO */}
      <section className="soft-card p-10 mb-8">
        <p className="uppercase tracking-[0.25em] text-sm text-[#b98fa1] mb-4">
          Daily Nutrition
        </p>

        <h1 className="text-5xl mb-4">
          Personalized Meal Engine
        </h1>

        <p className="text-[#7b6870] text-lg">
          Enter your body stats and lifestyle.
          We calculate calories and generate
          your Day 1 meal plan.
        </p>
      </section>

      {/* FORM */}
      <section className="soft-card p-8 mb-8">
        <h2 className="text-4xl mb-6">
          Your Details
        </h2>

        <div className="grid md:grid-cols-2 gap-5">
          <input
            value={form.age}
            onChange={(e) =>
              setForm({
                ...form,
                age: e.target.value,
              })
            }
            placeholder="Age"
            className="input-premium"
          />

          <input
            value={form.height}
            onChange={(e) =>
              setForm({
                ...form,
                height:
                  e.target.value,
              })
            }
            placeholder="Height cm"
            className="input-premium"
          />

          <input
            value={form.weight}
            onChange={(e) =>
              setForm({
                ...form,
                weight:
                  e.target.value,
              })
            }
            placeholder="Weight kg"
            className="input-premium"
          />

          <select
            value={form.activity}
            onChange={(e) =>
              setForm({
                ...form,
                activity:
                  e.target.value,
              })
            }
            className="input-premium"
          >
            <option value="sedentary">
              Sedentary
            </option>
            <option value="light">
              Light Activity
            </option>
            <option value="moderate">
              Moderate
            </option>
            <option value="active">
              Active
            </option>
          </select>

          <select
            value={form.goal}
            onChange={(e) =>
              setForm({
                ...form,
                goal:
                  e.target.value,
              })
            }
            className="input-premium md:col-span-2"
          >
            <option value="fat_loss">
              Fat Loss
            </option>
            <option value="tone">
              Tone Body
            </option>
            <option value="maintain">
              Maintain
            </option>
            <option value="energy">
              More Energy
            </option>
          </select>
        </div>

        <button
          onClick={savePlan}
          className="btn-primary mt-6"
        >
          Build My Plan
        </button>

        {saved && (
          <p className="mt-4 text-[#7b6870]">
            Plan saved successfully.
          </p>
        )}
      </section>

      {/* MACROS */}
      <section className="grid md:grid-cols-4 gap-5 mb-8">
        {[
          [
            "Calories",
            data.calories,
          ],
          [
            "Protein",
            `${data.protein}g`,
          ],
          [
            "Fiber",
            `${data.fiber}g`,
          ],
          [
            "Water",
            `${data.water}L`,
          ],
        ].map(
          ([label, val]) => (
            <div
              key={label}
              className="soft-card p-6 text-center"
            >
              <div className="text-sm text-[#7b6870] mb-2">
                {label}
              </div>

              <div className="text-3xl">
                {val}
              </div>
            </div>
          )
        )}
      </section>

      {/* DAY 1 FULL PLAN */}
      <section className="soft-card p-8 mb-8">
        <h2 className="text-4xl mb-8">
          Day 1 Full Meal Plan
        </h2>

        <div className="grid gap-6">
          {mealPlan.meals.map(
            ({ slot, meal }) => (
              <div
                key={meal.title}
                className="p-6 rounded-3xl bg-white border border-[#f0e3e8]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[9px] px-3 py-1 rounded-full bg-[#fdf2f5] text-[#d8a7b5] font-bold uppercase tracking-widest">
                    {slot}
                  </span>
                  <span className="text-sm font-semibold text-[#4a3f44]">€{meal.price.toFixed(2)}</span>
                </div>

                <h3 className="text-3xl mb-2">
                  {meal.title}
                </h3>

                <p className="text-[#7b6870] mb-5">
                  {meal.subtitle}
                </p>

                <div className="grid md:grid-cols-3 gap-3 mb-5">
                  <div className="p-3 rounded-2xl bg-[#fff4f7]">
                    {meal.kcal} kcal
                  </div>

                  <div className="p-3 rounded-2xl bg-[#fff4f7]">
                    {meal.protein}g protein
                  </div>

                  <div className="p-3 rounded-2xl bg-[#fff4f7]">
                    {meal.prep}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xl mb-3">
                      Ingredients
                    </h4>

                    <ul className="space-y-2 text-[#6f5a62]">
                      {meal.ingredients.map(
                        (item, idx) => (
                          <li key={item}>
                            • <span className="font-medium">{meal.amounts?.[idx]}</span> {item}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl mb-3">
                      Preparation
                    </h4>

                    <ol className="space-y-2 text-[#6f5a62]">
                      {meal.steps.map(
                        (step, i) => (
                          <li key={step}>
                            {i + 1}. {step}
                          </li>
                        )
                      )}
                    </ol>
                  </div>
                </div>

                {meal.benefits.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {meal.benefits.map((b) => (
                      <span key={b} className="text-[10px] px-2 py-1 rounded-full bg-[#fdf2f5] text-[#b98fa1] border border-[#f0e3e8]">
                        ✨ {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </section>

      {/* PREMIUM LOCK — samo za free korisnike */}
      {!isPremium && (
      <section className="soft-card p-10 text-center">
        <h2 className="text-5xl mb-4">
          Unlock Days 2–30
        </h2>

        <p className="text-[#7b6870] text-lg mb-8">
          Premium members receive rotating
          meal plans, shopping lists and
          symptom-based nutrition.
        </p>

        <a
          href="/pricing"
          className="btn-primary"
        >
          Upgrade Premium
        </a>
      </section>
      )}
    </main>
  );
}

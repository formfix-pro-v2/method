"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { calculateNutrition, getDayMealPlan } from "@/lib/nutrition";
import PrintButton from "@/components/PrintButton";
import { isPromoActive } from "@/lib/promo";

type GroceryItem = {
  name: string;
  category: string;
  count: number;
  amounts: string[];  // sve količine iz različitih obroka
};

const CATEGORIES: Record<string, string[]> = {
  "🥩 Protein": ["Eggs", "Chicken breast", "Chicken thigh", "Ground turkey", "Lean ground beef", "Canned tuna", "Canned sardines", "Salmon fillet", "Turkey slices", "Cottage cheese", "Greek yogurt"],
  "🥬 Vegetables": ["Spinach", "Baby spinach", "Broccoli", "Zucchini", "Bell pepper", "Red pepper", "Red onion", "Onion", "Cucumber", "Cherry tomatoes", "Tomato", "Carrots", "Carrot", "Green beans", "Frozen peas", "Frozen mixed vegetables", "Sweet potato", "Potatoes", "Lettuce", "Edamame", "Corn"],
  "🍎 Fruits": ["Apple", "Banana", "Kiwi", "Peach or pear", "Frozen berries", "Mixed berries", "Berries", "Avocado", "Lemon", "Lime", "Dried apricots"],
  "🌾 Grains & Legumes": ["Rolled oats", "Oats", "Whole grain bread", "Whole grain toast", "Whole wheat tortilla", "Rice", "Cooked rice", "Rice noodles", "Red lentil pasta", "Red lentils", "Chickpeas", "Black beans", "White beans", "Lentils"],
  "🥜 Nuts & Seeds": ["Almonds", "Walnuts", "Peanut butter", "Sunflower seeds", "Pumpkin seeds", "Flaxseeds", "Chia seeds"],
  "🧴 Pantry": ["Olive oil", "Sesame oil", "Soy sauce", "Tomato passata", "Tomato sauce", "Coconut milk", "Hummus", "Honey", "Dark chocolate chips", "Vegetable stock"],
  "🌿 Spices": ["Turmeric", "Cinnamon", "Cumin", "Curry powder", "Paprika", "Black pepper", "Garlic", "Garlic powder", "Basil", "Mint leaves", "Cilantro", "Chili flakes", "Vanilla extract"],
  "🥛 Dairy & Alt": ["Milk or plant milk", "Milk", "Water or milk", "Small yogurt", "Yogurt"],
};

function categorize(ingredient: string): string {
  for (const [cat, items] of Object.entries(CATEGORIES)) {
    if (items.some((item) => ingredient.toLowerCase().includes(item.toLowerCase()))) {
      return cat;
    }
  }
  return "📦 Other";
}

export default function ShoppingPage() {
  const [days, setDays] = useState(7);
  const [plan, setPlan] = useState("free");

  useEffect(() => {
    const savedPlan = localStorage.getItem("plan");
    if (savedPlan) setPlan(savedPlan);
  }, []);

  const quizData = useMemo(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("quizData");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  const nutrition = useMemo(() => {
    return calculateNutrition({
      age: Number(quizData?.age) || 48,
      height: Number(quizData?.height) || 168,
      weight: Number(quizData?.weight) || 72,
      activity: quizData?.activity || "light",
      goal: quizData?.goal || "tone",
      symptoms: quizData?.symptoms || [],
    });
  }, [quizData]);

  const groceryList = useMemo(() => {
    const allIngredients: Record<string, GroceryItem> = {};

    for (let d = 1; d <= days; d++) {
      const dayPlan = getDayMealPlan(
        d,
        nutrition.calories,
        quizData?.symptoms || [],
        quizData?.goal || "tone"
      );

      for (const { meal } of dayPlan.meals) {
        for (let idx = 0; idx < meal.ingredients.length; idx++) {
          const ing = meal.ingredients[idx];
          const amount = meal.amounts?.[idx] || "";
          const key = ing.toLowerCase();

          if (allIngredients[key]) {
            allIngredients[key].count++;
            if (amount && !allIngredients[key].amounts.includes(amount)) {
              allIngredients[key].amounts.push(amount);
            }
          } else {
            allIngredients[key] = {
              name: ing,
              category: categorize(ing),
              count: 1,
              amounts: amount ? [amount] : [],
            };
          }
        }
      }
    }

    // Group by category
    const grouped: Record<string, GroceryItem[]> = {};
    for (const item of Object.values(allIngredients)) {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    }

    return grouped;
  }, [days, nutrition.calories, quizData]);

  const totalItems = Object.values(groceryList).reduce(
    (sum, items) => sum + items.length,
    0
  );

  const weeklyBudget = (nutrition.dailyBudget * days).toFixed(2);

  const isPremium = (() => {
    if (isPromoActive()) return true;
    const premiumFlag = typeof window !== "undefined" && localStorage.getItem("premium") === "true";
    const expiryDate = typeof window !== "undefined" ? localStorage.getItem("expiryDate") : null;
    const isActive = premiumFlag && (!expiryDate || new Date(expiryDate) > new Date());
    return isActive && (plan === "glow" || plan === "elite");
  })();

  // Free users get 7-day list, premium get 3/7/14 options
  const maxFreeDays = 7;

  return (
    <main className="max-w-4xl mx-auto px-6 py-14">
      {/* HERO */}
      <section className="soft-card p-10 mb-8">
        <p className="uppercase tracking-[0.25em] text-xs text-[#b98fa1] mb-4 font-bold">
          Smart Shopping
        </p>
        <h1 className="text-5xl mb-4 text-[#4a3f44]">Your Grocery List</h1>
        <p className="text-[#7b6870] text-lg">
          Auto-generated from your personalized meal plan. Budget-friendly and
          hormone-safe.
        </p>
      </section>

      {/* CONTROLS */}
      <section className="soft-card p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#7b6870]">Generate for:</span>
            {[3, 7, 14].map((d) => {
              const allowed = isPremium || d <= maxFreeDays;
              return (
                <button
                  key={d}
                  onClick={() => allowed ? setDays(d) : null}
                  className={`px-4 py-2 rounded-xl text-sm transition-colors ${
                    days === d
                      ? "bg-[#d8a7b5] text-white"
                      : allowed
                        ? "bg-white border border-[#f0e3e8] text-[#7b6870] hover:border-[#d8a7b5]"
                        : "bg-white border border-[#f0e3e8] text-[#7b6870] opacity-50 cursor-not-allowed"
                  }`}
                >
                  {d} days {!isPremium && d > maxFreeDays ? "🔒" : ""}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-[9px] uppercase tracking-widest text-[#b98fa1] font-bold">
                Items
              </div>
              <div className="text-xl text-[#4a3f44]">{totalItems}</div>
            </div>
            <div className="text-center">
              <div className="text-[9px] uppercase tracking-widest text-[#b98fa1] font-bold">
                Est. Budget
              </div>
              <div className="text-xl text-[#4a3f44]">~€{weeklyBudget}</div>
            </div>
          </div>
          <PrintButton targetId="printable-grocery" label="Print List" />
        </div>
      </section>

      {/* GROCERY LIST */}
      <div id="printable-grocery">
      {!isPremium && days > maxFreeDays ? (
        <section className="soft-card p-10 text-center mb-8">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-2xl text-[#4a3f44] mb-2">
            14-Day Shopping Lists are Premium
          </h3>
          <p className="text-[#7b6870] mb-6">
            Free users get up to 7-day lists. Upgrade to generate lists for 14 days.
          </p>
          <Link href="/pricing" className="btn-primary">
            Upgrade Now
          </Link>
        </section>
      ) : (
        <section className="space-y-6">
          {Object.entries(groceryList)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([category, items]) => (
              <div key={category} className="soft-card p-6">
                <h3 className="text-xl text-[#4a3f44] mb-4">{category}</h3>
                <div className="grid gap-2">
                  {items
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((item) => (
                      <label
                        key={item.name}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/40 border border-[#f0e3e8] hover:border-[#d8a7b5] transition-colors cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded accent-[#d8a7b5]"
                        />
                        <div className="flex-1 min-w-0 group-has-[:checked]:line-through group-has-[:checked]:opacity-50">
                          <span className="text-[#4a3f44]">{item.name}</span>
                          {item.amounts.length > 0 && (
                            <span className="text-xs text-[#7b6870] ml-2">
                              ({item.amounts.join(" + ")})
                            </span>
                          )}
                        </div>
                        {item.count > 1 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#fdf2f5] text-[#b98fa1] shrink-0">
                            ×{item.count} meals
                          </span>
                        )}
                      </label>
                    ))}
                </div>
              </div>
            ))}
        </section>
      )}

      </div>{/* close printable-grocery */}

      {/* TIPS */}
      <section className="soft-card p-8 mt-8">
        <h3 className="text-2xl text-[#4a3f44] mb-4">Budget Tips</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            "Buy canned beans and fish — same nutrition, fraction of the price.",
            "Frozen vegetables are just as nutritious as fresh and last longer.",
            "Buy oats in bulk — they're the cheapest healthy breakfast.",
            "Seasonal fruits are always cheaper. Check what's in season.",
          ].map((tip) => (
            <div
              key={tip}
              className="p-4 rounded-2xl bg-[#fdf2f5] border border-[#f0e3e8] text-sm text-[#6f5a62]"
            >
              💡 {tip}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

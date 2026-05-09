"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { pushSingle } from "@/lib/sync";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState("free");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const syncedRef = useRef(false);

  useEffect(() => {
    const savedPlan = localStorage.getItem("plan");
    if (savedPlan) setPlan(savedPlan);

    // Proveri da li je korisnik ulogovan
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
      // Sync quiz data samo ako je ulogovan
      if (user && !syncedRef.current) {
        syncedRef.current = true;
        pushSingle("profile").catch(() => {});
      }
    });
  }, []);

  const steps = [
    {
      icon: "✅",
      title: "Assessment Complete",
      desc: "We've analyzed your symptoms, goals and body metrics to create your personalized plan.",
    },
    {
      icon: "🥗",
      title: "Meal Plan Ready",
      desc: "Your budget-friendly meal plan is generated. Day 1 includes all 4 meals with full recipes.",
    },
    {
      icon: "🧘‍♀️",
      title: "Exercise Program Set",
      desc: "Daily sessions tailored to your symptoms. Starting with gentle Foundation phase exercises.",
    },
    {
      icon: "📊",
      title: "Tracking Activated",
      desc: "Your progress dashboard, check-ins and achievements are ready to track your journey.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(timer);
        return prev;
      });
    }, 1500);
    return () => clearInterval(timer);
  }, [steps.length]);

  const allDone = step >= steps.length - 1;

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <section className="soft-card p-8 text-center mb-6">
        <div className="text-4xl mb-4">🌸</div>
        <h1 className="text-4xl mb-2 text-[#4a3f44]">Setting Up Your Plan</h1>
        <p className="text-[#7b6870]">Personalizing everything for you...</p>
      </section>

      <div className="space-y-3 mb-8">
        {steps.map((s, i) => (
          <div
            key={s.title}
            className={`soft-card p-5 flex items-center gap-4 transition-all duration-500 ${
              i <= step ? "opacity-100" : "opacity-30"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-lg transition-all ${
                i <= step
                  ? "bg-[#fdf2f5] scale-100"
                  : "bg-[#f0e3e8]/30 scale-90"
              }`}
            >
              {i <= step ? s.icon : "⏳"}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-[#4a3f44]">{s.title}</p>
              {i <= step && (
                <p className="text-xs text-[#7b6870] mt-0.5">{s.desc}</p>
              )}
            </div>
            {i <= step && (
              <span className="ml-auto text-green-500 text-sm shrink-0">✓</span>
            )}
          </div>
        ))}
      </div>

      {allDone && (
        <section className="soft-card p-8 text-center">
          <h2 className="text-3xl text-[#4a3f44] mb-2">You&apos;re All Set!</h2>
          <p className="text-[#7b6870] text-sm mb-6">
            Your personalized program is ready.
            {!isLoggedIn && " Create a free account to save your progress across devices."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/results" className="btn-primary px-8">
              View My Results
            </Link>
            {isLoggedIn ? (
              <Link href="/dashboard" className="btn-outline px-8">
                Go to Dashboard
              </Link>
            ) : (
              <Link href="/login?redirect=/dashboard" className="btn-outline px-8">
                Sign In to Dashboard
              </Link>
            )}
          </div>
          {plan === "free" && (
            <p className="text-xs text-[#b98fa1] mt-4">
              Free trial: 7 days of exercises + Day 1 full meals.{" "}
              <Link href="/pricing" className="underline">
                Upgrade anytime
              </Link>
            </p>
          )}
        </section>
      )}
    </main>
  );
}

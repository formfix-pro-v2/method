"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { activateSubscription } from "@/lib/subscription";
import type { MembershipPlan } from "@/lib/subscription";

function SuccessContent() {
  const params = useSearchParams();
  const [plan, setPlan] = useState("Glow");
  const [activated, setActivated] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const planParam = params.get("plan") as MembershipPlan | null;
    const planId = planParam || "glow";

    setPlan(planId === "elite" ? "Elite" : "Glow");

    // Activate subscription in database
    if (!activated) {
      activateSubscription(planId as MembershipPlan).then(() => {
        setActivated(true);
      });
    }

    // Sakrij confetti posle 4 sekunde
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, [params, activated]);

  return (
    <main className="max-w-5xl mx-auto px-6 py-16 relative">
      {/* Confetti animacija */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-[confettiFall_3s_ease-in_forwards]"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDelay: `${Math.random() * 2}s`,
                fontSize: `${12 + Math.random() * 16}px`,
              }}
            >
              {["🌸", "✨", "💜", "🎉", "⭐", "💫"][i % 6]}
            </div>
          ))}
        </div>
      )}

      {/* CONFIRMATION */}
      <section className="soft-card p-12 text-center mb-8 border-2 border-[#fdf2f5]">
        <div className="text-6xl mb-6">🌸</div>

        <p className="uppercase tracking-[0.3em] text-xs text-[#b98fa1] mb-4 font-bold">
          Payment Successful
        </p>

        <h1 className="text-6xl mb-5 text-[#4a3f44]">
          Welcome to the family!
        </h1>

        <p className="text-[#7b6870] text-xl max-w-2xl mx-auto leading-relaxed">
          Your <strong>{plan} Plan</strong> is now fully active. We&apos;ve
          unlocked your complete hormone-balancing menu and daily movement guide.
        </p>
      </section>

      {/* WHAT'S UNLOCKED */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { title: "Full Meal Plan", desc: "Breakfast, Lunch, Dinner & Snacks unlocked.", icon: "🥗" },
          { title: "Daily Training", desc: "Your 20-min guided sessions are ready.", icon: "🧘‍♀️" },
          { title: "Progress Tracking", desc: "Dashboard with daily check-ins.", icon: "📊" },
        ].map((item) => (
          <div key={item.title} className="soft-card p-8 text-center bg-white border border-[#f0e3e8]">
            <div className="text-3xl mb-4">{item.icon}</div>
            <h3 className="font-bold text-[#4a3f44] mb-2">{item.title}</h3>
            <p className="text-sm text-[#7b6870]">{item.desc}</p>
            <div className="mt-4 text-[#d6a7b1] text-xs font-bold uppercase tracking-widest">
              Active Now
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <section className="soft-card p-12 text-center bg-gradient-to-b from-white to-[#fffcfd] border border-[#f0e3e8]">
        <h2 className="text-4xl mb-6 text-[#4a3f44]">Ready for Day 1?</h2>

        <p className="text-[#7b6870] text-lg mb-10 max-w-md mx-auto">
          Your personalized dashboard is ready with everything you need.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/dashboard"
            className="btn-primary px-12 py-4 shadow-xl hover:scale-105 transition-transform w-full sm:w-auto"
          >
            Enter My Dashboard
          </Link>

          <Link
            href="/session"
            className="btn-outline px-12 py-4 w-full sm:w-auto"
          >
            Start Today&apos;s Workout
          </Link>
        </div>

        <p className="mt-10 text-xs text-[#b98fa1]">
          A confirmation receipt has been sent to your email.
        </p>
      </section>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-[#b98fa1] animate-pulse">
          Activating your plan...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

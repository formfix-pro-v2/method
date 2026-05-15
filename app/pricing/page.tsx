"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { isPromoActive } from "@/lib/promo";

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Set deadline to end of today (midnight)
    function getTimeLeft() {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const diff = end.getTime() - now.getTime();
      if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    }

    setTimeLeft(getTimeLeft());
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#fff1f5] border border-[#f0e3e8]">
      <span className="text-sm text-[#8f5d6f] font-medium">Today&apos;s price expires in:</span>
      <div className="flex items-center gap-1 font-mono">
        <span className="bg-[#4a3f44] text-white px-2 py-1 rounded-lg text-sm font-bold">
          {String(timeLeft.hours).padStart(2, "0")}
        </span>
        <span className="text-[#d8a7b5] font-bold">:</span>
        <span className="bg-[#4a3f44] text-white px-2 py-1 rounded-lg text-sm font-bold">
          {String(timeLeft.minutes).padStart(2, "0")}
        </span>
        <span className="text-[#d8a7b5] font-bold">:</span>
        <span className="bg-[#4a3f44] text-white px-2 py-1 rounded-lg text-sm font-bold">
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

function PricingContent() {
  const params = useSearchParams();
  const promo = isPromoActive();

  const locked =
    params.get("locked") === "true";

  const plans = [
    {
      name: "Glow",
      price: "€29",
      badge: "Most Popular",
      subtitle:
        "30-day feminine reset for sleep, confidence and body comfort.",
      href: "/plans/glow",
      cta: "Explore Glow",
      features: [
        "30-Day Program",
        "Daily guided sessions",
        "Sleep + hot flash support",
        "Belly tone routines",
        "Progress dashboard",
      ],
    },
    {
      name: "Elite",
      price: "€79",
      badge: "Best Value",
      subtitle:
        "90-day premium transformation with advanced systems.",
      href: "/plans/elite",
      cta: "Explore Elite",
      features: [
        "Everything in Glow",
        "90-Day Roadmap",
        "Pelvic floor restore",
        "Monthly reassessments",
        "VIP premium library",
      ],
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-14">
      {/* LOCKED NOTICE */}
      {locked && (
        <section className="soft-card p-8 mb-10 border border-[#e8c8d3]">
          <p className="uppercase tracking-[0.25em] text-sm text-[#b98fa1] mb-4">
            Premium Access Required
          </p>

          <h2 className="text-5xl mb-4">
            Unlock Your Wellness Experience
          </h2>

          <p className="text-[#7b6870] text-lg leading-relaxed">
            Upgrade now to access your premium dashboard,
            guided sessions, personalized plans and progress
            tracking tools.
          </p>
        </section>
      )}

      {/* PROMO BANNER */}
      {promo && (
        <section className="soft-card p-8 mb-10 border-2 border-green-200 bg-green-50/30 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="text-3xl text-[#4a3f44] mb-2 font-semibold">
            Free Access — Launch Promo
          </h2>
          <p className="text-[#7b6870] text-lg mb-4">
            All programs are currently <strong>100% free</strong> during our launch period.
            Enjoy full access to every feature — no payment required.
          </p>
          <Link href="/quiz" className="btn-primary inline-block">
            Start Free Now
          </Link>
        </section>
      )}

      {/* HERO */}
      <section className="text-center mb-14">
        <p className="uppercase tracking-[0.25em] text-sm text-[#b98fa1] mb-4">
          Choose Your Membership
        </p>

        <h1 className="text-5xl md:text-7xl mb-6">
          Premium Plans Designed For Women 40+
        </h1>

        <p className="max-w-3xl mx-auto text-[#7b6870] text-xl leading-relaxed mb-6">
          Compare your options, explore benefits and choose
          the transformation path that fits you best.
        </p>

        {!promo && <CountdownTimer />}
      </section>

      {/* PLAN CARDS */}
      <section className="grid lg:grid-cols-2 gap-8 mb-14">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="soft-card p-8 relative"
          >
            <div className="absolute top-5 right-5 px-4 py-2 rounded-full bg-[#ffe7ef] text-[#8f5d6f] text-sm">
              {plan.badge}
            </div>

            <h2 className="text-5xl mb-3">
              {plan.name}
            </h2>

            <p className="text-[#7b6870] text-lg mb-6">
              {plan.subtitle}
            </p>

            <div className="text-6xl mb-8">
              {plan.price}
            </div>

            <div className="space-y-4 mb-10">
              {plan.features.map((item) => (
                <div
                  key={item}
                  className="p-4 rounded-2xl bg-white border border-[#f0e3e8]"
                >
                  ✓ {item}
                </div>
              ))}
            </div>

            <Link
              href={promo ? "#" : plan.href}
              className={`${
                plan.name === "Elite"
                  ? "btn-primary w-full text-center block"
                  : "btn-outline w-full text-center block"
              } ${promo ? "opacity-40 grayscale pointer-events-none" : ""}`}
              aria-disabled={promo}
            >
              {promo ? "Coming Soon" : plan.cta}
            </Link>
          </div>
        ))}
      </section>

      {/* COMPARE */}
      <section className="soft-card p-10 mb-14">
        <h2 className="text-5xl mb-8 text-center">
          Quick Comparison
        </h2>

        <div className="space-y-4">
          {[
            ["Program Length", "30 Days", "90 Days"],
            ["Guided Sessions", "Yes", "Premium Library"],
            ["Reassessments", "Basic", "Monthly Smart"],
            ["Pelvic Floor Restore", "—", "Yes"],
            ["Advanced Sculpt Phases", "—", "Yes"],
            ["Progress Dashboard", "Yes", "Advanced"],
          ].map(([feature, glow, elite]) => (
            <div
              key={feature}
              className="grid md:grid-cols-3 gap-4 p-4 rounded-2xl bg-white border border-[#f0e3e8]"
            >
              <div className="text-[#7b6870]">
                {feature}
              </div>

              <div>{glow}</div>

              <div>{elite}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="soft-card p-10 mb-14">
        <h2 className="text-4xl text-center mb-8 text-[#4a3f44]">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          {[
            {
              q: "Is this suitable for complete beginners?",
              a: "Absolutely. The program starts with a Foundation phase (gentle exercises only) and gradually increases intensity based on your fitness level and age.",
            },
            {
              q: "How much does the meal plan cost per day?",
              a: "All our meal plans are designed to cost under €7 per day. Most days average €5-6 using budget-friendly ingredients like canned fish, beans, oats and seasonal vegetables.",
            },
            {
              q: "What if I have specific health conditions?",
              a: "Veronica Method is a wellness program, not medical treatment. The quiz personalizes your plan based on symptoms, but always consult your doctor before starting any new exercise or nutrition program.",
            },
            {
              q: "Can I cancel anytime?",
              a: "Yes. You can cancel from your Account page at any time. We also offer a 30-day money-back guarantee — no questions asked.",
            },
            {
              q: "What's the difference between Glow and Elite?",
              a: "Glow is a 30-day program perfect for getting started. Elite is 90 days with advanced phases, pelvic floor recovery, monthly reassessments and a premium exercise library.",
            },
            {
              q: "Do I need any equipment?",
              a: "No equipment needed. All exercises use bodyweight only. A chair and a wall are the only things you'll need.",
            },
          ].map((faq) => (
            <details
              key={faq.q}
              className="group p-5 rounded-2xl bg-white border border-[#f0e3e8] hover:border-[#d8a7b5] transition-colors"
            >
              <summary className="cursor-pointer text-[#4a3f44] font-medium flex items-center justify-between">
                {faq.q}
                <span className="text-[#d8a7b5] group-open:rotate-45 transition-transform text-xl">+</span>
              </summary>
              <p className="mt-3 text-sm text-[#7b6870] leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="soft-card p-10 text-center">
        <h2 className="text-5xl mb-5">
          Start Feeling Better Today
        </h2>

        <p className="text-[#7b6870] text-lg mb-8">
          Explore every feature before checkout and choose
          the plan that fits your next chapter.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href={promo ? "#" : "/plans/glow"}
            className={`btn-outline ${promo ? "opacity-40 grayscale pointer-events-none" : ""}`}
            aria-disabled={promo}
          >
            {promo ? "Coming Soon" : "View Glow"}
          </Link>

          <Link
            href={promo ? "#" : "/plans/elite"}
            className={`btn-primary ${promo ? "opacity-40 grayscale pointer-events-none" : ""}`}
            aria-disabled={promo}
          >
            {promo ? "Coming Soon" : "View Elite"}
          </Link>
        </div>
      </section>

      {/* TRUST SIGNALS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { icon: "🔒", text: "Secure Payment" },
          { icon: "📱", text: "Works on Any Device" },
          { icon: "🧘‍♀️", text: "Designed by Specialists" },
          { icon: "💬", text: "Email Support" },
        ].map((item) => (
          <div key={item.text} className="soft-card p-4 text-center">
            <div className="text-xl mb-1">{item.icon}</div>
            <p className="text-[10px] text-[#4a3f44] font-medium">{item.text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center">
          Loading plans...
        </div>
      }
    >
      <PricingContent />
    </Suspense>
  );
}

"use client";

import Link from "next/link";

export default function GlowPlanPage() {
  const features = [
    "30-Day Menopause Transformation Program",
    "Daily guided movement sessions",
    "Better sleep evening routines",
    "Hot flash calming flows",
    "Belly tone after 40 system",
    "Posture & confidence routines",
    "Smart symptom-based daily plans",
    "Progress dashboard tracking",
    "Monthly reassessment upgrade",
    "Mobile friendly guided sessions",
  ];

  const results = [
    "More energy in the morning",
    "Better sleep consistency",
    "Reduced bloating feeling",
    "Improved waistline habits",
    "More feminine confidence",
    "Daily structure & motivation",
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-14">
      {/* HERO */}
      <section className="soft-card p-10 text-center mb-10">
        <p className="uppercase tracking-[0.25em] text-sm text-[#b98fa1] mb-4">
          Glow Membership
        </p>

        <h1 className="text-6xl mb-5">
          Feel Light, Calm & Beautiful Again
        </h1>

        <p className="text-[#7b6870] text-xl max-w-3xl mx-auto leading-relaxed mb-8">
          A complete 30-day feminine reset designed for
          women navigating menopause symptoms, body changes
          and low energy.
        </p>

        <div className="text-7xl mb-8">€29</div>

        <Link
          href="/checkout?plan=glow"
          className="btn-primary"
        >
          Start Glow Now
        </Link>
      </section>

      {/* WHAT YOU GET */}
      <section className="grid lg:grid-cols-2 gap-8 mb-10">
        <div className="soft-card p-8">
          <h2 className="text-4xl mb-6">
            Everything Included
          </h2>

          <div className="space-y-4">
            {features.map((item) => (
              <div
                key={item}
                className="p-4 rounded-2xl bg-white border border-[#f0e3e8]"
              >
                ✓ {item}
              </div>
            ))}
          </div>
        </div>

        <div className="soft-card p-8">
          <h2 className="text-4xl mb-6">
            What Women Love
          </h2>

          <div className="space-y-4">
            {results.map((item) => (
              <div
                key={item}
                className="p-4 rounded-2xl bg-[#fff4f7]"
              >
                ✨ {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IDEAL FOR */}
      <section className="soft-card p-10 mb-10">
        <h2 className="text-5xl mb-6">
          Perfect If You Want To...
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            "Lose stubborn belly weight",
            "Sleep deeper again",
            "Reduce hot flashes",
            "Feel feminine again",
            "Improve posture",
            "Have a daily wellness structure",
          ].map((item) => (
            <div
              key={item}
              className="p-5 rounded-3xl bg-white border border-[#f0e3e8]"
            >
              ✓ {item}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="soft-card p-10 text-center">
        <h2 className="text-5xl mb-5">
          Your Next 30 Days Can Feel Different
        </h2>

        <p className="text-[#7b6870] text-lg mb-8">
          Start now and rebuild comfort, confidence and glow.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/checkout?plan=glow"
            className="btn-primary"
          >
            Join Glow €29
          </Link>

          <Link
            href="/plans/elite"
            className="btn-outline"
          >
            Compare With Elite
          </Link>
        </div>
      </section>
    </main>
  );
}

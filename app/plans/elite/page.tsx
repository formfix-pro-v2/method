"use client";

import Link from "next/link";

export default function ElitePlanPage() {
  const features = [
    "Everything included in Glow",
    "90-Day Full Transformation Roadmap",
    "Advanced belly tone phases",
    "Strength after 40 protocols",
    "Pelvic floor recovery system",
    "Joint pain & mobility protocols",
    "Monthly reassessment engine",
    "VIP premium guided sessions",
    "Priority future updates",
    "Elite transformation dashboard",
    "Long-term lifestyle progression",
    "Premium results accelerator system",
  ];

  const outcomes = [
    "Visible body confidence changes",
    "More strength & energy",
    "Reduced stiffness & discomfort",
    "Better waistline consistency",
    "Premium accountability feeling",
    "Long-term healthy habits",
  ];

  const compare = [
    ["Program Length", "90 Days"],
    ["Guided Sessions", "Premium Library"],
    ["Reassessments", "Monthly Smart Upgrades"],
    ["Pelvic Floor Support", "Included"],
    ["Advanced Body Sculpt", "Included"],
    ["Priority Updates", "Included"],
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-14">
      {/* HERO */}
      <section className="soft-card p-10 text-center mb-10 relative overflow-hidden">
        <div className="absolute top-5 right-5 px-4 py-2 rounded-full bg-[#ffe7ef] text-[#8f5d6f] text-sm font-medium">
          Best Value
        </div>

        <p className="uppercase tracking-[0.25em] text-sm text-[#b98fa1] mb-4">
          Elite Membership
        </p>

        <h1 className="text-6xl mb-5">
          Full Premium Transformation
        </h1>

        <p className="text-[#7b6870] text-xl max-w-3xl mx-auto leading-relaxed mb-8">
          Built for women who want serious results:
          body confidence, strength, sleep, mobility and
          long-term hormonal wellness.
        </p>

        <div className="text-7xl mb-8">€79</div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/checkout?plan=elite"
            className="btn-primary"
          >
            Start Elite Now
          </Link>

          <Link
            href="/plans/glow"
            className="btn-outline"
          >
            Compare Glow
          </Link>
        </div>
      </section>

      {/* FEATURES */}
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
            Elite Outcomes
          </h2>

          <div className="space-y-4">
            {outcomes.map((item) => (
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

      {/* COMPARISON */}
      <section className="soft-card p-10 mb-10">
        <h2 className="text-5xl mb-8">
          Why Elite?
        </h2>

        <div className="space-y-4">
          {compare.map(([label, value]) => (
            <div
              key={label}
              className="grid md:grid-cols-2 gap-4 p-4 rounded-2xl bg-white border border-[#f0e3e8]"
            >
              <div className="text-[#7b6870]">
                {label}
              </div>

              <div className="font-medium">
                {value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* IDEAL FOR */}
      <section className="soft-card p-10 mb-10">
        <h2 className="text-5xl mb-6">
          Perfect If You Want...
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            "Full body reset after 40",
            "More toned waistline",
            "Better strength & posture",
            "Less pain and stiffness",
            "Long-term premium guidance",
            "Serious transformation structure",
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
          Commit To Your Next Chapter
        </h2>

        <p className="text-[#7b6870] text-lg mb-8">
          Elite is for women ready to transform with a
          deeper, smarter and more complete system.
        </p>

        <Link
          href="/checkout?plan=elite"
          className="btn-primary"
        >
          Join Elite €79
        </Link>
      </section>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";

const STEPS = [
  {
    icon: "🧘‍♀️",
    title: "Your Daily Program",
    desc: "Personalized exercises based on your symptoms. New routine every day, progressive difficulty.",
    position: "top",
  },
  {
    icon: "🥗",
    title: "Budget Meal Plans",
    desc: "4 meals per day under €7. Full recipes with ingredients, amounts and prep steps.",
    position: "middle",
  },
  {
    icon: "💊",
    title: "Supplement Guide",
    desc: "Vitamins and minerals tailored to your symptoms with exact doses.",
    position: "middle",
  },
  {
    icon: "📊",
    title: "Track Your Progress",
    desc: "Daily check-ins, sleep & energy graphs, achievements and weekly summaries.",
    position: "bottom",
  },
  {
    icon: "🛒",
    title: "Shopping Lists",
    desc: "Auto-generated grocery lists for the week. Print or save as PDF.",
    position: "bottom",
  },
];

export default function OnboardingTutorial() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (localStorage.getItem("tutorialDone")) return;
    // Show after a short delay
    const timer = setTimeout(() => setShow(true), 800);
    return () => clearTimeout(timer);
  }, []);

  function next() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      finish();
    }
  }

  function finish() {
    localStorage.setItem("tutorialDone", "true");
    setShow(false);
  }

  if (!show) return null;

  const current = STEPS[step];

  return (
    <div className="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
      <div className="soft-card p-6 max-w-sm w-full shadow-2xl text-center relative">
        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mb-4">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === step ? "bg-[#d8a7b5] w-6" : i < step ? "bg-[#d8a7b5]/50" : "bg-[#f0e3e8]"
              }`}
            />
          ))}
        </div>

        <div className="text-4xl mb-3">{current.icon}</div>
        <h3 className="text-xl text-[#4a3f44] mb-2">{current.title}</h3>
        <p className="text-sm text-[#7b6870] mb-5 leading-relaxed">{current.desc}</p>

        <div className="flex gap-2">
          <button onClick={finish} className="flex-1 text-sm text-[#b98fa1] py-2 hover:text-[#8f5d6f]">
            Skip
          </button>
          <button onClick={next} className="btn-primary flex-[2] py-2.5">
            {step < STEPS.length - 1 ? "Next" : "Get Started!"}
          </button>
        </div>

        <p className="text-[10px] text-[#b98fa1] mt-3">
          {step + 1} of {STEPS.length}
        </p>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { playCelebration } from "@/lib/sounds";
const MILESTONES: Record<number, { emoji: string; title: string; message: string }> = {
  7:  { emoji: "🌟", title: "1 Week Complete!", message: "You've built the foundation. Your body is already adapting." },
  14: { emoji: "💪", title: "2 Weeks Strong!", message: "Most women notice better sleep and less stiffness by now." },
  21: { emoji: "🔥", title: "3 Weeks — Unstoppable!", message: "You're in the strengthen phase. Real changes are happening." },
  30: { emoji: "👑", title: "30 Days — Transformation!", message: "You did it! Look back at Day 1 and see how far you've come." },
  60: { emoji: "💎", title: "60 Days — Elite!", message: "Two months of consistency. You're an inspiration." },
  90: { emoji: "🏆", title: "90 Days — Mastery!", message: "The full journey complete. You've transformed your wellness." },
};

export default function MilestoneCelebration() {
  const [milestone, setMilestone] = useState<{ emoji: string; title: string; message: string } | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const day = Number(localStorage.getItem("day") || "1");
    const celebrated = JSON.parse(localStorage.getItem("celebratedMilestones") || "[]");

    if (MILESTONES[day] && !celebrated.includes(day)) {
      setMilestone(MILESTONES[day]);
      setShow(true);
      playCelebration();
      celebrated.push(day);
      localStorage.setItem("celebratedMilestones", JSON.stringify(celebrated));
    }
  }, []);

  if (!show || !milestone) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-black/50">
      <div className="soft-card p-10 max-w-sm w-full shadow-2xl text-center relative overflow-hidden">
        {/* Confetti-like dots */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: ["#d8a7b5", "#f8d8df", "#e7bcc8", "#c58d9d", "#fdf2f5"][i % 5],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="text-6xl mb-4">{milestone.emoji}</div>
          <h2 className="text-3xl text-[#4a3f44] mb-2">{milestone.title}</h2>
          <p className="text-sm text-[#7b6870] mb-6">{milestone.message}</p>
          <button onClick={() => setShow(false)} className="btn-primary px-8 py-3">
            Thank You! 🌸
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { pushSingle } from "@/lib/sync";

export default function CheckinPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [sleep, setSleep] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [stress, setStress] = useState(5);
  const [time, setTime] = useState("20 min");
  const [symptoms, setSymptoms] = useState<string[]>([]);

  const options = [
    "Hot flashes",
    "Poor sleep",
    "Joint pain",
    "Bloating",
    "Low mood",
    "Low energy",
    "Incontinence",
    "Pelvic pressure",
  ];

  function toggle(item: string) {
    setSymptoms((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  }

  async function saveCheckin() {
    setSaving(true);

    const payload = {
      sleep,
      energy,
      stress,
      time,
      symptoms,
      date: new Date().toISOString(),
    };

    // Save locally as fallback
    localStorage.setItem("dailyCheckin", JSON.stringify(payload));

    // Save to history array for progress tracking
    try {
      const history = JSON.parse(localStorage.getItem("checkinHistory") || "[]");
      // Avoid duplicate dates
      const today = new Date().toISOString().split("T")[0];
      const filtered = history.filter(
        (e: { date: string }) => !e.date.startsWith(today)
      );
      filtered.push(payload);
      // Keep last 90 days
      const trimmed = filtered.slice(-90);
      localStorage.setItem("checkinHistory", JSON.stringify(trimmed));
    } catch { /* ignore */ }

    // Try to save to API
    try {
      await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // Silently fail - local storage has the data
    }

    // Sync checkins to server
    pushSingle("checkins");

    router.push("/dashboard");
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-14">
      <section className="soft-card p-8">
        <p className="uppercase tracking-[0.25em] text-sm text-[#b98fa1] mb-4">
          Daily Check-In
        </p>

        <h1 className="text-5xl mb-8">How Are You Feeling Today?</h1>

        {/* Sleep */}
        <div className="mb-8">
          <label htmlFor="sleep-range" className="mb-3 block text-[#4a3f44]">
            Sleep Quality
          </label>
          <input
            id="sleep-range"
            type="range"
            min="1"
            max="10"
            value={sleep}
            onChange={(e) => setSleep(Number(e.target.value))}
            className="w-full accent-[#d8a7b5]"
          />
          <p className="text-[#7b6870] mt-2">{sleep}/10</p>
        </div>

        {/* Energy */}
        <div className="mb-8">
          <label htmlFor="energy-range" className="mb-3 block text-[#4a3f44]">
            Energy Level
          </label>
          <input
            id="energy-range"
            type="range"
            min="1"
            max="10"
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-full accent-[#d8a7b5]"
          />
          <p className="text-[#7b6870] mt-2">{energy}/10</p>
        </div>

        {/* Stress */}
        <div className="mb-8">
          <label htmlFor="stress-range" className="mb-3 block text-[#4a3f44]">
            Stress Level
          </label>
          <input
            id="stress-range"
            type="range"
            min="1"
            max="10"
            value={stress}
            onChange={(e) => setStress(Number(e.target.value))}
            className="w-full accent-[#d8a7b5]"
          />
          <p className="text-[#7b6870] mt-2">{stress}/10</p>
        </div>

        {/* Time */}
        <div className="mb-8">
          <p className="mb-3 text-[#4a3f44]">Today&apos;s Time Available</p>
          <div className="grid md:grid-cols-3 gap-4">
            {["10 min", "20 min", "30+ min"].map((item) => (
              <button
                key={item}
                onClick={() => setTime(item)}
                className={`p-4 rounded-2xl border transition-colors ${
                  time === item
                    ? "bg-[#fff1f5] border-[#d6a7b1]"
                    : "bg-white border-[#f0e3e8] hover:border-[#d6a7b1]/50"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Symptoms */}
        <div className="mb-10">
          <p className="mb-3 text-[#4a3f44]">Symptoms Today</p>
          <div className="grid md:grid-cols-2 gap-4">
            {options.map((item) => {
              const active = symptoms.includes(item);
              return (
                <button
                  key={item}
                  onClick={() => toggle(item)}
                  className={`p-4 rounded-2xl border text-left transition-colors ${
                    active
                      ? "bg-[#fff1f5] border-[#d6a7b1]"
                      : "bg-white border-[#f0e3e8] hover:border-[#d6a7b1]/50"
                  }`}
                >
                  {active ? "✓ " : ""}
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mood Emoji */}
        <div className="mb-8">
          <p className="mb-3 text-[#4a3f44]">How&apos;s your mood?</p>
          <div className="flex justify-between gap-2">
            {[
              { emoji: "😔", label: "Low" },
              { emoji: "😐", label: "Meh" },
              { emoji: "🙂", label: "Okay" },
              { emoji: "😊", label: "Good" },
              { emoji: "🤩", label: "Great" },
            ].map((m, i) => (
              <button
                key={m.emoji}
                onClick={() => {
                  // Map emoji index to energy-like scale
                  const moodValue = (i + 1) * 2;
                  setEnergy(moodValue);
                }}
                className={`flex-1 p-3 rounded-2xl border text-center transition-all ${
                  energy === (i + 1) * 2
                    ? "bg-[#fdf2f5] border-[#a8687a] scale-105"
                    : "bg-white border-[#f0e3e8] hover:border-[#a8687a]/50"
                }`}
              >
                <span className="text-2xl block">{m.emoji}</span>
                <span className="text-[9px] text-[#7b6870] mt-1 block">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={saveCheckin}
          disabled={saving}
          className="btn-primary w-full py-4 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save & Update My Plan"}
        </button>
      </section>
    </main>
  );
}

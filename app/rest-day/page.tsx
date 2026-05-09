"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getRestDayContent, isRestDay } from "@/lib/programs";
import { useRouter } from "next/navigation";

export default function RestDayPage() {
  const router = useRouter();
  const [day, setDay] = useState(7);
  const [meditationStep, setMeditationStep] = useState(-1);
  const [journalText, setJournalText] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedDay = Number(localStorage.getItem("day") || "1");
    setDay(savedDay);

    // If not a rest day, redirect to session
    if (!isRestDay(savedDay)) {
      router.push("/session");
    }

    // Load saved journal
    const savedJournal = localStorage.getItem(`journal_day_${savedDay}`);
    if (savedJournal) {
      setJournalText(savedJournal);
      setSaved(true);
    }
  }, [router]);

  const content = useMemo(() => getRestDayContent(day), [day]);

  function saveJournal() {
    localStorage.setItem(`journal_day_${day}`, journalText);
    setSaved(true);
  }

  function completeRestDay() {
    localStorage.setItem("day", String(day + 1));

    // Save to history
    try {
      const history = JSON.parse(localStorage.getItem("checkinHistory") || "[]");
      history.push({
        sleep: 0,
        energy: 0,
        stress: 0,
        symptoms: [],
        date: new Date().toISOString(),
        completedSession: true,
        restDay: true,
      });
      localStorage.setItem("checkinHistory", JSON.stringify(history.slice(-90)));
    } catch { /* ignore */ }

    router.push("/dashboard");
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-14">
      {/* HERO */}
      <section className="soft-card p-10 mb-8 text-center">
        <div className="text-5xl mb-4">🌸</div>
        <p className="uppercase tracking-[0.25em] text-xs text-[#b98fa1] mb-4 font-bold">
          Day {day} • Rest Day
        </p>
        <h1 className="text-5xl mb-3 text-[#4a3f44]">{content.title}</h1>
        <p className="text-[#7b6870] text-lg italic">&ldquo;{content.theme}&rdquo;</p>
      </section>

      {/* MEDITATION */}
      <section className="soft-card p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl text-[#4a3f44]">🧘 {content.meditation.title}</h2>
          <span className="text-sm text-[#b98fa1] bg-[#fdf2f5] px-3 py-1 rounded-full">
            {content.meditation.duration}
          </span>
        </div>

        <div className="space-y-3">
          {content.meditation.instructions.map((step, i) => (
            <div
              key={i}
              onClick={() => setMeditationStep(i)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                meditationStep >= i
                  ? "bg-[#fdf2f5] border-[#d8a7b5] text-[#4a3f44]"
                  : "bg-white border-[#f0e3e8] text-[#7b6870]"
              }`}
            >
              <span className="text-[#d8a7b5] font-bold mr-2">{i + 1}.</span>
              {step}
            </div>
          ))}
        </div>

        {meditationStep >= content.meditation.instructions.length - 1 && (
          <div className="mt-6 p-4 rounded-2xl bg-green-50 border border-green-100 text-green-600 text-center text-sm">
            ✓ Meditation complete. Well done.
          </div>
        )}
      </section>

      {/* JOURNAL */}
      <section className="soft-card p-8 mb-6">
        <h2 className="text-3xl text-[#4a3f44] mb-2">📝 Journal</h2>
        <p className="text-[#b98fa1] italic mb-6">{content.journalPrompt}</p>

        <textarea
          value={journalText}
          onChange={(e) => {
            setJournalText(e.target.value);
            setSaved(false);
          }}
          placeholder="Write your thoughts here... This is private and stays on your device."
          rows={5}
          className="w-full p-4 rounded-2xl border border-[#ead8de] outline-none focus:border-[#d6a7b1] transition-colors resize-none mb-4"
        />

        <button
          onClick={saveJournal}
          disabled={!journalText.trim()}
          className="btn-outline text-sm disabled:opacity-40"
        >
          {saved ? "✓ Saved" : "Save Entry"}
        </button>
      </section>

      {/* SELF-CARE TIPS */}
      <section className="soft-card p-8 mb-6">
        <h2 className="text-3xl text-[#4a3f44] mb-6">💆 Self-Care Ideas</h2>
        <div className="grid gap-3">
          {content.selfCareTips.map((tip, i) => (
            <label
              key={i}
              className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-[#f0e3e8] hover:border-[#d8a7b5] transition-colors cursor-pointer group"
            >
              <input
                type="checkbox"
                className="mt-1 w-5 h-5 rounded accent-[#d8a7b5] shrink-0"
              />
              <span className="text-[#6f5a62] text-sm group-has-[:checked]:line-through group-has-[:checked]:opacity-50">
                {tip}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* AFFIRMATION */}
      <section className="soft-card p-10 mb-8 text-center bg-gradient-to-b from-[#fffcfd] to-white">
        <p className="text-[10px] uppercase tracking-widest text-[#b98fa1] mb-4 font-bold">
          Today&apos;s Affirmation
        </p>
        <p className="text-2xl text-[#4a3f44] italic leading-relaxed max-w-lg mx-auto">
          &ldquo;{content.affirmation}&rdquo;
        </p>
      </section>

      {/* COMPLETE */}
      <section className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={completeRestDay} className="btn-primary px-10 py-4">
          Complete Rest Day & Advance
        </button>
        <Link href="/dashboard" className="btn-outline px-10 py-4">
          Back to Dashboard
        </Link>
      </section>
    </main>
  );
}

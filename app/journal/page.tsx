"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { pushSingle } from "@/lib/sync";

type JournalEntry = {
  day: number;
  date: string;
  text: string;
  mood: number;
  milestone: string;
};

const MILESTONES = [
  { day: 1, label: "Day 1 — Starting Point", prompt: "How do you feel right now? What are your biggest challenges? What do you hope to achieve?" },
  { day: 7, label: "Week 1 — First Impressions", prompt: "What has surprised you so far? Any small changes you've noticed?" },
  { day: 14, label: "Week 2 — Building Habits", prompt: "Which exercises feel easier now? How is your sleep compared to Day 1?" },
  { day: 21, label: "Week 3 — Momentum", prompt: "What's the biggest change you've noticed? What are you most proud of?" },
  { day: 30, label: "Day 30 — Transformation", prompt: "Compare how you feel now to Day 1. What would you tell someone just starting?" },
  { day: 60, label: "Day 60 — Deep Change", prompt: "What habits have become automatic? How has your confidence changed?" },
  { day: 90, label: "Day 90 — Mastery", prompt: "Reflect on your full journey. What has this program meant to you?" },
];

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [mood, setMood] = useState(5);

  useEffect(() => {
    const day = Number(localStorage.getItem("day") || "1");
    setCurrentDay(day);

    const saved = localStorage.getItem("journalEntries");
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch { /* ignore */ }
    }
  }, []);

  function saveEntry(milestoneDay: number, milestoneLabel: string) {
    const entry: JournalEntry = {
      day: milestoneDay,
      date: new Date().toISOString(),
      text,
      mood,
      milestone: milestoneLabel,
    };

    const updated = [...entries.filter((e) => e.day !== milestoneDay), entry].sort(
      (a, b) => a.day - b.day
    );

    setEntries(updated);
    localStorage.setItem("journalEntries", JSON.stringify(updated));
    setEditingDay(null);
    setText("");
    setMood(5);

    // Sync journal to server
    pushSingle("journal");
  }

  function getEntry(day: number): JournalEntry | undefined {
    return entries.find((e) => e.day === day);
  }

  const moods = ["😔", "😐", "🙂", "😊", "🤩"];

  return (
    <main className="max-w-4xl mx-auto px-6 py-14">
      {/* HERO */}
      <section className="soft-card p-10 mb-8">
        <p className="uppercase tracking-[0.25em] text-xs text-[#b98fa1] mb-4 font-bold">
          Personal Reflection
        </p>
        <h1 className="text-5xl mb-4 text-[#4a3f44]">Your Journey Journal</h1>
        <p className="text-[#7b6870] text-lg">
          Track how you feel at key milestones. Look back and see how far
          you&apos;ve come.
        </p>
      </section>

      {/* BEFORE/AFTER COMPARISON */}
      {entries.length >= 2 && (
        <section className="soft-card p-8 mb-8">
          <h2 className="text-2xl text-[#4a3f44] mb-6">Your Transformation</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#fdf2f5] border border-[#f0e3e8]">
              <p className="text-[10px] uppercase tracking-widest text-[#b98fa1] font-bold mb-2">
                {entries[0].milestone}
              </p>
              <p className="text-sm text-[#6f5a62] italic leading-relaxed">
                &ldquo;{entries[0].text}&rdquo;
              </p>
              <p className="text-xs text-[#b98fa1] mt-3">
                Mood: {moods[Math.min(Math.floor(entries[0].mood / 2.5), 4)]}
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border-2 border-[#d8a7b5]">
              <p className="text-[10px] uppercase tracking-widest text-[#d8a7b5] font-bold mb-2">
                {entries[entries.length - 1].milestone}
              </p>
              <p className="text-sm text-[#4a3f44] italic leading-relaxed">
                &ldquo;{entries[entries.length - 1].text}&rdquo;
              </p>
              <p className="text-xs text-[#b98fa1] mt-3">
                Mood: {moods[Math.min(Math.floor(entries[entries.length - 1].mood / 2.5), 4)]}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* MILESTONE ENTRIES */}
      <section className="space-y-4">
        {MILESTONES.map((m) => {
          const entry = getEntry(m.day);
          const isUnlocked = currentDay >= m.day;
          const isEditing = editingDay === m.day;

          return (
            <div
              key={m.day}
              className={`soft-card p-6 transition-all ${
                !isUnlocked ? "opacity-40" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl text-[#4a3f44]">{m.label}</h3>
                {entry && !isEditing && (
                  <span className="text-[10px] px-3 py-1 rounded-full bg-green-50 text-green-600 font-bold uppercase tracking-widest border border-green-100">
                    ✓ Written
                  </span>
                )}
                {!isUnlocked && (
                  <span className="text-[10px] px-3 py-1 rounded-full bg-gray-50 text-gray-400 font-bold uppercase tracking-widest">
                    🔒 Day {m.day}
                  </span>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <p className="text-sm text-[#b98fa1] italic">{m.prompt}</p>

                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write freely... This stays private on your device."
                    rows={4}
                    className="w-full p-4 rounded-2xl border border-[#ead8de] outline-none focus:border-[#d6a7b1] resize-none"
                  />

                  <div>
                    <p className="text-sm text-[#7b6870] mb-2">
                      How do you feel? ({mood}/10)
                    </p>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={mood}
                      onChange={(e) => setMood(Number(e.target.value))}
                      className="w-full accent-[#d8a7b5]"
                    />
                    <div className="flex justify-between text-lg mt-1">
                      {moods.map((m, i) => (
                        <span key={i} className="opacity-60">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => saveEntry(m.day, m.label)}
                      disabled={!text.trim()}
                      className="btn-primary text-sm disabled:opacity-40"
                    >
                      Save Entry
                    </button>
                    <button
                      onClick={() => setEditingDay(null)}
                      className="btn-outline text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : entry ? (
                <div>
                  <p className="text-sm text-[#6f5a62] italic leading-relaxed mb-2">
                    &ldquo;{entry.text}&rdquo;
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#b98fa1]">
                      {new Date(entry.date).toLocaleDateString()} • Mood:{" "}
                      {moods[Math.min(Math.floor(entry.mood / 2.5), 4)]}
                    </span>
                    <button
                      onClick={() => {
                        setText(entry.text);
                        setMood(entry.mood);
                        setEditingDay(m.day);
                      }}
                      className="text-xs text-[#b98fa1] hover:text-[#8f5d6f]"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ) : isUnlocked ? (
                <div>
                  <p className="text-sm text-[#7b6870] italic mb-3">{m.prompt}</p>
                  <button
                    onClick={() => setEditingDay(m.day)}
                    className="btn-outline text-sm"
                  >
                    Write Entry
                  </button>
                </div>
              ) : (
                <p className="text-sm text-[#7b6870]">
                  Unlocks when you reach Day {m.day}.
                </p>
              )}
            </div>
          );
        })}
      </section>

      {/* NAV */}
      <section className="flex flex-wrap gap-4 justify-center mt-8">
        <Link href="/progress" className="btn-outline">
          Progress
        </Link>
        <Link href="/dashboard" className="btn-primary">
          Dashboard
        </Link>
      </section>
    </main>
  );
}

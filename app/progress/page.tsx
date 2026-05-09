"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ShareButton from "@/components/ShareButton";
import ProgressShareCard from "@/components/ProgressShareCard";
import {
  getUnlockedAchievements,
  getNextAchievements,
  loadAchievementStats,
  type Achievement,
} from "@/lib/achievements";

type CheckinEntry = {
  sleep: number;
  energy: number;
  stress: number;
  symptoms: string[];
  date: string;
  completedSession?: boolean;
};

type Stats = {
  totalDays: number;
  currentStreak: number;
  avgSleep: number;
  avgEnergy: number;
  avgStress: number;
  topSymptoms: { name: string; count: number }[];
  sleepTrend: "improving" | "declining" | "stable";
  energyTrend: "improving" | "declining" | "stable";
};

function BarChart({
  data,
  label,
  color,
  max = 10,
}: {
  data: { value: number; date: string }[];
  label: string;
  color: string;
  max?: number;
}) {
  if (data.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-sm text-[#b98fa1] italic">
        No data yet — complete a daily check-in to see your {label.toLowerCase()} chart.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-[#4a3f44] uppercase tracking-widest">
          {label}
        </h4>
        <span className="text-xs text-[#b98fa1]">Last {data.length} days</span>
      </div>
      <div className="flex items-end gap-1 h-32">
        {data.map((d, i) => {
          const height = Math.max((d.value / max) * 100, 4); // min 4% za vidljivost
          return (
            <div key={`${d.date}-${i}`} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[9px] text-[#7b6870]">{d.value}</span>
              <div
                className="w-full rounded-t-lg transition-all duration-500"
                style={{
                  height: `${height}%`,
                  backgroundColor: color,
                  opacity: 0.4 + (i / data.length) * 0.6,
                }}
              />
              <span className="text-[8px] text-[#b98fa1]">
                {formatDay(d.date)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Formatira datum u kratki dan (Mon, Tue...) bez timezone problema */
function formatDay(dateStr: string): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const d = new Date(dateStr);
  return days[d.getDay()];
}

function TrendBadge({ trend }: { trend: "improving" | "declining" | "stable" }) {
  const config = {
    improving: { text: "Improving ↑", cls: "bg-green-50 text-green-600 border-green-100" },
    declining: { text: "Needs attention ↓", cls: "bg-amber-50 text-amber-600 border-amber-100" },
    stable: { text: "Stable →", cls: "bg-blue-50 text-blue-600 border-blue-100" },
  };
  const c = config[trend];
  return (
    <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest border ${c.cls}`}>
      {c.text}
    </span>
  );
}

function calculateStats(entries: CheckinEntry[]): Stats {
  // Filtriraj samo entries sa pravim check-in podacima (ne auto-save iz sesije)
  const valid = entries.filter((e) => e.sleep > 0 && e.energy > 0 && e.stress > 0);

  const sorted = [...valid].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const totalDays = sorted.length;

  // Current streak
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = sorted.length - 1; i >= 0; i--) {
    const d = new Date(sorted[i].date);
    d.setHours(0, 0, 0, 0);
    const diffDays = Math.round((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= currentStreak + 1) {
      currentStreak++;
    } else {
      break;
    }
  }

  const avgSleep = totalDays > 0
    ? Number((sorted.reduce((s, e) => s + e.sleep, 0) / totalDays).toFixed(1))
    : 0;
  const avgEnergy = totalDays > 0
    ? Number((sorted.reduce((s, e) => s + e.energy, 0) / totalDays).toFixed(1))
    : 0;
  const avgStress = totalDays > 0
    ? Number((sorted.reduce((s, e) => s + e.stress, 0) / totalDays).toFixed(1))
    : 0;

  // Top symptoms
  const symptomCount: Record<string, number> = {};
  for (const e of sorted) {
    for (const s of e.symptoms || []) {
      symptomCount[s] = (symptomCount[s] || 0) + 1;
    }
  }
  const topSymptoms = Object.entries(symptomCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  function getTrend(values: number[]): "improving" | "declining" | "stable" {
    if (values.length < 4) return "stable";
    const mid = Math.floor(values.length / 2);
    const firstHalf = values.slice(0, mid).reduce((s, v) => s + v, 0) / mid;
    const secondHalf = values.slice(mid).reduce((s, v) => s + v, 0) / (values.length - mid);
    const diff = secondHalf - firstHalf;
    if (diff > 0.5) return "improving";
    if (diff < -0.5) return "declining";
    return "stable";
  }

  return {
    totalDays,
    currentStreak,
    avgSleep,
    avgEnergy,
    avgStress,
    topSymptoms,
    sleepTrend: getTrend(sorted.map((e) => e.sleep)),
    energyTrend: getTrend(sorted.map((e) => e.energy)),
  };
}

/** Deduplikacija po datumu — zadržava poslednji entry za svaki dan */
function deduplicateByDate(entries: CheckinEntry[]): CheckinEntry[] {
  const map = new Map<string, CheckinEntry>();
  for (const e of entries) {
    const key = e.date.split("T")[0];
    // Preferiraj entries sa pravim podacima (sleep > 0) nad auto-save
    const existing = map.get(key);
    if (!existing || (e.sleep > 0 && existing.sleep === 0)) {
      map.set(key, e);
    }
  }
  return [...map.values()];
}

/** Generiše stabilne demo podatke ograničene na current day korisnika */
function generateDemoData(currentDay: number): CheckinEntry[] {
  const entries: CheckinEntry[] = [];
  const now = new Date();
  // Demo podaci samo za onoliko dana koliko je korisnik aktivan, max 7
  const demoCount = Math.min(Math.max(currentDay, 1), 7);
  for (let i = demoCount - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const seed = d.getDate() + d.getMonth() * 31;
    entries.push({
      sleep: 5 + (seed % 4),
      energy: 4 + ((seed * 3) % 4),
      stress: 3 + ((seed * 7) % 4),
      symptoms: i % 2 === 0 ? ["Low energy", "Poor sleep"] : ["Joint pain"],
      date: d.toISOString(),
    });
  }
  return entries;
}

export default function ProgressPage() {
  const [entries, setEntries] = useState<CheckinEntry[]>([]);
  const [day, setDay] = useState(1);
  const [unlocked, setUnlocked] = useState<Achievement[]>([]);
  const [nextUp, setNextUp] = useState<Achievement[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const history: CheckinEntry[] = [];

    // Učitaj trenutni check-in
    const current = localStorage.getItem("dailyCheckin");
    if (current) {
      try { history.push(JSON.parse(current)); } catch { /* ignore */ }
    }

    // Učitaj istoriju
    const historyRaw = localStorage.getItem("checkinHistory");
    if (historyRaw) {
      try {
        const parsed = JSON.parse(historyRaw);
        if (Array.isArray(parsed)) history.push(...parsed);
      } catch { /* ignore */ }
    }

    // Deduplikacija — ukloni duplikate istog dana
    let cleaned = deduplicateByDate(history);

    const savedDay = Number(localStorage.getItem("day") || "1");

    // Ako nema dovoljno pravih podataka, koristi demo ograničen na current day
    const realEntries = cleaned.filter((e) => e.sleep > 0);
    if (realEntries.length < 3) {
      cleaned = generateDemoData(savedDay);
    }

    setEntries(cleaned);
    setDay(savedDay);

    const achStats = loadAchievementStats();
    setUnlocked(getUnlockedAchievements(achStats));
    setNextUp(getNextAchievements(achStats));
    setLoaded(true);
  }, []);

  // Ne renderuj ništa dok se podaci ne učitaju (sprečava hydration mismatch)
  if (!loaded) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-14">
        <div className="soft-card p-10 text-center">
          <div className="animate-pulse text-[#b98fa1]">Loading progress...</div>
        </div>
      </main>
    );
  }

  const stats = calculateStats(entries);

  // Filtriraj samo entries sa pravim podacima za grafove
  const validEntries = entries
    .filter((e) => e.sleep > 0 && e.energy > 0 && e.stress > 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const sleepData = validEntries.map((e) => ({ value: e.sleep, date: e.date }));
  const energyData = validEntries.map((e) => ({ value: e.energy, date: e.date }));
  const stressData = validEntries.map((e) => ({ value: e.stress, date: e.date }));

  return (
    <main className="max-w-6xl mx-auto px-6 py-14">
      {/* HERO */}
      <section className="soft-card p-10 mb-8">
        <p className="uppercase tracking-[0.25em] text-xs text-[#b98fa1] mb-4 font-bold">
          Your Journey
        </p>
        <h1 className="text-5xl mb-4 text-[#4a3f44]">Progress Tracker</h1>
        <p className="text-[#7b6870] text-lg">
          See how your body is responding to the program over time.
        </p>
      </section>

      {/* STATS GRID */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="soft-card p-6 text-center">
          <div className="text-[9px] uppercase tracking-widest text-[#d8a7b5] mb-2 font-bold">
            Current Day
          </div>
          <div className="text-4xl font-light text-[#4a3f44]">{day}</div>
        </div>
        <div className="soft-card p-6 text-center">
          <div className="text-[9px] uppercase tracking-widest text-[#d8a7b5] mb-2 font-bold">
            Check-Ins
          </div>
          <div className="text-4xl font-light text-[#4a3f44]">{stats.totalDays}</div>
        </div>
        <div className="soft-card p-6 text-center">
          <div className="text-[9px] uppercase tracking-widest text-[#d8a7b5] mb-2 font-bold">
            Streak
          </div>
          <div className="text-4xl font-light text-[#4a3f44]">{stats.currentStreak} 🔥</div>
        </div>
        <div className="soft-card p-6 text-center">
          <div className="text-[9px] uppercase tracking-widest text-[#d8a7b5] mb-2 font-bold">
            Avg Sleep
          </div>
          <div className="text-4xl font-light text-[#4a3f44]">{stats.avgSleep}</div>
        </div>
      </section>

      {/* CHARTS */}
      <section className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="soft-card p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl text-[#4a3f44]">Sleep Quality</h3>
            <TrendBadge trend={stats.sleepTrend} />
          </div>
          <BarChart data={sleepData} label="Sleep" color="#7c6fbd" />
        </div>

        <div className="soft-card p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl text-[#4a3f44]">Energy Level</h3>
            <TrendBadge trend={stats.energyTrend} />
          </div>
          <BarChart data={energyData} label="Energy" color="#d8a7b5" />
        </div>
      </section>

      <section className="soft-card p-8 mb-8">
        <h3 className="text-2xl text-[#4a3f44] mb-4">Stress Level</h3>
        <BarChart data={stressData} label="Stress" color="#e8a87c" />
        <p className="text-xs text-[#7b6870] mt-4 italic">
          Lower stress scores are better. Your program includes breathing exercises to help.
        </p>
      </section>

      {/* TOP SYMPTOMS */}
      {stats.topSymptoms.length > 0 && (
        <section className="soft-card p-8 mb-8">
          <h3 className="text-2xl text-[#4a3f44] mb-6">Most Reported Symptoms</h3>
          <div className="space-y-3">
            {stats.topSymptoms.map((s) => {
              const pct = stats.totalDays > 0 ? (s.count / stats.totalDays) * 100 : 0;
              return (
                <div key={s.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#4a3f44] font-medium">{s.name}</span>
                    <span className="text-[#b98fa1]">
                      {s.count} of {stats.totalDays} days ({Math.round(pct)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-[#fdf2f5] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#d8a7b5] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* AVERAGES */}
      <section className="soft-card p-8 mb-8">
        <h3 className="text-2xl text-[#4a3f44] mb-6">Your Averages</h3>
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: "Sleep", value: stats.avgSleep, icon: "😴", good: stats.avgSleep >= 7 },
            { label: "Energy", value: stats.avgEnergy, icon: "⚡", good: stats.avgEnergy >= 6 },
            { label: "Stress", value: stats.avgStress, icon: "🧘", good: stats.avgStress <= 5 },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-3xl font-light text-[#4a3f44]">
                {item.value}<span className="text-sm">/10</span>
              </div>
              <div className="text-xs text-[#7b6870] mt-1">{item.label}</div>
              <div
                className={`text-[10px] mt-2 px-2 py-0.5 rounded-full inline-block font-bold ${
                  item.good
                    ? "bg-green-50 text-green-600"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                {item.good ? "On Track" : "Room to Grow"}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="soft-card p-8 mb-8">
        <h3 className="text-2xl text-[#4a3f44] mb-6">Achievements</h3>

        {unlocked.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-bold uppercase text-[#b98fa1] tracking-widest mb-3">
              Unlocked ({unlocked.length})
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {unlocked.map((a) => (
                <div
                  key={a.id}
                  className="p-4 rounded-2xl bg-[#fdf2f5] border border-[#f0e3e8] text-center"
                >
                  <div className="text-3xl mb-2">{a.icon}</div>
                  <div className="text-sm font-medium text-[#4a3f44]">{a.title}</div>
                  <div className="text-[10px] text-[#b98fa1]">{a.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {nextUp.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase text-[#7b6870] tracking-widest mb-3">
              Next Up
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {nextUp.map((a) => (
                <div
                  key={a.id}
                  className="p-4 rounded-2xl bg-white/40 border border-dashed border-[#f0e3e8] text-center opacity-60"
                >
                  <div className="text-2xl mb-2 grayscale">{a.icon}</div>
                  <div className="text-sm text-[#7b6870]">{a.title}</div>
                  <div className="text-[10px] text-[#b98fa1]">{a.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="flex flex-wrap gap-4 justify-center">
        <Link href="/checkin" className="btn-primary">
          Today&apos;s Check-In
        </Link>
        <Link href="/dashboard" className="btn-outline">
          Dashboard
        </Link>
        <Link href="/session" className="btn-outline">
          Start Session
        </Link>
        <ShareButton text={`Day ${day} of my wellness journey! Streak: ${stats.currentStreak} 🔥 #VeronicaMethod`} />
        <ProgressShareCard
          day={day}
          streak={stats.currentStreak}
          sessionsCompleted={stats.totalDays}
          avgSleep={stats.avgSleep}
          avgEnergy={stats.avgEnergy}
          name={(() => { try { return JSON.parse(localStorage.getItem("quizData") || "{}").name; } catch { return ""; } })()}
        />
      </section>
    </main>
  );
}

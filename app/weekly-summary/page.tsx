"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ShareButton from "@/components/ShareButton";

type WeekData = {
  sessionsCompleted: number;
  checkins: number;
  avgSleep: number;
  avgEnergy: number;
  avgStress: number;
  topSymptom: string;
  daysActive: number;
  streakKept: boolean;
};

export default function WeeklySummaryPage() {
  const [data, setData] = useState<WeekData>({
    sessionsCompleted: 0, checkins: 0, avgSleep: 0,
    avgEnergy: 0, avgStress: 0, topSymptom: "", daysActive: 0, streakKept: true,
  });
  const [week, setWeek] = useState(1);

  useEffect(() => {
    const day = Number(localStorage.getItem("day") || "1");
    setWeek(Math.ceil(day / 7));

    try {
      const history = JSON.parse(localStorage.getItem("checkinHistory") || "[]");
      const now = new Date();
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const thisWeek = history.filter(
        (e: { date: string }) => new Date(e.date) >= weekAgo
      );

      const sessions = thisWeek.filter((e: { completedSession?: boolean }) => e.completedSession).length;
      const sleepVals = thisWeek.filter((e: { sleep: number }) => e.sleep > 0).map((e: { sleep: number }) => e.sleep);
      const energyVals = thisWeek.filter((e: { energy: number }) => e.energy > 0).map((e: { energy: number }) => e.energy);
      const stressVals = thisWeek.filter((e: { stress: number }) => e.stress > 0).map((e: { stress: number }) => e.stress);

      const symptomCount: Record<string, number> = {};
      for (const e of thisWeek) {
        for (const s of (e as { symptoms?: string[] }).symptoms || []) {
          symptomCount[s] = (symptomCount[s] || 0) + 1;
        }
      }
      const topSymptom = Object.entries(symptomCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "None reported";

      const uniqueDays = new Set(thisWeek.map((e: { date: string }) => e.date.split("T")[0])).size;

      setData({
        sessionsCompleted: sessions,
        checkins: thisWeek.length,
        avgSleep: sleepVals.length ? Number((sleepVals.reduce((a: number, b: number) => a + b, 0) / sleepVals.length).toFixed(1)) : 0,
        avgEnergy: energyVals.length ? Number((energyVals.reduce((a: number, b: number) => a + b, 0) / energyVals.length).toFixed(1)) : 0,
        avgStress: stressVals.length ? Number((stressVals.reduce((a: number, b: number) => a + b, 0) / stressVals.length).toFixed(1)) : 0,
        topSymptom,
        daysActive: uniqueDays,
        streakKept: uniqueDays >= 5,
      });
    } catch { /* ignore */ }
  }, []);

  const grade = data.daysActive >= 6 ? "A+" : data.daysActive >= 5 ? "A" : data.daysActive >= 4 ? "B" : data.daysActive >= 3 ? "C" : "Keep Going";

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <section className="soft-card p-8 text-center mb-6">
        <p className="uppercase tracking-[0.25em] text-xs text-[#b98fa1] mb-3 font-bold">
          Week {week} Summary
        </p>
        <h1 className="text-4xl mb-2 text-[#4a3f44]">Your Week in Review</h1>
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#f8d8df] to-[#d5a6b1] flex items-center justify-center mx-auto mt-4 text-white text-3xl font-bold">
          {grade}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 mb-6">
        {[
          { label: "Days Active", value: `${data.daysActive}/7`, icon: "📅" },
          { label: "Sessions", value: data.sessionsCompleted, icon: "🧘‍♀️" },
          { label: "Check-Ins", value: data.checkins, icon: "📝" },
          { label: "Streak", value: data.streakKept ? "Kept ✓" : "Broken", icon: "🔥" },
        ].map((s) => (
          <div key={s.label} className="soft-card p-4 text-center">
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="text-xl font-light text-[#4a3f44]">{s.value}</div>
            <div className="text-[9px] uppercase tracking-widest text-[#b98fa1] font-bold">{s.label}</div>
          </div>
        ))}
      </section>

      <section className="soft-card p-6 mb-6">
        <h2 className="text-xl text-[#4a3f44] mb-4">Averages This Week</h2>
        <div className="space-y-4">
          {[
            { label: "Sleep Quality", value: data.avgSleep, color: "#7c6fbd" },
            { label: "Energy Level", value: data.avgEnergy, color: "#d8a7b5" },
            { label: "Stress Level", value: data.avgStress, color: "#e8a87c" },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#4a3f44]">{item.label}</span>
                <span className="text-[#b98fa1] font-medium">{item.value}/10</span>
              </div>
              <div className="h-2 bg-[#f0e3e8] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(item.value / 10) * 100}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="soft-card p-6 mb-6">
        <h2 className="text-xl text-[#4a3f44] mb-2">Top Symptom</h2>
        <p className="text-[#7b6870]">{data.topSymptom}</p>
        <p className="text-xs text-[#b98fa1] mt-2">
          Your program automatically adjusts exercises to target this.
        </p>
      </section>

      <section className="soft-card p-6 text-center mb-6">
        <h2 className="text-xl text-[#4a3f44] mb-2">
          {data.daysActive >= 5 ? "Amazing Week! 🌟" : data.daysActive >= 3 ? "Good Progress! 💪" : "Let's Do Better Next Week 🌱"}
        </h2>
        <p className="text-sm text-[#7b6870]">
          {data.daysActive >= 5
            ? "You showed up consistently. Your body is thanking you."
            : "Every session counts. Try to fit in one more day next week."}
        </p>
      </section>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/dashboard" className="btn-primary">Dashboard</Link>
        <Link href="/progress" className="btn-outline">Full Progress</Link>
        <Link href="/journal" className="btn-outline">Journal</Link>
        <ShareButton text={`Week ${week} done! ${data.sessionsCompleted} sessions completed 🧘‍♀️ #VeronicaMethod`} />
      </div>
    </main>
  );
}

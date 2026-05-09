"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Measurement = {
  date: string;
  weight?: number;
  waist?: number;
  hips?: number;
  energy: number;
  sleep: number;
  confidence: number;
  notes?: string;
};

export default function MeasurementsPage() {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Measurement>>({
    energy: 5,
    sleep: 5,
    confidence: 5,
  });

  useEffect(() => {
    const saved = localStorage.getItem("measurements");
    if (saved) {
      try { setMeasurements(JSON.parse(saved)); } catch {}
    }
  }, []);

  function saveMeasurement() {
    const entry: Measurement = {
      date: new Date().toISOString(),
      weight: form.weight,
      waist: form.waist,
      hips: form.hips,
      energy: form.energy || 5,
      sleep: form.sleep || 5,
      confidence: form.confidence || 5,
      notes: form.notes,
    };

    const updated = [...measurements, entry];
    setMeasurements(updated);
    localStorage.setItem("measurements", JSON.stringify(updated));
    setShowForm(false);
    setForm({ energy: 5, sleep: 5, confidence: 5 });
  }

  const first = measurements[0];
  const latest = measurements[measurements.length - 1];
  const hasComparison = measurements.length >= 2;

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <section className="soft-card p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="uppercase tracking-[0.2em] text-[10px] text-[#a8687a] font-bold mb-1">Track Changes</p>
            <h1 className="text-3xl text-[#2a1a22]">My Measurements</h1>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary px-4 py-2 text-xs">
            {showForm ? "Cancel" : "+ New Entry"}
          </button>
        </div>
      </section>

      {/* Form */}
      {showForm && (
        <section className="soft-card p-6 mb-6">
          <h2 className="text-lg text-[#2a1a22] mb-4">Record Today</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label className="text-[9px] uppercase tracking-widest text-[#7d5565] font-bold">Weight (kg)</label>
              <input
                type="number"
                value={form.weight || ""}
                onChange={(e) => setForm({ ...form, weight: Number(e.target.value) || undefined })}
                className="w-full mt-1 p-2 rounded-xl border border-[#f0e3e8] text-sm outline-none focus:border-[#a8687a]"
                placeholder="72"
              />
            </div>
            <div>
              <label className="text-[9px] uppercase tracking-widest text-[#7d5565] font-bold">Waist (cm)</label>
              <input
                type="number"
                value={form.waist || ""}
                onChange={(e) => setForm({ ...form, waist: Number(e.target.value) || undefined })}
                className="w-full mt-1 p-2 rounded-xl border border-[#f0e3e8] text-sm outline-none focus:border-[#a8687a]"
                placeholder="82"
              />
            </div>
            <div>
              <label className="text-[9px] uppercase tracking-widest text-[#7d5565] font-bold">Hips (cm)</label>
              <input
                type="number"
                value={form.hips || ""}
                onChange={(e) => setForm({ ...form, hips: Number(e.target.value) || undefined })}
                className="w-full mt-1 p-2 rounded-xl border border-[#f0e3e8] text-sm outline-none focus:border-[#a8687a]"
                placeholder="98"
              />
            </div>
          </div>

          <div className="space-y-3 mb-4">
            {[
              { label: "Energy", key: "energy" as const },
              { label: "Sleep Quality", key: "sleep" as const },
              { label: "Body Confidence", key: "confidence" as const },
            ].map((item) => (
              <div key={item.key}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#5a4550]">{item.label}</span>
                  <span className="text-[#a8687a] font-medium">{form[item.key] || 5}/10</span>
                </div>
                <input
                  type="range" min="1" max="10"
                  value={form[item.key] || 5}
                  onChange={(e) => setForm({ ...form, [item.key]: Number(e.target.value) })}
                  className="w-full accent-[#a8687a]"
                />
              </div>
            ))}
          </div>

          <textarea
            value={form.notes || ""}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Notes (optional) — how do you feel compared to last time?"
            className="w-full p-3 rounded-xl border border-[#f0e3e8] text-xs outline-none focus:border-[#a8687a] resize-none mb-4"
            rows={2}
          />

          <button onClick={saveMeasurement} className="btn-primary w-full py-3">
            Save Measurement
          </button>
        </section>
      )}

      {/* Before/After Comparison */}
      {hasComparison && (
        <section className="soft-card p-6 mb-6">
          <h2 className="text-lg text-[#2a1a22] mb-4">Your Transformation</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#fdf2f5] border border-[#f0e3e8] text-center">
              <p className="text-[9px] uppercase tracking-widest text-[#7d5565] font-bold mb-2">Day 1</p>
              {first.weight && <p className="text-lg text-[#2a1a22]">{first.weight} kg</p>}
              {first.waist && <p className="text-xs text-[#5a4550]">Waist: {first.waist} cm</p>}
              <p className="text-xs text-[#7d5565] mt-1">Confidence: {first.confidence}/10</p>
            </div>
            <div className="p-4 rounded-xl bg-white border-2 border-[#a8687a] text-center">
              <p className="text-[9px] uppercase tracking-widest text-[#a8687a] font-bold mb-2">Latest</p>
              {latest.weight && <p className="text-lg text-[#2a1a22]">{latest.weight} kg</p>}
              {latest.waist && <p className="text-xs text-[#5a4550]">Waist: {latest.waist} cm</p>}
              <p className="text-xs text-[#7d5565] mt-1">Confidence: {latest.confidence}/10</p>
            </div>
          </div>

          {/* Changes */}
          {first.weight && latest.weight && (
            <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-200 text-center">
              <p className="text-sm text-green-700 font-medium">
                {latest.weight < first.weight
                  ? `↓ ${(first.weight - latest.weight).toFixed(1)} kg lost`
                  : latest.weight > first.weight
                    ? `↑ ${(latest.weight - first.weight).toFixed(1)} kg gained`
                    : "Weight maintained"}
                {latest.confidence > first.confidence && ` • Confidence +${latest.confidence - first.confidence}`}
              </p>
            </div>
          )}
        </section>
      )}

      {/* History */}
      {measurements.length > 0 && (
        <section className="soft-card p-6 mb-6">
          <h2 className="text-lg text-[#2a1a22] mb-4">History ({measurements.length} entries)</h2>
          <div className="space-y-2">
            {[...measurements].reverse().map((m, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-[#f0e3e8]">
                <div>
                  <p className="text-xs font-medium text-[#2a1a22]">
                    {new Date(m.date).toLocaleDateString("en", { month: "short", day: "numeric" })}
                  </p>
                  <p className="text-[9px] text-[#7d5565]">
                    {m.weight && `${m.weight}kg`} {m.waist && `• W:${m.waist}cm`} {m.hips && `• H:${m.hips}cm`}
                  </p>
                </div>
                <div className="flex gap-2 text-[9px]">
                  <span title="Energy">⚡{m.energy}</span>
                  <span title="Sleep">😴{m.sleep}</span>
                  <span title="Confidence">💪{m.confidence}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {measurements.length === 0 && !showForm && (
        <section className="soft-card p-8 text-center">
          <div className="text-4xl mb-3">📏</div>
          <h2 className="text-xl text-[#2a1a22] mb-2">Start Tracking</h2>
          <p className="text-xs text-[#5a4550] mb-4">
            Record your measurements at key milestones (Day 1, 7, 14, 30) to see your transformation over time.
          </p>
          <button onClick={() => setShowForm(true)} className="btn-primary px-6 py-2">
            Record Day 1 Measurements
          </button>
        </section>
      )}

      <div className="flex gap-3 justify-center mt-6">
        <Link href="/progress" className="btn-outline px-5 py-2">Progress</Link>
        <Link href="/dashboard" className="btn-primary px-5 py-2">Dashboard</Link>
      </div>
    </main>
  );
}

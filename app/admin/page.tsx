"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type Profile = {
  id: string;
  email: string;
  plan: string;
  premium: boolean;
  current_day: number;
  purchase_date: string | null;
  expiry_date: string | null;
  created_at: string;
};

type Stats = {
  total: number;
  free: number;
  glow: number;
  elite: number;
  active: number;
  expired: number;
  revenueEstimate: number;
};

type Funnel = {
  signups: number;
  quizCompleted: number;
  firstCheckin: number;
  firstSession: number;
  converted: number;
  quizRate: number;
  activationRate: number;
  conversionRate: number;
};

type Engagement = {
  dau: number;
  wau: number;
  mau: number;
  stickiness: number;
  sessions7d: number;
  sessions30d: number;
  avgSessionMin7d: number;
  avgSessionMin30d: number;
  journalEntries: number;
  journalUsers: number;
};

type RetentionPoint = { total: number; retained: number; rate: number };

type TopUser = {
  email: string;
  plan: string;
  day: number;
  sessions: number;
  premium: boolean;
};

type AdminData = {
  profiles: Profile[];
  stats: Stats;
  funnel: Funnel;
  engagement: Engagement;
  retention: Record<string, RetentionPoint>;
  signupTrend: { date: string; count: number }[];
  wellnessTrend: { avgSleep: number; avgEnergy: number; avgStress: number; sampleSize: number };
  topUsers: TopUser[];
  phaseDistribution: { foundation: number; build: number; strengthen: number; master: number };
};

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",").filter(Boolean);

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminKey, setAdminKey] = useState("");
  const [keyEntered, setKeyEntered] = useState(false);
  const [tab, setTab] = useState<"overview" | "funnel" | "engagement" | "retention" | "users">("overview");

  const [data, setData] = useState<AdminData | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u);
      if (u && ADMIN_EMAILS.includes(u.email || "")) {
        setAuthorized(true);
        setKeyEntered(true);
        fetchData();
      }
      setLoading(false);
    });
  }, []);

  function handleKeySubmit() {
    const validKey = process.env.NEXT_PUBLIC_ADMIN_KEY || "";
    if (adminKey === validKey && validKey.length > 0) {
      setKeyEntered(true);
      setAuthorized(true);
      fetchData();
    } else {
      alert("Invalid admin key.");
    }
  }

  async function fetchData() {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        setData(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    }
  }

  if (loading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-[#b98fa1]">Loading...</div>
      </main>
    );
  }

  if (!authorized && !keyEntered) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="soft-card p-10 max-w-md w-full text-center">
          <h1 className="text-3xl mb-4 text-[#4a3f44]">Admin Access</h1>
          <p className="text-[#7b6870] mb-6 text-sm">Enter admin key to continue.</p>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleKeySubmit()}
            placeholder="Admin key"
            className="w-full p-4 rounded-2xl border border-[#ead8de] outline-none focus:border-[#d6a7b1] mb-4"
          />
          <button onClick={handleKeySubmit} className="btn-primary w-full py-3">Enter</button>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-[#b98fa1]">Loading analytics...</div>
      </main>
    );
  }

  const { stats, funnel, engagement, retention, signupTrend, wellnessTrend, topUsers, phaseDistribution, profiles } = data;

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "funnel" as const, label: "Funnel" },
    { id: "engagement" as const, label: "Engagement" },
    { id: "retention" as const, label: "Retention" },
    { id: "users" as const, label: "Users" },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      {/* HEADER */}
      <section className="soft-card p-8 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="uppercase tracking-[0.25em] text-xs text-[#b98fa1] mb-2 font-bold">Admin Panel</p>
            <h1 className="text-4xl text-[#4a3f44]">Business Analytics</h1>
          </div>
          <button onClick={fetchData} className="btn-outline text-xs px-4 py-2">↻ Refresh</button>
        </div>
      </section>

      {/* TABS */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              tab === t.id
                ? "bg-[#d8a7b5] text-white shadow-md"
                : "bg-white/60 text-[#7b6870] border border-[#f0e3e8] hover:border-[#d8a7b5]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ============ OVERVIEW TAB ============ */}
      {tab === "overview" && (
        <>
          {/* KPI Cards */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <KPI label="Total Users" value={stats.total} />
            <KPI label="Active Premium" value={stats.active} color="text-green-600" />
            <KPI label="Revenue" value={`€${stats.revenueEstimate}`} />
            <KPI label="Conversion" value={`${funnel.conversionRate}%`} color="text-[#d8a7b5]" />
          </section>

          {/* Plan breakdown */}
          <section className="grid md:grid-cols-4 gap-3 mb-6">
            <KPI label="Free" value={stats.free} sub="users" />
            <KPI label="Glow (€29)" value={stats.glow} sub="users" color="text-rose-500" />
            <KPI label="Elite (€79)" value={stats.elite} sub="users" color="text-purple-600" />
            <KPI label="Expired" value={stats.expired} sub="users" color="text-amber-500" />
          </section>

          {/* Signup trend chart */}
          <section className="soft-card p-6 mb-6">
            <h2 className="text-xl text-[#4a3f44] mb-4">Signups — Last 30 Days</h2>
            <MiniBarChart data={signupTrend.map((d) => d.count)} labels={signupTrend.map((d) => d.date.slice(5))} color="#d8a7b5" />
            <p className="text-xs text-[#b98fa1] mt-3">
              Total: {signupTrend.reduce((s, d) => s + d.count, 0)} signups in 30 days
            </p>
          </section>

          {/* Phase distribution */}
          <section className="soft-card p-6 mb-6">
            <h2 className="text-xl text-[#4a3f44] mb-4">Program Phase Distribution</h2>
            <div className="grid grid-cols-4 gap-3">
              {(["foundation", "build", "strengthen", "master"] as const).map((phase) => {
                const count = phaseDistribution[phase];
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                const colors = {
                  foundation: "bg-blue-100 text-blue-700",
                  build: "bg-amber-100 text-amber-700",
                  strengthen: "bg-rose-100 text-rose-700",
                  master: "bg-purple-100 text-purple-700",
                };
                return (
                  <div key={phase} className="text-center">
                    <div className={`text-2xl font-light mb-1 ${colors[phase].split(" ")[1]}`}>{count}</div>
                    <div className={`text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded-full ${colors[phase]}`}>
                      {phase}
                    </div>
                    <div className="text-[10px] text-[#b98fa1] mt-1">{pct}%</div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Wellness averages */}
          <section className="soft-card p-6">
            <h2 className="text-xl text-[#4a3f44] mb-4">Community Wellness (30d avg)</h2>
            <div className="grid grid-cols-3 gap-4">
              <WellnessGauge label="Sleep" value={wellnessTrend.avgSleep} icon="😴" good={wellnessTrend.avgSleep >= 6} />
              <WellnessGauge label="Energy" value={wellnessTrend.avgEnergy} icon="⚡" good={wellnessTrend.avgEnergy >= 6} />
              <WellnessGauge label="Stress" value={wellnessTrend.avgStress} icon="🧘" good={wellnessTrend.avgStress <= 5} />
            </div>
            <p className="text-[10px] text-[#b98fa1] mt-3 text-center">
              Based on {wellnessTrend.sampleSize} check-ins from the last 30 days
            </p>
          </section>
        </>
      )}

      {/* ============ FUNNEL TAB ============ */}
      {tab === "funnel" && (
        <section className="soft-card p-8">
          <h2 className="text-2xl text-[#4a3f44] mb-6">Conversion Funnel</h2>
          <div className="space-y-4">
            {[
              { label: "Signed Up", value: funnel.signups, pct: 100 },
              { label: "Completed Quiz", value: funnel.quizCompleted, pct: funnel.quizRate },
              { label: "First Check-In", value: funnel.firstCheckin, pct: funnel.signups > 0 ? round((funnel.firstCheckin / funnel.signups) * 100) : 0 },
              { label: "First Session", value: funnel.firstSession, pct: funnel.activationRate },
              { label: "Converted to Paid", value: funnel.converted, pct: funnel.conversionRate },
            ].map((step, i) => (
              <div key={step.label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-[#4a3f44] font-medium">{step.label}</span>
                  <span className="text-[#b98fa1]">{step.value} users ({step.pct}%)</span>
                </div>
                <div className="h-8 bg-[#fdf2f5] rounded-lg overflow-hidden relative">
                  <div
                    className="h-full rounded-lg transition-all duration-700"
                    style={{
                      width: `${step.pct}%`,
                      background: `linear-gradient(90deg, #d8a7b5 0%, ${i === 4 ? "#8f5d6f" : "#c58d9d"} 100%)`,
                    }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white mix-blend-difference">
                    {step.pct}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-[#fdf2f5] border border-[#f0e3e8]">
            <h3 className="text-sm font-bold text-[#4a3f44] mb-2">Drop-off Analysis</h3>
            <div className="space-y-1 text-xs text-[#6f5a62]">
              <p>
                📊 Quiz → Session drop: {funnel.quizCompleted > 0 ? round(((funnel.quizCompleted - funnel.firstSession) / funnel.quizCompleted) * 100) : 0}% of quiz completers never start a session
              </p>
              <p>
                💰 Session → Paid drop: {funnel.firstSession > 0 ? round(((funnel.firstSession - funnel.converted) / funnel.firstSession) * 100) : 0}% of active users haven&apos;t converted
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ============ ENGAGEMENT TAB ============ */}
      {tab === "engagement" && (
        <>
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <KPI label="DAU (avg)" value={engagement.dau} sub="daily active" />
            <KPI label="WAU" value={engagement.wau} sub="weekly active" />
            <KPI label="MAU" value={engagement.mau} sub="monthly active" />
            <KPI label="Stickiness" value={`${engagement.stickiness}%`} sub="WAU/MAU" color="text-[#d8a7b5]" />
          </section>

          <section className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="soft-card p-6">
              <h3 className="text-lg text-[#4a3f44] mb-4">Sessions (7 days)</h3>
              <div className="text-4xl font-light text-[#4a3f44] mb-1">{engagement.sessions7d}</div>
              <p className="text-xs text-[#b98fa1]">Avg duration: {engagement.avgSessionMin7d} min</p>
            </div>
            <div className="soft-card p-6">
              <h3 className="text-lg text-[#4a3f44] mb-4">Sessions (30 days)</h3>
              <div className="text-4xl font-light text-[#4a3f44] mb-1">{engagement.sessions30d}</div>
              <p className="text-xs text-[#b98fa1]">Avg duration: {engagement.avgSessionMin30d} min</p>
            </div>
          </section>

          <section className="soft-card p-6">
            <h3 className="text-lg text-[#4a3f44] mb-4">Journal Engagement</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-light text-[#4a3f44]">{engagement.journalUsers}</div>
                <div className="text-[10px] uppercase tracking-widest text-[#b98fa1] font-bold">Users writing</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-[#4a3f44]">{engagement.journalEntries}</div>
                <div className="text-[10px] uppercase tracking-widest text-[#b98fa1] font-bold">Total entries</div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ============ RETENTION TAB ============ */}
      {tab === "retention" && (
        <section className="soft-card p-8">
          <h2 className="text-2xl text-[#4a3f44] mb-6">User Retention</h2>
          <div className="space-y-4">
            {Object.entries(retention).map(([key, val]) => {
              const dayLabel = key.replace("day", "Day ");
              const isGood = val.rate >= 50;
              return (
                <div key={key}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-[#4a3f44] font-medium">{dayLabel}</span>
                    <span className="text-[#b98fa1]">
                      {val.retained}/{val.total} users ({val.rate}%)
                    </span>
                  </div>
                  <div className="h-6 bg-[#fdf2f5] rounded-lg overflow-hidden relative">
                    <div
                      className={`h-full rounded-lg transition-all duration-700 ${isGood ? "bg-green-400" : "bg-amber-400"}`}
                      style={{ width: `${val.rate}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#4a3f44]">
                      {val.rate}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-[#fdf2f5] border border-[#f0e3e8]">
            <h3 className="text-sm font-bold text-[#4a3f44] mb-2">Retention Benchmarks</h3>
            <div className="space-y-1 text-xs text-[#6f5a62]">
              <p>🎯 Day 1 retention &gt; 60% = good onboarding</p>
              <p>🎯 Day 7 retention &gt; 40% = strong habit formation</p>
              <p>🎯 Day 30 retention &gt; 20% = excellent product-market fit</p>
            </div>
          </div>
        </section>
      )}

      {/* ============ USERS TAB ============ */}
      {tab === "users" && (
        <>
          {/* Top users */}
          <section className="soft-card p-6 mb-6">
            <h2 className="text-xl text-[#4a3f44] mb-4">Top 10 Most Engaged</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-widest text-[#b98fa1] border-b border-[#f0e3e8]">
                    <th className="pb-3 pr-4">#</th>
                    <th className="pb-3 pr-4">Email</th>
                    <th className="pb-3 pr-4">Plan</th>
                    <th className="pb-3 pr-4">Day</th>
                    <th className="pb-3">Sessions</th>
                  </tr>
                </thead>
                <tbody>
                  {topUsers.map((u, i) => (
                    <tr key={u.email + i} className="border-b border-[#f0e3e8]/50 hover:bg-[#fdf2f5]/30">
                      <td className="py-2.5 pr-4 text-[#b98fa1] font-bold">{i + 1}</td>
                      <td className="py-2.5 pr-4 text-[#4a3f44]">{u.email}</td>
                      <td className="py-2.5 pr-4">
                        <PlanBadge plan={u.plan} />
                      </td>
                      <td className="py-2.5 pr-4 text-[#7b6870]">{u.day}</td>
                      <td className="py-2.5 text-[#4a3f44] font-medium">{u.sessions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* All users */}
          <section className="soft-card p-6">
            <h2 className="text-xl text-[#4a3f44] mb-4">All Users ({profiles.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-widest text-[#b98fa1] border-b border-[#f0e3e8]">
                    <th className="pb-3 pr-4">Email</th>
                    <th className="pb-3 pr-4">Plan</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 pr-4">Day</th>
                    <th className="pb-3">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((p) => {
                    const isActive = p.premium && p.expiry_date && new Date(p.expiry_date) > new Date();
                    return (
                      <tr key={p.id} className="border-b border-[#f0e3e8]/50 hover:bg-[#fdf2f5]/30">
                        <td className="py-2.5 pr-4 text-[#4a3f44]">{p.email || "—"}</td>
                        <td className="py-2.5 pr-4"><PlanBadge plan={p.plan} /></td>
                        <td className="py-2.5 pr-4">
                          <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${isActive ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400"}`}>
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-2.5 pr-4 text-[#7b6870]">{p.current_day || 1}</td>
                        <td className="py-2.5 text-[#7b6870]">{p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

// ============================================================
// REUSABLE COMPONENTS
// ============================================================

function KPI({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="soft-card p-5 text-center">
      <div className="text-[9px] uppercase tracking-widest text-[#b98fa1] mb-1.5 font-bold">{label}</div>
      <div className={`text-3xl font-light ${color || "text-[#4a3f44]"}`}>{value}</div>
      {sub && <div className="text-[9px] text-[#b98fa1] mt-0.5">{sub}</div>}
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const cls = plan === "elite"
    ? "bg-purple-50 text-purple-600"
    : plan === "glow"
      ? "bg-rose-50 text-rose-600"
      : "bg-gray-50 text-gray-500";
  return (
    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-widest ${cls}`}>
      {plan || "free"}
    </span>
  );
}

function WellnessGauge({ label, value, icon, good }: { label: string; value: number; icon: string; good: boolean }) {
  return (
    <div className="text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-light text-[#4a3f44]">{value}<span className="text-xs">/10</span></div>
      <div className="text-[10px] text-[#7b6870] mt-0.5">{label}</div>
      <div className={`text-[9px] mt-1 px-2 py-0.5 rounded-full inline-block font-bold ${good ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>
        {good ? "Healthy" : "Needs attention"}
      </div>
    </div>
  );
}

function MiniBarChart({ data, labels, color }: { data: number[]; labels: string[]; color: string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-[2px] h-24">
      {data.map((val, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group relative">
          <div
            className="w-full rounded-t transition-all duration-300 hover:opacity-80 min-h-[2px]"
            style={{ height: `${(val / max) * 100}%`, backgroundColor: color }}
          />
          {/* Tooltip on hover */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-[#4a3f44] text-white text-[9px] px-2 py-1 rounded whitespace-nowrap z-10">
            {labels[i]}: {val}
          </div>
        </div>
      ))}
    </div>
  );
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

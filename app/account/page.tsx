"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  getMembership,
  clearMembership,
  cancelSubscription,
} from "@/lib/subscription";
import ReferralCard from "@/components/ReferralCard";
import type { User } from "@supabase/supabase-js";

function MemberBadges({ purchaseDate, plan }: { purchaseDate: string | null; plan: string }) {
  const day = Number(typeof window !== "undefined" ? localStorage.getItem("day") || "1" : "1");
  const streak = Number(typeof window !== "undefined" ? localStorage.getItem("streak") || "0" : "0");

  const memberSince = purchaseDate
    ? new Date(purchaseDate).toLocaleDateString("en", { month: "long", year: "numeric" })
    : new Date().toLocaleDateString("en", { month: "long", year: "numeric" });

  const badges = [
    { icon: "🌱", title: "Member Since", subtitle: memberSince, earned: true },
    { icon: "🔥", title: "Streak Master", subtitle: `${streak} day streak`, earned: streak >= 3 },
    { icon: "⭐", title: "Week One", subtitle: "Completed 7 days", earned: day >= 7 },
    { icon: "💪", title: "Two Weeks Strong", subtitle: "14 days done", earned: day >= 14 },
    { icon: "👑", title: "30-Day Champion", subtitle: "Full month complete", earned: day >= 30 },
    { icon: "💎", title: plan === "elite" ? "Elite Member" : "Glow Member", subtitle: plan !== "free" ? "Premium access" : "Upgrade to earn", earned: plan !== "free" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {badges.map((b) => (
        <div
          key={b.title}
          className={`p-4 rounded-2xl text-center transition-all ${
            b.earned
              ? "bg-[#fdf2f5] border border-[#f0e3e8]"
              : "bg-white/30 border border-dashed border-[#f0e3e8] opacity-40 grayscale"
          }`}
        >
          <div className="text-3xl mb-2">{b.icon}</div>
          <div className="text-sm font-medium text-[#4a3f44]">{b.title}</div>
          <div className="text-[10px] text-[#b98fa1]">{b.subtitle}</div>
        </div>
      ))}
    </div>
  );
}

type State = {
  plan: "free" | "glow" | "elite";
  status: "active" | "expired" | "none";
  purchaseDate: string | null;
  expiryDate: string | null;
  daysRemaining: number;
};

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  function safeParseLocal(key: string): unknown {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
  const [data, setData] = useState<State>({
    plan: "free",
    status: "none",
    purchaseDate: null,
    expiryDate: null,
    daysRemaining: 0,
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u);
    });

    setData(getMembership());
  }, []);

  const premium = data.status === "active";

  const badge =
    data.plan === "elite"
      ? "Elite Member ✨"
      : data.plan === "glow"
        ? "Glow Member ✨"
        : "Free Account";

  async function handleCancel() {
    const confirmed = window.confirm(
      "Are you sure you want to cancel your membership?"
    );
    if (!confirmed) return;

    await cancelSubscription();
    setData(getMembership());
  }

  function handleReset() {
    const confirmed = window.confirm(
      "This will reset all your local data. Are you sure?"
    );
    if (!confirmed) return;

    clearMembership();
    setData(getMembership());
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearMembership();
    router.push("/");
    router.refresh();
  }

  function handleExportData() {
    const exportData = {
      exportedAt: new Date().toISOString(),
      email: user?.email || null,
      plan: data.plan,
      membership: data,
      quizData: safeParseLocal("quizData"),
      checkinHistory: safeParseLocal("checkinHistory"),
      journalEntries: safeParseLocal("journalEntries"),
      favorites: safeParseLocal("favorites"),
      sessionHistory: safeParseLocal("sessionHistory"),
      currentDay: localStorage.getItem("day"),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `veronica-method-data-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "⚠️ This will permanently delete your account and ALL your data (check-ins, journal, progress, favorites). This cannot be undone.\n\nAre you absolutely sure?"
    );
    if (!confirmed) return;

    const doubleConfirm = window.confirm(
      "Last chance: Type OK to confirm you want to delete everything."
    );
    if (!doubleConfirm) return;

    try {
      // Clear all local data
      const keysToRemove = [
        "day", "plan", "premium", "quizData", "purchaseDate", "expiryDate",
        "checkinHistory", "dailyCheckin", "journalEntries", "favorites",
        "sessionHistory", "weeklyCompleted", "unlockedAchievements",
        "nutritionData", "lastSyncedAt", "deviceId",
      ];
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      clearMembership();

      // Sign out
      const supabase = createClient();
      await supabase.auth.signOut();

      router.push("/");
      router.refresh();
    } catch {
      alert("Something went wrong. Please contact support.");
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-14">
      {/* HERO */}
      <section className="soft-card p-10 mb-8">
        <div className="inline-block px-5 py-3 rounded-full bg-[#fff1f5] text-[#8f5d6f] mb-6">
          {badge}
        </div>

        <h1 className="text-5xl mb-4">My Account</h1>

        {user && (
          <p className="text-[#b98fa1] text-sm mb-2">{user.email}</p>
        )}

        <p className="text-[#7b6870] text-lg">
          {premium
            ? "Your premium access is active."
            : data.status === "expired"
              ? "Your membership expired."
              : "Upgrade anytime to unlock premium."}
        </p>
      </section>

      {/* STATS */}
      <section className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="soft-card p-6">
          <div className="text-sm text-[#7b6870] mb-2">Plan</div>
          <div className="text-3xl capitalize">{data.plan}</div>
        </div>

        <div className="soft-card p-6">
          <div className="text-sm text-[#7b6870] mb-2">Status</div>
          <div className="text-3xl capitalize">{data.status}</div>
        </div>

        <div className="soft-card p-6">
          <div className="text-sm text-[#7b6870] mb-2">Days Left</div>
          <div className="text-3xl">{data.daysRemaining}</div>
        </div>

        <div className="soft-card p-6">
          <div className="text-sm text-[#7b6870] mb-2">Expiry</div>
          <div className="text-lg">
            {data.expiryDate
              ? new Date(data.expiryDate).toLocaleDateString()
              : "—"}
          </div>
        </div>
      </section>

      {/* MEMBER BADGES */}
      <section className="soft-card p-8 mb-8">
        <h2 className="text-3xl mb-6 text-[#4a3f44] italic">Your Badges</h2>
        <MemberBadges purchaseDate={data.purchaseDate} plan={data.plan} />
      </section>

      {/* ACTIONS */}
      <section className="soft-card p-8 mb-8">
        <h2 className="text-4xl mb-6">Membership Actions</h2>

        <div className="flex flex-wrap gap-4">
          {!premium && (
            <Link href="/pricing" className="btn-primary">
              Upgrade Now
            </Link>
          )}

          {data.plan === "glow" && premium && (
            <Link href="/plans/elite" className="btn-primary">
              Upgrade to Elite
            </Link>
          )}

          <Link href="/dashboard" className="btn-outline">
            Dashboard
          </Link>

          {premium && (
            <button onClick={handleCancel} className="btn-outline">
              Cancel Membership
            </button>
          )}

          <button onClick={handleReset} className="btn-outline">
            Reset Account
          </button>

          <button
            onClick={handleSignOut}
            className="btn-outline !border-red-200 !text-red-400 hover:!bg-red-50"
          >
            Sign Out
          </button>
        </div>
      </section>

      {/* DATA & PRIVACY (GDPR) */}
      <section className="soft-card p-8 mb-8">
        <h2 className="text-2xl text-[#4a3f44] mb-2">Your Data & Privacy</h2>
        <p className="text-sm text-[#7b6870] mb-6">
          You own your data. Export it anytime or request account deletion.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white/40 border border-[#f0e3e8]">
            <h3 className="text-sm font-medium text-[#4a3f44] mb-1">📦 Export My Data</h3>
            <p className="text-xs text-[#7b6870] mb-3">
              Download all your check-ins, journal entries, favorites and progress as a JSON file.
            </p>
            <button onClick={handleExportData} className="btn-outline text-xs px-4 py-2">
              Download Data
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-white/40 border border-[#f0e3e8]">
            <h3 className="text-sm font-medium text-[#4a3f44] mb-1">🗑️ Delete Account</h3>
            <p className="text-xs text-[#7b6870] mb-3">
              Permanently delete your account and all associated data. This cannot be undone.
            </p>
            <button onClick={handleDeleteAccount} className="btn-outline text-xs px-4 py-2 !border-red-200 !text-red-400 hover:!bg-red-50">
              Delete Account
            </button>
          </div>
        </div>
      </section>
      <ReferralCard />

      {/* RETENTION */}
      {premium && data.daysRemaining <= 7 && (
        <section className="soft-card p-8">
          <h2 className="text-4xl mb-4">Renew Soon</h2>
          <p className="text-[#7b6870] mb-6">
            Your access ends in {data.daysRemaining} days.
          </p>
          <Link href="/pricing" className="btn-primary">
            Renew Membership
          </Link>
        </section>
      )}

      {data.status === "expired" && (
        <section className="soft-card p-8">
          <h2 className="text-4xl mb-4">Welcome Back</h2>
          <p className="text-[#7b6870] mb-6">
            Reactivate your premium plan anytime.
          </p>
          <Link href="/pricing" className="btn-primary">
            Reactivate Now
          </Link>
        </section>
      )}
    </main>
  );
}

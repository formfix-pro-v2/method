import { isPromoActive } from "./promo";

export type MembershipPlan = "free" | "glow" | "elite";
type MembershipStatus = "active" | "expired" | "none";

export type MembershipData = {
  plan: MembershipPlan;
  status: MembershipStatus;
  purchaseDate: string | null;
  expiryDate: string | null;
  daysRemaining: number;
};

const PLAN_DAYS = {
  glow: 30,
  elite: 90,
};

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function diffDays(future: Date, now: Date) {
  const ms = future.getTime() - now.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

// Server-side subscription activation via API
export async function activateSubscription(plan: MembershipPlan): Promise<boolean> {
  try {
    const res = await fetch("/api/subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });

    if (!res.ok) return false;

    // Also cache locally for quick access
    if (typeof window !== "undefined") {
      const durationDays = PLAN_DAYS[plan as "glow" | "elite"];
      const now = new Date();
      const expiry = addDays(now, durationDays);

      localStorage.setItem("premium", "true");
      localStorage.setItem("plan", plan);
      localStorage.setItem("day", "1");
      localStorage.setItem("purchaseDate", now.toISOString());
      localStorage.setItem("expiryDate", expiry.toISOString());
    }

    return true;
  } catch {
    return false;
  }
}

// Cancel subscription via API
export async function cancelSubscription(): Promise<boolean> {
  try {
    const res = await fetch("/api/subscription", { method: "DELETE" });
    if (!res.ok) return false;

    if (typeof window !== "undefined") {
      localStorage.setItem("premium", "false");
    }

    return true;
  } catch {
    return false;
  }
}

// Legacy local-only functions (kept for backward compatibility during migration)
export function startMembership(plan: MembershipPlan) {
  if (typeof window === "undefined") return;
  if (plan === "free") return;

  const purchase = new Date();
  const expiry = addDays(purchase, PLAN_DAYS[plan as "glow" | "elite"]);

  localStorage.setItem("premium", "true");
  localStorage.setItem("plan", plan);
  localStorage.setItem("purchaseDate", purchase.toISOString());
  localStorage.setItem("expiryDate", expiry.toISOString());
  localStorage.setItem("day", "1");
}

export function getMembership(): MembershipData {
  if (typeof window === "undefined") {
    return {
      plan: "free",
      status: "none",
      purchaseDate: null,
      expiryDate: null,
      daysRemaining: 0,
    };
  }

  // Promo mode: treat everyone as elite with unlimited access
  if (isPromoActive()) {
    return {
      plan: "elite",
      status: "active",
      purchaseDate: null,
      expiryDate: null,
      daysRemaining: 999,
    };
  }

  const premium = localStorage.getItem("premium") === "true";
  const plan = (localStorage.getItem("plan") as MembershipPlan) || "free";
  const purchaseDate = localStorage.getItem("purchaseDate");
  const expiryDate = localStorage.getItem("expiryDate");

  if (!premium || plan === "free" || !expiryDate) {
    return {
      plan: "free",
      status: "none",
      purchaseDate: null,
      expiryDate: null,
      daysRemaining: 0,
    };
  }

  const now = new Date();
  const expiry = new Date(expiryDate);
  const daysRemaining = diffDays(expiry, now);

  if (daysRemaining <= 0) {
    localStorage.setItem("premium", "false");
    return {
      plan,
      status: "expired",
      purchaseDate,
      expiryDate,
      daysRemaining: 0,
    };
  }

  return {
    plan,
    status: "active",
    purchaseDate,
    expiryDate,
    daysRemaining,
  };
}

export function cancelMembership() {
  if (typeof window === "undefined") return;
  localStorage.setItem("premium", "false");
}

export function clearMembership() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("premium");
  localStorage.removeItem("plan");
  localStorage.removeItem("purchaseDate");
  localStorage.removeItem("expiryDate");
}

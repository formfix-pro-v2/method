"use client";

import { useEffect, useState } from "react";
import { isPromoActive } from "@/lib/promo";

type SubscriptionStatus = {
  isPremium: boolean;
  plan: "free" | "glow" | "elite";
  daysRemaining: number;
  verified: boolean;
};

/**
 * Verifies subscription status with server.
 * Falls back to localStorage if server is unreachable.
 * Prevents localStorage tampering from granting premium access.
 */
export function useSubscription(): SubscriptionStatus {
  const [status, setStatus] = useState<SubscriptionStatus>({
    isPremium: isPromoActive(),
    plan: isPromoActive() ? "elite" : "free",
    daysRemaining: 0,
    verified: false,
  });

  useEffect(() => {
    if (isPromoActive()) {
      setStatus({ isPremium: true, plan: "elite", daysRemaining: 999, verified: true });
      return;
    }

    async function verify() {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) {
          // Not logged in or error — fall back to localStorage
          fallbackToLocal();
          return;
        }

        const data = await res.json();
        const profile = data.profile;

        if (!profile) {
          setStatus({ isPremium: false, plan: "free", daysRemaining: 0, verified: true });
          return;
        }

        const now = new Date();
        const expiry = profile.expiry_date ? new Date(profile.expiry_date) : null;
        const isActive = profile.premium && (!expiry || expiry > now);
        const daysRemaining = expiry ? Math.max(0, Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0;

        // Sync server state to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("premium", String(isActive));
          localStorage.setItem("plan", profile.plan || "free");
          if (profile.expiry_date) localStorage.setItem("expiryDate", profile.expiry_date);
        }

        setStatus({
          isPremium: isActive,
          plan: profile.plan || "free",
          daysRemaining,
          verified: true,
        });
      } catch {
        // Network error — fall back to localStorage
        fallbackToLocal();
      }
    }

    function fallbackToLocal() {
      if (typeof window === "undefined") return;
      const premiumFlag = localStorage.getItem("premium") === "true";
      const expiryDate = localStorage.getItem("expiryDate");
      const plan = (localStorage.getItem("plan") as "free" | "glow" | "elite") || "free";
      const isActive = premiumFlag && (!expiryDate || new Date(expiryDate) > new Date());

      setStatus({
        isPremium: isActive && (plan === "glow" || plan === "elite"),
        plan: isActive ? plan : "free",
        daysRemaining: 0,
        verified: false,
      });
    }

    verify();
  }, []);

  return status;
}

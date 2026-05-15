"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export type Profile = {
  id: string;
  email: string;
  quiz_data: Record<string, unknown> | null;
  plan: "free" | "glow" | "elite";
  premium: boolean;
  current_day: number;
  purchase_date: string | null;
  expiry_date: string | null;
};

import { isPromoActive } from "@/lib/promo";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      setUser(currentUser);
      if (currentUser) {
        fetchProfile();
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile();
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  }

  return {
    user,
    profile,
    loading,
    isPremium: isPromoActive() || (profile?.premium ?? false),
    plan: isPromoActive() ? "elite" : (profile?.plan ?? "free"),
    refreshProfile: fetchProfile,
  };
}

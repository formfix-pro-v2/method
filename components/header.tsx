"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getMembership } from "@/lib/subscription";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import DarkModeToggle from "@/components/DarkModeToggle";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { User } from "@supabase/supabase-js";

type Plan = "free" | "glow" | "elite";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [plan, setPlan] = useState<Plan>("free");
  const [premium, setPremium] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      setUser(currentUser);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const membership = getMembership();
    if (membership.status === "active") {
      setPremium(true);
      setPlan(membership.plan as Plan);
    }

    return () => subscription.unsubscribe();
  }, []);

  const badgeText =
    plan === "elite" ? "Elite" : plan === "glow" ? "Glow" : null;

  const desktopLinks = [
    [t("Dashboard"), "/dashboard"],
    [t("Assessment"), "/quiz"],
    ["Blog", "/blog"],
    [t("Plans"), "/pricing"],
    ["Free Guide", "/free-guide"],
    ["Get App", "/download"],
    ["Affiliate", "/affiliate"],
  ];

  const mobileLinks = [
    [t("Dashboard"), "/dashboard"],
    [t("Assessment"), "/quiz"],
    [t("Progress"), "/progress"],
    ["Supplements", "/supplements"],
    [t("Journal"), "/journal"],
    [t("Shopping List"), "/shopping"],
    [t("Plans"), "/pricing"],
    ["Free Guide", "/free-guide"],
    ["Get App", "/download"],
    ["Affiliate", "/affiliate"],
    [t("Account"), "/account"],
  ];

  return (
    <header className="sticky top-0 z-50">
      <div className="mx-4 mt-4 rounded-[30px] border border-white/60 bg-white/75 backdrop-blur-2xl shadow-[0_20px_60px_rgba(145,105,120,0.12)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
          {/* BRAND */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/logo.png"
              alt="Veronica Method"
              className="w-14 h-14 rounded-xl shadow-md object-contain"
            />
            <div className="hidden sm:block">
              <div className="text-xl font-semibold leading-none tracking-tight text-[#7f5665]">
                Veronica Method
              </div>
              <div className="text-[8px] uppercase tracking-[0.25em] text-[#b38d98] mt-0.5">
                The Complete Menopause Program
              </div>
            </div>
          </Link>

          {/* NAV - Desktop */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
            {desktopLinks.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="px-4 py-2 rounded-2xl text-sm font-medium text-[#6f5a62] hover:bg-white hover:shadow-md transition-all duration-200"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <DarkModeToggle />

            {/* Instagram */}
            <a
              href="https://instagram.com/veronica_menopause_program"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl hover:bg-[#fdf2f5] transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5 text-[#b98fa1]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>

            {/* Language switcher — hidden until translations are complete */}
            {/* <LanguageSwitcher /> */}

            {user ? (
              premium && badgeText ? (
                <Link
                  href="/account"
                  className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-gradient-to-r from-[#8b5a6b] to-[#6b3a4d] text-white text-xs font-semibold uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
                  {badgeText}
                </Link>
              ) : (
                <Link
                  href="/account"
                  className="hidden sm:inline-flex px-4 py-2 rounded-2xl bg-[#fdf2f5] text-[#8f5d6f] text-sm font-medium hover:bg-[#f8e4ea] transition"
                >
                  Account
                </Link>
              )
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex px-4 py-2 rounded-2xl bg-gradient-to-r from-[#f1d4dc] via-[#ddb5c2] to-[#c897a6] text-white text-sm font-semibold shadow-[0_10px_25px_rgba(185,143,161,0.25)] hover:scale-[1.03] transition"
              >
                {t("Sign In")}
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-[#fdf2f5] transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              <svg
                className="w-5 h-5 text-[#6f5a62]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden px-6 pb-5 border-t border-[#f0e3e8]/50" id="mobile-nav" role="navigation" aria-label="Mobile navigation">
            <nav className="flex flex-col gap-1 pt-3">
              {mobileLinks.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-2xl text-sm font-medium text-[#6f5a62] hover:bg-white hover:shadow-md transition-all"
                >
                  {label}
                </Link>
              ))}
              {!user && (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary text-center mt-2"
                >
                  {t("Sign In")}
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

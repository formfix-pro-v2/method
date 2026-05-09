"use client";

import { useEffect, useState } from "react";

export default function StreakFreeze() {
  const [show, setShow] = useState(false);
  const [frozen, setFrozen] = useState(false);

  useEffect(() => {
    try {
      const history: Array<{ date: string; streakFreeze?: boolean }> = JSON.parse(
        localStorage.getItem("checkinHistory") || "[]"
      );

      // Nema istorije → korisnik tek počeo, nema šta da se zamrzne
      if (history.length === 0) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      // Da li postoji entry za juče?
      const hasYesterday = history.some((e) => e.date.split("T")[0] === yesterdayStr);

      // Ako ima juče → streak je ok, ne treba freeze
      if (hasYesterday) return;

      // Da li je korisnik uopšte bio aktivan PRE juče?
      // Ako nema nijedan entry stariji od juče, znači da je tek počeo — nema šta da se zamrzne
      const hasOlderActivity = history.some((e) => {
        const entryDate = new Date(e.date.split("T")[0]);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate < yesterday;
      });

      if (!hasOlderActivity) return;

      // Proveri da li je već koristio freeze ove nedelje
      const lastFreeze = localStorage.getItem("lastStreakFreeze");
      const thisWeek = getWeekNumber(new Date());
      if (lastFreeze === String(thisWeek)) return;

      // Korisnik je bio aktivan ranije, propustio juče, nije koristio freeze → prikaži
      setShow(true);
    } catch { /* ignore */ }
  }, []);

  function freezeStreak() {
    const thisWeek = getWeekNumber(new Date());
    localStorage.setItem("lastStreakFreeze", String(thisWeek));

    // Dodaj freeze entry za juče da sačuva streak
    try {
      const history = JSON.parse(localStorage.getItem("checkinHistory") || "[]");
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      history.push({
        sleep: 0, energy: 0, stress: 0,
        symptoms: [],
        date: yesterday.toISOString(),
        streakFreeze: true,
      });
      localStorage.setItem("checkinHistory", JSON.stringify(history.slice(-90)));
    } catch { /* ignore */ }

    setFrozen(true);
    setTimeout(() => setShow(false), 2000);
  }

  if (!show) return null;

  return (
    <div className="soft-card p-5 mb-4 border border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <span className="text-2xl">{frozen ? "✅" : "❄️"}</span>
        </div>
        <div className="flex-1">
          {frozen ? (
            <p className="text-sm text-green-600 font-medium">
              ✨ Streak frozen! Your streak is safe.
            </p>
          ) : (
            <>
              <p className="text-sm text-[#4a3f44] font-medium">
                You missed yesterday — use a Streak Freeze?
              </p>
              <p className="text-xs text-[#7b6870] mt-0.5">
                1 free freeze per week. Keeps your streak alive without losing progress.
              </p>
            </>
          )}
        </div>
        {!frozen && (
          <button onClick={freezeStreak} className="btn-primary px-5 py-2.5 text-xs shrink-0 shadow-lg">
            ❄️ Freeze It
          </button>
        )}
      </div>
    </div>
  );
}

function getWeekNumber(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 1);
  const diff = d.getTime() - start.getTime();
  return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
}

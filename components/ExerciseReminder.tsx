"use client";

import { useEffect } from "react";

/**
 * ExerciseReminder — šalje notifikaciju u 18:00 ako korisnik
 * nije uradio sesiju danas. Proverava svakih 30 min.
 */
export default function ExerciseReminder() {
  useEffect(() => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    if (localStorage.getItem("exerciseReminderOff") === "true") return;

    function checkAndRemind() {
      const hour = new Date().getHours();

      // Šalji samo između 17-20h
      if (hour < 17 || hour > 20) return;

      // Proveri da li je već poslat danas
      const today = new Date().toISOString().slice(0, 10);
      if (localStorage.getItem(`exerciseReminder_${today}`) === "sent") return;

      // Proveri da li je sesija završena danas
      try {
        const history = JSON.parse(localStorage.getItem("checkinHistory") || "[]");
        const todaySession = history.find(
          (e: { date: string; completedSession?: boolean }) =>
            e.date.startsWith(today) && e.completedSession
        );
        if (todaySession) return; // Već uradila sesiju
      } catch { /* ignore */ }

      // Šalji podsetnik
      new Notification("Veronica Method 🧘‍♀️", {
        body: "You haven't done your session today. Just 15 minutes can make a difference!",
        icon: "/icon-192.png",
        tag: "exercise-reminder",
      });

      localStorage.setItem(`exerciseReminder_${today}`, "sent");
    }

    // Proveri odmah i svakih 30 min
    checkAndRemind();
    const interval = setInterval(checkAndRemind, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}

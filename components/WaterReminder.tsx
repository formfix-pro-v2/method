"use client";

import { useEffect, useRef } from "react";

/**
 * WaterReminder — šalje browser notifikaciju svakih 90 minuta
 * da podseti korisnika da popije čašu vode.
 * Radi samo ako je Notification permission granted.
 */
export default function WaterReminder() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Ne pokreći ako notifikacije nisu dozvoljene
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    // Ne pokreći ako je korisnik isključio water reminder
    if (localStorage.getItem("waterReminderOff") === "true") return;

    // Podsetnik svakih 90 minuta
    const INTERVAL = 90 * 60 * 1000; // 90 min

    function sendReminder() {
      // Proveri da li je već popila dnevni cilj
      const today = new Date().toISOString().slice(0, 10);
      const glasses = Number(localStorage.getItem(`water_${today}`) || "0");
      const target = Number(localStorage.getItem("waterTarget") || "8");

      if (glasses >= target) return; // Cilj dostignut, ne uznemiravaj

      // Različite poruke za raznolikost
      const messages = [
        "Time for a glass of water! 💧 Hydration helps reduce hot flashes.",
        "Water break! 💧 Your joints and skin will thank you.",
        "Don't forget to drink water! 💧 Stay hydrated, stay energized.",
        "Quick reminder: have you had water recently? 💧",
        "Hydration check! 💧 Even mild dehydration affects energy and mood.",
      ];

      const msg = messages[Math.floor(Math.random() * messages.length)];
      const remaining = target - glasses;

      new Notification("Veronica Method 💧", {
        body: `${msg}\n${remaining} glasses remaining today.`,
        icon: "/icon-192.png",
        tag: "water-reminder", // Zamenjuje prethodnu notifikaciju
        silent: false,
      });
    }

    // Prva notifikacija posle 90 min
    intervalRef.current = setInterval(sendReminder, INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return null;
}

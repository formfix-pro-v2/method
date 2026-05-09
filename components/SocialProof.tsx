"use client";

import { useEffect, useState } from "react";

/**
 * Shows simulated "active now" count based on time of day.
 * Higher during morning/evening workout hours, lower at night.
 */
export default function SocialProof() {
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    // Simulate realistic activity based on time
    let base: number;
    if (hour >= 6 && hour <= 9) base = 18; // Morning workout
    else if (hour >= 17 && hour <= 21) base = 24; // Evening workout
    else if (hour >= 10 && hour <= 16) base = 12; // Midday
    else base = 5; // Night

    // Add some randomness
    const variation = Math.floor(Math.random() * 8) - 4;
    setCount(Math.max(3, base + variation));

    // Show after 5 seconds
    const timer = setTimeout(() => setShow(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-20 left-4 z-40 md:bottom-4 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-[#f0e3e8] shadow-lg text-xs">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <span className="text-[#6f5a62]">
          <strong className="text-[#4a3f44]">{count}</strong> women active right now
        </span>
      </div>
    </div>
  );
}

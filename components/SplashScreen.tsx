"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Only show splash on first visit per session
    const shown = sessionStorage.getItem("splashShown");
    if (shown) {
      setVisible(false);
      return;
    }

    // Also only show in standalone mode (installed PWA)
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (!isStandalone) {
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("splashShown", "true");
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-b from-[#fffaf8] to-[#fff5f7]">
      <div className="text-center animate-pulse">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#f8d8df] via-[#e7bcc8] to-[#d5a6b1] flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-white text-3xl">✦</span>
        </div>
        <div className="text-3xl font-semibold text-[#7f5665] tracking-tight">Veronica Method</div>
        <div className="text-[9px] uppercase tracking-[0.3em] text-[#b38d98] mt-1">The Complete Menopause Program</div>
      </div>
    </div>
  );
}

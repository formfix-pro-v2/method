"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function UpsellBanner() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const plan = localStorage.getItem("plan");
    const day = Number(localStorage.getItem("day") || "1");
    const upsellDismissed = localStorage.getItem("upsellDismissed");

    // Show upsell for Glow users approaching end of program
    if (plan === "glow" && day >= 25 && !upsellDismissed) {
      setShow(true);
    }
  }, []);

  if (!show || dismissed) return null;

  function dismiss() {
    setDismissed(true);
    localStorage.setItem("upsellDismissed", "true");
  }

  return (
    <div className="soft-card p-6 mb-6 border-2 border-[#d8a7b5]/30 relative overflow-hidden">
      <button
        onClick={dismiss}
        className="absolute top-3 right-3 text-[#b98fa1] hover:text-[#8f5d6f] text-lg"
        aria-label="Dismiss"
      >
        ×
      </button>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="text-4xl">🌟</div>
        <div className="flex-1">
          <h3 className="text-xl text-[#4a3f44] mb-1">
            Upgrade to Elite — Special Offer
          </h3>
          <p className="text-sm text-[#7b6870]">
            You&apos;re almost done with Glow! Continue your transformation with
            60 more days of advanced exercises, pelvic floor recovery, and monthly
            reassessments.
          </p>
          <p className="text-xs text-[#d8a7b5] font-bold mt-1">
            Only €50 for existing Glow members (save €29)
          </p>
        </div>
        <Link
          href="/checkout?plan=elite"
          className="btn-primary shrink-0 px-8"
        >
          Upgrade to Elite
        </Link>
      </div>
    </div>
  );
}

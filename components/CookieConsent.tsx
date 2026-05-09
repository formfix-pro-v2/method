"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // Show after 2 seconds
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  function accept() {
    localStorage.setItem("cookieConsent", "accepted");
    setShow(false);
  }

  function decline() {
    localStorage.setItem("cookieConsent", "declined");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto soft-card p-5 shadow-2xl border border-[#d8a7b5]/20 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 text-sm text-[#6f5a62]">
          We use cookies to improve your experience and save your preferences.
          See our{" "}
          <Link href="/privacy" className="text-[#d8a7b5] underline">
            Privacy Policy
          </Link>
          .
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 rounded-xl text-sm text-[#7b6870] hover:bg-[#fdf2f5] transition-colors"
          >
            Decline
          </button>
          <button onClick={accept} className="btn-primary px-6 py-2 text-sm">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

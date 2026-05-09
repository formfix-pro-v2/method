"use client";

import { useEffect, useState } from "react";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true); // Start hidden

  useEffect(() => {
    // Don't show if already captured or dismissed
    const stored = localStorage.getItem("emailCaptured");
    if (stored) return;

    // Show after 15 seconds on page
    const timer = setTimeout(() => {
      setDismissed(false);
      setVisible(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  if (dismissed || !visible) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;

    localStorage.setItem("emailCaptured", email);

    try {
      const leads = JSON.parse(localStorage.getItem("leads") || "[]");
      leads.push({ email, source: "popup", date: new Date().toISOString() });
      localStorage.setItem("leads", JSON.stringify(leads));
    } catch { /* ignore */ }

    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => {});

    setSubmitted(true);
    setTimeout(() => setVisible(false), 3000);
  }

  if (submitted) {
    return (
      <div className="fixed bottom-4 right-4 z-40 max-w-xs animate-in fade-in">
        <div className="soft-card p-5 shadow-xl border border-[#d8a7b5]/20">
          <div className="text-center">
            <div className="text-2xl mb-1">🌸</div>
            <p className="text-sm text-[#4a3f44] font-medium">Thank you!</p>
            <p className="text-xs text-[#7b6870]">Your free plan is on the way.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-xs animate-in fade-in slide-in-from-bottom-4">
      <div className="soft-card p-5 shadow-xl border border-[#d8a7b5]/20 relative">
        <button
          onClick={() => {
            setDismissed(true);
            localStorage.setItem("emailCaptured", "dismissed");
          }}
          className="absolute top-2 right-3 text-[#b98fa1] hover:text-[#8f5d6f] text-sm leading-none"
          aria-label="Close"
        >
          ✕
        </button>

        <p className="text-sm text-[#4a3f44] font-medium mb-1">
          Free 3-Day Starter Plan ✨
        </p>
        <p className="text-[11px] text-[#7b6870] mb-3">
          Meals + exercises delivered to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="flex-1 p-2.5 rounded-xl border border-[#ead8de] outline-none focus:border-[#d6a7b1] text-sm min-w-0"
            required
          />
          <button type="submit" className="btn-primary px-3 py-2.5 text-xs shrink-0">
            Get It
          </button>
        </form>
      </div>
    </div>
  );
}

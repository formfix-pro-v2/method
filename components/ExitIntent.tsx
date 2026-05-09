"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ExitIntent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("exitIntentShown")) return;

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 5 && !show) {
        setShow(true);
        localStorage.setItem("exitIntentShown", "true");
        document.removeEventListener("mouseout", handleMouseLeave);
      }
    }

    // Only activate after 10 seconds on page
    const timer = setTimeout(() => {
      document.addEventListener("mouseout", handleMouseLeave);
    }, 10000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseout", handleMouseLeave);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/40">
      <div className="soft-card p-8 max-w-md w-full shadow-2xl relative text-center">
        <button
          onClick={() => setShow(false)}
          className="absolute top-3 right-4 text-[#b98fa1] hover:text-[#8f5d6f] text-xl"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="text-4xl mb-3">🌸</div>
        <h2 className="text-2xl text-[#4a3f44] mb-2">Wait — Special Offer Just For You</h2>
        <p className="text-sm text-[#7b6870] mb-4">
          Get <span className="font-bold text-[#d8a7b5]">20% off</span> your
          first plan. Use code at checkout:
        </p>

        <div className="bg-[#fdf2f5] border-2 border-dashed border-[#d8a7b5] rounded-xl p-4 mb-5">
          <span className="text-2xl font-mono font-bold text-[#4a3f44] tracking-widest">
            VERONICA20
          </span>
        </div>

        <Link href="/pricing" className="btn-primary w-full py-3 mb-3" onClick={() => setShow(false)}>
          View Plans with 20% Off
        </Link>

        <button
          onClick={() => setShow(false)}
          className="text-xs text-[#b98fa1] hover:text-[#8f5d6f]"
        >
          No thanks, I&apos;ll pay full price
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { generateReferralCode, getReferralLink } from "@/lib/referral";

export default function ReferralCard() {
  const [code, setCode] = useState("");
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const c = generateReferralCode(user.id);
        setCode(c);
        setLink(getReferralLink(c));
      }
    });
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = link;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (!code) return null;

  return (
    <section className="soft-card p-8 mb-8">
      <h2 className="text-3xl text-[#4a3f44] mb-2">Invite a Friend</h2>
      <p className="text-[#7b6870] mb-6">
        Share your personal link. When a friend joins, you both get 7 bonus days.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 p-4 rounded-2xl bg-[#fdf2f5] border border-[#f0e3e8] text-sm text-[#6f5a62] truncate">
          {link}
        </div>
        <button
          onClick={copyLink}
          className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all shrink-0 ${
            copied
              ? "bg-green-50 text-green-600 border border-green-100"
              : "btn-primary"
          }`}
        >
          {copied ? "✓ Copied!" : "Copy Link"}
        </button>
      </div>

      <div className="mt-4 flex gap-3">
        <a
          href={`https://wa.me/?text=I%27m%20using%20Veronica Method%20for%20menopause%20wellness%20and%20it%27s%20amazing!%20Try%20it%20free:%20${encodeURIComponent(link)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline text-sm px-4 py-2"
        >
          Share on WhatsApp
        </a>
        <a
          href={`mailto:?subject=Try%20Veronica Method%20Wellness&body=I%27ve%20been%20using%20Veronica Method%20for%20menopause%20wellness%20and%20love%20it.%20Try%20it%20free:%20${encodeURIComponent(link)}`}
          className="btn-outline text-sm px-4 py-2"
        >
          Share via Email
        </a>
      </div>

      <p className="text-[10px] text-[#b98fa1] mt-4">
        Your code: <span className="font-mono font-bold">{code}</span>
      </p>
    </section>
  );
}

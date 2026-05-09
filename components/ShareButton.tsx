"use client";

import { useState } from "react";

export default function ShareButton({ text, url }: { text: string; url?: string }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(shareUrl);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${text}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = `${text}\n${shareUrl}`;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="btn-outline flex items-center gap-2 text-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-[#1a1528] rounded-2xl shadow-xl border border-[#f0e3e8] dark:border-[rgba(140,130,180,0.15)] overflow-hidden min-w-[180px]">
            <a
              href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-[#6f5a62] hover:bg-[#fdf2f5] transition-colors"
            >
              💬 WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-[#6f5a62] hover:bg-[#fdf2f5] transition-colors"
            >
              📘 Facebook
            </a>
            <a
              href={`mailto:?subject=Check%20out%20Veronica%20Method&body=${encodedText}%20${encodedUrl}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-[#6f5a62] hover:bg-[#fdf2f5] transition-colors"
            >
              ✉️ Email
            </a>
            <button
              onClick={() => { copyLink(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#6f5a62] hover:bg-[#fdf2f5] transition-colors text-left"
            >
              {copied ? "✅ Copied!" : "🔗 Copy Link"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

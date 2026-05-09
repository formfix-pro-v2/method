"use client";

import Link from "next/link";

export default function SessionError({ reset }: { reset: () => void }) {
  return (
    <div className="max-w-md mx-auto px-6 py-20 text-center">
      <div className="soft-card p-8">
        <div className="text-3xl mb-3">😔</div>
        <h2 className="text-xl text-[#4a3f44] mb-2">Session Error</h2>
        <p className="text-sm text-[#7b6870] mb-4">Something went wrong with your session.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-primary py-2 px-6">Try Again</button>
          <Link href="/dashboard" className="btn-outline py-2 px-6">Dashboard</Link>
        </div>
      </div>
    </div>
  );
}

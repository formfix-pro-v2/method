"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="soft-card p-10 max-w-md text-center">
        <div className="text-4xl mb-4">😔</div>
        <h1 className="text-3xl text-[#4a3f44] mb-2">Something Went Wrong</h1>
        <p className="text-sm text-[#7b6870] mb-6">
          Don&apos;t worry — your progress is saved. This is just a temporary
          glitch.
        </p>
        <div className="flex flex-col gap-3">
          <button onClick={reset} className="btn-primary py-3">
            Try Again
          </button>
          <a href="/dashboard" className="btn-outline py-3">
            Go to Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}

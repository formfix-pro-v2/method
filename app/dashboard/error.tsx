"use client";

export default function DashboardError({ reset }: { reset: () => void }) {
  return (
    <div className="max-w-md mx-auto px-6 py-20 text-center">
      <div className="soft-card p-8">
        <div className="text-3xl mb-3">😔</div>
        <h2 className="text-xl text-[#4a3f44] mb-2">Dashboard Error</h2>
        <p className="text-sm text-[#7b6870] mb-4">Something went wrong loading your dashboard.</p>
        <button onClick={reset} className="btn-primary py-2 px-6">Try Again</button>
      </div>
    </div>
  );
}

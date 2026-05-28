"use client";

import Link from "next/link";

export default function CheckoutError({ reset }: { reset: () => void }) {
  return (
    <div className="max-w-md mx-auto px-6 py-20 text-center">
      <div className="soft-card p-10">
        <div className="text-4xl mb-4">💳</div>
        <h2 className="text-xl text-[#4a3f44] mb-2">Checkout Error</h2>
        <p className="text-sm text-[#7b6870] mb-6">Something went wrong with the checkout process. Your payment was not processed.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-primary py-2 px-6">Try Again</button>
          <Link href="/pricing" className="btn-outline py-2 px-6">View Plans</Link>
        </div>
      </div>
    </div>
  );
}

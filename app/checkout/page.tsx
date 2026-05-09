"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getPlan, activatePlan } from "@/lib/checkout";
import { activateSubscription } from "@/lib/subscription";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

function CheckoutContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  const rawPlan = params.get("plan");
  const data = useMemo(() => getPlan(rawPlan), [rawPlan]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u);
    });
  }, []);

  async function handleCheckout() {
    if (!user) {
      router.push(`/login?redirect=/checkout?plan=${data.id}`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: data.id }),
      });

      const result = await res.json();

      if (result.url) {
        // Redirect to Lemon Squeezy Checkout
        window.location.href = result.url;
      } else {
        setError(result.error || "Something went wrong");
        setLoading(false);
      }
    } catch {
      setError("Connection error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-14">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* LEFT: Order Summary */}
        <section className="space-y-8">
          <div>
            <p className="uppercase tracking-[0.25em] text-xs text-[#b98fa1] mb-4 font-bold">
              Selected Plan
            </p>
            <h1 className="text-5xl mb-4 text-[#4a3f44] tracking-tight">
              {data.name}
            </h1>
            <p className="text-[#7b6870] text-lg leading-relaxed">
              {data.description}
            </p>
          </div>

          <div className="soft-card p-8 bg-[#fffcfd] border border-[#f0e3e8]">
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="text-6xl font-light text-[#4a3f44]">
                  €{data.price}
                </span>
                <span className="text-[#b98fa1] ml-2">/ one-time</span>
              </div>
            </div>

            <div className="space-y-3">
              {data.features.map((item) => (
                <div key={item} className="flex items-center gap-3 text-[#6f5a62]">
                  <span className="text-[#d6a7b1]">✦</span>
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-[#f0e3e8] text-sm text-[#b98fa1] italic">
              Start your personalized menopause wellness journey today.
            </div>
          </div>
        </section>

        {/* RIGHT: Payment */}
        <section className="soft-card p-10 bg-white shadow-xl shadow-[#f0e3e8]/50 border border-[#f0e3e8]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl text-[#4a3f44]">Secure Payment</h2>
            <span className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded border border-green-100 font-bold uppercase tracking-tighter">
              SSL Secured
            </span>
          </div>

          {!user ? (
            <div className="text-center py-8">
              <p className="text-[#7b6870] mb-6">
                Sign in to complete your purchase
              </p>
              <Link
                href={`/login?redirect=/checkout?plan=${data.id}`}
                className="btn-primary"
              >
                Sign In / Create Account
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-[#fdf2f5] border border-[#f0e3e8]">
                <p className="text-[10px] uppercase font-bold text-[#b98fa1] tracking-widest mb-1">
                  Account
                </p>
                <p className="text-[#4a3f44]">{user.email}</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#fffcfd] border border-[#f0e3e8]">
                <div className="flex justify-between mb-2">
                  <span className="text-[#7b6870]">{data.name} Plan</span>
                  <span className="text-[#4a3f44] font-medium">€{data.price}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#f0e3e8]">
                  <span className="font-bold text-[#4a3f44]">Total</span>
                  <span className="font-bold text-[#4a3f44]">€{data.price}</span>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="btn-primary w-full py-5 text-lg shadow-lg disabled:opacity-60 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Redirecting to payment...
                  </span>
                ) : (
                  `Pay €${data.price} — Secure Checkout`
                )}
              </button>

              <div className="mt-4 grid grid-cols-3 gap-4 opacity-40 grayscale contrast-125">
                <div className="text-[10px] text-center font-bold border rounded p-1">VISA</div>
                <div className="text-[10px] text-center font-bold border rounded p-1">MASTERCARD</div>
                <div className="text-[10px] text-center font-bold border rounded p-1">PAYPAL</div>
              </div>

              <p className="text-[11px] text-[#b98fa1] text-center leading-relaxed">
                You&apos;ll be redirected to our secure payment page.
              </p>

              {/* Dev bypass — aktiviraj plan bez plaćanja */}
              <div className="mt-6 pt-6 border-t border-dashed border-[#f0e3e8]">
                <p className="text-[10px] text-[#b98fa1] text-center mb-3 uppercase tracking-widest font-bold">
                  ⚙️ Dev / Test Mode
                </p>
                <button
                  onClick={async () => {
                    setLoading(true);
                    setError("");
                    try {
                      // Aktiviraj lokalno
                      activatePlan(data.id);
                      // Pokušaj i na serveru
                      await activateSubscription(data.id);
                      router.push("/checkout/success?plan=" + data.id);
                    } catch {
                      // Ako server ne radi, lokalna aktivacija je dovoljna
                      router.push("/checkout/success?plan=" + data.id);
                    }
                  }}
                  disabled={loading}
                  className="w-full py-3 rounded-2xl border-2 border-dashed border-[#d8a7b5] text-[#d8a7b5] text-sm font-medium hover:bg-[#fdf2f5] transition-all disabled:opacity-40"
                >
                  {loading ? "Activating..." : `⚡ Activate ${data.name} (Skip Payment)`}
                </button>
                <p className="text-[9px] text-[#b98fa1]/60 text-center mt-2">
                  Ovo dugme preskače plaćanje i direktno aktivira plan. Samo za testiranje.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-[#b98fa1] animate-pulse uppercase tracking-[0.3em] text-sm">
          Preparing Secure Checkout...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

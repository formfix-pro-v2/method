"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { signIn, signUp } from "@/lib/auth";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (!email.includes("@") || password.length < 6) {
      setError("Please enter a valid email and password (min 6 characters).");
      setLoading(false);
      return;
    }

    // Try sign in first
    const signInResult = await signIn(email, password);

    if (signInResult.success) {
      router.push(redirect);
      router.refresh();
      return;
    }

    // If sign in failed, try to create account automatically
    const signUpResult = await signUp(email, password);

    if (signUpResult.success) {
      // Try signing in immediately after signup
      const retrySignIn = await signIn(email, password);
      if (retrySignIn.success) {
        router.push(redirect);
        router.refresh();
        return;
      }
      // If email confirmation is required
      setMessage(
        "Account created! Check your email for a confirmation link, then sign in."
      );
    } else {
      // Both failed — show a helpful error
      const err = signUpResult.error || "";
      if (err.toLowerCase().includes("already")) {
        setError("Incorrect password. Please try again.");
      } else {
        setError(err || "Something went wrong. Please try again.");
      }
    }

    setLoading(false);
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="soft-card p-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl mb-2 text-[#4a3f44]">Welcome</h1>
            <p className="text-[#7b6870]">
              Sign in or create an account to continue
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-100 text-green-600 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="text-[10px] uppercase font-bold text-[#b98fa1] tracking-widest ml-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-4 rounded-2xl border border-[#ead8de] outline-none focus:border-[#d6a7b1] transition-colors"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-[10px] uppercase font-bold text-[#b98fa1] tracking-widest ml-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 p-4 rounded-2xl border border-[#ead8de] outline-none focus:border-[#d6a7b1] transition-colors"
                required
                minLength={6}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-lg disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Please wait...
                </span>
              ) : (
                "Continue"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#b98fa1]">
            New here? Just enter your email and password — we&apos;ll create
            your account automatically.
          </p>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-xs text-[#7b6870] hover:text-[#4a3f44] transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="animate-pulse text-[#b98fa1]">Loading...</div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

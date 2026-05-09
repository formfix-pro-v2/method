"use client";

import Link from "next/link";
import { useState } from "react";

export default function DownloadPage() {
  const [showIOS, setShowIOS] = useState(false);

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      {/* HERO */}
      <section className="soft-card p-8 text-center mb-6">
        <div className="text-5xl mb-4">📱</div>
        <h1 className="text-4xl text-[#4a3f44] mb-2">Get the App</h1>
        <p className="text-[#5a4550] max-w-md mx-auto">
          Download Veronica Method on your phone. Use it like a native app — offline support, push notifications, quick access.
        </p>
      </section>

      {/* ANDROID */}
      <section className="soft-card p-6 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center shrink-0">
            <span className="text-2xl">🤖</span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl text-[#4a3f44] mb-1">Android</h2>
            <p className="text-xs text-[#5a4550]">
              Works on all Android phones — Samsung, Xiaomi, Huawei, Google Pixel, etc.
            </p>
          </div>
          <a
            href="/menopause-program.apk"
            download
            className="btn-primary px-5 py-2.5 text-sm shrink-0"
          >
            Download APK
          </a>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-[#fdf2f5] border border-[#f0e3e8]">
          <p className="text-xs text-[#5a4550] font-medium mb-2">How to install:</p>
          <ol className="space-y-1 text-xs text-[#5a4550]">
            <li>1. Tap "Download APK" above</li>
            <li>2. Open the downloaded file</li>
            <li>3. If prompted, allow "Install from unknown sources"</li>
            <li>4. Tap "Install" → Done!</li>
          </ol>
        </div>
      </section>

      {/* iOS */}
      <section className="soft-card p-6 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
            <span className="text-2xl">🍎</span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl text-[#4a3f44] mb-1">iPhone & iPad</h2>
            <p className="text-xs text-[#5a4550]">
              Add to Home Screen from Safari — works like a native app.
            </p>
          </div>
          <button
            onClick={() => setShowIOS(!showIOS)}
            className="btn-outline px-5 py-2.5 text-sm shrink-0"
          >
            {showIOS ? "Hide" : "Show How"}
          </button>
        </div>

        {showIOS && (
          <div className="mt-4 p-4 rounded-xl bg-[#fdf2f5] border border-[#f0e3e8]">
            <p className="text-xs text-[#5a4550] font-medium mb-2">How to install on iPhone:</p>
            <ol className="space-y-2 text-xs text-[#5a4550]">
              <li className="flex gap-2">
                <span className="font-bold text-[#a8687a] shrink-0">1.</span>
                Open this website in <strong>Safari</strong> (not Chrome)
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[#a8687a] shrink-0">2.</span>
                Tap the <strong>Share button</strong> ⬆️ at the bottom
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[#a8687a] shrink-0">3.</span>
                Scroll down and tap <strong>"Add to Home Screen"</strong>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[#a8687a] shrink-0">4.</span>
                Tap <strong>"Add"</strong> — app icon appears on your home screen
              </li>
            </ol>
          </div>
        )}
      </section>

      {/* FEATURES */}
      <section className="soft-card p-6 mb-6">
        <h3 className="text-lg text-[#4a3f44] mb-4 text-center">What you get</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "⚡", text: "Instant access" },
            { icon: "📴", text: "Works offline" },
            { icon: "🔔", text: "Daily reminders" },
            { icon: "🏠", text: "Home screen icon" },
            { icon: "🔒", text: "Your data stays private" },
            { icon: "🔄", text: "Always up to date" },
          ].map((f) => (
            <div key={f.text} className="flex items-center gap-2 p-3 rounded-xl bg-white/60 border border-[#f0e3e8]">
              <span className="text-lg">{f.icon}</span>
              <span className="text-xs text-[#4a3f44]">{f.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* QR CODE */}
      <section className="soft-card p-6 mb-6 text-center">
        <h3 className="text-lg text-[#4a3f44] mb-2">Scan to Open on Phone</h3>
        <p className="text-xs text-[#5a4550] mb-4">On desktop? Scan this QR code with your phone camera.</p>
        <div className="inline-block p-3 bg-white rounded-2xl border border-[#f0e3e8] shadow-sm">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://veronica-method.vercel.app/download&color=6b3a4d&bgcolor=ffffff"
            alt="QR code to download Veronica Method app"
            width={200}
            height={200}
            className="rounded-lg"
          />
        </div>
        <p className="text-[9px] text-[#7d5565] mt-3">Opens the download page on your phone</p>
      </section>

      {/* BACK */}
      <div className="text-center">
        <Link href="/" className="text-sm text-[#7d5565] hover:underline">← Back to Home</Link>
      </div>
    </main>
  );
}

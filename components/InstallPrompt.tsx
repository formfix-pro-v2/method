"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Don't show if already installed or dismissed
    if (localStorage.getItem("installDismissed")) return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    // Detect iOS
    const ua = navigator.userAgent;
    const isiOS = /iPad|iPhone|iPod/.test(ua);
    setIsIOS(isiOS);

    if (isiOS) {
      // Show iOS guide after 30 seconds
      const timer = setTimeout(() => setShowBanner(true), 30000);
      return () => clearTimeout(timer);
    }

    // Android/Desktop: listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    }
  }

  function dismiss() {
    setShowBanner(false);
    localStorage.setItem("installDismissed", "true");
  }

  if (!showBanner) return null;

  // iOS guide
  if (isIOS) {
    return (
      <>
        {!showIOSGuide && (
          <div className="fixed bottom-4 left-3 right-3 z-50 md:left-auto md:right-4 md:max-w-sm">
            <div className="soft-card p-3 shadow-xl border border-[#d8a7b5]/20">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Veronica Method" className="w-9 h-9 rounded-lg shadow-sm object-contain shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#4a3f44] font-medium truncate">Add to Home Screen</p>
                  <p className="text-[10px] text-[#7b6870] truncate">Use it like a real app</p>
                </div>
                <button onClick={() => setShowIOSGuide(true)} className="btn-primary px-3 py-1.5 text-[10px] shrink-0">
                  How?
                </button>
                <button onClick={dismiss} className="text-[#b98fa1] text-xs shrink-0 p-1" aria-label="Close">✕</button>
              </div>
            </div>
          </div>
        )}

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center p-4">
            <div className="soft-card p-6 max-w-sm w-full shadow-2xl">
              <h3 className="text-lg text-[#4a3f44] font-medium mb-4">Install Veronica Method on iPhone</h3>
              <ol className="space-y-3 text-sm text-[#6f5a62]">
                <li className="flex gap-3">
                  <span className="text-[#d8a7b5] font-bold shrink-0">1.</span>
                  Tap the <strong>Share</strong> button <span className="inline-block bg-[#fdf2f5] px-1.5 py-0.5 rounded text-xs">⬆️</span> at the bottom of Safari
                </li>
                <li className="flex gap-3">
                  <span className="text-[#d8a7b5] font-bold shrink-0">2.</span>
                  Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#d8a7b5] font-bold shrink-0">3.</span>
                  Tap <strong>&quot;Add&quot;</strong> in the top right corner
                </li>
              </ol>
              <p className="text-xs text-[#b98fa1] mt-4 italic">
                Veronica Method will appear on your home screen like a regular app.
              </p>
              <button onClick={() => { setShowIOSGuide(false); dismiss(); }} className="btn-primary w-full mt-4 py-3">
                Got it!
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Android / Desktop
  return (
    <div className="fixed bottom-4 left-3 right-3 z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="soft-card p-3 shadow-xl border border-[#d8a7b5]/20">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Veronica Method" className="w-9 h-9 rounded-lg shadow-sm object-contain shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#4a3f44] font-medium truncate">Install Veronica Method</p>
            <p className="text-[10px] text-[#7b6870] truncate">Add to home screen for quick access</p>
          </div>
          <button onClick={handleInstall} className="btn-primary px-3 py-1.5 text-[10px] shrink-0">
            Install
          </button>
          <button onClick={dismiss} className="text-[#b98fa1] text-xs shrink-0 p-1" aria-label="Close">✕</button>
        </div>
      </div>
    </div>
  );
}

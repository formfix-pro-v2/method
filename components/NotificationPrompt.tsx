"use client";

import { useEffect, useState } from "react";

export default function NotificationPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "default") return;
    if (localStorage.getItem("notifDismissed")) return;

    // Prikaži nakon 60 sekundi na sajtu
    const timer = setTimeout(() => setShow(true), 60000);
    return () => clearTimeout(timer);
  }, []);

  async function requestPermission() {
    const result = await Notification.requestPermission();
    if (result === "granted") {
      // Prikaži potvrdu
      new Notification("Veronica Method 🌸", {
        body: "You'll get gentle reminders for your daily sessions.",
        icon: "/icon-192.png",
      });

      // Registruj push subscription na serveru
      await registerPushSubscription();
    }
    setShow(false);
    localStorage.setItem("notifDismissed", "true");
  }

  function dismiss() {
    setShow(false);
    localStorage.setItem("notifDismissed", "true");
  }

  if (!show) return null;

  return (
    <div className="fixed top-20 left-3 right-3 z-50 md:left-auto md:right-4 md:max-w-xs animate-in slide-in-from-right-4">
      <div className="soft-card p-3 shadow-xl border border-[#d8a7b5]/20">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">🔔</span>
          <div className="flex-1">
            <p className="text-sm text-[#4a3f44] font-medium mb-1">
              Stay on track
            </p>
            <p className="text-xs text-[#7b6870] mb-3">
              Get a gentle reminder when it&apos;s time for your daily session.
            </p>
            <div className="flex gap-2">
              <button onClick={requestPermission} className="btn-primary px-3 py-1.5 text-xs">
                Enable
              </button>
              <button onClick={dismiss} className="text-xs text-[#8f6878] hover:text-[#6b3a4d]">
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Registruje push subscription na serveru za buduće notifikacije.
 * Radi samo ako je service worker aktivan i VAPID key podešen.
 */
async function registerPushSubscription() {
  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    const registration = await navigator.serviceWorker.ready;

    // VAPID public key za push notifikacije
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) {
      console.log("[notifications] VAPID key not configured — skipping push registration");
      return;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });

    // Pošalji subscription na server
    const subJson = subscription.toJSON();
    await fetch("/api/push-subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        endpoint: subJson.endpoint,
        p256dh: subJson.keys?.p256dh,
        auth: subJson.keys?.auth,
      }),
    });

    console.log("[notifications] Push subscription registered");
  } catch (err) {
    console.error("[notifications] Failed to register push:", err);
  }
}

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer as ArrayBuffer;
}

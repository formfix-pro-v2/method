// ============================================================
// OFFLINE QUEUE — queues failed API writes for background sync
// ============================================================
// When the app is offline, POST/PUT/DELETE requests are queued
// in the service worker. When connectivity returns, the SW
// replays them via Background Sync API.
// ============================================================

/**
 * Send a request that will be queued if offline.
 * Falls back to normal fetch if SW or Background Sync unavailable.
 */
export async function resilientFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response | null> {
  try {
    const response = await fetch(url, options);
    return response;
  } catch {
    // Network error — queue for background sync
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "QUEUE_REQUEST",
        url,
        method: options.method || "POST",
        headers: options.headers || { "Content-Type": "application/json" },
        body: options.body || null,
      });
      console.log("[offline-queue] Request queued for background sync:", url);
    }
    return null;
  }
}

/**
 * Check if the app is currently online.
 */
export function isOnline(): boolean {
  return typeof navigator !== "undefined" ? navigator.onLine : true;
}

/**
 * Register a callback for online/offline status changes.
 */
export function onConnectivityChange(callback: (online: boolean) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}

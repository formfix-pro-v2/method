// ============================================================
// OFFLINE QUEUE — queues failed API writes for background sync
// ============================================================
// When the app is offline, POST/PUT/DELETE requests are queued
// in the service worker AND localStorage. When connectivity
// returns, the SW replays them via Background Sync API.
// If SW is unavailable, the app replays them on next online event.
// ============================================================

const QUEUE_KEY = "vm-offline-queue";

type QueueItem = {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | null;
  timestamp: number;
};

function getLocalQueue(): QueueItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLocalQueue(queue: QueueItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

/**
 * Replay any queued requests when back online.
 */
export async function replayOfflineQueue(): Promise<number> {
  const queue = getLocalQueue();
  if (queue.length === 0) return 0;

  const remaining: QueueItem[] = [];
  let replayed = 0;

  for (const item of queue) {
    try {
      const res = await fetch(item.url, {
        method: item.method,
        headers: item.headers,
        body: item.body,
      });
      if (res.ok || res.status < 500) {
        replayed++;
      } else {
        remaining.push(item); // Server error, retry later
      }
    } catch {
      remaining.push(item); // Still offline
    }
  }

  saveLocalQueue(remaining);
  return replayed;
}

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
    const queueItem: QueueItem = {
      url,
      method: (options.method as string) || "POST",
      headers: (options.headers as Record<string, string>) || { "Content-Type": "application/json" },
      body: (options.body as string) || null,
      timestamp: Date.now(),
    };

    // Save to localStorage as backup
    const queue = getLocalQueue();
    queue.push(queueItem);
    saveLocalQueue(queue);

    // Also notify service worker
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "QUEUE_REQUEST",
        ...queueItem,
      });
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
 * Automatically replays queued requests when coming back online.
 */
export function onConnectivityChange(callback: (online: boolean) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleOnline = () => {
    callback(true);
    // Auto-replay queued requests
    replayOfflineQueue();
  };
  const handleOffline = () => callback(false);

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}

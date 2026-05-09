// ============================================================
// VERONICA METHOD — Service Worker v5
// ============================================================
// Strategies:
//   - Precache: critical shell assets
//   - Cache-first: exercise images, fonts
//   - Network-first: app pages (cached for offline)
//   - Network-only: API calls (with background sync queue)
// ============================================================

const CACHE_NAME = "veronica-v5";
const OFFLINE_URL = "/offline.html";

// Critical assets to precache on install
const PRECACHE_URLS = [
  "/offline.html",
  "/icon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/logo.png",
  "/favicon.ico",
  "/manifest.json",
];

// App pages to cache after first visit
const APP_PAGES = [
  "/dashboard",
  "/session",
  "/supplements",
  "/rest-day",
  "/progress",
  "/checkin",
  "/nutrition",
  "/journal",
  "/shopping",
  "/weekly-summary",
  "/favorites",
];

// Background sync queue for offline writes
const SYNC_QUEUE_KEY = "vm-sync-queue";

// ============================================================
// INSTALL — precache critical assets
// ============================================================
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// ============================================================
// ACTIVATE — clean old caches
// ============================================================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ============================================================
// FETCH — routing by request type
// ============================================================
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET for caching (POST/PUT/DELETE handled by sync queue)
  if (request.method !== "GET") return;

  // Skip API calls — they should go to network only
  if (url.pathname.startsWith("/api/")) return;

  // Skip Supabase / external requests
  if (!url.origin.includes(self.location.origin)) return;

  // ---- Navigation requests (HTML pages) ----
  if (request.mode === "navigate") {
    event.respondWith(networkFirstWithCache(request));
    return;
  }

  // ---- Exercise images — cache first (they rarely change) ----
  if (url.pathname.startsWith("/exercises/")) {
    event.respondWith(cacheFirstWithNetwork(request));
    return;
  }

  // ---- Static assets (JS, CSS, fonts, icons) — stale-while-revalidate ----
  if (
    url.pathname.match(/\.(js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|webp|ico)$/)
  ) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // ---- Everything else — network first ----
  event.respondWith(networkFirstWithCache(request));
});

// ============================================================
// CACHING STRATEGIES
// ============================================================

/** Network first, fall back to cache, then offline page */
async function networkFirstWithCache(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const url = new URL(request.url);
      // Cache app pages and successful responses
      if (
        request.mode === "navigate" ||
        APP_PAGES.some((p) => url.pathname.startsWith(p))
      ) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
      }
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // For navigation, show offline page
    if (request.mode === "navigate") {
      return caches.match(OFFLINE_URL);
    }
    return new Response("Offline", { status: 503 });
  }
}

/** Cache first, fall back to network (for images) */
async function cacheFirstWithNetwork(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Return a transparent 1x1 pixel as fallback for images
    return new Response(
      new Uint8Array([
        0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80,
        0x00, 0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x21, 0xf9, 0x04,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3b,
      ]),
      { headers: { "Content-Type": "image/gif" } }
    );
  }
}

/** Serve from cache immediately, update in background */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  return cached || (await fetchPromise) || new Response("Offline", { status: 503 });
}

// ============================================================
// BACKGROUND SYNC — retry failed API writes when back online
// ============================================================
self.addEventListener("sync", (event) => {
  if (event.tag === "vm-sync") {
    event.waitUntil(replayQueue());
  }
});

async function replayQueue() {
  try {
    // Read queue from IndexedDB or fallback
    const queue = await getQueue();
    const remaining = [];

    for (const item of queue) {
      try {
        const response = await fetch(item.url, {
          method: item.method,
          headers: item.headers,
          body: item.body,
        });
        if (!response.ok && response.status >= 500) {
          remaining.push(item); // Retry server errors
        }
        // 4xx errors are dropped (bad data)
      } catch {
        remaining.push(item); // Network error, retry later
      }
    }

    await setQueue(remaining);
  } catch {
    // Queue processing failed, will retry on next sync
  }
}

// Simple queue storage using Cache API (works in SW context)
async function getQueue() {
  try {
    const cache = await caches.open("vm-sync-queue");
    const response = await cache.match("/queue");
    if (!response) return [];
    return await response.json();
  } catch {
    return [];
  }
}

async function setQueue(items) {
  try {
    const cache = await caches.open("vm-sync-queue");
    await cache.put(
      "/queue",
      new Response(JSON.stringify(items), {
        headers: { "Content-Type": "application/json" },
      })
    );
  } catch {
    // Storage failed
  }
}

// ============================================================
// MESSAGE HANDLER — receive queue items from the app
// ============================================================
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "QUEUE_REQUEST") {
    event.waitUntil(
      (async () => {
        const queue = await getQueue();
        queue.push({
          url: event.data.url,
          method: event.data.method,
          headers: event.data.headers,
          body: event.data.body,
          timestamp: Date.now(),
        });
        await setQueue(queue);

        // Request background sync
        if (self.registration && self.registration.sync) {
          try {
            await self.registration.sync.register("vm-sync");
          } catch {
            // Background sync not supported, will retry on next page load
          }
        }
      })()
    );
  }

  // Cache cleanup on demand
  if (event.data && event.data.type === "CLEAR_CACHE") {
    event.waitUntil(caches.delete(CACHE_NAME));
  }
});

// ============================================================
// PUSH NOTIFICATIONS (placeholder for future integration)
// ============================================================
self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.body || "Time for your daily wellness routine!",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      vibrate: [100, 50, 100],
      data: { url: data.url || "/dashboard" },
      actions: [
        { action: "open", title: "Open App" },
        { action: "dismiss", title: "Later" },
      ],
    };

    event.waitUntil(
      self.registration.showNotification(data.title || "Veronica Method", options)
    );
  } catch {
    // Invalid push data
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const url = event.notification.data?.url || "/dashboard";
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      // Focus existing tab if open
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Open new tab
      return self.clients.openWindow(url);
    })
  );
});

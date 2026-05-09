// ============================================================
// IN-MEMORY RATE LIMITER
// ============================================================
// Simple sliding-window rate limiter for API routes.
// Works per-process (resets on deploy). For production at scale,
// swap with Redis-based (Upstash) or Vercel KV.
// ============================================================

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (entry.resetAt <= now) store.delete(key);
    }
  }, 5 * 60 * 1000);
}

type RateLimitConfig = {
  /** Max requests allowed in the window */
  limit: number;
  /** Window size in seconds */
  windowSeconds: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

/**
 * Check rate limit for a given key (usually IP or userId).
 * Returns whether the request is allowed and how many remain.
 */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  // No existing entry or window expired → fresh window
  if (!entry || entry.resetAt <= now) {
    const resetAt = now + config.windowSeconds * 1000;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: config.limit - 1, resetAt };
  }

  // Within window
  if (entry.count < config.limit) {
    entry.count++;
    return { allowed: true, remaining: config.limit - entry.count, resetAt: entry.resetAt };
  }

  // Rate limited
  return { allowed: false, remaining: 0, resetAt: entry.resetAt };
}

/**
 * Extract a rate-limit key from a request.
 * Uses X-Forwarded-For (Vercel), then falls back to a generic key.
 */
export function getRateLimitKey(request: Request, prefix: string): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return `${prefix}:${ip}`;
}

/**
 * Helper: returns a 429 Response with Retry-After header.
 */
export function rateLimitResponse(resetAt: number): Response {
  const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
  return new Response(
    JSON.stringify({ error: "Too many requests. Please try again later." }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfter),
        "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
      },
    }
  );
}

// ============================================================
// PRESET CONFIGS for different route types
// ============================================================

/** Standard API routes — 30 req / 60 sec */
export const STANDARD_LIMIT: RateLimitConfig = { limit: 30, windowSeconds: 60 };

/** Auth-sensitive routes — 10 req / 60 sec */
export const AUTH_LIMIT: RateLimitConfig = { limit: 10, windowSeconds: 60 };

/** Write-heavy routes (checkin, journal) — 20 req / 60 sec */
export const WRITE_LIMIT: RateLimitConfig = { limit: 20, windowSeconds: 60 };

/** Public endpoints (leads, email capture) — 5 req / 60 sec */
export const PUBLIC_LIMIT: RateLimitConfig = { limit: 5, windowSeconds: 60 };

/** Webhook endpoints — 100 req / 60 sec */
export const WEBHOOK_LIMIT: RateLimitConfig = { limit: 100, windowSeconds: 60 };

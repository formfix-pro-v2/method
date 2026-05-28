// ============================================================
// WEB VITALS MONITORING
// Tracks Core Web Vitals (LCP, FID, CLS) and reports to console.
// Can be extended to send to analytics endpoint.
// ============================================================

type Metric = {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
};

const thresholds: Record<string, [number, number]> = {
  LCP: [2500, 4000],
  FID: [100, 300],
  CLS: [0.1, 0.25],
  FCP: [1800, 3000],
  TTFB: [800, 1800],
  INP: [200, 500],
};

function getRating(name: string, value: number): Metric["rating"] {
  const [good, poor] = thresholds[name] || [Infinity, Infinity];
  if (value <= good) return "good";
  if (value <= poor) return "needs-improvement";
  return "poor";
}

export function reportWebVitals(metric: { name: string; value: number }) {
  const rating = getRating(metric.name, metric.value);

  // Log poor metrics for debugging
  if (rating === "poor") {
    console.warn(`[web-vitals] ${metric.name}: ${metric.value.toFixed(1)}ms (${rating})`);
  }

  // Future: send to analytics endpoint
  // if (process.env.NODE_ENV === "production") {
  //   fetch("/api/vitals", {
  //     method: "POST",
  //     body: JSON.stringify({ ...metric, rating, page: window.location.pathname }),
  //   }).catch(() => {});
  // }
}

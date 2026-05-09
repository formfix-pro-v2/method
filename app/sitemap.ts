import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://veronica-method.vercel.app";

  return [
    // Core pages
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/quiz`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/nutrition`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/supplements`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },

    // Plans
    { url: `${base}/plans/glow`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/plans/elite`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },

    // Blog
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/blog/exercises-for-hot-flashes`, lastModified: new Date("2025-01-15"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/menopause-meal-plan-budget`, lastModified: new Date("2025-01-20"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/sleep-better-after-40`, lastModified: new Date("2025-02-01"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/pelvic-floor-beginners`, lastModified: new Date("2025-02-10"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/joint-pain-menopause`, lastModified: new Date("2025-02-20"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/confidence-posture-midlife`, lastModified: new Date("2025-03-01"), changeFrequency: "monthly", priority: 0.7 },

    // Utility pages
    { url: `${base}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}

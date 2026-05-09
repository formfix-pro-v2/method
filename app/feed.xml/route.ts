const SITE_URL = "https://veronica-method.vercel.app";

const posts = [
  {
    title: "Confidence & Posture in Midlife",
    slug: "confidence-posture-midlife",
    description: "How posture exercises can rebuild confidence during menopause.",
    date: "2025-03-15",
  },
  {
    title: "Exercises for Hot Flashes",
    slug: "exercises-for-hot-flashes",
    description: "Evidence-based breathing and movement techniques to reduce hot flash frequency.",
    date: "2025-03-10",
  },
  {
    title: "Joint Pain & Menopause",
    slug: "joint-pain-menopause",
    description: "Why joints hurt during menopause and gentle exercises that help.",
    date: "2025-03-05",
  },
  {
    title: "Pelvic Floor for Beginners",
    slug: "pelvic-floor-beginners",
    description: "A gentle introduction to pelvic floor exercises for women over 40.",
    date: "2025-02-28",
  },
  {
    title: "Sleep Better After 40",
    slug: "sleep-better-after-40",
    description: "Evening routines and exercises that improve sleep quality during menopause.",
    date: "2025-02-20",
  },
  {
    title: "Menopause Meal Plan on a Budget",
    slug: "menopause-meal-plan-budget",
    description: "Healthy eating for under €7/day during menopause.",
    date: "2025-02-15",
  },
];

export async function GET() {
  const items = posts
    .map(
      (post) => `
    <item>
      <title>${post.title}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <description>${post.description}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid>${SITE_URL}/blog/${post.slug}</guid>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Veronica Method Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Evidence-based exercises, nutrition and wellness tips for women navigating menopause.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

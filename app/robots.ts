import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://veronica-method.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/checkout/",
          "/account/",
          "/dashboard/",
          "/session/",
          "/progress/",
          "/journal/",
          "/favorites/",
          "/shopping/",
          "/weekly-summary/",
          "/onboarding/",
          "/rest-day/",
          "/checkin/",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}

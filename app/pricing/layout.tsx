import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plans & Pricing",
  description:
    "Choose your Veronica Method plan. Glow (€29/30 days) or Elite (€79/90 days). Personalized exercises, meal plans under €7/day, progress tracking. 30-day money-back guarantee.",
  openGraph: {
    title: "Veronica Method — Plans & Pricing",
    description: "Personalized menopause wellness programs from €29. 30-day money-back guarantee.",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Veronica Method",
            description: "Complete menopause wellness program with personalized exercises, nutrition plans and supplement guidance.",
            brand: { "@type": "Brand", name: "Veronica Method" },
            offers: [
              {
                "@type": "Offer",
                name: "Glow Plan",
                price: "29",
                priceCurrency: "EUR",
                availability: "https://schema.org/InStock",
                priceValidUntil: "2027-12-31",
                description: "30-day menopause wellness program",
              },
              {
                "@type": "Offer",
                name: "Elite Plan",
                price: "79",
                priceCurrency: "EUR",
                availability: "https://schema.org/InStock",
                priceValidUntil: "2027-12-31",
                description: "90-day premium transformation program",
              },
            ],
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              reviewCount: "347",
            },
          }),
        }}
      />
      {children}
    </>
  );
}

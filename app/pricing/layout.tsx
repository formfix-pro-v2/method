import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plans & Pricing",
  description:
    "Choose your Veronica Method plan. Glow (€29/30 days) or Elite (€79/90 days). Personalized exercises, meal plans under €7/day, progress tracking. 30-day money-back guarantee.",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}

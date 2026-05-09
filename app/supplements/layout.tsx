import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menopause Supplement Guide",
  description: "Evidence-based supplement recommendations for menopause: Vitamin D, Magnesium, Omega-3, Calcium and more with exact doses and timing.",
};

export default function SupplementsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

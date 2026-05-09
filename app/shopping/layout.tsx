import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping List",
  description: "Auto-generated grocery list from your personalized meal plan. Budget-friendly, organized by category, printable.",
  robots: { index: false },
};

export default function ShoppingLayout({ children }: { children: React.ReactNode }) {
  return children;
}

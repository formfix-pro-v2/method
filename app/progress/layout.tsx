import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Progress Tracker",
  description: "Track your menopause wellness journey. See sleep, energy and stress trends, achievements and weekly progress over time.",
  robots: { index: false },
};

export default function ProgressLayout({ children }: { children: React.ReactNode }) {
  return children;
}

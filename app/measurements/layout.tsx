import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Measurements",
  description: "Track your body measurements, weight, and confidence over time. See your before/after transformation.",
  robots: { index: false },
};

export default function MeasurementsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

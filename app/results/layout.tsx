import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Results",
  description: "Your personalized hormone-balance blueprint. See your nutrition plan, calorie targets and sample meals based on your assessment.",
};

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

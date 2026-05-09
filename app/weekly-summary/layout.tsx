import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weekly Summary",
  description: "Your week in review — sessions completed, wellness averages, streak status and personalized feedback.",
  robots: { index: false },
};

export default function WeeklySummaryLayout({ children }: { children: React.ReactNode }) {
  return children;
}

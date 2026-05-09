import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Dashboard",
  description:
    "Your personalized wellness dashboard. Daily exercises, meal plans, nutrition tracking and progress — all in one place.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}

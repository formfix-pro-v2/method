import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journey Journal",
  description: "Reflect on your wellness journey at key milestones. Track your transformation from Day 1 to Day 90.",
  robots: { index: false },
};

export default function JournalLayout({ children }: { children: React.ReactNode }) {
  return children;
}

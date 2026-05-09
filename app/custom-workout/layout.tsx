import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Workout Builder",
  description: "Build your own workout by choosing exercises from our library. Mix and match from 84 exercises across 10 categories.",
  robots: { index: false },
};

export default function CustomWorkoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

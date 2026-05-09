import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personalized Nutrition",
  description: "Budget-friendly meal plans under €7/day designed for menopause. Personalized calories, macros and hormone-friendly recipes.",
};

export default function NutritionLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Wellness Assessment",
  description:
    "Take our free 2-minute assessment to get a personalized menopause wellness plan. Tailored exercises, nutrition and symptom support based on your body and goals.",
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}

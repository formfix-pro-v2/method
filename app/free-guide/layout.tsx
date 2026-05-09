import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Menopause Wellness Guide",
  description: "Download our free 30-page guide: exercises, 7-day meal plan, supplement doses, breathing techniques and daily routines for women 40+.",
};

export default function FreeGuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}

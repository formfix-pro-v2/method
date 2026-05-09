import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rest Day",
  description: "Your guided rest and recovery day. Meditation, journaling prompts, self-care tips and affirmations.",
  robots: { index: false },
};

export default function RestDayLayout({ children }: { children: React.ReactNode }) {
  return children;
}

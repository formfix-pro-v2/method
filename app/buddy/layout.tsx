import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invite a Buddy",
  description: "Invite a friend to join your menopause wellness journey. Workout together, stay accountable, both get 7 bonus days.",
  robots: { index: false },
};

export default function BuddyLayout({ children }: { children: React.ReactNode }) {
  return children;
}

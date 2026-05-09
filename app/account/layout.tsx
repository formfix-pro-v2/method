import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your Veronica Method account, membership, data export and privacy settings.",
  robots: { index: false },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}

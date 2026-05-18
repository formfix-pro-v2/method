import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Our 30-day money-back guarantee and refund policy for Veronica Method programs.",
};

export default function RefundLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using the Veronica Method wellness platform. Subscription terms, refund policy and usage guidelines.",
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

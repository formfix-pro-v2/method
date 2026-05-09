import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Veronica Method collects, uses and protects your personal data. GDPR compliant privacy policy.",
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}

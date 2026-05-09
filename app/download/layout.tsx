import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Download App",
  description: "Download Veronica Method on your phone. Available for Android (APK) and iPhone (Add to Home Screen).",
};

export default function DownloadLayout({ children }: { children: React.ReactNode }) {
  return children;
}

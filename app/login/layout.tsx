import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Veronica Method account or create a new one to start your personalized wellness journey.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Favorites",
  description: "Your saved exercises and meals. Quick access to the routines and recipes you love most.",
  robots: { index: false },
};

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
  return children;
}

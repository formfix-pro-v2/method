export type FavoriteItem = {
  type: "meal" | "exercise";
  name: string;
  addedAt: string;
};

export function getFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("favorites") || "[]");
  } catch {
    return [];
  }
}

export function isFavorite(name: string): boolean {
  return getFavorites().some((f) => f.name === name);
}

export function toggleFavorite(type: "meal" | "exercise", name: string): boolean {
  const favs = getFavorites();
  const exists = favs.findIndex((f) => f.name === name);

  if (exists >= 0) {
    favs.splice(exists, 1);
    localStorage.setItem("favorites", JSON.stringify(favs));
    // Async sync — fire and forget
    import("@/lib/sync").then((m) => m.pushSingle("favorites")).catch(() => {});
    return false; // removed
  } else {
    favs.push({ type, name, addedAt: new Date().toISOString() });
    localStorage.setItem("favorites", JSON.stringify(favs));
    // Async sync — fire and forget
    import("@/lib/sync").then((m) => m.pushSingle("favorites")).catch(() => {});
    return true; // added
  }
}

"use client";

import { useState, useEffect } from "react";
import { isFavorite, toggleFavorite } from "@/lib/favorites";

export default function FavoriteButton({
  type,
  name,
}: {
  type: "meal" | "exercise";
  name: string;
}) {
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setFav(isFavorite(name));
  }, [name]);

  function handleToggle() {
    const result = toggleFavorite(type, name);
    setFav(result);
  }

  return (
    <button
      onClick={handleToggle}
      className="no-print p-1.5 rounded-lg hover:bg-[#fdf2f5] transition-colors"
      aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      title={fav ? "Remove from favorites" : "Add to favorites"}
    >
      <svg
        className={`w-4 h-4 transition-colors ${fav ? "text-red-400 fill-red-400" : "text-[#d8a7b5]"}`}
        fill={fav ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}

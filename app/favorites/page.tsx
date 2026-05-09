"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getFavorites, toggleFavorite, type FavoriteItem } from "@/lib/favorites";

export default function FavoritesPage() {
  const [favs, setFavs] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    setFavs(getFavorites());
  }, []);

  function remove(name: string, type: "meal" | "exercise") {
    toggleFavorite(type, name);
    setFavs(getFavorites());
  }

  const meals = favs.filter((f) => f.type === "meal");
  const exercises = favs.filter((f) => f.type === "exercise");

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <section className="soft-card p-8 mb-6">
        <p className="uppercase tracking-[0.25em] text-xs text-[#b98fa1] mb-2 font-bold">
          Saved Items
        </p>
        <h1 className="text-4xl text-[#4a3f44]">My Favorites</h1>
      </section>

      {favs.length === 0 ? (
        <section className="soft-card p-10 text-center">
          <div className="text-4xl mb-3">💝</div>
          <h2 className="text-xl text-[#4a3f44] mb-2">No favorites yet</h2>
          <p className="text-sm text-[#7b6870] mb-4">
            Tap the heart icon on any meal or exercise to save it here.
          </p>
          <Link href="/dashboard" className="btn-primary">Go to Dashboard</Link>
        </section>
      ) : (
        <>
          {meals.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl text-[#4a3f44] mb-3">🥗 Favorite Meals</h2>
              <div className="space-y-2">
                {meals.map((f) => (
                  <div key={f.name} className="soft-card p-4 flex items-center justify-between">
                    <span className="text-sm text-[#4a3f44]">{f.name}</span>
                    <button
                      onClick={() => remove(f.name, "meal")}
                      className="text-xs text-red-400 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {exercises.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl text-[#4a3f44] mb-3">🧘‍♀️ Favorite Exercises</h2>
              <div className="space-y-2">
                {exercises.map((f) => (
                  <div key={f.name} className="soft-card p-4 flex items-center justify-between">
                    <span className="text-sm text-[#4a3f44]">{f.name}</span>
                    <button
                      onClick={() => remove(f.name, "exercise")}
                      className="text-xs text-red-400 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <div className="flex gap-3 justify-center mt-6">
        <Link href="/dashboard" className="btn-primary">Dashboard</Link>
        <Link href="/custom-workout" className="btn-outline">Build Custom Workout</Link>
        <Link href="/nutrition" className="btn-outline">Meal Plans</Link>
      </div>
    </main>
  );
}

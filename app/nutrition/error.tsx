"use client";

import ErrorCard from "@/components/ErrorCard";

export default function NutritionError({ reset }: { reset: () => void }) {
  return (
    <ErrorCard
      title="Nutrition Error"
      message="Couldn't load your meal plan. Please try again."
      icon="🥗"
      onRetry={reset}
      backHref="/dashboard"
    />
  );
}

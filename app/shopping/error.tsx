"use client";

import ErrorCard from "@/components/ErrorCard";

export default function ShoppingError({ reset }: { reset: () => void }) {
  return (
    <ErrorCard
      title="Shopping List Error"
      message="Couldn't generate your grocery list. Please try again."
      icon="🛒"
      onRetry={reset}
      backHref="/dashboard"
    />
  );
}

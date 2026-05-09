"use client";

import ErrorCard from "@/components/ErrorCard";

export default function ProgressError({ reset }: { reset: () => void }) {
  return (
    <ErrorCard
      title="Progress Error"
      message="Couldn't load your progress data. Your check-ins are safe."
      icon="📊"
      onRetry={reset}
      backHref="/dashboard"
    />
  );
}

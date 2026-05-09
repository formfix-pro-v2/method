"use client";

import ErrorCard from "@/components/ErrorCard";

export default function WeeklySummaryError({ reset }: { reset: () => void }) {
  return (
    <ErrorCard
      title="Weekly Summary Error"
      message="Couldn't load your weekly report. Please try again."
      icon="📅"
      onRetry={reset}
      backHref="/dashboard"
    />
  );
}

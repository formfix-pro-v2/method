"use client";

import ErrorCard from "@/components/ErrorCard";

export default function JournalError({ reset }: { reset: () => void }) {
  return (
    <ErrorCard
      title="Journal Error"
      message="Couldn't load your journal. Your entries are saved safely."
      icon="📖"
      onRetry={reset}
      backHref="/dashboard"
    />
  );
}

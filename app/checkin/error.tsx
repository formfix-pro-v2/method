"use client";

import ErrorCard from "@/components/ErrorCard";

export default function CheckinError({ reset }: { reset: () => void }) {
  return (
    <ErrorCard
      title="Check-In Error"
      message="Couldn't load the check-in form. Please try again."
      icon="📝"
      onRetry={reset}
      backHref="/dashboard"
    />
  );
}

"use client";

/**
 * Reusable error display card.
 * Used by both page-level error.tsx files and inline SectionErrorBoundary.
 */
export default function ErrorCard({
  title = "Something went wrong",
  message = "Don't worry — your progress is saved. This is just a temporary glitch.",
  icon = "😔",
  onRetry,
  retryLabel = "Try Again",
  backHref,
  backLabel = "Go to Dashboard",
  compact = false,
}: {
  title?: string;
  message?: string;
  icon?: string;
  onRetry?: () => void;
  retryLabel?: string;
  backHref?: string;
  backLabel?: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "p-4" : "flex items-center justify-center px-6 py-10"}>
      <div className={`soft-card text-center ${compact ? "p-5" : "p-8 max-w-md"}`}>
        <div className={compact ? "text-2xl mb-2" : "text-4xl mb-4"}>{icon}</div>
        <h2 className={`text-[#4a3f44] mb-1 ${compact ? "text-lg" : "text-2xl"}`}>{title}</h2>
        <p className={`text-[#7b6870] mb-4 ${compact ? "text-xs" : "text-sm"}`}>{message}</p>
        <div className={`flex gap-3 justify-center ${compact ? "flex-row" : "flex-col sm:flex-row"}`}>
          {onRetry && (
            <button onClick={onRetry} className={`btn-primary ${compact ? "py-1.5 px-4 text-xs" : "py-2.5 px-6"}`}>
              {retryLabel}
            </button>
          )}
          {backHref && (
            <a href={backHref} className={`btn-outline ${compact ? "py-1.5 px-4 text-xs" : "py-2.5 px-6"}`}>
              {backLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

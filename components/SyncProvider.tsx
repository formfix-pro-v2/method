"use client";

import { useSync } from "@/lib/hooks/useSync";

/**
 * SyncProvider — renders nothing visible, just runs the sync engine.
 * Drop this into any layout to enable automatic data synchronization.
 * Shows a subtle indicator when syncing is in progress.
 */
export default function SyncProvider() {
  const { status } = useSync();

  if (status === "syncing") {
    return (
      <div className="fixed top-2 right-2 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fdf2f5]/90 border border-[#f0e3e8] backdrop-blur-sm text-[10px] text-[#b98fa1] font-medium shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#d8a7b5] animate-pulse" />
        Syncing...
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="fixed top-2 right-2 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50/90 border border-amber-200 backdrop-blur-sm text-[10px] text-amber-600 font-medium shadow-sm">
        <span className="w-2 h-2 rounded-full bg-amber-400" />
        Sync failed — will retry
      </div>
    );
  }

  return null;
}

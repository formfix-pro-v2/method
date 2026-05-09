"use client";

import { useEffect, useState } from "react";
import { onConnectivityChange, isOnline } from "@/lib/offline-queue";

/**
 * Shows a subtle banner when the user goes offline.
 * Automatically hides when connectivity returns.
 */
export default function OfflineIndicator() {
  const [online, setOnline] = useState(true);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    setOnline(isOnline());

    const unsub = onConnectivityChange((status) => {
      if (status && !online) {
        // Just came back online — show brief "reconnected" message
        setShowReconnected(true);
        setTimeout(() => setShowReconnected(false), 3000);
      }
      setOnline(status);
    });

    return unsub;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (showReconnected) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-xs animate-in slide-in-from-bottom-4">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-green-50/95 border border-green-200 backdrop-blur-sm shadow-lg">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs text-green-700 font-medium">Back online — syncing your data</span>
        </div>
      </div>
    );
  }

  if (online) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-xs animate-in slide-in-from-bottom-4">
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-50/95 border border-amber-200 backdrop-blur-sm shadow-lg">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        <span className="text-xs text-amber-700 font-medium">You&apos;re offline — changes will sync when reconnected</span>
      </div>
    </div>
  );
}

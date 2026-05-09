// ============================================================
// useSync — React hook for automatic data synchronization
// ============================================================
// Runs fullSync on mount (login), then listens for online/focus
// events to re-sync. Exposes status for UI indicators.
// ============================================================

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { fullSync, getSyncStatus, onSyncStatus, pushSingle } from "@/lib/sync";

export function useSync() {
  const [status, setStatus] = useState(getSyncStatus());
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const syncingRef = useRef(false);

  // Subscribe to sync status changes
  useEffect(() => {
    const unsub = onSyncStatus(setStatus);
    setLastSynced(localStorage.getItem("lastSyncedAt"));
    return unsub;
  }, []);

  // Initial sync on mount
  useEffect(() => {
    if (syncingRef.current) return;
    syncingRef.current = true;

    fullSync().then(() => {
      setLastSynced(localStorage.getItem("lastSyncedAt"));
      syncingRef.current = false;
    });
  }, []);

  // Re-sync when tab regains focus or comes back online
  useEffect(() => {
    function handleSync() {
      if (syncingRef.current) return;
      syncingRef.current = true;
      fullSync().then(() => {
        setLastSynced(localStorage.getItem("lastSyncedAt"));
        syncingRef.current = false;
      });
    }

    window.addEventListener("online", handleSync);
    window.addEventListener("focus", handleSync);

    return () => {
      window.removeEventListener("online", handleSync);
      window.removeEventListener("focus", handleSync);
    };
  }, []);

  const manualSync = useCallback(async () => {
    if (syncingRef.current) return;
    syncingRef.current = true;
    await fullSync();
    setLastSynced(localStorage.getItem("lastSyncedAt"));
    syncingRef.current = false;
  }, []);

  return {
    status,
    lastSynced,
    sync: manualSync,
    pushSingle,
  };
}

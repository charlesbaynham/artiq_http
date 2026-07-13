import { useCallback, useEffect, useState } from "react";

// Custom event name used to keep every hook instance for the same key in sync
// within a single tab (the native "storage" event only fires in *other* tabs).
const SYNC_EVENT = "local-storage-state-sync";

/**
 * A useState-like hook whose value is persisted to localStorage and shared
 * across every component that uses the same key (both within this tab and
 * across other tabs/windows of the same origin).
 *
 * @param {string} key - localStorage key.
 * @param {string} initialValue - value used when nothing is stored yet.
 * @returns {[string, (v: string) => void]}
 */
export default function useLocalStorageState(key, initialValue) {
  const read = useCallback(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored === null ? initialValue : stored;
    } catch {
      // localStorage may be unavailable (private mode, disabled): fall back.
      return initialValue;
    }
  }, [key, initialValue]);

  const [value, setValue] = useState(read);

  const setStoredValue = useCallback(
    (next) => {
      setValue(next);
      try {
        if (next === "" || next === null || next === undefined) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, next);
        }
      } catch {
        // Ignore write failures; in-memory state still updates.
      }
      // Notify other hook instances in this tab.
      window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key } }));
    },
    [key],
  );

  // Re-read when another instance (this tab) or another tab changes the value.
  useEffect(() => {
    const handleSync = (e) => {
      if (e.detail?.key === key) setValue(read());
    };
    const handleStorage = (e) => {
      if (e.key === key) setValue(read());
    };
    window.addEventListener(SYNC_EVENT, handleSync);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(SYNC_EVENT, handleSync);
      window.removeEventListener("storage", handleStorage);
    };
  }, [key, read]);

  return [value, setStoredValue];
}

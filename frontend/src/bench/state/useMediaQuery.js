/**
 * One matchMedia helper for the whole bench — no duplicated breakpoint logic.
 *
 * Breakpoints (IMPL-SPEC §11):
 *   <700px   mobile (2b layout)
 *   <900px   narrow — single column, submit/live become tabs
 *   900–1200 medium — submit pane shrinks, fragment tree becomes a slide-over
 *   ≥1200px  the 2a desktop layout
 *
 * SSR-safe (returns false when there is no `window`), listener-based, no
 * polling.
 */

import { useEffect, useState } from "react";

export const BP_MOBILE = 700;
export const BP_NARROW = 900;
export const BP_DESKTOP = 1200;

function matches(query) {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(query).matches;
}

/**
 * @param {string} query - a CSS media query, e.g. "(max-width: 699.98px)".
 * @returns {boolean}
 */
export function useMediaQuery(query) {
  const [value, setValue] = useState(() => matches(query));

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mql = window.matchMedia(query);
    const onChange = (e) => setValue(e.matches);
    // Re-sync on mount in case the viewport changed between render and effect.
    setValue(mql.matches);
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }
    // Safari < 14
    mql.addListener(onChange);
    return () => mql.removeListener(onChange);
  }, [query]);

  return value;
}

/** true below 700px — the 2b mobile layout. */
export function useIsMobile() {
  return useMediaQuery(`(max-width: ${BP_MOBILE - 0.02}px)`);
}

/** true below 900px — single column, submit/live as tabs. */
export function useIsNarrow() {
  return useMediaQuery(`(max-width: ${BP_NARROW - 0.02}px)`);
}

/** true in 900–1200px — submit pane shrinks, tree collapses to a slide-over. */
export function useIsMedium() {
  return useMediaQuery(
    `(min-width: ${BP_NARROW}px) and (max-width: ${BP_DESKTOP - 0.02}px)`,
  );
}

/** true at 1200px and above — the full 2a desktop layout. */
export function useIsDesktop() {
  return useMediaQuery(`(min-width: ${BP_DESKTOP}px)`);
}

export default useMediaQuery;

/**
 * Shared live-run subscription for the desktop workspace (IMPL-SPEC §6/§7,
 * wave-2 polish).
 *
 * `TopBar`'s live-status readout, `SubmitPane`'s duration estimate and
 * `LivePane`'s plot card all watch the *same* resolved run (`pinnedLiveRid`,
 * or the newest running/most-recent run) — before this context existed each
 * of the three called `useLiveRun()` independently, which meant up to three
 * concurrent `EventSource`s open against the same SSE prefix. `LivePane`'s
 * embedded `PlotsApp` already avoided a fourth via `useLiveRun`'s `feed`
 * option (see that hook's docstring); this context lifts the *host* side of
 * that mechanism — the one real `useLiveRun()` call and the `feed` state it
 * takes a raw SSE payload through — up above all three consumers, so the
 * workspace opens exactly one `EventSource` for the watched run.
 *
 * `useLiveRun` itself is unchanged and still called directly by the mobile
 * screens (`MobileApp`, `MobileHome`, `RunDetail`) and `/plots` — this
 * context is additive, not a replacement for the hook's standalone API.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";

import { useSession } from "./SessionContext";
import { useLiveRun } from "./useLiveRun";

const LiveRunContext = createContext(null);

/**
 * Mounted once around the desktop workspace (`BenchApp`'s `BenchWorkspace`).
 * `scheduleItems` is passed down from the shell's single `useSchedule()` call
 * — the same value `TopBar` and `LivePane` already received as a prop, now
 * also feeding the shared `useLiveRun()` call instead of each consumer
 * re-deriving it.
 */
export function LiveRunProvider({ scheduleItems, children }) {
  const { state } = useSession();

  // Raw SSE payload forwarded up from whichever embedded PlotsApp instance
  // (today, only LivePlotCard's) already holds a subscription to the
  // resolved run's prefix — see `useLiveRun`'s `feed` option. Reported via
  // `reportFeed` below instead of each consumer keeping its own local state,
  // so the one `useLiveRun` call here is the one that benefits from it.
  const [feed, setFeed] = useState(null); // {prefix, data} | null
  const reportFeed = useCallback((prefix, rawData) => {
    setFeed((prev) =>
      prev && prev.prefix === prefix && prev.data === rawData
        ? prev
        : { prefix, data: rawData },
    );
  }, []);

  const liveRun = useLiveRun({
    pinnedRid: state.pinnedLiveRid,
    scheduleItems,
    feed,
  });

  const value = useMemo(
    () => ({ ...liveRun, reportFeed }),
    [liveRun, reportFeed],
  );

  return (
    <LiveRunContext.Provider value={value}>{children}</LiveRunContext.Provider>
  );
}

LiveRunProvider.propTypes = {
  scheduleItems: PropTypes.array,
  children: PropTypes.node,
};

/**
 * Consume the workspace's shared live-run resolution. Must be rendered
 * beneath a `LiveRunProvider` (and, transitively, a `SessionProvider`).
 *
 * @returns {{prefix: string|null, rid: number|null, run: object|null,
 *   runs: Array<object>, data: object|null, plot: object|null,
 *   scheduleItem: object|null, status: string|null, progress: object,
 *   channels: object|null, error: string|null, connectionState: string,
 *   reportFeed: (prefix: string, rawData: object) => void}}
 */
export function useLiveRunContext() {
  const ctx = useContext(LiveRunContext);
  if (!ctx) {
    throw new Error(
      "useLiveRunContext() must be used within a <LiveRunProvider>",
    );
  }
  return ctx;
}

export default LiveRunContext;

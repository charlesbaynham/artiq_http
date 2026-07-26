/**
 * `MobileApp({ explist })` — the 2b mobile shell (IMPL-SPEC §2b, wave-2
 * addendum §15).
 *
 * Rendered by `BenchApp` below 700px. Owns its own internal screen state
 * (home vs. run detail) and the quick-run sheet — this is deliberately *not*
 * wired through the shared `bench/state/SessionContext.jsx` store: the sheet
 * launches directly from a saved server-side preset (IMPL-SPEC §8), and
 * "Repeat" resubmits a schedule item's own captured arguments, so nothing
 * here needs the desktop fragment-tree/working-set session shape. Live data
 * comes from the same wave-1 hooks the desktop screens use
 * (`useSchedule`/`useLiveRun`), so the mock/schedule/live-plot state is
 * identical everywhere.
 */

import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";

import useSchedule from "../state/useSchedule";
import useLiveRun from "../state/useLiveRun";

import MobileHome from "./MobileHome";
import MobileTabBar from "./MobileTabBar";
import QuickRunSheet from "./QuickRunSheet";
import RunDetail from "./RunDetail";
import "./mobile.css";

function MobileApp({ explist, isOnline = true }) {
  const [screen, setScreen] = useState("home"); // "home" | "detail"
  const [detailRid, setDetailRid] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { items, running, queued, cancel, refresh } = useSchedule();
  const liveRun = useLiveRun({ scheduleItems: items });

  const openDetail = useCallback((rid) => {
    if (rid == null) return;
    setDetailRid(rid);
    setScreen("detail");
  }, []);

  const closeDetail = useCallback(() => setScreen("home"), []);

  const handleSubmitted = useCallback(() => {
    setSheetOpen(false);
    // The mock (and a real master) always inserts a fresh submission as
    // `pending` — nothing auto-promotes it to `running` — so the honest
    // result is that it shows up as a queue row a moment later, not the
    // active card. Force an immediate poll rather than waiting out the 1s
    // interval so it appears right away.
    refresh();
  }, [refresh]);

  return (
    <div className="bench bm-app">
      {screen === "detail" && detailRid != null ? (
        <RunDetail
          rid={detailRid}
          items={items}
          cancel={cancel}
          onBack={closeDetail}
        />
      ) : (
        <div className={`bm-screen${sheetOpen ? " is-dimmed" : ""}`}>
          <MobileHome
            isOnline={isOnline}
            running={running}
            queued={queued}
            liveRun={liveRun}
            onOpenActive={openDetail}
            onOpenQueueItem={openDetail}
            onQuickRun={() => setSheetOpen(true)}
          />
          <MobileTabBar />
        </div>
      )}

      {sheetOpen && screen !== "detail" && (
        <QuickRunSheet
          explist={explist}
          onClose={() => setSheetOpen(false)}
          onSubmitted={handleSubmitted}
        />
      )}
    </div>
  );
}

MobileApp.propTypes = {
  explist: PropTypes.object,
  /** BenchApp already polls `get_health()` — accept the result rather than
   * polling a second time from inside the mobile screen. */
  isOnline: PropTypes.bool,
};

export default MobileApp;

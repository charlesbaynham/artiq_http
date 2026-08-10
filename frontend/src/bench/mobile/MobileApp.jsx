/**
 * `MobileApp({ explist })` — the 2b mobile shell (IMPL-SPEC §2b, wave-2
 * addendum §15).
 *
 * Rendered by `BenchApp` below 700px. Owns its own internal screen state
 * (home vs. run detail vs. new run). "New run" renders the *real* desktop
 * `SubmitPane` full-screen — the same fragment tree, working set, validation
 * and wire encoders, so a phone can submit any experiment with arbitrary
 * parameters exactly like the desktop can; nothing mobile-only exists to
 * drift out of sync. That pane reads the shared `bench/state/
 * SessionContext.jsx` store (mounted by `BenchApp` around both layouts) and
 * the `LiveRunContext` duration estimate, so a `LiveRunProvider` wraps the
 * shell here just as `BenchWorkspace` does on desktop. Live data comes from
 * the same wave-1 hooks the desktop screens use (`useSchedule`/`useLiveRun`),
 * so the mock/schedule/live-plot state is identical everywhere.
 */

import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";

import useSchedule from "../state/useSchedule";
import useLiveRun from "../state/useLiveRun";
import { LiveRunProvider } from "../state/LiveRunContext";
import SubmitPane from "../submit/SubmitPane";

import MobileHome from "./MobileHome";
import MobileTabBar from "./MobileTabBar";
import RunDetail from "./RunDetail";
import "./mobile.css";

function MobileApp({ explist, isOnline = true }) {
  const [screen, setScreen] = useState("home"); // "home" | "detail" | "submit"
  const [detailRid, setDetailRid] = useState(null);

  const { items, running, queued, cancel, refresh } = useSchedule();
  const liveRun = useLiveRun({ scheduleItems: items });

  const openDetail = useCallback((rid) => {
    if (rid == null) return;
    setDetailRid(rid);
    setScreen("detail");
  }, []);

  const closeDetail = useCallback(() => setScreen("home"), []);

  const handleSubmitted = useCallback(() => {
    // The mock (and a real master) always inserts a fresh submission as
    // `pending` — nothing auto-promotes it to `running` — so the honest
    // result is that it shows up as a queue row a moment later, not the
    // active card. Force an immediate poll rather than waiting out the 1s
    // interval so it appears right away. The submit screen stays open (the
    // pane shows "submitted RID …" itself), matching the desktop behaviour.
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
      ) : screen === "submit" ? (
        <LiveRunProvider scheduleItems={items}>
          <div className="bm-submit-screen">
            <div className="bm-topbar">
              <button
                type="button"
                className="bm-back"
                onClick={() => setScreen("home")}
                aria-label="Back"
              >
                ‹
              </button>
              <span className="bm-wordmark">
                new run
                <span className="bm-wordmark__dot" aria-hidden="true" />
              </span>
            </div>
            <div className="bm-submit-screen__body">
              <SubmitPane explist={explist} onSubmitted={handleSubmitted} />
            </div>
          </div>
        </LiveRunProvider>
      ) : (
        <div className="bm-screen">
          <MobileHome
            isOnline={isOnline}
            running={running}
            queued={queued}
            liveRun={liveRun}
            onOpenActive={openDetail}
            onOpenQueueItem={openDetail}
            onNewRun={() => setScreen("submit")}
          />
          <MobileTabBar />
        </div>
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

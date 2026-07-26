/**
 * Live pane — column 3 of the desktop workspace (IMPL-SPEC §6, §7, §12, §14-16;
 * handoff "Column 3 — live pane").
 *
 * `LivePane({ scheduleItems, cancel, loading })`: schedule data is owned by
 * the shell via `useSchedule()` and passed down (component contract, §15).
 * This component reads `pinnedLiveRid` / `ghostRid` / `selectedImageKeys`
 * from the session store and resolves which run to watch via `useLiveRun`.
 */

import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";

import { extractRid } from "../../plots/utils";
import { useSession } from "../state/SessionContext";
import { useLiveRun } from "../state/useLiveRun";
import ImagesCard from "./ImagesCard";
import LivePlotCard from "./LivePlotCard";
import QueueCard from "./QueueCard";
import "./live.css";

function LivePane({ scheduleItems = [], cancel, loading = false }) {
  const { state, setPinnedLiveRid, setGhostRid, setSelectedImageKeys } =
    useSession();
  const { pinnedLiveRid, ghostRid, selectedImageKeys } = state;

  const liveRun = useLiveRun({ pinnedRid: pinnedLiveRid, scheduleItems });

  // A pin that doesn't resolve to any discovered run is a genuinely empty
  // state (IMPL-SPEC §12): `useLiveRun` otherwise silently falls back to the
  // newest running/most-recent run, which would hide the mistake rather than
  // surface it honestly.
  const pinnedMissing =
    pinnedLiveRid != null && liveRun.rid !== Number(pinnedLiveRid);

  const ghostCandidate = useMemo(() => {
    if (liveRun.rid == null) return null;
    return (
      liveRun.runs.find((r) => r.rid !== liveRun.rid && r.rid != null) || null
    );
  }, [liveRun.runs, liveRun.rid]);

  const ghostPrefix = useMemo(() => {
    if (ghostRid == null) return null;
    return liveRun.runs.find((r) => r.rid === ghostRid)?.prefix || null;
  }, [liveRun.runs, ghostRid]);

  const handleGhostChange = useCallback(
    (nextPrefixes) => {
      const rid =
        nextPrefixes && nextPrefixes.length
          ? extractRid(nextPrefixes[0])
          : null;
      setGhostRid(rid);
    },
    [setGhostRid],
  );

  const toggleGhost = useCallback(() => {
    if (!ghostCandidate) return;
    setGhostRid(ghostRid === ghostCandidate.rid ? null : ghostCandidate.rid);
  }, [ghostCandidate, ghostRid, setGhostRid]);

  const handleUnpin = useCallback(
    () => setPinnedLiveRid(null),
    [setPinnedLiveRid],
  );

  return (
    <div className="bl-pane">
      <LivePlotCard
        liveRun={liveRun}
        pinnedMissing={pinnedMissing}
        pinnedLiveRid={pinnedLiveRid}
        onUnpin={handleUnpin}
        ghostRid={ghostRid}
        ghostPrefix={ghostPrefix}
        ghostCandidate={ghostCandidate}
        onToggleGhost={toggleGhost}
        onGhostChange={handleGhostChange}
      />
      <ImagesCard
        selectedImageKeys={selectedImageKeys}
        setSelectedImageKeys={setSelectedImageKeys}
      />
      <QueueCard
        scheduleItems={scheduleItems}
        cancel={cancel}
        loading={loading}
        pinnedLiveRid={pinnedLiveRid}
        setPinnedLiveRid={setPinnedLiveRid}
      />
    </div>
  );
}

LivePane.propTypes = {
  scheduleItems: PropTypes.array,
  cancel: PropTypes.func,
  loading: PropTypes.bool,
};

export default LivePane;

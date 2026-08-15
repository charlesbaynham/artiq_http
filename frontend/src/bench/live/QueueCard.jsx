/**
 * The `queue` card (IMPL-SPEC §7, §15, handoff "Column 3 — live pane").
 *
 * Renders every schedule item (running and pending) as a row. Clicking a row
 * pins the live plot to that RID; clicking the pinned row again unpins it
 * (back to following the newest run). Cancel confirms first for a currently
 * running item.
 */

import React, { useCallback } from "react";
import PropTypes from "prop-types";

import { isLiveStatus } from "../state/useSchedule";
import { Caption, Mono, PanelHeader, Pill, Spacer } from "../ui/primitives";

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

function QueueRow({ item, pinned, onPin, onCancel }) {
  const live = isLiveStatus(item.status);

  const handlePin = useCallback(() => onPin(item.rid), [item.rid, onPin]);
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handlePin();
      }
    },
    [handlePin],
  );

  const handleCancel = useCallback(
    async (e) => {
      e.stopPropagation();
      if (live) {
        const label = item.expid?.class_name || `RID ${item.rid}`;
        const ok = window.confirm(`Cancel the running run ${label}?`);
        if (!ok) return;
      }
      try {
        await onCancel(item.rid);
      } catch (err) {
        console.error(`Failed to cancel RID ${item.rid}:`, err);
      }
    },
    [live, item.rid, item.expid, onCancel],
  );

  return (
    <div
      className={cx("bl-queue-row", pinned && "is-pinned")}
      role="button"
      tabIndex={0}
      onClick={handlePin}
      onKeyDown={handleKeyDown}
      aria-pressed={pinned}
      title={
        pinned
          ? "Unpin — follow the newest run"
          : "Pin the live plot to this run"
      }
    >
      <Mono className={live ? "b-accent" : "b-dim"}>{item.rid}</Mono>
      <Pill status={live} quiet={!live}>
        {live ? "running" : item.status || "pending"}
      </Pill>
      <Mono className="bl-queue-row__name b-dim b-ellipsis">
        {item.expid?.class_name || "—"}
      </Mono>
      <button
        type="button"
        className="bl-queue-row__cancel b-mono b-faint"
        onClick={handleCancel}
      >
        cancel
      </button>
    </div>
  );
}

QueueRow.propTypes = {
  item: PropTypes.object.isRequired,
  pinned: PropTypes.bool,
  onPin: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

function QueueCard({
  scheduleItems = [],
  cancel,
  loading,
  pinnedLiveRid,
  setPinnedLiveRid,
}) {
  const pipeline = scheduleItems.find((i) => i.pipeline)?.pipeline || "main";

  const handlePin = useCallback(
    (rid) => setPinnedLiveRid(pinnedLiveRid === rid ? null : rid),
    [pinnedLiveRid, setPinnedLiveRid],
  );

  return (
    <section className="b-card bl-queue-card">
      <PanelHeader className="bl-queue-head">
        <Caption>queue</Caption>
        <Spacer />
        <Mono className="b-faint">pipeline {pipeline}</Mono>
      </PanelHeader>

      {scheduleItems.length === 0 ? (
        <div className="bl-queue-empty b-faint">
          {loading ? "loading…" : "nothing queued"}
        </div>
      ) : (
        scheduleItems.map((item) => (
          <QueueRow
            key={item.rid}
            item={item}
            pinned={pinnedLiveRid === item.rid}
            onPin={handlePin}
            onCancel={cancel}
          />
        ))
      )}
    </section>
  );
}

QueueCard.propTypes = {
  scheduleItems: PropTypes.array,
  cancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  pinnedLiveRid: PropTypes.number,
  setPinnedLiveRid: PropTypes.func.isRequired,
};

export default QueueCard;

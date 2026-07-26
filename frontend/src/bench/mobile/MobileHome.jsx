/**
 * 2b-1 — Mobile home / status screen (IMPL-SPEC §2b-1).
 *
 * Pure presentation over the data `MobileApp` already collects via
 * `useSchedule`/`useLiveRun`: the active run card, a live-plot thumbnail, two
 * real camera tiles, pending queue rows, and the Quick run button. No polling
 * of its own beyond discovering camera dataset names, which `plots/
 * ImageSection.jsx` does not expose as a reusable hook.
 */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { get_dataset_names } from "../../api/client";
import { useSSEDataset } from "../../hooks/useSSEDataset";
import PlotImage from "../../plots/PlotImage";
import { formatDuration } from "../state/useLiveRun";
import { Pill, Mono, BenchButton } from "../ui/primitives";
import Sparkline, { pickPrimaryChannel } from "./Sparkline";

const IMAGE_DISCOVER_MS = 5000;

/** Dataset names matching `/image/i`, excluding ndscan run datasets — same
 * filter `plots/ImageSection.jsx` uses to discover camera frames. */
function useCameraNames() {
  const [names, setNames] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const discover = async () => {
      try {
        const { names: all = [] } = await get_dataset_names();
        const imgs = all.filter(
          (n) => /image/i.test(n) && !n.startsWith("ndscan."),
        );
        if (!cancelled) {
          setNames((prev) => (prev.join("|") === imgs.join("|") ? prev : imgs));
        }
      } catch {
        /* silently ignore — camera row just stays empty */
      }
    };
    discover();
    const id = setInterval(discover, IMAGE_DISCOVER_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return names;
}

/** One 78px camera tile, subscribed directly to its own live SSE stream. */
function CameraTile({ name }) {
  const { data } = useSSEDataset(name, { enabled: !!name });
  if (!name) {
    return <div className="bm-camera-tile bm-camera-tile--empty" aria-hidden="true" />;
  }
  const pixels = data?.[name]?.[1] ?? null;
  return (
    <div className="bm-camera-tile">
      <PlotImage name={name} pixels={pixels} />
      <span className="bm-camera-tile__label b-mono" title={name}>
        {name}
      </span>
    </div>
  );
}

CameraTile.propTypes = { name: PropTypes.string };

function scheduleName(item) {
  return item?.expid?.class_name || "";
}

function MobileHome({
  isOnline = true,
  running = [],
  queued = [],
  liveRun,
  onOpenActive,
  onOpenQueueItem,
  onQuickRun,
}) {
  const cameraNames = useCameraNames();

  // `running` (from useSchedule) is newest-RID-first; the mock only ever has
  // one live run at a time, but if a lab genuinely has two we show the one
  // useLiveRun itself resolved to for the thumbnail's sake.
  const activeItem =
    running.find((i) => Number(i.rid) === liveRun?.rid) || running[0] || null;
  const activeRid = activeItem ? Number(activeItem.rid) : null;

  const primaryChannel = pickPrimaryChannel(liveRun?.channels);
  const xValues = liveRun?.plot?.axisValues?.[0] || [];
  const yValues = primaryChannel
    ? liveRun?.plot?.channelData?.[primaryChannel]?.values || []
    : [];

  const progress = liveRun?.progress;
  const done = progress?.done ?? 0;
  const total = progress?.total;
  const doneLabel = Number.isFinite(total) ? `${done} / ${total} pts` : `${done} pts`;
  const etaLabel =
    progress?.remainingSeconds != null
      ? `~${formatDuration(progress.remainingSeconds, { spaced: true })} left`
      : "";

  return (
    <>
      <div className="bm-topbar">
        <span className="bm-wordmark">
          ARTIQ<span className="bm-wordmark__dot" aria-hidden="true" />
        </span>
        <div className="b-spacer" />
        <Pill status={isOnline} danger={!isOnline}>
          ● {isOnline ? "online" : "offline"}
        </Pill>
      </div>

      <div className="bm-content b-scroll">
        {activeItem ? (
          <button
            type="button"
            className="bm-active-card"
            onClick={() => onOpenActive(activeRid)}
          >
            <div className="bm-active-card__head">
              <Pill status>● {activeItem.status}</Pill>
              <div className="b-spacer" />
              <Mono className="bm-active-card__rid b-muted">RID {activeRid}</Mono>
            </div>
            <Mono className="bm-active-card__name">{scheduleName(activeItem)}</Mono>
            {progress?.fraction != null && (
              <div className="bm-progress">
                <div
                  className="bm-progress__fill"
                  style={{ width: `${Math.round(progress.fraction * 100)}%` }}
                />
              </div>
            )}
            <div className="bm-progress-row b-mono">
              <span>{doneLabel}</span>
              <div className="b-spacer" />
              <span>{etaLabel}</span>
            </div>
          </button>
        ) : (
          <div className="bm-empty">
            <span>No live run</span>
            <span className="bm-empty__hint b-faint">
              Submit or pick a past RID
            </span>
          </div>
        )}

        <div className="bm-plot-card">
          <div className="bm-plot-well">
            <Sparkline xValues={xValues} yValues={yValues} viewBoxHeight={130} />
          </div>
        </div>

        <div className="bm-camera-row">
          <CameraTile name={cameraNames[0]} />
          <CameraTile name={cameraNames[1]} />
        </div>

        {queued.map((item) => (
          <button
            key={item.rid}
            type="button"
            className="bm-queue-row"
            onClick={() => onOpenQueueItem(Number(item.rid))}
          >
            <Pill quiet>{item.status}</Pill>
            <span className="bm-queue-row__name b-mono b-dim b-ellipsis">
              {scheduleName(item)}
            </span>
            <Mono className="bm-queue-row__rid b-faint">{item.rid}</Mono>
          </button>
        ))}

        <div className="b-spacer" />

        <BenchButton variant="primary" size="lg" onClick={onQuickRun}>
          Quick run
        </BenchButton>
      </div>
    </>
  );
}

MobileHome.propTypes = {
  isOnline: PropTypes.bool,
  running: PropTypes.array,
  queued: PropTypes.array,
  liveRun: PropTypes.object,
  onOpenActive: PropTypes.func.isRequired,
  onOpenQueueItem: PropTypes.func.isRequired,
  onQuickRun: PropTypes.func.isRequired,
};

export default MobileHome;

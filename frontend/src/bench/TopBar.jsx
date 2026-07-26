/**
 * TopBar — the 2a top bar (IMPL-SPEC §2; handoff "Screen 2a — Top bar").
 *
 * 44px, `--b-surface`, bottom border, `gap:12px`, `padding:0 12px`. Left to
 * right: wordmark, `/` separator, session switcher, live status group,
 * command search, `queue N` + `● online` pills.
 *
 * `scheduleItems` is passed in from `BenchApp` (a single `useSchedule()` call
 * shared with the live pane) so the top bar doesn't open a second polling
 * loop just to count the queue. The live-run progress readout reads from
 * `LiveRunContext` (mounted by `BenchApp`) rather than calling `useLiveRun()`
 * itself, so the top bar, submit pane and live pane share one `EventSource`
 * to the resolved run's SSE stream instead of each opening its own.
 */
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import { Pill, Spacer } from "./ui/primitives";
import { useSession } from "./state/SessionContext";
import { useLiveRunContext } from "./state/LiveRunContext";
import { formatDuration } from "./state/useLiveRun";
import { isLiveStatus } from "./state/useSchedule";

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

function LiveStatus() {
  const liveRun = useLiveRunContext();
  const live = isLiveStatus(liveRun.status) && liveRun.rid != null;

  if (!live) {
    return (
      <div className="bs-live">
        <span className="b-mono bs-live__label b-muted">IDLE</span>
      </div>
    );
  }

  const { done, total, remainingSeconds } = liveRun.progress;
  let countText;
  if (total == null) countText = `${done} pts`;
  else if (total === Infinity) countText = `${done}/∞`;
  else countText = `${done}/${total}`;

  const durationText =
    remainingSeconds != null ? `~${formatDuration(remainingSeconds)}` : null;

  return (
    <div className="bs-live">
      <span className="b-dot" aria-hidden="true" />
      <span className="b-mono bs-live__label b-ok">LIVE</span>
      <span className="b-mono bs-live__detail b-muted">
        · RID {liveRun.rid} · {countText}
        {durationText ? ` · ${durationText}` : ""}
      </span>
    </div>
  );
}

function SessionSwitcher() {
  const session = useSession();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDocPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocPointerDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocPointerDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const handleNew = () => {
    setOpen(false);
    // eslint-disable-next-line no-alert
    const name = window.prompt("New session name");
    if (name && name.trim()) session.createSession(name.trim());
  };

  return (
    <div className="bs-session" ref={rootRef}>
      <button
        type="button"
        className="bs-session__btn"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="b-mono">session · {session.state.name}</span>
        <span className="b-muted" aria-hidden="true">
          ▾
        </span>
      </button>
      {open ? (
        <div className="bs-session__menu" role="menu">
          {session.sessions.map((name) => (
            <button
              key={name}
              type="button"
              role="menuitem"
              className={cx(
                "bs-session__item",
                name === session.state.name && "is-active",
              )}
              onClick={() => {
                session.switchSession(name);
                setOpen(false);
              }}
            >
              {name}
            </button>
          ))}
          <button
            type="button"
            role="menuitem"
            className="bs-session__item bs-session__item--new"
            onClick={handleNew}
          >
            New session…
          </button>
        </div>
      ) : null}
    </div>
  );
}

function TopBar({ isOnline, scheduleItems, onOpenPalette, onQueueClick }) {
  const queueCount = scheduleItems?.length ?? 0;

  return (
    <div className="bs-topbar">
      <span className="bs-wordmark">
        ARTIQ
        <span className="bs-wordmark__dot" aria-hidden="true" />
        <span className="bs-wordmark__suffix">bench</span>
      </span>
      <span className="bs-sep" aria-hidden="true">
        /
      </span>

      <SessionSwitcher />

      <LiveStatus />

      <Spacer />

      <button
        type="button"
        className="bs-search"
        onClick={onOpenPalette}
        aria-label="Jump to experiment, run, dataset"
      >
        <span className="bs-search__icon" aria-hidden="true">
          ⌕
        </span>
        <span className="bs-search__hint-text">
          jump to experiment, run, dataset
        </span>
        <span className="bs-search__kbd b-mono">⌘K</span>
      </button>

      <Spacer />

      <div className="bs-pills">
        <Pill onClick={onQueueClick} title="Open the queue">
          queue {queueCount}
        </Pill>
        <Pill status={isOnline} danger={!isOnline}>
          ● {isOnline ? "online" : "offline"}
        </Pill>
      </div>
    </div>
  );
}

TopBar.propTypes = {
  /** Master/backend connection state — drives the `● online`/`● offline` pill. */
  isOnline: PropTypes.bool,
  /** Schedule items from a shared `useSchedule()` call — drives `queue N`. */
  scheduleItems: PropTypes.array,
  /** Opens the command palette (⌘K). */
  onOpenPalette: PropTypes.func,
  /** `queue N` click — scrolls to the queue card on `/`, else navigates to `/runs`. */
  onQueueClick: PropTypes.func,
};

export default TopBar;

/**
 * BenchApp — the bench shell (IMPL-SPEC §1/§2/§10/§11/§12).
 *
 * Mounted by `App.jsx` at `/`, `/runs`, `/datasets` and `/logs`. Below 700px
 * it renders the 2b mobile flow (`MobileApp`); at 700px and above it renders
 * the 2a desktop workspace: a 44px `TopBar` over a body row of the 58px
 * `IconRail` and the current route's content.
 *
 * Owns `explist` polling (10s) and health polling (5s) — lifted out of the
 * old `App.jsx` — and hands `isOnline` down to `TopBar`. Owns the ⌘K / Esc
 * keyboard shortcuts and the command palette's open state, and the
 * `?experiment=<file>:<class>&rev=<rev>` deep link on `/`.
 */
import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { get_explist, get_health } from "../api/client";
import ConnectionErrorModal from "../ConnectionErrorModal";
import ErrorBoundary from "../ErrorBoundary";
import Schedule from "../Schedule";
import DatasetExplorer from "../DatasetExplorer";
import Logs from "../Logs";

import "./shell.css";

import { SessionProvider, useSession } from "./state/SessionContext";
import { useSchedule } from "./state/useSchedule";
import { useIsMobile, useIsNarrow } from "./state/useMediaQuery";

import TopBar from "./TopBar";
import IconRail from "./IconRail";
import CommandPalette from "./CommandPalette";
import SubmitPane from "./submit/SubmitPane";
import LivePane from "./live/LivePane";
import MobileApp from "./mobile/MobileApp";

const EXPLIST_POLL_MS = 10000;
const HEALTH_POLL_MS = 5000;

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

function isTextInputTarget(el) {
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
}

/** Split the legacy `<file>:<class_name>` deep-link param. The file itself
 * may contain colons (unlikely, but paths are free-form), so split on the
 * *last* colon rather than the first. */
function splitExperimentParam(raw) {
  if (!raw) return null;
  const idx = raw.lastIndexOf(":");
  if (idx <= 0) return null;
  return { file: raw.slice(0, idx), class_name: raw.slice(idx + 1) };
}

function BenchApp() {
  const isMobile = useIsMobile();
  const [explist, setExplist] = useState({});
  const [connectionError, setConnectionError] = useState(null); // null | "backend" | "artiq"

  // Experiment list polling — lifted from the old App.jsx so both the
  // desktop workspace and the mobile flow share one poll.
  useEffect(() => {
    let cancelled = false;
    const fetchExplist = () => {
      get_explist()
        .then((data) => {
          if (!cancelled) setExplist(data);
        })
        .catch((err) =>
          console.error("Experiment list update error:", err.message),
        );
    };
    fetchExplist();
    const id = setInterval(fetchExplist, EXPLIST_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // Master health polling — same backend-vs-artiq distinction the old
  // App.jsx used, driving both the ConnectionErrorModal and the top bar's
  // "● online"/"● offline" pill.
  useEffect(() => {
    let cancelled = false;
    const checkHealth = async () => {
      try {
        const health = await get_health();
        if (cancelled) return;
        setConnectionError(health.artiq_connected ? null : "artiq");
      } catch {
        if (!cancelled) setConnectionError("backend");
      }
    };
    checkHealth();
    const id = setInterval(checkHealth, HEALTH_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <SessionProvider>
      <div className="bench bs-root">
        <ConnectionErrorModal
          errorType={connectionError}
          show={connectionError !== null}
        />
        {isMobile ? (
          <MobileApp explist={explist} isOnline={connectionError === null} />
        ) : (
          <BenchWorkspace
            explist={explist}
            isOnline={connectionError === null}
          />
        )}
      </div>
    </SessionProvider>
  );
}

/** The 2a desktop workspace — split out so it can call `useSession()`, which
 * requires being inside `<SessionProvider>`. */
function BenchWorkspace({ explist, isOnline }) {
  const session = useSession();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isNarrow = useIsNarrow();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [narrowTab, setNarrowTab] = useState("submit");
  // The live pane's "⤢ expand" (IMPL-SPEC handoff, Column 3): collapses the
  // icon rail and submit pane, giving the live pane the full workspace
  // width. Local to the workspace (not session-persisted — it's a transient
  // view state, not something worth restoring across reloads). Reset when
  // navigating away from "/" so the rail/submit pane don't stay hidden on
  // /runs, /datasets, /logs.
  const [expanded, setExpanded] = useState(false);

  const {
    items: scheduleItems,
    loading: scheduleLoading,
    cancel,
  } = useSchedule();

  // Deep link: `?experiment=<file>:<class>&rev=<rev>` loads into the submit
  // pane on `/` without navigating away (IMPL-SPEC §10).
  useEffect(() => {
    if (location.pathname !== "/") return;
    const expParam = searchParams.get("experiment");
    if (!expParam) return;
    const parsed = splitExperimentParam(expParam);
    if (!parsed) return;
    const entry = (explist.experiments || []).find(
      (e) => e.file === parsed.file && e.class_name === parsed.class_name,
    );
    session.selectExperiment({
      file: parsed.file,
      class_name: parsed.class_name,
      name: entry?.name || parsed.class_name,
      docstring: entry?.docstring || "",
    });
    const rev = searchParams.get("rev");
    if (rev) session.setRevision(rev);
    // `session.selectExperiment`/`setRevision` are stable (SessionContext
    // wraps its actions in a `useMemo` with an empty dep array), so they're
    // intentionally left out of the deps below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, searchParams, explist.experiments]);

  // ⌘K / Ctrl+K opens the palette from anywhere; Esc closes the palette if
  // open, else restores from the expanded live pane if that's open.
  // Shortcuts other than ⌘K itself don't fire while focus is in a text
  // input.
  useEffect(() => {
    const onKeyDown = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
        return;
      }
      if (isTextInputTarget(document.activeElement)) return;
      if (e.key === "Escape") {
        if (paletteOpen) setPaletteOpen(false);
        else if (expanded) setExpanded(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [paletteOpen, expanded]);

  // The expanded live pane only makes sense on "/" — reset it on navigating
  // away so the rail/submit pane don't stay hidden on /runs, /datasets, /logs.
  // (Reads `location.pathname` directly rather than the `pathname` const
  // declared further down, which isn't in scope yet at this point in the
  // component body.)
  useEffect(() => {
    if (location.pathname !== "/" && expanded) setExpanded(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleQueueClick = useCallback(() => {
    if (location.pathname === "/") {
      // Best-effort: the live pane's queue card (owned by the live-pane work
      // package) can opt into this by tagging itself
      // `data-bench-queue-card`. Until that lands, fall back to /runs.
      const el = document.querySelector("[data-bench-queue-card]");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        el.focus?.({ preventScroll: true });
        return;
      }
    }
    navigate("/runs");
  }, [location.pathname, navigate]);

  const pathname = location.pathname;

  return (
    <>
      <TopBar
        isOnline={isOnline}
        scheduleItems={scheduleItems}
        onOpenPalette={() => setPaletteOpen(true)}
        onQueueClick={handleQueueClick}
      />
      <div className={cx("bs-body", expanded && "is-expanded")}>
        <IconRail explist={explist} />
        <div className="bs-content">
          {pathname === "/" && (
            <div className="bs-workspace">
              {isNarrow && (
                <div className="bs-tabs" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={narrowTab === "submit"}
                    className={cx(
                      "bs-tabs__btn",
                      narrowTab === "submit" && "is-active",
                    )}
                    onClick={() => setNarrowTab("submit")}
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={narrowTab === "live"}
                    className={cx(
                      "bs-tabs__btn",
                      narrowTab === "live" && "is-active",
                    )}
                    onClick={() => setNarrowTab("live")}
                  >
                    Live
                  </button>
                </div>
              )}
              <div
                className="bs-pane bs-pane--submit"
                hidden={isNarrow && narrowTab !== "submit"}
              >
                <ErrorBoundary>
                  <SubmitPane explist={explist} onSubmitted={() => {}} />
                </ErrorBoundary>
              </div>
              <div
                className="bs-pane bs-pane--live"
                hidden={isNarrow && narrowTab !== "live"}
              >
                <ErrorBoundary>
                  <LivePane
                    scheduleItems={scheduleItems}
                    cancel={cancel}
                    loading={scheduleLoading}
                    expanded={expanded}
                    onToggleExpanded={() => setExpanded((v) => !v)}
                  />
                </ErrorBoundary>
              </div>
            </div>
          )}
          {pathname === "/runs" && (
            <div className="bs-fullpane b-scroll">
              <ErrorBoundary>
                <Schedule />
              </ErrorBoundary>
            </div>
          )}
          {pathname === "/datasets" && (
            <div className="bs-fullpane b-scroll">
              <ErrorBoundary>
                <DatasetExplorer />
              </ErrorBoundary>
            </div>
          )}
          {pathname === "/logs" && (
            <div className="bs-fullpane b-scroll">
              <ErrorBoundary>
                <Logs currentPage="logs" />
              </ErrorBoundary>
            </div>
          )}
        </div>
      </div>
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        explist={explist}
      />
    </>
  );
}

BenchWorkspace.propTypes = {
  explist: PropTypes.object,
  isOnline: PropTypes.bool,
};

export default BenchApp;

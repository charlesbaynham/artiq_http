/**
 * 2a column 2 — the submit pane.
 *
 * header bar → filter bar → two-pane body (fragment tree | working set) →
 * footer bar. Every piece of user state lives in `useSession()`; everything
 * else here is derived per render (point counts, the grid product, the match
 * count, validation) and never stored.
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";

import {
  get_explist_arginfo,
  get_health,
  queue_experiment,
  recompute_arguments,
  submit_scan,
} from "../../api/client";
import {
  buildFqnToPathMap,
  isNDScanExperiment,
  parseNdscanParams,
} from "../../api/ndscan";
import { useSession } from "../state/SessionContext";
import { useLiveRunContext } from "../state/LiveRunContext";
import { estimatePointDuration } from "../state/useLiveRun";
import { useIsMedium, useIsMobile } from "../state/useMediaQuery";
import { Caption, Mono, Pill, Skeleton, Spacer } from "../ui/primitives";
import { IconTree } from "../ui/icons";
import FragmentTree from "./FragmentTree";
import SubmitFooter from "./SubmitFooter";
import WorkingSet from "./WorkingSet";
import {
  INFINITE_REPEATS,
  buildParamModel,
  buildPlainArguments,
  buildScanRequest,
  buildTree,
  filterTree,
  pointCount,
  validateWorkingSet,
} from "./params";
import "./submit.css";

const HEALTH_POLL_MS = 10000;

/** Poll the master connection so Submit can be honestly disabled when it drops. */
function useMasterOnline() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    let alive = true;
    const tick = async () => {
      try {
        const health = await get_health();
        if (alive) setOnline(health?.artiq_connected !== false);
      } catch {
        if (alive) setOnline(false);
      }
    };
    tick();
    const id = setInterval(() => {
      if (document.visibilityState === "visible") tick();
    }, HEALTH_POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);
  return online;
}

/* ── Revision picker ──────────────────────────────────────────────────────── */

function RevisionMenu({ revision, fallback, onChange }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(revision);
  const rootRef = useRef(null);

  useEffect(() => setDraft(revision), [revision]);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target))
        setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const shown = revision || fallback || "current";
  const label = shown.length > 12 ? `${shown.slice(0, 10)}…` : shown;

  return (
    <div className="bw-pop" ref={rootRef}>
      <button
        type="button"
        className="bw-head__btn"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        title={`Build against ${shown}${
          revision ? "" : " (master's current revision)"
        }`}
      >
        rev {label} ▾
      </button>
      {open ? (
        <div className="bw-pop__menu">
          <button
            type="button"
            className={`bw-pop__item${revision ? "" : " is-active"}`}
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
          >
            default · {fallback || "current"}
          </button>
          <div className="bw-pop__sep" />
          <div className="bw-pop__row">
            <input
              className="b-input"
              value={draft}
              placeholder="branch, tag or sha"
              spellCheck={false}
              aria-label="Revision to build against"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                onChange(draft.trim());
                setOpen(false);
              }}
            />
            <button
              type="button"
              className="bw-head__btn"
              onClick={() => {
                onChange(draft.trim());
                setOpen(false);
              }}
            >
              use
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

RevisionMenu.propTypes = {
  revision: PropTypes.string.isRequired,
  fallback: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

/* ── Empty state: no experiment selected ──────────────────────────────────── */

function ExperimentPicker({ experiments, query, onQuery, onSelect }) {
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = experiments || [];
    if (!q) return list.slice(0, 40);
    return list
      .filter(
        (e) =>
          String(e.name || "")
            .toLowerCase()
            .includes(q) ||
          String(e.class_name || "")
            .toLowerCase()
            .includes(q) ||
          String(e.file || "")
            .toLowerCase()
            .includes(q),
      )
      .slice(0, 40);
  }, [experiments, query]);

  return (
    <div className="bw-empty">
      <div className="bw-empty__hint">
        No experiment selected — search below, or pick one from the list to load
        its fragment tree.
      </div>
      <div className="bw-explist b-scroll">
        {results.map((exp) => (
          <button
            type="button"
            className="bw-explist__item"
            key={`${exp.file}:${exp.class_name}`}
            onClick={() => onSelect(exp)}
          >
            <span className="bw-explist__name">
              {exp.name || exp.class_name}
            </span>
            <span className="bw-explist__file">{exp.file}</span>
          </button>
        ))}
        {results.length === 0 ? (
          <div className="bw-tree__empty">No experiment matches “{query}”.</div>
        ) : null}
      </div>
    </div>
  );
}

ExperimentPicker.propTypes = {
  experiments: PropTypes.array,
  query: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

/* ── The pane ─────────────────────────────────────────────────────────────── */

function SubmitPane({ explist, onSubmitted }) {
  const session = useSession();
  const {
    state,
    selectExperiment,
    setRevision,
    pinParam,
    unpin,
    promoteToAxis,
    swapAxes,
    updateEntry,
    resetEntry,
    resetAll,
    setFilterQuery,
    toggleFilter,
    toggleBranch,
    setPipeline,
    setPriority,
    setRepeats,
    syncWorkingSet,
    expandedBranches,
    changedCount,
    canAddAxis,
    experimentKey,
    notice,
  } = session;

  const experiment = state.selectedExperiment;
  const online = useMasterOnline();

  const experiments = useMemo(() => {
    if (Array.isArray(explist)) return explist;
    return explist?.experiments || [];
  }, [explist]);
  const revisionFallback =
    explist?.default_revision_fallback || explist?.current_rev || "";

  /* ── Arginfo ────────────────────────────────────────────────────────────── */

  const [arginfo, setArginfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [recomputing, setRecomputing] = useState(false);
  const reqRef = useRef(0);

  const load = useCallback(async (exp, { revision } = {}) => {
    if (!exp?.file || !exp?.class_name) {
      setArginfo(null);
      return;
    }
    const token = (reqRef.current += 1);
    setLoading(true);
    setLoadError(null);
    try {
      const data = revision
        ? await recompute_arguments(exp.file, exp.class_name, revision)
        : await get_explist_arginfo(exp.file, exp.class_name);
      if (reqRef.current !== token) return;
      setArginfo(data?.arginfo ?? data ?? null);
    } catch (err) {
      if (reqRef.current !== token) return;
      setArginfo(null);
      setLoadError(err?.message || String(err));
    } finally {
      if (reqRef.current === token) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(experiment);
    // Only the identity of the experiment matters here, not its object identity.
  }, [load, experimentKey]);

  /* ── Derived model ──────────────────────────────────────────────────────── */

  const params = useMemo(() => buildParamModel(arginfo), [arginfo]);
  const tree = useMemo(() => buildTree(params), [params]);
  const isNdscan = Boolean(arginfo && isNDScanExperiment(arginfo));
  const fqnToPath = useMemo(() => {
    if (!isNdscan) return {};
    const parsed = parseNdscanParams(arginfo);
    return buildFqnToPathMap(parsed?.instances);
  }, [arginfo, isNdscan]);

  // Reconcile a restored working set against the freshly computed schema:
  // drop overrides whose FQN no longer exists and refresh schema-derived
  // fields. Guarded so it runs once per (experiment, arginfo) pair.
  const syncedRef = useRef(null);
  useEffect(() => {
    if (!params.length) return;
    const key = `${experimentKey}#${params.length}`;
    if (syncedRef.current === key) return;
    syncedRef.current = key;
    if (state.workingSet.length) syncWorkingSet(params);
    // `state.workingSet` is read, not depended on — syncing must not re-trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, experimentKey, syncWorkingSet]);

  const { tree: filtered, matchCount } = useMemo(
    () => filterTree(tree, state.filterQuery, state.filters, state.workingSet),
    [tree, state.filterQuery, state.filters, state.workingSet],
  );

  const entriesByFqn = useMemo(
    () => new Map(state.workingSet.map((e) => [e.fqn, e])),
    [state.workingSet],
  );
  const { valid, errors } = useMemo(
    () => validateWorkingSet(state.workingSet),
    [state.workingSet],
  );

  const axes = useMemo(
    () => state.workingSet.filter((e) => e.mode === "axis"),
    [state.workingSet],
  );

  /* ── Fragment tree slide-over (900–1200px and <700px, IMPL-SPEC §11) ──────
   * Below 1200px the pane shrinks and the 262px tree stops fitting inline;
   * above 900px it isn't narrow enough for the tabbed mobile-ish layout
   * either, so `useIsMedium` (the shell's one breakpoint helper — no
   * duplicated matchMedia logic) picks out exactly that band. In it, the
   * tree renders only inside a slide-over triggered from the filter bar
   * instead of inline. The mobile "New run" screen (<700px) reuses the same
   * slide-over: a phone has even less room for an inline tree than the
   * medium band does. */
  const isMedium = useIsMedium();
  const isMobile = useIsMobile();
  const overlayTree = isMedium || isMobile;
  const [treeOverlayOpen, setTreeOverlayOpen] = useState(false);
  const treeTriggerRef = useRef(null);
  const treeOverlayRef = useRef(null);
  const wasOverlayOpenRef = useRef(false);

  // Leaving the slide-over widths always closes it: the tree goes back to
  // being inline either way.
  useEffect(() => {
    if (!overlayTree) setTreeOverlayOpen(false);
  }, [overlayTree]);

  const closeTreeOverlay = useCallback(() => setTreeOverlayOpen(false), []);

  // Focus the overlay when it opens; return focus to the trigger when it
  // closes. Guarded so mounting/breakpoint churn that never actually opened
  // it doesn't go stealing focus.
  useEffect(() => {
    if (treeOverlayOpen) {
      wasOverlayOpenRef.current = true;
      treeOverlayRef.current?.focus();
    } else if (wasOverlayOpenRef.current) {
      wasOverlayOpenRef.current = false;
      treeTriggerRef.current?.focus();
    }
  }, [treeOverlayOpen]);

  // Esc closes it from anywhere in the pane (pinning stays open — only Esc
  // and the backdrop close it).
  useEffect(() => {
    if (!treeOverlayOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setTreeOverlayOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [treeOverlayOpen]);

  /* ── Duration estimate ──────────────────────────────────────────────────── */

  // Shared workspace-wide subscription (LiveRunContext, mounted by BenchApp)
  // rather than a standalone `useLiveRun()` call — see that context's
  // docstring for why (IMPL-SPEC §6/§7 wave-2 polish: one EventSource for
  // the whole workspace instead of three).
  const { progress } = useLiveRunContext();
  const secondsPerPoint = estimatePointDuration(progress, null);
  const durationSeconds = useMemo(() => {
    if (secondsPerPoint == null || !experiment) return null;
    const gridPoints = axes.reduce((n, a) => n * pointCount(a), 1);
    if (!gridPoints) return null;
    // An ∞-repeat scan has no honest end; say nothing rather than guess.
    if (state.repeats === INFINITE_REPEATS) return null;
    const total = secondsPerPoint * gridPoints * Math.max(1, state.repeats);
    return total >= 1 ? total : null;
  }, [secondsPerPoint, axes, state.repeats, experiment]);

  /* ── Actions ────────────────────────────────────────────────────────────── */

  const onPin = useCallback((param) => pinParam(param), [pinParam]);
  const onUnpinParam = useCallback((param) => unpin(param.fqn), [unpin]);
  const onPromoteParam = useCallback(
    (param) => promoteToAxis(param),
    [promoteToAxis],
  );

  const wsActions = useMemo(
    () => ({
      onPatch: updateEntry,
      onUnpin: unpin,
      onReset: resetEntry,
      onPromote: promoteToAxis,
      onSwap: swapAxes,
      onResetAll: resetAll,
      onSetRepeats: setRepeats,
    }),
    [
      updateEntry,
      unpin,
      resetEntry,
      promoteToAxis,
      swapAxes,
      resetAll,
      setRepeats,
    ],
  );

  const recompute = useCallback(async () => {
    if (!experiment) return;
    setRecomputing(true);
    try {
      await load(experiment, { revision: state.revision.trim() || undefined });
      syncedRef.current = null;
    } finally {
      setRecomputing(false);
    }
  }, [experiment, load, state.revision]);

  /* ── Submission ─────────────────────────────────────────────────────────── */

  const [submitting, setSubmitting] = useState(false);
  const [submitRid, setSubmitRid] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // A submit confirmation belongs to the experiment it was made for.
  useEffect(() => {
    setSubmitRid(null);
    setSubmitError(null);
  }, [experimentKey]);

  const submitDisabled =
    !experiment || !valid || !online || loading || Boolean(loadError);
  const disabledReason = !experiment
    ? "Select an experiment first"
    : !online
      ? "The ARTIQ master is not connected"
      : !valid
        ? "Fix the highlighted parameter before submitting"
        : loading
          ? "Arguments are still loading"
          : loadError || "";

  const onSubmit = useCallback(async () => {
    if (submitDisabled || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = isNdscan
        ? await submit_scan(
            buildScanRequest({
              experiment,
              workingSet: state.workingSet,
              fqnToPath,
              revision: state.revision,
              pipeline: state.pipeline,
              priority: state.priority,
              repeats: state.repeats,
            }),
          )
        : await queue_experiment(
            experiment.file,
            experiment.class_name,
            state.revision.trim() || null,
            buildPlainArguments(params, state.workingSet),
            state.pipeline,
            state.priority,
          );
      const rid = typeof response === "object" ? response?.rid : response;
      setSubmitRid(Number(rid));
      if (onSubmitted) onSubmitted(Number(rid));
    } catch (err) {
      setSubmitError(err?.message || String(err));
    } finally {
      setSubmitting(false);
    }
  }, [
    submitDisabled,
    submitting,
    isNdscan,
    experiment,
    state.workingSet,
    state.revision,
    state.pipeline,
    state.priority,
    state.repeats,
    fqnToPath,
    params,
    onSubmitted,
  ]);

  // ⌘↵ / Ctrl+↵ submits "from anywhere in the pane". A React `onKeyDown` on the
  // root only sees events whose target is a focused descendant, and clicking an
  // ordinary div leaves focus on `<body>` — so listen on the window and accept
  // the event when it came from inside the pane or from nothing in particular.
  const rootRef = useRef(null);
  const submitRef = useRef(onSubmit);
  submitRef.current = onSubmit;
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Enter" || !(e.metaKey || e.ctrlKey)) return;
      const root = rootRef.current;
      const inside =
        root &&
        (root.contains(e.target) ||
          !document.activeElement ||
          document.activeElement === document.body ||
          root.contains(document.activeElement));
      if (!inside) return;
      e.preventDefault();
      submitRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ── Render ─────────────────────────────────────────────────────────────── */

  // Shared between the inline tree (>=1200px or <900px) and the 900–1200px
  // slide-over — same loading/tree markup either way, just a different host
  // and an optional close affordance (only present inside the overlay).
  const renderTreePanel = (onClose) =>
    loading ? (
      <div className="bw-tree">
        <div className="b-panel-h">
          <Caption>fragments</Caption>
          {onClose ? (
            <>
              <Spacer />
              <button
                type="button"
                className="bw-tree__close"
                onClick={onClose}
                title="Close (Esc)"
                aria-label="Close fragment tree"
              >
                ✕
              </button>
            </>
          ) : null}
        </div>
        <Skeleton rows={8} height={40} />
      </div>
    ) : (
      <FragmentTree
        nodes={filtered}
        matchCount={matchCount}
        expanded={expandedBranches}
        filtering={query.trim() !== ""}
        query={query}
        entriesByFqn={entriesByFqn}
        onToggleBranch={(path) => toggleBranch(path)}
        onPin={onPin}
        onUnpin={onUnpinParam}
        onPromote={onPromoteParam}
        onClose={onClose}
      />
    );

  const query = state.filterQuery;
  const queryWidth = `${Math.min(Math.max(query.length, 3), 26)}ch`;

  const searchField = (
    <div
      className="b-search"
      onMouseDown={(e) => {
        if (e.target.tagName !== "INPUT") {
          e.preventDefault();
          e.currentTarget.querySelector("input")?.focus();
        }
      }}
    >
      <span className="b-search__icon" aria-hidden="true">
        ⌕
      </span>
      <input
        value={query}
        onChange={(e) => setFilterQuery(e.target.value)}
        style={{ width: queryWidth }}
        spellCheck={false}
        aria-label={
          experiment ? "Filter parameters" : "Search for an experiment"
        }
      />
      <span className="bw-filter__hint">
        {experiment
          ? "fuzzy over FQN + description"
          : "search experiments by name or file"}
      </span>
      <Spacer />
    </div>
  );

  return (
    <section className="bench bw-submit" ref={rootRef}>
      <header className="bw-head">
        <Caption>submit</Caption>
        {experiment ? (
          <>
            <Mono className="bw-head__name">
              {experiment.name || experiment.class_name}
            </Mono>
            {isNdscan ? <Pill className="bw-tag-nd">ndscan</Pill> : null}
            <Mono className="bw-head__file" title={experiment.file}>
              {experiment.file}
            </Mono>
          </>
        ) : (
          <span className="bw-empty__hint">no experiment selected</span>
        )}
        <Spacer />
        {experiment ? (
          <>
            <RevisionMenu
              revision={state.revision}
              fallback={revisionFallback}
              onChange={setRevision}
            />
            <button
              type="button"
              className="bw-head__ghost"
              onClick={recompute}
              disabled={recomputing || loading}
              title="Re-run argument computation on the master at the selected revision"
            >
              ↻ {recomputing ? "recomputing…" : "recompute"}
            </button>
            <button
              type="button"
              className="bw-head__ghost"
              onClick={() => selectExperiment(null)}
              title="Choose a different experiment"
            >
              change
            </button>
          </>
        ) : null}
      </header>

      <div className="bw-filter">
        {searchField}
        {experiment ? (
          <>
            <Pill
              as="button"
              active={state.filters.scannableOnly}
              onClick={() => toggleFilter("scannableOnly")}
              title="Show only parameters that can be scanned"
            >
              scannable
            </Pill>
            <Pill
              as="button"
              active={state.filters.changedOnly}
              onClick={() => toggleFilter("changedOnly")}
              title="Show only parameters that differ from their defaults"
            >
              changed {changedCount}
            </Pill>
            <Mono className="bw-filter__count" title="Total parameters">
              {params.length}
            </Mono>
            {overlayTree ? (
              <button
                type="button"
                ref={treeTriggerRef}
                className={`b-pill bw-tree-trigger${
                  treeOverlayOpen ? " is-active" : ""
                }`}
                onClick={() => setTreeOverlayOpen((v) => !v)}
                aria-haspopup="dialog"
                aria-expanded={treeOverlayOpen}
                title="Show the fragment tree"
              >
                <IconTree size={13} />
                fragments {matchCount}
              </button>
            ) : null}
          </>
        ) : null}
      </div>

      {notice ? <div className="bw-notice">{notice}</div> : null}
      {loadError ? (
        <div className="bw-notice" style={{ color: "var(--b-danger)" }}>
          {loadError}
        </div>
      ) : null}

      {!experiment ? (
        <ExperimentPicker
          experiments={experiments}
          query={query}
          onSelect={(exp) => {
            setFilterQuery("");
            selectExperiment({
              file: exp.file,
              class_name: exp.class_name,
              name: exp.name || exp.class_name,
              docstring: exp.docstring || "",
            });
          }}
        />
      ) : (
        <div className="bw-body">
          {!overlayTree ? renderTreePanel(null) : null}
          <WorkingSet
            entries={state.workingSet}
            errors={errors}
            loading={loading}
            canAddAxis={canAddAxis}
            repeats={state.repeats}
            actions={wsActions}
          />
          {overlayTree ? (
            <div
              className={`bw-tree-overlay${treeOverlayOpen ? " is-open" : ""}`}
            >
              <div
                className="bw-tree-overlay__backdrop"
                onClick={closeTreeOverlay}
                aria-hidden="true"
              />
              <div
                className="bw-tree-overlay__panel"
                role="dialog"
                aria-modal="true"
                aria-label="Fragment tree"
                ref={treeOverlayRef}
                tabIndex={-1}
              >
                {renderTreePanel(closeTreeOverlay)}
              </div>
            </div>
          ) : null}
        </div>
      )}

      <SubmitFooter
        durationSeconds={durationSeconds}
        pipeline={state.pipeline}
        priority={state.priority}
        onPipeline={setPipeline}
        onPriority={setPriority}
        onSubmit={onSubmit}
        submitting={submitting}
        disabled={submitDisabled}
        disabledReason={disabledReason}
        rid={submitRid}
        error={submitError}
      />
    </section>
  );
}

SubmitPane.propTypes = {
  /** `GET /api/explist` response (or a bare experiment array). */
  explist: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  /** Called with the new RID after a successful submit. Never navigates. */
  onSubmitted: PropTypes.func,
};

export default SubmitPane;

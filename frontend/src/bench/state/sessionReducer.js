/**
 * Bench session state — the pure part.
 *
 * Deliberately React-free so it can be imported by a plain Node script
 * (`frontend/scripts/check-params.mjs`) and unit-tested without a DOM. The
 * React provider/hook lives in `SessionContext.jsx`, which re-exports
 * everything here.
 *
 * See IMPL-SPEC §4 for the state shape.
 */

export const MAX_AXES = 2;
export const INFINITE_REPEATS = 2147483647;
export const DEFAULT_SESSION_NAME = "trap A";
export const DEFAULT_POINTS = 21;

export const LS_SESSION_PREFIX = "artiq_http.bench.session.";
export const LS_SESSIONS = "artiq_http.bench.sessions";
export const LS_ACTIVE_SESSION = "artiq_http.bench.activeSession";

/** Stable key for an experiment — used for `treeExpanded` and presets. */
export function experimentKey(experiment) {
  if (!experiment) return "";
  return `${experiment.file}:${experiment.class_name}`;
}

/** `axis` number → role. Derived, never stored. */
export function axisRole(axis) {
  return axis === 1 ? "outer" : axis === 2 ? "inner" : null;
}

export function initialSessionState(name = DEFAULT_SESSION_NAME) {
  return {
    name,
    selectedExperiment: null,
    revision: "",
    workingSet: [],
    treeExpanded: {},
    filterQuery: "",
    filters: { scannableOnly: false, changedOnly: false },
    pinnedLiveRid: null,
    ghostRid: null,
    visibleChannels: null,
    selectedImageKeys: [],
    pipeline: "main",
    priority: 0,
    repeats: 1,
    skipOnError: false,
    // Transient: an inline notice for the UI (e.g. "max 2 axes"). Cleared on
    // the next action; never persisted.
    notice: null,
  };
}

/** Merge a persisted blob onto a fresh state so missing keys always exist. */
export function hydrateSessionState(name, stored) {
  const base = initialSessionState(name);
  if (!stored || typeof stored !== "object") return base;
  const next = { ...base, ...stored, name, notice: null };
  next.filters = { ...base.filters, ...(stored.filters || {}) };
  next.treeExpanded = { ...(stored.treeExpanded || {}) };
  next.workingSet = Array.isArray(stored.workingSet) ? stored.workingSet : [];
  next.selectedImageKeys = Array.isArray(stored.selectedImageKeys)
    ? stored.selectedImageKeys
    : [];
  return next;
}

/** The subset that is persisted (drops the transient notice). */
export function serialiseSessionState(state) {
  // eslint-disable-next-line no-unused-vars
  const { notice, ...rest } = state;
  return rest;
}

/* ── Working-set helpers ──────────────────────────────────────────────────── */

function numberOr(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}

/** Build a `fixed` working-set entry from a normalised `Param`. */
export function entryFromParam(param) {
  return {
    fqn: param.fqn,
    description: param.description || "",
    unit: param.unit || "",
    scale: param.scale ?? 1,
    scannable: param.scannable === true,
    type: param.type,
    path: param.path ?? "",
    choices: param.choices,
    min: param.min,
    max: param.max,
    step: param.step,
    mode: "fixed",
    value: param.defaultValue,
    defaultValue: param.defaultValue,
    axis: null,
    scanKind: "linear",
    start: null,
    stop: null,
    centre: null,
    span: null,
    points: DEFAULT_POINTS,
    listText: "",
    randomise: false,
  };
}

/**
 * Seed a sensible scan range for an entry being promoted to an axis. Uses the
 * schema's min/max when it has them, otherwise brackets the default value.
 * Everything is raw (unscaled), exactly as the wire wants it.
 */
export function seedAxisRange(entry) {
  if (Number.isFinite(entry.start) && Number.isFinite(entry.stop)) {
    return entry;
  }
  const def = Number.isFinite(entry.value)
    ? entry.value
    : Number.isFinite(entry.defaultValue)
      ? entry.defaultValue
      : 0;
  const start = numberOr(entry.min, 0);
  const stop = numberOr(entry.max, def !== 0 ? def * 2 : 1);
  const centre = def !== 0 ? def : (start + stop) / 2;
  const span = Math.abs(stop - start) / 2 || 1;
  return { ...entry, start, stop, centre, span };
}

function nextFreeAxis(workingSet) {
  const used = new Set(
    workingSet.filter((e) => e.mode === "axis").map((e) => e.axis),
  );
  for (let n = 1; n <= MAX_AXES; n += 1) if (!used.has(n)) return n;
  return null;
}

function replaceEntry(workingSet, fqn, fn) {
  return workingSet.map((e) => (e.fqn === fqn ? fn(e) : e));
}

/** Sort so axes render before fixed overrides, axes by axis number. */
export function orderWorkingSet(workingSet) {
  const axes = workingSet
    .filter((e) => e.mode === "axis")
    .sort((a, b) => (a.axis || 0) - (b.axis || 0));
  const fixed = workingSet.filter((e) => e.mode !== "axis");
  return [...axes, ...fixed];
}

/** `changed N`: fixed entries differing from their default, plus every axis. */
export function changedCount(workingSet) {
  return workingSet.filter(
    (e) => e.mode === "axis" || e.value !== e.defaultValue,
  ).length;
}

/* ── Actions ──────────────────────────────────────────────────────────────── */

export const A = {
  HYDRATE: "hydrate",
  SELECT_EXPERIMENT: "selectExperiment",
  SET_REVISION: "setRevision",
  PIN_PARAM: "pinParam",
  UNPIN: "unpin",
  PROMOTE_TO_AXIS: "promoteToAxis",
  DEMOTE_TO_FIXED: "demoteToFixed",
  SWAP_AXES: "swapAxes",
  UPDATE_ENTRY: "updateEntry",
  RESET_ENTRY: "resetEntry",
  RESET_ALL: "resetAll",
  SET_FILTER_QUERY: "setFilterQuery",
  TOGGLE_FILTER: "toggleFilter",
  TOGGLE_BRANCH: "toggleBranch",
  SET_PIPELINE: "setPipeline",
  SET_PRIORITY: "setPriority",
  SET_REPEATS: "setRepeats",
  SET_SKIP_ON_ERROR: "setSkipOnError",
  SET_PINNED_LIVE_RID: "setPinnedLiveRid",
  SET_GHOST_RID: "setGhostRid",
  SET_VISIBLE_CHANNELS: "setVisibleChannels",
  SET_SELECTED_IMAGE_KEYS: "setSelectedImageKeys",
  APPLY_PRESET: "applyPreset",
  SYNC_WORKING_SET: "syncWorkingSet",
};

/* ── Reducer ──────────────────────────────────────────────────────────────── */

/**
 * @param {object} state
 * @param {{type: string, [k: string]: any}} action
 * @returns {object} next state
 */
export function sessionReducer(state, action) {
  // Every action clears the transient notice unless it sets a new one.
  const s = state.notice == null ? state : { ...state, notice: null };

  switch (action.type) {
    case A.HYDRATE:
      return hydrateSessionState(action.name ?? s.name, action.state);

    case A.SELECT_EXPERIMENT: {
      // Changing experiment clears the working set and the filter query but
      // keeps pipeline/priority/repeats/skipOnError and the live/ghost RIDs.
      const same =
        experimentKey(s.selectedExperiment) ===
        experimentKey(action.experiment);
      if (same) return { ...s, selectedExperiment: action.experiment };
      return {
        ...s,
        selectedExperiment: action.experiment || null,
        workingSet: [],
        filterQuery: "",
      };
    }

    case A.SET_REVISION:
      return { ...s, revision: action.revision ?? "" };

    case A.PIN_PARAM: {
      const param = action.param;
      if (!param || !param.fqn) return s;
      if (s.workingSet.some((e) => e.fqn === param.fqn)) return s;
      return {
        ...s,
        workingSet: orderWorkingSet([...s.workingSet, entryFromParam(param)]),
      };
    }

    case A.UNPIN:
      return {
        ...s,
        workingSet: orderWorkingSet(
          s.workingSet.filter((e) => e.fqn !== action.fqn),
        ),
      };

    case A.PROMOTE_TO_AXIS: {
      const fqn = action.fqn || action.param?.fqn;
      if (!fqn) return s;
      let workingSet = s.workingSet;
      let entry = workingSet.find((e) => e.fqn === fqn);
      if (!entry) {
        if (!action.param) return s;
        entry = entryFromParam(action.param);
        workingSet = [...workingSet, entry];
      }
      if (entry.mode === "axis") return { ...s, workingSet };
      const axis = nextFreeAxis(workingSet);
      if (axis === null) {
        return {
          ...s,
          notice: `This design supports at most ${MAX_AXES} scan axes — demote one first.`,
        };
      }
      return {
        ...s,
        workingSet: orderWorkingSet(
          replaceEntry(workingSet, fqn, (e) =>
            seedAxisRange({ ...e, mode: "axis", axis }),
          ),
        ),
      };
    }

    case A.DEMOTE_TO_FIXED: {
      const demoted = replaceEntry(s.workingSet, action.fqn, (e) => ({
        ...e,
        mode: "fixed",
        axis: null,
      }));
      // Close the gap so the surviving axis is always axis 1.
      const axes = demoted
        .filter((e) => e.mode === "axis")
        .sort((a, b) => (a.axis || 0) - (b.axis || 0));
      const renumber = new Map(axes.map((e, i) => [e.fqn, i + 1]));
      return {
        ...s,
        workingSet: orderWorkingSet(
          demoted.map((e) =>
            renumber.has(e.fqn) ? { ...e, axis: renumber.get(e.fqn) } : e,
          ),
        ),
      };
    }

    case A.SWAP_AXES: {
      const axes = s.workingSet.filter((e) => e.mode === "axis");
      if (axes.length < 2) return s;
      return {
        ...s,
        workingSet: orderWorkingSet(
          s.workingSet.map((e) =>
            e.mode === "axis" ? { ...e, axis: e.axis === 1 ? 2 : 1 } : e,
          ),
        ),
      };
    }

    case A.UPDATE_ENTRY:
      return {
        ...s,
        workingSet: orderWorkingSet(
          replaceEntry(s.workingSet, action.fqn, (e) => ({
            ...e,
            ...action.patch,
          })),
        ),
      };

    case A.RESET_ENTRY:
      return {
        ...s,
        workingSet: orderWorkingSet(
          replaceEntry(s.workingSet, action.fqn, (e) => ({
            ...e,
            value: e.defaultValue,
          })),
        ),
      };

    case A.RESET_ALL:
      return { ...s, workingSet: [] };

    case A.SET_FILTER_QUERY:
      return { ...s, filterQuery: action.query ?? "" };

    case A.TOGGLE_FILTER:
      return {
        ...s,
        filters: {
          ...s.filters,
          [action.key]:
            action.value === undefined ? !s.filters[action.key] : action.value,
        },
      };

    case A.TOGGLE_BRANCH: {
      const key = action.experimentKey || experimentKey(s.selectedExperiment);
      const current = s.treeExpanded[key] || [];
      const has = current.includes(action.path);
      const next =
        action.value === undefined
          ? has
            ? current.filter((p) => p !== action.path)
            : [...current, action.path]
          : action.value
            ? has
              ? current
              : [...current, action.path]
            : current.filter((p) => p !== action.path);
      return { ...s, treeExpanded: { ...s.treeExpanded, [key]: next } };
    }

    case A.SET_PIPELINE:
      return { ...s, pipeline: action.pipeline || "main" };

    case A.SET_PRIORITY: {
      const p = Number(action.priority);
      return { ...s, priority: Number.isFinite(p) ? Math.trunc(p) : 0 };
    }

    case A.SET_REPEATS: {
      const r = Number(action.repeats);
      return {
        ...s,
        repeats: Number.isFinite(r) && r >= 1 ? Math.trunc(r) : 1,
      };
    }

    case A.SET_SKIP_ON_ERROR:
      return { ...s, skipOnError: Boolean(action.value) };

    case A.SET_PINNED_LIVE_RID:
      return { ...s, pinnedLiveRid: action.rid ?? null };

    case A.SET_GHOST_RID:
      return { ...s, ghostRid: action.rid ?? null };

    case A.SET_VISIBLE_CHANNELS:
      return { ...s, visibleChannels: action.channels ?? null };

    case A.SET_SELECTED_IMAGE_KEYS:
      return { ...s, selectedImageKeys: action.keys || [] };

    case A.APPLY_PRESET: {
      const p = action.preset;
      if (!p) return s;
      return {
        ...s,
        selectedExperiment:
          p.file && p.class_name
            ? {
                file: p.file,
                class_name: p.class_name,
                name: p.class_name,
                docstring: "",
                ...(s.selectedExperiment &&
                experimentKey(s.selectedExperiment) ===
                  `${p.file}:${p.class_name}`
                  ? s.selectedExperiment
                  : {}),
              }
            : s.selectedExperiment,
        workingSet: orderWorkingSet(
          Array.isArray(p.working_set) ? p.working_set : [],
        ),
        pipeline: p.pipeline ?? s.pipeline,
        priority: p.priority ?? s.priority,
        repeats: p.repeats ?? s.repeats,
        skipOnError: p.skip_on_error ?? s.skipOnError,
        revision: p.revision ?? s.revision,
      };
    }

    /**
     * Reconcile the working set against a freshly computed param model: drop
     * entries whose FQN no longer exists and refresh the schema-derived fields
     * (description/unit/scale/default) while keeping the user's values.
     */
    case A.SYNC_WORKING_SET: {
      const byFqn = new Map((action.params || []).map((p) => [p.fqn, p]));
      const kept = [];
      const dropped = [];
      for (const e of s.workingSet) {
        const p = byFqn.get(e.fqn);
        if (!p) {
          dropped.push(e.fqn);
          continue;
        }
        kept.push({
          ...e,
          description: p.description || "",
          unit: p.unit || "",
          scale: p.scale ?? 1,
          scannable: p.scannable === true,
          type: p.type,
          path: p.path ?? "",
          choices: p.choices,
          min: p.min,
          max: p.max,
          step: p.step,
          defaultValue: p.defaultValue,
        });
      }
      return {
        ...s,
        workingSet: orderWorkingSet(kept),
        notice: dropped.length
          ? `Dropped ${
              dropped.length
            } override(s) that no longer exist: ${dropped.join(", ")}`
          : null,
      };
    }

    default:
      return s;
  }
}

export default sessionReducer;

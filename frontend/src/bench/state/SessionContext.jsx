/**
 * Bench session store.
 *
 * One React context holds the whole per-session working state (IMPL-SPEC §4).
 * The reducer and every pure helper live in `sessionReducer.js` so they can be
 * unit-tested from plain Node; this file is only the provider, persistence and
 * cross-tab plumbing. Everything from `sessionReducer.js` is re-exported here
 * so consumers need a single import.
 *
 * Persistence:
 *   artiq_http.bench.session.<name>   the session blob
 *   artiq_http.bench.sessions         JSON array of session names
 *   artiq_http.bench.activeSession    the active session name
 *
 * Hydration is synchronous on mount (no flash); writes are debounced ~250ms.
 * Cross-tab sync mirrors the `storage`-event pattern in
 * `hooks/useLocalStorageState.js`.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";

import {
  A,
  DEFAULT_SESSION_NAME,
  LS_ACTIVE_SESSION,
  LS_SESSION_PREFIX,
  LS_SESSIONS,
  MAX_AXES,
  axisRole,
  changedCount,
  experimentKey,
  hydrateSessionState,
  serialiseSessionState,
  sessionReducer,
} from "./sessionReducer";

export * from "./sessionReducer";

const PERSIST_DEBOUNCE_MS = 250;

/* ── localStorage helpers (never throw) ───────────────────────────────────── */

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded / storage disabled: in-memory state still works.
  }
}

function readSessionNames() {
  const names = readJSON(LS_SESSIONS, null);
  if (Array.isArray(names) && names.length) return names.map(String);
  return [DEFAULT_SESSION_NAME];
}

function readActiveName() {
  try {
    return localStorage.getItem(LS_ACTIVE_SESSION) || DEFAULT_SESSION_NAME;
  } catch {
    return DEFAULT_SESSION_NAME;
  }
}

function loadSession(name) {
  return hydrateSessionState(name, readJSON(LS_SESSION_PREFIX + name, null));
}

/* ── Context ──────────────────────────────────────────────────────────────── */

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  // Hydrate synchronously so the first paint already has the stored session.
  const [sessions, setSessions] = useState(readSessionNames);
  const [state, dispatch] = useReducer(sessionReducer, undefined, () =>
    loadSession(readActiveName()),
  );

  const nameRef = useRef(state.name);
  nameRef.current = state.name;

  // Debounced persistence of the active session blob.
  useEffect(() => {
    const id = setTimeout(() => {
      writeJSON(LS_SESSION_PREFIX + state.name, serialiseSessionState(state));
    }, PERSIST_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [state]);

  // Keep the session list / active pointer in storage.
  useEffect(() => {
    writeJSON(LS_SESSIONS, sessions);
  }, [sessions]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_ACTIVE_SESSION, state.name);
    } catch {
      /* ignore */
    }
  }, [state.name]);

  // Cross-tab sync.
  useEffect(() => {
    const onStorage = (e) => {
      if (!e.key) return;
      if (e.key === LS_SESSIONS) {
        setSessions(readSessionNames());
        return;
      }
      if (e.key === LS_ACTIVE_SESSION) {
        const next = e.newValue || DEFAULT_SESSION_NAME;
        if (next !== nameRef.current) {
          dispatch({
            type: A.HYDRATE,
            name: next,
            state: readJSON(LS_SESSION_PREFIX + next, null),
          });
        }
        return;
      }
      if (e.key === LS_SESSION_PREFIX + nameRef.current) {
        let parsed = null;
        try {
          parsed = e.newValue ? JSON.parse(e.newValue) : null;
        } catch {
          parsed = null;
        }
        dispatch({ type: A.HYDRATE, name: nameRef.current, state: parsed });
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* ── Actions ────────────────────────────────────────────────────────────── */

  const stateRef = useRef(state);
  stateRef.current = state;

  const actions = useMemo(() => {
    // Persist immediately before swapping sessions so nothing is lost to the
    // debounce window.
    const flush = () =>
      writeJSON(
        LS_SESSION_PREFIX + nameRef.current,
        serialiseSessionState(stateRef.current),
      );

    return {
      selectExperiment: (experiment) =>
        dispatch({ type: A.SELECT_EXPERIMENT, experiment }),
      setRevision: (revision) => dispatch({ type: A.SET_REVISION, revision }),
      pinParam: (param) => dispatch({ type: A.PIN_PARAM, param }),
      unpin: (fqn) => dispatch({ type: A.UNPIN, fqn }),
      /**
       * Promote a parameter to a scan axis. Accepts either an FQN string (the
       * parameter must already be in the working set) or a normalised `Param`
       * object, which is pinned first — so the tree's `⌖` works in one click.
       */
      promoteToAxis: (fqnOrParam) =>
        dispatch(
          typeof fqnOrParam === "string"
            ? { type: A.PROMOTE_TO_AXIS, fqn: fqnOrParam }
            : { type: A.PROMOTE_TO_AXIS, param: fqnOrParam },
        ),
      demoteToFixed: (fqn) => dispatch({ type: A.DEMOTE_TO_FIXED, fqn }),
      swapAxes: () => dispatch({ type: A.SWAP_AXES }),
      updateEntry: (fqn, patch) =>
        dispatch({ type: A.UPDATE_ENTRY, fqn, patch }),
      resetEntry: (fqn) => dispatch({ type: A.RESET_ENTRY, fqn }),
      resetAll: () => dispatch({ type: A.RESET_ALL }),
      setFilterQuery: (query) => dispatch({ type: A.SET_FILTER_QUERY, query }),
      toggleFilter: (key, value) =>
        dispatch({ type: A.TOGGLE_FILTER, key, value }),
      toggleBranch: (path, value, key) =>
        dispatch({ type: A.TOGGLE_BRANCH, path, value, experimentKey: key }),
      setPipeline: (pipeline) => dispatch({ type: A.SET_PIPELINE, pipeline }),
      setPriority: (priority) => dispatch({ type: A.SET_PRIORITY, priority }),
      setRepeats: (repeats) => dispatch({ type: A.SET_REPEATS, repeats }),
      setPinnedLiveRid: (rid) => dispatch({ type: A.SET_PINNED_LIVE_RID, rid }),
      setGhostRid: (rid) => dispatch({ type: A.SET_GHOST_RID, rid }),
      setVisibleChannels: (channels) =>
        dispatch({ type: A.SET_VISIBLE_CHANNELS, channels }),
      setSelectedImageKeys: (keys) =>
        dispatch({ type: A.SET_SELECTED_IMAGE_KEYS, keys }),
      /** Reconcile the working set against a fresh param model. */
      syncWorkingSet: (params) =>
        dispatch({ type: A.SYNC_WORKING_SET, params }),
      switchSession: (name) => {
        if (!name || name === nameRef.current) return;
        flush();
        setSessions((prev) => (prev.includes(name) ? prev : [...prev, name]));
        dispatch({
          type: A.HYDRATE,
          name,
          state: readJSON(LS_SESSION_PREFIX + name, null),
        });
      },
      createSession: (name) => {
        if (!name) return;
        flush();
        setSessions((prev) => (prev.includes(name) ? prev : [...prev, name]));
        dispatch({ type: A.HYDRATE, name, state: null });
      },
    };
  }, []);

  const value = useMemo(() => {
    const axes = state.workingSet.filter((e) => e.mode === "axis");
    return {
      ...actions,
      state,
      session: state,
      sessions,
      notice: state.notice,
      // Derived, never stored.
      axes,
      axisRole,
      changedCount: changedCount(state.workingSet),
      experimentKey: experimentKey(state.selectedExperiment),
      expandedBranches:
        state.treeExpanded[experimentKey(state.selectedExperiment)] || [],
      canAddAxis: axes.length < MAX_AXES,
    };
  }, [actions, state, sessions]);

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

SessionProvider.propTypes = { children: PropTypes.node };

/** Access the bench session store. Must be inside a `<SessionProvider>`. */
export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession() must be used inside <SessionProvider>");
  }
  return ctx;
}

/** Escape hatch for tests / stories that need the raw context object. */
export { SessionContext };

export default SessionProvider;

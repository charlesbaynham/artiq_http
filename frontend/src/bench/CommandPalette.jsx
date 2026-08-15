/**
 * CommandPalette — the ⌘K overlay (IMPL-SPEC §2/§15; handoff "Global").
 *
 * Searches three sources and shows them grouped with captions: experiments
 * (`explist.experiments`), runs (current schedule items + past ndscan runs
 * discovered via dataset names), and datasets (`get_dataset_names()`, fetched
 * once on first open and cached for the component's lifetime). Arrow keys
 * move the selection, Enter activates, Esc closes, clicking the backdrop
 * closes.
 *
 * Enter on an experiment loads it into the submit pane and stays on `/`
 * (never navigates away); on a run it pins that RID as the live pane's run
 * and navigates to `/`; on a dataset it navigates to
 * `/datasets?select=<name>`.
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import { get_dataset_names } from "../api/client";
import { useSession } from "./state/SessionContext";
import { useSchedule } from "./state/useSchedule";
import { useNdscanRuns } from "./state/useLiveRun";

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

function norm(s) {
  return (s || "").toLowerCase();
}

/** Substring match first, then an in-order subsequence match. */
function fuzzyIncludes(text, query) {
  if (!query) return true;
  const t = norm(text);
  const q = norm(query);
  if (t.includes(q)) return true;
  let i = 0;
  for (let j = 0; j < t.length && i < q.length; j += 1) {
    if (t[j] === q[i]) i += 1;
  }
  return i === q.length;
}

const MAX_PER_GROUP = 8;

function PaletteGroup({
  caption,
  kind,
  items,
  startIndex,
  selected,
  onHover,
  onPick,
  render,
  keyFn,
}) {
  if (!items.length) return null;
  return (
    <div className="bs-palette__group">
      <div className="bs-palette__group-label b-caption">
        {caption} <span className="b-faint">· {items.length}</span>
      </div>
      {items.map((item, i) => {
        const idx = startIndex + i;
        const isSelected = idx === selected;
        return (
          <button
            type="button"
            key={keyFn ? keyFn(item) : idx}
            data-idx={idx}
            className={cx("bs-palette__item", isSelected && "is-selected")}
            onMouseEnter={() => onHover(idx)}
            onClick={() => onPick({ kind, value: item })}
          >
            {render(item)}
          </button>
        );
      })}
    </div>
  );
}

PaletteGroup.propTypes = {
  caption: PropTypes.string.isRequired,
  kind: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  startIndex: PropTypes.number.isRequired,
  selected: PropTypes.number,
  onHover: PropTypes.func.isRequired,
  onPick: PropTypes.func.isRequired,
  render: PropTypes.func.isRequired,
  keyFn: PropTypes.func,
};

function CommandPalette({ open, onClose, explist }) {
  const navigate = useNavigate();
  const session = useSession();
  const { items: scheduleItems } = useSchedule();
  const { runs: ndscanRuns } = useNdscanRuns();

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [datasetNames, setDatasetNames] = useState(null);
  const [datasetError, setDatasetError] = useState(null);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const fetchedRef = useRef(false);

  // Reset the query on every open; fetch dataset names once and cache them
  // for the rest of the session (they don't change fast enough to warrant
  // refetching every time the palette opens).
  useEffect(() => {
    if (!open) return undefined;
    setQuery("");
    setSelected(0);
    const focusId = setTimeout(() => inputRef.current?.focus(), 0);
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      get_dataset_names()
        .then((data) => setDatasetNames(data?.names || []))
        .catch((err) => setDatasetError(err?.message || String(err)));
    }
    return () => clearTimeout(focusId);
  }, [open]);

  const experimentResults = useMemo(() => {
    const list = explist?.experiments || [];
    const filtered = query
      ? list.filter(
          (e) =>
            fuzzyIncludes(e.name, query) ||
            fuzzyIncludes(e.class_name, query) ||
            fuzzyIncludes(e.file, query) ||
            fuzzyIncludes(e.docstring, query),
        )
      : list;
    return filtered.slice(0, MAX_PER_GROUP);
  }, [explist, query]);

  const runResults = useMemo(() => {
    const scheduleByRid = new Map(
      (scheduleItems || []).map((i) => [Number(i.rid), i]),
    );
    const seen = new Set();
    const combined = [];
    for (const r of ndscanRuns || []) {
      if (r.rid == null || seen.has(r.rid)) continue;
      seen.add(r.rid);
      const item = scheduleByRid.get(r.rid);
      combined.push({
        rid: r.rid,
        prefix: r.prefix,
        className: item?.expid?.class_name || null,
        status: item?.status || null,
      });
    }
    for (const item of scheduleItems || []) {
      const rid = Number(item.rid);
      if (seen.has(rid)) continue;
      seen.add(rid);
      combined.push({
        rid,
        prefix: null,
        className: item.expid?.class_name || null,
        status: item.status || null,
      });
    }
    combined.sort((a, b) => b.rid - a.rid);
    const filtered = query
      ? combined.filter(
          (r) =>
            fuzzyIncludes(String(r.rid), query) ||
            fuzzyIncludes(r.className, query),
        )
      : combined;
    return filtered.slice(0, MAX_PER_GROUP);
  }, [scheduleItems, ndscanRuns, query]);

  const datasetResults = useMemo(() => {
    const names = datasetNames || [];
    const filtered = query
      ? names.filter((n) => fuzzyIncludes(n, query))
      : names;
    return filtered.slice(0, MAX_PER_GROUP);
  }, [datasetNames, query]);

  const expStart = 0;
  const runStart = expStart + experimentResults.length;
  const dsStart = runStart + runResults.length;
  const totalCount = dsStart + datasetResults.length;

  useEffect(() => {
    setSelected((i) => Math.min(i, Math.max(totalCount - 1, 0)));
  }, [totalCount]);

  useEffect(() => {
    const el = resultsRef.current?.querySelector(`[data-idx="${selected}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  const flat = useMemo(
    () => [
      ...experimentResults.map((e) => ({ kind: "experiment", value: e })),
      ...runResults.map((r) => ({ kind: "run", value: r })),
      ...datasetResults.map((d) => ({ kind: "dataset", value: d })),
    ],
    [experimentResults, runResults, datasetResults],
  );

  const activate = (entry) => {
    if (!entry) return;
    if (entry.kind === "experiment") {
      const e = entry.value;
      session.selectExperiment({
        file: e.file,
        class_name: e.class_name,
        name: e.name,
        docstring: e.docstring || "",
      });
      navigate("/");
    } else if (entry.kind === "run") {
      session.setPinnedLiveRid(entry.value.rid);
      navigate("/");
    } else if (entry.kind === "dataset") {
      navigate(`/datasets?select=${encodeURIComponent(entry.value)}`);
    }
    onClose();
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((i) => (totalCount ? (i + 1) % totalCount : 0));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((i) => (totalCount ? (i - 1 + totalCount) % totalCount : 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      activate(flat[selected]);
    }
  };

  if (!open) return null;

  return (
    <div
      className="bs-palette-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bs-palette"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={onKeyDown}
      >
        <div className="bs-palette__search">
          <span className="bs-palette__search-icon" aria-hidden="true">
            ⌕
          </span>
          <input
            ref={inputRef}
            className="bs-palette__input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            placeholder="jump to experiment, run, dataset"
            aria-label="Search experiments, runs and datasets"
          />
          <span className="bs-palette__kbd b-mono b-faint">Esc</span>
        </div>
        <div className="bs-palette__results b-scroll" ref={resultsRef}>
          <PaletteGroup
            caption="experiments"
            kind="experiment"
            items={experimentResults}
            startIndex={expStart}
            selected={selected}
            onHover={setSelected}
            onPick={activate}
            keyFn={(e) => `${e.file}:${e.class_name}`}
            render={(e) => (
              <>
                <span className="bs-palette__item-title b-mono">
                  {e.class_name}
                </span>
                <span className="bs-palette__item-sub">
                  {e.name && e.name !== e.class_name ? `${e.name} · ` : ""}
                  {e.file}
                </span>
              </>
            )}
          />
          <PaletteGroup
            caption="runs"
            kind="run"
            items={runResults}
            startIndex={runStart}
            selected={selected}
            onHover={setSelected}
            onPick={activate}
            keyFn={(r) => r.rid}
            render={(r) => (
              <>
                <span className="bs-palette__item-title b-mono">
                  RID {r.rid}
                  {r.status ? ` · ${r.status}` : ""}
                </span>
                <span className="bs-palette__item-sub">
                  {r.className || "unknown experiment"}
                </span>
              </>
            )}
          />
          <PaletteGroup
            caption="datasets"
            kind="dataset"
            items={datasetResults}
            startIndex={dsStart}
            selected={selected}
            onHover={setSelected}
            onPick={activate}
            keyFn={(name) => name}
            render={(name) => (
              <span className="bs-palette__item-title b-mono">{name}</span>
            )}
          />
          {totalCount === 0 ? (
            <div className="bs-palette__empty">
              {datasetError
                ? `No matches (datasets unavailable: ${datasetError})`
                : "No matches"}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

CommandPalette.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  explist: PropTypes.shape({
    experiments: PropTypes.array,
  }),
};

export default CommandPalette;

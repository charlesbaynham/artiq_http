/**
 * 2b-2 — Quick-run bottom sheet (IMPL-SPEC §2b-2).
 *
 * Favourites are the *same server-side presets* as the desktop `quick check
 * ▾` control (IMPL-SPEC §8) — loaded with `get_presets({favourites_only:
 * true})`. If the preset store legitimately has none yet, or the endpoint is
 * unavailable (older backend), this degrades to listing a handful of recent
 * experiments from `explist` with a plain "default" pill so the sheet is
 * never empty and a phone launch stays two taps — see the report for how
 * this is signalled.
 *
 * Submission reuses the exact same wire-building helpers the desktop submit
 * pane uses (`submit/params.js`, `api/ndscan.js`): fetch arginfo for the
 * preset's experiment, decide ndscan vs. plain from it, and post through
 * `submit_scan` / `queue_experiment` accordingly — no separate mobile
 * submission path to drift out of sync.
 *
 * Only the preset's *fixed* working-set entries are exposed in the tweak
 * drawer. A scan axis does not fit a single mono-value input, and tweaking a
 * scan range from a phone is not the flow this sheet is for — the axis is
 * still submitted exactly as saved in the preset.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";

import {
  get_presets,
  get_explist_arginfo,
  submit_scan,
  queue_experiment,
} from "../../api/client";
import { isNDScanExperiment, parseNdscanParams, buildFqnToPathMap } from "../../api/ndscan";
import {
  buildParamModel,
  buildScanRequest,
  buildPlainArguments,
  pointCount,
  toDisplayValue,
  fromDisplayValue,
} from "../submit/params";
import { Pill, Caption, Mono, BenchButton, Skeleton } from "../ui/primitives";
import { IconChevron } from "../ui/icons";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const DISMISS_THRESHOLD_PX = 90;
const SHEET_ANIM_MS = 220;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(REDUCED_MOTION_QUERY).matches
  );
}

/** Fallback "favourites" when no real preset is saved: a handful of recent
 * experiments, each tagged with a plain `default` pill. */
function fallbackFavourites(explist) {
  const experiments = explist?.experiments || [];
  return experiments.slice(0, 6).map((exp) => ({
    id: `fallback:${exp.file}:${exp.class_name}`,
    name: "default",
    file: exp.file,
    class_name: exp.class_name,
    favourite: true,
    working_set: [],
    pipeline: "main",
    priority: 0,
    repeats: 1,
    skip_on_error: false,
    revision: null,
    isFallback: true,
  }));
}

function presetSubtitle(preset) {
  const folder = String(preset.file || "").split("/")[0] || preset.file || "";
  const axes = (preset.working_set || []).filter((e) => e.mode === "axis");
  if (!axes.length) return `${folder} · single shot`;
  const dims = `${axes.length}D`;
  let pts = 1;
  for (const a of axes) pts *= pointCount(a) || 0;
  return `${folder} · ${dims} · ${pts} pts`;
}

function isDefaultPillName(name) {
  return String(name || "")
    .trim()
    .toLowerCase() === "default";
}

/** One tweak-drawer row: leaf name + description over a value input. Numeric
 * types display in the schema's unit (raw values are stored unscaled, same
 * convention as the desktop working set). */
function TweakRow({ entry, value, onChange }) {
  const isNumeric = entry.type === "float" || entry.type === "int";
  const displayValue = isNumeric ? toDisplayValue(value, entry.scale) : value;

  const handleChange = (raw) => {
    if (isNumeric) onChange(fromDisplayValue(raw, entry.scale));
    else onChange(raw);
  };

  const leaf = String(entry.fqn || "").split(".").pop();

  if (entry.type === "bool") {
    return (
      <label className="bm-tweak-row">
        <span className="bm-tweak-row__info">
          <Mono className="bm-tweak-row__name">{leaf}</Mono>
          <span className="bm-tweak-row__desc b-ellipsis">{entry.description}</span>
        </span>
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
      </label>
    );
  }

  return (
    <div className="bm-tweak-row">
      <span className="bm-tweak-row__info">
        <Mono className="bm-tweak-row__name">{leaf}</Mono>
        <span className="bm-tweak-row__desc b-ellipsis">{entry.description}</span>
      </span>
      <input
        className="bm-tweak-row__input"
        value={displayValue ?? ""}
        onChange={(e) => handleChange(e.target.value)}
        inputMode={isNumeric ? "decimal" : "text"}
        aria-label={entry.fqn}
      />
    </div>
  );
}

TweakRow.propTypes = {
  entry: PropTypes.object.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
};

function QuickRunSheet({ explist, onClose, onSubmitted }) {
  const [presetsState, setPresetsState] = useState({
    status: "loading",
    items: [],
    usedFallback: false,
  });
  const [selectedId, setSelectedId] = useState(null);
  const [tweaks, setTweaks] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await get_presets({ favourites_only: true });
        const items = Array.isArray(res?.presets) ? res.presets : [];
        if (cancelled) return;
        if (items.length) {
          setPresetsState({ status: "ready", items, usedFallback: false });
        } else {
          setPresetsState({
            status: "ready",
            items: fallbackFavourites(explist),
            usedFallback: true,
          });
        }
      } catch {
        if (cancelled) return;
        setPresetsState({
          status: "ready",
          items: fallbackFavourites(explist),
          usedFallback: true,
        });
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedId == null && presetsState.items.length) {
      setSelectedId(presetsState.items[0].id);
    }
  }, [presetsState.items, selectedId]);

  const selectedPreset = useMemo(
    () => presetsState.items.find((p) => p.id === selectedId) || null,
    [presetsState.items, selectedId],
  );

  const tweakEntries = useMemo(
    () => (selectedPreset?.working_set || []).filter((e) => e.mode !== "axis"),
    [selectedPreset],
  );

  // Selecting a different favourite starts its tweaks fresh from the
  // preset's own saved values.
  const handleSelect = useCallback((id) => {
    setSelectedId(id);
    setTweaks({});
  }, []);

  const handleRunNow = useCallback(async () => {
    if (!selectedPreset || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const finalWorkingSet = (selectedPreset.working_set || []).map((e) =>
        Object.prototype.hasOwnProperty.call(tweaks, e.fqn)
          ? { ...e, value: tweaks[e.fqn] }
          : e,
      );

      let rid = null;
      if (selectedPreset.file && selectedPreset.class_name) {
        const arginfoRes = await get_explist_arginfo(
          selectedPreset.file,
          selectedPreset.class_name,
        );
        const arginfo = arginfoRes?.arginfo ?? arginfoRes;

        if (isNDScanExperiment(arginfo)) {
          const parsed = parseNdscanParams(arginfo);
          const fqnToPath = buildFqnToPathMap(parsed?.instances);
          const body = buildScanRequest({
            experiment: {
              file: selectedPreset.file,
              class_name: selectedPreset.class_name,
            },
            workingSet: finalWorkingSet,
            fqnToPath,
            revision: selectedPreset.revision || "",
            pipeline: selectedPreset.pipeline || "main",
            priority: selectedPreset.priority || 0,
            repeats: selectedPreset.repeats || 1,
            skipOnError: selectedPreset.skip_on_error || false,
          });
          rid = await submit_scan(body);
        } else {
          const params = buildParamModel(arginfo);
          const args = buildPlainArguments(params, finalWorkingSet);
          rid = await queue_experiment(
            selectedPreset.file,
            selectedPreset.class_name,
            selectedPreset.revision || null,
            args,
            selectedPreset.pipeline || "main",
            selectedPreset.priority || 0,
          );
        }
      }

      onSubmitted(rid);
    } catch (err) {
      setSubmitError(err?.message || String(err));
    } finally {
      setSubmitting(false);
    }
  }, [selectedPreset, tweaks, submitting, onSubmitted]);

  /* ── Drag-to-dismiss (pointer events, no library) ─────────────────────── */

  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const dragStartRef = useRef(null);
  const closeTimerRef = useRef(null);

  const requestClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setIsDragging(false);
    setDragY(0);
    const ms = prefersReducedMotion() ? 0 : SHEET_ANIM_MS;
    closeTimerRef.current = window.setTimeout(() => {
      onClose && onClose();
    }, ms);
  }, [isClosing, onClose]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [requestClose]);

  const onHandlePointerDown = useCallback((e) => {
    dragStartRef.current = e.clientY;
    setIsDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }, []);

  const onHandlePointerMove = useCallback((e) => {
    if (dragStartRef.current == null) return;
    setDragY(Math.max(0, e.clientY - dragStartRef.current));
  }, []);

  const onHandlePointerUp = useCallback(() => {
    if (dragStartRef.current == null) return;
    dragStartRef.current = null;
    if (dragY > DISMISS_THRESHOLD_PX) {
      requestClose();
    } else {
      setIsDragging(false);
      setDragY(0);
    }
  }, [dragY, requestClose]);

  const sheetClassName = [
    "bm-sheet",
    isDragging && "is-dragging",
    isClosing && "is-closing",
  ]
    .filter(Boolean)
    .join(" ");
  const sheetStyle =
    isDragging && dragY > 0 ? { transform: `translateY(${dragY}px)` } : undefined;

  return (
    <>
      <button
        type="button"
        className="bm-sheet-backdrop"
        aria-label="Dismiss"
        onClick={requestClose}
      />
      <div
        className={sheetClassName}
        style={sheetStyle}
        role="dialog"
        aria-modal="true"
        aria-label="Quick run"
      >
        <div
          className="bm-sheet__handle"
          onPointerDown={onHandlePointerDown}
          onPointerMove={onHandlePointerMove}
          onPointerUp={onHandlePointerUp}
          onPointerCancel={onHandlePointerUp}
        >
          <div className="bm-sheet__grabber" aria-hidden="true" />
        </div>

        <Caption>favourites</Caption>

        {presetsState.status === "loading" ? (
          <Skeleton rows={3} height={54} />
        ) : presetsState.items.length ? (
          presetsState.items.map((preset) => {
            const selected = preset.id === selectedId;
            const defaultPill = isDefaultPillName(preset.name);
            return (
              <button
                key={preset.id}
                type="button"
                className={`bm-fav-row${selected ? " is-selected" : ""}`}
                onClick={() => handleSelect(preset.id)}
                aria-pressed={selected}
              >
                <span className="bm-fav-row__info">
                  <Mono className="bm-fav-row__name">{preset.class_name}</Mono>
                  <span className="bm-fav-row__sub">{presetSubtitle(preset)}</span>
                </span>
                <Pill
                  active={!defaultPill}
                  className={defaultPill ? "bm-pill-default" : undefined}
                >
                  {preset.name || "default"}
                </Pill>
              </button>
            );
          })
        ) : (
          <div className="bm-hint b-muted">No experiments available.</div>
        )}

        {tweakEntries.length > 0 && (
          <div className="bm-tweak-drawer">
            <button
              type="button"
              className="bm-tweak-drawer__head"
              onClick={() => setDrawerOpen((v) => !v)}
              aria-expanded={drawerOpen}
            >
              <Caption>tweak before running</Caption>
              <div className="b-spacer" />
              <IconChevron direction={drawerOpen ? "down" : "right"} size={11} />
            </button>
            {drawerOpen && (
              <div className="bm-tweak-drawer__body">
                {tweakEntries.map((entry) => (
                  <TweakRow
                    key={entry.fqn}
                    entry={entry}
                    value={
                      Object.prototype.hasOwnProperty.call(tweaks, entry.fqn)
                        ? tweaks[entry.fqn]
                        : entry.value
                    }
                    onChange={(v) =>
                      setTweaks((t) => ({ ...t, [entry.fqn]: v }))
                    }
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {submitError && <div className="bm-hint bm-hint--error">{submitError}</div>}

        <BenchButton
          variant="primary"
          size="lg"
          onClick={handleRunNow}
          disabled={!selectedPreset || submitting}
        >
          {submitting ? "Running…" : "Run now"}
        </BenchButton>
      </div>
    </>
  );
}

QuickRunSheet.propTypes = {
  explist: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSubmitted: PropTypes.func.isRequired,
};

export default QuickRunSheet;

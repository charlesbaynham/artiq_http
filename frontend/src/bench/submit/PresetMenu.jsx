/**
 * The `quick check ▾` preset control (IMPL-SPEC §8).
 *
 * Presets are lab-wide and live server-side, so the desktop control and the
 * mobile favourites list read the same store. If the endpoints are missing
 * (older backend) the control hides itself and the rest of the submit pane is
 * unaffected — a preset fetch must never break submission.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import { create_preset, delete_preset, get_presets } from "../../api/client";
import { Pill } from "../ui/primitives";

function PresetMenu({ experiment, snapshot, appliedName, onApply }) {
  const [presets, setPresets] = useState([]);
  const [available, setAvailable] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [favourite, setFavourite] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const rootRef = useRef(null);

  const file = experiment?.file;
  const class_name = experiment?.class_name;

  const load = useCallback(async () => {
    if (!file || !class_name) return;
    try {
      const data = await get_presets({ file, class_name });
      setPresets(Array.isArray(data?.presets) ? data.presets : []);
      setAvailable(true);
    } catch {
      // Older backend without the presets routes: hide, never throw.
      setAvailable(false);
    }
  }, [file, class_name]);

  useEffect(() => {
    load();
  }, [load]);

  // Close on outside click / Esc.
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

  const save = useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setBusy(true);
    setError(null);
    try {
      await create_preset({
        name: trimmed,
        file,
        class_name,
        favourite,
        ...snapshot,
      });
      setName("");
      setFavourite(false);
      await load();
    } catch (err) {
      setError(err?.message || String(err));
    } finally {
      setBusy(false);
    }
  }, [name, favourite, file, class_name, snapshot, load]);

  const remove = useCallback(
    async (id) => {
      setError(null);
      try {
        await delete_preset(id);
        await load();
      } catch (err) {
        setError(err?.message || String(err));
      }
    },
    [load],
  );

  if (!available || !file) return null;

  return (
    <div className="bw-pop" ref={rootRef}>
      <Pill
        as="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        title="Saved presets for this experiment"
      >
        {appliedName || "presets"} ▾
      </Pill>
      {open ? (
        <div className="bw-pop__menu" role="menu">
          {presets.length === 0 ? (
            <div
              className="bw-pop__item"
              style={{ color: "var(--b-fg-faint)", cursor: "default" }}
            >
              no presets yet
            </div>
          ) : (
            presets.map((p) => (
              <div className="bw-pop__row" key={p.id}>
                <button
                  type="button"
                  className={`bw-pop__item${p.favourite ? " is-active" : ""}`}
                  onClick={() => {
                    onApply(p);
                    setOpen(false);
                  }}
                  title={`Apply “${p.name}”`}
                >
                  <span className="b-ellipsis">{p.name}</span>
                  {p.favourite ? <span>★</span> : null}
                </button>
                <button
                  type="button"
                  className="bw-pop__x"
                  onClick={() => remove(p.id)}
                  title={`Delete “${p.name}”`}
                  aria-label={`Delete preset ${p.name}`}
                >
                  ✕
                </button>
              </div>
            ))
          )}
          <div className="bw-pop__sep" />
          <div className="bw-pop__row">
            <input
              className="b-input"
              value={name}
              placeholder="Save current as…"
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") save();
              }}
              aria-label="New preset name"
            />
          </div>
          <div className="bw-pop__row">
            <label
              className="b-toggle"
              style={{ flex: "1 1 auto", fontSize: "10.5px" }}
            >
              <input
                type="checkbox"
                checked={favourite}
                onChange={(e) => setFavourite(e.target.checked)}
              />
              <span>favourite</span>
            </label>
            <button
              type="button"
              className="bw-head__btn"
              onClick={save}
              disabled={busy || !name.trim()}
            >
              save
            </button>
          </div>
          {error ? (
            <div className="bw-card__err" style={{ padding: "0 6px 4px" }}>
              {error}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

PresetMenu.propTypes = {
  experiment: PropTypes.object,
  /** The preset body minus name/file/class_name: working_set, pipeline, … */
  snapshot: PropTypes.object.isRequired,
  appliedName: PropTypes.string,
  onApply: PropTypes.func.isRequired,
};

export default PresetMenu;

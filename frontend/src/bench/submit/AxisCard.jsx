/**
 * A scan-axis card in the working set.
 *
 * Values in the session store are always **raw** (unscaled), exactly as the
 * wire wants them; the inputs show `raw / scale` in the parameter's own unit.
 * `useScaledNumber` owns that conversion plus the "keep what the user typed"
 * behaviour (so `1.` or `-` survives a re-render) and is shared with FixedCard.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import { Card, Field, Mono, Pill, Spacer } from "../ui/primitives";
import { SCAN_KINDS, parseListText, toDisplayValue } from "./params";
import TickStrip from "./TickStrip";

const KIND_LABEL = {
  linear: "linear",
  log: "log",
  list: "list",
  "centre-span": "centre ± span",
};

/** Format a raw value for display without exponent noise where avoidable. */
export function displayText(raw, scale) {
  if (raw === undefined || raw === null || raw === "") return "";
  if (typeof raw === "boolean") return String(raw);
  const n = Number(raw);
  if (!Number.isFinite(n)) return "";
  const v = toDisplayValue(n, scale);
  if (typeof v !== "number") return String(v);
  // Trim binary-representation dust (3e-5 / 1e-6 → 30, not 29.999999999999997).
  const rounded = Number(v.toPrecision(12));
  return String(rounded);
}

/**
 * Controlled numeric input state that stores raw values but edits display ones.
 *
 * @param {number|null} raw - current raw value from the store
 * @param {number} scale
 * @param {(raw: number) => void} commit - receives the raw value (NaN when the
 *   text is not a number, so `validateEntry` reports it rather than silently
 *   coercing to 0)
 */
export function useScaledNumber(raw, scale, commit) {
  const [text, setText] = useState(() => displayText(raw, scale));
  const textRef = useRef(text);
  textRef.current = text;

  // Re-sync only when the store moved somewhere the current text does not
  // already describe (preset applied, reset, recompute).
  useEffect(() => {
    const parsed = parseFloat(textRef.current);
    const current = Number.isFinite(parsed)
      ? scale
        ? parsed * scale
        : parsed
      : NaN;
    const next = Number(raw);
    if (Number.isFinite(next) && Number.isFinite(current)) {
      if (Math.abs(next - current) <= Math.abs(next) * 1e-12) return;
    } else if (!Number.isFinite(next) && !Number.isFinite(current)) {
      return;
    }
    setText(displayText(raw, scale));
  }, [raw, scale]);

  const onChange = useCallback(
    (value) => {
      setText(value);
      const n = parseFloat(value);
      commit(Number.isFinite(n) ? (scale ? n * scale : n) : NaN);
    },
    [commit, scale],
  );

  return [text, onChange];
}

/* ── Range rows per scan kind ─────────────────────────────────────────────── */

function NumberField({ label, labelWidth, unit, raw, scale, onCommit, width }) {
  const [text, onChange] = useScaledNumber(raw, scale, onCommit);
  return (
    <Field
      label={label}
      labelWidth={labelWidth}
      unit={unit || undefined}
      value={text}
      onChange={onChange}
      width={width}
      inputProps={{ inputMode: "decimal", spellCheck: false }}
    />
  );
}

NumberField.propTypes = {
  label: PropTypes.string,
  labelWidth: PropTypes.number,
  unit: PropTypes.string,
  raw: PropTypes.any,
  scale: PropTypes.number,
  onCommit: PropTypes.func,
  width: PropTypes.number,
};

/** The `list` kind edits display values but stores a raw-valued list. */
function ListField({ entry, onPatch }) {
  const scale = entry.scale || 1;
  const [text, setText] = useState(() =>
    parseListText(entry.listText)
      .map((v) => displayText(v, scale))
      .join(", "),
  );

  const onChange = useCallback(
    (value) => {
      setText(value);
      const raw = String(value)
        .split(/[\s,;]+/)
        .filter((s) => s !== "")
        .map((s) => {
          const n = parseFloat(s);
          return Number.isFinite(n) ? (scale ? n * scale : n) : NaN;
        })
        .join(",");
      onPatch({ listText: raw });
    },
    [onPatch, scale],
  );

  return (
    <Field
      className="b-field--list"
      label="values"
      labelWidth={44}
      unit={entry.unit || undefined}
      value={text}
      onChange={onChange}
      inputProps={{ spellCheck: false, placeholder: "1, 2, 5, 10" }}
    />
  );
}

ListField.propTypes = { entry: PropTypes.object, onPatch: PropTypes.func };

/* ── The card ─────────────────────────────────────────────────────────────── */

function AxisCard({ entry, prefix, leaf, role, showSwap, error, actions }) {
  const { onPatch, onUnpin, onSwap } = actions;
  const scale = entry.scale || 1;
  const kind = entry.scanKind || "linear";

  const patchPoints = useCallback(
    (value) => {
      const n = parseInt(value, 10);
      onPatch({ points: Number.isFinite(n) ? n : NaN });
    },
    [onPatch],
  );

  const commit = useCallback(
    (key) => (raw) => onPatch({ [key]: raw }),
    [onPatch],
  );

  return (
    <Card className="bw-axis">
      <div className="bw-card__title">
        {prefix ? <Mono className="bw-fqn-prefix">{prefix}</Mono> : null}
        <Mono
          className="bw-fqn-leaf"
          style={prefix ? undefined : { marginLeft: 0 }}
        >
          {leaf}
        </Mono>
        <Pill strong title={`Scan axis ${entry.axis}`}>
          axis {entry.axis} · {role}
        </Pill>
        {showSwap ? (
          <Pill as="button" onClick={onSwap} title="Exchange outer and inner">
            swap ⇅
          </Pill>
        ) : null}
        <Spacer />
        <button
          type="button"
          className="bw-glyph"
          onClick={onUnpin}
          title="Remove from the working set"
          aria-label={`Unpin ${entry.fqn}`}
        >
          ✕
        </button>
      </div>

      {entry.description ? (
        <div className="bw-card__desc">{entry.description}</div>
      ) : null}

      <div className="bw-kinds">
        {SCAN_KINDS.map((k) => (
          <Pill
            key={k}
            as="button"
            active={k === kind}
            onClick={() => onPatch({ scanKind: k })}
          >
            {KIND_LABEL[k]}
          </Pill>
        ))}
        <Spacer />
        <Pill
          as="button"
          active={entry.randomise === true}
          onClick={() => onPatch({ randomise: !entry.randomise })}
          title="Randomise the order points are visited in"
        >
          randomise
        </Pill>
      </div>

      <div className="bw-range">
        {kind === "list" ? (
          <ListField entry={entry} onPatch={onPatch} />
        ) : (
          <>
            {kind === "centre-span" ? (
              <>
                <NumberField
                  label="centre"
                  labelWidth={44}
                  unit={entry.unit}
                  raw={entry.centre}
                  scale={scale}
                  onCommit={commit("centre")}
                />
                <NumberField
                  label="span"
                  labelWidth={36}
                  unit={entry.unit}
                  raw={entry.span}
                  scale={scale}
                  onCommit={commit("span")}
                />
              </>
            ) : (
              <>
                <NumberField
                  label="start"
                  labelWidth={36}
                  unit={entry.unit}
                  raw={entry.start}
                  scale={scale}
                  onCommit={commit("start")}
                />
                <NumberField
                  label="stop"
                  labelWidth={32}
                  unit={entry.unit}
                  raw={entry.stop}
                  scale={scale}
                  onCommit={commit("stop")}
                />
              </>
            )}
            <Field
              className="b-field--pts"
              label="pts"
              labelWidth={34}
              value={Number.isFinite(entry.points) ? String(entry.points) : ""}
              onChange={patchPoints}
              inputProps={{ inputMode: "numeric", spellCheck: false }}
            />
          </>
        )}
      </div>

      <TickStrip entry={entry} />

      {error ? <div className="bw-card__err">{error}</div> : null}
    </Card>
  );
}

AxisCard.propTypes = {
  entry: PropTypes.object.isRequired,
  prefix: PropTypes.string,
  leaf: PropTypes.string,
  role: PropTypes.string,
  showSwap: PropTypes.bool,
  error: PropTypes.string,
  actions: PropTypes.object.isRequired,
};

export default AxisCard;

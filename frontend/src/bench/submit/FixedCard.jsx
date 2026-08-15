/**
 * A fixed-override card in the working set.
 *
 * Every parameter type is rendered, not just numbers: `bool` gets a checkbox,
 * `enum` a select, `string` a text input. The old submission UI silently
 * dropped string and enum parameters, which is exactly the failure mode this
 * card exists to prevent.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import { Card, Mono, Pill } from "../ui/primitives";
import { displayText, useScaledNumber } from "./AxisCard";

function isOverridden(entry) {
  return entry.value !== entry.defaultValue;
}

/** Short, human form of a default value for the `was <default> ↺` affordance. */
function defaultLabel(entry) {
  const d = entry.defaultValue;
  if (d === undefined || d === null) return "—";
  if (typeof d === "boolean") return d ? "true" : "false";
  if (typeof d === "number") return displayText(d, entry.scale || 1);
  return String(d);
}

function NumericValue({ entry, invalid, onCommit }) {
  const [text, onChange] = useScaledNumber(
    entry.value,
    entry.scale || 1,
    onCommit,
  );
  return (
    <input
      className={`b-input${
        invalid ? " is-invalid" : isOverridden(entry) ? " is-overridden" : ""
      }`}
      value={text}
      onChange={(e) => onChange(e.target.value)}
      inputMode="decimal"
      spellCheck={false}
      aria-label={entry.fqn}
      aria-invalid={invalid || undefined}
    />
  );
}

NumericValue.propTypes = {
  entry: PropTypes.object,
  invalid: PropTypes.bool,
  onCommit: PropTypes.func,
};

/** Free text needs the same "keep what was typed" behaviour as numbers. */
function TextValue({ entry, invalid, onCommit }) {
  const [text, setText] = useState(() =>
    entry.value == null ? "" : String(entry.value),
  );
  const ref = useRef(text);
  ref.current = text;
  useEffect(() => {
    const next = entry.value == null ? "" : String(entry.value);
    if (next !== ref.current) setText(next);
  }, [entry.value]);

  return (
    <input
      className={`b-input${
        invalid ? " is-invalid" : isOverridden(entry) ? " is-overridden" : ""
      }`}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        onCommit(e.target.value);
      }}
      spellCheck={false}
      aria-label={entry.fqn}
      aria-invalid={invalid || undefined}
    />
  );
}

TextValue.propTypes = {
  entry: PropTypes.object,
  invalid: PropTypes.bool,
  onCommit: PropTypes.func,
};

function FixedCard({ entry, prefix, leaf, error, canAddAxis, actions }) {
  const { onPatch, onReset, onUnpin, onPromote } = actions;
  const overridden = isOverridden(entry);
  const invalid = Boolean(error);

  const commitValue = useCallback((value) => onPatch({ value }), [onPatch]);

  const choices = Array.isArray(entry.choices) ? entry.choices : null;
  const type = entry.type;

  let control;
  if (type === "bool") {
    control = (
      <div className="bw-fixed__val bw-fixed__val--check">
        <input
          type="checkbox"
          className="bw-check"
          checked={entry.value === true}
          onChange={(e) => commitValue(e.target.checked)}
          aria-label={entry.fqn}
        />
      </div>
    );
  } else if (type === "enum" && choices && choices.length) {
    control = (
      <select
        className={`bw-select${
          invalid ? " is-invalid" : overridden ? " is-overridden" : ""
        }`}
        value={entry.value == null ? "" : String(entry.value)}
        onChange={(e) => commitValue(e.target.value)}
        aria-label={entry.fqn}
      >
        {choices.map((c) => (
          <option key={c} value={c}>
            {entry.choiceLabels?.[c] ?? c}
          </option>
        ))}
      </select>
    );
  } else if (type === "float" || type === "int") {
    control = (
      <div className="bw-fixed__val">
        <NumericValue entry={entry} invalid={invalid} onCommit={commitValue} />
      </div>
    );
  } else {
    control = (
      <div className="bw-fixed__val bw-fixed__val--text">
        <TextValue entry={entry} invalid={invalid} onCommit={commitValue} />
      </div>
    );
  }

  return (
    <Card className="bw-fixed">
      <div className="bw-fixed__row">
        <span className="bw-fixed__fqn" title={entry.fqn}>
          {prefix ? <Mono className="bw-fqn-prefix">{prefix}</Mono> : null}
          <Mono className="bw-fqn-leaf">{leaf}</Mono>
        </span>
        {overridden ? (
          <button
            type="button"
            className="bw-was"
            onClick={onReset}
            title="Restore the default"
          >
            was {defaultLabel(entry)} ↺
          </button>
        ) : null}
        {control}
        {entry.unit && (type === "float" || type === "int") ? (
          <Mono className="bw-fixed__unit">{entry.unit}</Mono>
        ) : null}
        <Pill
          as="button"
          quiet={entry.scannable}
          onClick={onPromote}
          disabled={!entry.scannable || !canAddAxis}
          title={
            !entry.scannable
              ? "This parameter is not scannable"
              : canAddAxis
                ? "Promote to a scan axis"
                : "Already using the maximum of 2 scan axes"
          }
          aria-label={`Make ${entry.fqn} a scan axis`}
          style={entry.scannable ? undefined : { color: "var(--b-fg-faint)" }}
        >
          ⌖
        </Pill>
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
        <span className="bw-card__desc">{entry.description}</span>
      ) : null}
      {error ? <div className="bw-card__err">{error}</div> : null}
    </Card>
  );
}

FixedCard.propTypes = {
  entry: PropTypes.object.isRequired,
  prefix: PropTypes.string,
  leaf: PropTypes.string,
  error: PropTypes.string,
  canAddAxis: PropTypes.bool,
  actions: PropTypes.object.isRequired,
};

export default FixedCard;

/** Re-exported so WorkingSet can dim the reset button consistently. */
export { isOverridden };

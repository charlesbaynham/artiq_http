/**
 * Bench UI primitives.
 *
 * Small, unopinionated, prop-driven building blocks. They carry no layout
 * opinions of their own — every consumer supplies its own container. All
 * styling lives in `bench.css`; these components only map props onto the
 * `.b-*` classes.
 *
 * No react-bootstrap: the bench UI is plain elements + bench.css.
 */

import React from "react";
import PropTypes from "prop-types";

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

/* ── Pill ─────────────────────────────────────────────────────────────────── */

/**
 * A pill. Plain = `--b-well` fill with no border; `active` = accent wash +
 * accent border + accent text; `status` = ok-wash + ok text.
 *
 * Renders a `<button>` when `onClick` is supplied (so it is keyboard
 * reachable) and a `<span>` otherwise. Override with `as`.
 */
export function Pill({
  children,
  active = false,
  status = false,
  strong = false,
  danger = false,
  quiet = false,
  as,
  onClick,
  title,
  className,
  ...rest
}) {
  const Tag = as || (onClick ? "button" : "span");
  const props = {
    className: cx(
      "b-pill",
      active && "is-active",
      status && "is-status",
      strong && "is-strong",
      danger && "is-danger",
      quiet && "is-quiet",
      className,
    ),
    title,
    onClick,
    ...rest,
  };
  if (Tag === "button") {
    props.type = props.type || "button";
    if (onClick) props["aria-pressed"] = active || undefined;
  }
  return <Tag {...props}>{children}</Tag>;
}

Pill.propTypes = {
  children: PropTypes.node,
  active: PropTypes.bool,
  status: PropTypes.bool,
  strong: PropTypes.bool,
  danger: PropTypes.bool,
  quiet: PropTypes.bool,
  as: PropTypes.elementType,
  onClick: PropTypes.func,
  title: PropTypes.string,
  className: PropTypes.string,
};

/* ── Caption ──────────────────────────────────────────────────────────────── */

/** 10px uppercase `.08em` section caption in `--b-fg-muted`. */
export function Caption({ children, className, ...rest }) {
  return (
    <span className={cx("b-caption", className)} {...rest}>
      {children}
    </span>
  );
}

Caption.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

/* ── Mono ─────────────────────────────────────────────────────────────────── */

/** Mono, tabular-numeric span. Mandatory for FQNs, RIDs, numbers, units. */
export function Mono({ children, className, ...rest }) {
  return (
    <span className={cx("b-mono", className)} {...rest}>
      {children}
    </span>
  );
}

Mono.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

/* ── Card ─────────────────────────────────────────────────────────────────── */

/** `--b-surface` card, 1px border, 6px radius. `raised`/`accent` variants. */
export function Card({
  children,
  className,
  raised = false,
  accent = false,
  as: Tag = "div",
  ...rest
}) {
  return (
    <Tag
      className={cx(
        "b-card",
        raised && "is-raised",
        accent && "is-accent",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  raised: PropTypes.bool,
  accent: PropTypes.bool,
  as: PropTypes.elementType,
};

/* ── PanelHeader ──────────────────────────────────────────────────────────── */

/** Flex header row with a bottom border — the standard panel/card header. */
export function PanelHeader({ children, className, ...rest }) {
  return (
    <div className={cx("b-panel-h", className)} {...rest}>
      {children}
    </div>
  );
}

PanelHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

/* ── BenchButton ──────────────────────────────────────────────────────────── */

/**
 * `variant`: "default" | "ghost" | "primary" | "danger".
 * `size`: "sm" (22px, in-panel) | "md" (26px, top bar) | "lg" (30px, submit).
 * `icon` squares the button for a lone glyph.
 */
export function BenchButton({
  children,
  variant = "default",
  size = "md",
  icon = false,
  className,
  type = "button",
  ...rest
}) {
  return (
    <button
      type={type}
      className={cx(
        "b-btn",
        `b-btn--${size}`,
        variant !== "default" && `b-btn--${variant}`,
        icon && "b-btn--icon",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

BenchButton.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(["default", "ghost", "primary", "danger"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  icon: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string,
};

/* ── Spacer ───────────────────────────────────────────────────────────────── */

/** `flex:1` filler — the design's `<div style="flex:1">`. */
export function Spacer() {
  return <div className="b-spacer" />;
}

/* ── Skeleton ─────────────────────────────────────────────────────────────── */

/** Loading placeholder: `rows` bars of `height` px in `--b-surface-raised`. */
export function Skeleton({ rows = 5, height = 28, className }) {
  return (
    <div className={cx("b-skeleton", className)} aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="b-skeleton__row" style={{ height }} />
      ))}
    </div>
  );
}

Skeleton.propTypes = {
  rows: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string,
};

/* ── Toggle ───────────────────────────────────────────────────────────────── */

/** Labelled checkbox. The whole label is the touch target. */
export function Toggle({
  label,
  checked = false,
  onChange,
  className,
  ...rest
}) {
  return (
    <label className={cx("b-toggle", className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange && onChange(e.target.checked, e)}
        {...rest}
      />
      <span>{label}</span>
    </label>
  );
}

Toggle.propTypes = {
  label: PropTypes.node,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  className: PropTypes.string,
};

/* ── Field ────────────────────────────────────────────────────────────────── */

/**
 * The joined input + unit-suffix control from the design.
 *
 * With a `unit` the input gets radius `4 0 0 4` and the suffix (in
 * `--b-surface-raised`, `border-left:none`) gets `0 4 4 0`. Without one the
 * input is fully rounded.
 *
 * `invalid` may be `true` or a message string; a string is rendered under the
 * row. `value`/`onChange` are controlled — `onChange` receives the raw string,
 * so callers own parsing and scaling (see `submit/params.js`).
 */
export function Field({
  label,
  unit,
  value,
  onChange,
  invalid = false,
  overridden = false,
  width,
  labelWidth,
  align,
  inputProps,
  className,
  id,
  ...rest
}) {
  const message = typeof invalid === "string" ? invalid : null;
  const isInvalid = Boolean(invalid);
  const autoId = React.useId();
  const inputId = id || autoId;

  return (
    <div
      className={cx("b-field", unit && "b-field--unit", className)}
      style={width != null ? { width, flex: "0 0 auto" } : undefined}
      {...rest}
    >
      {label != null && label !== "" ? (
        <label
          className="b-field__label"
          htmlFor={inputId}
          style={labelWidth != null ? { width: labelWidth } : undefined}
        >
          {label}
        </label>
      ) : null}
      <div className="b-field__body">
        <input
          id={inputId}
          className={cx(
            "b-input",
            isInvalid && "is-invalid",
            overridden && !isInvalid && "is-overridden",
          )}
          value={value ?? ""}
          onChange={(e) => onChange && onChange(e.target.value, e)}
          aria-invalid={isInvalid || undefined}
          aria-label={typeof label === "string" ? label : undefined}
          style={align ? { textAlign: align } : undefined}
          {...inputProps}
        />
        {unit ? <span className="b-field__unit">{unit}</span> : null}
      </div>
      {message ? <div className="b-field__msg">{message}</div> : null}
    </div>
  );
}

Field.propTypes = {
  label: PropTypes.node,
  unit: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  invalid: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  overridden: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  labelWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  align: PropTypes.string,
  inputProps: PropTypes.object,
  className: PropTypes.string,
  id: PropTypes.string,
};

export default {
  Pill,
  Caption,
  Mono,
  Card,
  PanelHeader,
  BenchButton,
  Spacer,
  Skeleton,
  Toggle,
  Field,
};

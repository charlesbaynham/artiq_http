/**
 * Bench icon set — inline 24×24 SVGs at 2px stroke, drawn in `currentColor`.
 *
 * Shapes follow the design reference (and, where sensible, the equivalent
 * `react-bootstrap-icons` glyph), but these are plain SVG components so bench
 * code carries no react-bootstrap dependency.
 *
 * Sizes used by the design: 16 for the desktop icon rail, 20 for the mobile
 * tab bar. Everything else defaults to 16.
 */

import React from "react";
import PropTypes from "prop-types";

const baseProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
  focusable: "false",
};

function Svg({ size = 16, title, children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      {...baseProps}
      {...rest}
      aria-hidden={title ? undefined : "true"}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

Svg.propTypes = {
  size: PropTypes.number,
  title: PropTypes.string,
  children: PropTypes.node,
};

const iconPropTypes = {
  size: PropTypes.number,
  title: PropTypes.string,
  className: PropTypes.string,
};

/** Rail: Bench — the schedule / mixing-slider glyph. */
export function IconBench(props) {
  return (
    <Svg {...props}>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
      <circle cx="9" cy="7" r="2.2" fill="var(--b-bg, #0e0f10)" />
      <circle cx="15" cy="12" r="2.2" fill="var(--b-bg, #0e0f10)" />
      <circle cx="8" cy="17" r="2.2" fill="var(--b-bg, #0e0f10)" />
    </Svg>
  );
}
IconBench.propTypes = iconPropTypes;

/** Rail: Runs — a bulleted list. */
export function IconRuns(props) {
  return (
    <Svg {...props}>
      <line x1="9" y1="6" x2="20" y2="6" />
      <line x1="9" y1="12" x2="20" y2="12" />
      <line x1="9" y1="18" x2="20" y2="18" />
      <circle cx="4.5" cy="6" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="18" r="1.2" fill="currentColor" stroke="none" />
    </Svg>
  );
}
IconRuns.propTypes = iconPropTypes;

/** Rail: Data — a database cylinder. */
export function IconData(props) {
  return (
    <Svg {...props} strokeLinecap="round">
      <ellipse cx="12" cy="5.5" rx="7.5" ry="3" />
      <path d="M4.5 5.5v13c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-13" />
      <path d="M4.5 12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3" />
    </Svg>
  );
}
IconData.propTypes = iconPropTypes;

/** Rail: Logs — a document. */
export function IconLogs(props) {
  return (
    <Svg {...props}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <line x1="8" y1="8" x2="16" y2="8" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="16" x2="13" y2="16" />
    </Svg>
  );
}
IconLogs.propTypes = iconPropTypes;

/** Mobile home — a filled play triangle. */
export function IconPlay(props) {
  return (
    <Svg {...props} strokeWidth={1.5}>
      <path d="M7 4.5 19.5 12 7 19.5z" fill="currentColor" />
    </Svg>
  );
}
IconPlay.propTypes = iconPropTypes;

/** Mobile plots tab — a trend line. */
export function IconChart(props) {
  return (
    <Svg {...props}>
      <polyline points="3.5 17 9 10.5 13 14.5 20.5 6" />
      <polyline points="15.5 6 20.5 6 20.5 11" />
    </Svg>
  );
}
IconChart.propTypes = iconPropTypes;

/** Magnifier. */
export function IconSearch(props) {
  return (
    <Svg {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <line x1="15.5" y1="15.5" x2="20.5" y2="20.5" />
    </Svg>
  );
}
IconSearch.propTypes = iconPropTypes;

/**
 * Disclosure chevron. `direction` rotates it: "down" (default), "right", "up",
 * "left" — so one component serves both the tree disclosure and the `▾` menu
 * affordances.
 */
export function IconChevron({ direction = "down", style, ...rest }) {
  const deg = { down: 0, left: 90, up: 180, right: 270 }[direction] ?? 0;
  return (
    <Svg {...rest} style={{ transform: `rotate(${deg}deg)`, ...(style || {}) }}>
      <polyline points="6 9.5 12 15.5 18 9.5" />
    </Svg>
  );
}
IconChevron.propTypes = {
  ...iconPropTypes,
  direction: PropTypes.oneOf(["up", "down", "left", "right"]),
  style: PropTypes.object,
};

/** Close / unpin ✕. */
export function IconClose(props) {
  return (
    <Svg {...props}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </Svg>
  );
}
IconClose.propTypes = iconPropTypes;

/** Crosshair ⌖ — "make this parameter a scan axis". */
export function IconTarget(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="2.5" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="21.5" />
      <line x1="2.5" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="21.5" y2="12" />
    </Svg>
  );
}
IconTarget.propTypes = iconPropTypes;

/** Refresh ↻ — recompute arguments. */
export function IconRefresh(props) {
  return (
    <Svg {...props}>
      <path d="M20 12a8 8 0 1 1-2.34-5.66" />
      <polyline points="20 4 20 9 15 9" />
    </Svg>
  );
}
IconRefresh.propTypes = iconPropTypes;

/** Copy ⧉. */
export function IconCopy(props) {
  return (
    <Svg {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M15 5.5A2.5 2.5 0 0 0 12.5 3H6a3 3 0 0 0-3 3v6.5A2.5 2.5 0 0 0 5.5 15" />
    </Svg>
  );
}
IconCopy.propTypes = iconPropTypes;

/** Expand ⤢ — fullscreen. */
export function IconExpand(props) {
  return (
    <Svg {...props}>
      <polyline points="14 4 20 4 20 10" />
      <polyline points="10 20 4 20 4 14" />
      <line x1="20" y1="4" x2="13.5" y2="10.5" />
      <line x1="4" y1="20" x2="10.5" y2="13.5" />
    </Svg>
  );
}
IconExpand.propTypes = iconPropTypes;

/** Swap ⇅ — exchange outer/inner scan axes. */
export function IconSwap(props) {
  return (
    <Svg {...props}>
      <polyline points="8 6.5 8 20" />
      <polyline points="4.5 10 8 6.5 11.5 10" />
      <polyline points="16 17.5 16 4" />
      <polyline points="12.5 14 16 17.5 19.5 14" />
    </Svg>
  );
}
IconSwap.propTypes = iconPropTypes;

/** Fragment tree — a branching hierarchy. Filter-bar trigger for the
 * 900–1200px slide-over (IMPL-SPEC §11). */
export function IconTree(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="4.5" r="2" />
      <circle cx="6" cy="19.5" r="2" />
      <circle cx="18" cy="19.5" r="2" />
      <path d="M12 6.5v4" />
      <path d="M12 10.5H6v7" />
      <path d="M12 10.5h6v7" />
    </Svg>
  );
}
IconTree.propTypes = iconPropTypes;

export default {
  IconBench,
  IconRuns,
  IconData,
  IconLogs,
  IconPlay,
  IconChart,
  IconSearch,
  IconChevron,
  IconClose,
  IconTarget,
  IconRefresh,
  IconCopy,
  IconExpand,
  IconSwap,
  IconTree,
};

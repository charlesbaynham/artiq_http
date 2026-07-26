/**
 * 2a-left: the fragment tree (262px).
 *
 * ndscan experiments routinely expose hundreds of parameters (the mock's
 * RabiFlop has 214, real ones have more), so the row list is **windowed**:
 * the visible nodes are flattened into a flat array of fixed-height rows and
 * only the slice inside the viewport (plus an overscan) is mounted. That keeps
 * a keystroke in the filter box cheap no matter how big the fragment tree is.
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";

import { Caption, Mono, Pill } from "../ui/primitives";

/** Row geometry — fixed so the window can be computed without measuring. */
export const BRANCH_H = 25;
export const LEAF_H = 40;
export const ROW_GAP = 1;
const OVERSCAN = 6;
const INDENT = 14;
const BASE_PAD = 6;

/**
 * Depth-first flatten of the visible rows.
 *
 * @param {Array<object>} nodes
 * @param {(node: object) => boolean} isExpanded
 * @returns {Array<{node: object, level: number, open: boolean, top: number, h: number}>}
 */
export function flattenTree(nodes, isExpanded) {
  const rows = [];
  let top = 0;

  const walk = (list, level) => {
    for (const node of list) {
      if (node.kind === "leaf") {
        rows.push({ node, level, open: false, top, h: LEAF_H });
        top += LEAF_H + ROW_GAP;
      } else {
        const open = isExpanded(node);
        rows.push({ node, level, open, top, h: BRANCH_H });
        top += BRANCH_H + ROW_GAP;
        if (open) walk(node.children, level + 1);
      }
    }
  };

  walk(nodes || [], 0);
  return rows;
}

/* ── Rows ─────────────────────────────────────────────────────────────────── */

function BranchRow({ row, onToggle }) {
  const { node, level, open, top, h } = row;
  return (
    <button
      type="button"
      className="bw-tree__row bw-branch"
      style={{ top, height: h, paddingLeft: BASE_PAD + level * INDENT }}
      onClick={() => onToggle(node)}
      aria-expanded={open}
      title={node.path}
    >
      <span className="bw-branch__caret" aria-hidden="true">
        {open ? "▾" : "▸"}
      </span>
      <Mono className="bw-branch__name">{node.name}</Mono>
      <div className="b-spacer" />
      <Mono className="bw-branch__n">{node.descendantCount}</Mono>
    </button>
  );
}

BranchRow.propTypes = { row: PropTypes.object, onToggle: PropTypes.func };

function LeafRow({ row, entry, onPin, onUnpin, onPromote }) {
  const { node, level, top, h } = row;
  const param = node.param;
  const pinned = Boolean(entry);
  const axis = entry?.mode === "axis" ? entry.axis : null;

  return (
    <div
      className={`bw-tree__row bw-leaf${pinned ? " is-pinned" : ""}`}
      style={{ top, height: h, paddingLeft: BASE_PAD + level * INDENT }}
    >
      <button
        type="button"
        className="bw-leaf__text"
        onClick={() => (pinned ? onUnpin(param) : onPin(param))}
        title={param.explanation || param.fqn}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <Mono className="bw-leaf__name">{param.leaf}</Mono>
        <span className="bw-leaf__desc">{param.description || " "}</span>
      </button>
      <div className="bw-leaf__aff">
        {axis ? (
          <Pill
            strong
            as="button"
            onClick={() => onUnpin(param)}
            title={`Scan axis ${axis} — click to unpin`}
          >
            ⌖ axis {axis}
          </Pill>
        ) : (
          <>
            <button
              type="button"
              className={`bw-glyph${param.scannable ? " is-muted" : " is-dim"}`}
              onClick={() => onPromote(param)}
              disabled={!param.scannable}
              title={
                param.scannable
                  ? "Make this a scan axis"
                  : "This parameter is not scannable"
              }
              aria-label={`Make ${param.fqn} a scan axis`}
            >
              ⌖
            </button>
            <button
              type="button"
              className="bw-glyph"
              onClick={() => (pinned ? onUnpin(param) : onPin(param))}
              title={pinned ? "Unpin" : "Pin as a fixed override"}
              aria-label={`${pinned ? "Unpin" : "Pin"} ${param.fqn}`}
            >
              {pinned ? "✕" : "+"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

LeafRow.propTypes = {
  row: PropTypes.object,
  entry: PropTypes.object,
  onPin: PropTypes.func,
  onUnpin: PropTypes.func,
  onPromote: PropTypes.func,
};

/* ── The tree ─────────────────────────────────────────────────────────────── */

/**
 * @param {object} props
 * @param {Array<object>} props.nodes - filtered tree from `filterTree`
 * @param {number} props.matchCount
 * @param {Array<string>} props.expanded - persisted expanded branch paths
 * @param {boolean} props.filtering - a query is active (branches auto-expand)
 * @param {Map<string,object>} props.entriesByFqn
 */
function FragmentTree({
  nodes,
  matchCount,
  expanded,
  filtering,
  query,
  entriesByFqn,
  onToggleBranch,
  onPin,
  onUnpin,
  onPromote,
}) {
  const scrollRef = useRef(null);
  const [view, setView] = useState({ top: 0, height: 480 });

  // Branches that the user closed *while filtering*, so auto-expand does not
  // fight them. Reset whenever the filter state changes.
  const [filterClosed, setFilterClosed] = useState(() => new Set());
  useEffect(() => {
    setFilterClosed(new Set());
  }, [filtering, query]);

  const expandedSet = useMemo(() => new Set(expanded || []), [expanded]);

  const isExpanded = useCallback(
    (node) =>
      node.autoExpand
        ? !filterClosed.has(node.path)
        : expandedSet.has(node.path),
    [expandedSet, filterClosed],
  );

  const rows = useMemo(
    () => flattenTree(nodes, isExpanded),
    [nodes, isExpanded],
  );

  const totalHeight = rows.length
    ? rows[rows.length - 1].top + rows[rows.length - 1].h
    : 0;

  const onScroll = useCallback((e) => {
    const el = e.currentTarget;
    setView({ top: el.scrollTop, height: el.clientHeight });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    const sync = () => setView({ top: el.scrollTop, height: el.clientHeight });
    sync();
    if (typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Binary-search the window: rows are sorted by `top`.
  const visible = useMemo(() => {
    if (!rows.length) return rows;
    const from = view.top - OVERSCAN * LEAF_H;
    const to = view.top + view.height + OVERSCAN * LEAF_H;
    let lo = 0;
    let hi = rows.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (rows[mid].top + rows[mid].h < from) lo = mid + 1;
      else hi = mid;
    }
    const out = [];
    for (let i = lo; i < rows.length && rows[i].top <= to; i += 1) {
      out.push(rows[i]);
    }
    return out;
  }, [rows, view]);

  const handleToggle = useCallback(
    (node) => {
      if (node.autoExpand) {
        setFilterClosed((prev) => {
          const next = new Set(prev);
          if (next.has(node.path)) next.delete(node.path);
          else next.add(node.path);
          return next;
        });
        return;
      }
      onToggleBranch(node.path);
    },
    [onToggleBranch],
  );

  return (
    <div className="bw-tree">
      <div className="b-panel-h">
        <Caption>fragments</Caption>
        <Mono className="bw-tree__count">· {matchCount} matches</Mono>
      </div>
      <div
        className="bw-tree__body b-scroll"
        ref={scrollRef}
        onScroll={onScroll}
      >
        {rows.length === 0 ? (
          <div className="bw-tree__empty">No parameters match this filter.</div>
        ) : (
          <div className="bw-tree__canvas" style={{ height: totalHeight }}>
            {visible.map((row) =>
              row.node.kind === "leaf" ? (
                <LeafRow
                  key={`l:${row.node.path}`}
                  row={row}
                  entry={entriesByFqn.get(row.node.param.fqn)}
                  onPin={onPin}
                  onUnpin={onUnpin}
                  onPromote={onPromote}
                />
              ) : (
                <BranchRow
                  key={`b:${row.node.path}`}
                  row={row}
                  onToggle={handleToggle}
                />
              ),
            )}
          </div>
        )}
      </div>
      <div className="bw-tree__foot">
        Click a leaf to pin it · <Mono>⌖</Mono> makes it an axis
      </div>
    </div>
  );
}

FragmentTree.propTypes = {
  nodes: PropTypes.array,
  matchCount: PropTypes.number,
  expanded: PropTypes.array,
  filtering: PropTypes.bool,
  query: PropTypes.string,
  entriesByFqn: PropTypes.instanceOf(Map),
  onToggleBranch: PropTypes.func,
  onPin: PropTypes.func,
  onUnpin: PropTypes.func,
  onPromote: PropTypes.func,
};

export default FragmentTree;

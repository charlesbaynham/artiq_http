/**
 * IconRail — the 2a column 1 icon rail (IMPL-SPEC §2; handoff "Column 1 —
 * icon rail").
 *
 * 58px, `--b-surface`. Four items — Bench `/`, Runs `/runs`, Data
 * `/datasets`, Logs `/logs` — each a vertical stack of a 16px 2px-stroke icon
 * and a 9px uppercase label. Rail bottom: the master revision, mono 9px,
 * `writing-mode:vertical-rl`, full value in a `title`.
 */
import React from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";

import { IconBench, IconData, IconLogs, IconRuns } from "./ui/icons";

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

const ITEMS = [
  { path: "/", label: "Bench", Icon: IconBench },
  { path: "/runs", label: "Runs", Icon: IconRuns },
  { path: "/datasets", label: "Data", Icon: IconData },
  { path: "/logs", label: "Logs", Icon: IconLogs },
];

/**
 * `explist.current_rev` shown as `<branch>@<short sha>` when it already has
 * that shape (`name@hex`); otherwise verbatim. Real ARTIQ masters report a
 * bare git SHA with no branch name, so most values simply pass through.
 */
export function formatRevision(rev) {
  if (!rev) return "";
  const m = /^([^\s@]+)@([0-9a-f]{6,40})$/i.exec(rev);
  if (m) return `${m[1]}@${m[2].slice(0, 7)}`;
  return rev;
}

function IconRail({ explist }) {
  const location = useLocation();
  const navigate = useNavigate();
  const rev = explist?.current_rev || "";

  return (
    <nav className="bs-rail" aria-label="Bench sections">
      {ITEMS.map(({ path, label, Icon }) => {
        const active = location.pathname === path;
        return (
          <button
            key={path}
            type="button"
            className={cx("bs-rail__item", active && "is-active")}
            aria-current={active ? "page" : undefined}
            onClick={() => navigate(path)}
          >
            <Icon size={16} />
            <span className="bs-rail__label">{label}</span>
          </button>
        );
      })}
      <div className="b-spacer" />
      {rev ? (
        <div className="bs-rail__rev b-mono" title={rev}>
          {formatRevision(rev)}
        </div>
      ) : null}
    </nav>
  );
}

IconRail.propTypes = {
  explist: PropTypes.shape({
    current_rev: PropTypes.string,
  }),
};

export default IconRail;

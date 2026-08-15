/**
 * The sweep tick strip — "the sweep is drawn, not imagined".
 *
 * The design mock fakes this with a repeating gradient, which would make a log
 * or list scan look evenly spaced. Ticks here come from `tickPositions(entry)`,
 * i.e. the *real* point values normalised to 0..1, so log/list scans visibly
 * bunch and any range/points/kind edit redraws them.
 */

import React, { useMemo } from "react";
import PropTypes from "prop-types";

import { tickPositions } from "./params";

/**
 * Above this many points individual 1.5px ticks stop being distinguishable, so
 * we draw an evenly-thinned sample of them rather than mounting thousands of
 * nodes. The sample preserves the spacing pattern.
 */
export const MAX_TICKS = 400;

function TickStrip({ entry }) {
  const positions = useMemo(() => {
    const all = tickPositions(entry);
    if (all.length <= MAX_TICKS) return all;
    const step = all.length / MAX_TICKS;
    const out = [];
    for (let i = 0; i < MAX_TICKS; i += 1) out.push(all[Math.floor(i * step)]);
    return out;
  }, [entry]);

  const total = tickPositions(entry).length;

  return (
    <div
      className="bw-ticks"
      role="img"
      aria-label={
        total ? `Sweep of ${total} points` : "This range produces no points"
      }
      title={total ? `${total} points` : "No points"}
    >
      {positions.length ? (
        <div className="bw-ticks__inner">
          {positions.map((p, i) => (
            <span
              key={i}
              className="bw-ticks__t"
              style={{ left: `calc(${(p * 100).toFixed(4)}% - 0.75px)` }}
            />
          ))}
        </div>
      ) : (
        <span className="bw-ticks__none">no points</span>
      )}
    </div>
  );
}

TickStrip.propTypes = { entry: PropTypes.object };

export default TickStrip;

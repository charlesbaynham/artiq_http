/**
 * The grid summary strip — last child of the working set.
 *
 * `21 × 11 = 231 pts` with the total in accent; one axis reads `101 pts`; with
 * no axes the strip is not rendered at all (the caller decides).
 */

import React from "react";
import PropTypes from "prop-types";

import { Caption, Card, Mono, Spacer } from "../ui/primitives";
import { INFINITE_REPEATS, pointCount } from "./params";

function GridSummary({ axes, repeats, onSetRepeats }) {
  const counts = axes.map(pointCount);
  const product = counts.reduce((a, b) => a * b, 1);
  const infinite = repeats === INFINITE_REPEATS;

  return (
    <Card raised className="bw-grid">
      <Caption>grid</Caption>
      <Mono className="bw-grid__product">
        {counts.length > 1 ? `${counts.join(" × ")} = ` : null}
        <span className="b-accent">{product} pts</span>
      </Mono>
      <Spacer />
      <span className="bw-grid__repeats">
        repeats
        <input
          value={infinite ? "∞" : String(repeats)}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            onSetRepeats(Number.isFinite(n) && n >= 1 ? n : 1);
          }}
          inputMode="numeric"
          aria-label="Number of repeats"
          title="How many times the whole grid is run"
          disabled={infinite}
        />
        ·
        <button
          type="button"
          className={`bw-inf${infinite ? " is-on" : ""}`}
          onClick={() => onSetRepeats(infinite ? 1 : INFINITE_REPEATS)}
          title={
            infinite ? "Stop repeating forever" : "Repeat until cancelled (∞)"
          }
          aria-pressed={infinite}
        >
          ∞
        </button>
      </span>
    </Card>
  );
}

GridSummary.propTypes = {
  axes: PropTypes.array.isRequired,
  repeats: PropTypes.number,
  onSetRepeats: PropTypes.func,
};

export default GridSummary;

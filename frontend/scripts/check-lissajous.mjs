// Plain-Node checks for plots/lissajous.js: `node scripts/check-lissajous.mjs`
import assert from "node:assert/strict";
import {
  findLissajousChannels,
  lissajousPoints,
  fitEllipse,
} from "../src/plots/lissajous.js";

const f = (description) => ({ type: "float", description });

assert.deepEqual(
  findLissajousChannels({
    atom_number_forward: f("Atom number (forward)"),
    atom_number_backward: f("Atom number (backward)"),
    atom_number_imbalance: f("Imbalance"),
    excitation_fraction_forward: f("Excitation fraction (forward)"),
  }),
  { forward: "atom_number_forward", backward: "atom_number_backward" },
);
assert.equal(
  findLissajousChannels({
    atom_number_forward: f("Atom number (forward)"),
    atom_number: f("Atom number"),
  }),
  null,
);
assert.equal(
  findLissajousChannels({
    excitation_fraction_forward: f("x"),
    excitation_fraction_backward: f("y"),
  }),
  null,
);
assert.equal(
  findLissajousChannels({
    atom_number_forward: { type: "string", description: "" },
    atom_number_backward: f(""),
  }),
  null,
);

// Repeats collapse to their mean, ordered by scan value; NaNs are dropped.
const pts = lissajousPoints([2, 1, 2, 3], [4, 1, 6, NaN], [0, 2, 2, 9]);
assert.deepEqual(pts, [
  { s: 1, x: 1, y: 2 },
  { s: 2, x: 5, y: 1 },
]);

// Phase recovery over a spread of δ, with a partial fringe and a noisy offset.
for (const deg of [20, 45, 70, 90]) {
  const d = (deg * Math.PI) / 180;
  const data = Array.from({ length: 80 }, (_, i) => {
    const phi = (2 * Math.PI * 1.7 * i) / 80;
    return {
      s: i,
      x: 5e4 + 3e4 * Math.cos(phi),
      y: 4e4 + 2.5e4 * Math.cos(phi + d),
    };
  });
  const fit = fitEllipse(data);
  assert.ok(fit, `fit δ=${deg}`);
  assert.ok(Math.abs(fit.deltaDeg - deg) < 0.5, `δ=${deg} got ${fit.deltaDeg}`);
  assert.ok(Math.abs(fit.centre.x - 5e4) < 100);
  assert.ok(Math.abs(fit.centre.y - 4e4) < 100);
}

// A straight line (δ = 0) is not an ellipse; too few points never fit.
const line = Array.from({ length: 20 }, (_, i) => ({
  s: i,
  x: i,
  y: 2 * i + 1,
}));
assert.equal(fitEllipse(line), null);
assert.equal(fitEllipse(line.slice(0, 4)), null);
console.log("lissajous checks passed");

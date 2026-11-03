// Lissajous view of a differential interferometer: the two traps' excitation
// fractions (forward / backward) plotted against each other, parametrised by
// the scan.
// Pure helpers — exercised by `scripts/check-lissajous.mjs` under plain Node.

const NUMERIC = new Set(["int", "float"]);

// Find the forward/backward excitation-fraction channels. Matching is on the key
// (the ndscan channel path) with the description as a fallback, so
// `excitation_fraction_forward`, or `p_fwd` described as "Excitation fraction
// (forward)", qualify; `atom_number_forward` and `atom_number_imbalance` do not.
export function findLissajousChannels(channels) {
  if (!channels) return null;
  const find = (direction) => {
    const re = direction === "forward" ? /forward|fwd/ : /backward|bwd/;
    const keys = Object.keys(channels).filter((k) => {
      const spec = channels[k] || {};
      if (!NUMERIC.has(spec.type)) return false;
      const text = `${k} ${spec.description || ""}`.toLowerCase();
      return /excitation|excited/.test(text) && re.test(text);
    });
    return keys.sort((a, b) => a.length - b.length)[0] || null;
  };
  const forward = find("forward");
  const backward = find("backward");
  return forward && backward ? { forward, backward } : null;
}

// Collapse repeats at the same scan value to their mean and order by scan
// value, so the connecting path follows the fringe rather than arrival order.
export function lissajousPoints(scan, forward, backward) {
  const groups = new Map();
  const n = Math.min(scan.length, forward.length, backward.length);
  for (let i = 0; i < n; i++) {
    const [s, f, b] = [scan[i], forward[i], backward[i]];
    if (![s, f, b].every(Number.isFinite)) continue;
    const g = groups.get(s) || { s, f: 0, b: 0, n: 0 };
    g.f += f;
    g.b += b;
    g.n += 1;
    groups.set(s, g);
  }
  return [...groups.values()]
    .map((g) => ({ s: g.s, x: g.f / g.n, y: g.b / g.n }))
    .sort((p, q) => p.s - q.s);
}

function solve(A, b) {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++)
      if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (Math.abs(M[p][c]) < 1e-12) return null;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = c + 1; r < n; r++) {
      const f = M[r][c] / M[c][c];
      for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
    }
  }
  const x = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) {
    let s = M[r][n];
    for (let k = r + 1; k < n; k++) s -= M[r][k] * x[k];
    x[r] = s / M[r][r];
  }
  return x;
}

// Least-squares conic a x² + b xy + c y² + d x + e y = 1 on standardised
// coordinates. Returns null unless the result is a genuine ellipse.
//
// For x = A cos φ, y = B cos(φ + δ) the conic's xy coefficient gives the
// interferometer phase directly: |cos δ| = |b| / (2 √(a c)), independent of the
// axis scales. `deltaDeg` is therefore |δ| in [0, 90] — the sign is not
// recoverable from the ellipse alone.
export function fitEllipse(points, samples = 120) {
  if (points.length < 6) return null;
  const mean = (k) => points.reduce((s, p) => s + p[k], 0) / points.length;
  const mx = mean("x");
  const my = mean("y");
  const sd = (k, m) =>
    Math.sqrt(points.reduce((s, p) => s + (p[k] - m) ** 2, 0) / points.length);
  const sx = sd("x", mx);
  const sy = sd("y", my);
  if (!(sx > 0) || !(sy > 0)) return null;

  const AtA = Array.from({ length: 5 }, () => new Array(5).fill(0));
  const Atb = new Array(5).fill(0);
  for (const p of points) {
    const u = (p.x - mx) / sx;
    const v = (p.y - my) / sy;
    const row = [u * u, u * v, v * v, u, v];
    for (let i = 0; i < 5; i++) {
      Atb[i] += row[i];
      for (let j = 0; j < 5; j++) AtA[i][j] += row[i] * row[j];
    }
  }
  const sol = solve(AtA, Atb);
  if (!sol) return null;
  const [a, b, c, d, e] = sol;
  const det = a * c - (b * b) / 4;
  if (!(a > 0) || !(det > 0)) return null;

  const cu = (b * e - 2 * c * d) / (4 * det);
  const cv = (b * d - 2 * a * e) / (4 * det);
  const k = 1 - (d * cu + e * cv) / 2;
  if (!(k > 0)) return null;

  const [an, bn, cn] = [a / k, b / k, c / k];
  const half = Math.sqrt(((an - cn) / 2) ** 2 + (bn / 2) ** 2);
  const mid = (an + cn) / 2;
  const [l1, l2] = [mid + half, mid - half];
  const theta = 0.5 * Math.atan2(bn, an - cn);
  const [r1, r2] = [1 / Math.sqrt(l1), 1 / Math.sqrt(l2)];

  const outline = [];
  for (let i = 0; i <= samples; i++) {
    const t = (2 * Math.PI * i) / samples;
    const u =
      cu -
      r2 * Math.cos(t) * Math.sin(theta) +
      r1 * Math.sin(t) * Math.cos(theta);
    const v =
      cv +
      r2 * Math.cos(t) * Math.cos(theta) +
      r1 * Math.sin(t) * Math.sin(theta);
    outline.push({ x: mx + sx * u, y: my + sy * v });
  }
  const cosDelta = Math.min(1, Math.abs(b) / (2 * Math.sqrt(a * c)));
  return {
    centre: { x: mx + sx * cu, y: my + sy * cv },
    outline,
    deltaDeg: (Math.acos(cosDelta) * 180) / Math.PI,
  };
}

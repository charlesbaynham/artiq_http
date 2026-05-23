// Small numeric helpers used by the SVG plots.

export function niceTicks(min, max, target) {
  if (!isFinite(min) || !isFinite(max) || min === max) {
    return [min];
  }
  const range = max - min;
  const rough = range / target;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const norm = rough / mag;
  const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
  const out = [];
  const start = Math.ceil(min / step) * step;
  for (let v = start; v <= max + 1e-9; v += step) out.push(+v.toFixed(10));
  return out;
}

export function formatNum(v) {
  if (!isFinite(v)) return "–";
  const a = Math.abs(v);
  if (a === 0) return "0";
  if (a >= 100) return v.toFixed(0);
  if (a >= 10) return v.toFixed(1);
  if (a >= 1) return v.toFixed(2);
  return v.toFixed(3);
}

// Viridis-ish ramp, slightly warmed to match the orange accent.
const RAMP_STOPS = [
  [0.0, 20, 22, 36],
  [0.25, 60, 60, 110],
  [0.5, 140, 90, 80],
  [0.75, 220, 130, 60],
  [1.0, 248, 220, 110],
];

export function rampColor(v) {
  const t = Math.max(0, Math.min(1, v));
  for (let i = 1; i < RAMP_STOPS.length; i++) {
    if (t <= RAMP_STOPS[i][0]) {
      const f =
        (t - RAMP_STOPS[i - 1][0]) / (RAMP_STOPS[i][0] - RAMP_STOPS[i - 1][0]);
      return [
        Math.round(
          RAMP_STOPS[i - 1][1] + (RAMP_STOPS[i][1] - RAMP_STOPS[i - 1][1]) * f,
        ),
        Math.round(
          RAMP_STOPS[i - 1][2] + (RAMP_STOPS[i][2] - RAMP_STOPS[i - 1][2]) * f,
        ),
        Math.round(
          RAMP_STOPS[i - 1][3] + (RAMP_STOPS[i][3] - RAMP_STOPS[i - 1][3]) * f,
        ),
      ];
    }
  }
  const last = RAMP_STOPS[RAMP_STOPS.length - 1];
  return [last[1], last[2], last[3]];
}

export const CHANNEL_COLOR_VARS = [
  "--p-c0",
  "--p-c1",
  "--p-c2",
  "--p-c3",
  "--p-c4",
  "--p-c5",
  "--p-c6",
  "--p-c7",
];

export function extractRid(prefix) {
  // Prefixes look like "ndscan.rid_1042"
  const m = /rid[_-]?(\d+)/i.exec(prefix);
  return m ? parseInt(m[1], 10) : null;
}

// LocalStorage helpers — per-fragment_fqn channel visibility.
const LS_PREFIX = "artiq_http.plots.channels.";

export function loadChannelVisibility(fragmentFqn) {
  if (!fragmentFqn) return null;
  try {
    const raw = localStorage.getItem(LS_PREFIX + fragmentFqn);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveChannelVisibility(fragmentFqn, visibility) {
  if (!fragmentFqn) return;
  try {
    localStorage.setItem(LS_PREFIX + fragmentFqn, JSON.stringify(visibility));
  } catch {
    // ignore quota / disabled storage
  }
}

#!/usr/bin/env node
/**
 * Dependency-free smoke test for the bench foundation modules.
 *
 * There is no JS test runner configured in this repo (see frontend/package.json),
 * so the core maths of `bench/submit/params.js` and the session reducer are
 * checked here with plain ESM + `node:assert`.
 *
 *   node frontend/scripts/check-params.mjs
 *
 * Exits non-zero on the first failure.
 */

import assert from "node:assert/strict";

import {
  buildParamModel,
  buildTree,
  filterTree,
  fuzzyMatch,
  gridTotal,
  parseListText,
  pointCount,
  scanPoints,
  toWireAxis,
  toWireFixed,
  buildScanRequest,
  validateEntry,
} from "../src/bench/submit/params.js";

import {
  A,
  MAX_AXES,
  changedCount,
  entryFromParam,
  initialSessionState,
  sessionReducer,
} from "../src/bench/state/sessionReducer.js";

let passed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    passed += 1;
  } catch (err) {
    failures.push({ name, err });
  }
}

const close = (a, b, eps = 1e-9) =>
  assert.ok(
    Math.abs(a - b) <= eps * Math.max(1, Math.abs(a), Math.abs(b)),
    `expected ${a} ≈ ${b}`,
  );

/* ── Fixtures ─────────────────────────────────────────────────────────────── */

const NDSCAN_ARGINFO = {
  ndscan_params: [
    {
      ty: "PYONValue",
      default: JSON.stringify({
        instances: {
          "": ["cooling.doppler.freq", "rabi.pulse_duration"],
          sub: ["readout.threshold"],
        },
        schemata: {
          "cooling.doppler.freq": {
            fqn: "cooling.doppler.freq",
            description: "Doppler cooling beam detuning from resonance",
            type: "float",
            default: "-6000000.0",
            spec: {
              unit: "MHz",
              scale: 1e6,
              is_scannable: true,
              min: -2e7,
              max: 0,
            },
          },
          "rabi.pulse_duration": {
            fqn: "rabi.pulse_duration",
            description: "Length of the driving pulse on the qubit transition",
            type: "float",
            default: "1e-05",
            spec: { unit: "us", scale: 1e-6, is_scannable: true },
          },
          "readout.threshold": {
            fqn: "readout.threshold",
            description: "Photon count above which the ion is called bright",
            type: "int",
            default: "14",
            spec: { is_scannable: false },
          },
        },
        always_shown: [
          { __jsonclass__: ["tuple", [["cooling.doppler.freq", ""]]] },
        ],
        overrides: {},
        scan: null,
      }),
    },
    null,
    null,
  ],
};

const PLAIN_ARGINFO = {
  n_shots: [
    { ty: "NumberValue", default: 100, precision: 0, step: 1 },
    "readout",
    "Shots per point",
  ],
  detuning: [
    { ty: "NumberValue", default: 1.5, unit: "MHz", scale: 1e6 },
    null,
    "Drive detuning",
  ],
  enable: [{ ty: "BooleanValue", default: true }, "readout", "Enable readout"],
};

const axisEntry = (patch = {}) => ({
  fqn: "rabi.pulse_duration",
  mode: "axis",
  axis: 1,
  scanKind: "linear",
  start: 0,
  stop: 20,
  points: 21,
  listText: "",
  randomise: false,
  scale: 1,
  ...patch,
});

/* ── Param model ──────────────────────────────────────────────────────────── */

test("buildParamModel normalises ndscan schemata", () => {
  const params = buildParamModel(NDSCAN_ARGINFO);
  assert.equal(params.length, 3);
  const freq = params.find((p) => p.fqn === "cooling.doppler.freq");
  assert.deepEqual(freq.segments, ["cooling", "doppler", "freq"]);
  assert.equal(freq.leaf, "freq");
  assert.equal(freq.prefix, "cooling.doppler.");
  assert.equal(freq.type, "float");
  close(freq.defaultValue, -6e6);
  assert.equal(freq.unit, "MHz");
  assert.equal(freq.scannable, true);
  assert.equal(freq.alwaysShown, true);
  assert.equal(freq.path, "");
  // Sub-fragment path comes from the instances map, not a hardcoded "".
  assert.equal(params.find((p) => p.fqn === "readout.threshold").path, "sub");
});

test("buildParamModel handles plain arginfo, ints and enums", () => {
  const params = buildParamModel(PLAIN_ARGINFO);
  assert.equal(params.length, 3);
  const shots = params.find((p) => p.fqn === "n_shots");
  assert.equal(shots.type, "int");
  assert.equal(shots.prefix, "readout.");
  assert.equal(shots.scannable, false);
  assert.equal(shots.plain, true);
  assert.equal(params.find((p) => p.fqn === "detuning").type, "float");
  assert.equal(params.find((p) => p.fqn === "enable").type, "bool");
});

test("buildTree nests by segments, branches first, with descendant counts", () => {
  const tree = buildTree(buildParamModel(NDSCAN_ARGINFO));
  assert.deepEqual(
    tree.map((n) => n.name),
    ["cooling", "rabi", "readout"],
  );
  const cooling = tree[0];
  assert.equal(cooling.kind, "branch");
  assert.equal(cooling.descendantCount, 1);
  assert.equal(cooling.children[0].name, "doppler");
  assert.equal(cooling.children[0].children[0].kind, "leaf");
  assert.equal(
    cooling.children[0].children[0].param.fqn,
    "cooling.doppler.freq",
  );
});

/* ── Fuzzy matching ───────────────────────────────────────────────────────── */

test("fuzzyMatch: c.d.f matches cooling.doppler.freq", () => {
  const params = buildParamModel(NDSCAN_ARGINFO);
  const freq = params.find((p) => p.fqn === "cooling.doppler.freq");
  const pulse = params.find((p) => p.fqn === "rabi.pulse_duration");
  assert.ok(fuzzyMatch("c.d.f", freq) > 0, "c.d.f should match");
  assert.equal(fuzzyMatch("c.d.f", pulse), 0, "c.d.f should not match rabi");
  assert.ok(fuzzyMatch("", freq) > 0, "empty query matches everything");
  assert.ok(fuzzyMatch("doppler", freq) > 0);
  // Matches the description sentence too.
  assert.ok(fuzzyMatch("detuning from resonance", freq) > 0);
  assert.equal(fuzzyMatch("zzz", freq), 0);
});

test("filterTree prunes, counts matches and auto-expands", () => {
  const params = buildParamModel(NDSCAN_ARGINFO);
  const tree = buildTree(params);
  const { tree: filtered, matchCount } = filterTree(tree, "c.d.f", {}, []);
  assert.equal(matchCount, 1);
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].name, "cooling");
  assert.equal(filtered[0].autoExpand, true);

  const scannable = filterTree(tree, "", { scannableOnly: true }, []);
  assert.equal(scannable.matchCount, 2);

  const unfiltered = filterTree(tree, "", {}, []);
  assert.equal(unfiltered.matchCount, 3);
});

/* ── Scan maths ───────────────────────────────────────────────────────────── */

test("scanPoints: linear", () => {
  const pts = scanPoints(axisEntry({ start: 0, stop: 20, points: 21 }));
  assert.equal(pts.length, 21);
  close(pts[0], 0);
  close(pts[1], 1);
  close(pts[20], 20);
  assert.deepEqual(scanPoints(axisEntry({ points: 1, start: 7 })), [7]);
  assert.deepEqual(scanPoints(axisEntry({ points: 0 })), []);
});

test("scanPoints: log is geometric and endpoint-exact", () => {
  const pts = scanPoints(
    axisEntry({ scanKind: "log", start: 1, stop: 1000, points: 4 }),
  );
  assert.equal(pts.length, 4);
  close(pts[0], 1);
  close(pts[1], 10);
  close(pts[2], 100);
  close(pts[3], 1000);
  // Non-positive bounds produce nothing rather than NaNs.
  assert.deepEqual(
    scanPoints(axisEntry({ scanKind: "log", start: 0, stop: 10, points: 5 })),
    [],
  );
});

test("scanPoints: list parses commas and whitespace", () => {
  assert.deepEqual(parseListText("1, 2  3;4"), [1, 2, 3, 4]);
  const pts = scanPoints(axisEntry({ scanKind: "list", listText: "1, 2, 5" }));
  assert.deepEqual(pts, [1, 2, 5]);
  assert.equal(
    pointCount(axisEntry({ scanKind: "list", listText: "1 2 5" })),
    3,
  );
});

test("scanPoints: centre ± span", () => {
  const pts = scanPoints(
    axisEntry({ scanKind: "centre-span", centre: 10, span: 5, points: 3 }),
  );
  assert.equal(pts.length, 3);
  close(pts[0], 5);
  close(pts[1], 10);
  close(pts[2], 15);
});

test("gridTotal multiplies axes and repeats", () => {
  const ws = [
    axisEntry({ fqn: "a", axis: 1, points: 21 }),
    axisEntry({ fqn: "b", axis: 2, points: 11 }),
    { fqn: "c", mode: "fixed", value: 1, defaultValue: 1 },
  ];
  assert.equal(gridTotal(ws, 1), 231);
  assert.equal(gridTotal(ws, 3), 693);
  assert.equal(gridTotal([], 1), 1);
  assert.equal(gridTotal(ws, 2147483647), Infinity);
});

/* ── Wire encoding ────────────────────────────────────────────────────────── */

test("toWireAxis maps every scan kind to a real ndscan generator", () => {
  const linear = toWireAxis(axisEntry(), {});
  assert.equal(linear.type, "linear");
  assert.deepEqual(linear.range, { start: 0, stop: 20, num_points: 21 });
  assert.equal("path" in linear, false, "root params omit path");

  const cs = toWireAxis(
    axisEntry({ scanKind: "centre-span", centre: 10, span: 5, points: 3 }),
    {},
  );
  assert.equal(cs.type, "centre_span");
  assert.deepEqual(cs.range, { centre: 10, half_span: 5, num_points: 3 });

  // log has no ndscan generator — it compiles to an explicit list.
  const log = toWireAxis(
    axisEntry({ scanKind: "log", start: 1, stop: 100, points: 3 }),
    {},
  );
  assert.equal(log.type, "list");
  assert.equal(log.range.values.length, 3);
  close(log.range.values[1], 10);

  const list = toWireAxis(
    axisEntry({ scanKind: "list", listText: "1,2,3", randomise: true }),
    {},
  );
  assert.equal(list.type, "list");
  assert.deepEqual(list.range.values, [1, 2, 3]);
  assert.equal(list.range.randomise_order, true);

  // A sub-fragment path is passed through so the server targets the right one.
  const sub = toWireAxis(axisEntry({ fqn: "readout.threshold" }), {
    "readout.threshold": "sub",
  });
  assert.equal(sub.path, "sub");
});

test("toWireFixed and buildScanRequest produce the ScanSubmitRequest shape", () => {
  assert.deepEqual(toWireFixed({ fqn: "x", value: 18 }, {}), { value: 18 });
  assert.deepEqual(toWireFixed({ fqn: "x", value: 18 }, { x: "sub" }), {
    value: 18,
    path: "sub",
  });

  const body = buildScanRequest({
    experiment: { file: "Spectroscopy/rabi_flop.py", class_name: "RabiFlop" },
    workingSet: [
      axisEntry({ fqn: "b", axis: 2, points: 11 }),
      axisEntry({ fqn: "a", axis: 1, points: 21 }),
      { fqn: "readout.threshold", mode: "fixed", value: 18, defaultValue: 14 },
    ],
    fqnToPath: {},
    revision: "  master  ",
    repeats: 2,
  });
  // Axis 1 (outer) must come first.
  assert.deepEqual(
    body.axes.map((a) => a.fqn),
    ["a", "b"],
  );
  assert.equal(body.repo_rev, "master");
  assert.equal(body.num_repeats, 2);
  assert.deepEqual(body.fixed_params["readout.threshold"], { value: 18 });
  assert.equal(body.file, "Spectroscopy/rabi_flop.py");
});

/* ── Validation ───────────────────────────────────────────────────────────── */

test("validateEntry catches the inline error cases", () => {
  assert.equal(validateEntry(axisEntry()).valid, true);
  assert.equal(validateEntry(axisEntry({ points: 0 })).valid, false);
  assert.equal(validateEntry(axisEntry({ points: 2.5 })).valid, false);
  assert.equal(validateEntry(axisEntry({ start: NaN })).valid, false);
  assert.equal(
    validateEntry(axisEntry({ scanKind: "log", start: 0, stop: 10 })).valid,
    false,
  );
  assert.equal(
    validateEntry(axisEntry({ scanKind: "list", listText: "" })).valid,
    false,
  );
  assert.equal(
    validateEntry({ mode: "fixed", type: "int", value: 1.5 }).valid,
    false,
  );
  assert.equal(
    validateEntry({ mode: "fixed", type: "float", value: "abc" }).valid,
    false,
  );
  assert.equal(
    validateEntry({ mode: "fixed", type: "float", value: 5, max: 3 }).valid,
    false,
  );
  assert.equal(
    validateEntry({ mode: "fixed", type: "string", value: "x" }).valid,
    true,
  );
});

/* ── Session reducer ──────────────────────────────────────────────────────── */

const paramsByFqn = Object.fromEntries(
  buildParamModel(NDSCAN_ARGINFO).map((p) => [p.fqn, p]),
);

function pin(state, fqn) {
  return sessionReducer(state, { type: A.PIN_PARAM, param: paramsByFqn[fqn] });
}

test("reducer: pin creates a fixed entry from the param defaults", () => {
  const s = pin(initialSessionState(), "cooling.doppler.freq");
  assert.equal(s.workingSet.length, 1);
  assert.equal(s.workingSet[0].mode, "fixed");
  close(s.workingSet[0].value, -6e6);
  assert.equal(s.workingSet[0].defaultValue, s.workingSet[0].value);
  // Pinning twice is idempotent.
  assert.equal(pin(s, "cooling.doppler.freq").workingSet.length, 1);
});

test("reducer: axis promotion is capped at 2 and sets a notice", () => {
  let s = initialSessionState();
  s = pin(s, "cooling.doppler.freq");
  s = pin(s, "rabi.pulse_duration");
  s = pin(s, "readout.threshold");

  s = sessionReducer(s, {
    type: A.PROMOTE_TO_AXIS,
    fqn: "rabi.pulse_duration",
  });
  s = sessionReducer(s, {
    type: A.PROMOTE_TO_AXIS,
    fqn: "cooling.doppler.freq",
  });
  const axes = s.workingSet.filter((e) => e.mode === "axis");
  assert.equal(axes.length, 2);
  assert.equal(axes.find((e) => e.fqn === "rabi.pulse_duration").axis, 1);
  assert.equal(axes.find((e) => e.fqn === "cooling.doppler.freq").axis, 2);
  assert.equal(s.notice, null);

  // The third promotion is a no-op that sets a notice.
  const third = sessionReducer(s, {
    type: A.PROMOTE_TO_AXIS,
    fqn: "readout.threshold",
  });
  assert.equal(
    third.workingSet.filter((e) => e.mode === "axis").length,
    MAX_AXES,
  );
  assert.equal(
    third.workingSet.find((e) => e.fqn === "readout.threshold").mode,
    "fixed",
  );
  assert.ok(third.notice, "expected an inline notice");

  // The notice clears on the next action.
  const after = sessionReducer(third, { type: A.SET_FILTER_QUERY, query: "x" });
  assert.equal(after.notice, null);

  // Axes render before fixed overrides, ordered by axis number.
  assert.deepEqual(
    s.workingSet.map((e) => e.mode),
    ["axis", "axis", "fixed"],
  );

  // swapAxes exchanges the numbers.
  const swapped = sessionReducer(s, { type: A.SWAP_AXES });
  assert.equal(
    swapped.workingSet.find((e) => e.fqn === "rabi.pulse_duration").axis,
    2,
  );
  assert.equal(
    swapped.workingSet.find((e) => e.fqn === "cooling.doppler.freq").axis,
    1,
  );

  // Demoting axis 1 renumbers the survivor to axis 1.
  const demoted = sessionReducer(s, {
    type: A.DEMOTE_TO_FIXED,
    fqn: "rabi.pulse_duration",
  });
  const remaining = demoted.workingSet.filter((e) => e.mode === "axis");
  assert.equal(remaining.length, 1);
  assert.equal(remaining[0].axis, 1);
});

test("reducer: promoteToAxis seeds a usable range", () => {
  let s = pin(initialSessionState(), "cooling.doppler.freq");
  s = sessionReducer(s, {
    type: A.PROMOTE_TO_AXIS,
    fqn: "cooling.doppler.freq",
  });
  const axis = s.workingSet[0];
  assert.equal(Number.isFinite(axis.start), true);
  assert.equal(Number.isFinite(axis.stop), true);
  assert.ok(pointCount(axis) > 1, "seeded axis should produce points");
  assert.equal(validateEntry(axis).valid, true);
});

test("reducer: promoteToAxis accepts a bare param (tree ⌖ in one click)", () => {
  const s = sessionReducer(initialSessionState(), {
    type: A.PROMOTE_TO_AXIS,
    param: paramsByFqn["rabi.pulse_duration"],
  });
  assert.equal(s.workingSet.length, 1);
  assert.equal(s.workingSet[0].mode, "axis");
  assert.equal(s.workingSet[0].axis, 1);
});

test("reducer: selecting a new experiment clears the working set but keeps queue settings", () => {
  let s = initialSessionState();
  s = sessionReducer(s, { type: A.SET_PIPELINE, pipeline: "calibration" });
  s = sessionReducer(s, { type: A.SET_PRIORITY, priority: 5 });
  s = sessionReducer(s, { type: A.SET_REPEATS, repeats: 4 });
  s = sessionReducer(s, { type: A.SET_PINNED_LIVE_RID, rid: 4823 });
  s = sessionReducer(s, { type: A.SET_GHOST_RID, rid: 4821 });
  s = sessionReducer(s, {
    type: A.SELECT_EXPERIMENT,
    experiment: { file: "a.py", class_name: "A" },
  });
  s = pin(s, "readout.threshold");
  s = sessionReducer(s, { type: A.SET_FILTER_QUERY, query: "thresh" });

  const next = sessionReducer(s, {
    type: A.SELECT_EXPERIMENT,
    experiment: { file: "b.py", class_name: "B" },
  });
  assert.deepEqual(next.workingSet, []);
  assert.equal(next.filterQuery, "");
  assert.equal(next.pipeline, "calibration");
  assert.equal(next.priority, 5);
  assert.equal(next.repeats, 4);
  assert.equal(next.pinnedLiveRid, 4823);
  assert.equal(next.ghostRid, 4821);

  // Re-selecting the same experiment keeps the working set.
  const same = sessionReducer(s, {
    type: A.SELECT_EXPERIMENT,
    experiment: { file: "a.py", class_name: "A" },
  });
  assert.equal(same.workingSet.length, 1);
});

test("reducer: changed N counts overrides plus every axis", () => {
  let s = pin(initialSessionState(), "readout.threshold");
  assert.equal(changedCount(s.workingSet), 0);
  s = sessionReducer(s, {
    type: A.UPDATE_ENTRY,
    fqn: "readout.threshold",
    patch: { value: 18 },
  });
  assert.equal(changedCount(s.workingSet), 1);
  s = sessionReducer(s, { type: A.RESET_ENTRY, fqn: "readout.threshold" });
  assert.equal(changedCount(s.workingSet), 0);
  s = pin(s, "rabi.pulse_duration");
  s = sessionReducer(s, {
    type: A.PROMOTE_TO_AXIS,
    fqn: "rabi.pulse_duration",
  });
  assert.equal(changedCount(s.workingSet), 1);
});

test("reducer: treeExpanded toggles per experiment", () => {
  let s = sessionReducer(initialSessionState(), {
    type: A.SELECT_EXPERIMENT,
    experiment: { file: "a.py", class_name: "A" },
  });
  s = sessionReducer(s, { type: A.TOGGLE_BRANCH, path: "cooling" });
  assert.deepEqual(s.treeExpanded["a.py:A"], ["cooling"]);
  s = sessionReducer(s, { type: A.TOGGLE_BRANCH, path: "cooling" });
  assert.deepEqual(s.treeExpanded["a.py:A"], []);
});

test("entryFromParam carries the schema metadata the cards need", () => {
  const e = entryFromParam(paramsByFqn["cooling.doppler.freq"]);
  assert.equal(e.unit, "MHz");
  assert.equal(e.scale, 1e6);
  assert.equal(e.scannable, true);
  assert.equal(e.type, "float");
  assert.equal(e.mode, "fixed");
});

/* ── Report ───────────────────────────────────────────────────────────────── */

for (const { name, err } of failures) {
  console.error(`FAIL  ${name}`);
  console.error(`      ${err.message.split("\n").join("\n      ")}`);
}

if (failures.length) {
  console.error(`\n${failures.length} failed, ${passed} passed`);
  process.exit(1);
}

console.log(`check-params: ${passed} checks passed`);

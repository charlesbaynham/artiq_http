/**
 * The bench parameter model (IMPL-SPEC §3).
 *
 * One normalisation that serves both ndscan experiments and plain ARTIQ
 * experiments, plus the tree building, fuzzy matching, scan maths and wire
 * encoding everything downstream depends on.
 *
 * React-free on purpose so it can be exercised by `scripts/check-params.mjs`.
 * The ndscan parsing primitives are reused from `api/ndscan.js` rather than
 * reimplemented.
 */

import {
  buildFqnToPathMap,
  isNDScanExperiment,
  parseNdscanParams,
  toDisplayValue,
  fromDisplayValue,
} from "../../api/ndscan.js";

export { toDisplayValue, fromDisplayValue };

export const INFINITE_REPEATS = 2147483647;

/** Scan kinds offered in the UI. `log` compiles to an ndscan `list` axis. */
export const SCAN_KINDS = ["linear", "log", "list", "centre-span"];

/* ── Normalisation ────────────────────────────────────────────────────────── */

/**
 * ndscan serialises every schema default as a *string*; coerce by declared type.
 */
export function parseDefault(schema) {
  const raw = schema?.default;
  if (raw === undefined || raw === null) return undefined;
  const type = schema?.type;
  if (typeof raw !== "string") return raw;
  if (type === "float") {
    const v = parseFloat(raw);
    return Number.isNaN(v) ? raw : v;
  }
  if (type === "int") {
    const v = parseInt(raw, 10);
    return Number.isNaN(v) ? raw : v;
  }
  if (type === "bool") return raw === "True" || raw === "true";
  if (type === "string" || type === "enum") return unquotePyon(raw);
  return raw;
}

/**
 * ndscan `str`/`enum` defaults are PYON *expressions*, so a literal string
 * arrives quoted (`"'FAST'"` — see `EnumParam.describe`/`StringParam.describe`
 * in ndscan/experiment/parameters.py). Strip one matching pair of quotes so the
 * UI shows `FAST`, not `'FAST'`; anything else (e.g. a `dataset(...)` call) is
 * left exactly as it came.
 */
export function unquotePyon(raw) {
  const s = String(raw);
  if (s.length >= 2) {
    const q = s[0];
    if ((q === "'" || q === '"') && s[s.length - 1] === q) {
      const inner = s.slice(1, -1);
      if (!inner.includes(q)) return inner;
    }
  }
  return s;
}

/**
 * Choices for an `enum` parameter. ndscan describes them as `spec.members`
 * (a `{NAME: display}` map); plain ARTIQ `EnumerationValue` uses `spec.choices`
 * (a list). Returns `{choices, choiceLabels}` — `choices` are the values that
 * go on the wire, `choiceLabels` what the select shows.
 */
export function enumChoices(spec) {
  if (Array.isArray(spec?.choices)) {
    return { choices: spec.choices, choiceLabels: undefined };
  }
  const members = spec?.members;
  if (members && typeof members === "object" && !Array.isArray(members)) {
    return { choices: Object.keys(members), choiceLabels: members };
  }
  return { choices: undefined, choiceLabels: undefined };
}

/**
 * `always_shown` entries are pyon tuples:
 * `{__jsonclass__: ["tuple", [[fqn, path]]]}`.
 */
export function alwaysShownFqn(item) {
  return (
    item?.__jsonclass__?.[1]?.[0]?.[0] ?? (Array.isArray(item) ? item[0] : item)
  );
}

/** ARTIQ argument processor class → our normalised type. */
export function fromArtiqTy(spec) {
  const ty = typeof spec === "string" ? spec : spec?.ty;
  switch (ty) {
    case "NumberValue": {
      const s = typeof spec === "object" ? spec : {};
      const intish =
        s.precision === 0 &&
        (s.step === undefined || (Number.isFinite(s.step) && s.step % 1 === 0));
      return intish ? "int" : "float";
    }
    case "BooleanValue":
      return "bool";
    case "StringValue":
      return "string";
    case "EnumerationValue":
      return "enum";
    case "PYONValue":
      return "pyon";
    default:
      return "string";
  }
}

function segmentsToParts(segments) {
  const leaf = segments[segments.length - 1];
  const prefix =
    segments.length > 1 ? `${segments.slice(0, -1).join(".")}.` : "";
  return { leaf, prefix };
}

/**
 * Normalise an arginfo payload into `Param[]`.
 *
 * Handles both shapes:
 *  - ndscan: `arginfo.ndscan_params` → `{instances, schemata, always_shown, …}`
 *  - plain:  `{name: [spec, group, tooltip]}`
 *
 * @param {object|null} arginfo
 * @returns {Array<object>} normalised params (see IMPL-SPEC §3.1)
 */
export function buildParamModel(arginfo) {
  if (!arginfo) return [];
  return isNDScanExperiment(arginfo)
    ? buildNdscanParamModel(arginfo)
    : buildPlainParamModel(arginfo);
}

function buildNdscanParamModel(arginfo) {
  const parsed = parseNdscanParams(arginfo);
  if (!parsed) return [];
  const fqnToPath = buildFqnToPathMap(parsed.instances);
  const shown = new Set(
    (parsed.always_shown || []).map(alwaysShownFqn).filter(Boolean),
  );

  const schemata = parsed.schemata || {};
  return Object.entries(schemata).map(([key, schema]) => {
    const fqn = schema?.fqn || key;
    const segments = String(fqn).split(".");
    const { leaf, prefix } = segmentsToParts(segments);
    const spec = schema?.spec || {};
    const { choices, choiceLabels } = enumChoices(spec);
    return {
      fqn,
      path: fqnToPath[fqn] ?? "",
      segments,
      leaf,
      prefix,
      description: schema?.description ?? "",
      explanation: schema?.explanation ?? "",
      type: schema?.type,
      defaultValue: parseDefault(schema),
      unit: spec.unit ?? "",
      scale: spec.scale ?? 1,
      step: spec.step,
      min: spec.min,
      max: spec.max,
      choices,
      choiceLabels,
      scannable: spec.is_scannable === true,
      alwaysShown: shown.has(fqn),
    };
  });
}

function buildPlainParamModel(arginfo) {
  return Object.entries(arginfo).map(([name, entry]) => {
    const [spec, group, tooltip] = Array.isArray(entry) ? entry : [entry];
    const segments = group ? [group, name] : [name];
    const { leaf, prefix } = segmentsToParts(segments);
    const s = spec || {};
    return {
      fqn: name,
      path: "",
      segments,
      leaf,
      prefix,
      description: tooltip ?? "",
      explanation: "",
      type: fromArtiqTy(s),
      defaultValue: s.default,
      unit: s.unit ?? "",
      scale: s.scale ?? 1,
      step: s.step,
      min: s.min,
      max: s.max,
      choices: s.choices,
      // Plain ARTIQ experiments have no scan machinery: every param pins as a
      // fixed override and the grid summary / tick strip never appear.
      scannable: false,
      alwaysShown: true,
      plain: true,
    };
  });
}

/* ── Tree building ────────────────────────────────────────────────────────── */

/**
 * Nest params by `segments[0..n-2]`, leaves last.
 *
 * Branch: `{kind:"branch", name, path, children, descendantCount}`
 * Leaf:   `{kind:"leaf", param, name, path}`
 * Order: branches first (alphabetical), then leaves (alphabetical).
 *
 * @param {Array<object>} params
 * @returns {Array<object>} top-level nodes
 */
export function buildTree(params) {
  const root = { branches: new Map(), leaves: [] };

  for (const param of params || []) {
    const segs = param.segments || [param.fqn];
    let node = root;
    let path = "";
    for (let i = 0; i < segs.length - 1; i += 1) {
      path = path ? `${path}.${segs[i]}` : segs[i];
      if (!node.branches.has(segs[i])) {
        node.branches.set(segs[i], {
          name: segs[i],
          path,
          branches: new Map(),
          leaves: [],
        });
      }
      node = node.branches.get(segs[i]);
    }
    node.leaves.push(param);
  }

  function emit(node) {
    const branches = [...node.branches.values()]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(emit);
    const leaves = [...node.leaves]
      .sort((a, b) => String(a.leaf).localeCompare(String(b.leaf)))
      .map((param) => ({
        kind: "leaf",
        name: param.leaf,
        path: param.fqn,
        param,
      }));
    const children = [...branches, ...leaves];
    return {
      kind: "branch",
      name: node.name,
      path: node.path,
      children,
      descendantCount:
        leaves.length + branches.reduce((n, b) => n + b.descendantCount, 0),
    };
  }

  return emit({ ...root, name: "", path: "" }).children;
}

/** Count leaves in a node list. */
export function countLeaves(nodes) {
  let n = 0;
  for (const node of nodes || []) {
    if (node.kind === "leaf") n += 1;
    else n += countLeaves(node.children);
  }
  return n;
}

/* ── Fuzzy matching ───────────────────────────────────────────────────────── */

function isSubsequence(needle, haystack) {
  if (!needle) return true;
  let i = 0;
  for (let j = 0; j < haystack.length && i < needle.length; j += 1) {
    if (haystack[j] === needle[i]) i += 1;
  }
  return i === needle.length;
}

/**
 * Segmented subsequence match: each dot-separated query segment must be a
 * subsequence of a distinct FQN segment, in order — so `c.d.f` matches
 * `cooling.doppler.freq`. Returns a bonus score, or 0 for no match.
 */
function matchSegments(query, fqn) {
  const qSegs = query.split(".").filter(Boolean);
  const fSegs = fqn.split(".");
  if (!qSegs.length) return 0;
  let fi = 0;
  let bonus = 0;
  for (const q of qSegs) {
    let found = false;
    while (fi < fSegs.length) {
      const f = fSegs[fi];
      fi += 1;
      if (f.startsWith(q)) {
        bonus += 12;
        found = true;
        break;
      }
      if (isSubsequence(q, f)) {
        bonus += 6;
        found = true;
        break;
      }
    }
    if (!found) return 0;
  }
  // Prefer matches that consume the whole FQN over ones leaving tail segments.
  return 40 + bonus - (fSegs.length - fi);
}

/**
 * Score a param against a query. `0` means no match; higher is better.
 * Matches over both the dotted FQN and the description sentence.
 * An empty query matches everything (score 1).
 *
 * @param {string} query
 * @param {object} param
 * @returns {number}
 */
export function fuzzyMatch(query, param) {
  const q = String(query || "")
    .trim()
    .toLowerCase();
  if (!q) return 1;
  const fqn = String(param?.fqn || "").toLowerCase();
  const leaf = String(param?.leaf || "").toLowerCase();
  const desc = String(param?.description || "").toLowerCase();

  if (leaf === q) return 1200;

  const fi = fqn.indexOf(q);
  if (fi >= 0) return 1000 - Math.min(fi, 99) + (fqn.startsWith(q) ? 50 : 0);

  const seg = matchSegments(q, fqn);
  if (seg > 0) return 500 + seg;

  if (isSubsequence(q.replace(/\./g, ""), fqn.replace(/\./g, ""))) return 400;

  const di = desc.indexOf(q);
  if (di >= 0) return 300 - Math.min(di, 99);

  if (isSubsequence(q, desc)) return 150;

  return 0;
}

/** Is this param "changed" relative to its default, given the working set? */
export function isChanged(param, workingSet) {
  const entry = (workingSet || []).find((e) => e.fqn === param.fqn);
  if (!entry) return false;
  return entry.mode === "axis" || entry.value !== entry.defaultValue;
}

/**
 * Prune a tree to the params matching `query` + `filters`.
 *
 * Surviving branches are marked `autoExpand: true` when the query is non-empty
 * so the caller can open matching subtrees without inventing its own rule.
 * Leaves carry their match `score` for optional ranking.
 *
 * @param {Array<object>} tree - from `buildTree`
 * @param {string} query
 * @param {{scannableOnly?: boolean, changedOnly?: boolean}} [filters]
 * @param {Array<object>} [workingSet] - needed for the `changed` filter
 * @returns {{tree: Array<object>, matchCount: number}}
 */
export function filterTree(tree, query, filters = {}, workingSet = []) {
  const q = String(query || "").trim();
  const active = q !== "" || filters.scannableOnly || filters.changedOnly;
  if (!active) return { tree, matchCount: countLeaves(tree) };

  let matchCount = 0;

  function walk(nodes) {
    const out = [];
    for (const node of nodes) {
      if (node.kind === "leaf") {
        const p = node.param;
        if (filters.scannableOnly && !p.scannable) continue;
        if (filters.changedOnly && !isChanged(p, workingSet)) continue;
        const score = fuzzyMatch(q, p);
        if (score <= 0) continue;
        matchCount += 1;
        out.push({ ...node, score });
      } else {
        const children = walk(node.children);
        if (!children.length) continue;
        out.push({
          ...node,
          children,
          descendantCount: countLeaves(children),
          autoExpand: q !== "",
        });
      }
    }
    return out;
  }

  return { tree: walk(tree || []), matchCount };
}

/* ── Scan maths ───────────────────────────────────────────────────────────── */

/** Parse the `list` scan kind's free-text field into numbers. */
export function parseListText(text) {
  return String(text ?? "")
    .split(/[\s,;]+/)
    .filter((s) => s !== "")
    .map((s) => parseFloat(s));
}

function clampPoints(n) {
  const v = Math.trunc(Number(n));
  return Number.isFinite(v) && v > 0 ? v : 0;
}

/**
 * The actual x values a working-set axis entry produces. All raw (unscaled).
 *
 * - `linear`: `points` evenly spaced `start..stop` inclusive (1 → `[start]`).
 * - `centre-span`: same count spanning `centre ± span`.
 * - `log`: `points` geometrically spaced `start..stop` (needs both > 0).
 * - `list`: parsed from `entry.listText`.
 *
 * @param {object} entry
 * @returns {number[]}
 */
export function scanPoints(entry) {
  if (!entry) return [];
  const kind = entry.scanKind || "linear";

  if (kind === "list") {
    return parseListText(entry.listText).filter((v) => Number.isFinite(v));
  }

  const n = clampPoints(entry.points);
  if (n <= 0) return [];

  let start;
  let stop;
  if (kind === "centre-span") {
    const centre = Number(entry.centre);
    const span = Number(entry.span);
    if (!Number.isFinite(centre) || !Number.isFinite(span)) return [];
    start = centre - span;
    stop = centre + span;
  } else {
    start = Number(entry.start);
    stop = Number(entry.stop);
    if (!Number.isFinite(start) || !Number.isFinite(stop)) return [];
  }

  if (n === 1) return [start];

  if (kind === "log") {
    if (!(start > 0) || !(stop > 0)) return [];
    const ratio = Math.pow(stop / start, 1 / (n - 1));
    const out = [];
    for (let i = 0; i < n; i += 1) out.push(start * Math.pow(ratio, i));
    // Pin the endpoint exactly — repeated multiplication drifts.
    out[n - 1] = stop;
    return out;
  }

  const step = (stop - start) / (n - 1);
  const out = [];
  for (let i = 0; i < n; i += 1) out.push(start + step * i);
  out[n - 1] = stop;
  return out;
}

/** Number of points a working-set axis entry produces. */
export function pointCount(entry) {
  return scanPoints(entry).length;
}

/**
 * Total shots for the grid: the product of every axis's point count × repeats.
 * With no axes the grid is a single point. `repeats === 2147483647` → Infinity.
 *
 * @param {Array<object>} entries - the full working set (fixed entries ignored)
 * @param {number} [repeats]
 * @returns {number}
 */
export function gridTotal(entries, repeats = 1) {
  const axes = (entries || []).filter((e) => e.mode === "axis");
  let product = 1;
  for (const axis of axes) product *= pointCount(axis);
  if (repeats === INFINITE_REPEATS) return Infinity;
  const r = Number.isFinite(repeats) && repeats > 0 ? repeats : 1;
  return product * r;
}

/* ── Wire encoding (POST /api/scan) ───────────────────────────────────────── */

function resolvePath(entry, fqnToPath) {
  const path = fqnToPath?.[entry.fqn] ?? entry.path;
  // Only send a path when we actually have a sub-fragment one. Omitting it
  // lets the server resolve from the experiment's `instances` map — the old
  // frontend hardcoded `path: ""`, which silently broke sub-fragment scans.
  return typeof path === "string" && path !== "" ? path : undefined;
}

/**
 * Encode an axis working-set entry as a `ScanAxis`.
 *
 * `linear` → ndscan `linear`; `centre-span` → `centre_span`; `list` **and**
 * `log` → `list` with explicit values (ndscan has no log generator).
 *
 * @param {object} entry
 * @param {Record<string,string>} [fqnToPath]
 * @returns {{fqn: string, type: string, range: object, path?: string}}
 */
export function toWireAxis(entry, fqnToPath) {
  const path = resolvePath(entry, fqnToPath);
  const randomise_order = entry.randomise === true;
  const kind = entry.scanKind || "linear";

  let type;
  let range;
  if (kind === "linear") {
    type = "linear";
    range = {
      start: Number(entry.start),
      stop: Number(entry.stop),
      num_points: clampPoints(entry.points),
    };
  } else if (kind === "centre-span") {
    type = "centre_span";
    range = {
      centre: Number(entry.centre),
      half_span: Number(entry.span),
      num_points: clampPoints(entry.points),
    };
  } else {
    // list and log both compile to an explicit list of values.
    type = "list";
    range = { values: scanPoints(entry) };
  }

  if (randomise_order) range.randomise_order = true;

  const axis = { fqn: entry.fqn, type, range };
  if (path !== undefined) axis.path = path;
  return axis;
}

/**
 * Encode a fixed working-set entry as the *value* of a `fixed_params` entry:
 * `fixed_params[entry.fqn] = toWireFixed(entry, fqnToPath)`.
 *
 * @returns {{value: any, path?: string}}
 */
export function toWireFixed(entry, fqnToPath) {
  const path = resolvePath(entry, fqnToPath);
  const out = { value: entry.value };
  if (path !== undefined) out.path = path;
  return out;
}

/**
 * Assemble a complete `ScanSubmitRequest` from the session state.
 *
 * Axis order matters: axis 1 (outer) first, axis 2 (inner) second.
 *
 * @param {{experiment: object, workingSet: Array<object>, fqnToPath?: object,
 *          revision?: string, pipeline?: string, priority?: number,
 *          repeats?: number, skipOnError?: boolean}} opts
 */
export function buildScanRequest({
  experiment,
  workingSet = [],
  fqnToPath = {},
  revision = "",
  pipeline = "main",
  priority = 0,
  repeats = 1,
  skipOnError = false,
}) {
  const axes = workingSet
    .filter((e) => e.mode === "axis")
    .sort((a, b) => (a.axis || 0) - (b.axis || 0))
    .map((e) => toWireAxis(e, fqnToPath));

  const fixed_params = {};
  for (const e of workingSet) {
    if (e.mode === "axis") continue;
    fixed_params[e.fqn] = toWireFixed(e, fqnToPath);
  }

  return {
    file: experiment?.file,
    class_name: experiment?.class_name,
    axes,
    fixed_params,
    num_repeats: repeats,
    repo_rev: String(revision || "").trim() || null,
    pipeline,
    priority,
    flush: false,
    due_date: null,
    // Backend support for this lands with the presets work; the toggle is
    // never silently dropped on the client side.
    skip_on_persistent_transitory_error: skipOnError === true,
  };
}

/**
 * `arguments` map for a non-ndscan experiment submitted via
 * `POST /api/schedule`: defaults for everything, overridden by the working set.
 */
export function buildPlainArguments(params, workingSet = []) {
  const args = {};
  for (const p of params || []) {
    if (p.defaultValue !== undefined) args[p.fqn] = p.defaultValue;
  }
  for (const e of workingSet) {
    if (e.mode === "axis") continue;
    args[e.fqn] = e.value;
  }
  return args;
}

/* ── Validation ───────────────────────────────────────────────────────────── */

function outOfRange(entry, value) {
  if (Number.isFinite(entry.min) && value < entry.min) {
    return `Below minimum ${toDisplayValue(entry.min, entry.scale)}`;
  }
  if (Number.isFinite(entry.max) && value > entry.max) {
    return `Above maximum ${toDisplayValue(entry.max, entry.scale)}`;
  }
  return null;
}

/**
 * Inline validation for one working-set entry.
 *
 * @param {object} entry
 * @returns {{valid: boolean, message: string|null}}
 */
export function validateEntry(entry) {
  const ok = { valid: true, message: null };
  const bad = (message) => ({ valid: false, message });
  if (!entry) return ok;

  if (entry.mode === "axis") {
    const kind = entry.scanKind || "linear";

    if (kind === "list") {
      const values = parseListText(entry.listText);
      if (!values.length) return bad("Enter at least one value");
      if (values.some((v) => !Number.isFinite(v))) {
        return bad("List contains a value that is not a number");
      }
      for (const v of values) {
        const range = outOfRange(entry, v);
        if (range) return bad(range);
      }
      return ok;
    }

    const points = Number(entry.points);
    if (!Number.isInteger(points) || points < 1) {
      return bad("Points must be a whole number ≥ 1");
    }

    if (kind === "centre-span") {
      if (!Number.isFinite(Number(entry.centre)))
        return bad("Centre is not a number");
      if (!Number.isFinite(Number(entry.span)))
        return bad("Span is not a number");
    } else {
      if (!Number.isFinite(Number(entry.start)))
        return bad("Start is not a number");
      if (!Number.isFinite(Number(entry.stop)))
        return bad("Stop is not a number");
    }

    if (kind === "log") {
      const start = Number(entry.start);
      const stop = Number(entry.stop);
      if (!(start > 0) || !(stop > 0)) {
        return bad("A log scan needs start and stop greater than zero");
      }
    }

    const pts = scanPoints(entry);
    if (!pts.length) return bad("This range produces no points");
    for (const v of [pts[0], pts[pts.length - 1]]) {
      const range = outOfRange(entry, v);
      if (range) return bad(range);
    }
    return ok;
  }

  // Fixed override.
  switch (entry.type) {
    case "float":
    case "int": {
      const v = Number(entry.value);
      if (entry.value === "" || entry.value === null || !Number.isFinite(v)) {
        return bad("Not a number");
      }
      if (entry.type === "int" && !Number.isInteger(v)) {
        return bad("Must be a whole number");
      }
      const range = outOfRange(entry, v);
      if (range) return bad(range);
      return ok;
    }
    case "bool":
      return typeof entry.value === "boolean"
        ? ok
        : bad("Must be true or false");
    case "enum":
      if (Array.isArray(entry.choices) && entry.choices.length) {
        return entry.choices.includes(entry.value)
          ? ok
          : bad(`Must be one of: ${entry.choices.join(", ")}`);
      }
      return ok;
    default:
      return ok;
  }
}

/** Convenience: is every entry in the working set valid? */
export function validateWorkingSet(workingSet) {
  const errors = {};
  for (const e of workingSet || []) {
    const r = validateEntry(e);
    if (!r.valid) errors[e.fqn] = r.message;
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

/* ── Tick strip geometry ──────────────────────────────────────────────────── */

/**
 * Positions (0..1) of each scan point along the sweep tick strip, so log/list
 * scans visibly bunch. Returns `[]` when there is nothing to draw.
 */
export function tickPositions(entry) {
  const pts = scanPoints(entry);
  if (pts.length < 2) return pts.length ? [0.5] : [];
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  if (!(max > min)) return pts.map(() => 0.5);
  return pts.map((v) => (v - min) / (max - min));
}

export default {
  buildParamModel,
  buildTree,
  fuzzyMatch,
  filterTree,
  scanPoints,
  pointCount,
  gridTotal,
  toWireAxis,
  toWireFixed,
  buildScanRequest,
  validateEntry,
};

// Partition result channels into groups that should each be drawn on their own
// 1D plot (with an independent y-scale).
//
// Unlike ndscan — which by default puts *every* channel on its own axis unless
// the experiment opts channels into sharing via `display_hints.share_axis_with`
// — we group primarily by the order-of-magnitude of the channel values: similar
// scales share a plot, and only wildly different scales (e.g. atom_number ~1e5
// vs excitation_fraction 0–1) are split apart so the small-scale channels aren't
// crushed flat. Explicit `share_axis_with` hints are still honoured, but only to
// *force* channels onto a shared axis (never to force otherwise-similar channels
// apart): hinted channels are kept together as an atomic unit and then placed by
// their combined scale.

const SCALAR_TYPES = new Set(["int", "float"]);

function priorityOf(spec) {
  return (spec && spec.display_hints && spec.display_hints.priority) || 0;
}

// Channel names with scalar numerical values, ordered by descending priority
// then path (faithful to ndscan's extract_scalar_channels, minus the error-bar
// reassignment which we don't render).
export function extractScalarChannels(channels) {
  const names = Object.keys(channels).filter((name) =>
    SCALAR_TYPES.has(channels[name] && channels[name].type),
  );
  names.sort((a, b) => {
    const pa = priorityOf(channels[a]);
    const pb = priorityOf(channels[b]);
    if (pa !== pb) return pb - pa;
    const patha = channels[a].path || "";
    const pathb = channels[b].path || "";
    return patha < pathb ? -1 : patha > pathb ? 1 : 0;
  });
  return names;
}

// Resolve the name a channel wants to share an axis/pane with, given a
// `display_hints` keyword. Returns the channel's own name when there is no hint
// or the target path is unknown.
function shareName(name, keyword, channels, pathToName) {
  const hints = (channels[name] && channels[name].display_hints) || {};
  const path = hints[keyword];
  if (path == null) return name;
  if (!(path in pathToName)) return name;
  return pathToName[path];
}

// Whether any channel carries an explicit axis/pane sharing hint. If so we use
// the hint-based grouping; otherwise we fall back to scale-based grouping.
export function hasSharingHints(channels) {
  return Object.keys(channels).some((name) => {
    const hints = (channels[name] && channels[name].display_hints) || {};
    return hints.share_axis_with != null || hints.share_pane_with != null;
  });
}

// Port of ndscan's group_channels_into_axes: group `dataNames` into axes using
// `share_axis_with` hints. Channels with no hint each form their own axis.
export function groupChannelsIntoAxes(channels, dataNames) {
  const pathToName = {};
  for (const name of dataNames) pathToName[channels[name].path] = name;

  const axes = []; // each axis is a list of [index, name]
  const shareNames = {};

  dataNames.forEach((name, index) => {
    const share = shareName(name, "share_axis_with", channels, pathToName);
    shareNames[name] = share;

    let targetAxis = null;
    if (share !== name) {
      for (const axis of axes) {
        if (axis.some(([, existing]) => existing === share)) {
          targetAxis = axis;
          break;
        }
      }
    }
    if (targetAxis === null) {
      targetAxis = [];
      axes.push(targetAxis);
    }
    targetAxis.push([index, name]);

    // Merge any existing axes whose members point at the current name.
    const newAxes = [];
    for (const axis of axes) {
      if (axis === targetAxis) {
        newAxes.push(axis);
        continue;
      }
      const linksToCurrent = axis.some(
        ([, existing]) => shareNames[existing] === name,
      );
      if (linksToCurrent) {
        targetAxis.push(...axis);
      } else {
        newAxes.push(axis);
      }
    }
    axes.length = 0;
    axes.push(...newAxes);
  });

  for (const axis of axes) axis.sort((a, b) => a[0] - b[0]);
  axes.sort((a, b) => a[0][0] - b[0][0]);
  return axes.map((axis) => axis.map(([, name]) => name));
}

// Representative magnitude of a channel: a high quantile of |v| over finite,
// non-zero values. Returns null when there is no usable data.
function representativeMagnitude(values) {
  const mags = [];
  for (const v of values || []) {
    if (typeof v === "number" && isFinite(v) && v !== 0) mags.push(Math.abs(v));
  }
  if (!mags.length) return null;
  mags.sort((a, b) => a - b);
  const idx = Math.min(mags.length - 1, Math.floor(0.9 * mags.length));
  return mags[idx];
}

// Combined representative magnitude of an axis (a list of channel names that
// share a y-scale): the high quantile of |v| over all members' values pooled
// together. Returns null when no member has usable data.
function axisMagnitude(axis, valuesByKey) {
  const pooled = [];
  for (const name of axis) {
    for (const v of valuesByKey[name] || []) pooled.push(v);
  }
  return representativeMagnitude(pooled);
}

// Group axes (lists of channel names sharing a y-scale) into stacked plots by
// scale: split wherever consecutive log10 magnitudes differ by more than
// `decadeGap`, so similar scales share a plot and only very different scales
// split. Axes with no data are kept together in their own trailing group so
// they don't perturb the scaled groups. Each axis stays intact — explicit
// `share_axis_with` membership is never broken apart.
export function groupAxesByScale(axes, valuesByKey, decadeGap = 1.5) {
  const scaled = [];
  const noData = [];
  for (const axis of axes) {
    const mag = axisMagnitude(axis, valuesByKey);
    if (mag == null) noData.push(axis);
    else scaled.push({ axis, log: Math.log10(mag) });
  }
  // Preserve the incoming (priority) order among equal magnitudes by using a
  // stable sort on the log magnitude.
  scaled.sort((a, b) => a.log - b.log);

  const groups = [];
  let current = null;
  let prevLog = null;
  for (const { axis, log } of scaled) {
    if (current === null || log - prevLog > decadeGap) {
      current = [];
      groups.push(current);
    }
    current.push(...axis);
    prevLog = log;
  }
  if (noData.length) groups.push(noData.flat());
  return groups;
}

// Orchestrator: return the channel groups (lists of channel names) to render as
// separate stacked plots. Explicit `share_axis_with` hints force channels onto
// a shared axis (kept atomic); the resulting axes are then split into separate
// plots purely by order-of-magnitude of their values.
export function groupChannels(channels, valuesByKey) {
  const dataNames = extractScalarChannels(channels);
  if (!dataNames.length) return [];
  const axes = hasSharingHints(channels)
    ? groupChannelsIntoAxes(channels, dataNames)
    : dataNames.map((name) => [name]);
  return groupAxesByScale(axes, valuesByKey);
}

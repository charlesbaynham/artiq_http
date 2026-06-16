// Partition result channels into groups that should each be drawn on their own
// 1D plot (with an independent y-scale), mirroring ndscan's behaviour.
//
// ndscan groups channels using explicit `display_hints.share_axis_with`
// annotations (see ndscan/plots/utils.py: group_channels_into_axes). When an
// experiment provides such hints we honour them faithfully. When it doesn't,
// we fall back to grouping by order-of-magnitude of the channel values, so that
// wildly different scales (e.g. atom_number ~1e5 vs excitation_fraction 0–1)
// are never crushed onto the same axis.

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

// Fallback grouping: split channels wherever consecutive log10 magnitudes
// differ by more than `decadeGap`. Channels with no data are kept together in
// their own trailing group so they don't perturb the scaled groups.
export function groupChannelsByScale(dataNames, valuesByKey, decadeGap = 1.5) {
  const scaled = [];
  const noData = [];
  for (const name of dataNames) {
    const mag = representativeMagnitude(valuesByKey[name]);
    if (mag == null) noData.push(name);
    else scaled.push({ name, log: Math.log10(mag) });
  }
  // Preserve the incoming (priority) order among equal magnitudes by using a
  // stable sort on the log magnitude.
  scaled.sort((a, b) => a.log - b.log);

  const groups = [];
  let current = null;
  let prevLog = null;
  for (const { name, log } of scaled) {
    if (current === null || log - prevLog > decadeGap) {
      current = [];
      groups.push(current);
    }
    current.push(name);
    prevLog = log;
  }
  if (noData.length) groups.push(noData);
  return groups;
}

// Orchestrator: return the channel groups (lists of channel names) to render as
// separate stacked plots. Uses hint-based grouping when the experiment provides
// sharing hints, otherwise falls back to scale-based grouping.
export function groupChannels(channels, valuesByKey) {
  const dataNames = extractScalarChannels(channels);
  if (!dataNames.length) return [];
  if (hasSharingHints(channels)) {
    return groupChannelsIntoAxes(channels, dataNames);
  }
  return groupChannelsByScale(dataNames, valuesByKey);
}

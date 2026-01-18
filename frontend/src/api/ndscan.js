/**
 * NDScan-specific logic and data processing
 */

// Check if experiment has ndscan_params argument
export function hasNdscanParams(arginfo) {
  return arginfo && Object.keys(arginfo).includes("ndscan_params");
}

// Alias for better semantic clarity when checking experiment type
export const isNDScanExperiment = hasNdscanParams;

// Parse ndscan_params from JSON-encoded default value
export function parseNdscanParams(arginfo) {
  if (!hasNdscanParams(arginfo)) return null;

  try {
    const ndscanArg = arginfo["ndscan_params"];
    const [spec] = ndscanArg;
    const defaultValue = spec.default;

    // Parse JSON string
    return JSON.parse(defaultValue);
  } catch (error) {
    console.error("Error parsing ndscan_params:", error);
    return null;
  }
}

// Build FQN to fragment path lookup from instances
export function buildFqnToPathMap(instances) {
  const fqnToPath = {};
  if (!instances) return fqnToPath;

  for (const [fragmentPath, fqns] of Object.entries(instances)) {
    for (const fqn of fqns) {
      // Use first occurrence if FQN appears in multiple fragments
      if (!fqnToPath[fqn]) {
        fqnToPath[fqn] = fragmentPath;
      }
    }
  }
  return fqnToPath;
}

// Get scanned parameter FQNs from scan axes
export function getScannedFqns(scan) {
  if (!scan || !scan.axes) return new Set();
  return new Set(scan.axes.map((axis) => axis.fqn).filter(Boolean));
}

// Get localStorage key for experiment
export function getStorageKey(file, className) {
  return `ndscan_${file}_${className}`;
}

// Load state from localStorage
export function loadNdscanState(file, className) {
  try {
    const key = getStorageKey(file, className);
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading ndscan state from localStorage:", error);
  }
  return null;
}

// Save state to localStorage
export function saveNdscanState(file, className, state) {
  try {
    const key = getStorageKey(file, className);
    localStorage.setItem(key, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving ndscan state to localStorage:", error);
  }
}

export function clearNdscanState(file, className) {
  localStorage.removeItem(getStorageKey(file, className));
}

/**
 * Format NDScan parameters for submission
 */
export function formatNdscanSubmission(
  ndscanParams,
  overrides,
  scan,
  fqnToPath,
  visibleFqns,
) {
  if (!ndscanParams) return null;

  const overridesFormatted = {};
  for (const [fqn, value] of Object.entries(overrides)) {
    // Only submit if it's visible (if visibleFqns is provided)
    if (visibleFqns && !visibleFqns.has(fqn)) continue;

    const path = fqnToPath[fqn] || "";
    overridesFormatted[fqn] = [
      {
        path: path,
        value: value,
      },
    ];
  }

  const ndscanParamsObj = {
    instances: ndscanParams.instances,
    schemata: ndscanParams.schemata,
    always_shown: ndscanParams.always_shown,
    overrides: overridesFormatted,
    scan: scan,
  };

  return {
    ndscan_params: JSON.stringify(ndscanParamsObj),
  };
}

/**
 * Parsing and conversion utilities
 */

export function toDisplayValue(rawValue, scale) {
  if (rawValue === undefined || rawValue === null) return "";
  return scale ? rawValue / scale : rawValue;
}

export function fromDisplayValue(displayValue, scale) {
  if (displayValue === "" || displayValue === "-") return displayValue;
  const num = parseFloat(displayValue);
  if (isNaN(num)) return displayValue;
  return scale ? num * scale : num;
}

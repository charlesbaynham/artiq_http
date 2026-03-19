/**
 * General experiment logic and data processing
 */

// Extract default values from arginfo
export function getDefaultValues(arginfo) {
  const defaults = {};
  if (!arginfo) return defaults;

  for (const [argName, argData] of Object.entries(arginfo)) {
    const [spec] = argData;
    if (spec && spec.default !== undefined) {
      defaults[argName] = spec.default;
    }
  }
  return defaults;
}

// Group arguments by their group property
export function groupArguments(arginfo) {
  const groups = {};
  if (!arginfo) return groups;

  for (const [argName, argData] of Object.entries(arginfo)) {
    const [spec, group] = argData;
    const groupName = group || "General";

    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push({ name: argName, argData });
  }
  return groups;
}

// LocalStorage helpers for experiment state
export function getExperimentStorageKey(file, className) {
  return `artiq_exp_state_${file}_${className}`;
}

export function saveExperimentState(file, className, state) {
  const key = getExperimentStorageKey(file, className);
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch (e) {
    console.error("Error saving experiment state to localStorage:", e);
  }
}

export function loadExperimentState(file, className) {
  const key = getExperimentStorageKey(file, className);
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.error("Error loading experiment state from localStorage:", e);
    return null;
  }
}

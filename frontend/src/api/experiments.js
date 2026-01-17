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
        const groupName = group || 'General';

        if (!groups[groupName]) {
            groups[groupName] = [];
        }
        groups[groupName].push({ name: argName, argData });
    }
    return groups;
}

const isDev = import.meta.env.DEV;
const baseURL = isDev ? "http://localhost:8000" : window.location.origin;

export function make_query_url(endpoint, params = {}) {
  const url = new URL(endpoint, baseURL);
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key]),
  );
  return url;
}

/**
 * Get the SSE streaming URL for a dataset prefix
 * @param {string} prefix - The NDScan prefix to stream
 * @returns {string} - Full SSE endpoint URL
 */
export function get_sse_url(prefix) {
  return `${baseURL}/api/datasets/stream/${encodeURIComponent(prefix)}`;
}

/**
 * Turn FastAPI's error body into a single human-readable string.
 *
 * `detail` is a string for HTTPException, but a list of
 * `{loc, msg, type}` objects for a 422 validation error — so it has to be
 * flattened rather than interpolated.
 */
function formatErrorDetail(detail) {
  if (detail == null) return null;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const parts = detail
      .map((d) => {
        if (typeof d === "string") return d;
        const loc = Array.isArray(d?.loc) ? d.loc.join(".") : null;
        const msg = d?.msg || d?.message;
        if (msg) return loc ? `${loc}: ${msg}` : msg;
        return JSON.stringify(d);
      })
      .filter(Boolean);
    return parts.length ? parts.join("; ") : null;
  }
  if (typeof detail === "object") {
    return detail.msg || detail.message || JSON.stringify(detail);
  }
  return String(detail);
}

export async function api_fetch(endpoint, options = {}) {
  const { params, ...fetchOptions } = options;
  const url = make_query_url(endpoint, params);

  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    // Surface the master's own message: FastAPI puts it in `detail`, and
    // discarding it (as this used to) makes every failure unactionable.
    let body = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }
    const message =
      formatErrorDetail(body?.detail) ||
      (typeof body?.message === "string" ? body.message : null) ||
      `API error: ${response.status} ${response.statusText}`;
    const err = new Error(message);
    err.status = response.status;
    err.body = body;
    throw err;
  }
  // 204 / empty bodies (e.g. DELETE) have nothing to parse.
  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0"
  ) {
    return null;
  }
  return response.json();
}

export function cancel_rid(rid, force = false) {
  return api_fetch("api/cancel", {
    method: "POST",
    params: { rid, force },
  }).catch((err) => {
    console.error("Cancel RID error:", err.message);
    throw err;
  });
}

export function queue_experiment(
  file,
  class_name,
  repo_rev,
  args = {},
  pipeline = "main",
  priority = 0,
) {
  const expid = {
    log_level: 30,
    file: file,
    class_name: class_name,
    arguments: args,
    repo_rev: repo_rev,
  };

  return api_fetch("api/schedule", {
    method: "POST",
    params: { pipeline, priority },
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expid),
  });
}

/**
 * Alias for `queue_experiment` under the name IMPL-SPEC §5 uses. Same
 * signature; both names are exported so legacy pages keep working.
 */
export const submit_experiment = queue_experiment;

/**
 * Submit an ndscan scan via `POST /api/scan`.
 *
 * The server resolves each axis's sub-fragment `path` from the experiment's
 * `instances` map, so sub-fragment scans work without the frontend guessing.
 *
 * @param {object} body - a `ScanSubmitRequest`:
 *   `{file, class_name, axes: [{fqn, type, range, path?}], fixed_params,
 *     num_repeats, repo_rev, pipeline, priority, flush, due_date}`.
 *   Axis order matters: axis 1 (outer) first.
 * @param {{wait_for_completion?: boolean}} [opts] - when true, posts to
 *   `api/scan/submit-and-wait` and resolves once the run has finished.
 */
export function submit_scan(body, { wait_for_completion = false } = {}) {
  const endpoint = wait_for_completion
    ? "api/scan/submit-and-wait"
    : "api/scan";
  return api_fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function get_schedule() {
  return api_fetch("api/schedule");
}

export function get_explist() {
  return api_fetch("api/explist");
}

export function get_explist_arginfo(file, class_name) {
  // file may contain slashes (path), so encode each segment individually
  const encodedFile = file
    .split("/")
    .map((s) => encodeURIComponent(s))
    .join("/");
  return api_fetch(
    `api/explist/${encodedFile}/${encodeURIComponent(class_name)}/arginfo`,
  );
}

export function recompute_arguments(file, class_name, revision) {
  // file may contain slashes (path), so encode each segment individually
  const encodedFile = file
    .split("/")
    .map((s) => encodeURIComponent(s))
    .join("/");
  const params = {};
  if (revision) params.revision = revision;
  return api_fetch(
    `api/explist/${encodedFile}/${encodeURIComponent(class_name)}/recompute`,
    {
      method: "POST",
      params,
    },
  );
}

export function get_dataset_names() {
  return api_fetch("api/datasets/names");
}

export function get_dataset_values(names) {
  const namesParam = Array.isArray(names) ? names.join(",") : names;
  return api_fetch("api/datasets/values", {
    params: { names: namesParam },
  });
}

export function get_health() {
  return api_fetch("api/health");
}

export function get_logs() {
  return api_fetch("api/logs");
}

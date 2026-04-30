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

export async function api_fetch(endpoint, options = {}) {
  const { params, ...fetchOptions } = options;
  const url = make_query_url(endpoint, params);

  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
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
    params: { pipeline },
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expid),
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

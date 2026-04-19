# ARTIQ HTTP MCP Server Bug Report

**Reported:** 2026-04-19
**Reporter:** Integration test suite (`nice-i-want-to-buzzing-firefly`)
**Severity:** High — experiment submission is completely broken

---

## Bug 1: `submit_experiment` and `submit_and_wait` always return HTTP 422

### Summary
Every attempt to submit an experiment via `submit_experiment` or `submit_and_wait` fails with `422 Unprocessable Entity`, regardless of experiment type, pipeline, priority, or argument format.

### Reproduction

```python
# Attempt 1: Simple experiment, default args
submit_experiment(
    file="repository/tests/test_echo.py",
    class_name="TestEcho"
)
# -> 422 Unprocessable Entity

# Attempt 2: With explicit null arguments
submit_experiment(
    file="repository/tests/test_echo.py",
    class_name="TestEcho",
    arguments=None
)
# -> 422 Unprocessable Entity

# Attempt 3: With explicit empty dict
submit_experiment(
    file="repository/tests/test_echo.py",
    class_name="TestEcho",
    arguments={}
)
# -> 422 Unprocessable Entity

# Attempt 4: Different experiment
submit_experiment(
    file="repository/utilities/block_pipeline.py",
    class_name="BlockPipeline",
    pipeline="test",
    priority=0
)
# -> 422 Unprocessable Entity

# Attempt 5: With arguments
submit_experiment(
    file="repository/monitors/display_injection_monitors.py",
    class_name="DisplayInjectionMonitors",
    arguments={"waittime": 0.1}
)
# -> 422 Unprocessable Entity

# Attempt 6: submit_and_wait
submit_and_wait(
    file="repository/tests/test_echo.py",
    class_name="TestEcho",
    timeout_seconds=30
)
# -> 422 Unprocessable Entity
```

### Expected Behavior
Experiments should be accepted into the schedule and an RID returned.

### Actual Behavior
All submissions return HTTP 422. The backend rejects the request before it reaches the ARTIQ master.

### Impact
**Critical.** The primary purpose of the MCP server is to submit experiments. This functionality is completely non-functional.

### Hypothesis
The MCP server is sending a malformed request body or missing a required field when proxying to the `artiq_http` backend at `http://backend:8000/api/schedule`. The backend expects a specific JSON shape that the MCP server is not producing.

---

## Bug 2: `get_experiment_defaults` returns HTTP 500 for ndscan fragment experiments

### Summary
`get_experiment_defaults` works correctly for plain `EnvExperiment` classes but returns `500 Internal Server Error` for experiments that are pure ndscan `ExpFragment` classes.

### Reproduction

```python
# Works fine — plain EnvExperiment with many scalar args
get_experiment_defaults(
    file="repository/clock_spectroscopy/clock_spectroscopy_from_XODT.py",
    class_name="ClockSpecFromXXODT"
)
# -> Returns ~150 scalar arguments

# Works fine — ndscan experiment with simple top-level args
get_experiment_defaults(
    file="repository/monitors/display_injection_monitors.py",
    class_name="DisplayInjectionMonitors"
)
# -> Returns {"waittime": 0.1}

# FAILS — pure ndscan ExpFragment
get_experiment_defaults(
    file="repository/red_mot/measure_red_mot.py",
    class_name="MeasureNarrowbandRedMOT"
)
# -> 500 Internal Server Error

# Also fails
get_experiment_defaults(
    file="repository/red_mot/measure_red_mot.py",
    class_name="MeasureNarrowbandMOTAbs"
)
# -> 500 Internal Server Error
```

### Expected Behavior
`get_experiment_defaults` should either:
- Return the default parameters successfully, OR
- Return a `4xx` status code (e.g., `400 Bad Request` or `422 Unprocessable Entity`) with a descriptive error message

HTTP 500 indicates an unhandled server exception. This is never acceptable.

### Actual Behavior
HTTP 500 with no error detail.

### Root Cause
The backend at `http://backend:8000/api/explist/{file}/{class}/defaults` crashes when trying to instantiate ndscan fragment experiments that cannot be directly constructed as top-level ARTIQ experiments. The error is not caught and mapped to an appropriate HTTP status.

### Impact
Medium. Clients cannot discover default parameters for pure ndscan experiments. However, the full parameter schema is still available via `search_experiments` / `list_experiments` in the `ndscan_params` field.

---

## Bug 3: `get_dataset_values` returns PYON tuples instead of raw values

### Summary
Dataset values are returned as PYON-encoded tuples of the form `[value, metadata, {}]` rather than the raw primitive value. This is unexpected and undocumented.

### Reproduction

```python
get_dataset_values(names=["DISABLE_EM_GAIN"])
# -> {"DISABLE_EM_GAIN": [true, false, {}]}

get_dataset_values(names=["ndscan.rid_70035.completed"])
# -> {"ndscan.rid_70035.completed": [false, false, {}]}

get_dataset_values(names=["ndscan.rid_70035.fragment_fqn"])
# -> {"ndscan.rid_70035.fragment_fqn": [false, "display_injection_monitors.DisplayInjectionMonitors", {}]}
```

### Expected Behavior
One of the following:
- Return raw values: `{"DISABLE_EM_GAIN": true}`
- Return a structured object with clear semantics: `{"DISABLE_EM_GAIN": {"value": true, "timestamp": false, "extra": {}}}`
- Document the tuple format so clients know to extract index 0

### Actual Behavior
Undocumented 3-element arrays where:
- Index 0: the actual value
- Index 1: appears to be a timestamp or boolean flag
- Index 2: always an empty dict `{}`

### Impact
Low-Medium. The data is extractable, but the format is surprising and not documented in the skill reference. Clients must implement special handling to extract the value at index 0.

---

## Additional Observations

### `list_experiments` payload size
`list_experiments()` returns **9.8 MB** of JSON due to embedded `ndscan_params` schemata. This is unwieldy for clients. Consider:
- Adding a lightweight mode that omits `ndscan_params`
- Supporting pagination
- Adding a `fields` parameter to request only specific fields

### `search_experiments` broad query behavior
Searching for experiments like `MeasureNarrowbandRedMOT` or `ClockSpecFromXXODT` returns results so large (>300KB) that they exceed Claude Code's token limits and get saved to disk. This suggests the search is matching the entire `ndscan_params` payload, making `search_experiments` less useful for broad queries.

---

## Environment

- **MCP Server:** `plugin:artiq-http:artiq`
- **ARTIQ Master:** Connected, healthy, 2 experiments running
- **Repository:** 162 experiments, rev `08492cb619506d71d06b6655ec57abd01a0d191e`
- **Backend URL:** `http://backend:8000`

---

## Priority Ranking

| Priority | Bug | Rationale |
|----------|-----|-----------|
| P0 | Bug 1: Submission 422 | Core functionality completely broken |
| P1 | Bug 2: 500 for ndscan defaults | Server errors are never acceptable; should be 4xx |
| P2 | Bug 3: PYON tuple format | Usability issue; requires client-side workaround |
| P3 | Payload size | Performance issue; doesn't block functionality |

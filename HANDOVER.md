# Handover: MCP Scans Implementation

## Status

**Branch:** `mcp-scans-impl` (worktree at `.worktrees/mcp-scans-impl`)
**Commits:** 2 done, 5 tasks remaining
**Tests:** 61 passed, 14 skipped

---

## What's Done

### Commit 1: `9713a18` — Strict HTTP pre-submit validation

- **New file:** `artiq_http/artiq_api/ndscan_validation.py`
  - `validate_ndscan_params(arguments, arginfo)` — validates ndscan_params before RPC
  - Checks: JSON parseability, required keys (`instances`, `schemata`, `scan`), scan type enum (`LinearScan`, `RandomScan`, `ExpScan`, `ListScan`), FQN exists in schemata, no overlap between scanned and fixed params, numeric range sanity (`start < stop`, `num_points > 0`), `num_repeats >= 1`
  - Returns error string or None

- **Modified:** `artiq_http/api.py`
  - Added `_validate_expid_ndscan(expid)` helper (lines 393-409)
  - Wired into both `/api/schedule` and `/api/schedule/submit-and-wait` before RPC call
  - Returns HTTP 422 with clear message on validation failure

- **Tests:** 12 new tests in `tests/test_agent_endpoints.py`
  - Valid/invalid JSON, missing keys, unknown scan type, unknown FQN, overlap, range violations, ListScan edge cases

### Commit 2: `1f852f8` — ndscan_params builder helper

- **New file:** `artiq_http/artiq_api/ndscan_builder.py`
  - `build_ndscan_params(file, class_name, axes, fixed_params, num_repeats)` — async
  - Fetches arginfo from explist, extracts canonical schemata via `_extract_schemata_from_arginfo()`
  - Preserves `instances` and `always_shown` from original
  - Returns ARTIQ list-of-dicts format: `[{"ty": "PYONValue", "default": json_string}, None, None]`
  - Raises `ValueError` if experiment not found or no ndscan schemata

- **Tests:** 5 tests in `tests/test_ndscan_builder.py`
  - Success, defaults, experiment not found, no schemata, always_shown preservation

---

## What's Left (5 Tasks)

### Task 3: Add high-level scan submission HTTP endpoint

**Spec (Plan Step 5):** Add `POST /api/scan` (or similar) dedicated endpoint for high-level scan submissions. Takes:
- `file`, `class_name` (identify experiment)
- `axes` (list of scan axis dicts)
- `fixed_params` (dict of fqn -> value, optional)
- `num_repeats` (int, optional, default 1)
- `pipeline`, `priority`, `flush`, `due_date` (standard scheduling fields)

Endpoint should:
1. Call `build_ndscan_params()` to construct `ndscan_params`
2. Build an `ExpID` with the `ndscan_params` in arguments
3. Call existing `submit_experiment()` or `submit_and_wait()` path
4. Return RID (or SubmitAndWaitResult for a submit-and-wait variant)

Add request/response models in `artiq_http/artiq_api/models.py`. Keep existing `/api/schedule` endpoints backward-compatible.

**Files to touch:**
- `artiq_http/api.py` — add new endpoint(s)
- `artiq_http/artiq_api/models.py` — add `ScanSubmitRequest`, `ScanSubmitResult` models

**Suggested endpoint shapes:**
```python
@router.post("/scan")
async def submit_scan(...) -> int:
    ...

@router.post("/scan/submit-and-wait")
async def submit_scan_and_wait(...) -> SubmitAndWaitResult:
    ...
```

---

### Task 4: Extend MCP with high-level scan tools

**Spec (Plan Step 6):** Add new MCP tools in `mcp_server/server.py`:

1. `submit_1d_scan(file, class_name, axis_fqn, scan_type, range, fixed_params, num_repeats, ...)`
2. `submit_multi_axis_scan(file, class_name, axes, fixed_params, num_repeats, ...)`

Tools should:
- Call the new HTTP endpoint from Task 3
- Provide explicit, strict parameter docs (valid scan types, expected units)
- Keep existing `submit_experiment` / `submit_and_wait` unchanged

**Files to touch:**
- `mcp_server/server.py` — add 2 new `@mcp.tool()` decorators

---

### Task 5: Add/update tests

**Spec (Plan Step 7):** Add tests for:
- New scan submission endpoint (valid 1D, valid multi-axis)
- Endpoint validation failures (unknown experiment, no ndscan schemata)
- MCP tool integration (if feasible in unit tests)

**Files to touch:**
- `tests/test_agent_endpoints.py` — add scan endpoint tests
- `tests/test_dicts.py` — add validation failure path tests for raw `/api/schedule`
- `test_mcp_tools.py` — MCP integration checks (may need realserver)

---

### Task 6: Documentation updates

**Spec (Plan Step 8):** Update:
- `docs/usage.rst` — validation semantics and high-level scan submission workflow
- `README.rst` — concise pointer to ndscan scan submission docs

---

### Task 7: Version bump and final verification

**Spec (Plan Steps 9-10):**
1. Increment version in `artiq_http/__init__.py` and `pyproject.toml`
2. Run full test suite: `uv run pytest`
3. Run realserver tests if possible: `uv run pytest --realserver tests/test_artiq_stack.py`
4. All tests must pass before merge

---

## Key Files (Current State)

| File | Status |
|------|--------|
| `artiq_http/artiq_api/ndscan_validation.py` | **New** — validation logic |
| `artiq_http/artiq_api/ndscan_builder.py` | **New** — builder helper |
| `artiq_http/api.py` | **Modified** — validation wired into existing endpoints |
| `artiq_http/artiq_api/models.py` | Unchanged — needs new scan models (Task 3) |
| `artiq_http/artiq_api/notifiers.py` | Unchanged |
| `artiq_http/artiq_api/control_schedule.py` | Unchanged |
| `mcp_server/server.py` | Unchanged — needs new tools (Task 4) |
| `tests/test_agent_endpoints.py` | **Modified** — 12 new validation tests |
| `tests/test_ndscan_builder.py` | **New** — 5 builder tests |
| `tests/test_dicts.py` | Unchanged — needs validation tests (Task 5) |

---

## Testing

Current command: `uv run pytest`
All tests passing: 61 passed, 14 skipped
Pre-commit hooks: passing (ruff, ruff-format)

---

## Design Decisions Already Made

- **Validation is separate from building** — `ndscan_validation.py` validates, `ndscan_builder.py` builds. They don't call each other.
- **Validation fetches arginfo from explist** for canonical FQN cross-checking.
- **Builder also fetches arginfo** to extract canonical schemata, instances, always_shown.
- **Simple functions, no classes** — following the "grumpy professor" philosophy.
- **Error schema is plain strings** for 422 responses (structured details was considered but kept simple for v1).

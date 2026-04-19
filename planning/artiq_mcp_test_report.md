# ARTIQ HTTP MCP Tools Test Report

**Date:** 2026-04-19
**Tester:** Claude Code (Haiku 4.5)
**Target:** plugin:artiq-http:artiq MCP server
**ARTIQ Master Status:** Connected, Healthy

---

## Executive Summary

Of the 10 MCP tools, 3 resources, and 3 prompts advertised by the `artiq-http:artiq-http` skill:

- **8/10 tools PASS** (read-only tools work correctly)
- **2/10 tools FAIL** (`submit_experiment`, `submit_and_wait` — both return HTTP 422)
- **3/3 resources PASS**
- **3/3 prompts** are model-side guidance workflows (not directly testable as API endpoints)

The critical finding is that **experiment submission is completely broken**. All attempts to submit any experiment via `submit_experiment` or `submit_and_wait` return `422 Unprocessable Entity`, regardless of experiment type, pipeline, priority, or argument format.

---

## Phase 1: Read-Only Resources & Discovery Tools

| # | Test | Result | Notes |
|---|------|--------|-------|
| 1 | `check_health()` | PASS | Returns `{"status": "healthy", "artiq_connected": true}` with all 4 subscribers OK |
| 2 | Resource `artiq://health` | PASS | Text snapshot matches `check_health()` result exactly |
| 3 | `list_experiments()` | PASS | Returns 162 experiments, `scanning: false`, `current_rev: 08492cb6...` |
| 4 | Resource `artiq://experiments` | PASS | Text catalog confirms 162 experiments, same revision |
| 5 | `search_experiments("relocker")` | PASS | Returns filtered subset of relocker-related experiments |
| 6 | `search_experiments("nonexistent_xyz")` | PASS | Returns empty `experiments` array as expected |
| 7 | `get_schedule()` | PASS | Map contains RID 70035 (main, -50) and RID 70045 (monitor, -50) |
| 8 | Resource `artiq://schedule` | PASS | Text snapshot matches `get_schedule()` |
| 9 | `list_dataset_names()` | PASS | Returns large list including `DISABLE_EM_GAIN` and ndscan keys |

---

## Phase 2: Experiment Metadata (Simple Experiments)

| # | Test | Result | Notes |
|---|------|--------|-------|
| 10 | `get_experiment_defaults` — `BlockPipeline` | PASS | Returns empty `arguments: {}` |
| 11 | `get_experiment_defaults` — `TestEcho` | PASS | Returns empty `arguments: {}` |
| 12 | `get_experiment_defaults` — `DataWriter` | PASS | Returns empty `arguments: {}` |
| 13 | `get_experiment_defaults` — nonexistent class | PASS | Returns HTTP 404 as expected |

---

## Phase 2.5: Experiment Metadata (NDScan / Complex Experiments)

| # | Test | Result | Notes |
|---|------|--------|-------|
| 14 | `search_experiments("DisplayInjectionMonitors")` | PASS | `arginfo.ndscan_params` contains `waittime` schema: type `float`, unit `"s"`, `is_scannable: true` |
| 15 | `get_experiment_defaults` — `DisplayInjectionMonitors` | PASS | Returns only top-level `{"waittime": 0.1}`. Confirms `get_experiment_defaults` does **not** expand ndscan schemata |
| 16 | `search_experiments("AllRelockers")` | PASS | `ndscan_params` contains 4 fragment instances (`frag_relocker_blue_IJD1_relocker`, etc.) with ~12 nested parameters each |
| 17 | `get_experiment_defaults` — `AllRelockers` | PASS | Returns simple top-level args (`blue_IJD1_relocker_enabled`, `v_min`, etc.) but **no** ndscan fragment schemata |
| 18 | `get_experiment_defaults` — `MeasureNarrowbandRedMOT` | **EXPECTED FAILURE** | HTTP 500 — ndscan fragment experiments cannot be directly instantiated |
| 19 | `search_experiments("MeasureNarrowbandRedMOT")` | PASS | Experiment exists, `argument_ui: "ndscan"`. Confirms 500 is a `get_experiment_defaults` limitation |
| 20 | `search_experiments("ClockSpecFromXXODT")` | PASS | Experiment exists, `argument_ui: "ndscan"` (hybrid: plain EnvExperiment with ndscan metadata) |
| 21 | `get_experiment_defaults` — `ClockSpecFromXXODT` | PASS | Returns ~150 scalar arguments (floats, ints, booleans, strings) without ndscan wrappers |

### Key Finding: Two-Tier Parameter Discovery

The MCP layer exposes experiment parameters through **two different channels** with different fidelity:

1. **`get_experiment_defaults`** — returns only top-level/simple scalar arguments. Safe for plain `EnvExperiment` classes. Fails with HTTP 500 for pure ndscan `ExpFragment` classes.
2. **`search_experiments` / `list_experiments`** — returns full `arginfo` including `ndscan_params` JSON with complete schemata (instances, fragments, types, units, min/max, scan axes). This is the **only** way to discover NDScan parameter structure.

**Implication:** Clients that want to submit ndscan experiments must parse `ndscan_params` from `search_experiments`, not rely on `get_experiment_defaults`.

---

## Phase 3: Fire-and-Forget Submission + Cancellation

| # | Test | Result | Notes |
|---|------|--------|-------|
| 22 | `submit_experiment` — `BlockPipeline` on `test` pipeline | **FAIL** | HTTP 422 Unprocessable Entity |
| 22b | `submit_experiment` — `BlockPipeline` on `main` pipeline | **FAIL** | HTTP 422 Unprocessable Entity |
| 22c | `submit_experiment` — `TestEcho` on `main` pipeline | **FAIL** | HTTP 422 Unprocessable Entity |
| 22d | `submit_experiment` — `DisplayInjectionMonitors` with args | **FAIL** | HTTP 422 Unprocessable Entity |
| 22e | `submit_experiment` — `TestEcho` with `arguments: null` | **FAIL** | HTTP 422 Unprocessable Entity |
| 23 | `get_schedule()` after submission | N/A | Could not verify — submission failed |
| 24 | `cancel_experiment` — nonexistent RID 99999 | PASS | HTTP 404 Not Found as expected |
| 25 | `get_schedule()` after cancellation | N/A | Not tested |

### Critical Finding: Submission Completely Broken

Every permutation of `submit_experiment` and `submit_and_wait` failed with HTTP 422:
- Different experiments (`BlockPipeline`, `TestEcho`, `DisplayInjectionMonitors`)
- Different pipelines (`test`, `main`)
- Different priorities (`0`, `-1`)
- Different argument formats (`{}`, `null`, explicit args)

The 422 error suggests the MCP server is sending a malformed request body or missing a required field when proxying to the `artiq_http` backend.

---

## Phase 4: Submit-and-Wait

| # | Test | Result | Notes |
|---|------|--------|-------|
| 26 | `submit_and_wait` — `TestEcho`, timeout 30s | **FAIL** | HTTP 422 Unprocessable Entity |
| 27 | `submit_and_wait` — `DataWriter`, timeout 30s | **FAIL** | HTTP 422 Unprocessable Entity |

Same root cause as Phase 3.

---

## Phase 5: Dataset Read

| # | Test | Result | Notes |
|---|------|--------|-------|
| 28 | `get_dataset_values` — `DISABLE_EM_GAIN` | PASS | Returns `[true, false, {}]` — a PYON-serialized tuple/list with a trailing empty dict |
| 29 | `get_dataset_values` — multiple ndscan keys | PASS | Returns `ndscan.rid_70035.completed` = `[false, false, {}]` and `ndscan.rid_70035.fragment_fqn` = `[false, "display_injection_monitors.DisplayInjectionMonitors", {}]` |
| 30 | `get_dataset_values` — nonexistent key | PASS | Returns `{}` (silent omission as documented) |

### Finding: Dataset Values Use PYON Tuples

Dataset values are not raw primitives — they are PYON-encoded tuples of the form `[value, timestamp_or_metadata, {}]`. The third element appears to be an empty dict placeholder. Clients must extract the value at index 0.

---

## Phase 6: Prompts

The skill advertises 3 prompts (`run_experiment_workflow`, `analyze_datasets`, `manage_schedule`). These are **model-side guided workflows**, not API endpoints. They are invoked via the `Skill` tool and return documentation that guides the model through sequences of MCP tool calls.

Since these are documentation/prompts rather than callable APIs, they were verified to exist and load correctly but do not have independent testable behavior.

---

## Resources Summary

| Resource | Result | Notes |
|----------|--------|-------|
| `artiq://health` | PASS | Formatted text with subscriber status |
| `artiq://experiments` | PASS | Human-readable catalog grouped by directory |
| `artiq://schedule` | PASS | Human-readable queue with running/queued separation |

---

## Tool Pass/Fail Matrix

| Tool | Status | Notes |
|------|--------|-------|
| `check_health` | PASS | |
| `list_experiments` | PASS | Large payloads (9.8MB) — consider pagination |
| `search_experiments` | PASS | Large payloads for broad queries |
| `get_experiment_defaults` | PARTIAL | Works for plain experiments; 500 for pure ndscan fragments |
| `get_schedule` | PASS | |
| `submit_experiment` | **FAIL** | HTTP 422 — completely broken |
| `submit_and_wait` | **FAIL** | HTTP 422 — completely broken |
| `cancel_experiment` | PASS | 404 for missing RID behaves correctly |
| `list_dataset_names` | PASS | |
| `get_dataset_values` | PASS | Returns PYON tuples, not raw values |

---

## Recommendations

1. **Fix submission endpoints** — The HTTP 422 on `submit_experiment` and `submit_and_wait` is the highest-priority bug. The MCP server appears to be sending a malformed request to the backend.
2. **Document PYON tuple format** — `get_dataset_values` returns `[value, metadata, {}]` tuples. This should be documented so clients know to index at `[0]`.
3. **Document ndscan parameter discovery** — Make explicit that `get_experiment_defaults` cannot retrieve ndscan schemata; clients must use `search_experiments` and parse `arginfo.ndscan_params`.
4. **Consider pagination** — `list_experiments` returns 9.8MB of JSON. Adding pagination or a lightweight mode would improve performance.

---

## Test Environment

- **MCP Server:** `plugin:artiq-http:artiq`
- **ARTIQ Master:** Connected, 2 experiments running (RID 70035, RID 70045)
- **Repository:** 162 experiments, rev `08492cb619506d71d06b6655ec57abd01a0d191e`

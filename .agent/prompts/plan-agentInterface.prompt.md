# Plan: Agent Interface for ARTIQ HTTP

Add REST API endpoints, a Fern-generated Python SDK, and a Copilot skill to enable LLM agents to reliably interact with ARTIQ (discover experiments, submit, wait for completion, read results). All additions are backward-compatible.

---

## Phase 1: REST API Additions

**Step 1 — Per-RID status endpoint**
- Add `GET /api/schedule/{rid}` to `artiq_http/api.py`
- Handler fetches full schedule via `notifiers.get_schedule()`, returns the single entry or 404
- Response model: reuse existing `ScheduleItem` (add RID field or return inline)

**Step 2 — Experiment argument defaults endpoint**
- Add `GET /api/explist/{file:path}/{class_name}/defaults` to `artiq_http/api.py`
- Handler calls `notifiers.get_explist()`, finds matching experiment by file+class_name
- Parses `arginfo` to extract default values for each argument (arginfo entries contain `"default"` keys)
- Returns `{"file": ..., "class_name": ..., "arguments": {...}}`
- 404 if experiment not found
- New response model in `models.py`: `ExperimentDefaults`
- May need a helper in `notifiers.py` for arginfo default extraction (type-specific: `NumberValue`, `StringValue`, `BooleanValue`, `EnumerationValue`, etc.)

**Step 3 — Experiment search endpoint**
- Add `GET /api/explist/search?q=...` to `artiq_http/api.py`
- Handler calls `notifiers.get_explist()`, filters experiments where query is a case-insensitive substring of name, file, or class_name
- Returns reused `ExperimentList` model

**Step 4 — Submit-and-wait endpoint** *(parallel with step 5)*
- Add `POST /api/schedule/submit-and-wait?timeout=60` to `artiq_http/api.py`
- Body: same as `POST /api/schedule` (`ExpID` + pipeline/priority/flush/due_date)
- Submit via `control_schedule.submit_experiment()`, then poll `notifiers.get_schedule()` in a loop (1–2s interval, `asyncio.sleep`) until the RID disappears or timeout elapses
- Clamp timeout to max 300 seconds
- New response model in `models.py`: `SubmitAndWaitResult` with fields `rid`, `status`, `timed_out`

**Step 5 — Tests** *(parallel with step 4)*
- New `tests/test_agent_endpoints.py` with mock-based unit tests for all 4 new endpoints (happy paths + error paths: 404s, timeouts, missing params)
- Add `@realserver` integration tests in `tests/test_artiq_stack.py` for the new endpoints

**Step 6 — Version bump**
- `0.2.0` → `0.3.0` (MINOR: new features, backward-compatible) in both `artiq_http/__init__.py` and `pyproject.toml`

---

## Phase 2: Fern SDK Generation *(depends on Phase 1)*

**Step 7 — Fern configuration**
- Create `fern/fern.config.json` (org name, Fern version)
- Create `fern/generators.yml` (python-sdk group, package name `artiq_http_client`, class `ArtiqClient`)
- Export OpenAPI spec: `uv run python -c "import json; from artiq_http.api import app; print(json.dumps(app.openapi()))" > fern/openapi/openapi.json`
- Document re-generation workflow in `fern/README.md`

**Step 8 — Generate and verify SDK**
- Run `fern generate --group python-sdk` → produces `sdk/` directory
- Verify typed methods for all endpoints (including the 4 new ones)
- Add `artiq-http-client = {path = "sdk", develop = true}` to `pyproject.toml`

**Step 9 — SDK smoke test**
- `@realserver` test in `tests/test_sdk_client.py` that instantiates `ArtiqClient` and calls at least one method against the test server

---

## Phase 3: Copilot Skill *(parallel with Phase 2)*

**Step 10 — Create agent skill**
- Create `.agent/skills/artiq-sdk/SKILL.md`
- Cover: when to use the SDK, import pattern, worked end-to-end example (search → defaults → submit_and_wait → get datasets), client resource layout (`client.explist`, `client.schedule`, `client.datasets`, `client.health`), `ApiError` handling

---

## Relevant Files

| File | Change |
|------|--------|
| `artiq_http/api.py` | Add 4 new route handlers |
| `artiq_http/artiq_api/models.py` | Add `ExperimentDefaults`, `SubmitAndWaitResult` |
| `artiq_http/artiq_api/notifiers.py` | Possible arginfo default-extraction helper |
| `tests/test_agent_endpoints.py` | New mock-based tests (new file) |
| `tests/test_artiq_stack.py` | Add `@realserver` integration tests |
| `artiq_http/__init__.py` | Bump to 0.3.0 |
| `pyproject.toml` | Bump to 0.3.0; later add SDK dependency |
| `fern/fern.config.json` | Fern org config (new) |
| `fern/generators.yml` | SDK generator config (new) |
| `fern/openapi/openapi.json` | Exported OpenAPI spec (new, generated) |
| `.agent/skills/artiq-sdk/SKILL.md` | Copilot skill for agents (new) |

---

## Verification Checklist

1. `uv run pytest` — existing tests pass (no regressions)
2. `uv run pytest tests/test_agent_endpoints.py` — new mock tests pass
3. `uv run ruff check` — no lint errors
4. Manual: `curl localhost:8000/api/schedule/1` → 404 JSON
5. Manual: `curl localhost:8000/api/explist/search?q=idle` → filtered list
6. `uv run pytest --realserver` — integration tests pass against Docker ARTIQ
7. `fern check` — validates OpenAPI spec
8. `fern generate --group python-sdk` — SDK generates without errors
9. SDK smoke test passes against test server

---

## Decisions & Notes

- **SSE excluded** — the dataset stream (item 5 in `planning/agent-interface.md`) is already tracked in `planning/sse-updates.md` and is out of scope here
- **Polling strategy** — `submit-and-wait` uses `asyncio.sleep` loop (1–2s) against the already-cached in-memory schedule data; no lock held during sleep
- **`{file:path}` path converter** — avoids URL-encoding issues for nested paths like `repo/sub/exp.py`
- **Generated SDK committed to repo** — both spec and `sdk/` directory committed for reproducibility
- **Arginfo parsing** — ARTIQ arginfo is type-specific; implement a focused helper for common types (`NumberValue`, `StringValue`, `BooleanValue`, `EnumerationValue`, `Scannable`) and silently omit unrecognized types; verify against `test-artiq/repository/` experiments
- **Submit-and-wait client disconnect** — experiment continues running if HTTP client drops; document this; `cancel_on_disconnect` is a future option
- **Fern version pinning** — pin CLI and generator versions in config for reproducible builds

# artiq_http

A controller for ARTIQ which exposes ARTIQ's functionality as a RESTful API

## Project Overview

- **Tech Stack:** Python/FastAPI
- **Database:** None
- **Dev Environment:** Local (uv)

## Note

**CLAUDE.md is a symlink to this file.** When making changes, edit AGENTS.md directly.

## Quick Start

See README.rst for instructions

## Project Structure

- `artiq_http/` - Main Python package
  - `api.py` - FastAPI application
  - `main.py` - Entry point
  - `config.py` - Configuration
  - `artiq_api/` - ARTIQ API wrapper modules
- `mcp_server/` - MCP (Model Context Protocol) server (`server.py`) that bridges to the HTTP API
- `frontend/` - React frontend (see "Frontend architecture" below)
- `docker/` - Container and compose configuration for backend/frontend deployment
  - `compose.yml` - Main backend/frontend compose stack
  - `compose.localtesting.yml` - Local ARTIQ test stack override
  - `compose.watchtower.yml` - Watchtower auto-update override
  - `Dockerfile.backend` - Backend image definition
  - `Dockerfile.frontend` - Frontend image definition
  - `Caddyfile` - Frontend reverse-proxy/static serving config
- `test-artiq/` - Local ARTIQ test environment (Docker). This directory mimics the structure of an external ARTIQ experiment repository for testing purposes, but is a subdirectory of this project.
  - `repository/` - Minimal experiments for testing. This folder represents the root of the "mock" ARTIQ repository. Note that it is not a git repository, despite the name.
  - `flake.nix` - Nix flake that builds the ARTIQ + ndscan Docker image
  - `docker-compose.yml` - Test stack orchestration
- `tests/` - Test suite
- `docs/` - Sphinx documentation

## Frontend architecture

The frontend is React 18 + react-router-dom + Vite, with **no UI framework in new
code**. `react-bootstrap` is still a dependency because the legacy pages import it,
but nothing under `frontend/src/bench/` may use it — the bench UI is plain elements
styled by `bench/bench.css`.

There are three visual layers, and they share one palette:

- `frontend/src/plots/tokens.css` — the `--p-*` tokens for the `/plots` app.
- `frontend/src/bench/bench.css` — the `--b-*` tokens for the bench UI, using the
  *same* hex values so `/` and `/plots` read as one product. If you change a colour,
  change it in both or the seam becomes visible. Both mirror a light-mode block.
- `frontend/src/index.css` — the legacy Bootstrap-themed pages.

Routes (`frontend/src/App.jsx` is a thin router):

| Route | Renders |
| --- | --- |
| `/` | the bench workspace (`bench/BenchApp.jsx`); mobile layout below 700px |
| `/runs`, `/datasets`, `/logs` | the existing Schedule / DatasetExplorer / Logs components in bench chrome |
| `/plots`, `/plots/fullscreen` | the plots app, unchanged |
| `/legacy` | `LegacyApp.jsx` — the previous collapsible-section UI, kept so no capability is lost |

`frontend/src/bench/` layout:

- `state/SessionContext.jsx` + `sessionReducer.js` — the per-session working state
  (selected experiment, working set, filters, pinned/ghost RIDs, pipeline, priority,
  repeats). Persisted to `localStorage` per session name. The reducer is a separate
  `.js` file so it can be exercised by `frontend/scripts/check-params.mjs`, which runs
  under plain Node with no test runner or dependencies (`node scripts/check-params.mjs`).
- `state/useSchedule.js`, `state/useLiveRun.js` — schedule polling and live-run
  resolution. `runProgress()` derives the `41/101` readout; see "Progress" below.
- `submit/params.js` — normalises **both** ndscan `schemata` and plain ARTIQ arginfo
  into one `Param` model, and owns tree building, fuzzy matching, scan-point maths and
  the `/api/scan` wire encoders. Start here for anything about parameters.
- `submit/`, `live/`, `mobile/` — the three surfaces, each with its own stylesheet
  (`submit.css`, `live.css`, `mobile.css`) imported by its own root component.

Points to preserve when changing this code:

- **Mobile has no separate submission path.** The mobile shell's "New run" screen
  renders the desktop `submit/SubmitPane.jsx` full-screen (fragment tree as the same
  slide-over the 900–1200px band uses), so a phone can submit any experiment with
  arbitrary parameters through exactly the same param model, validation and wire
  encoders as the desktop. Do not reintroduce a mobile-only submit flow that can
  drift out of sync — phone-width layout fixes belong in `mobile/mobile.css` under
  `.bm-app`, not in a fork of the pane.

- **ndscan scans submit via `POST /api/scan`**, not by assembling an `ndscan_params`
  string in JS. The server resolves each axis's sub-fragment `path` from `instances`;
  the old frontend hardcoded `path: ""` and silently mis-scanned sub-fragment
  parameters. The wire encoders omit an empty path deliberately — do not "helpfully"
  add it back.
- **ndscan has no `log` scan generator** (`linear`, `centre_span`, `list`, plus
  refining/expanding). The UI's `log` kind compiles to a `list` axis of log-spaced
  values.
- **Progress has no server-side denominator.** `runProgress` takes the total from the
  running job's own `ndscan_params` (axis points × repeats), falls back to the
  `<prefix>.axes` descriptors, and otherwise reports a bare point count. Never render
  `41/?` or a guessed total.
- **`string` and `enum` ndscan parameters must render.** The previous UI returned
  `null` for any type outside float/int/bool and silently dropped them.
- **The live pane embeds the real `/plots` view** rather than a second charting
  implementation. `PlotsApp` takes optional `forcedPrefix` / `showTopBar` /
  `showRails` / `showImages` / `compact` / `onData` / `onStatus` /
  `onChannelsSummary` / `ghostPrefixes` props, each defaulting to standalone
  behaviour. Adding props is fine; changing a default silently changes `/plots`.
- **One SSE connection per run.** `PlotsApp`'s `onData` feeds `useLiveRun`'s `feed`
  option so the workspace does not open the same stream several times.

## Configuration

`artiq_http/config.py` reads settings from environment variables (e.g. via a `.env`
file loaded by the process manager, or `docker/compose.yml`):

- `ARTIQ_HTTP_HOST`, `ARTIQ_HTTP_PORT_NOTIFIERS`, `ARTIQ_HTTP_PORT_CLIENTS`,
  `ARTIQ_HTTP_PORT_BROADCAST` - ARTIQ master connection details
- `ARTIQ_HTTP_OLD_ARTIQ_SUPPORT` - compatibility toggle for older ARTIQ versions
- `ARTIQ_HTTP_MOCK` - run against the mock backend instead of a real ARTIQ master
- `ARTIQ_HTTP_DEFAULT_REVISION` - git revision/branch the GUI's "Rev / ref" field
  falls back to when left blank and no lab-wide default revision is set (see
  `DefaultRevision.jsx`). Empty (default) preserves the historic behaviour of
  falling back to the master's current revision (`current_rev`); set it to e.g.
  `master` to instead always target that ref regardless of whichever revision the
  ARTIQ master currently has checked out. Exposed to the frontend as
  `default_revision_fallback` on `GET /api/explist`.

## MCP Server

`mcp_server/server.py` is a hand-written [FastMCP](https://github.com/modelcontextprotocol/python-sdk)
server that exposes ARTIQ functionality to MCP clients (e.g. Claude). It is a
thin, curated bridge: every tool simply calls the FastAPI HTTP backend
(`artiq_http/api.py`) over HTTP via `httpx`. It is deliberately *not*
auto-generated from the OpenAPI schema — the hand-written layer adds
LLM-friendly docstrings, flattened parameters, response unwrapping (e.g.
datasets), convenience scan tools, and prompts/resources that have no HTTP
equivalent.

**Feature-parity rule:** because the two interfaces are maintained separately,
any change to the HTTP API surface MUST be mirrored in the MCP server. In
particular:

- A new request parameter on `POST /api/schedule` (the `ExpID` body or its query
  params) must be added to the `submit_experiment` tool.
- A new request parameter on `POST /api/scan` (`ScanSubmitRequest`) must be added
  to the `submit_1d_scan` and `submit_multi_axis_scan` tools.
- A new HTTP endpoint that an MCP client could reasonably use should get a
  corresponding tool.

`submit_batch` is an MCP-only convenience: it fans out over a list of
`variants` (each with its own `fixed_params`) and submits one scan per variant
by reusing the existing `POST /api/scan` path — there is no dedicated batch HTTP
endpoint, so this is not a parity gap. Priority is deliberately batch-wide (a
single value for the whole call, never per-variant) so a negative-priority queue
floor stays satisfied in one place; keep it that way. It exists so agents submit
many near-identical runs in one gated MCP call rather than bypassing the safety
gate with a hand-rolled REST loop.

The following HTTP features are intentionally **not** exposed via MCP (do not
treat these as parity gaps): `GET /api/datasets` full dump (too large — use the
`list_dataset_names` / `get_dataset_values` tools instead), `GET /api/datasets/stream/...`
(SSE streaming, not MCP-shaped), the `fields`/`full` query filters on the
`explist` endpoints (MCP returns the curated form), and `GET /api/` (hello-world).

**Compact-by-default rule:** the listing tools return trimmed payloads so an
agent is not flooded by bulk it rarely needs (chiefly a running ndscan scan's
full `ndscan_params` schemata, which ride along in the schedule item's expid).
`get_schedule` / `get_schedule_item` drop the bulky expid arguments (keeping
`file`, `class_name`, `repo_rev`, an `is_scan` flag and any non-ndscan
`argument_keys`); `list_experiments` / `search_experiments` trim each entry to
identity plus a one-line docstring `summary`. Each tool takes `verbose=True` to
restore the full payload, and the per-experiment tools
(`get_experiment_defaults`, `get_experiment_arginfo`,
`recompute_experiment_arguments`) remain the way to pull full detail for a
single experiment. Preserve this default when adding or changing listing tools:
new bulky fields belong behind `verbose`, not in the default response.

## Development Guidelines

- Follow PEP 8 style guidelines
- Use type hints for all functions
- Write tests for new functionality
- Use uv for dependency management
- Run `ruff check` before committing
- Always run unit tests after making changes and fix issues before finishing
- If on the master branch, be sparing with commits - one per feature
- If on any other branch, use commits liberally. They will be squashed before merging
- When making multi-step changes on development branches, you should automatically make a commit after each step without prompting the user

## Mock Backend (Frontend Development)

For frontend work that doesn't need a real ARTIQ master, prefer the Makefile entry point:

```bash
make mock
```

This runs `./dev.sh --mock`, which skips the local ARTIQ Docker stack and starts the backend with `--mock`.

If you only need the backend process without the tmux dev environment, you can still run:

```bash
uv run python -m artiq_http.main --mock
# or: ARTIQ_HTTP_MOCK=1 uv run python -m artiq_http.main
```

The mock serves a live 0D repeat single-point NDScan (`ndscan.rid_1`) with four channels (Signal A–D) updating every 0.5 s, so the Plots view has data to render immediately. It also serves two 1D RabiFlop scans (`rabi.pulse_duration`, 101 points) that agree with the running schedule item below: a completed run (`ndscan.rid_4821`, phase-shifted) that can be toggled on as a ghost overlay, and a live run (`ndscan.rid_4823`) whose points stream in a randomized order with repeats at each x — renumbered to `4821`/`4823` so the live run's RID, fragment FQN, scanned axis and channel names all match the running `RabiFlop` schedule item (the queue and the live pane can never disagree about what's running). The live run exercises the Plot1D line rendering, which sorts points by their scanned-axis value and draws the connecting line through the per-x mean with standard-error-of-the-mean error bars. The scan has three channels — two small-scale 0–1 channels (`excitation`, `dark_counts`) and one large-scale (`atom_number`, ~10⁴–10⁵) — with no display hints, so it also exercises the Plots view's channel grouping: channels are split into separate stacked plots (each with its own y-scale) by order-of-magnitude of their values (similar scales share a plot; only very different scales split), so `atom_number` renders on its own plot rather than crushing the 0–1 channels flat. Explicit ndscan `share_axis_with` hints are still honoured, but only to *force* channels onto a shared axis — they never split otherwise-similar channels apart. It also serves five animated camera images of differing sizes and patterns (`camera_image`, `mot_fluorescence_image`, `ion_chain_image`, `background_image`, `absorption_image`), so the Plots image view can be exercised with multiple images at once.

The explist also includes `RabiFlop` (`Spectroscopy/rabi_flop.py`), a synthetic ndscan experiment with a large, realistically nested 214-parameter fragment tree (`cooling.*`, `eit.*`, `rabi.*`, `readout.*`, `trap.*`, `laser.*`, `magnet.*`, `dds.*`, `ion.*`, `sequence.*`, `calibration.*`), generated in ndscan's real wire format (see `_build_rabi_flop_schemata` in `mock_backend.py`). A handful of parameters are hand-written to match the design exactly (`cooling.doppler.freq`, `cooling.doppler.blue_beam_power`, `rabi.pulse_duration`, `rabi.detuning`, `rabi.n_repeats`, `readout.threshold`); the rest are generated with plausible one-sentence physics descriptions, spanning float/int/bool/string/enum types and both depth-2 (`group.leaf`) and depth-3 (`group.subgroup.leaf`) FQNs. `MockRepeatExperiment` and `MockFreqScan` also now carry small non-empty *plain* (non-ndscan) arginfo, so the plain-argument submit path is exercisable too.

The mock **schedule starts pre-populated**: RID `4823` is a *running* `RabiFlop` scan whose `expid.arguments.ndscan_params` declares a genuine 101-point linear scan on `rabi.pulse_duration` (2 repeats), and RID `4824` is a *pending* `CalibrateTrapFreq` placeholder. **Submission goes through a realistic lifecycle in mock mode**: `POST /api/schedule` and `POST /api/scan` allocate a RID from a counter starting at `4825` and insert a `pending` schedule item; after ~2 s it flips to `running` and, for ndscan submissions, starts streaming `ndscan.rid_<rid>` points derived from the axes actually submitted (so the point count and x range match what was asked for) in randomized order with occasional repeats, the same way the seeded live run does. Once every point is in, `.completed` becomes `true` and the item leaves the schedule — mirroring how a real ARTIQ master drops a finished run off the queue. A submission with no scan axes completes immediately as a single-point run (real ndscan 0D runs measure once and complete); a plain (non-ndscan) submission has no live dataset to stream, so it's just removed from the schedule after a few seconds. `POST /api/cancel` removes a RID immediately, cancelling any pending activation/streaming/cleanup timers for it (404 if the RID is absent). This is a deliberate behaviour change from the old always-503, always-pending mock — it's what makes the submit → queue → live → completion flow developable and screenshot-testable offline. No ARTIQ stack or Docker is required.

The mock backend lives in `artiq_http/mock_backend.py`. It replaces the global `subscriber_manager` singleton at startup, so all API paths behave normally.

## Static Mock / GitHub Pages Demo

The redesigned bench also runs as a **fully static site with no Python backend at all** —
this is what's deployed to GitHub Pages. It is a from-scratch reimplementation of the mock
backend contract in the browser, not a build of `artiq_http.mock_backend` itself (there is
no server process on Pages).

- `scripts/generate_mock_fixtures.py` imports `artiq_http.mock_backend` directly (no running
  server) and writes JSON fixtures to `frontend/public/mock/` — `explist.json`,
  `arginfo/<slug>.json` per experiment, `schedule.json`, `dataset_names.json`,
  `datasets.json` (initial dataset snapshot, incl. camera images), `logs.json`,
  `health.json`. `<slug>` is a filesystem-safe encoding of `<file>:<class_name>`
  (`file.replace("/", "_") + "__" + class_name`); the exact same algorithm is reimplemented
  in `frontend/src/api/mockAdapter.js`'s `slugify()` — keep both in sync if you change it.
  Regenerate after any `mock_backend.py` change:

  ```bash
  uv run python scripts/generate_mock_fixtures.py
  ```

  `tests/test_mock_fixtures.py` regenerates into a tmp dir and fails the build if that
  produces a diff against the committed fixtures, so the Python and JS mocks cannot
  silently drift apart. The fixtures are deterministic (seeded RNG, frozen clock) so
  regenerating with no source changes reproduces byte-identical output.
- `frontend/src/api/mockAdapter.js` is the browser-side adapter: when
  `import.meta.env.VITE_MOCK === "1"` it patches `window.fetch` (intercepting same-origin
  `/api/*` requests only — everything else, including the fixture JSON itself, passes
  through to the real `fetch`) and replaces `window.EventSource` with a shim that replays
  and then animates the fixture data for `/api/datasets/stream/<prefix>`, reproducing
  `sse.py`'s `init`/`update`/`delete`/`heartbeat`/`error` protocol exactly. It implements
  the full explist/arginfo/defaults/recompute/schedule/scan/cancel/datasets/logs/health
  surface, hand-rolled against the same Python modules it mirrors
  (`ndscan_builder.py`, `ndscan_validation.py`, `notifiers.py`) — no MSW, no new
  dependencies. Submitting a scan or experiment allocates a RID
  from `4825`, matching `mock_backend.py`'s lifecycle exactly: inserted `pending`, flips to
  `running` after ~2 s, streams points derived from the submitted axes (or completes
  immediately for a no-axis/plain submission), then completes and leaves the schedule once
  every point is in — so the queue → live-plot → completion flow is exercisable with
  nothing running, on the same timings as the Python mock.
- `npm run build:mock` (`VITE_MOCK=1 vite build`, then copies `dist/index.html` to
  `dist/404.html` since GitHub Pages has no SPA rewrite rules and the app uses
  `BrowserRouter`) builds the demo. `VITE_BASE` sets the deployed subpath (default `/`);
  `vite.config.js` also excludes the adapter entirely from a plain `npm run build` via a
  small resolver plugin, so the production bundle never ships the mock code or the demo
  banner even as an unused chunk.
- The demo banner (`● demo — mock data, no ARTIQ master`, dismissible) is mounted by the
  adapter itself as a plain DOM node, not a React component, so it works regardless of
  which part of the bench UI is rendered underneath.

### Deployment

`.github/workflows/pages.yml` deploys via the modern **artifact-based** GitHub Pages
mechanism (`actions/upload-pages-artifact` + `actions/deploy-pages`, both first-party
`actions/`-org actions), not a `gh-pages` branch. Because a repo has exactly one Pages
site, only one deployment can be live at a time — there are no per-PR preview
subdirectories. **Repo settings required:** Settings → Pages → Source must be set to
**"GitHub Actions"** (not "Deploy from a branch"); and to deploy any ref other than the
default branch, Settings → Environments → `github-pages` → "Deployment branches and
tags" must permit it. Enabling Pages creates that environment locked to the default
branch, so a PR-label or `workflow_dispatch` deploy of a feature branch is rejected
*before the job starts* — it fails in seconds with no runner, no logs and no annotation.
That is the branch policy, not a broken workflow. The workflow is split into `build` and
`deploy` jobs so the build still gives a real pass/fail on a PR when the deploy is gated.

Deployment is manually fired:

1. Push to `master` → builds and deploys. This is the resting state — master is live
   unless someone deliberately replaces it.
2. `workflow_dispatch` (the Actions "Run workflow" button) → deploys whichever branch is
   selected in the dropdown (defaults to `master`).
3. Adding the `deploy-pages` label to a PR → deploys that PR's head and posts/updates a
   single sticky comment on the PR linking the live demo. Fork PRs are refused (no write
   token for untrusted code) and the refusal is logged in the job summary, not silent.

**`pages.yml` is the only workflow that deploys to Pages.** A repo has exactly one Pages
site, and `ci.yml` used to publish the Sphinx docs to it on every push to `master`; the
two workflows raced for that single slot, so whichever finished last won and the live
site flipped unpredictably. `pages.yml` now builds and publishes both in one artifact:

- `/` — the Sphinx docs (unchanged URLs)
- `/demo/` — the static mock demo (`VITE_BASE=/<repo>/demo/`)

`ci.yml`'s `make-docs` still builds and uploads the docs as a normal workflow artifact on
every push; only its `deploy-docs` job was removed. If you add another Pages payload, add
it to `pages.yml`'s "Assemble the site" step rather than introducing a second deploying
workflow.

## Reference repos

This projects relies on interfacing with the ARTIQ and ndscan packages, even though they are not direct dependencies. To facilitate development, this project includes reference clones of both packages in `.claude/deps/` (updated by a Claude Code hook on startup). These are read-only and should be consulted for reference only.

## Local ARTIQ Testing

After any major change to the backend or experiment discovery logic, you **must** verify the changes against the local ARTIQ test environment:

1. Build and load the local test image: `cd test-artiq && nix build .#docker --accept-flake-config && docker load < result`
2. Start the local master: `cd test-artiq && docker compose up -d`
3. Verify connectivity: `uv run sipyco_rpctool 127.0.0.1 3251 list-targets`
4. Check logs for experiment discovery errors: `docker compose logs artiq-master`

To run the local real-server test suite end to end:

```bash
cd test-artiq
nix build .#docker --accept-flake-config
docker load < result
docker compose up -d
cd ..
uv run pytest --realserver
```

See `test-artiq/README.md` (or the walkthrough) for more details.

## Testing

To run the unit tests, use the following commands:

```bash
# Run basic tests
uv run pytest

# Run all tests, including those requiring a real ARTIQ stack (Docker)
uv run pytest --realserver

# Run with coverage
uv run coverage run -m pytest --realserver
uv run coverage report
```

## Agent Configuration

> **TODO:** `userConfig` in the `.claude-plugin/plugin.json` is temporarily hard-coded to `https://artiq.stronlab.net/mcp` because `userConfig` support is broken pending https://github.com/anthropics/claude-code/issues/39827. Future agent runs should check whether that issue is resolved before reintroducing `userConfig`.

This project includes agent configuration in the `.agent/` directory:
- `.agent/settings.local.json` - Permissions and auto-approval settings
- `.agent/workflows/` - Reusable workflow definitions
- `.agent/skills/` - Custom agent skills
- `.agent/agents/` - Agent-specific configurations

## Versioning

This project uses manual semantic versioning with hard-coded version strings. The version is stored in four places, which must stay in sync (enforced by `tests/test_version_consistency.py`):
- `artiq_http/__init__.py` - Runtime package version (`__version__`)
- `pyproject.toml` - Packaging metadata version
- `package.json` - Node/JS package version
- `.claude-plugin/plugin.json` - Claude plugin version

**When making changes, update the version according to Semantic Versioning (semver) principles:**
- **MAJOR** (X.0.0): Breaking changes to the API
- **MINOR** (0.X.0): New features, backward-compatible
- **PATCH** (0.0.X): Bug fixes, backward-compatible

**Update all four files whenever you make changes:**
1. Determine the appropriate version increment based on the changes
2. Update the `version` in `artiq_http/__init__.py`, `pyproject.toml`,
   `package.json`, and `.claude-plugin/plugin.json` so they all match

## Agent documentation

- Whenever changes are made, review the agent guidance and update it if required
- Whenever you make frontend changes, show screenshots of the result directly in the chat

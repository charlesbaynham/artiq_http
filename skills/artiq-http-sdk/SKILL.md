---
name: artiq-sdk
description: Use the bundled artiq_http_client SDK and bundled markdown docs for ARTIQ HTTP experiment discovery, submission, scheduling, and dataset access.
---

# ARTIQ SDK Skill

Use the Python `artiq_http_client` SDK for ARTIQ HTTP interactions instead of raw HTTP requests.

Read the bundled markdown docs before writing or executing SDK code.

## Read bundled docs first

Skill resources include markdown docs at:

- `${CLAUDE_PLUGIN_ROOT}/skills/artiq-http-sdk/resources/artiq-http-docs/README.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/artiq-http-sdk/resources/artiq-http-docs/llms.txt`
- `${CLAUDE_PLUGIN_ROOT}/skills/artiq-http-sdk/resources/artiq-http-docs/llms_full.txt`

These LLM files are copied from Fern-generated artifacts by the build pipeline.
Use `llms.txt` as the entrypoint and `llms_full.txt` for complete SDK and API context.
If needed, drill down to `overview.md` and `api-reference.md`.

## Prefer bundled SDK artifact

Install from this plugin's bundled wheel when available:

```bash
pip install "${CLAUDE_PLUGIN_ROOT}/resources/artiq-sdk/artiq_http_client-*.whl"
```

If multiple wheels are present, install the one listed in `${CLAUDE_PLUGIN_ROOT}/resources/artiq-sdk/LATEST_SDK.txt`.

## Import and instantiate

```python
from artiq_http_client import ArtiqClient
from artiq_http_client._models import ExpID

with ArtiqClient("http://localhost:8000") as client:
    experiments = client.explist.list()
```

## Use this SDK for

- Listing and searching experiments (`client.explist`)
- Getting experiment defaults (`client.explist.get_defaults`)
- Submitting and waiting on experiments (`client.schedule`)
- Reading datasets (`client.datasets`)
- Health checks (`client.health`)

## Agent behavior expectations

- Prefer the bundled SDK and docs over hand-written HTTP requests.
- Read `llms_full.txt` before coding to gather full endpoint and model context.
- Verify method names and payload shape in `api-reference.md` before coding.
- If ambiguity remains, rely on the bundled wheel and `llms_full.txt` as the source of truth.

## Error handling

SDK methods raise `httpx` exceptions for transport and HTTP errors. Catch `httpx.HTTPStatusError` for non-2xx responses and `httpx.RequestError` for network failures.

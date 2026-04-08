---
name: artiq-sdk
description: Use the bundled artiq_http_client SDK for ARTIQ HTTP experiment discovery, submission, scheduling, and dataset access.
---

# ARTIQ SDK Skill

Use the Python `artiq_http_client` SDK for ARTIQ HTTP interactions instead of raw HTTP requests.

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

## Error handling

SDK methods raise `httpx` exceptions for transport and HTTP errors. Catch `httpx.HTTPStatusError` for non-2xx responses and `httpx.RequestError` for network failures.

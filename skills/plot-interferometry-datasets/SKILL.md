---
name: plot-interferometry-datasets
description: Plot ARTIQ ndscan interferometry experiment data as ASCII art in the terminal. Use when the user wants to visualise RID results (excitation fraction, atom number, imbalance) from an ARTIQ master.
---

# Plot Interferometry Datasets

Quickly visualise ndscan interferometry experiment results from the ARTIQ master as ASCII plots in a terminal.

## When to use

When a user asks to plot, visualise, or see the results of a specific ARTIQ RID (Run ID), especially interferometry scans showing excitation fraction, atom number, or imbalance vs detuning.

## Prerequisites

- `uv` installed (https://github.com/astral-sh/uv)
- Network access to the artiq_http backend

## Usage

```bash
# Plot data for RID 71798 using the default server (10.137.1.252:8000)
plot-rid.sh 71798

# Plot data for a different RID against a custom server
plot-rid.sh 71800 http://localhost:8000
```

## What it does

1. Creates a Python venv in `/tmp/artiq-plot-venv` using `uv` (idempotent)
2. Installs `plotext` if not already present
3. Fetches ndscan datasets from the artiq_http API for the given RID
4. Plots three ASCII charts:
   - **Excitation fraction** (forward + backward) vs detuning
   - **Atom number** (forward + backward) vs detuning
   - **Atom number imbalance** vs detuning

## API endpoints used

- `GET /datasets/names` — list all datasets
- `GET /datasets/values?names=...` — fetch values for specific datasets

Datasets are filtered by the ndscan prefix `ndscan.rid_{RID}.points.*`.

## References

```bash
#!/usr/bin/env bash
# Plot ARTIQ ndscan data for a given RID as ASCII art.
# Usage: ./plot-rid.sh <RID> [SERVER_URL]
# Default server: http://10.137.1.252:8000

set -euo pipefail

RID="${1:-}"
SERVER="${2:-http://10.137.1.252:8000}"
VENV_DIR="/tmp/artiq-plot-venv"

if [ -z "$RID" ]; then
    echo "Usage: $0 <RID> [SERVER_URL]"
    echo "  RID:          ARTIQ run ID to plot"
    echo "  SERVER_URL:   artiq_http backend URL (default: http://10.137.1.252:8000)"
    exit 1
fi

# Ensure uv is available
if ! command -v uv &>/dev/null; then
    echo "Error: uv not found. Install from https://github.com/astral-sh/uv"
    exit 1
fi

# Build venv if missing
if [ ! -d "$VENV_DIR" ]; then
    echo "Creating venv at $VENV_DIR ..."
    uv venv "$VENV_DIR" --quiet
fi

# Install dependencies (idempotent)
"$VENV_DIR/bin/python" -c "import plotext" 2>/dev/null || \
    uv pip install plotext --python "$VENV_DIR/bin/python" --quiet

# Run the plotting script
exec "$VENV_DIR/bin/python" - "$RID" "$SERVER" <<'PYEOF'
import sys
import json
import urllib.request
import urllib.error

RID = sys.argv[1]
SERVER = sys.argv[2].rstrip("/")

def api_get(path, params=None):
    url = f"{SERVER}{path}"
    if params:
        url += "?" + "&".join(f"{k}={v}" for k, v in params.items())
    req = urllib.request.Request(url)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode() if e.fp else ""
        print(f"HTTP {e.code}: {body}", file=sys.stderr)
        raise

def get_dataset_values(names):
    """Fetch values for one or more datasets by name."""
    if not names:
        return {}
    names_str = ",".join(names)
    return api_get("/datasets/values", {"names": names_str})

def list_dataset_names():
    """Return list of all dataset names from the ARTIQ master."""
    return api_get("/datasets/names").get("names", [])

def find_rid_datasets(rid):
    """Find all ndscan datasets belonging to a specific RID."""
    prefix = f"ndscan.rid_{rid}."
    all_names = list_dataset_names()
    rid_names = [n for n in all_names if n.startswith(prefix)]
    return rid_names

def plot_rid(rid):
    print(f"Fetching datasets for RID {rid} from {SERVER} ...")

    rid_datasets = find_rid_datasets(rid)
    if not rid_datasets:
        print(f"No ndscan datasets found for RID {rid}", file=sys.stderr)
        sys.exit(1)

    # Identify key channels
    axis_name = f"ndscan.rid_{rid}.points.axis_0"
    exc_fw = f"ndscan.rid_{rid}.points.channel_excitation_fraction_forward"
    exc_bw = f"ndscan.rid_{rid}.points.channel_excitation_fraction_backward"
    atom_fw = f"ndscan.rid_{rid}.points.channel_atom_number_forward"
    atom_bw = f"ndscan.rid_{rid}.points.channel_atom_number_backward"
    imbalance = f"ndscan.rid_{rid}.points.channel_atom_number_imbalance"

    to_fetch = [axis_name]
    for ch in [exc_fw, exc_bw, atom_fw, atom_bw, imbalance]:
        if ch in rid_datasets:
            to_fetch.append(ch)

    data = get_dataset_values(to_fetch)

    freq = data.get(axis_name, [])
    if not freq:
        print(f"No axis data found for RID {rid}", file=sys.stderr)
        sys.exit(1)

    import plotext as plt

    # Plot 1: Excitation fraction
    if exc_fw in data or exc_bw in data:
        plt.clf()
        if exc_fw in data:
            plt.plot(freq, data[exc_fw], label="forward", marker="dot")
        if exc_bw in data:
            plt.plot(freq, data[exc_bw], label="backward", marker="dot")
        plt.xlabel("Freq detuning (kHz)")
        plt.ylabel("Excitation fraction")
        plt.title(f"RID {rid} - Excitation Fraction vs Detuning")
        plt.ylim(0, 1.1)
        plt.show()
        print("\n")

    # Plot 2: Atom numbers
    if atom_fw in data or atom_bw in data:
        plt.clf()
        if atom_fw in data:
            plt.plot(freq, data[atom_fw], label="forward", marker="dot")
        if atom_bw in data:
            plt.plot(freq, data[atom_bw], label="backward", marker="dot")
        plt.xlabel("Freq detuning (kHz)")
        plt.ylabel("Atom number")
        plt.title(f"RID {rid} - Atom Number vs Detuning")
        plt.show()
        print("\n")

    # Plot 3: Imbalance
    if imbalance in data:
        plt.clf()
        plt.plot(freq, data[imbalance], label="imbalance", marker="dot", color="red")
        plt.xlabel("Freq detuning (kHz)")
        plt.ylabel("Imbalance")
        plt.title(f"RID {rid} - Atom Number Imbalance vs Detuning")
        plt.show()

    print(f"\nRID {rid} plotted. Found {len(rid_datasets)} datasets.")

if __name__ == "__main__":
    plot_rid(RID)
PYEOF
```

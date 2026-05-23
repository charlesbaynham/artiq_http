#!/usr/bin/env bash
# Plot ARTIQ ndscan data for a given RID as ASCII art.
# Usage: ./plot-rid.sh <RID> [SERVER_URL]
# Default server: https://artiq.baynham.me/api

set -euo pipefail

RID="${1:-}"
SERVER="${2:-https://artiq.baynham.me/api}"
VENV_DIR="/tmp/artiq-plot-venv"
DIR_OF_THIS_FILE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -z "$RID" ]; then
    echo "Usage: $0 <RID> [SERVER_URL]"
    echo "  RID:          ARTIQ run ID to plot"
    echo "  SERVER_URL:   artiq_http backend URL (default: https://artiq.baynham.me/api)"
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
exec "$VENV_DIR/bin/python" "$DIR_OF_THIS_FILE/plot_rid.py" "$RID" "$SERVER"

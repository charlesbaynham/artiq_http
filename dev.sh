#!/bin/bash

# dev.sh - Start development environment with frontend, backend, and ARTIQ stack in tmux

MOCK_MODE=0

for arg in "$@"; do
    case "$arg" in
        --mock)
            MOCK_MODE=1
            ;;
    esac
done

SESSION_NAME="artiq_http_dev"
if [[ "$MOCK_MODE" -eq 1 ]]; then
    SESSION_NAME="artiq_http_dev_mock"
fi

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if tmux session already exists
if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
    echo "Session '$SESSION_NAME' already exists. Attaching..."
    tmux attach-session -t "$SESSION_NAME"
    exit 0
fi

# Clean up any stale containers from previous dev sessions before starting fresh
if [[ "$MOCK_MODE" -eq 0 ]]; then
    (cd "$SCRIPT_DIR/test-artiq" && docker compose down 2>/dev/null) || true
fi

# Create new tmux session with backend
tmux new-session -d -s "$SESSION_NAME" -n "dev" -c "$SCRIPT_DIR"
BACKEND_COMMAND="sleep 5 && npm run backend"
if [[ "$MOCK_MODE" -eq 1 ]]; then
    BACKEND_COMMAND="sleep 5 && npm run backend -- --mock"
fi
tmux send-keys -t "$SESSION_NAME" "$BACKEND_COMMAND" C-m

# Split vertically (left/right) for frontend
tmux split-window -h -c "$SCRIPT_DIR"
tmux send-keys "sleep 5 && npm run frontend" C-m

# Select the right pane and split it horizontally (top/bottom) for ARTIQ
if [[ "$MOCK_MODE" -eq 0 ]]; then
    tmux split-window -v -c "$SCRIPT_DIR/test-artiq"
    tmux send-keys "docker compose up" C-m
fi

# Split the backend pane (left) horizontally for the MCP server
tmux select-pane -t 0
tmux split-window -v -c "$SCRIPT_DIR"
tmux send-keys "sleep 5 && npm run mcp" C-m

# Final layout:
# Standard mode:
# +----------+----------+
# | Backend  | Frontend |
# | (pane 0) | (pane 1) |
# +----------+----------+
# |   MCP    |  ARTIQ   |
# | (pane 3) | (pane 2) |
# +----------+----------+
# Mock mode omits the ARTIQ pane.

# Select the backend pane
tmux select-pane -t 0

# Attach to the session
tmux attach-session -t "$SESSION_NAME"

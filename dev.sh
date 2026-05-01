#!/bin/bash

# dev.sh - Start development environment with frontend, backend, and ARTIQ stack in tmux

SESSION_NAME="artiq_http_dev"

# Check if tmux session already exists
if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
    echo "Session '$SESSION_NAME' already exists. Attaching..."
    tmux attach-session -t "$SESSION_NAME"
    exit 0
fi

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Create new tmux session with backend
tmux new-session -d -s "$SESSION_NAME" -n "dev" -c "$SCRIPT_DIR"
tmux send-keys -t "$SESSION_NAME" "sleep 5 && npm run backend" C-m

# Split vertically (left/right) for frontend
tmux split-window -h -c "$SCRIPT_DIR"
tmux send-keys "sleep 5 && npm run frontend" C-m

# Select the right pane and split it horizontally (top/bottom) for ARTIQ
# tmux select-pane -t 1
tmux split-window -v -c "$SCRIPT_DIR/test-artiq"
tmux send-keys "docker compose up" C-m

# Split the backend pane (left) horizontally for the MCP server
tmux select-pane -t 0
tmux split-window -v -c "$SCRIPT_DIR"
tmux send-keys "sleep 5 && npm run mcp" C-m

# Final layout:
# +----------+----------+
# | Backend  | Frontend |
# | (pane 0) | (pane 1) |
# +----------+----------+
# |   MCP    |  ARTIQ   |
# | (pane 3) | (pane 2) |
# +----------+----------+

# Select the backend pane
tmux select-pane -t 0

# Attach to the session
tmux attach-session -t "$SESSION_NAME"

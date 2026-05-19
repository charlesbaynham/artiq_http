#!/usr/bin/env bash
# Clones / updates reference copies of artiq and ndscan

set -euo pipefail

# Get repo root from git
REPO_ROOT=`git rev-parse --show-toplevel`
DEPS_DIR="$REPO_ROOT/.claude/deps"

mkdir -p "$DEPS_DIR"
cd $DEPS_DIR

if [[ -d "artiq/.git" ]]; then
    echo "[clone-deps] artiq already exists, updating..."
    (cd "artiq" && git fetch --depth=1 origin)
else
    echo "[clone-deps] Cloning artiq..."
    git clone --depth=1 "https://gitlab.com/aion-physics/code/artiq/forks/artiq_fork.git" "artiq"
fi


if [[ -d "ndscan/.git" ]]; then
    echo "[clone-deps] ndscan already exists, updating..."
    (cd "ndscan" && git fetch --depth=1 origin)
else
    echo "[clone-deps] Cloning ndscan..."
    git clone --depth=1 "https://gitlab.com/aion-physics/code/artiq/forks/ndscan" "ndscan"
fi


echo "[clone-deps] Done. Repos available in $DEPS_DIR/"

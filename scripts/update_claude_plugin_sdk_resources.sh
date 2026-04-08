#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SDK_DIR="${ROOT_DIR}/sdks/python"
SKILL_RESOURCES_DIR="${ROOT_DIR}/skills/artiq-http-sdk/resources"

mkdir -p "${SKILL_RESOURCES_DIR}"

rm -rf "${SKILL_RESOURCES_DIR}/artiq-http-sdk"

# Confirm that the SDK has been built
if [ ! -d "${SDK_DIR}" ]; then
  echo "Error: SDK dist directory not found. Please build the SDK first." >&2
  exit 1
fi

# Copy the built SDK to the skill resources directory
cp -r "${SDK_DIR}" "${SKILL_RESOURCES_DIR}/artiq-http-sdk"

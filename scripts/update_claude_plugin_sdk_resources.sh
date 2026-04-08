#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SDK_DIR="${ROOT_DIR}/sdk"
SDK_DIST_DIR="${SDK_DIR}/dist"
RESOURCES_DIR="${ROOT_DIR}/resources/artiq-sdk"

mkdir -p "${RESOURCES_DIR}"

rm -f "${RESOURCES_DIR}"/*.whl "${RESOURCES_DIR}"/*.tar.gz "${RESOURCES_DIR}/LATEST_SDK.txt"
rm -rf "${SDK_DIST_DIR}"

if command -v uv >/dev/null 2>&1; then
  uv build "${SDK_DIR}"
elif python3 -c "import build" >/dev/null 2>&1; then
  (
    cd "${SDK_DIR}"
    python3 -m build
  )
else
  echo "Error: neither 'uv' nor Python package 'build' is available."
  echo "Install uv, or run: python3 -m pip install build"
  exit 1
fi

latest_wheel="$(ls -1t "${SDK_DIST_DIR}"/*.whl | head -n 1)"
latest_sdist="$(ls -1t "${SDK_DIST_DIR}"/*.tar.gz | head -n 1)"

cp "${latest_wheel}" "${RESOURCES_DIR}/"
cp "${latest_sdist}" "${RESOURCES_DIR}/"

{
  echo "wheel=$(basename "${latest_wheel}")"
  echo "sdist=$(basename "${latest_sdist}")"
} > "${RESOURCES_DIR}/LATEST_SDK.txt"

echo "Updated ${RESOURCES_DIR} with:"
echo "  - $(basename "${latest_wheel}")"
echo "  - $(basename "${latest_sdist}")"

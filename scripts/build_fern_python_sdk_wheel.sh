#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SDK_SRC_DIR="${ROOT_DIR}/sdks/python"
SDK_DIST_DIR="${ROOT_DIR}/resources/artiq-sdk"
TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

if [ ! -d "${SDK_SRC_DIR}" ]; then
  echo "Error: SDK source directory not found at ${SDK_SRC_DIR}. Run fern generation first." >&2
  exit 1
fi

VERSION="$(awk -F '"' '/^version = / { print $2; exit }' "${ROOT_DIR}/pyproject.toml")"

if [ -z "${VERSION}" ]; then
  echo "Error: Unable to determine project version from pyproject.toml." >&2
  exit 1
fi

PACKAGE_DIR="${TMP_DIR}/artiq_http_client"
mkdir -p "${PACKAGE_DIR}"
cp -r "${SDK_SRC_DIR}/." "${PACKAGE_DIR}/"
rm -rf "${PACKAGE_DIR}/tests" "${PACKAGE_DIR}/.fern"

cat > "${TMP_DIR}/pyproject.toml" <<EOF
[project]
name = "artiq_http_client"
version = "${VERSION}"
description = "Generated Python SDK for ARTIQ HTTP"
readme = "README.md"
requires-python = ">=3.9"
dependencies = [
  "httpx>=0.23.0",
  "pydantic>=1.10.0",
  "typing-extensions>=4.0.0",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["artiq_http_client"]
EOF

cat > "${TMP_DIR}/README.md" <<'EOF'
# ARTIQ HTTP Python SDK

This wheel is generated from Fern outputs in `sdks/python`.
EOF

mkdir -p "${SDK_DIST_DIR}"
rm -f "${SDK_DIST_DIR}"/*.whl "${SDK_DIST_DIR}/LATEST_SDK.txt"

(
  cd "${TMP_DIR}"
  uv run --with build --with hatchling python -m build --wheel --no-isolation
)

cp "${TMP_DIR}/dist/"*.whl "${SDK_DIST_DIR}/"
LATEST_WHEEL="$(basename "$(ls -1 "${SDK_DIST_DIR}"/artiq_http_client-*.whl | sort | tail -n 1)")"
printf '%s\n' "${LATEST_WHEEL}" > "${SDK_DIST_DIR}/LATEST_SDK.txt"

echo "Built SDK wheel: ${LATEST_WHEEL}"

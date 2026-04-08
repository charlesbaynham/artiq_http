"""Tests for Claude plugin layout and SDK resources."""

import json
import tomllib
from pathlib import Path


def test_plugin_manifest_and_skill_exist():
    """Verify required Claude plugin files are present and valid."""
    root = Path(__file__).resolve().parent.parent

    manifest_path = root / ".claude-plugin" / "plugin.json"
    skill_path = root / "skills" / "artiq-sdk" / "SKILL.md"

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))

    assert manifest["name"] == "artiq-http-sdk"
    assert manifest["skills"] == "./skills/"
    assert skill_path.exists()


def test_bundled_sdk_artifacts_match_sdk_version():
    """Ensure plugin resources contain wheel and sdist for current SDK version."""
    root = Path(__file__).resolve().parent.parent

    sdk_pyproject = tomllib.loads((root / "sdk" / "pyproject.toml").read_text(encoding="utf-8"))
    sdk_version = sdk_pyproject["project"]["version"]

    resources = root / "resources" / "artiq-sdk"
    expected_wheel = resources / f"artiq_http_client-{sdk_version}-py3-none-any.whl"
    expected_sdist = resources / f"artiq_http_client-{sdk_version}.tar.gz"

    assert expected_wheel.exists(), f"Missing wheel artifact: {expected_wheel.name}"
    assert expected_sdist.exists(), f"Missing sdist artifact: {expected_sdist.name}"
    assert (resources / "LATEST_SDK.txt").exists()

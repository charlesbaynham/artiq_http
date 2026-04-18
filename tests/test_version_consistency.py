"""Version consistency tests."""

import json
import tomllib
from pathlib import Path

import artiq_http


def test_runtime_and_package_versions_match():
    """Ensure runtime, pyproject, package.json, and Claude plugin versions stay in sync."""
    root = Path(__file__).resolve().parent.parent
    pyproject_path = root / "pyproject.toml"
    package_json_path = root / "package.json"
    plugin_json_path = root / ".claude-plugin" / "plugin.json"

    pyproject_data = tomllib.loads(pyproject_path.read_text(encoding="utf-8"))
    package_json_data = json.loads(package_json_path.read_text(encoding="utf-8"))
    plugin_data = json.loads(plugin_json_path.read_text(encoding="utf-8"))

    assert artiq_http.__version__ == pyproject_data["project"]["version"]
    assert artiq_http.__version__ == package_json_data["version"]
    assert artiq_http.__version__ == plugin_data["version"], f"Claude plugin version mismatch: {plugin_data.get('version')} != {artiq_http.__version__}"


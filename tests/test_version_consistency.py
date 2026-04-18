"""Version consistency tests."""

import json
import tomllib
from pathlib import Path

import artiq_http


def test_runtime_and_package_versions_match():
    """Ensure runtime, pyproject, and package.json versions stay in sync."""
    root = Path(__file__).resolve().parent.parent
    pyproject_path = root / "pyproject.toml"
    package_json_path = root / "package.json"

    pyproject_data = tomllib.loads(pyproject_path.read_text(encoding="utf-8"))
    package_json_data = json.loads(package_json_path.read_text(encoding="utf-8"))

    assert artiq_http.__version__ == pyproject_data["project"]["version"]
    assert artiq_http.__version__ == package_json_data["version"]

import json
import os
import subprocess
from pathlib import Path


VERSION_FILE = Path(__file__, "../../VERSION.json").resolve()
OVERRIDE_ENVVAR = "PYTHON_VERSION_OVERRIDE"


def get_version() -> str:
    """
    Returns the version string from VERSION.json.

    Priority order:
    1. PYTHON_VERSION_OVERRIDE environment variable
    2. VERSION.json file
    3. Git commit hash appended if available (for development builds)
    """
    # If the override env var is set, use it
    if OVERRIDE_ENVVAR in os.environ and os.environ[OVERRIDE_ENVVAR]:
        return os.environ[OVERRIDE_ENVVAR]

    # Read version from VERSION.json
    version = json.loads(VERSION_FILE.read_text())["version"]

    # In development, optionally append git commit hash
    try:
        git_hash = subprocess.check_output(
            ["git", "rev-parse", "--short", "HEAD"],
            stderr=subprocess.DEVNULL,
            universal_newlines=True,
        ).strip()

        # Check if working directory is dirty
        git_status = subprocess.check_output(
            ["git", "status", "--porcelain"],
            stderr=subprocess.DEVNULL,
            universal_newlines=True,
        ).strip()

        dirty_suffix = ".d" if git_status else ""
        return f"{version}+{git_hash}{dirty_suffix}"
    except (FileNotFoundError, subprocess.CalledProcessError):
        # Git not available or not a git repository
        return version

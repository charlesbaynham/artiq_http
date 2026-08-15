"""Drift test for the static GitHub Pages mock fixtures.

`frontend/public/mock/**` is generated from `artiq_http.mock_backend` by
`scripts/generate_mock_fixtures.py` and is committed so it can be served as
static files on GitHub Pages. This test regenerates the fixtures into a
temporary directory and diffs them against what's committed, so a change to
`mock_backend.py` that isn't followed by re-running the generator (and
committing the result) fails CI instead of silently drifting the JS mock
(`frontend/src/api/mockAdapter.js`) out of sync with the Python one.
"""

import filecmp
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
COMMITTED_DIR = ROOT / "frontend" / "public" / "mock"
GENERATOR = ROOT / "scripts" / "generate_mock_fixtures.py"

REGENERATE_HINT = (
    "Mock fixtures are out of date.\n"
    "Run:\n"
    "    uv run python scripts/generate_mock_fixtures.py\n"
    "and commit the resulting changes under frontend/public/mock/."
)


def _all_files(root: Path) -> set:
    return {p.relative_to(root).as_posix() for p in root.rglob("*") if p.is_file()}


def test_fixtures_regenerate_with_no_diff(tmp_path):
    assert COMMITTED_DIR.is_dir(), (
        f"{COMMITTED_DIR} does not exist. Run: uv run python scripts/generate_mock_fixtures.py"
    )

    out_dir = tmp_path / "mock"
    result = subprocess.run(
        [sys.executable, str(GENERATOR), "--out", str(out_dir)],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    assert result.returncode == 0, (
        f"scripts/generate_mock_fixtures.py failed:\nstdout:\n{result.stdout}\nstderr:\n{result.stderr}"
    )

    committed_files = _all_files(COMMITTED_DIR)
    regenerated_files = _all_files(out_dir)

    missing = regenerated_files - committed_files
    extra = committed_files - regenerated_files
    assert not missing and not extra, (
        f"{REGENERATE_HINT}\n"
        f"Files regenerated but not committed: {sorted(missing)}\n"
        f"Files committed but no longer generated: {sorted(extra)}"
    )

    _, mismatched, errors = filecmp.cmpfiles(COMMITTED_DIR, out_dir, sorted(committed_files), shallow=False)
    assert not mismatched and not errors, (
        f"{REGENERATE_HINT}\nMismatched files: {sorted(mismatched)}\nComparison errors: {errors}"
    )

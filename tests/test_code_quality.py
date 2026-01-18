"""Tests to ensure code quality standards are maintained."""

import os
import re
from pathlib import Path

import pytest


def get_source_files():
    """Get all Python source files in the project."""
    project_root = Path(__file__).parent.parent
    source_dirs = [project_root / "artiq_http"]
    
    source_files = []
    for source_dir in source_dirs:
        if source_dir.exists():
            for py_file in source_dir.rglob("*.py"):
                source_files.append(py_file)
    
    return source_files


def test_no_fixme_in_code():
    """Ensure there are no FIXME comments left in the source code.
    
    FIXME comments indicate incomplete or temporary code that should be
    addressed before merging. This test fails if any FIXME strings are
    found in the codebase.
    """
    source_files = get_source_files()
    fixme_occurrences = []
    
    for file_path in source_files:
        try:
            content = file_path.read_text(encoding="utf-8")
            lines = content.splitlines()
            
            for line_num, line in enumerate(lines, start=1):
                if "FIXME" in line:
                    fixme_occurrences.append(
                        f"{file_path.relative_to(file_path.parent.parent)}:{line_num}: {line.strip()}"
                    )
        except Exception as e:
            pytest.fail(f"Error reading {file_path}: {e}")
    
    if fixme_occurrences:
        message = "FIXME comments found in source code:\n" + "\n".join(fixme_occurrences)
        pytest.fail(message)

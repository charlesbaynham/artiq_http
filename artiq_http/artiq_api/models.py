import logging
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class ExpID(BaseModel):
    log_level: int = logging.WARNING
    file: str
    class_name: str
    arguments: Optional[Dict[str, Any]]
    repo_rev: Optional[str] = None


class ScheduleItem(BaseModel):
    pipeline: str
    priority: int
    due_date: Optional[float]
    flush: bool
    status: Optional[str]
    repo_msg: Optional[str]
    expid: ExpID


class ExperimentEntry(BaseModel):
    name: str
    file: str
    class_name: str
    arginfo: Optional[Dict[str, Any]] = None
    argument_ui: Optional[str] = None
    scheduler_defaults: Optional[dict] = None
    docstring: Optional[str] = None


class ExperimentList(BaseModel):
    current_rev: Optional[str]
    scanning: bool
    experiments: List[ExperimentEntry] = []


class ExperimentDefaults(BaseModel):
    file: str
    class_name: str
    arguments: Dict[str, Any]


class ExperimentArginfo(BaseModel):
    file: str
    class_name: str
    arginfo: Dict[str, Any]


class SubmitAndWaitResult(BaseModel):
    rid: int
    status: str
    timed_out: bool


class LogEntry(BaseModel):
    timestamp: float
    source: str
    level: int
    message: str


class LogList(BaseModel):
    """Response shape for ``GET /api/logs``.

    Entries are typed as ``Dict[str, Any]`` rather than ``LogEntry`` so the
    endpoint can fall back to returning raw dicts when an ARTIQ entry doesn't
    match the expected shape.
    """

    logs: List[Dict[str, Any]]


class ScanAxis(BaseModel):
    """A single scan axis for a high-level scan submission.

    ``type`` must be one of: ``LinearScan``, ``RandomScan``, ``ExpScan``, ``ListScan``.

    For ``LinearScan``, ``RandomScan``, and ``ExpScan`` the ``range`` dict must
    contain ``start`` (float), ``stop`` (float), and ``num_points`` (int).

    For ``ListScan`` the ``range`` dict must contain ``values`` (list of float).
    """

    fqn: str = Field(..., description="Fully-qualified parameter name, e.g. 'my_exp.frequency'")
    type: str = Field(
        ...,
        description="Scan type: one of LinearScan, RandomScan, ExpScan, ListScan",
    )
    range: Dict[str, Any] = Field(
        ...,
        description=(
            "Range specification. For LinearScan/RandomScan/ExpScan: "
            "{'start': float, 'stop': float, 'num_points': int}. "
            "For ListScan: {'values': [float, ...]}."
        ),
    )


class ScanSubmitRequest(BaseModel):
    """Request body for ``POST /api/scan`` and ``POST /api/scan/submit-and-wait``."""

    file: str = Field(..., description="Relative path to the experiment file, e.g. 'scans/rabi.py'")
    class_name: str = Field(..., description="Python class name of the experiment, e.g. 'RabiFlop'")
    axes: List[ScanAxis] = Field(..., description="List of scan axes (at least one required)")
    fixed_params: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Dict mapping FQN to override value for parameters held fixed during the scan",
    )
    num_repeats: int = Field(default=1, ge=1, description="Number of times to repeat the scan (default 1)")
    pipeline: str = Field(default="main", description="Scheduling pipeline name (default 'main')")
    priority: int = Field(default=0, description="Scheduling priority — higher runs sooner (default 0)")
    flush: bool = Field(default=False, description="Flush the pipeline before submitting (default False)")
    due_date: Optional[float] = Field(default=None, description="Optional due date as Unix timestamp")

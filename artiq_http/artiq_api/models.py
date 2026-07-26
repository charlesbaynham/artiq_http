import logging
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, field_validator


class ExpID(BaseModel):
    log_level: int = logging.WARNING
    file: str
    class_name: str
    arguments: Dict[str, Any] = Field(default_factory=dict)
    repo_rev: Optional[str] = None

    @field_validator("arguments", mode="before")
    @classmethod
    def _normalise_arguments(cls, value: Any) -> Any:
        """Coerce a missing/``null`` ``arguments`` to an empty dict.

        ARTIQ feeds ``expid["arguments"]`` straight into ndscan's /
        ARTIQ's ``ProcessArgumentManager`` (``if key in unprocessed_arguments``),
        which raises ``TypeError: argument of type 'NoneType' is not iterable``
        when the value is ``None`` instead of falling back to the experiment's
        default arguments. ``None`` and ``{}`` are semantically identical here
        ("no explicit arguments — use defaults"), so we normalise ``None`` to
        ``{}`` before it reaches the master. Any other non-dict value is left
        untouched so pydantic rejects it with a clear 422.
        """
        return {} if value is None else value


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
    #: Revision the GUI should fall back to when the "Rev / ref" field is left blank
    #: and no lab-wide default revision is configured. Mirrors ``current_rev`` unless
    #: ``ARTIQ_HTTP_DEFAULT_REVISION`` overrides it (see artiq_http/config.py).
    default_revision_fallback: Optional[str] = None


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
    #: "completed" — the run left the schedule and no failure was logged for it.
    #: "failed" — a worker exception / RID deletion was found in the logs.
    #: "timeout" — the run was still in the schedule when *timeout* elapsed.
    status: str
    timed_out: bool
    #: First line of the logged error when ``status == "failed"``, else None.
    error: Optional[str] = None


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

    ``type`` is an ndscan scan-generator name: ``linear``, ``centre_span``, or
    ``list``.

    * ``linear``: ``range`` = {'start': float, 'stop': float, 'num_points': int}.
    * ``centre_span``: ``range`` = {'centre': float, 'half_span': float,
      'num_points': int}.
    * ``list``: ``range`` = {'values': [float, ...]}.

    An optional ``randomise_order`` (bool, default False) may be added to any
    ``range``.

    ``path`` is optional: the parameter's instance path is resolved
    automatically from the experiment's ``instances`` map, so a sub-fragment
    parameter is targeted correctly without specifying it.  Only set ``path``
    to disambiguate an FQN that is mounted at more than one instance path.
    """

    fqn: str = Field(..., description="Fully-qualified parameter name, e.g. 'my_exp.frequency'")
    type: str = Field(
        ...,
        description="ndscan generator name: one of linear, centre_span, list",
    )
    range: Dict[str, Any] = Field(
        ...,
        description=(
            "Range specification. For linear: {'start', 'stop', 'num_points'}. "
            "For centre_span: {'centre', 'half_span', 'num_points'}. "
            "For list: {'values': [...]}. Optional 'randomise_order' (bool)."
        ),
    )
    path: Optional[str] = Field(
        default=None,
        description=(
            "Optional instance path to target. Resolved automatically from the "
            "experiment's instances map when omitted; set only to disambiguate "
            "an FQN present at multiple instance paths."
        ),
    )


class ScanSubmitRequest(BaseModel):
    """Request body for ``POST /api/scan`` and ``POST /api/scan/submit-and-wait``."""

    file: str = Field(..., description="Relative path to the experiment file, e.g. 'scans/rabi.py'")
    class_name: str = Field(..., description="Python class name of the experiment, e.g. 'RabiFlop'")
    axes: List[ScanAxis] = Field(
        ...,
        description="List of scan axes; may be empty to run once with no scan axis (no_axes_mode 'single')",
    )
    fixed_params: Optional[Dict[str, Any]] = Field(
        default=None,
        description=(
            "Dict mapping FQN to override value for parameters held fixed during "
            "the scan. The instance path is resolved automatically (sub-fragment "
            "params included). To disambiguate an FQN present at multiple paths, "
            "pass {'value': <v>, 'path': <instance_path>} instead of a bare value."
        ),
    )
    num_repeats: int = Field(default=1, ge=1, description="Number of times to repeat the scan (default 1)")
    repo_rev: Optional[str] = Field(
        default=None,
        description=(
            "Git revision (commit hash, branch, or tag) of the experiment repository to "
            "check out before building the scan and running it. Omit to use the master's "
            "current revision. Use this to scan an experiment that exists only on another "
            "branch (by ref) without hand-building ndscan_params."
        ),
    )
    pipeline: str = Field(default="main", description="Scheduling pipeline name (default 'main')")
    priority: int = Field(default=0, description="Scheduling priority — higher runs sooner (default 0)")
    flush: bool = Field(default=False, description="Flush the pipeline before submitting (default False)")
    due_date: Optional[float] = Field(default=None, description="Optional due date as Unix timestamp")
    skip_on_persistent_transitory_error: bool = Field(
        default=False,
        description=(
            "If True, ndscan skips (rather than aborts the whole scan on) a point that keeps hitting "
            "a transitory error after exhausting its retries. Maps straight to ndscan's TopLevelRunner "
            "option of the same name (default False)."
        ),
    )
    randomise_order_globally: bool = Field(
        default=False,
        description=(
            "If True, randomise the order in which the overall grid of scan-axis combinations is "
            "visited (ndscan's scan.randomise_order_globally). This is distinct from a per-axis "
            "'randomise_order' (see ScanAxis.range), which only randomises that one axis's own point "
            "order; this flag additionally shuffles which axis-combination is visited next. Default False."
        ),
    )


class PresetCreate(BaseModel):
    """Request body for ``POST /api/presets`` and ``PUT /api/presets/{id}``.

    ``working_set`` is opaque passthrough — it is the frontend's
    ``WorkingSetEntry[]`` array; the server stores and returns it verbatim and
    never interprets its contents.
    """

    name: str
    file: str
    class_name: str
    favourite: bool = False
    working_set: List[Dict[str, Any]] = Field(default_factory=list)
    pipeline: str = "main"
    priority: int = 0
    repeats: int = 1
    skip_on_error: bool = False
    revision: Optional[str] = None


class Preset(BaseModel):
    """A saved scan/session configuration, lab-wide (no auth/user concept).

    Presets are persisted as a single JSON file via
    ``artiq_http.artiq_api.presets_store`` — there is no other backend
    persistence layer. ``id``, ``created_at`` and ``updated_at`` are server-
    generated (see :mod:`presets_store`).
    """

    id: str
    name: str
    file: str
    class_name: str
    favourite: bool = False
    working_set: List[Dict[str, Any]] = Field(default_factory=list)
    pipeline: str = "main"
    priority: int = 0
    repeats: int = 1
    skip_on_error: bool = False
    revision: Optional[str] = None
    created_at: float
    updated_at: float


class PresetList(BaseModel):
    presets: List[Preset] = Field(default_factory=list)

"""
Pydantic models for validating ARTIQ ndscan_params dicts.

The ``ndscan_params`` argument is a PYON-encoded string.  Decode it with
``sipyco.pyon.decode(raw)`` before passing to ``NdscanParams.model_validate()``.

See docs/ndscan_params.md for a full explanation of the schema.
"""

from __future__ import annotations

from enum import Enum
from typing import Annotated, Any, Literal, Union

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Parameter spec models  (the "spec" subfield inside each schemata entry)
# ---------------------------------------------------------------------------


class FloatSpec(BaseModel):
    is_scannable: bool
    scale: float = 1.0
    step: float = 1.0
    min: float | None = None
    max: float | None = None
    unit: str | None = None


class IntSpec(BaseModel):
    is_scannable: bool
    scale: int = 1
    min: int | None = None
    max: int | None = None
    unit: str | None = None


class StringSpec(BaseModel):
    is_scannable: bool


class BoolSpec(BaseModel):
    is_scannable: bool


class EnumSpec(BaseModel):
    is_scannable: bool
    members: dict[str, str]  # enum member name -> display string


# ---------------------------------------------------------------------------
# Parameter schema models  (entries in the top-level "schemata" dict)
# ---------------------------------------------------------------------------


class _SchemaBase(BaseModel):
    fqn: str
    description: str
    default: str  # PYON-encoded default value
    explanation: str = ""


class FloatSchema(_SchemaBase):
    type: Literal["float"]
    spec: FloatSpec


class IntSchema(_SchemaBase):
    type: Literal["int"]
    spec: IntSpec


class StringSchema(_SchemaBase):
    type: Literal["string"]
    spec: StringSpec


class BoolSchema(_SchemaBase):
    type: Literal["bool"]
    spec: BoolSpec


class EnumSchema(_SchemaBase):
    type: Literal["enum"]
    spec: EnumSpec


ParameterSchema = Annotated[
    Union[FloatSchema, IntSchema, StringSchema, BoolSchema, EnumSchema],
    Field(discriminator="type"),
]


# ---------------------------------------------------------------------------
# Override spec
# ---------------------------------------------------------------------------


class OverrideSpec(BaseModel):
    path: str
    value: Any  # PYON-decoded value; concrete type matches the parameter type


# ---------------------------------------------------------------------------
# Scan generator range models  (the "range" subfield inside each axis spec)
# ---------------------------------------------------------------------------


class LinearRange(BaseModel):
    """Equally-spaced points from start to stop (inclusive)."""

    start: float
    stop: float
    num_points: int = Field(ge=2)
    randomise_order: bool = False


class CentreSpanRange(BaseModel):
    """Linear scan parameterised by centre ± half_span."""

    centre: float
    half_span: float
    num_points: int = Field(ge=2)
    randomise_order: bool = False
    limit_lower: float | None = None
    limit_upper: float | None = None


class RefiningRange(BaseModel):
    """Progressively finer grid: level 0 = endpoints, each level bisects gaps.
    No fixed point count; the scan runs until stopped or a level limit is hit."""

    lower: float
    upper: float
    randomise_order: bool = False


class CentreSpanRefiningRange(BaseModel):
    """Refining scan parameterised by centre ± half_span."""

    centre: float
    half_span: float
    randomise_order: bool = False
    limit_lower: float | None = None
    limit_upper: float | None = None


class ExpandingRange(BaseModel):
    """Starts at centre, adds symmetric pairs at increasing distance each level."""

    centre: float
    spacing: float
    randomise_order: bool = False
    limit_lower: float | None = None
    limit_upper: float | None = None


class ListRange(BaseModel):
    """Explicit user-supplied list of values."""

    values: list[Any]
    randomise_order: bool = False


# ---------------------------------------------------------------------------
# Axis specs  (discriminated union on the "type" key)
# ---------------------------------------------------------------------------


class _AxisBase(BaseModel):
    fqn: str   # FQN of the parameter being scanned
    path: str  # instance path, e.g. "" for the root fragment


class LinearAxisSpec(_AxisBase):
    type: Literal["linear"]
    range: LinearRange


class CentreSpanAxisSpec(_AxisBase):
    type: Literal["centre_span"]
    range: CentreSpanRange


class RefiningAxisSpec(_AxisBase):
    type: Literal["refining"]
    range: RefiningRange


class CentreSpanRefiningAxisSpec(_AxisBase):
    type: Literal["centre_span_refining"]
    range: CentreSpanRefiningRange


class ExpandingAxisSpec(_AxisBase):
    type: Literal["expanding"]
    range: ExpandingRange


class ListAxisSpec(_AxisBase):
    type: Literal["list"]
    range: ListRange


AxisSpec = Annotated[
    Union[
        LinearAxisSpec,
        CentreSpanAxisSpec,
        RefiningAxisSpec,
        CentreSpanRefiningAxisSpec,
        ExpandingAxisSpec,
        ListAxisSpec,
    ],
    Field(discriminator="type"),
]


# ---------------------------------------------------------------------------
# Scan spec
# ---------------------------------------------------------------------------


class NoAxesMode(str, Enum):
    single = "single"
    continuous = "continuous"
    time_series = "time_series"


class ScanSpec(BaseModel):
    axes: list[AxisSpec] = Field(default_factory=list)
    num_repeats: int = 1
    num_repeats_per_point: int = 1
    randomise_order_globally: bool = False
    no_axes_mode: NoAxesMode = NoAxesMode.single
    skip_on_persistent_transitory_error: bool = False


# ---------------------------------------------------------------------------
# Top-level NdscanParams
# ---------------------------------------------------------------------------


class NdscanParams(BaseModel):
    """Top-level model for a decoded ``ndscan_params`` argument.

    Usage::

        from sipyco import pyon
        from artiq_http.ndscan_schema import NdscanParams

        raw = experiment_info["arginfo"]["ndscan_params"][0]["default"]
        params = NdscanParams.model_validate(pyon.decode(raw))

    Raises ``pydantic.ValidationError`` if the decoded dict does not conform
    to the schema.
    """

    instances: dict[str, list[str]]
    """Maps parameter FQN -> list of instance paths where it appears."""

    schemata: dict[str, ParameterSchema]
    """Maps parameter FQN -> full parameter description (type, spec, default…)."""

    always_shown: list[tuple[str, str]] = Field(default_factory=list)
    """Parameters always shown in the UI: list of (fqn, path) pairs."""

    overrides: dict[str, list[OverrideSpec]] = Field(default_factory=dict)
    """Fixed value overrides: maps FQN -> list of per-path override specs."""

    scan: ScanSpec | None = None
    """Scan configuration; present only when the experiment is scannable."""

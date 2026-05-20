# ndscan_params schema

`ndscan_params` is the single ARTIQ argument exposed by every ndscan
`FragmentScanExperiment`.  Its value is a **PYON-encoded string** whose decoded
form is a nested Python dict.  This document describes that dict structure and
explains how to validate it with the Pydantic models in
`artiq_http/ndscan_schema.py`.

---

## Quick start

```python
from sipyco import pyon
from artiq_http.ndscan_schema import NdscanParams

# explist entry obtained from the ARTIQ master
raw = experiment_info["arginfo"]["ndscan_params"][0]["default"]

params = NdscanParams.model_validate(pyon.decode(raw))

# Access the schemata
for fqn, schema in params.schemata.items():
    print(fqn, schema.type, schema.description)

# Check whether a scan is configured
if params.scan and params.scan.axes:
    for axis in params.scan.axes:
        print(axis.fqn, axis.type, axis.range)
```

---

## Top-level structure

```
NdscanParams
├── instances    : dict[fqn -> list[path]]
├── schemata     : dict[fqn -> ParameterSchema]
├── always_shown : list[[fqn, path]]
├── overrides    : dict[fqn -> list[OverrideSpec]]
└── scan         : ScanSpec | None
```

| Field | Required | Description |
|-------|----------|-------------|
| `instances` | yes | Maps each parameter FQN to the fragment instance paths where it appears. The root fragment's path is `""`. |
| `schemata` | yes | Full description of every parameter (type, default, display hints). |
| `always_shown` | no | Parameters that the dashboard always shows, as `[fqn, path]` pairs. |
| `overrides` | no | Fixed value overrides chosen by the user. |
| `scan` | no | Present only when the experiment is scannable. Contains axes and repeat configuration. |

---

## Parameter schemata

Each value in `schemata` is a `ParameterSchema` — a discriminated union keyed
on the `type` field.

### Common fields (all types)

| Field | Type | Description |
|-------|------|-------------|
| `fqn` | `str` | Fully-qualified parameter name, e.g. `my_exp.MyFragment.frequency` |
| `description` | `str` | Short display label |
| `explanation` | `str` | Longer tooltip text (may be empty) |
| `type` | `str` | One of `"float"`, `"int"`, `"string"`, `"bool"`, `"enum"` |
| `default` | `str` | PYON-encoded default value |
| `spec` | dict | Type-specific display/constraint information (see below) |

### `"float"` — `FloatSchema`

```python
FloatSchema(
    type="float",
    spec=FloatSpec(
        is_scannable=True,
        scale=1e6,         # SI scale factor (e.g. 1e6 for MHz)
        step=1e4,          # suggested GUI step size, in base units
        min=0.0,           # optional lower bound
        max=1e9,           # optional upper bound
        unit="Hz",         # optional display unit string
    ),
    ...
)
```

### `"int"` — `IntSchema`

```python
IntSchema(
    type="int",
    spec=IntSpec(
        is_scannable=True,
        scale=1,
        min=0,             # optional
        max=100,           # optional
        unit=None,
    ),
    ...
)
```

### `"string"` — `StringSchema`

```python
StringSchema(type="string", spec=StringSpec(is_scannable=False), ...)
```

### `"bool"` — `BoolSchema`

```python
BoolSchema(type="bool", spec=BoolSpec(is_scannable=False), ...)
```

### `"enum"` — `EnumSchema`

```python
EnumSchema(
    type="enum",
    spec=EnumSpec(
        is_scannable=True,
        members={"ValueA": "Value A", "ValueB": "Value B"},
        # key = Python enum member name, value = display string
    ),
    ...
)
```

---

## Overrides

```python
overrides = {
    "my_exp.MyFragment.frequency": [
        OverrideSpec(path="", value=1e8)   # root instance, value in base units
    ]
}
```

An override replaces the parameter's default for a specific instance path.
Multiple overrides for the same FQN (different paths) are listed in the same
array.

---

## Scan configuration (`ScanSpec`)

```python
ScanSpec(
    axes=[...],                          # list of AxisSpec (see below)
    num_repeats=1,                       # repeat the whole scan N times
    num_repeats_per_point=1,             # average N shots per point
    randomise_order_globally=False,      # shuffle across all axes jointly
    no_axes_mode=NoAxesMode.single,      # behaviour when axes=[]
    skip_on_persistent_transitory_error=False,
)
```

### `no_axes_mode` values

| Value | Behaviour |
|-------|-----------|
| `"single"` | Run the experiment once (default) |
| `"continuous"` | Loop the experiment until manually stopped |
| `"time_series"` | Loop and record results as a time series |

---

## Scan axes (`AxisSpec`)

Each axis is a discriminated union on the `type` field.

```python
AxisSpec(
    fqn="my_exp.MyFragment.frequency",  # which parameter to scan
    path="",                            # which instance
    type="linear",                      # generator type (see below)
    range=LinearRange(...),             # generator parameters
)
```

---

## Scan generator types

The `type` string and the corresponding `range` model:

### `"linear"` — `LinearRange`

Fixed grid of equally-spaced points.

```python
LinearRange(start=100e6, stop=200e6, num_points=50, randomise_order=False)
```

| Field | Type | Notes |
|-------|------|-------|
| `start` | `float` | First point (base units) |
| `stop` | `float` | Last point (base units) |
| `num_points` | `int ≥ 2` | Total number of points |
| `randomise_order` | `bool` | Shuffle before scanning |

---

### `"centre_span"` — `CentreSpanRange`

Like `linear` but parameterised by centre and half-span.

```python
CentreSpanRange(centre=150e6, half_span=50e6, num_points=50,
                randomise_order=False, limit_lower=None, limit_upper=None)
```

---

### `"refining"` — `RefiningRange`

Progressively finer grid with no fixed point count.  Level 0 yields the two
endpoints; each subsequent level inserts midpoints between existing points.
Useful for adaptive spectroscopy.

```python
RefiningRange(lower=100e6, upper=200e6, randomise_order=False)
```

---

### `"centre_span_refining"` — `CentreSpanRefiningRange`

Refining scan parameterised by centre and half-span.

```python
CentreSpanRefiningRange(centre=150e6, half_span=50e6, randomise_order=False,
                        limit_lower=None, limit_upper=None)
```

---

### `"expanding"` — `ExpandingRange`

Starts at the centre point, then adds symmetric pairs at increasing distance
each level.  Useful when the signal location is approximately known.

```python
ExpandingRange(centre=150e6, spacing=1e6, randomise_order=False,
               limit_lower=None, limit_upper=None)
```

---

### `"list"` — `ListRange`

Explicit user-supplied values in any order.

```python
ListRange(values=[100e6, 130e6, 170e6, 200e6], randomise_order=False)
```

---

## Generator comparison

| `type` | Key params | Point count | Int variant? |
|--------|-----------|-------------|--------------|
| `linear` | start, stop, num_points | fixed | yes |
| `centre_span` | centre, half_span, num_points | fixed | yes |
| `refining` | lower, upper | unbounded (levels) | yes |
| `centre_span_refining` | centre, half_span | unbounded (levels) | yes |
| `expanding` | centre, spacing | unbounded (levels) | no (shared) |
| `list` | values | fixed (len values) | no (shared) |

For `"int"`-type parameters, ndscan automatically selects integer-specialised
generator implementations for `refining`, `linear`, `centre_span`, and
`centre_span_refining`.  These guarantee each integer is visited at most once
and that refining scans terminate.

---

## Pydantic model reference

All models live in `artiq_http.ndscan_schema`.

```
NdscanParams
├── ParameterSchema  (discriminated on type)
│   ├── FloatSchema  → FloatSpec
│   ├── IntSchema    → IntSpec
│   ├── StringSchema → StringSpec
│   ├── BoolSchema   → BoolSpec
│   └── EnumSchema   → EnumSpec
├── OverrideSpec
└── ScanSpec
    └── AxisSpec  (discriminated on type)
        ├── LinearAxisSpec           → LinearRange
        ├── CentreSpanAxisSpec       → CentreSpanRange
        ├── RefiningAxisSpec         → RefiningRange
        ├── CentreSpanRefiningAxisSpec → CentreSpanRefiningRange
        ├── ExpandingAxisSpec        → ExpandingRange
        └── ListAxisSpec             → ListRange
```

### Validation example

```python
from pydantic import ValidationError
from sipyco import pyon
from artiq_http.ndscan_schema import NdscanParams, ScanSpec, LinearAxisSpec

raw = experiment_info["arginfo"]["ndscan_params"][0]["default"]
try:
    params = NdscanParams.model_validate(pyon.decode(raw))
except ValidationError as e:
    print(e)

# Type-narrow an axis to access generator-specific fields
if params.scan:
    for axis in params.scan.axes:
        if isinstance(axis, LinearAxisSpec):
            print(f"{axis.fqn}: {axis.range.num_points} points "
                  f"from {axis.range.start} to {axis.range.stop}")
```

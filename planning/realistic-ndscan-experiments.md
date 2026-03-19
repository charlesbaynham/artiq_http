# Realistic NDScan Experiments

## Top-Level Goal

Replace simple dummy experiments in `test-artiq` with realistic NDScan experiments to better test UI capabilities.

## Detailed Goal

### Problem Statement
The current dummy experiments in `test-artiq` are too simplistic (mostly 1D with single outputs) and do not adequately test the UI's handling of complex scenarios like multi-dimensional scans, nested subfragments, parameter hierarchies, or multiple result channels. This limits the ability to verify UI features for the actual use cases found in `icl_experiments`.

### Expected Outcomes
- `test-artiq/generate_dummies.py` script is overhauled.
- New generated experiments will emulate the structure of real experiments (e.g., `RabiFlopSim`).
- Key features to include:
    - **Nested Fragments**: Testing hierarchy display and parameter grouping.
    - **Diverse Parameters**: `FloatParam` (with/without units), `IntParam`, `BoolParam`, `StringParam`.
    - **Rich Results**: Multiple `ResultChannel`s, `OpaqueChannel`s, and error bars.
    - **Simulation**: Meaningful data generation (e.g., sine waves, noise) to verify plotting.

## Implementation Plan


### 1. Research & Analysis
- [ ] Read `~/icl_experiments/.github/copilot-instructions.md` (Completed).
- [ ] Reference `~/icl_experiments/repository/tests` for implementation patterns.

### 2. Update `test-artiq/generate_dummies.py`

I will replace the existing generation logic with a new set of templates based on `icl_experiments` patterns and the **Best Practices** from `copilot-instructions.md`.

#### Key Implementation Guidelines (from Copilot Instructions):
- **Structure**: Use `build_fragment()` instead of `build()`.
- **Entry Point**: Always call `make_fragment_scan_exp` at the end of the file.
- **Naming**: `MyExperimentFrag` (fragment) -> `MyExperiment` (scannable exp).
- **Parameters**:
    - Defaults in **Base SI units** (e.g., `100e6` for 100MHz).
    - `unit` argument is for display ONLY.
    - Annotate with `FloatParamHandle`, not `FloatParam`.
- **Subfragments**: Pass **class** to `setattr_fragment`, not instance.

#### Templates to Implement:

1.  **Basic Parameter Scan**
    - Single fragment (`BasicScanFrag`).
    - Mix of Float, Int, Bool parameters following SI unit conventions.
    - Single scalar result.

2.  **Nested Hierarchy (The "Rabi Flop" equivalent)**
    - Top-level fragment (`RabiFlopFrag`) with physical parameters (`rabi_freq`, `duration` in Hz/s).
    - Sub-fragment (e.g., `ReadoutFrag`) added via `self.setattr_fragment("readout", ReadoutFrag)`.
    - Result channels in the sub-fragment.

3.  **Complex Results**
    - Experiments producing multiple values per point.
    - Experiments with Array/Opaque results (if supported by NDScan dummies).

#### [MODIFY] [generate_dummies.py](file:///home/charles/artiq_http/test-artiq/generate_dummies.py)
- Import `ndscan.experiment` classes.
- Define internal classes strings following the guidelines above.
- Ensure generated code is valid Python and matches `icl_experiments` style.

### 3. Verify with Docker

- Run `generate_dummies.py` to create the files.
- Restart the `test-artiq` container.
- Verify experiments appear in the dashboard.
- Verify experiments can be submitted and run.

## Technical Considerations

- **Imports**: Must ensure `ndscan` is available in the content strings (it is present in the container).
- **Naming**: Use realistic names (e.g., `Spectroscopy_LineScan`, `Rabi_TimeScan`) instead of random noun/verb combos.
- **Data**: Data generation should be deterministic enough to look "real" (e.g., `np.sin` based on parameters) rather than just random noise, so plots look functional.

## Acceptance Criteria

- [ ] `generate_dummies.py` produces Valid python files.
- [ ] Generated experiments load in ARTIQ master without errors.
- [ ] UI displays hierarchical parameters correctly (nested sections).
- [ ] Scans can be submitted and produce visible data plots.

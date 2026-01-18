# NDScan Plot Visualizations

## Top-Level Goal

Implement automatic visualization of NDScan experiment datasets through interactive plots that adapt to the scan dimensionality and data structure.

## Detailed Goal

### Problem Statement

NDScan outputs datasets in a well-structured, consistent format, but these datasets are most useful when displayed graphically. Currently, users must manually interpret raw dataset values without visual representation. The system needs to automatically detect NDScan datasets and present appropriate visualizations based on the scan type (0D time-series, 1D line plots, 2D heatmaps) while handling variable sampling rates, uneven spacing, and multiple samples per point.

### Expected Outcomes

- Users are presented with a list of available plots from datasets present in the store
- 0D scans (no-axis scans) are visualized as time-series plots showing how sampled values vary over time
- 1D scans are visualized as line plots with appropriate handling of multiple samples per point
- 2D scans are visualized as heatmaps/contour plots
- Plots automatically adapt to data characteristics (evenly/unevenly spaced points, single/multiple samples)
- Visualization updates via polling (with architecture that supports future streaming updates)

## Implementation Plan

<!-- To be filled in during implementation planning phase -->
1. Research and select plotting library (considering: Plotly for interactivity, Chart.js for performance, or alternatives)
2. Implement NDScan dataset parser to extract scan dimensionality and structure
3. Create plot component architecture supporting future streaming updates
4. Implement 0D time-series visualization
5. Implement 1D line plot visualization
6. Implement 2D heatmap/contour visualization
7. Create dataset-to-plot mapping UI
8. Implement polling mechanism for plot updates
9. Add plot controls (zoom, pan, export, etc.)

## Technical Considerations

### Plotting Library Selection Criteria

- **Interactivity**: Support for zoom, pan, hover tooltips
- **Performance**: Ability to handle real-time updates and large datasets
- **Flexibility**: Support for time-series, line plots, and heatmaps
- **Future-proofing**: Architecture that can transition from polling to streaming updates
- **Bundle size**: Minimize impact on frontend performance

### Recommended Approach

**Plotly.js** appears to be the best fit because:
- Excellent support for all required plot types (scatter, line, heatmap)
- Built-in interactivity (zoom, pan, hover)
- Good performance with incremental updates (important for future streaming)
- React wrapper available (`react-plotly.js`)
- Handles uneven spacing and multiple samples naturally

**Alternative**: Chart.js with plugins could work but has weaker 2D visualization support.

### Data Structure Considerations

- Design plot components to accept data updates incrementally
- Use immutable data patterns to facilitate future streaming architecture
- Separate data fetching/polling logic from visualization rendering
- Consider using a state management approach that can easily transition to WebSocket updates

## Acceptance Criteria

<!-- To be defined during planning phase -->
- [ ] 0D scans display as time-series plots with all samples visible
- [ ] 1D scans display as line plots with proper axis labels
- [ ] 2D scans display as heatmaps with color scales
- [ ] Plots handle multiple samples per point correctly
- [ ] Plots handle unevenly spaced points correctly
- [ ] Users can see a list of available plots from current datasets
- [ ] Plots update automatically via polling
- [ ] Plot interactions (zoom, pan, reset) work smoothly
- [ ] Code architecture supports future migration to streaming updates

## Example Datasets for Testing

The file [notebooks/datasets_example.json](file:///home/charles/artiq_http/notebooks/datasets_example.json) contains example datasets output from the test ARTIQ instance, including both NDScan and normal datasets. This file should be inspected to understand the dataset structure and format.

### Generating Additional Test Data

To generate more example datasets for testing different scan types:

1. **Start the test ARTIQ instance** using the Docker stack
2. **Run example experiments** through the API:
   - **0D scans (no-axis)**: Run NDScan experiments with no axes configured - these sample the same parameters repeatedly and output time-series data
   - **1D scans**: Run NDScan experiments with a single axis - these output values for each point along one parameter
   - **2D scans**: Run NDScan experiments with two axes - these output values for each combination of two parameters
3. **Retrieve datasets** using the backend API's `/datasets` endpoint after experiments complete
4. **Inspect the structure** to understand:
   - How scan dimensionality is encoded in the dataset metadata
   - How axis information (parameter names, ranges, spacing) is stored
   - How data points are structured (single vs. multiple samples per point)
   - How evenly vs. unevenly spaced points are represented

This hands-on exploration will inform the implementation of the dataset parser and visualization components.

## Dependencies & Prerequisites

- Dataset exploration feature (for accessing and listing datasets)
- Understanding of NDScan dataset structure and format (see Example Datasets section above)
- Backend API endpoint for fetching dataset values (may need enhancement)
- Test ARTIQ instance with NDScan experiments available

## Notes

Created: 2026-01-18
Status: Planning

### NDScan Dataset Structure Reference

NDScan experiments output datasets with consistent structure:
- **Scan type metadata**: Indicates dimensionality (0D, 1D, 2D, etc.)
- **Axis information**: Parameter names, ranges, spacing
- **Data points**: May include multiple samples per point
- **Point spacing**: Can be evenly or unevenly distributed

Higher-dimensional scans (3D+) are explicitly out of scope for initial implementation.

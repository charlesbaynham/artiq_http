import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Plot from "react-plotly.js";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import { useSSEDataset, SSEState } from "./hooks/useSSEDataset";

/**
 * Component to render NDScan visualizations (0D, 1D, 2D)
 * Uses SSE for real-time updates
 * @param {string} prefix - The NDScan prefix, e.g., "ndscan.rid_1"
 */
function NDScanPlot({ prefix }) {
  const {
    data: rawData,
    connectionState,
    error,
    isConnecting,
  } = useSSEDataset(prefix);

  // Parse the raw SSE data into structured plot data
  const plotData = useMemo(() => {
    if (!rawData) return null;

    try {
      // Extract axes and channels metadata
      const axesKey = `${prefix}.axes`;
      const channelsKey = `${prefix}.channels`;
      const completedKey = `${prefix}.completed`;

      if (!rawData[axesKey] || !rawData[channelsKey]) {
        return null;
      }

      const axes = JSON.parse(rawData[axesKey][1]);
      const channels = JSON.parse(rawData[channelsKey][1]);
      const completed = rawData[completedKey]?.[1] ?? false;

      // Build channelData from raw data
      const channelData = {};
      Object.keys(rawData).forEach((key) => {
        if (
          key.startsWith(`${prefix}.point.`) ||
          key.startsWith(`${prefix}.points.`)
        ) {
          channelData[key] = rawData[key];
        }
      });

      return {
        axes,
        channels,
        channelData,
        completed,
        prefix,
      };
    } catch (err) {
      console.error("Error parsing NDScan data:", err);
      return null;
    }
  }, [rawData, prefix]);

  // Connection status indicator
  const ConnectionIndicator = () => {
    if (connectionState === SSEState.CONNECTED) {
      return (
        <Badge bg="success" className="me-2" title="Live updates active">
          ● Live
        </Badge>
      );
    }
    if (
      connectionState === SSEState.CONNECTING ||
      connectionState === SSEState.RECONNECTING
    ) {
      return (
        <Badge bg="warning" className="me-2" title="Connecting...">
          ○ Connecting
        </Badge>
      );
    }
    if (connectionState === SSEState.ERROR) {
      return (
        <Badge bg="danger" className="me-2" title={error || "Connection error"}>
          ✕ Error
        </Badge>
      );
    }
    return null;
  };

  // Loading state
  if (isConnecting && !plotData) {
    return (
      <div className="text-center p-3">
        <Spinner animation="border" size="sm" />
        <span className="ms-2">Connecting to live data...</span>
      </div>
    );
  }

  // Error state (only show if no data)
  if (error && !plotData) {
    return (
      <Alert variant="warning" className="small p-2">
        Connection error: {error}
      </Alert>
    );
  }

  // No data yet
  if (!plotData) {
    return (
      <div className="text-center p-3 text-muted">Waiting for data...</div>
    );
  }

  const { axes, channels, channelData, completed } = plotData;
  const channelNames = Object.keys(channels);

  // Render different plots based on dimensionality
  if (axes.length === 0) {
    // 0D: Value display (current point)
    return (
      <div className="ndscan-plot-0d p-3 border rounded">
        <div className="d-flex align-items-center mb-3">
          <ConnectionIndicator />
          <h6 className="mb-0">0D Scan: {prefix}</h6>
          {completed && (
            <Badge bg="secondary" className="ms-2">
              Completed
            </Badge>
          )}
        </div>
        <div className="d-flex flex-wrap gap-3">
          {channelNames.map((ch) => (
            <div
              key={ch}
              className="card bg-secondary text-white"
              style={{ minWidth: "150px" }}
            >
              <div className="card-body text-center">
                <div className="text-muted small mb-1">{ch}</div>
                <div className="h4 mb-0">
                  {typeof channelData[`${prefix}.point.${ch}`]?.[1] === "number"
                    ? channelData[`${prefix}.point.${ch}`][1].toPrecision(5)
                    : "—"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (axes.length === 1) {
    // 1D Line Plot
    const axis = axes[0];
    const xLabel = axis.param?.description || axis.param?.fqn || "X";

    // Use explicit axis points if available
    const xValues = channelData[`${prefix}.points.axis_0`]?.[1] || [];

    const traces = channelNames.map((ch) => {
      const yValues = channelData[`${prefix}.points.channel_${ch}`]?.[1] || [];
      return {
        x: xValues.slice(0, yValues.length), // Ensure x and y have same length
        y: yValues,
        type: "scatter",
        mode: "lines+markers",
        name: ch,
      };
    });

    return (
      <div>
        <div className="d-flex align-items-center mb-2">
          <ConnectionIndicator />
          {completed && <Badge bg="secondary">Completed</Badge>}
          <span className="ms-2 text-muted small">{xValues.length} points</span>
        </div>
        <Plot
          data={traces}
          layout={{
            title: `1D Scan: ${prefix}`,
            xaxis: { title: xLabel },
            yaxis: { title: "Value" },
            autosize: true,
            margin: { l: 50, r: 30, t: 50, b: 50 },
            template: "plotly_dark",
            paper_bgcolor: "rgba(0,0,0,0)",
            plot_bgcolor: "rgba(0,0,0,0)",
          }}
          useResizeHandler={true}
          style={{ width: "100%", height: "400px" }}
          config={{ displayModeBar: true, responsive: true }}
        />
      </div>
    );
  }

  if (axes.length === 2) {
    // 2D Scatter/Heatmap
    const xAxis = axes[0];
    const yAxis = axes[1];

    const xValues = channelData[`${prefix}.points.axis_0`]?.[1] || [];
    const yValues = channelData[`${prefix}.points.axis_1`]?.[1] || [];

    const traces = channelNames.map((ch) => {
      const zValues = channelData[`${prefix}.points.channel_${ch}`]?.[1] || [];

      // Use scatter with color for general 2D data
      return {
        x: xValues,
        y: yValues,
        mode: "markers",
        marker: {
          color: zValues,
          colorscale: "Viridis",
          showscale: true,
          colorbar: { title: ch },
        },
        type: "scatter",
        name: ch,
        text: zValues.map((v) => `${ch}: ${v?.toPrecision?.(4) || v}`),
      };
    });

    return (
      <div>
        <div className="d-flex align-items-center mb-2">
          <ConnectionIndicator />
          {completed && <Badge bg="secondary">Completed</Badge>}
          <span className="ms-2 text-muted small">{xValues.length} points</span>
        </div>
        <Plot
          data={traces}
          layout={{
            title: `2D Scan: ${prefix}`,
            xaxis: { title: xAxis.param?.description || "Axis 0" },
            yaxis: { title: yAxis.param?.description || "Axis 1" },
            autosize: true,
            margin: { l: 50, r: 30, t: 50, b: 50 },
            template: "plotly_dark",
            paper_bgcolor: "rgba(0,0,0,0)",
            plot_bgcolor: "rgba(0,0,0,0)",
            hovermode: "closest",
          }}
          useResizeHandler={true}
          style={{ width: "100%", height: "500px" }}
          config={{ displayModeBar: true, responsive: true }}
        />
      </div>
    );
  }

  return <div>Unsupported scan dimensionality: {axes.length}</div>;
}

NDScanPlot.propTypes = {
  prefix: PropTypes.string.isRequired,
};

export default NDScanPlot;

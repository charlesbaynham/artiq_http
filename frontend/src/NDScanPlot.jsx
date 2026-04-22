import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Plot from "react-plotly.js";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import { get_dataset_values } from "./api/client";

/**
 * Component to render NDScan visualizations (0D, 1D, 2D)
 * @param {string} prefix - The NDScan prefix, e.g., "ndscan.rid_1"
 */
function NDScanPlot({ prefix }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch axes and channels first to know what to fetch next
        const baseDatasets = await get_dataset_values([
          `${prefix}.axes`,
          `${prefix}.channels`,
          `${prefix}.completed`,
          `${prefix}.fragment_fqn`,
        ]);

        if (
          !baseDatasets[`${prefix}.axes`] ||
          !baseDatasets[`${prefix}.channels`]
        ) {
          throw new Error("Missing NDScan metadata (axes or channels)");
        }

        const axes = JSON.parse(baseDatasets[`${prefix}.axes`][1]);
        const channels = JSON.parse(baseDatasets[`${prefix}.channels`][1]);
        const completed = baseDatasets[`${prefix}.completed`][1];
        const fragmentFqn = baseDatasets[`${prefix}.fragment_fqn`]?.[1] || null;

        // Fetch data for each channel
        const channelNames = Object.keys(channels);
        const dataQueries = [];

        if (axes.length === 0) {
          // 0D scan: fetch point.channel_name
          channelNames.forEach((ch) =>
            dataQueries.push(`${prefix}.point.${ch}`),
          );
        } else {
          // 1D or 2D: fetch points.channel_chname AND points.axis_i
          channelNames.forEach((ch) =>
            dataQueries.push(`${prefix}.points.channel_${ch}`),
          );
          // Fetch axis points for each dimension
          axes.forEach((_, i) =>
            dataQueries.push(`${prefix}.points.axis_${i}`),
          );
        }

        const channelData = await get_dataset_values(dataQueries);

        setData({
          axes,
          channels,
          channelData,
          completed,
          prefix,
          fragmentFqn,
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching NDScan plot data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // In a real app, we might poll if !completed
  }, [prefix]);

  if (loading) {
    return (
      <div className="text-center p-3">
        <Spinner animation="border" size="sm" />
        <span className="ms-2">Loading plot...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="warning" className="small p-2">
        Plot error: {error}
      </Alert>
    );
  }

  if (!data) return null;

  const { axes, channels, channelData, fragmentFqn } = data;
  const channelNames = Object.keys(channels);
  const titleSuffix = fragmentFqn ? ` (${fragmentFqn})` : "";

  // Render different plots based on dimensionality
  if (axes.length === 0) {
    // 0D: Time series (multiple channels)
    // For 0D, we usually have a history, but ARTIQ datasets might only show the current point
    // unless it's explicitly recorded. In the example, rid_1 has "point.signal".
    // If it's a "no-axis" scan, it might be sampled multiple times into a "points" dataset too?
    // Let's check rid_1 again. It has "point.signal".

    // Actually, if it's 0D, it might just be the last point.
    // If the user wants a time-series, they might need a 1D scan over "time" or similar.
    // However, the planning doc says "0D scans are visualized as time-series plots showing how sampled values vary over time".
    // This implies we need to accumulate data if it's just the current point, or look for a "history" dataset.
    // In the absence of a history dataset in the example, I'll render the single point or handle it gracefully.

    return (
      <div className="ndscan-plot-0d p-3 border rounded">
        <h6 className="mb-3">0D Scan: {prefix}{titleSuffix}</h6>
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
    const xLabel = axis.param.description || axis.param.fqn;

    // Use explicit axis points if available
    const xValues = channelData[`${prefix}.points.axis_0`]?.[1] || [];

    // Fallback if axis points are missing (shouldn't happen for standard NDScan)
    if (xValues.length === 0) {
      const pointsCount =
        channelData[`${prefix}.points.channel_${channelNames[0]}`]?.[1]
          ?.length || 0;
      for (let i = 0; i < pointsCount; i++)
        xValues.push(axis.min + i * axis.increment);
    }

    const traces = channelNames.map((ch) => {
      const yValues = channelData[`${prefix}.points.channel_${ch}`]?.[1] || [];
      return {
        x: xValues,
        y: yValues,
        type: "scatter",
        mode: "lines+markers",
        name: ch,
      };
    });

    return (
      <Plot
        data={traces}
        layout={{
          title: `1D Scan: ${prefix}${titleSuffix}`,
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
      />
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
        text: zValues.map(
          (v) =>
            `${ch}: ${typeof v === "number" ? v.toPrecision(4) : String(v)}`,
        ),
      };
    });

    return (
      <Plot
        data={traces}
        layout={{
          title: `2D Scan: ${prefix}${titleSuffix}`,
          xaxis: { title: xAxis.param.description || "Axis 0" },
          yaxis: { title: yAxis.param.description || "Axis 1" },
          autosize: true,
          margin: { l: 50, r: 30, t: 50, b: 50 },
          template: "plotly_dark",
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          hovermode: "closest",
        }}
        useResizeHandler={true}
        style={{ width: "100%", height: "500px" }}
      />
    );
  }

  return <div>Unsupported scan dimensionality: {axes.length}</div>;
}

NDScanPlot.propTypes = {
  prefix: PropTypes.string.isRequired,
};

export default NDScanPlot;

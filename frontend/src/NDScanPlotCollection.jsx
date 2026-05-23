import React from "react";
import PlotsApp from "./plots/PlotsApp";

/**
 * Plots view — entry point that renders the redesigned PlotsApp.
 *
 * The view is gated behind VITE_SHOW_PLOTS so it can be disabled in
 * production builds while still under iteration.
 */
function NDScanPlotCollection() {
  const showPlots = import.meta.env.VITE_SHOW_PLOTS === "true";

  if (!showPlots) {
    return (
      <div className="empty-state">
        <div className="empty-state__eyebrow">Coming soon!</div>
        <p className="empty-state__message">
          The plots view is currently under development.
        </p>
        <p className="empty-state__hint">
          Enable VITE_SHOW_PLOTS at build time to preview this feature.
        </p>
      </div>
    );
  }

  return <PlotsApp />;
}

export default NDScanPlotCollection;

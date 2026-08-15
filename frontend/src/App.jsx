import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import BenchApp from "./bench/BenchApp";
import LegacyApp from "./LegacyApp";
import NDScanPlotCollection from "./NDScanPlotCollection";

/**
 * App — thin router (IMPL-SPEC §10).
 *
 * `/`, `/runs`, `/datasets` and `/logs` all mount the bench shell
 * (`BenchApp`), which reads the current route itself to decide which pane to
 * show. `/plots` and `/plots/fullscreen` are the existing plots app,
 * untouched. `/legacy` is the entire pre-redesign page, moved verbatim to
 * `LegacyApp.jsx` so nothing is lost. Anything unmatched redirects to `/`.
 */

function PlotFullscreen() {
  return (
    <div
      className="plots-fullscreen-wrap"
      style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
    >
      <NDScanPlotCollection />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<BenchApp />} />
      <Route path="/runs" element={<BenchApp />} />
      <Route path="/datasets" element={<BenchApp />} />
      <Route path="/logs" element={<BenchApp />} />

      <Route path="/plots" element={<NDScanPlotCollection />} />
      <Route path="/plots/fullscreen" element={<PlotFullscreen />} />

      <Route path="/legacy/*" element={<LegacyApp />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "./bench/bench.css";

// Static-mock adapter (frontend/src/api/mockAdapter.js): patches fetch/
// EventSource so the whole app runs with no Python backend at all (GitHub
// Pages demo — `npm run build:mock`). Must be installed before React renders
// so no component's first fetch races the real network.
if (import.meta.env.VITE_MOCK === "1") {
  await import("./api/mockAdapter.js");
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);

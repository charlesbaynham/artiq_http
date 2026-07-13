import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import CollapsibleSection from "./CollapsibleSection";
import Schedule from "./Schedule";
import NewExperiment from "./NewExperiment";
import ExperimentSubmission from "./ExperimentSubmission";
import DatasetExplorer from "./DatasetExplorer";
import NDScanPlotCollection from "./NDScanPlotCollection";
import ConnectionErrorModal from "./ConnectionErrorModal";
import ErrorBoundary from "./ErrorBoundary";
import Logs from "./Logs";
import DefaultRevision from "./DefaultRevision";
import { get_health, get_explist } from "./api/client";
import useLocalStorageState from "./hooks/useLocalStorageState";
import MobileNavigation from "./MobileNavigation";

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

const PAGE_LABELS = {
  running: "RUNNING",
  datasets: "DATASETS",
  plots: "PLOTS",
  schedule: "SCHEDULE",
  configure: "CONFIGURE",
};

function AppHeader({ currentPage, isOnline }) {
  return (
    <header className="app-topbar mobile-only" aria-label="ARTIQ control bar">
      <div className="app-topbar__brand">
        <span className="app-topbar__mark">ARTIQ</span>
        <span className="app-topbar__section">
          {PAGE_LABELS[currentPage] || ""}
        </span>
      </div>
      <div
        className={`app-topbar__status ${
          isOnline ? "is-online" : "is-offline"
        }`}
        aria-live="polite"
      >
        <span className="app-topbar__dot" />
        <span className="app-topbar__status-text">
          {isOnline ? "ONLINE" : "OFFLINE"}
        </span>
      </div>
    </header>
  );
}

const HEALTH_CHECK_INTERVAL = 5000; // 5 seconds

function App() {
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [repoRev, setRepoRev] = useState(null);
  // Lab-wide default revision/branch for experiment submissions, persisted so
  // it survives reloads and applies to every submission until changed.
  const [defaultRevision, setDefaultRevision] = useLocalStorageState(
    "artiq_http.default_revision",
    "",
  );
  const [connectionError, setConnectionError] = useState(null); // null, "backend", or "artiq"

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Determine current page from URL path
  const getPageFromPath = (pathname) => {
    if (pathname.startsWith("/datasets")) return "datasets";
    if (pathname.startsWith("/plots")) return "plots";
    if (pathname.startsWith("/schedule")) return "schedule";
    if (pathname.startsWith("/configure")) return "configure";
    if (pathname.startsWith("/running")) return "running";
    if (pathname.startsWith("/logs")) return "logs";
    return "schedule"; // Default
  };

  const currentPage = getPageFromPath(location.pathname);

  // Deep linking for Experiment Selection
  useEffect(() => {
    const exp = searchParams.get("experiment");
    const rev = searchParams.get("rev");
    if (exp) {
      setSelectedExperiment(exp);
      setRepoRev(rev);
    }
  }, [searchParams]);

  const handlePageChange = (page) => {
    // Map page IDs to routes
    const routes = {
      running: "/running",
      datasets: "/datasets",
      plots: "/plots",
      schedule: "/schedule",
      configure: "/configure",
      logs: "/logs",
    };
    const route = routes[page] || "/schedule";
    navigate(route);
  };

  // Scroll to active section on Desktop
  useEffect(() => {
    // Only scroll if we are on desktop (>768px check roughly, or just do it always since mobile hides sections)
    // We can use the section id logic or just scroll the window
    const element = document.getElementById(`section-${currentPage}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentPage]);

  // Fetch experiment list
  const [explist, setExplist] = useState({});
  useEffect(() => {
    const fetchExplist = () => {
      // Import locally or just assume it's available? Need to add import.
      get_explist()
        .then(setExplist)
        .catch((err) =>
          console.error("Experiment list update error:", err.message),
        );
    };
    fetchExplist();
    const interval = setInterval(fetchExplist, 10000);
    return () => clearInterval(interval);
  }, []);

  // Sync selection logic - store as string in URL
  const handleSelect = (node) => {
    // node from ExperimentTree is { experiment: { file: "...", class_name: "..." } }
    // We want a unique ID. Composite key: "file:class_name"
    const exp = node.experiment;
    const uniqueId = `${exp.file}:${exp.class_name}`;

    // Prefer the lab-wide default revision if one is set, otherwise fall back to
    // the master's current revision.
    const effectiveRev =
      (defaultRevision && defaultRevision.trim()) || explist.current_rev;

    setSelectedExperiment(uniqueId);
    setRepoRev(effectiveRev);

    const params = new URLSearchParams();
    params.set("experiment", uniqueId);
    if (effectiveRev) params.set("rev", effectiveRev);
    navigate({ pathname: "/configure", search: params.toString() });

    // Scroll to Configure Submission section
    setTimeout(() => {
      const element = document.getElementById("section-configure");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // Re-hydrate from URL
  useEffect(() => {
    const expParam = searchParams.get("experiment");
    if (expParam) {
      setSelectedExperiment(expParam);
    }
  }, [searchParams]);

  // Health check polling
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await get_health();

        // If we got a response, backend is reachable
        if (health.artiq_connected) {
          // All good, clear any errors
          setConnectionError(null);
        } else {
          // Backend is up but ARTIQ is down
          setConnectionError("artiq");
        }
      } catch (err) {
        // Network error - backend is unreachable
        setConnectionError("backend");
      }
    };

    // Check immediately on mount
    checkHealth();

    // Then check periodically
    const interval = setInterval(checkHealth, HEALTH_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  if (location.pathname === "/plots/fullscreen") {
    return <PlotFullscreen />;
  }

  return (
    <div className="app-container">
      <ConnectionErrorModal
        errorType={connectionError}
        show={connectionError !== null}
      />
      <AppHeader
        currentPage={currentPage}
        isOnline={connectionError === null}
      />
      <Container fluid className="p-3 p-md-4">
        <h1 className="app-h1-desktop desktop-only">ARTIQ HTTP interface</h1>

        {/* Running Section */}
        <Row
          id="section-running"
          className={`pt-2 page-section ${
            currentPage === "running" ? "active" : ""
          }`}
        >
          <Col>
            <CollapsibleSection title="Running">
              <ErrorBoundary>
                <Schedule />
              </ErrorBoundary>
            </CollapsibleSection>
          </Col>
        </Row>

        {/* Datasets Section */}
        <Row
          id="section-datasets"
          className={`pt-2 page-section ${
            currentPage === "datasets" ? "active" : ""
          }`}
        >
          <Col>
            <CollapsibleSection title="Datasets" defaultExpanded={false}>
              <ErrorBoundary>
                <DatasetExplorer />
              </ErrorBoundary>
            </CollapsibleSection>
          </Col>
        </Row>

        {/* Plots Section */}
        <Row
          id="section-plots"
          className={`pt-2 page-section ${
            currentPage === "plots" ? "active" : ""
          }`}
        >
          <Col>
            <CollapsibleSection title="Plots" defaultExpanded={false}>
              <ErrorBoundary>
                <NDScanPlotCollection />
              </ErrorBoundary>
            </CollapsibleSection>
          </Col>
        </Row>

        {/* Schedule New Section */}
        <Row
          id="section-schedule"
          className={`pt-2 page-section ${
            currentPage === "schedule" ? "active" : ""
          }`}
        >
          <Col>
            <CollapsibleSection title="Schedule new">
              <ErrorBoundary>
                <DefaultRevision
                  value={defaultRevision}
                  onChange={setDefaultRevision}
                  currentRev={explist.current_rev}
                />
                <NewExperiment
                  explist={explist}
                  onSelect={handleSelect}
                  selectedExperiment={selectedExperiment}
                />
              </ErrorBoundary>
            </CollapsibleSection>
          </Col>
        </Row>

        {/* Configure Submission Section */}
        <Row
          id="section-configure"
          className={`pt-2 page-section ${
            currentPage === "configure" ? "active" : ""
          }`}
        >
          <Col>
            <CollapsibleSection title="Configure Submission">
              <ErrorBoundary>
                <ExperimentSubmission
                  explist={explist}
                  experiment={selectedExperiment}
                  repo_rev={repoRev}
                  defaultRevision={defaultRevision}
                />
              </ErrorBoundary>
            </CollapsibleSection>
          </Col>
        </Row>

        {/* Logs Section */}
        <Row
          id="section-logs"
          className={`pt-2 page-section ${
            currentPage === "logs" ? "active" : ""
          }`}
        >
          <Col>
            <CollapsibleSection title="Logs" defaultExpanded={false}>
              <ErrorBoundary>
                <Logs currentPage={currentPage} />
              </ErrorBoundary>
            </CollapsibleSection>
          </Col>
        </Row>
      </Container>

      {/* Mobile Navigation - only visible on mobile */}
      <MobileNavigation
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default App;

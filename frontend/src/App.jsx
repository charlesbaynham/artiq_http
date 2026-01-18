import React, { useState, useEffect } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import CollapsibleSection from "./CollapsibleSection";
import Schedule from "./Schedule";
import NewExperiment from "./NewExperiment";
import ExperimentSubmission from "./ExperimentSubmission";
import DatasetExplorer from "./DatasetExplorer";
import ConnectionErrorModal from "./ConnectionErrorModal";
import { get_health } from "./api/client";

const HEALTH_CHECK_INTERVAL = 5000; // 5 seconds

function App() {
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [repoRev, setRepoRev] = useState(null);
  const [connectionError, setConnectionError] = useState(null); // null, "backend", or "artiq"

  const handleSelect = (experiment, rev) => {
    setSelectedExperiment(experiment);
    setRepoRev(rev);
  };

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

  return (
    <>
      <ConnectionErrorModal
        errorType={connectionError}
        show={connectionError !== null}
      />
      <Container fluid className="p-3 p-md-4">
        <h1 className="mb-4">ARTIQ HTTP interface</h1>

        <Row className="pt-2">
          <Col>
            <CollapsibleSection title="Running">
              <Schedule />
            </CollapsibleSection>
          </Col>
        </Row>
        <Row className="pt-2">
          <Col>
            <CollapsibleSection title="Datasets">
              <DatasetExplorer />
            </CollapsibleSection>
          </Col>
        </Row>
        <Row className="pt-2">
          <Col>
            <CollapsibleSection title="Schedule new">
              <NewExperiment
                onSelect={handleSelect}
                selectedExperiment={selectedExperiment}
              />
            </CollapsibleSection>
          </Col>
        </Row>
        <Row className="pt-2">
          <Col>
            <ExperimentSubmission
              experiment={selectedExperiment}
              repo_rev={repoRev}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;

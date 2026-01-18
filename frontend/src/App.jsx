import React, { useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import CollapsibleSection from "./CollapsibleSection";
import Schedule from "./Schedule";
import NewExperiment from "./NewExperiment";
import ExperimentSubmission from "./ExperimentSubmission";
import MobileNavigation from "./MobileNavigation";

function App() {
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [repoRev, setRepoRev] = useState(null);
  const [currentPage, setCurrentPage] = useState("schedule"); // For mobile navigation

  const handleSelect = (experiment, rev) => {
    setSelectedExperiment(experiment);
    setRepoRev(rev);
    // On mobile, automatically switch to configure page when experiment is selected
    setCurrentPage("configure");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="app-container">
      <Container fluid className="p-3 p-md-4">
        <h1 className="mb-4">ARTIQ HTTP interface</h1>

        {/* Running Section */}
        <Row
          className={`pt-2 page-section ${
            currentPage === "running" ? "active" : ""
          }`}
        >
          <Col>
            <CollapsibleSection title="Running">
              <Schedule />
            </CollapsibleSection>
          </Col>
        </Row>

        {/* Schedule New Section */}
        <Row
          className={`pt-2 page-section ${
            currentPage === "schedule" ? "active" : ""
          }`}
        >
          <Col>
            <CollapsibleSection title="Schedule new">
              <NewExperiment
                onSelect={handleSelect}
                selectedExperiment={selectedExperiment}
              />
            </CollapsibleSection>
          </Col>
        </Row>

        {/* Configure Submission Section */}
        <Row
          className={`pt-2 page-section ${
            currentPage === "configure" ? "active" : ""
          }`}
        >
          <Col>
            <ExperimentSubmission
              experiment={selectedExperiment}
              repo_rev={repoRev}
            />
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

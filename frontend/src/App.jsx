import React, { useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import CollapsibleSection from "./CollapsibleSection";
import Schedule from "./Schedule";
import NewExperiment from "./NewExperiment";
import ExperimentSubmission from "./ExperimentSubmission";

function App() {
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [repoRev, setRepoRev] = useState(null);

  const handleSelect = (experiment, rev) => {
    setSelectedExperiment(experiment);
    setRepoRev(rev);
  };

  return (
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
  );
}

export default App;

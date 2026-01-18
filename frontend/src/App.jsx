import React from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Schedule from "./Schedule";
import NewExperiment from "./NewExperiment";

export default () => (
  <Container fluid className="p-3 p-md-4">
    <h1 className="mb-4">ARTIQ HTTP interface</h1>

    <Row className="pt-4">
      <h2 className="pb-2">Running</h2>
      <Col>
        <Schedule />
      </Col>
    </Row>
    <Row className="pt-4">
      <h2 className="pb-2">Schedule new</h2>
      <Col>
        <NewExperiment />
      </Col>
    </Row>
  </Container>
);

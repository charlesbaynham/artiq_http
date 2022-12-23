import React from "react";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Schedule from "./Schedule";

export default () => (
  <Container className="p-4">
    <h1>ARTIQ HTTP interface</h1>

    <Row className="pt-4">
      <h2 className="pb-2">Schedule</h2>
      <Col>

        <Schedule />
      </Col>
    </Row>
  </Container>

);

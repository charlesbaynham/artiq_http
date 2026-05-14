import React from "react";
import { toDisplayValue, fromDisplayValue } from "./api/ndscan";

import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";

function ScanConfiguration({ scan, schemata, onChange }) {
  const {
    axes = [],
    num_repeats = 1,
    no_axes_mode = "single",
    randomise_order_globally = false,
    skip_on_persistent_transitory_error = false,
  } = scan;

  // Get scannable parameters (filter by is_scannable flag)
  const scannableParams = React.useMemo(() => {
    if (!schemata) return [];
    return Object.values(schemata).filter(
      (schema) => schema.spec && schema.spec.is_scannable,
    );
  }, [schemata]);

  // Get already scanned FQNs
  const scannedFqns = new Set(axes.map((axis) => axis.fqn).filter(Boolean));

  // Handle changes to axes
  const handleAddAxis = () => {
    const newAxis = {
      fqn: "",
      path: "",
      type: "linear",
      range: {
        start: 0,
        stop: 100,
        num_points: 11,
        randomise_order: false,
      },
    };
    onChange({ ...scan, axes: [...axes, newAxis] });
  };

  const handleRemoveAxis = (index) => {
    const newAxes = axes.filter((_, i) => i !== index);
    onChange({ ...scan, axes: newAxes });
  };

  const handleAxisChange = (index, field, value) => {
    const newAxes = [...axes];
    if (field === "fqn") {
      // When FQN changes, update path and get default range from schema
      const schema = schemata[value];
      newAxes[index] = {
        ...newAxes[index],
        fqn: value,
        path: schema ? buildPathForFqn(value) : "",
      };
    } else if (field.startsWith("range.")) {
      const rangeField = field.split(".")[1];
      newAxes[index] = {
        ...newAxes[index],
        range: {
          ...newAxes[index].range,
          [rangeField]: value,
        },
      };
    } else {
      newAxes[index] = {
        ...newAxes[index],
        [field]: value,
      };
    }
    onChange({ ...scan, axes: newAxes });
  };

  // Helper to build path from FQN (use first match from instances)
  const buildPathForFqn = (fqn) => {
    // This will be passed from parent component
    return "";
  };

  // Handle global settings changes
  const handleNumRepeatsChange = (value) => {
    onChange({ ...scan, num_repeats: value });
  };

  const handleInfiniteToggle = (checked) => {
    const value = checked ? 2147483647 : 1;
    onChange({ ...scan, num_repeats: value });
  };

  const handleNoAxesModeChange = (value) => {
    onChange({ ...scan, no_axes_mode: value });
  };

  const handleRandomiseGloballyChange = (checked) => {
    onChange({ ...scan, randomise_order_globally: checked });
  };

  const handleSkipOnErrorChange = (checked) => {
    onChange({ ...scan, skip_on_persistent_transitory_error: checked });
  };

  // Calculate total scan points
  const totalPoints = React.useMemo(() => {
    if (axes.length === 0) return num_repeats;
    return (
      axes.reduce((total, axis) => {
        const points = axis.range?.num_points || 1;
        return total * points;
      }, 1) * num_repeats
    );
  }, [axes, num_repeats]);

  const isInfinite = num_repeats === 2147483647;

  return (
    <Card className="mb-3">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>Scan Configuration</span>
        <Badge bg={axes.length === 0 ? "secondary" : "primary"}>
          {axes.length}D scan, {isInfinite ? "∞" : totalPoints} points
        </Badge>
      </Card.Header>
      <Card.Body>
        {/* Scan Axes */}
        <h6>Scan Axes</h6>
        {axes.length === 0 ? (
          <p className="text-muted small">
            No scan axes defined. Click "Add Scan Axis" to create one.
          </p>
        ) : (
          axes.map((axis, index) => {
            const schema = axis.fqn ? schemata[axis.fqn] : null;
            const unit = schema?.spec?.unit || "";
            const scale = schema?.spec?.scale || 1;

            // Apply scale for display (divide by scale to convert to display units)
            const displayStart = toDisplayValue(axis.range?.start, scale);
            const displayStop = toDisplayValue(axis.range?.stop, scale);

            return (
              <Card key={index} className="mb-2">
                <Card.Body className="py-2 px-3">
                  <Row className="mb-2">
                    <Col>
                      <Form.Label className="mb-1 small">Parameter</Form.Label>
                      <Form.Select
                        size="sm"
                        value={axis.fqn || ""}
                        onChange={(e) =>
                          handleAxisChange(index, "fqn", e.target.value)
                        }
                      >
                        <option value="">Select parameter...</option>
                        {scannableParams.map((param) => (
                          <option
                            key={param.fqn}
                            value={param.fqn}
                            disabled={
                              scannedFqns.has(param.fqn) &&
                              axis.fqn !== param.fqn
                            }
                          >
                            {param.description || param.fqn}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col xs="auto" className="d-flex align-items-end">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveAxis(index)}
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                  <Row className="g-2">
                    <Col>
                      <Form.Label className="mb-1 small">Start</Form.Label>
                      <InputGroup size="sm">
                        <Form.Control
                          type="number"
                          value={displayStart}
                          onChange={(e) => {
                            const rawValue = fromDisplayValue(
                              e.target.value,
                              scale,
                            );
                            handleAxisChange(index, "range.start", rawValue);
                          }}
                          step="any"
                        />
                        {unit && <InputGroup.Text>{unit}</InputGroup.Text>}
                      </InputGroup>
                    </Col>
                    <Col>
                      <Form.Label className="mb-1 small">Stop</Form.Label>
                      <InputGroup size="sm">
                        <Form.Control
                          type="number"
                          value={displayStop}
                          onChange={(e) => {
                            const rawValue = fromDisplayValue(
                              e.target.value,
                              scale,
                            );
                            handleAxisChange(index, "range.stop", rawValue);
                          }}
                          step="any"
                        />
                        {unit && <InputGroup.Text>{unit}</InputGroup.Text>}
                      </InputGroup>
                    </Col>
                    <Col>
                      <Form.Label className="mb-1 small">Points</Form.Label>
                      <Form.Control
                        type="number"
                        size="sm"
                        value={axis.range?.num_points || 11}
                        onChange={(e) =>
                          handleAxisChange(
                            index,
                            "range.num_points",
                            parseInt(e.target.value),
                          )
                        }
                        min="1"
                        step="1"
                      />
                    </Col>
                  </Row>
                  <Form.Check
                    type="checkbox"
                    className="mt-2"
                    label="Randomize order (this axis)"
                    checked={axis.range?.randomise_order || false}
                    onChange={(e) =>
                      handleAxisChange(
                        index,
                        "range.randomise_order",
                        e.target.checked,
                      )
                    }
                  />
                </Card.Body>
              </Card>
            );
          })
        )}
        <Button
          variant="outline-primary"
          size="sm"
          onClick={handleAddAxis}
          className="mb-3"
        >
          + Add Scan Axis
        </Button>

        {/* Global Settings */}
        <h6 className="mt-3">Global Settings</h6>
        <Row className="g-2 mb-2">
          <Col md={6}>
            <Form.Label className="mb-1 small">Number of Repeats</Form.Label>
            <InputGroup size="sm">
              <Form.Control
                type="number"
                value={isInfinite ? "" : num_repeats}
                onChange={(e) =>
                  handleNumRepeatsChange(parseInt(e.target.value) || 1)
                }
                min="1"
                step="1"
                disabled={isInfinite}
                placeholder={isInfinite ? "Infinite" : ""}
              />
              <InputGroup.Checkbox
                checked={isInfinite}
                onChange={(e) => handleInfiniteToggle(e.target.checked)}
              />
              <InputGroup.Text>Infinite</InputGroup.Text>
            </InputGroup>
          </Col>
          <Col md={6}>
            <Form.Label className="mb-1 small">No-Axes Mode</Form.Label>
            <Form.Select
              size="sm"
              value={no_axes_mode}
              onChange={(e) => handleNoAxesModeChange(e.target.value)}
            >
              <option value="single">Single (run once)</option>
              <option value="repeat">Repeat (save only last)</option>
              <option value="time_series">
                Time series (save all, with timestamps)
              </option>
            </Form.Select>
          </Col>
        </Row>
        <Form.Check
          type="checkbox"
          label="Randomize order globally"
          checked={randomise_order_globally}
          onChange={(e) => handleRandomiseGloballyChange(e.target.checked)}
          className="mb-1"
        />
        <Form.Check
          type="checkbox"
          label="Skip on persistent/transitory error"
          checked={skip_on_persistent_transitory_error}
          onChange={(e) => handleSkipOnErrorChange(e.target.checked)}
        />
      </Card.Body>
    </Card>
  );
}

export default ScanConfiguration;

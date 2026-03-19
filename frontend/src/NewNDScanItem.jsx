import React from "react";

import Accordion from "react-bootstrap/Accordion";
import Table from "react-bootstrap/Table";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import SubmitNewButton from "./SubmitNewButton";
import {
  NDScanFloatInput,
  NDScanIntInput,
  NDScanBoolInput,
} from "./ArgumentInputs";
import ScanConfiguration from "./ScanConfiguration";

import {
  parseNdscanParams,
  buildFqnToPathMap,
  getScannedFqns,
  loadNdscanState,
  saveNdscanState,
  formatNdscanSubmission,
  getStorageKey,
} from "./api/ndscan";
import { loadExperimentState, saveExperimentState } from "./api/experiments";

function NewNDScanItem(props) {
  const name = props.data.name;
  const file = props.data.file;
  const class_name = props.data.class_name;
  const arginfo = props.data.arginfo;
  const repo_rev = props.repo_rev;

  // Parse ndscan params
  const ndscanParams = React.useMemo(
    () => parseNdscanParams(arginfo),
    [arginfo],
  );
  const allParams = ndscanParams.schemata;

  // State for ndscan experiments
  const [ndscanOverrides, setNdscanOverrides] = React.useState({});
  const [ndscanScan, setNdscanScan] = React.useState(null);
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  // State for visible parameters
  const [visibleFqns, setVisibleFqns] = React.useState(new Set());
  const [useDefaultVisibility, setUseDefaultVisibility] = React.useState(true);
  const [paramSearchTerm, setParamSearchTerm] = React.useState("");

  // Toast state for error messages
  const [showError, setShowError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [pipeline, setPipeline] = React.useState(() => {
    const stored = loadExperimentState(file, class_name);
    return stored ? stored.pipeline : "main";
  });

  // Helper functions for managing visible FQNs
  const addFQNToVisibleParams = (fqn) => {
    setVisibleFqns((prev) => new Set([...prev, fqn]));
  };

  const removeFQNFromVisibleParams = (fqn) => {
    setVisibleFqns((prev) => {
      const next = new Set(prev);
      next.delete(fqn);
      return next;
    });
  };

  // Initialize ndscan state from localStorage or defaults
  React.useEffect(() => {
    if (ndscanParams) {
      const stored = loadNdscanState(file, class_name);

      // Initialize visibility
      const getAlwayscombinedFQNs = () => {
        return (ndscanParams.always_shown || []).map((item) => {
          if (item && item.__jsonclass__ && item.__jsonclass__[0] === "tuple") {
            return item.__jsonclass__[1][0][0];
          } else {
            console.error("Unexpected always_shown item format:", item);
            return "";
          }
        });
      };

      const alwaysShown = getAlwayscombinedFQNs();

      if (stored && stored.visibleFqns) {
        setVisibleFqns(new Set(stored.visibleFqns));
      } else {
        setVisibleFqns(new Set());
      }

      if (stored) {
        setNdscanOverrides(stored.overrides || {});
        setNdscanScan(stored.scan || ndscanParams.scan);
      } else {
        setNdscanOverrides({});
        setNdscanScan(ndscanParams.scan);
      }
    }
  }, [ndscanParams, file, class_name]);

  // Save ndscan state to localStorage when it changes
  React.useEffect(() => {
    if (ndscanScan) {
      saveNdscanState(file, class_name, {
        overrides: ndscanOverrides,
        scan: ndscanScan,
        visibleFqns: [...visibleFqns],
        useDefaultVisibility,
      });
      // Also save pipeline state using the general helper
      saveExperimentState(file, class_name, { pipeline });
    }
  }, [
    ndscanOverrides,
    ndscanScan,
    file,
    class_name,
    visibleFqns,
    useDefaultVisibility,
    pipeline,
  ]);

  // Build FQN to path mapping for ndscan
  const fqnToPath = React.useMemo(() => {
    if (!ndscanParams) return {};
    return buildFqnToPathMap(ndscanParams.instances);
  }, [ndscanParams]);

  // Get scanned FQNs
  const scannedFqns = React.useMemo(() => {
    if (!ndscanScan) return new Set();
    return getScannedFqns(ndscanScan);
  }, [ndscanScan]);

  // Handle ndscan parameter override change
  const handleNdscanOverrideChange = (fqn, value) => {
    setNdscanOverrides((prev) => ({ ...prev, [fqn]: value }));
  };

  // Reset ndscan parameter to default (remove from overrides)
  const handleNdscanOverrideReset = (fqn) => {
    setNdscanOverrides((prev) => {
      const newOverrides = { ...prev };
      delete newOverrides[fqn];
      return newOverrides;
    });
  };

  // Handle scan configuration change
  const handleScanChange = (newScan) => {
    setNdscanScan(newScan);
  };

  // Reset ndscan to defaults
  const handleNdscanResetAll = () => {
    if (ndscanParams) {
      setNdscanOverrides({});
      setNdscanScan(ndscanParams.scan);
      localStorage.removeItem(getStorageKey(file, class_name));
    }
  };

  // Handle submission error
  const handleError = (message) => {
    setErrorMessage(message);
    setShowError(true);
  };

  const table_row = (rowName, entry) => (
    <tr key={rowName}>
      <td>
        <b>{rowName}:</b>
      </td>
      <td>{entry}</td>
    </tr>
  );

  // Render NDScan parameter row
  const renderNdscanParam = (fqn, schema) => {
    const { description, type } = schema;
    const isScanned = scannedFqns.has(fqn);
    const value = ndscanOverrides[fqn];

    let InputComponent;
    if (type === "float") {
      InputComponent = NDScanFloatInput;
    } else if (type === "int") {
      InputComponent = NDScanIntInput;
    } else if (type === "bool") {
      InputComponent = NDScanBoolInput;
    } else {
      return null; // Unknown type
    }

    return (
      <Form.Group key={fqn} className="mb-2 row align-items-center">
        <div className="col-4">
          <Form.Label className="mb-0" style={{ fontWeight: 500 }}>
            {description || fqn}
          </Form.Label>
        </div>
        <div className="col-8">
          <InputComponent
            schema={schema}
            value={value}
            onChange={handleNdscanOverrideChange}
            onReset={handleNdscanOverrideReset}
            disabled={isScanned}
          />
        </div>
      </Form.Group>
    );
  };

  // Build arguments for submission
  const getSubmissionArguments = () => {
    if (ndscanParams) {
      // Validate: no overlap between overrides and scan axes
      const overrideFqns = new Set(Object.keys(ndscanOverrides));
      const overlap = [...scannedFqns].filter((fqn) => overrideFqns.has(fqn));
      if (overlap.length > 0) {
        handleError(
          `Parameters cannot be both overridden and scanned: ${overlap.join(
            ", ",
          )}`,
        );
        return null;
      }

      return formatNdscanSubmission(
        ndscanParams,
        ndscanOverrides,
        ndscanScan,
        fqnToPath,
        visibleFqns,
      );
    }
    return {};
  };

  if (!ndscanParams) {
    return null;
  }

  // Combine selected parameters + always shown parameters
  const alwaysShownFQNs = (ndscanParams.always_shown || []).map((item) => {
    if (Array.isArray(item)) {
      return item[0];
    }
    if (item && item.__jsonclass__ && item.__jsonclass__[0] === "tuple") {
      return item.__jsonclass__[1][0][0];
    }
    return item;
  });

  // Construct filtered parameters for display
  // If useDefaultVisibility is true, include always shown params
  // Add all the parameters that have been manually selected and added to visibleFqns
  const combinedFQNs = new Set([
    ...(useDefaultVisibility ? alwaysShownFQNs : []),
    ...visibleFqns,
  ]);

  // Parameters matching the search term (for the search dropdown)
  const searchResults = paramSearchTerm
    ? Object.entries(allParams).filter(([fqn, schema]) => {
        return (
          fqn.toLowerCase().includes(paramSearchTerm.toLowerCase()) ||
          (schema.description &&
            schema.description
              .toLowerCase()
              .includes(paramSearchTerm.toLowerCase()))
        );
      })
    : [];

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-primary text-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            {class_name}{" "}
            <span
              className="badge bg-info ms-2 small"
              style={{ fontSize: "0.6em" }}
            >
              NDScan
            </span>
          </h5>
          <small className="opacity-75">{file}</small>
        </div>
      </Card.Header>
      <Card.Body className="p-4">
        <Table striped bordered hover size="sm" className="mb-4">
          <tbody>
            {table_row("Name", name)}
            {table_row("Class name", class_name)}
            {table_row("File", file)}
          </tbody>
        </Table>

        {/* NDScan experiment parameters */}
        <div className="mt-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">NDScan Parameters</h6>
            <Form.Check
              type="switch"
              label="Use Always Shown defaults"
              checked={useDefaultVisibility}
              onChange={(e) => {
                setUseDefaultVisibility(e.target.checked);
              }}
              size="sm"
              className="small"
            />
          </div>

          {/* Parameter Visibility Manager */}
          <Card className="mb-3 parameter-adder">
            <Card.Body className="p-2">
              <Form.Label className="small fw-bold">
                Add / Toggle Parameters
              </Form.Label>
              <InputGroup size="sm" className="mb-2">
                <InputGroup.Text>🔍</InputGroup.Text>
                <Form.Control
                  placeholder="Search available parameters by FQN or Description..."
                  value={paramSearchTerm}
                  onChange={(e) => setParamSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setParamSearchTerm("");
                    }
                  }}
                />
              </InputGroup>

              <div
                className="overflow-auto"
                style={{
                  maxHeight: "300px",
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                }}
              >
                {(() => {
                  // If search term is active, show flat filtered list
                  if (paramSearchTerm) {
                    if (searchResults.length === 0) {
                      return (
                        <div className="p-2 text-center text-muted small">
                          No parameters found
                        </div>
                      );
                    }

                    return searchResults.map(([fqn, schema]) => (
                      <div
                        key={fqn}
                        className="p-1 px-2 d-flex justify-content-between align-items-center border-bottom small ndscan-param-row"
                        style={{
                          backgroundColor: visibleFqns.has(fqn)
                            ? "#e7f1ff"
                            : "transparent",
                        }}
                        onClick={() => {
                          // On mobile, clicking anywhere toggles visibility
                          if (window.innerWidth < 768) {
                            if (visibleFqns.has(fqn)) {
                              removeFQNFromVisibleParams(fqn);
                            } else {
                              addFQNToVisibleParams(fqn);
                            }
                          }
                        }}
                      >
                        <div
                          className="text-truncate"
                          style={{ maxWidth: "70%" }}
                        >
                          <strong>{fqn}</strong>
                          <br />
                          <span className="text-muted">
                            {schema.description}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant={
                            visibleFqns.has(fqn)
                              ? "outline-danger"
                              : "outline-primary"
                          }
                          onClick={(e) => {
                            // Prevent double-firing on mobile
                            e.stopPropagation();
                            if (visibleFqns.has(fqn)) {
                              removeFQNFromVisibleParams(fqn);
                            } else {
                              addFQNToVisibleParams(fqn);
                            }
                          }}
                          style={{ padding: "0 0.5rem" }}
                          className="desktop-only"
                        >
                          {visibleFqns.has(fqn) ? "Hide" : "Show"}
                        </Button>
                      </div>
                    ));
                  } else {
                    // No search term - organize by FQN into folders
                    const folderMap = {};
                    console.log(allParams);

                    Object.entries(allParams).forEach(([fqn, schema]) => {
                      const parts = fqn.split(".");
                      const folderName =
                        parts.length > 1
                          ? parts.slice(0, -1).join(".")
                          : "Root";
                      if (!folderMap[folderName]) {
                        folderMap[folderName] = [];
                      }
                      folderMap[folderName].push([fqn, schema]);
                    });

                    return (
                      <Accordion flush>
                        {Object.entries(folderMap)
                          .sort(([a], [b]) => a.localeCompare(b))
                          .map(([folderName, params]) => (
                            <Accordion.Item
                              key={folderName}
                              eventKey={folderName}
                            >
                              <Accordion.Header className="py-1">
                                <small className="fw-bold">{folderName}</small>
                                <small className="text-muted ms-2">
                                  ({params.length})
                                </small>
                              </Accordion.Header>
                              <Accordion.Body className="p-0">
                                {params.map(([fqn, schema]) => (
                                  <div
                                    key={fqn}
                                    className="p-1 px-2 d-flex justify-content-between align-items-center border-bottom small ndscan-param-row"
                                    style={{
                                      backgroundColor: visibleFqns.has(fqn)
                                        ? "#e7f1ff"
                                        : "transparent",
                                    }}
                                    onClick={() => {
                                      // On mobile, clicking anywhere toggles visibility
                                      if (window.innerWidth < 768) {
                                        if (visibleFqns.has(fqn)) {
                                          removeFQNFromVisibleParams(fqn);
                                        } else {
                                          addFQNToVisibleParams(fqn);
                                        }
                                      }
                                    }}
                                  >
                                    <div
                                      className="text-truncate"
                                      style={{ maxWidth: "70%" }}
                                    >
                                      <strong>{fqn.split(".").pop()}</strong>
                                      <br />
                                      <span className="text-muted">
                                        {schema.description}
                                      </span>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant={
                                        visibleFqns.has(fqn)
                                          ? "outline-danger"
                                          : "outline-primary"
                                      }
                                      onClick={(e) => {
                                        // Prevent double-firing on mobile
                                        e.stopPropagation();
                                        if (visibleFqns.has(fqn)) {
                                          removeFQNFromVisibleParams(fqn);
                                        } else {
                                          addFQNToVisibleParams(fqn);
                                        }
                                      }}
                                      style={{ padding: "0 0.5rem" }}
                                      className="desktop-only"
                                    >
                                      {visibleFqns.has(fqn) ? "Hide" : "Show"}
                                    </Button>
                                  </div>
                                ))}
                              </Accordion.Body>
                            </Accordion.Item>
                          ))}
                      </Accordion>
                    );
                  }
                })()}
              </div>
            </Card.Body>
          </Card>

          {/* Display Visible Parameters */}
          {combinedFQNs.size === 0 && (
            <div className="text-center p-3 border rounded bg-secondary bg-opacity-25 text-muted small mb-3">
              No parameters are currently visible. Use the search above to add
              parameters.
            </div>
          )}

          {combinedFQNs.size > 0 &&
            Array.from(combinedFQNs).map((fqn) => {
              const schema = allParams[fqn];
              if (!schema) return null;

              return (
                <div
                  key={fqn}
                  className="ndscan-param-row border-bottom py-2 px-1 d-flex align-items-start"
                >
                  <div className="flex-grow-1">
                    {renderNdscanParam(fqn, schema)}
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-muted p-0 ms-2"
                    onClick={() => removeFQNFromVisibleParams(fqn)}
                    title="Hide parameter"
                  >
                    ✕
                  </Button>
                </div>
              );
            })}

          {/* Scan Configuration */}
          {ndscanScan && (
            <ScanConfiguration
              scan={ndscanScan}
              schemata={allParams}
              onChange={handleScanChange}
            />
          )}

          <Button
            variant="outline-secondary"
            size="sm"
            onClick={handleNdscanResetAll}
            className="mb-3"
          >
            Reset All to Defaults
          </Button>
        </div>

        <Form.Group className="mt-3 mb-2">
          <Form.Label>Pipeline</Form.Label>
          <Form.Control
            type="text"
            value={pipeline}
            onChange={(e) => setPipeline(e.target.value)}
            placeholder="main"
          />
          <Form.Text className="text-muted">
            Specify which pipeline to submit to (default: main)
          </Form.Text>
        </Form.Group>

        <div className="d-grid mt-4">
          <SubmitNewButton
            file={file}
            class_name={class_name}
            repo_rev={repo_rev}
            arguments={getSubmissionArguments()}
            pipeline={pipeline}
            onError={handleError}
            className="btn-lg"
          />
        </div>

        {/* Error Toast */}
        <ToastContainer position="bottom-end" className="p-3">
          <Toast
            show={showError}
            onClose={() => setShowError(false)}
            delay={5000}
            autohide
            bg="danger"
          >
            <Toast.Header>
              <strong className="me-auto">Submission Error</strong>
            </Toast.Header>
            <Toast.Body className="text-white">{errorMessage}</Toast.Body>
          </Toast>
        </ToastContainer>
      </Card.Body>
    </Card>
  );
}

export default NewNDScanItem;

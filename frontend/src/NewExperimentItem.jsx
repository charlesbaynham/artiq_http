import React from "react";

import Accordion from "react-bootstrap/Accordion";
import Table from "react-bootstrap/Table";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Form from "react-bootstrap/Form";

import SubmitNewButton from "./SubmitNewButton";
import { ArgumentRow } from "./ArgumentInputs";
import {
  getDefaultValues,
  groupArguments,
  loadExperimentState,
  saveExperimentState,
} from "./api/experiments";

function NewExperimentItem(props) {
  const name = props.data.name;
  const file = props.data.file;
  const class_name = props.data.class_name;
  const arginfo = props.data.arginfo;
  const repo_rev = props.repo_rev;

  // Get default values
  const defaultValues = React.useMemo(
    () => getDefaultValues(arginfo),
    [arginfo],
  );

  // Load initial state from localStorage or defaults
  const [argValues, setArgValues] = React.useState(() => {
    const stored = loadExperimentState(file, class_name);
    return stored?.argValues ?? defaultValues;
  });
  const [pipeline, setPipeline] = React.useState(() => {
    const stored = loadExperimentState(file, class_name);
    return stored?.pipeline ?? "main";
  });
  const [priority, setPriority] = React.useState(() => {
    const stored = loadExperimentState(file, class_name);
    return stored?.priority ?? 0;
  });

  // Toast state for error messages
  const [showError, setShowError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  // Save to localStorage when state changes
  React.useEffect(() => {
    saveExperimentState(file, class_name, { argValues, pipeline, priority });
  }, [file, class_name, argValues, pipeline, priority]);

  // Group arguments for display
  const groupedArgs = React.useMemo(() => groupArguments(arginfo), [arginfo]);
  const hasArguments = arginfo && Object.keys(arginfo).length > 0;

  // Handle argument value change
  const handleArgChange = (argName, value) => {
    setArgValues((prev) => ({ ...prev, [argName]: value }));
  };

  // Reset single argument to default
  const handleResetArg = (argName) => {
    setArgValues((prev) => ({ ...prev, [argName]: defaultValues[argName] }));
  };

  // Reset all arguments to defaults
  const handleResetAll = () => {
    setArgValues(defaultValues);
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

  // Build arguments for submission
  const getSubmissionArguments = () => {
    return argValues;
  };

  return (
    <Card className="submission-card">
      <Card.Header className="submission-card__header">
        <div className="submission-card__head-meta">
          <span className="submission-card__class">{class_name}</span>
          <span className="submission-card__file">{file}</span>
        </div>
      </Card.Header>
      <Card.Body className="submission-card__body">
        <Table className="schedule-detail-table mb-4">
          <tbody>
            {table_row("Name", name)}
            {table_row("Class", class_name)}
            {table_row("File", file)}
          </tbody>
        </Table>

        {/* Regular experiment arguments */}
        {hasArguments && (
          <div className="submission-args">
            <div className="submission-args__head">
              <h6 className="submission-args__title">Arguments</h6>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleResetAll}
              >
                Reset to defaults
              </Button>
            </div>
            {Object.entries(groupedArgs).map(([groupName, args]) => (
              <div key={groupName} className="arg-group">
                <div className="arg-group__title">{groupName}</div>
                <div className="arg-group__body">
                  {args.map(({ name: argName, argData }) => (
                    <ArgumentRow
                      key={argName}
                      name={argName}
                      argInfo={argData}
                      value={argValues[argName]}
                      onChange={handleArgChange}
                      onReset={handleResetArg}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <Form.Group className="mt-4 mb-3">
          <Form.Label>Pipeline</Form.Label>
          <Form.Control
            type="text"
            value={pipeline}
            onChange={(e) => setPipeline(e.target.value)}
            placeholder="main"
          />
          <Form.Text>
            Specify which pipeline to submit to (default: main)
          </Form.Text>
        </Form.Group>

        <Form.Group className="mt-3 mb-3">
          <Form.Label>Priority</Form.Label>
          <Form.Control
            type="number"
            step="1"
            value={priority}
            onChange={(e) => {
              const v = e.target.value;
              setPriority(v === "" ? 0 : parseInt(v, 10));
            }}
            placeholder="0"
          />
          <Form.Text>
            Higher values run sooner. Can be negative. Default: 0.
          </Form.Text>
        </Form.Group>

        <div className="d-grid mt-4">
          <SubmitNewButton
            file={file}
            class_name={class_name}
            repo_rev={repo_rev}
            arguments={getSubmissionArguments()}
            pipeline={pipeline}
            priority={priority}
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

export default NewExperimentItem;

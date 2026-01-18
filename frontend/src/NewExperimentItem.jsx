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
    return stored ? stored.argValues : defaultValues;
  });
  const [pipeline, setPipeline] = React.useState(() => {
    const stored = loadExperimentState(file, class_name);
    return stored ? stored.pipeline : "main";
  });

  // Toast state for error messages
  const [showError, setShowError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  // Save to localStorage when state changes
  React.useEffect(() => {
    saveExperimentState(file, class_name, { argValues, pipeline });
  }, [file, class_name, argValues, pipeline]);

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
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-primary text-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{class_name}</h5>
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

        {/* Regular experiment arguments */}
        {hasArguments && (
          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0 fw-bold">Arguments</h6>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleResetAll}
              >
                Reset All to Defaults
              </Button>
            </div>
            {Object.entries(groupedArgs).map(([groupName, args]) => (
              <Card
                key={groupName}
                className="mb-3 border-light shadow-none bg-light bg-opacity-10"
              >
                <Card.Header
                  className="py-2 px-3 bg-light"
                  style={{ fontSize: "0.9em", fontWeight: 600 }}
                >
                  {groupName}
                </Card.Header>
                <Card.Body className="py-3 px-3">
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
                </Card.Body>
              </Card>
            ))}
          </div>
        )}

        <Form.Group className="mt-4 mb-3">
          <Form.Label className="fw-bold">Pipeline</Form.Label>
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

export default NewExperimentItem;

import React from "react";

import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

import SubmitNewButton from "./SubmitNewButton";
import { ArgumentRow } from "./ArgumentInputs";

// Check if experiment has ndscan_params argument (skip these for now)
function hasNdscanParams(arginfo) {
    // FIXME: don't skip ndscan experiments
    return arginfo && Object.keys(arginfo).includes('ndscan_params');
}

// Extract default values from arginfo
function getDefaultValues(arginfo) {
    const defaults = {};
    if (!arginfo) return defaults;

    for (const [argName, argData] of Object.entries(arginfo)) {
        const [spec] = argData;
        if (spec && spec.default !== undefined) {
            defaults[argName] = spec.default;
        }
    }
    return defaults;
}

// Group arguments by their group property
function groupArguments(arginfo) {
    const groups = {};
    if (!arginfo) return groups;

    for (const [argName, argData] of Object.entries(arginfo)) {
        const [spec, group] = argData;
        const groupName = group || 'General';

        if (!groups[groupName]) {
            groups[groupName] = [];
        }
        groups[groupName].push({ name: argName, argData });
    }
    return groups;
}

function NewExperimentItem(props) {
    const name = props.data.name;
    const file = props.data.file;
    const class_name = props.data.class_name;
    const arginfo = props.data.arginfo;
    const repo_rev = props.repo_rev;

    // Skip ndscan experiments
    const isNdscan = hasNdscanParams(arginfo);

    // Get default values and initialize state
    const defaultValues = React.useMemo(() => getDefaultValues(arginfo), [arginfo]);
    const [argValues, setArgValues] = React.useState(() => getDefaultValues(arginfo));

    // Toast state for error messages
    const [showError, setShowError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    // Group arguments for display
    const groupedArgs = React.useMemo(() => groupArguments(arginfo), [arginfo]);
    const hasArguments = arginfo && Object.keys(arginfo).length > 0;

    // Handle argument value change
    const handleArgChange = (argName, value) => {
        setArgValues(prev => ({ ...prev, [argName]: value }));
    };

    // Reset single argument to default
    const handleResetArg = (argName) => {
        setArgValues(prev => ({ ...prev, [argName]: defaultValues[argName] }));
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
            <td><b>{rowName}:</b></td>
            <td>{entry}</td>
        </tr>
    );

    // Don't render ndscan experiments for now
    if (isNdscan) {
        return null;
    }

    return (
        <Accordion.Item eventKey={class_name}>
            <Accordion.Header>{class_name} &emsp; <em>{file}</em></Accordion.Header>
            <Accordion.Body>
                <Table striped bordered hover size="sm">
                    <tbody>
                        {table_row("Name", name)}
                        {table_row("Class name", class_name)}
                        {table_row("File", file)}
                    </tbody>
                </Table>

                {hasArguments && (
                    <div className="mt-3">
                        <h6>Arguments</h6>
                        {Object.entries(groupedArgs).map(([groupName, args]) => (
                            <Card key={groupName} className="mb-2">
                                <Card.Header className="py-1 px-2" style={{ fontSize: '0.9em' }}>
                                    {groupName}
                                </Card.Header>
                                <Card.Body className="py-2 px-3">
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
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={handleResetAll}
                            className="mb-3"
                        >
                            Reset All to Defaults
                        </Button>
                    </div>
                )}

                <ButtonGroup className="mt-3">
                    <SubmitNewButton
                        file={file}
                        class_name={class_name}
                        repo_rev={repo_rev}
                        arguments={argValues}
                        onError={handleError}
                    />
                </ButtonGroup>

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
            </Accordion.Body>
        </Accordion.Item>
    );
}

export default NewExperimentItem;

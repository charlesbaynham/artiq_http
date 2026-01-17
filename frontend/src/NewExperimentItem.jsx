import React from "react";

import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Form from 'react-bootstrap/Form';

import SubmitNewButton from "./SubmitNewButton";
import { ArgumentRow, NDScanFloatInput, NDScanIntInput, NDScanBoolInput } from "./ArgumentInputs";
import ScanConfiguration from "./ScanConfiguration";

import {
    hasNdscanParams,
    parseNdscanParams,
    buildFqnToPathMap,
    getScannedFqns,
    loadNdscanState,
    saveNdscanState,
    formatNdscanSubmission
} from "./api/ndscan";
import { getDefaultValues, groupArguments } from "./api/experiments";

function NewExperimentItem(props) {
    const name = props.data.name;
    const file = props.data.file;
    const class_name = props.data.class_name;
    const arginfo = props.data.arginfo;
    const repo_rev = props.repo_rev;

    // Check if this is an ndscan experiment
    const isNdscan = hasNdscanParams(arginfo);

    // Parse ndscan params if present
    const ndscanParams = React.useMemo(() => isNdscan ? parseNdscanParams(arginfo) : null, [arginfo, isNdscan]);

    // For regular experiments, get default values
    const defaultValues = React.useMemo(() => !isNdscan ? getDefaultValues(arginfo) : {}, [arginfo, isNdscan]);

    // State for regular experiments
    const [argValues, setArgValues] = React.useState(() => !isNdscan ? getDefaultValues(arginfo) : {});

    // State for ndscan experiments
    const [ndscanOverrides, setNdscanOverrides] = React.useState({});
    const [ndscanScan, setNdscanScan] = React.useState(null);
    const [showAdvanced, setShowAdvanced] = React.useState(false);

    // Initialize ndscan state from localStorage or defaults
    React.useEffect(() => {
        if (isNdscan && ndscanParams) {
            const stored = loadNdscanState(file, class_name);
            if (stored) {
                setNdscanOverrides(stored.overrides || {});
                setNdscanScan(stored.scan || ndscanParams.scan);
            } else {
                setNdscanOverrides({});
                setNdscanScan(ndscanParams.scan);
            }
        }
    }, [isNdscan, ndscanParams, file, class_name]);

    // Save ndscan state to localStorage when it changes
    React.useEffect(() => {
        if (isNdscan && ndscanScan) {
            saveNdscanState(file, class_name, {
                overrides: ndscanOverrides,
                scan: ndscanScan
            });
        }
    }, [isNdscan, ndscanOverrides, ndscanScan, file, class_name]);

    // Build FQN to path mapping for ndscan
    const fqnToPath = React.useMemo(() => {
        if (!isNdscan || !ndscanParams) return {};
        return buildFqnToPathMap(ndscanParams.instances);
    }, [isNdscan, ndscanParams]);

    // Get scanned FQNs
    const scannedFqns = React.useMemo(() => {
        if (!isNdscan || !ndscanScan) return new Set();
        return getScannedFqns(ndscanScan);
    }, [isNdscan, ndscanScan]);

    // Toast state for error messages
    const [showError, setShowError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [pipeline, setPipeline] = React.useState('main');

    // Group arguments for display (regular experiments only)
    const groupedArgs = React.useMemo(() => !isNdscan ? groupArguments(arginfo) : {}, [arginfo, isNdscan]);
    const hasArguments = !isNdscan && arginfo && Object.keys(arginfo).length > 0;

    // Handle argument value change (regular experiments)
    const handleArgChange = (argName, value) => {
        setArgValues(prev => ({ ...prev, [argName]: value }));
    };

    // Reset single argument to default (regular experiments)
    const handleResetArg = (argName) => {
        setArgValues(prev => ({ ...prev, [argName]: defaultValues[argName] }));
    };

    // Reset all arguments to defaults (regular experiments)
    const handleResetAll = () => {
        setArgValues(defaultValues);
    };

    // Handle ndscan parameter override change
    const handleNdscanOverrideChange = (fqn, value) => {
        setNdscanOverrides(prev => ({ ...prev, [fqn]: value }));
    };

    // Reset ndscan parameter to default (remove from overrides)
    const handleNdscanOverrideReset = (fqn) => {
        setNdscanOverrides(prev => {
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
            <td><b>{rowName}:</b></td>
            <td>{entry}</td>
        </tr>
    );

    // Render NDScan parameter row
    const renderNdscanParam = (fqn, schema) => {
        const { description, type } = schema;
        const isScanned = scannedFqns.has(fqn);
        const value = ndscanOverrides[fqn];

        let InputComponent;
        if (type === 'float') {
            InputComponent = NDScanFloatInput;
        } else if (type === 'int') {
            InputComponent = NDScanIntInput;
        } else if (type === 'bool') {
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
        if (isNdscan && ndscanParams) {
            // Validate: no overlap between overrides and scan axes
            const overrideFqns = new Set(Object.keys(ndscanOverrides));
            const overlap = [...scannedFqns].filter(fqn => overrideFqns.has(fqn));
            if (overlap.length > 0) {
                handleError(`Parameters cannot be both overridden and scanned: ${overlap.join(', ')}`);
                return null;
            }

            return formatNdscanSubmission(ndscanParams, ndscanOverrides, ndscanScan, fqnToPath);
        } else {
            return argValues;
        }
    };

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

                {/* Regular experiment arguments */}
                {!isNdscan && hasArguments && (
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

                {/* NDScan experiment parameters */}
                {isNdscan && ndscanParams && (
                    <div className="mt-3">
                        <h6>NDScan Parameters</h6>

                        {/* Display parameters grouped by fragment */}
                        {ndscanParams.instances && Object.entries(ndscanParams.instances).map(([fragmentPath, fqns]) => {
                            const fragmentName = fragmentPath === '' ? 'Root Parameters' : fragmentPath;

                            // Separate always_shown from other params
                            const alwaysShownSet = new Set(
                                (ndscanParams.always_shown || []).map(item => {
                                    // Handle tuple format from PYON
                                    if (item && item.__jsonclass__ && item.__jsonclass__[0] === 'tuple') {
                                        return item.__jsonclass__[1][0]; // [fqn, path]
                                    }
                                    return item;
                                })
                            );

                            const alwaysShownParams = fqns.filter(fqn => alwaysShownSet.has(fqn));
                            const advancedParams = fqns.filter(fqn => !alwaysShownSet.has(fqn));

                            return (
                                <Card key={fragmentPath} className="mb-2">
                                    <Card.Header className="py-1 px-2" style={{ fontSize: '0.9em' }}>
                                        {fragmentName}
                                    </Card.Header>
                                    <Card.Body className="py-2 px-3">
                                        {/* Always shown parameters */}
                                        {alwaysShownParams.map(fqn => {
                                            const schema = ndscanParams.schemata[fqn];
                                            return schema ? renderNdscanParam(fqn, schema) : null;
                                        })}

                                        {/* Advanced parameters (collapsible) */}
                                        {advancedParams.length > 0 && (
                                            <>
                                                {alwaysShownParams.length > 0 && <hr className="my-2" />}
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                                    className="p-0 mb-2"
                                                >
                                                    {showAdvanced ? '▼' : '▶'} Show Advanced Parameters ({advancedParams.length})
                                                </Button>
                                                {showAdvanced && advancedParams.map(fqn => {
                                                    const schema = ndscanParams.schemata[fqn];
                                                    return schema ? renderNdscanParam(fqn, schema) : null;
                                                })}
                                            </>
                                        )}
                                    </Card.Body>
                                </Card>
                            );
                        })}

                        {/* Scan Configuration */}
                        {ndscanScan && (
                            <ScanConfiguration
                                scan={ndscanScan}
                                schemata={ndscanParams.schemata}
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
                )}

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

                <ButtonGroup className="mt-3">
                    <SubmitNewButton
                        file={file}
                        class_name={class_name}
                        repo_rev={repo_rev}
                        arguments={getSubmissionArguments()}
                        pipeline={pipeline}
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

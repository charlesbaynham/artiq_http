import React from "react";
import { toDisplayValue, fromDisplayValue } from "./api/ndscan";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

// Reset button component used by all input types
function ResetButton({ onClick, disabled }) {
  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>Reset to default</Tooltip>}
    >
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={onClick}
        disabled={disabled}
      >
        ↺
      </Button>
    </OverlayTrigger>
  );
}

// NumberValue: numeric input with optional unit, min, max, step
export function NumberValueInput({ name, spec, value, onChange, onReset }) {
  const { unit, scale, step, min, max, precision, default: defaultVal } = spec;

  // Display value scaled if needed
  const displayValue = value !== undefined && value !== null ? value : "";
  const isDefault = value === defaultVal;

  const handleChange = (e) => {
    const val = e.target.value;
    // Allow empty string for clearing, otherwise parse as number
    if (val === "" || val === "-") {
      onChange(name, val);
    } else {
      const num = parseFloat(val);
      if (!isNaN(num)) {
        onChange(name, num);
      }
    }
  };

  return (
    <InputGroup size="sm">
      <Form.Control
        type="number"
        value={displayValue}
        onChange={handleChange}
        step={step || "any"}
        min={min}
        max={max}
      />
      {unit && <InputGroup.Text>{unit}</InputGroup.Text>}
      <ResetButton onClick={() => onReset(name)} disabled={isDefault} />
    </InputGroup>
  );
}

// EnumerationValue: dropdown select from choices
export function EnumerationValueInput({
  name,
  spec,
  value,
  onChange,
  onReset,
}) {
  const { choices, default: defaultVal } = spec;
  const isDefault = value === defaultVal;

  return (
    <InputGroup size="sm">
      <Form.Select
        value={value || ""}
        onChange={(e) => onChange(name, e.target.value)}
      >
        {choices &&
          choices.map((choice) => (
            <option key={choice} value={choice}>
              {choice}
            </option>
          ))}
      </Form.Select>
      <ResetButton onClick={() => onReset(name)} disabled={isDefault} />
    </InputGroup>
  );
}

// BooleanValue: checkbox toggle
export function BooleanValueInput({ name, spec, value, onChange, onReset }) {
  const { default: defaultVal } = spec;
  const isDefault = value === defaultVal;

  return (
    <InputGroup size="sm">
      <InputGroup.Checkbox
        checked={Boolean(value)}
        onChange={(e) => onChange(name, e.target.checked)}
      />
      <Form.Control
        plaintext
        readOnly
        value={value ? "True" : "False"}
        style={{ paddingLeft: "0.5rem" }}
      />
      <ResetButton onClick={() => onReset(name)} disabled={isDefault} />
    </InputGroup>
  );
}

// StringValue: text input
export function StringValueInput({ name, spec, value, onChange, onReset }) {
  const { default: defaultVal } = spec;
  const isDefault = value === defaultVal;

  return (
    <InputGroup size="sm">
      <Form.Control
        type="text"
        value={value || ""}
        onChange={(e) => onChange(name, e.target.value)}
      />
      <ResetButton onClick={() => onReset(name)} disabled={isDefault} />
    </InputGroup>
  );
}

// PYONValue: textarea for PYON-formatted data (rare, simple text)
export function PYONValueInput({ name, spec, value, onChange, onReset }) {
  const { default: defaultVal } = spec;
  const isDefault = value === defaultVal;

  return (
    <InputGroup size="sm">
      <Form.Control
        as="textarea"
        rows={2}
        value={value || ""}
        onChange={(e) => onChange(name, e.target.value)}
        style={{ fontFamily: "monospace", fontSize: "0.85em" }}
      />
      <ResetButton onClick={() => onReset(name)} disabled={isDefault} />
    </InputGroup>
  );
}

// NDScan Float Input: handles float type with scale/unit conversion
export function NDScanFloatInput({
  schema,
  value,
  onChange,
  onReset,
  disabled,
}) {
  const { fqn, default: defaultStr, spec } = schema;
  const { unit, scale, step, min, max } = spec || {};

  // Parse default from string to number
  const defaultVal = defaultStr ? parseFloat(defaultStr) : 0;
  const currentVal = value !== undefined && value !== null ? value : defaultVal;

  const displayValue = toDisplayValue(currentVal, scale);
  const isDefault = value === undefined || value === null;

  const handleChange = (e) => {
    const val = e.target.value;
    const converted = fromDisplayValue(val, scale);
    onChange(fqn, converted);
  };

  const displayMin = toDisplayValue(min, scale);
  const displayMax = toDisplayValue(max, scale);
  const displayStep = toDisplayValue(step, scale);

  return (
    <InputGroup size="sm">
      <Form.Control
        type="number"
        value={displayValue}
        onChange={handleChange}
        step={displayStep || "any"}
        min={displayMin}
        max={displayMax}
        disabled={disabled}
      />
      {unit && <InputGroup.Text>{unit}</InputGroup.Text>}
      {disabled && (
        <InputGroup.Text className="text-muted">
          <small>Scanned</small>
        </InputGroup.Text>
      )}
      <ResetButton
        onClick={() => onReset(fqn)}
        disabled={isDefault || disabled}
      />
    </InputGroup>
  );
}

// NDScan Int Input: handles integer type
export function NDScanIntInput({ schema, value, onChange, onReset, disabled }) {
  const { fqn, default: defaultStr, spec } = schema;
  const { unit, scale, step, min, max } = spec || {};

  // Parse default from string to integer
  const defaultVal = defaultStr ? parseInt(defaultStr) : 0;
  const currentVal = value !== undefined && value !== null ? value : defaultVal;

  const displayValue = toDisplayValue(currentVal, scale);
  const isDefault = value === undefined || value === null;

  const handleChange = (e) => {
    const val = e.target.value;
    const converted = fromDisplayValue(val, scale);
    // Ensure it's an integer if it's a number
    const finalValue =
      typeof converted === "number" ? Math.round(converted) : converted;
    onChange(fqn, finalValue);
  };

  const displayMin = toDisplayValue(min, scale);
  const displayMax = toDisplayValue(max, scale);
  const displayStep = toDisplayValue(step, scale);

  return (
    <InputGroup size="sm">
      <Form.Control
        type="number"
        value={displayValue}
        onChange={handleChange}
        step={displayStep || 1}
        min={displayMin}
        max={displayMax}
        disabled={disabled}
      />
      {unit && <InputGroup.Text>{unit}</InputGroup.Text>}
      {disabled && (
        <InputGroup.Text className="text-muted">
          <small>Scanned</small>
        </InputGroup.Text>
      )}
      <ResetButton
        onClick={() => onReset(fqn)}
        disabled={isDefault || disabled}
      />
    </InputGroup>
  );
}

// NDScan Bool Input: handles boolean type
export function NDScanBoolInput({
  schema,
  value,
  onChange,
  onReset,
  disabled,
}) {
  const { fqn, description, type, default: defaultStr } = schema;

  // Parse default from string to boolean
  const defaultVal = defaultStr === "True" || defaultStr === "true";
  const currentVal = value !== undefined && value !== null ? value : defaultVal;
  const isDefault = value === undefined || value === null;

  return (
    <InputGroup size="sm">
      <InputGroup.Checkbox
        checked={Boolean(currentVal)}
        onChange={(e) => onChange(fqn, e.target.checked)}
        disabled={disabled}
      />
      <Form.Control
        plaintext
        readOnly
        value={currentVal ? "True" : "False"}
        style={{ paddingLeft: "0.5rem" }}
      />
      {disabled && (
        <InputGroup.Text className="text-muted">
          <small>Scanned</small>
        </InputGroup.Text>
      )}
      <ResetButton
        onClick={() => onReset(fqn)}
        disabled={isDefault || disabled}
      />
    </InputGroup>
  );
}

// Map argument type to component
export function getArgumentInput(ty) {
  switch (ty) {
    case "NumberValue":
      return NumberValueInput;
    case "EnumerationValue":
      return EnumerationValueInput;
    case "BooleanValue":
      return BooleanValueInput;
    case "StringValue":
      return StringValueInput;
    case "PYONValue":
    default:
      return PYONValueInput;
  }
}

// Single argument row with label, tooltip, and input
export function ArgumentRow({ name, argInfo, value, onChange, onReset }) {
  const [spec, group, tooltip] = argInfo;
  const InputComponent = getArgumentInput(spec.ty);

  const label = (
    <Form.Label className="mb-0" style={{ fontWeight: 500 }}>
      {name}
    </Form.Label>
  );

  return (
    <Form.Group className="mb-2 row align-items-center">
      <div className="col-4">
        {tooltip ? (
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>{tooltip}</Tooltip>}
          >
            <span style={{ cursor: "help", borderBottom: "1px dotted #666" }}>
              {label}
            </span>
          </OverlayTrigger>
        ) : (
          label
        )}
      </div>
      <div className="col-8">
        <InputComponent
          name={name}
          spec={spec}
          value={value}
          onChange={onChange}
          onReset={onReset}
        />
      </div>
    </Form.Group>
  );
}

export default {
  NumberValueInput,
  EnumerationValueInput,
  BooleanValueInput,
  StringValueInput,
  PYONValueInput,
  NDScanFloatInput,
  NDScanIntInput,
  NDScanBoolInput,
  getArgumentInput,
  ArgumentRow,
};

import React from "react";
import PropTypes from "prop-types";

/**
 * Component to display a dataset value with proper formatting
 * Handles ARTIQ dataset format: [persist, value, metadata]
 */
function DatasetValue({ name, datasetData }) {
  if (!datasetData) {
    return <div className="text-muted">No data</div>;
  }

  // ARTIQ datasets are in format [persist, value, metadata]
  const [persist, value, metadata] = datasetData;

  const renderValue = (val) => {
    if (val === null || val === undefined) {
      return <span className="text-muted">null</span>;
    }

    if (typeof val === "boolean") {
      return <span className="text-info">{val.toString()}</span>;
    }

    if (typeof val === "number") {
      return <span className="text-success">{val}</span>;
    }

    if (typeof val === "string") {
      return <span className="text-warning">&quot;{val}&quot;</span>;
    }

    if (Array.isArray(val)) {
      // For arrays, show first few elements and length
      if (val.length === 0) {
        return <span className="text-muted">[]</span>;
      }
      if (val.length <= 5) {
        return (
          <span>
            [
            {val.map((item, idx) => (
              <span key={idx}>
                {idx > 0 && ", "}
                {renderValue(item)}
              </span>
            ))}
            ]
          </span>
        );
      }
      return (
        <details>
          <summary>Array ({val.length} elements)</summary>
          <pre className="mt-2 p-2 bg-light border rounded">
            {JSON.stringify(val, null, 2)}
          </pre>
        </details>
      );
    }

    if (typeof val === "object") {
      return (
        <details>
          <summary>Object</summary>
          <pre className="mt-2 p-2 bg-light border rounded">
            {JSON.stringify(val, null, 2)}
          </pre>
        </details>
      );
    }

    return <span>{String(val)}</span>;
  };

  return (
    <div className="dataset-value">
      <div className="mb-2">
        <strong>{name}</strong>
        {persist && <span className="badge bg-secondary ms-2">persistent</span>}
      </div>
      <div className="ms-3">{renderValue(value)}</div>
      {metadata && Object.keys(metadata).length > 0 && (
        <details className="mt-2 ms-3">
          <summary className="text-muted small">Metadata</summary>
          <pre className="mt-1 p-2 bg-light border rounded small">
            {JSON.stringify(metadata, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

DatasetValue.propTypes = {
  name: PropTypes.string.isRequired,
  datasetData: PropTypes.array,
};

export default DatasetValue;

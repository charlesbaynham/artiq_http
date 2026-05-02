import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

import { get_dataset_names, get_dataset_values } from "./api/client";
import DatasetTree from "./DatasetTree";
import DatasetValue from "./DatasetValue";
import { ArrowClockwise } from "react-bootstrap-icons";

/**
 * Main component for dataset exploration
 * Provides search, hierarchical browsing, and value display
 */
function DatasetExplorer() {
  const [allNames, setAllNames] = useState([]);
  const [filteredNames, setFilteredNames] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [datasetValues, setDatasetValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dataset names on mount and every 5 seconds
  useEffect(() => {
    const fetchNames = async () => {
      try {
        const data = await get_dataset_names();
        setAllNames(data.names);
        setFilteredNames(data.names);
        setError(null);
      } catch (err) {
        setError(`Failed to load datasets: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately on mount
    fetchNames();

    // Set up interval to fetch every 5 seconds
    const intervalId = setInterval(fetchNames, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Filter names based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredNames(allNames);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredNames(
        allNames.filter((name) => name.toLowerCase().includes(query)),
      );
    }
  }, [searchQuery, allNames]);

  // Sync with URL Params
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize from URL
  useEffect(() => {
    const selectedInUrl = searchParams.getAll("select");
    if (selectedInUrl.length > 0) {
      setSelectedDatasets(selectedInUrl);
      // And we need to fetch values for them
      get_dataset_values(selectedInUrl)
        .then((data) => {
          setDatasetValues((prev) => ({ ...prev, ...data }));
        })
        .catch((err) => console.error(err));
    }
  }, []); // Only on mount

  // Handle dataset selection
  const handleSelect = async (datasetName) => {
    // Toggle selection
    let newSelected;
    if (selectedDatasets.includes(datasetName)) {
      newSelected = selectedDatasets.filter((name) => name !== datasetName);
      // Remove from values
      const newValues = { ...datasetValues };
      delete newValues[datasetName];
      setDatasetValues(newValues);
    } else {
      newSelected = [...selectedDatasets, datasetName];
      // Fetch the value
      try {
        const data = await get_dataset_values([datasetName]);
        setDatasetValues({ ...datasetValues, ...data });
      } catch (err) {
        setError(`Failed to load dataset value: ${err.message}`);
      }
    }
    setSelectedDatasets(newSelected);

    // Update URL
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete("select");
      newSelected.forEach((name) => newParams.append("select", name));
      return newParams;
    });
  };

  // Refresh values for all selected datasets
  const refreshSelectedDatasets = async () => {
    if (selectedDatasets.length === 0) return;

    try {
      const data = await get_dataset_values(selectedDatasets);
      setDatasetValues(data);
      setError(null);
    } catch (err) {
      setError(`Failed to refresh dataset values: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="dataset-explorer">
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search datasets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Form.Group>

      <div className="row">
        <div className="col-md-6">
          <h5>Available Datasets ({allNames.length})</h5>
          <div
            className="border rounded p-2"
            style={{ maxHeight: "500px", overflowY: "auto" }}
          >
            <DatasetTree
              datasetNames={filteredNames}
              selectedDatasets={selectedDatasets}
              onSelect={handleSelect}
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5>Selected Datasets ({selectedDatasets.length})</h5>
            <button
              className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
              onClick={refreshSelectedDatasets}
              disabled={selectedDatasets.length === 0}
              aria-label="Refresh selected datasets"
            >
              <ArrowClockwise aria-hidden="true" /> Refresh
            </button>
          </div>
          <div
            className="border rounded p-3"
            style={{ maxHeight: "500px", overflowY: "auto" }}
          >
            {selectedDatasets.length === 0 ? (
              <div className="text-muted">
                Click on a dataset to view its value
              </div>
            ) : (
              selectedDatasets.map((name) => (
                <div key={name} className="mb-3 pb-3 border-bottom">
                  <DatasetValue name={name} datasetData={datasetValues[name]} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DatasetExplorer;

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { get_dataset_names } from "./api/client";
import NDScanPlot from "./NDScanPlot";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

/**
 * Component to discover and display multiple NDScan plots
 */
function NDScanPlotCollection() {
  const [prefixes, setPrefixes] = useState([]);
  const [selectedPrefix, setSelectedPrefix] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrefixes = async () => {
    try {
      const data = await get_dataset_names();
      const names = data.names;

      // Look for ".axes" to identify NDScan prefixes
      const discovered = names
        .filter((name) => name.endsWith(".axes"))
        .map((name) => name.replace(".axes", ""))
        .sort((a, b) => {
          // Sort RIDs numerically if possible
          const ridA = parseInt(a.split("_")[1]);
          const ridB = parseInt(b.split("_")[1]);
          if (!isNaN(ridA) && !isNaN(ridB)) return ridB - ridA;
          return b.localeCompare(a);
        });

      // Only update state if the list has changed
      if (JSON.stringify(discovered) !== JSON.stringify(prefixes)) {
        setPrefixes(discovered);
      }
      setError(null);
    } catch (err) {
      setError(`Failed to discover scans: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrefixes();
    const interval = setInterval(fetchPrefixes, 5000);
    return () => clearInterval(interval);
  }, [prefixes]);

  // Sync selection with URL
  useEffect(() => {
    const scanInUrl = searchParams.get("scan");
    if (scanInUrl) {
      if (selectedPrefix !== scanInUrl) setSelectedPrefix(scanInUrl);
    } else if (prefixes.length > 0 && !selectedPrefix) {
      // Default to first found scan if none selected and none in URL
      setSelectedPrefix(prefixes[0]);
    }
  }, [searchParams, prefixes, selectedPrefix]);

  const handleSelect = (prefix) => {
    setSelectedPrefix(prefix);
    setSearchParams({ scan: prefix });
  };

  if (loading && prefixes.length === 0) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" />
        <div className="mt-2">Discovering NDScans...</div>
      </div>
    );
  }

  return (
    <div className="ndscan-plot-collection">
      {error && <Alert variant="danger">{error}</Alert>}

      {prefixes.length === 0 ? (
        <Alert variant="info">No NDScan datasets found in the store.</Alert>
      ) : (
        <Row>
          <Col md={4} lg={3}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6>Available Scans</h6>
              <button
                className="btn btn-sm btn-link p-0"
                onClick={fetchPrefixes}
                title="Refresh scan list"
              >
                🔄
              </button>
            </div>
            <ListGroup
              className="scan-list mb-3"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              {prefixes.map((prefix) => (
                <ListGroup.Item
                  key={prefix}
                  action
                  active={selectedPrefix === prefix}
                  onClick={() => handleSelect(prefix)}
                  className="py-2 px-3 small border-0 mb-1 rounded"
                  style={{ cursor: "pointer" }}
                >
                  {prefix.replace("ndscan.", "")}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col md={8} lg={9}>
            {selectedPrefix ? (
              <div className="plot-container border rounded p-3 bg-dark">
                <NDScanPlot prefix={selectedPrefix} />
              </div>
            ) : (
              <div className="text-center text-muted p-5 border rounded">
                Select a scan from the list to view the plot
              </div>
            )}
          </Col>
        </Row>
      )}
    </div>
  );
}

export default NDScanPlotCollection;

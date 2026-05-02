import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { get_dataset_names, get_dataset_values } from "./api/client";
import NDScanPlot from "./NDScanPlot";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import { ArrowClockwise } from "react-bootstrap-icons";

/**
 * Component to discover and display multiple NDScan plots
 */
function NDScanPlotCollection() {
  const [prefixes, setPrefixes] = useState([]);
  const [prefixMeta, setPrefixMeta] = useState({});
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

      // Fetch fragment_fqn metadata for each prefix
      const metaQueries = discovered.map((p) => `${p}.fragment_fqn`);
      const metaValues =
        metaQueries.length > 0 ? await get_dataset_values(metaQueries) : {};
      const meta = {};
      discovered.forEach((p) => {
        const fqnData = metaValues[`${p}.fragment_fqn`];
        meta[p] = fqnData ? fqnData[1] : null;
      });

      // Only update state if the list has changed
      if (JSON.stringify(discovered) !== JSON.stringify(prefixes)) {
        setPrefixes(discovered);
      }
      setPrefixMeta(meta);
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
        <div className="empty-state">
          <div className="empty-state__eyebrow">Idle</div>
          <p className="empty-state__message">
            No NDScans currently in the store.
          </p>
          <p className="empty-state__hint">
            Plots will appear here once a scan starts publishing datasets.
          </p>
        </div>
      ) : (
        <Row>
          <Col md={4} lg={3}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6>Available Scans</h6>
              <button
                className="btn btn-sm btn-link p-0 scan-refresh"
                onClick={fetchPrefixes}
                title="Refresh scan list"
                aria-label="Refresh scan list"
              >
                <ArrowClockwise aria-hidden="true" />
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
                  <div className="d-flex flex-column">
                    <span>{prefix.replace("ndscan.", "")}</span>
                    {prefixMeta[prefix] && (
                      <span
                        className="text-muted"
                        style={{ fontSize: "0.75em" }}
                      >
                        {prefixMeta[prefix]}
                      </span>
                    )}
                  </div>
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

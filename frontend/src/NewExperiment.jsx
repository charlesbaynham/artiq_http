import React from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import ExperimentTree from "./ExperimentTree";

import { get_explist } from "./api/client";

const TIMEOUT = 10000;

// ... (buildTree remains same)
function buildTree(experiments, searchTerm) {
  const tree = {};
  const lowerSearch = searchTerm.toLowerCase();

  const filtered = experiments.filter(
    (e) =>
      e.class_name.toLowerCase().includes(lowerSearch) ||
      e.file.toLowerCase().includes(lowerSearch) ||
      (e.name && e.name.toLowerCase().includes(lowerSearch)),
  );

  filtered.forEach((exp) => {
    const parts = exp.file.split(/[/\\]/); // Handle both path separators
    let current = tree;

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        // It's the file name, but we want to group by file + class_name
        // For simplicity, we'll put the experiment object here
        const key = `${part} : ${exp.class_name}`;
        current[key] = { experiment: exp };
      } else {
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
    });
  });

  return tree;
}

function NewExperiment({ onSelect, selectedExperiment }) {
  const [explist, setExplist] = React.useState({});
  const [searchTerm, setSearchTerm] = React.useState("");

  const exps = "experiments" in explist ? explist["experiments"] : [];
  const repo_rev = "repo_rev" in explist ? explist["repo_rev"] : null;

  React.useEffect(() => {
    const fetchExplist = () => {
      get_explist()
        .then(setExplist)
        .catch((err) =>
          console.error("Experiment list update error:", err.message),
        );
    };

    fetchExplist();
    const interval = setInterval(fetchExplist, TIMEOUT);
    return () => clearInterval(interval);
  }, []);

  const tree = React.useMemo(
    () => buildTree(exps, searchTerm),
    [exps, searchTerm],
  );

  const handleSelect = (node) => {
    if (onSelect) {
      onSelect(node, repo_rev);
    }
  };

  return (
    <div>
      <div className="experiment-browser-container border rounded p-3 bg-secondary bg-opacity-10">
        <InputGroup className="mb-4">
          <InputGroup.Text>🔍</InputGroup.Text>
          <Form.Control
            placeholder="Search experiments by name, class, or file..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setSearchTerm("");
              }
            }}
          />
          {searchTerm && (
            <button
              className="btn btn-outline-secondary"
              onClick={() => setSearchTerm("")}
            >
              ✕
            </button>
          )}
        </InputGroup>

        <div
          className="experiment-tree-scroll"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          {exps.length === 0 ? (
            <div className="text-center p-5 text-muted">
              Loading experiments...
            </div>
          ) : Object.keys(tree).length === 0 ? (
            <div className="text-center p-5 text-muted">
              No experiments match your search.
            </div>
          ) : (
            <ExperimentTree
              tree={tree}
              repo_rev={repo_rev}
              searchTerm={searchTerm}
              onSelect={handleSelect}
              selectedExperiment={selectedExperiment}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default NewExperiment;

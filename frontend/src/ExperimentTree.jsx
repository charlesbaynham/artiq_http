import React from "react";
import NewExperimentItem from "./NewExperimentItem";
import NewNDScanItem from "./NewNDScanItem";
import { isNDScanExperiment } from "./api/ndscan";

/*
Note: I'll use simple text icons (+ / -) or unicode if lucide-react is not available.
Let's check package.json for icons.
*/

function ExperimentTree({
  tree,
  repo_rev,
  searchTerm,
  onSelect,
  selectedExperiment,
}) {
  return (
    <div className="experiment-tree">
      <TreeNode
        node={tree}
        repo_rev={repo_rev}
        searchTerm={searchTerm}
        isRoot={true}
        onSelect={onSelect}
        selectedExperiment={selectedExperiment}
      />
    </div>
  );
}

function TreeNode({
  node,
  name,
  repo_rev,
  searchTerm,
  isRoot,
  path = "",
  onSelect,
  selectedExperiment,
}) {
  // ... (storage key and state logic remains same)
  const nodeKey = path || "root";
  const storageKey = `experimentTree_${nodeKey}`;

  const getInitialState = () => {
    if (searchTerm) return true;
    const stored = localStorage.getItem(storageKey);
    return stored !== null ? stored === "true" : false;
  };

  const [isOpen, setIsOpen] = React.useState(getInitialState);

  React.useEffect(() => {
    if (searchTerm) {
      setIsOpen(true);
    } else {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) {
        setIsOpen(stored === "true");
      }
    }
  }, [searchTerm, storageKey]);

  React.useEffect(() => {
    if (!searchTerm) {
      localStorage.setItem(storageKey, isOpen.toString());
    }
  }, [isOpen, storageKey, searchTerm]);

  // If it's a leaf (experiment)
  if (node.experiment) {
    const isSelected = selectedExperiment === node;
    return (
      <div
        className={`experiment-item px-2 py-1 mb-1 rounded cursor-pointer ${
          isSelected ? "list-group-item-action active" : "hover-bg-light"
        }`}
        onClick={() => onSelect(node)}
        style={{ cursor: "pointer", transition: "background-color 0.2s" }}
      >
        <span className="me-2">📄</span>
        <span className="class-name fw-bold">{node.experiment.class_name}</span>
        <span
          className="ms-2 text-muted small"
          style={{ color: isSelected ? "#eee" : "#6c757d" }}
        >
          {node.experiment.file}
        </span>
      </div>
    );
  }

  // Sort keys: folders first, then files
  const sortedKeys = Object.keys(node).sort((a, b) => {
    const aIsDir = !node[a].experiment;
    const bIsDir = !node[b].experiment;
    if (aIsDir && !bIsDir) return -1;
    if (!aIsDir && bIsDir) return 1;
    return a.localeCompare(b);
  });

  if (isRoot) {
    return (
      <div>
        {sortedKeys.map((key) => (
          <TreeNode
            key={key}
            name={key}
            node={node[key]}
            repo_rev={repo_rev}
            searchTerm={searchTerm}
            isRoot={false}
            path={key}
            onSelect={onSelect}
            selectedExperiment={selectedExperiment}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="ms-3 mb-1">
      <div
        className="experiment-folder d-flex align-items-center fw-bold py-1 px-2 rounded hover-bg-light"
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: "pointer" }}
      >
        <span
          className="folder-icon me-2"
          style={{ width: "1em", textAlign: "center" }}
        >
          {isOpen ? "▼" : "▶"}
        </span>
        <span className="me-2">📁</span>
        {name}
      </div>
      {isOpen && (
        <div className="mt-1">
          {sortedKeys.map((key) => (
            <TreeNode
              key={key}
              name={key}
              node={node[key]}
              repo_rev={repo_rev}
              searchTerm={searchTerm}
              path={`${path}/${key}`}
              isRoot={false}
              onSelect={onSelect}
              selectedExperiment={selectedExperiment}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ExperimentTree;

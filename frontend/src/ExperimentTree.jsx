import React from "react";
import { ChevronRight, Folder, FileEarmarkCode } from "react-bootstrap-icons";

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
    // Match logic: selectedExperiment is "file:class_name" string
    const exp = node.experiment;
    const uniqueId = `${exp.file}:${exp.class_name}`;
    const isSelected =
      selectedExperiment === node || selectedExperiment === uniqueId;
    return (
      <div
        className={`experiment-item ${isSelected ? "is-active" : ""}`}
        onClick={() => onSelect(node)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(node);
          }
        }}
      >
        <span className="experiment-item__icon" aria-hidden="true">
          <FileEarmarkCode size={14} />
        </span>
        <span className="experiment-item__class">{exp.class_name}</span>
        <span className="experiment-item__file">{exp.file}</span>
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
    <div>
      <div
        className="experiment-folder"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <span
          className={`experiment-folder__chevron ${isOpen ? "is-open" : ""}`}
          aria-hidden="true"
        >
          <ChevronRight size={12} />
        </span>
        <span className="experiment-folder__icon" aria-hidden="true">
          <Folder size={14} />
        </span>
        <span>{name}</span>
      </div>
      {isOpen && (
        <div className="experiment-tree-children">
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

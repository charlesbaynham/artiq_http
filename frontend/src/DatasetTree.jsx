import React, { useState } from "react";
import PropTypes from "prop-types";
import { ChevronRight, ChevronDown } from "react-bootstrap-icons";

/**
 * Build a hierarchical tree structure from flat dataset names
 * using '.' as separator
 */
function buildTree(names) {
  const tree = {};

  names.forEach((name) => {
    const parts = name.split(".");
    let current = tree;

    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = {
          isLeaf: index === parts.length - 1,
          fullPath: parts.slice(0, index + 1).join("."),
          children: {},
        };
      }
      current = current[part].children;
    });
  });

  return tree;
}

/**
 * Recursive tree node component
 */
function TreeNode({ name, node, selectedDatasets, onSelect, level = 0 }) {
  const [isExpanded, setIsExpanded] = useState(level === 0);

  const handleClick = () => {
    if (node.isLeaf) {
      onSelect(node.fullPath);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const isSelected = selectedDatasets.includes(node.fullPath);
  const hasChildren = Object.keys(node.children).length > 0;

  return (
    <div>
      <div
        className={`dataset-tree-node ${isSelected ? "selected" : ""} ${
          node.isLeaf ? "leaf" : "branch"
        }`}
        style={{
          paddingLeft: `${level * 20 + 8}px`,
          cursor: "pointer",
          padding: "6px 8px",
          borderRadius: "4px",
          marginBottom: "2px",
        }}
        onClick={handleClick}
      >
        {!node.isLeaf && (
          <span className="me-1">
            {isExpanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </span>
        )}
        {node.isLeaf && <span className="me-2">📊</span>}
        <span>{name}</span>
        {!node.isLeaf && (
          <span className="text-muted ms-2 small">
            ({Object.keys(node.children).length})
          </span>
        )}
      </div>
      {!node.isLeaf && isExpanded && (
        <div>
          {Object.entries(node.children).map(([childName, childNode]) => (
            <TreeNode
              key={childNode.fullPath}
              name={childName}
              node={childNode}
              selectedDatasets={selectedDatasets}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

TreeNode.propTypes = {
  name: PropTypes.string.isRequired,
  node: PropTypes.object.isRequired,
  selectedDatasets: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  level: PropTypes.number,
};

/**
 * Main tree component for hierarchical dataset browsing
 */
function DatasetTree({ datasetNames, selectedDatasets, onSelect }) {
  const tree = buildTree(datasetNames);

  if (datasetNames.length === 0) {
    return <div className="text-muted">No datasets available</div>;
  }

  return (
    <div className="dataset-tree">
      {Object.entries(tree).map(([name, node]) => (
        <TreeNode
          key={node.fullPath}
          name={name}
          node={node}
          selectedDatasets={selectedDatasets}
          onSelect={onSelect}
          level={0}
        />
      ))}
    </div>
  );
}

DatasetTree.propTypes = {
  datasetNames: PropTypes.array.isRequired,
  selectedDatasets: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default DatasetTree;

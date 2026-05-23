import React from "react";
import { Search, X } from "react-bootstrap-icons";

import ExperimentTree from "./ExperimentTree";

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
    const parts = exp.file.split(/[/\\]/);
    let current = tree;

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
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

function NewExperiment({ explist, onSelect, selectedExperiment }) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const exps =
    explist && "experiments" in explist ? explist["experiments"] : [];
  const repo_rev =
    explist && "repo_rev" in explist ? explist["repo_rev"] : null;

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
    <div className="experiment-browser">
      <label className="experiment-search" aria-label="Search experiments">
        <span className="experiment-search__icon" aria-hidden="true">
          <Search size={14} />
        </span>
        <input
          type="text"
          className="experiment-search__input"
          placeholder="Search experiments by name, class, or file"
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
            type="button"
            className="experiment-search__clear"
            onClick={() => setSearchTerm("")}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </label>

      <div className="experiment-tree-scroll">
        {exps.length === 0 ? (
          <div className="experiment-tree__empty">Loading experiments…</div>
        ) : Object.keys(tree).length === 0 ? (
          <div className="experiment-tree__empty">
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
  );
}

export default NewExperiment;

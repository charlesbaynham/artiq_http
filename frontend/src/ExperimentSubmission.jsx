import React from "react";
import Card from "react-bootstrap/Card";
import NewExperimentItem from "./NewExperimentItem";
import NewNDScanItem from "./NewNDScanItem";
import { isNDScanExperiment } from "./api/ndscan";
import CollapsibleSection from "./CollapsibleSection";

function ExperimentSubmission({ explist, experiment, repo_rev }) {
  // experiment is now a string ID: "file:class_name"
  // explist contains { experiments: [...] }

  const findExperiment = (id) => {
    if (!id || !explist || !explist.experiments) return null;
    return explist.experiments.find((e) => `${e.file}:${e.class_name}` === id);
  };

  const expData = findExperiment(experiment);

  if (!expData) {
    return (
      <Card className="mt-4 shadow-sm border-0 bg-secondary bg-opacity-10">
        <Card.Body className="text-center p-5 text-muted">
          <h5>No experiment selected</h5>
          <p>
            Select an experiment from the browser above to configure and submit
            it.
          </p>
        </Card.Body>
      </Card>
    );
  }

  const Component = isNDScanExperiment(expData.arginfo)
    ? NewNDScanItem
    : NewExperimentItem;

  return (
    <div className="mt-4">
      <div className="submission-form-container">
        <Component data={expData} repo_rev={repo_rev} />
      </div>
    </div>
  );
}

export default ExperimentSubmission;

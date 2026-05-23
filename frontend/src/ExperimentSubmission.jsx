import React from "react";
import Card from "react-bootstrap/Card";
import NewExperimentItem from "./NewExperimentItem";
import NewNDScanItem from "./NewNDScanItem";
import { isNDScanExperiment } from "./api/ndscan";
import CollapsibleSection from "./CollapsibleSection";
import { get_explist_arginfo } from "./api/client";

function ExperimentSubmission({ explist, experiment, repo_rev }) {
  // experiment is now a string ID: "file:class_name"
  // explist contains { experiments: [...] }

  const [arginfo, setArginfo] = React.useState(null);
  const [arginfoLoading, setArginfoLoading] = React.useState(false);

  const findExperiment = (id) => {
    if (!id || !explist || !explist.experiments) return null;
    return explist.experiments.find((e) => `${e.file}:${e.class_name}` === id);
  };

  const expData = findExperiment(experiment);

  // Fetch arginfo lazily when the selected experiment changes
  React.useEffect(() => {
    if (!expData) {
      setArginfo(null);
      return;
    }
    setArginfoLoading(true);
    setArginfo(null);
    get_explist_arginfo(expData.file, expData.class_name)
      .then((result) => setArginfo(result.arginfo))
      .catch((err) => console.error("Failed to fetch arginfo:", err.message))
      .finally(() => setArginfoLoading(false));
  }, [experiment]);

  if (!expData) {
    return (
      <div className="submission-empty">
        <div className="eyebrow">Submit</div>
        <h5>No experiment selected</h5>
        <p>
          Select an experiment from the browser above to configure and submit
          it.
        </p>
      </div>
    );
  }

  if (arginfoLoading) {
    return (
      <div className="submission-empty">
        <div className="eyebrow">Submit</div>
        <p>Loading experiment parameters…</p>
      </div>
    );
  }

  const expDataWithArginfo = { ...expData, arginfo };

  const Component = isNDScanExperiment(arginfo)
    ? NewNDScanItem
    : NewExperimentItem;

  return (
    <div className="mt-4">
      <div className="submission-form-container">
        <Component data={expDataWithArginfo} repo_rev={repo_rev} />
      </div>
    </div>
  );
}

export default ExperimentSubmission;

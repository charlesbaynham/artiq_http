import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Spinner from "react-bootstrap/Spinner";
import NewExperimentItem from "./NewExperimentItem";
import NewNDScanItem from "./NewNDScanItem";
import { isNDScanExperiment, getStorageKey } from "./api/ndscan";
import { getExperimentStorageKey } from "./api/experiments";
import { get_explist_arginfo, recompute_arguments } from "./api/client";

function ExperimentSubmission({
  explist,
  experiment,
  repo_rev,
  defaultRevision,
}) {
  // experiment is now a string ID: "file:class_name"
  // explist contains { experiments: [...] }

  const [arginfo, setArginfo] = React.useState(null);
  const [arginfoLoading, setArginfoLoading] = React.useState(false);

  // The git revision/branch the form is configured against. Editable so the user
  // can point the experiment at a different branch and recompute its arguments.
  // Falls back to the lab-wide default revision, then the backend's configured
  // blank-revision fallback (see explist.default_revision_fallback).
  const trimmedDefault = (defaultRevision || "").trim();
  const [revision, setRevision] = React.useState(
    repo_rev ?? (trimmedDefault || ""),
  );
  const [recomputing, setRecomputing] = React.useState(false);
  const [recomputeError, setRecomputeError] = React.useState("");

  const findExperiment = (id) => {
    if (!id || !explist || !explist.experiments) return null;
    return explist.experiments.find((e) => `${e.file}:${e.class_name}` === id);
  };

  const expData = findExperiment(experiment);

  // Fetch arginfo lazily when the selected experiment changes, and (re)initialise
  // the revision field from the experiment's incoming repo_rev / the backend's
  // configured blank-revision fallback.
  React.useEffect(() => {
    if (!expData) {
      setArginfo(null);
      return;
    }
    setRevision(
      repo_rev ?? (trimmedDefault || explist?.default_revision_fallback || ""),
    );
    setRecomputeError("");
    setArginfoLoading(true);
    setArginfo(null);
    get_explist_arginfo(expData.file, expData.class_name)
      .then((result) => setArginfo(result.arginfo))
      .catch((err) => console.error("Failed to fetch arginfo:", err.message))
      .finally(() => setArginfoLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experiment]);

  // Re-examine the experiment at the typed revision and reset the form's arguments
  // and defaults to whatever that revision defines (mirrors the ARTIQ dashboard's
  // "Recompute all arguments"). Stale per-experiment localStorage is cleared so the
  // freshly-recomputed defaults are not immediately overwritten by old values.
  const handleRecompute = () => {
    if (!expData) return;
    setRecomputing(true);
    setRecomputeError("");
    const trimmed = revision.trim();
    recompute_arguments(expData.file, expData.class_name, trimmed || undefined)
      .then((result) => {
        try {
          localStorage.removeItem(
            getExperimentStorageKey(expData.file, expData.class_name),
          );
          localStorage.removeItem(
            getStorageKey(expData.file, expData.class_name),
          );
        } catch (e) {
          console.error("Failed to clear stored experiment state:", e);
        }
        setArginfo(result.arginfo);
      })
      .catch((err) => setRecomputeError(err.message))
      .finally(() => setRecomputing(false));
  };

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

  const revisionControl = (
    <Form.Group className="mb-3">
      <Form.Label>Rev / ref</Form.Label>
      <InputGroup>
        <Form.Control
          type="text"
          value={revision}
          onChange={(e) => setRevision(e.target.value)}
          placeholder="default revision"
          disabled={recomputing}
        />
        <Button
          variant="outline-secondary"
          onClick={handleRecompute}
          disabled={recomputing || arginfoLoading}
        >
          {recomputing ? (
            <>
              <Spinner as="span" size="sm" animation="border" /> Recomputing…
            </>
          ) : (
            "Recompute arguments"
          )}
        </Button>
      </InputGroup>
      <Form.Text>
        Re-evaluate the experiment's arguments and defaults at the given git
        revision/branch, and submit from it. Leave blank for the backend's
        configured default revision.
      </Form.Text>
      {recomputeError && (
        <div className="text-danger small mt-1">{recomputeError}</div>
      )}
    </Form.Group>
  );

  if (arginfoLoading) {
    return (
      <div className="mt-4">
        <div className="submission-form-container">
          {revisionControl}
          <div className="submission-empty">
            <p>Loading experiment parameters…</p>
          </div>
        </div>
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
        {revisionControl}
        {/* Remount on revision change so argument values re-derive from the freshly
            recomputed defaults. */}
        <Component
          key={`${expData.file}:${expData.class_name}:${revision}`}
          data={expDataWithArginfo}
          repo_rev={revision.trim() || null}
        />
      </div>
    </div>
  );
}

export default ExperimentSubmission;

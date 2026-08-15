/**
 * The submit pane footer.
 *
 * The duration estimate is only shown when it can be derived honestly — point
 * count × repeats × a per-point time *measured* from a live run. With no
 * timing samples yet it is omitted rather than guessed (IMPL-SPEC §6).
 *
 * Submitting never navigates: the new RID appears here and the form is left
 * exactly as it was.
 */

import React from "react";
import PropTypes from "prop-types";

import { BenchButton, Mono, Pill, Spacer } from "../ui/primitives";
import { formatDuration } from "../state/useLiveRun";

function SubmitFooter({
  durationSeconds,
  pipeline,
  priority,
  onPipeline,
  onPriority,
  onSubmit,
  submitting,
  disabled,
  disabledReason,
  rid,
  error,
}) {
  const eta =
    durationSeconds == null
      ? null
      : formatDuration(durationSeconds, { spaced: true });

  return (
    <div className="bw-foot">
      {eta ? (
        <Mono className="bw-foot__eta" title="Estimated run time">
          ≈ {eta}
        </Mono>
      ) : null}
      {rid != null ? (
        <Pill status title="Submitted — the run is in the queue">
          ● submitted RID {rid}
        </Pill>
      ) : null}
      {error ? (
        <span className="bw-foot__err" title={error}>
          {error}
        </span>
      ) : null}
      <Spacer />
      <span className="bw-editpill">
        pipeline
        <input
          value={pipeline}
          onChange={(e) => onPipeline(e.target.value)}
          size={Math.max(4, pipeline.length)}
          style={{ width: `${Math.max(4, pipeline.length)}ch` }}
          aria-label="Pipeline"
          spellCheck={false}
        />
      </span>
      <span className="bw-editpill">
        prio
        <input
          value={String(priority)}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            onPriority(Number.isFinite(n) ? n : 0);
          }}
          inputMode="numeric"
          style={{
            width: `${Math.max(2, String(priority).length)}ch`,
            textAlign: "center",
          }}
          aria-label="Priority"
        />
      </span>
      <BenchButton
        variant="primary"
        size="lg"
        onClick={onSubmit}
        disabled={disabled || submitting}
        title={disabled ? disabledReason : "Submit (⌘↵)"}
      >
        {submitting ? "Submitting…" : "Submit ↵"}
      </BenchButton>
    </div>
  );
}

SubmitFooter.propTypes = {
  durationSeconds: PropTypes.number,
  pipeline: PropTypes.string.isRequired,
  priority: PropTypes.number.isRequired,
  onPipeline: PropTypes.func.isRequired,
  onPriority: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  disabled: PropTypes.bool,
  disabledReason: PropTypes.string,
  rid: PropTypes.number,
  error: PropTypes.string,
};

export default SubmitFooter;

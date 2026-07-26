/**
 * 2a-right: the working set.
 *
 * Axes render before fixed overrides (the session store already orders them);
 * the grid summary is always the last child and disappears when there are no
 * scan axes at all — which is the normal state for plain ARTIQ experiments.
 */

import React, { useCallback } from "react";
import PropTypes from "prop-types";

import { Caption, Mono, Skeleton, Spacer } from "../ui/primitives";
import AxisCard from "./AxisCard";
import FixedCard from "./FixedCard";
import GridSummary from "./GridSummary";
import PresetMenu from "./PresetMenu";

function splitFqn(fqn) {
  const segments = String(fqn || "").split(".");
  const leaf = segments[segments.length - 1];
  const prefix =
    segments.length > 1 ? `${segments.slice(0, -1).join(".")}.` : "";
  return { prefix, leaf };
}

function WorkingSet({
  entries,
  errors,
  loading,
  canAddAxis,
  repeats,
  skipOnError,
  experiment,
  presetSnapshot,
  appliedPresetName,
  actions,
}) {
  const {
    onPatch,
    onUnpin,
    onReset,
    onPromote,
    onSwap,
    onResetAll,
    onSetRepeats,
    onSkip,
    onApplyPreset,
  } = actions;

  const axes = entries.filter((e) => e.mode === "axis");

  const cardActions = useCallback(
    (fqn) => ({
      onPatch: (patch) => onPatch(fqn, patch),
      onUnpin: () => onUnpin(fqn),
      onReset: () => onReset(fqn),
      onPromote: () => onPromote(fqn),
      onSwap,
    }),
    [onPatch, onUnpin, onReset, onPromote, onSwap],
  );

  const confirmReset = useCallback(() => {
    if (!entries.length) return;
    const ok = window.confirm(
      `Revert all ${entries.length} override(s) in the working set?`,
    );
    if (ok) onResetAll();
  }, [entries.length, onResetAll]);

  return (
    <div className="bw-ws">
      <div className="b-panel-h">
        <Caption>working set</Caption>
        <Mono className="bw-ws__count">· {entries.length}</Mono>
        <Spacer />
        <PresetMenu
          experiment={experiment}
          snapshot={presetSnapshot}
          appliedName={appliedPresetName}
          onApply={onApplyPreset}
        />
        <button
          type="button"
          className="bw-ws__reset"
          onClick={confirmReset}
          disabled={!entries.length}
          title="Revert every override"
        >
          reset ↺
        </button>
      </div>

      <div className="bw-ws__body b-scroll">
        {loading ? (
          <Skeleton rows={4} height={62} />
        ) : entries.length === 0 ? (
          <div className="bw-ws__empty">
            Nothing pinned yet — click a parameter on the left to add a fixed
            override, or <Mono>⌖</Mono> to make it a scan axis.
          </div>
        ) : (
          <>
            {entries.map((entry) => {
              const { prefix, leaf } = splitFqn(entry.fqn);
              return entry.mode === "axis" ? (
                <AxisCard
                  key={entry.fqn}
                  entry={entry}
                  prefix={prefix}
                  leaf={leaf}
                  role={entry.axis === 1 ? "outer" : "inner"}
                  showSwap={axes.length > 1 && entry.axis === 2}
                  error={errors[entry.fqn]}
                  actions={cardActions(entry.fqn)}
                />
              ) : (
                <FixedCard
                  key={entry.fqn}
                  entry={entry}
                  prefix={prefix}
                  leaf={leaf}
                  error={errors[entry.fqn]}
                  canAddAxis={canAddAxis}
                  actions={cardActions(entry.fqn)}
                />
              );
            })}
            {axes.length ? (
              <GridSummary
                axes={axes}
                repeats={repeats}
                skipOnError={skipOnError}
                onSetRepeats={onSetRepeats}
                onSkip={onSkip}
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

WorkingSet.propTypes = {
  entries: PropTypes.array.isRequired,
  errors: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  canAddAxis: PropTypes.bool,
  repeats: PropTypes.number,
  skipOnError: PropTypes.bool,
  experiment: PropTypes.object,
  presetSnapshot: PropTypes.object.isRequired,
  appliedPresetName: PropTypes.string,
  actions: PropTypes.object.isRequired,
};

export default WorkingSet;

import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

/**
 * Lab-wide "default branch / revision" control.
 *
 * Sets a single git revision (branch, tag or commit) that every new experiment
 * submission is pre-filled with, so users on a per-branch workflow don't have to
 * override the revision on each submission. The value is persisted in
 * localStorage (see useLocalStorageState) and applies until cleared. An empty
 * value falls back to whatever the backend reports as the blank-revision default
 * (normally the master's current revision, unless overridden - see
 * ARTIQ_HTTP_DEFAULT_REVISION).
 *
 * @param {string} value - current default revision.
 * @param {(v: string) => void} onChange - setter for the persisted default.
 * @param {string} [currentRev] - the backend's blank-revision fallback, shown as a hint.
 */
function DefaultRevision({ value, onChange, currentRev }) {
  // Local buffer so typing doesn't thrash localStorage on every keystroke; the
  // value is committed on blur or Enter.
  const [draft, setDraft] = React.useState(value ?? "");

  React.useEffect(() => {
    setDraft(value ?? "");
  }, [value]);

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed !== (value ?? "")) onChange(trimmed);
  };

  return (
    <Form.Group className="default-revision">
      <Form.Label className="default-revision__label">
        Default branch / revision
      </Form.Label>
      <InputGroup>
        <Form.Control
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.target.blur();
            }
          }}
          placeholder={
            currentRev ? `default (${currentRev.slice(0, 12)})` : "default"
          }
          aria-label="Default branch or revision for experiment submissions"
        />
        {value ? (
          <Button
            variant="outline-secondary"
            onClick={() => onChange("")}
            title="Clear the default and fall back to the backend's configured default"
          >
            Clear
          </Button>
        ) : null}
      </InputGroup>
      <Form.Text>
        Applied to every experiment you configure below. Set it once (e.g. your
        working branch) and each submission defaults to it. Leave blank to use
        the backend's configured default{currentRev ? ` (${currentRev})` : ""}.
      </Form.Text>
    </Form.Group>
  );
}

export default DefaultRevision;

import React from "react";
import Accordion from "react-bootstrap/Accordion";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Table from "react-bootstrap/Table";

import {
  ScheduleCancelButton,
  ScheduleForceCancelButton,
} from "./ScheduleCancelButton";

const STATUS_CLASS = {
  running: "is-running",
  preparing: "is-preparing",
  pending: "is-pending",
  pause_requested: "is-preparing",
  flushing: "is-preparing",
  deleting: "is-error",
  run_done: "is-pending",
  analyzing: "is-running",
};

function statusClass(status) {
  if (!status) return "is-pending";
  return STATUS_CLASS[status] || "is-pending";
}

function StatusPill({ status }) {
  return (
    <span
      className={`status-pill ${statusClass(status)}`}
      aria-label={`Status: ${status}`}
    >
      {status}
    </span>
  );
}

function ScheduleItemHead({ rid, className, file, status }) {
  return (
    <div className="schedule-item-head">
      <div className="schedule-item-head__top">
        <span className="schedule-item-head__rid">
          <span className="schedule-item-head__rid-label">RID</span>
          <span className="schedule-item-head__rid-value">{rid}</span>
        </span>
        <StatusPill status={status} />
      </div>
      <div className="schedule-item-head__class">{className}</div>
      <div className="schedule-item-head__file">{file}</div>
    </div>
  );
}

function ScheduleItemNew(props) {
  const rid = props.rid;
  const class_name = props.data.expid.class_name;
  const file = props.data.expid.file;
  const pipeline = props.data.pipeline;
  const status = props.data.status;
  const repo_rev = props.data.expid.repo_rev;
  const args = props.data.expid.arguments;

  const table_row = (name, entry) => (
    <tr key={name}>
      <td>{name}</td>
      <td>{entry}</td>
    </tr>
  );

  return (
    <Accordion.Item eventKey={rid}>
      <Accordion.Header>
        <ScheduleItemHead
          rid={rid}
          className={class_name}
          file={file}
          status={status}
        />
      </Accordion.Header>
      <Accordion.Body>
        <Table className="schedule-detail-table">
          <tbody>
            {table_row("RID", rid)}
            {table_row("Class", class_name)}
            {table_row("File", file)}
            {table_row("Repo rev", repo_rev)}
            {table_row("Pipeline", pipeline)}
            {table_row("Status", status)}
          </tbody>
        </Table>

        <Accordion>
          <Accordion.Item eventKey="args">
            <Accordion.Header>
              <span className="schedule-item-head__class">Arguments</span>
            </Accordion.Header>
            <Accordion.Body>
              <Table className="schedule-detail-table">
                <tbody>
                  {Object.keys(args).map((arg_name) =>
                    table_row(arg_name, String(args[arg_name])),
                  )}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <ButtonGroup className="mt-3">
          <ScheduleCancelButton rid={rid} />
          <ScheduleForceCancelButton rid={rid} />
        </ButtonGroup>
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default ScheduleItemNew;

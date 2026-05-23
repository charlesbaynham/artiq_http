import React from "react";
import Accordion from "react-bootstrap/Accordion";
import ScheduleItemNew from "./ScheduleItem";

import { get_schedule } from "./api/client";

const TIMEOUT = 1000;

function Schedule() {
  const [exps, setExps] = React.useState({});

  React.useEffect(() => {
    const fetchSchedule = () => {
      get_schedule()
        .then(setExps)
        .catch((err) => console.error("Schedule update error:", err.message));
    };

    fetchSchedule();
    const interval = setInterval(fetchSchedule, TIMEOUT);
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (Object.keys(exps).length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__eyebrow">Queue</div>
        <p className="empty-state__message">Nothing scheduled yet.</p>
        <p className="empty-state__hint">
          Pick an experiment in Schedule to begin.
        </p>
      </div>
    );
  }

  return (
    <Accordion defaultActiveKey="0" className="schedule-list">
      {Object.keys(exps).map((rid) => (
        <ScheduleItemNew key={rid} rid={rid} data={exps[rid]} />
      ))}
    </Accordion>
  );
}

export default Schedule;

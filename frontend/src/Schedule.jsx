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

    // Update the schedule data now
    fetchSchedule();

    // ...and schedule updates every second
    const interval = setInterval(fetchSchedule, TIMEOUT);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Accordion defaultActiveKey="0">
      {Object.keys(exps).map((rid) => (
        <ScheduleItemNew key={rid} rid={rid} data={exps[rid]} />
      ))}
    </Accordion>
  );
}

export default Schedule;

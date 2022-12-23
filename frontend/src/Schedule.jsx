import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import ScheduleItemNew from './ScheduleItem';

import { update_schedule } from './api_features'

const TIMEOUT = 1000;

function Schedule() {
    const [exps, setExps] = React.useState({});

    React.useEffect(() => {
        // Update the schedule data now
        update_schedule(setExps)

        // ...and schedule updates every second
        const interval = setInterval(() => update_schedule(setExps), TIMEOUT);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <Accordion defaultActiveKey="0">
            {
                Object.keys(exps).map((rid) =>
                    <ScheduleItemNew key={rid} rid={rid} data={exps[rid]} />
                )
            }
        </Accordion>
    )
}

export default Schedule;

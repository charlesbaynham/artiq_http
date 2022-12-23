import React from 'react';
import Accordion from 'react-bootstrap/Accordion';

import NewExperimentItem from './NewExperimentItem';

import { update_explist } from './api_features'

const TIMEOUT = 1000;

function NewExperiment() {
    const [explist, setExplist] = React.useState({});

    var exps = [];
    if ("experiments" in explist) {
        exps = explist['experiments']
    }


    React.useEffect(() => {
        // Update the schedule data now
        update_explist(setExplist)

        // ...and schedule updates every second
        const interval = setInterval(() => update_explist(setExplist), TIMEOUT);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return <Accordion defaultActiveKey="0">
        {
            exps.map((e, ind) =>
                <NewExperimentItem key={ind} data={e} />
            )
        }
    </Accordion>
}

export default NewExperiment;

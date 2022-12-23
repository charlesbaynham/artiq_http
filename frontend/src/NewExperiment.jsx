import React from 'react';

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

    return <>
        {exps.map((e) => (<p>{e.name}</p>))}
    </>
}

export default NewExperiment;

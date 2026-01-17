import React from 'react';
import Accordion from 'react-bootstrap/Accordion';

import NewExperimentItem from './NewExperimentItem';

import { update_explist } from './api_features'

const TIMEOUT = 10000;

function NewExperiment() {
    const [explist, setExplist] = React.useState({});

    const exps = ("experiments" in explist) ? explist['experiments'] : [];
    const repo_rev = ("repo_rev" in explist) ? explist['repo_rev'] : null;
    const scanning = ("scanning" in explist) ? Boolean(explist['scanning']) : null;

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
            exps.map((e) =>
                <NewExperimentItem key={`${e.file}:${e.class_name}`} data={e} repo_rev={repo_rev} />
            )
        }
    </Accordion>
}

export default NewExperiment;

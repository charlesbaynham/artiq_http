import React from 'react';
import Accordion from 'react-bootstrap/Accordion';

import NewExperimentItem from './NewExperimentItem';

import { get_explist } from './api/client'

const TIMEOUT = 10000;

function NewExperiment() {
    const [explist, setExplist] = React.useState({});

    const exps = ("experiments" in explist) ? explist['experiments'] : [];
    const repo_rev = ("repo_rev" in explist) ? explist['repo_rev'] : null;
    const scanning = ("scanning" in explist) ? Boolean(explist['scanning']) : null;

    React.useEffect(() => {
        const fetchExplist = () => {
            get_explist()
                .then(setExplist)
                .catch(err => console.error("Experiment list update error:", err.message));
        };

        // Update the experiment list now
        fetchExplist();

        // ...and schedule updates
        const interval = setInterval(fetchExplist, TIMEOUT);
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

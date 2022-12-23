import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import ScheduleItemNew from './ScheduleItem';

const TIMEOUT = 1000;

function NewExperiment() {
    const [exps, setExps] = React.useState({});

    const update_data = () => {
        fetch('http://localhost:8000/schedule')
            .then((response) => response.json())
            .then((data) => {
                setExps(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    React.useEffect(() => {
        // Update the schedule data now
        update_data()

        // ...and schedule updates every second
        const interval = setInterval(() => update_data(), TIMEOUT);
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

export default NewExperiment;

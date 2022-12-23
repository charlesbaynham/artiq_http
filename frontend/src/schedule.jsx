import React from 'react';


const TIMEOUT = 1000;

function ScheduleItem(rid, data) {
    return <li key={rid}>
        ({rid}) - {data.expid.class_name}</li>
}



function Schedule() {
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


    const buildList = () => {
        const rids = Object.keys(exps)

        const listItems = rids.map((rid, ind) => { return ScheduleItem(rid, exps[rid]) });

        return <ul>
            {listItems}
        </ul>
    }

    return (
        <>
            <p>This is the schedule of what's up:</p>
            {buildList()}
        </>
    )
}

export default Schedule;

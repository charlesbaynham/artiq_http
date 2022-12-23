import React from 'react';


function ScheduleItem(rid, data) {
    return <li key={rid}>
        ({rid}) - {data.expid.class_name}</li>
}


function Schedule() {
    const [exps, setExps] = React.useState({});

    React.useEffect(() => {
        fetch('http://localhost:8000/schedule')
            .then((response) => response.json())
            .then((data) => {
                console.log("Received:")
                console.log(data);
                setExps(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
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

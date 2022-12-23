import React from 'react';


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

    const objectMap = (obj, fn) =>
        Object.fromEntries(
            Object.entries(obj).map(
                ([k, v], i) => [k, fn(v, k, i)]
            )
        )

    const buildList = () => {
        // return <p>Placeholder</p>

        const rids = Object.keys(exps)
        const list2 = Object.keys(exps).map((rid) => {
            <li>{rid}</li>
        })

        const list = objectMap(exps, (rid, exp, ind) => {
            return <li>{rid}</li>
        })
        console.log("Exps = ")
        console.log(exps)
        console.log("list2=")
        console.log(list2)
        console.log(rids)

        const mapped = rids.map((k, i) => { return <p>{i}</p> })

        console.log("mapped")
        console.log(mapped)


        return <>{mapped}</>
    }

    return (
        <>
            <p>This is the schedule of what's up:</p>
            {buildList()}
        </>
    )
}

export default Schedule;

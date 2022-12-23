import React from 'react';

import Button from 'react-bootstrap/Button';

function make_query_url(endpoint, params) {
    var url = new URL(`/${endpoint}`, "http://localhost:8000")

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    return url;
}

function cancel_rid(rid, force = false) {
    fetch(make_query_url("cancel", { rid: rid, force: force }), {
        method: "POST",
    })
        .then((response) => response.json())
        .catch((err) => {
            console.log(err.message);
        });
}


function ScheduleCancelButton(props) {
    const [isLoading, setLoading] = React.useState(false);
    const handleClick = () => setLoading(true)

    React.useEffect(() => {
        if (isLoading) {
            cancel_rid(props.rid)
            console.log(`RID ${props.rid} termination requested`)
            setLoading(false)
        }
    }, [isLoading])

    return <Button
        variant="primary"
        disabled={isLoading}
        onClick={!isLoading ? handleClick : null}
    >Request Termination</Button>
}


function ScheduleForceCancelButton(props) {
    const [isLoading, setLoading] = React.useState(false);
    const handleClick = () => setLoading(true)

    React.useEffect(() => {
        if (isLoading) {
            cancel_rid(props.rid, true)
            console.log(`RID ${props.rid} cancelled`)
            setLoading(false)
        }
    }, [isLoading])

    return <Button
        variant="danger"
        disabled={isLoading}
        onClick={!isLoading ? handleClick : null}
    >Force cancellation</Button>
}

export { ScheduleCancelButton, ScheduleForceCancelButton };

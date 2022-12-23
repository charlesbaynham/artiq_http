import React from 'react';

import Button from 'react-bootstrap/Button';


function ScheduleCancelButton(props) {
    const [isLoading, setLoading] = React.useState(false);

    const handleClick = () => setLoading(true)

    function make_query_url(endpoint, params) {
        var url = new URL(`/${endpoint}`, "http://localhost:8000")

        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

        return url;
    }

    const cancel_rid = (rid) => {
        fetch(make_query_url("cancel", { rid: rid }), {
            method: "POST",
        })
            .then((response) => response.json())
            .catch((err) => {
                console.log(err.message);
            });
    }



    React.useEffect(() => {
        if (isLoading) {
            cancel_rid(props.rid)
            console.log(`RID ${props.rid} cancelled`)
            setLoading(false)
        }
    }, [isLoading])

    return <Button
        className="mt-3"
        variant="danger"
        disabled={isLoading}
        onClick={!isLoading ? handleClick : null}
    >Request Termination</Button>
}

export default ScheduleCancelButton;

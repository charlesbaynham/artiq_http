import React from 'react';

import Button from 'react-bootstrap/Button';

import { cancel_rid } from './api_features'

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

import React from 'react';

import Button from 'react-bootstrap/Button';

function ScheduleCancelButton(props) {
    const [isLoading, setLoading] = React.useState(false);

    const handleClick = () => setLoading(true)

    React.useEffect(() => {
        if (isLoading) {
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

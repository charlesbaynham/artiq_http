import React from 'react';

import Button from 'react-bootstrap/Button';

import { queue_experiment } from './api_features'

function SubmitNewButton(props) {
    const [isLoading, setLoading] = React.useState(false);
    const handleClick = () => setLoading(true)

    React.useEffect(() => {
        if (isLoading) {
            queue_experiment(props.file, props.class_name, props.repo_rev)
            setLoading(false)
        }
    }, [isLoading])

    return <Button
        variant="primary"
        disabled={isLoading}
        onClick={!isLoading ? handleClick : null}
    >Submit</Button>
}



export default SubmitNewButton;

import React from 'react';

import Button from 'react-bootstrap/Button';

import { queue_experiment } from './api_features'

function SubmitNewButton(props) {
    const [isLoading, setLoading] = React.useState(false);

    const handleClick = () => {
        setLoading(true);

        queue_experiment(
            props.file,
            props.class_name,
            props.repo_rev,
            props.arguments || {},
            props.pipeline || 'main',
            (response) => {
                setLoading(false);
                // Check for error in response
                if (response && response.detail) {
                    if (props.onError) {
                        props.onError(response.detail);
                    }
                }
            },
            (error) => {
                setLoading(false);
                if (props.onError) {
                    props.onError(error.message || 'Submission failed');
                }
            }
        );
    };

    return <Button
        variant="primary"
        disabled={isLoading}
        onClick={!isLoading ? handleClick : null}
    >{isLoading ? 'Submitting...' : 'Submit'}</Button>
}

export default SubmitNewButton;

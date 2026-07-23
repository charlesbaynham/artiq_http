import React from "react";

import Button from "react-bootstrap/Button";

import { queue_experiment } from "./api/client";

function SubmitNewButton(props) {
  const [isLoading, setLoading] = React.useState(false);

  const handleClick = () => {
    setLoading(true);

    queue_experiment(
      props.file,
      props.class_name,
      props.repo_rev,
      props.arguments || {},
      props.pipeline || "main",
      props.priority ?? 0,
    )
      .then((data) => {
        setLoading(false);
        // Check for error in response (ArTIQ API might return error detail in JSON)
        if (data && data.detail) {
          if (props.onError) {
            props.onError(data.detail);
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        if (props.onError) {
          props.onError(error.message || "Submission failed");
        }
      });
  };

  return (
    <Button
      variant="primary"
      disabled={isLoading}
      onClick={!isLoading ? handleClick : null}
    >
      {isLoading ? "Submitting..." : "Submit"}
    </Button>
  );
}

export default SubmitNewButton;

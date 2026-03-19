import React from "react";

import Button from "react-bootstrap/Button";

import { cancel_rid } from "./api/client";

function ScheduleCancelButton(props) {
  const [isLoading, setLoading] = React.useState(false);

  const handleClick = () => {
    setLoading(true);
    cancel_rid(props.rid)
      .then(() => {
        console.log(`RID ${props.rid} termination requested`);
        setLoading(false);
      })
      .catch((err) => {
        console.error(`Error cancelling RID ${props.rid}:`, err.message);
        setLoading(false);
      });
  };

  return (
    <Button
      variant="primary"
      disabled={isLoading}
      onClick={!isLoading ? handleClick : null}
    >
      Request Termination
    </Button>
  );
}

function ScheduleForceCancelButton(props) {
  const [isLoading, setLoading] = React.useState(false);

  const handleClick = () => {
    setLoading(true);
    cancel_rid(props.rid, true)
      .then(() => {
        console.log(`RID ${props.rid} force cancelled`);
        setLoading(false);
      })
      .catch((err) => {
        console.error(`Error force cancelling RID ${props.rid}:`, err.message);
        setLoading(false);
      });
  };

  return (
    <Button
      variant="danger"
      disabled={isLoading}
      onClick={!isLoading ? handleClick : null}
    >
      Force cancellation
    </Button>
  );
}

export { ScheduleCancelButton, ScheduleForceCancelButton };

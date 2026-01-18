import React from "react";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import PropTypes from "prop-types";

/**
 * Modal component that displays connection error states
 * Blocks UI interaction until connection is restored
 */
function ConnectionErrorModal({ errorType, show }) {
  const getErrorContent = () => {
    switch (errorType) {
      case "backend":
        return {
          title: "Backend Connection Lost",
          message: "Cannot connect to the backend server.",
          variant: "danger",
        };
      case "artiq":
        return {
          title: "ARTIQ Connection Lost",
          message: "The backend cannot connect to the ARTIQ master.",
          variant: "warning",
        };
      default:
        return null;
    }
  };

  const content = getErrorContent();

  if (!content || !show) {
    return null;
  }

  return (
    <Modal
      show={show}
      backdrop="static"
      keyboard={false}
      centered
      className="connection-error-modal"
    >
      <Modal.Header className={`bg-${content.variant} text-white`}>
        <Modal.Title>
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {content.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant={content.variant} className="mb-3">
          <strong>{content.message}</strong>
        </Alert>
        <div className="text-center">
          <Spinner animation="border" role="status" className="me-2" />
          <span>Attempting to reconnect...</span>
        </div>
        <p className="text-muted mt-3 mb-0 small">
          The interface will automatically resume once the connection is
          restored.
        </p>
      </Modal.Body>
    </Modal>
  );
}

ConnectionErrorModal.propTypes = {
  errorType: PropTypes.oneOf(["backend", "artiq", null]),
  show: PropTypes.bool.isRequired,
};

export default ConnectionErrorModal;

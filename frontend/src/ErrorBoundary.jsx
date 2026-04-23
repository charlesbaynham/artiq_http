import React from "react";
import Alert from "react-bootstrap/Alert";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="danger" className="m-3">
          <Alert.Heading>Something went wrong.</Alert.Heading>
          <p className="small">
            {this.state.error?.message || "Unknown error"}
          </p>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

import { Component } from "react";

class ErrorBoundary extends Component {
  // 1. initial state
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // 2. getDerivedStateFromError()
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // 3. componentDidCatch()
  componentDidCatch(error, info) {
    console.error("Caught render error:", error, info.componentStack);
  }

  // 4. render()
  render() {
    if (this.state.hasError) {
      return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
          <div
            className="card shadow-sm text-center p-4"
            style={{ maxWidth: "500px" }}
          >
            <div className="card-body">
              <h2 className="card-title mb-3">Something went wrong</h2>

              <p className="card-text text-muted mb-4">
                We couldn't display this page. Please try reloading the page.
              </p>

              <button
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children; // normal case: render whatever's wrapped
  }
}

export default ErrorBoundary;

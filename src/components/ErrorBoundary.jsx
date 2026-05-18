import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || "Unexpected render error" };
  }

  componentDidCatch(error, info) {
    console.error("Portfolio render failure", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="error-shell">
        <section className="error-panel">
          <p className="eyebrow">safe fallback</p>
          <h1>Something failed to render.</h1>
          <p>
            The portfolio switched to a stable fallback instead of leaving a blank page.
            Refresh once; if it repeats, check the console error below.
          </p>
          <code>{this.state.message}</code>
          <button type="button" onClick={() => window.location.reload()}>Reload</button>
        </section>
      </main>
    );
  }
}

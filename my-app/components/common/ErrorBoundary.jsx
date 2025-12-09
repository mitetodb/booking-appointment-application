import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Something went wrong.</h2>
          <p>Please refresh the page.</p>
        </section>
      );
    }

    return this.props.children;
  }
}

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  err: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { err: null };

  static getDerivedStateFromError(err: Error): State {
    return { err };
  }

  componentDidCatch(err: Error, info: ErrorInfo) {
    console.error('App error boundary:', err, info.componentStack);
  }

  render() {
    if (this.state.err) {
      return (
        <div className="app app--loading">
          <div className="load-panel load-panel--error">
            <p>Something went wrong.</p>
            <p className="load-detail">{this.state.err.message}</p>
            <button
              type="button"
              className="reveal-btn"
              style={{ marginTop: 12 }}
              onClick={() => this.setState({ err: null })}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  handleReset() {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onReset?.();
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) return this.props.fallback(this.state.error, () => this.handleReset());

    return (
      <div style={{
        background: '#0d1117', border: '1px solid #FF4D4D44', borderRadius: 10, padding: 24,
        fontFamily: 'monospace', color: '#ccc', maxWidth: 600,
      }}>
        <div style={{ color: '#FF4D4D', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>⚠ Component Error</div>
        <div style={{ color: '#888', fontSize: 12, marginBottom: 14 }}>
          {this.state.error?.message || 'An unexpected error occurred.'}
        </div>
        {this.state.errorInfo && (
          <pre style={{ color: '#555', fontSize: 10, overflow: 'auto', maxHeight: 120, marginBottom: 14 }}>
            {this.state.errorInfo.componentStack}
          </pre>
        )}
        <button onClick={() => this.handleReset()} style={{
          background: '#FF4D4D22', border: '1px solid #FF4D4D44', borderRadius: 6, color: '#FF4D4D',
          fontSize: 11, padding: '6px 14px', cursor: 'pointer',
        }}>Retry</button>
      </div>
    );
  }
}

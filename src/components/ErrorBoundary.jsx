import { Component } from 'react';

/* ── ErrorBoundary ─────────────────────────────────────────────────
   Wraps any page/component tree. On uncaught render error, shows a
   sleek recovery UI instead of a white crash screen.

   Usage:
     <ErrorBoundary>
       <MyPage />
     </ErrorBoundary>
   ─────────────────────────────────────────────────────────────── */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ info });
    // Non-intrusive console group for debugging
    console.group('🔴 AgentFlow — Render Error');
    console.error(error);
    console.info('Component stack:', info?.componentStack);
    console.groupEnd();
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, info: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const { error, info } = this.state;
    const { onNav } = this.props;

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '40px 24px',
        textAlign: 'center',
        animation: 'fadeIn 0.4s ease',
      }}>
        {/* Error icon */}
        <div style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'rgba(255,95,95,0.1)',
          border: '1px solid rgba(255,95,95,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          marginBottom: 20,
          boxShadow: '0 0 32px rgba(255,95,95,0.12)',
        }}>
          💥
        </div>

        {/* Headline */}
        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: 8 }}>
          Something crashed
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--muted)', maxWidth: 380, lineHeight: 1.65, marginBottom: 24 }}>
          This page hit an unexpected error. Your data is safe — try reloading the section or navigate elsewhere.
        </div>

        {/* Error message pill */}
        {error?.message && (
          <div style={{
            padding: '8px 16px',
            background: 'rgba(255,95,95,0.08)',
            border: '1px solid rgba(255,95,95,0.2)',
            borderRadius: 8,
            fontFamily: 'DM Mono, monospace',
            fontSize: '0.75rem',
            color: 'var(--red)',
            marginBottom: 24,
            maxWidth: 520,
            textAlign: 'left',
            wordBreak: 'break-word',
          }}>
            {error.message}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={this.handleReset}
            className="btn btn-gold btn-sm"
          >
            🔄 Try Again
          </button>
          {onNav && (
            <button
              onClick={() => { this.handleReset(); onNav('dashboard'); }}
              className="btn btn-ghost btn-sm"
            >
              🏠 Go to Dashboard
            </button>
          )}
        </div>

        {/* Collapsible stack trace */}
        {info?.componentStack && (
          <details style={{ marginTop: 28, maxWidth: 600, width: '100%', textAlign: 'left' }}>
            <summary style={{
              fontSize: '0.73rem',
              color: 'var(--muted)',
              cursor: 'pointer',
              userSelect: 'none',
              marginBottom: 8,
            }}>
              Show component stack
            </summary>
            <pre style={{
              fontSize: '0.68rem',
              color: 'var(--muted)',
              fontFamily: 'DM Mono, monospace',
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '12px 14px',
              overflow: 'auto',
              maxHeight: 220,
              lineHeight: 1.6,
            }}>
              {info.componentStack.trim()}
            </pre>
          </details>
        )}
      </div>
    );
  }
}

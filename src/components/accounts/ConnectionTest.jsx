// ConnectionTest.jsx — Test platform connection component
export function ConnectionTest({ account, result, onTest, testing }) {
  return (
    <div style={{ fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onTest} disabled={testing || !account.apiKey} style={{ background: testing ? '#1e2340' : '#0d1520', border: '1px solid #1e2340', borderRadius: 8, color: testing ? '#555' : '#00FFAA', fontSize: 12, padding: '8px 16px', cursor: testing || !account.apiKey ? 'not-allowed' : 'pointer', opacity: !account.apiKey ? 0.4 : 1 }}>
          {testing ? '⟳ Testing...' : '→ Test Connection'}
        </button>
        {result && (
          <span style={{ color: result.success ? '#00FF88' : '#FF4D4D', fontSize: 12 }}>
            {result.success ? '✓ Connected' : `✗ ${result.error || 'Failed'}`}
          </span>
        )}
      </div>
    </div>
  );
}

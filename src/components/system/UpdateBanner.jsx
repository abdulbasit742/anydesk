import React from 'react';

export function UpdateBanner({ version, changelog, onUpdate, onDismiss }) {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div style={{
      background: 'linear-gradient(90deg, #00FFAA11 0%, #0066FF11 100%)',
      borderBottom: '1px solid #00FFAA33', padding: '8px 16px',
      display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'monospace',
    }}>
      <span style={{ color: '#00FFAA', fontSize: 12 }}>⬆</span>
      <div style={{ flex: 1, color: '#aaa', fontSize: 12 }}>
        <span style={{ color: '#00FFAA', fontWeight: 600 }}>v{version}</span> is available
        {changelog && <span style={{ color: '#555' }}> — {changelog}</span>}
      </div>
      <button onClick={onUpdate} style={{
        background: '#00FFAA', border: 'none', borderRadius: 5, color: '#000',
        fontSize: 11, padding: '4px 12px', cursor: 'pointer', fontWeight: 600,
      }}>Update Now</button>
      <button onClick={handleDismiss} style={{
        background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 16, padding: 0,
      }}>×</button>
    </div>
  );
}

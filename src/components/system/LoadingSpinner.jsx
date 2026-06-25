// LoadingSpinner.jsx — Animated spinner with optional label
export function LoadingSpinner({ size = 32, color = '#00FFAA', label, fullscreen = false }) {
  const spinner = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, fontFamily: 'monospace' }}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <circle cx="16" cy="16" r="12" fill="none" stroke="#1e2340" strokeWidth="3" />
        <circle cx="16" cy="16" r="12" fill="none" stroke={color} strokeWidth="3"
          strokeDasharray="37.7" strokeDashoffset="28" strokeLinecap="round"
          style={{ transformOrigin: '16px 16px', animation: 'spin 0.8s linear infinite' }} />
      </svg>
      {label && <div style={{ color: '#888', fontSize: 12 }}>{label}</div>}
    </div>
  );

  if (!fullscreen) return spinner;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#080c14cc', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 9990,
    }}>{spinner}</div>
  );
}

export function InlineSpinner({ size = 14, color = '#00FFAA' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <circle cx="16" cy="16" r="12" fill="none" stroke="#1e2340" strokeWidth="4" />
      <circle cx="16" cy="16" r="12" fill="none" stroke={color} strokeWidth="4"
        strokeDasharray="37.7" strokeDashoffset="28" strokeLinecap="round"
        style={{ transformOrigin: '16px 16px', animation: 'spin 0.8s linear infinite' }} />
    </svg>
  );
}

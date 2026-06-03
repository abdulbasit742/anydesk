// EmptyState.jsx — Placeholder for empty lists, zero-data views
export function EmptyState({ icon = '◇', title, description, action }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '48px 24px', fontFamily: 'monospace', textAlign: 'center',
    }}>
      <div style={{ fontSize: 36, marginBottom: 16, opacity: 0.3 }}>{icon}</div>
      <div style={{ color: '#ccc', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{title}</div>
      {description && <div style={{ color: '#555', fontSize: 12, maxWidth: 320, lineHeight: 1.6, marginBottom: 20 }}>{description}</div>}
      {action && (
        <button onClick={action.onClick} style={{
          background: '#00FFAA22', border: '1px solid #00FFAA44', borderRadius: 7, color: '#00FFAA',
          fontSize: 12, padding: '8px 20px', cursor: 'pointer',
        }}>{action.label}</button>
      )}
    </div>
  );
}

// HistoryList.jsx — Broadcast history with replay
export function HistoryList({ history = [], onReplay }) {
  if (!history.length) return <div style={{ color: '#333', fontSize: 12, fontFamily: 'monospace', padding: 20, textAlign: 'center' }}>No broadcast history</div>;

  return (
    <div style={{ fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: 6 }}>
      {history.slice(0, 20).map((h, i) => (
        <div key={i} style={{ background: '#0d1020', border: '1px solid #1e2340', borderRadius: 8, padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#ccc', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.prompt?.slice(0, 80)}...</div>
            <div style={{ color: '#444', fontSize: 11, marginTop: 4 }}>{new Date(h.ts).toLocaleString()} · {h.accounts?.length || 0} accounts</div>
          </div>
          <button onClick={() => onReplay?.(h)} style={{ background: '#1e2340', border: 'none', borderRadius: 6, color: '#00FFAA', fontSize: 11, padding: '4px 10px', cursor: 'pointer', flexShrink: 0 }}>Replay</button>
        </div>
      ))}
    </div>
  );
}

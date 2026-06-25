// PlatformBreakdown.jsx — Per-platform account distribution
import PlatformPie from '../telemetry/PlatformPie.jsx';
import { resolveAll } from '../../hooks/usePlatformResolver.js';

export function PlatformBreakdown({ accounts = [] }) {
  const platformMap = resolveAll();
  const counts = {};
  accounts.forEach(a => { counts[a.platform] = (counts[a.platform] || 0) + 1; });

  const data = Object.entries(counts).map(([id, count]) => ({
    id, count, label: platformMap[id]?.label || id, color: platformMap[id]?.color || '#888',
  }));

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontFamily: 'monospace' }}>
      <PlatformPie platforms={data} size={100} />
      <div style={{ flex: 1 }}>
        {data.map(d => (
          <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color, flexShrink: 0 }} />
            <span style={{ color: '#aaa', fontSize: 12, flex: 1 }}>{d.label}</span>
            <span style={{ color: '#555', fontSize: 12 }}>{d.count}</span>
          </div>
        ))}
        {!data.length && <p style={{ color: '#333', fontSize: 12 }}>No accounts yet</p>}
      </div>
    </div>
  );
}

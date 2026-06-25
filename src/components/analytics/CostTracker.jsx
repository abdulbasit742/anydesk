// CostTracker.jsx — Token cost tracker per platform
import TokenBurnBar from '../telemetry/TokenBurnBar.jsx';
import { resolveAll } from '../../hooks/usePlatformResolver.js';

export function CostTracker({ accounts = [] }) {
  const platformMap = resolveAll();
  const grouped = {};
  accounts.forEach(a => { if (!grouped[a.platform]) grouped[a.platform] = { used: 0, total: 1000 }; });

  const platforms = Object.entries(grouped).map(([id, stats]) => ({
    id, label: platformMap[id]?.label || id, color: platformMap[id]?.color || '#888', ...stats,
  }));

  if (!platforms.length) return <p style={{ color: '#333', fontSize: 12, fontFamily: 'monospace' }}>No cost data yet</p>;

  return (
    <div>
      {platforms.map(p => <TokenBurnBar key={p.id} label={p.label} used={p.used} total={p.total} color={p.color} />)}
    </div>
  );
}

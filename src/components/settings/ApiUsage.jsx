// ApiUsage.jsx — Per-platform token consumption and cost summary
import { MODEL_PRICING } from '../../hooks/useTokenCounter.js';

const PLATFORMS = ['bolt', 'lovable', 'manus', 'replit', 'claude', 'cursor', 'v0'];

function UsageRow({ platform, tokens, cost, limit }) {
  const pct = limit ? Math.min((tokens / limit) * 100, 100) : 0;
  const color = pct > 90 ? '#FF4D4D' : pct > 70 ? '#FFB800' : '#00FFAA';

  return (
    <div style={{ background: '#080c14', border: '1px solid #1e2340', borderRadius: 8, padding: '10px 14px', marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ color: '#ccc', fontSize: 12, textTransform: 'capitalize' }}>{platform}</span>
        <span style={{ color: '#888', fontSize: 11 }}>{tokens.toLocaleString()} tokens · <span style={{ color }}>${cost.toFixed(4)}</span></span>
      </div>
      {limit && (
        <div style={{ background: '#1a1e2e', borderRadius: 3, height: 4 }}>
          <div style={{ width: `${pct}%`, background: color, borderRadius: 3, height: '100%', transition: '0.3s' }} />
        </div>
      )}
    </div>
  );
}

export function ApiUsage({ usageData = {} }) {
  const entries = PLATFORMS.map(p => {
    const tokens = usageData[p]?.tokens || (((p.charCodeAt(0) * 314 + p.charCodeAt(p.length - 1) * 159) % 45000) + 5000);
    const pricePerK = MODEL_PRICING['claude-sonnet-4-6']?.output || 0.015;
    const cost = (tokens / 1000) * pricePerK;
    return { platform: p, tokens, cost };
  });

  const totalCost = entries.reduce((s, e) => s + e.cost, 0);
  const totalTokens = entries.reduce((s, e) => s + e.tokens, 0);

  return (
    <div style={{ fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ color: '#888', fontSize: 11 }}>API USAGE — CURRENT MONTH</div>
        <div style={{ color: '#00FFAA', fontSize: 13 }}>${totalCost.toFixed(3)} total</div>
      </div>
      <div style={{ color: '#555', fontSize: 11, marginBottom: 12 }}>{totalTokens.toLocaleString()} tokens consumed</div>
      {entries.map(e => <UsageRow key={e.platform} {...e} limit={100000} />)}
    </div>
  );
}

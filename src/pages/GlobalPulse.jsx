import { useState, useEffect } from 'react';

const TRENDING = [
  { rank: 1, topic: 'bolt.new automation', delta: +42 },
  { rank: 2, topic: 'API rate limit increase', delta: +31 },
  { rank: 3, topic: 'bulk broadcast beta', delta: +28 },
  { rank: 4, topic: 'OAuth v2 migration', delta: +19 },
  { rank: 5, topic: 'EU region launch', delta: +14 },
];

const TICKER_EVENTS = [
  'Broadcast #4823 completed — 2,100 accounts',
  'New account: acme@enterprise.io (Pro plan)',
  'Scheduler recovered after 8m downtime',
  'ML Engine auto-scaled to 6 pods',
  'API call volume crossed 10M today',
  'EU region latency p95: 44ms',
  'New OAuth app authorized: Linear integration',
  'Quota alert: aria@acme.io at 89%',
  '3 new Vault entries created',
  'Broadcast #4824 queued: 800 targets',
];

const GRID_REGIONS = [
  ['NA', 'NA', 'EU', 'EU', 'AS'],
  ['NA', 'NA', 'EU', 'ME', 'AS'],
  ['LA', 'NA', 'AF', 'EU', 'OC'],
];
const REGION_COLORS = { NA: '#22d3ee', EU: '#a78bfa', AS: '#f5b731', LA: '#60a5fa', ME: '#ef4444', AF: '#6e7191', OC: '#22d3ee' };
const LATENCIES = { NA: 42, EU: 88, AS: 112, LA: 134, ME: 156, AF: 210, OC: 198 };

function PulseRing({ size, active }) {
  const rings = [0.35, 0.55, 0.75, 0.95];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'absolute', top: 0, left: 0 }}>
      {rings.map((r, i) => (
        <circle key={i} cx={size / 2} cy={size / 2} r={(size / 2) * r}
          fill="none" stroke="#22d3ee" strokeWidth="1"
          opacity={active ? 0.15 + i * 0.04 : 0.05}
          style={{ animation: active ? `pulse-ring ${1.5 + i * 0.4}s ease-out infinite` : 'none', animationDelay: `${i * 0.3}s` }}
        />
      ))}
      <circle cx={size / 2} cy={size / 2} r={22} fill="rgba(34,211,238,0.15)" stroke="#22d3ee" strokeWidth="2" />
      <circle cx={size / 2} cy={size / 2} r={10} fill="#22d3ee" />
    </svg>
  );
}

export default function GlobalPulse() {
  const [activeUsers, setActiveUsers] = useState(4827);
  const [broadcastsPerMin, setBroadcastsPerMin] = useState(12);
  const [apiCallsPerSec, setApiCallsPerSec] = useState(284);
  const [tickerIdx, setTickerIdx] = useState(0);
  const [pulseActive, setPulseActive] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveUsers(v => v + Math.floor((Math.random() - 0.48) * 20));
      setBroadcastsPerMin(v => Math.max(5, v + Math.floor((Math.random() - 0.5) * 4)));
      setApiCallsPerSec(v => Math.max(100, v + Math.floor((Math.random() - 0.5) * 30)));
      setTickerIdx(i => (i + 1) % TICKER_EVENTS.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const PULSE_SIZE = 200;

  return (
    <div style={{ minHeight: '100vh', background: '#0e0e16', color: '#fff', fontFamily: 'Inter, sans-serif', paddingBottom: 60 }}>
      <style>{`@keyframes pulse-ring { 0% { r: 0; opacity: 0.6; } 100% { opacity: 0; } }`}</style>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#1d1d28,#0e0e16)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '48px 40px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 6px', background: 'linear-gradient(90deg,#22d3ee,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Global Pulse</h1>
            <p style={{ color: '#6e7191', margin: '0 0 24px', fontSize: 15 }}>Real-time platform vitals and global activity indicators.</p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[
                { label: 'Active Users', value: activeUsers.toLocaleString(), color: '#22d3ee', icon: '●' },
                { label: 'Broadcasts/min', value: broadcastsPerMin, color: '#a78bfa', icon: '📡' },
                { label: 'API calls/sec', value: apiCallsPerSec, color: '#f5b731', icon: '⚡' },
              ].map(stat => (
                <div key={stat.label} style={{ background: `${stat.color}10`, border: `1px solid ${stat.color}40`, borderRadius: 12, padding: '14px 22px', minWidth: 140 }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: '#6e7191', marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pulse animation */}
          <div style={{ position: 'relative', width: PULSE_SIZE, height: PULSE_SIZE, flexShrink: 0, cursor: 'pointer' }} onClick={() => setPulseActive(a => !a)}>
            <PulseRing size={PULSE_SIZE} active={pulseActive} />
          </div>
        </div>
      </div>

      <div style={{ padding: '28px 40px' }}>
        {/* Ticker */}
        <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14, overflow: 'hidden' }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: '#ef4444', background: 'rgba(239,68,68,0.15)', padding: '3px 8px', borderRadius: 6, flexShrink: 0, textTransform: 'uppercase', letterSpacing: 1 }}>LIVE</span>
          <div style={{ fontSize: 13, color: '#ccc', flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {TICKER_EVENTS[tickerIdx]}
          </div>
          <div style={{ fontSize: 11, color: '#6e7191', flexShrink: 0 }}>{TICKER_EVENTS[(tickerIdx + 1) % TICKER_EVENTS.length]}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
          {/* Trending Topics */}
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#a78bfa', marginBottom: 14, letterSpacing: 1, textTransform: 'uppercase' }}>Trending Topics</h2>
            <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
              {TRENDING.map(t => (
                <div key={t.rank} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: t.rank === 1 ? '#f5b731' : '#6e7191', width: 24 }}>#{t.rank}</span>
                  <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{t.topic}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#22d3ee', background: 'rgba(34,211,238,0.1)', padding: '3px 10px', borderRadius: 10 }}>+{t.delta}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Latency World Map Grid */}
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#a78bfa', marginBottom: 14, letterSpacing: 1, textTransform: 'uppercase' }}>Latency Map</h2>
            <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 22px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 20 }}>
                {GRID_REGIONS.flat().map((reg, i) => (
                  <div key={i} style={{ background: `${REGION_COLORS[reg]}20`, border: `1px solid ${REGION_COLORS[reg]}40`, borderRadius: 8, padding: '10px 6px', textAlign: 'center' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: REGION_COLORS[reg] }}>{reg}</div>
                    <div style={{ fontSize: 10, color: '#6e7191', marginTop: 3 }}>{LATENCIES[reg]}ms</div>
                  </div>
                ))}
              </div>
              {Object.entries(LATENCIES).map(([region, ms]) => (
                <div key={region} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 28, fontSize: 11, fontWeight: 700, color: REGION_COLORS[region] }}>{region}</div>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 6 }}>
                    <div style={{ width: `${Math.min(100, ms / 2.5)}%`, height: '100%', background: ms < 100 ? '#22d3ee' : ms < 150 ? '#f5b731' : '#ef4444', borderRadius: 4 }} />
                  </div>
                  <div style={{ width: 48, textAlign: 'right', fontSize: 12, fontWeight: 700, color: ms < 100 ? '#22d3ee' : ms < 150 ? '#f5b731' : '#ef4444' }}>{ms}ms</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

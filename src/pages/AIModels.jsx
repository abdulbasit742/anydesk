import { useState, useEffect, useRef } from 'react';

// ─── CSS VARIABLES (inline) ───────────────────────────────────────────────────
const C = {
  gold: '#f5b731',
  teal: '#22d3ee',
  purple: '#a78bfa',
  surface: '#0e0e16',
  surface2: '#16161e',
  surface3: '#1d1d28',
  border: 'rgba(255,255,255,0.07)',
  muted: '#6e7191',
  red: '#ef4444',
  green: '#22c55e',
  yellow: '#facc15',
  text: '#e2e8f0',
  white: '#ffffff',
};

// ─── STATIC DATA (module scope) ───────────────────────────────────────────────
const MODELS = [
  { id: 1, name: 'GPT-4o', provider: 'OpenAI', icon: '🤖', latency: '320ms', cost: '$0.0050', context: '128K', status: 'Active', mmlu: 88, humaneval: 90, math: 76 },
  { id: 2, name: 'Claude 3.5', provider: 'Anthropic', icon: '🧠', latency: '410ms', cost: '$0.0030', context: '200K', status: 'Active', mmlu: 90, humaneval: 88, math: 78 },
  { id: 3, name: 'Gemini 1.5 Pro', provider: 'Google', icon: '✨', latency: '280ms', cost: '$0.0035', context: '1M', status: 'Active', mmlu: 86, humaneval: 84, math: 80 },
  { id: 4, name: 'Llama 3.1', provider: 'Meta', icon: '🦙', latency: '190ms', cost: '$0.0009', context: '128K', status: 'Standby', mmlu: 83, humaneval: 81, math: 70 },
  { id: 5, name: 'Mistral Large', provider: 'Mistral', icon: '🌪️', latency: '230ms', cost: '$0.0024', context: '128K', status: 'Standby', mmlu: 81, humaneval: 79, math: 66 },
  { id: 6, name: 'Mixtral 8x7B', provider: 'Mistral', icon: '⚡', latency: '150ms', cost: '$0.0007', context: '32K', status: 'Standby', mmlu: 70, humaneval: 60, math: 28 },
  { id: 7, name: 'Command R+', provider: 'Cohere', icon: '📡', latency: '350ms', cost: '$0.0030', context: '128K', status: 'Standby', mmlu: 75, humaneval: 71, math: 55 },
  { id: 8, name: 'Grok-1', provider: 'xAI', icon: '🔮', latency: '400ms', cost: '$0.0020', context: '128K', status: 'Deprecated', mmlu: 73, humaneval: 63, math: 48 },
  { id: 9, name: 'Phi-3.5', provider: 'Microsoft', icon: '💠', latency: '120ms', cost: '$0.0003', context: '128K', status: 'Standby', mmlu: 69, humaneval: 64, math: 59 },
  { id: 10, name: 'DeepSeek-V2', provider: 'DeepSeek', icon: '🌊', latency: '200ms', cost: '$0.0001', context: '128K', status: 'Standby', mmlu: 78, humaneval: 73, math: 75 },
  { id: 11, name: 'Qwen2.5', provider: 'Alibaba', icon: '🐉', latency: '180ms', cost: '$0.0002', context: '128K', status: 'Standby', mmlu: 80, humaneval: 77, math: 74 },
  { id: 12, name: 'Yi-Lightning', provider: '01.AI', icon: '⚡', latency: '160ms', cost: '$0.0001', context: '200K', status: 'Deprecated', mmlu: 72, humaneval: 65, math: 57 },
];

const RACE_MODELS = [
  { id: 0, name: 'GPT-4o', color: C.gold },
  { id: 1, name: 'Claude 3.5', color: C.teal },
  { id: 2, name: 'Gemini 1.5', color: C.purple },
  { id: 3, name: 'Llama 3.1', color: C.green },
  { id: 4, name: 'Mistral', color: '#f97316' },
  { id: 5, name: 'DeepSeek', color: '#ec4899' },
];

const API_KEYS_INITIAL = [
  { id: 1, provider: 'OpenAI', icon: '🤖', key: 'sk-proj-xK9mN2pL7qR4vT8wY1zA3bC5dE6fG0hI', connected: true },
  { id: 2, provider: 'Anthropic', icon: '🧠', key: 'sk-ant-api03-xK9mN2pL7qR4vT8wY1zA3bC5', connected: true },
  { id: 3, provider: 'Google', icon: '✨', key: 'AIzaSyXk9mN2pL7qR4vT8wY1zA3bC5dE6fG0h', connected: false },
  { id: 4, provider: 'Mistral', icon: '🌪️', key: 'msk-xK9mN2pL7qR4vT8wY1zA3bC5dE6fG0h', connected: true },
  { id: 5, provider: 'Cohere', icon: '📡', key: 'co-xK9mN2pL7qR4vT8wY1zA3bC5dE6fG0hI', connected: false },
  { id: 6, provider: 'DeepSeek', icon: '🌊', key: 'dsk-xK9mN2pL7qR4vT8wY1zA3bC5dE6fG0', connected: true },
];

const USAGE_DATA = [
  { model: 'GPT-4o', calls: [120, 145, 98, 210, 176, 88, 201], tokens: 4800000, spend: 24.00 },
  { model: 'Claude 3.5', calls: [80, 90, 110, 130, 95, 140, 120], tokens: 3200000, spend: 9.60 },
  { model: 'Gemini 1.5', calls: [60, 75, 85, 95, 70, 80, 90], tokens: 2100000, spend: 7.35 },
  { model: 'Llama 3.1', calls: [200, 220, 180, 250, 230, 190, 210], tokens: 1500000, spend: 1.35 },
  { model: 'DeepSeek', calls: [30, 40, 35, 55, 45, 50, 60], tokens: 900000, spend: 0.09 },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const statusColor = (s) => s === 'Active' ? C.green : s === 'Standby' ? C.yellow : C.red;

function maskKey(key) {
  if (key.length <= 8) return '••••••••';
  return key.slice(0, 6) + '•'.repeat(Math.min(key.length - 10, 20)) + key.slice(-4);
}

// ─── SUB-COMPONENTS (all at module scope) ─────────────────────────────────────

function HeroBadge({ label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.surface3, border: `1px solid ${C.border}`, borderRadius: 20, padding: '6px 14px' }}>
      <span style={{ color: C.gold, fontWeight: 700, fontSize: 15 }}>{value}</span>
      <span style={{ color: C.muted, fontSize: 13 }}>{label}</span>
    </div>
  );
}

function MiniBar({ value, color }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 5, width: '100%', overflow: 'hidden' }}>
      <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.6s ease' }} />
    </div>
  );
}

function ModelCard({ model, onClick }) {
  const [hovered, setHovered] = useState(false);
  const active = model.status === 'Active';
  const borderColor = active ? C.gold : hovered ? C.teal : C.border;
  const glowColor = active ? `0 0 18px ${C.gold}44` : hovered ? `0 0 14px ${C.teal}33` : 'none';

  return (
    <div
      onClick={() => onClick(model)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.surface2,
        border: `1px solid ${borderColor}`,
        borderRadius: 14,
        padding: 18,
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        boxShadow: glowColor,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: active ? `linear-gradient(90deg, ${C.gold}, transparent)` : hovered ? `linear-gradient(90deg, ${C.teal}, transparent)` : 'transparent' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>{model.icon}</span>
          <div>
            <div style={{ color: C.white, fontWeight: 700, fontSize: 14, fontFamily: 'Syne, sans-serif' }}>{model.name}</div>
            <div style={{ color: C.muted, fontSize: 11 }}>{model.provider}</div>
          </div>
        </div>
        <span style={{ background: `${statusColor(model.status)}22`, color: statusColor(model.status), border: `1px solid ${statusColor(model.status)}55`, borderRadius: 8, fontSize: 10, padding: '2px 8px', fontWeight: 600 }}>
          {model.status}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        <span style={{ background: C.surface3, color: C.teal, borderRadius: 6, fontSize: 10, padding: '2px 7px', fontFamily: 'DM Mono, monospace' }}>{model.latency}</span>
        <span style={{ background: C.surface3, color: C.gold, borderRadius: 6, fontSize: 10, padding: '2px 7px', fontFamily: 'DM Mono, monospace' }}>{model.cost}/1k</span>
        <span style={{ background: C.surface3, color: C.purple, borderRadius: 6, fontSize: 10, padding: '2px 7px' }}>{model.context}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 12 }}>
        {[['MMLU', model.mmlu, C.teal], ['HumanEval', model.humaneval, C.purple], ['MATH', model.math, C.gold]].map(([label, val, col]) => (
          <div key={label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
              <span style={{ color: C.muted, fontSize: 10 }}>{label}</span>
              <span style={{ color: col, fontSize: 10, fontFamily: 'DM Mono, monospace' }}>{val}</span>
            </div>
            <MiniBar value={val} color={col} />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        <button
          onClick={(e) => { e.stopPropagation(); }}
          style={{ flex: 1, background: active ? `${C.gold}22` : C.surface3, border: `1px solid ${active ? C.gold : C.border}`, color: active ? C.gold : C.muted, borderRadius: 8, padding: '5px 0', fontSize: 11, cursor: 'pointer', fontFamily: 'DM Mono, monospace', transition: 'all 0.2s' }}
        >
          {active ? '✓ Active' : 'Set Active'}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); }}
          style={{ flex: 1, background: C.surface3, border: `1px solid ${C.border}`, color: C.teal, borderRadius: 8, padding: '5px 0', fontSize: 11, cursor: 'pointer', transition: 'all 0.2s' }}
        >
          Benchmark
        </button>
      </div>
    </div>
  );
}

function ModelDrawer({ model, onClose }) {
  if (!model) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }} onClick={onClose}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative', width: 420, background: C.surface2, borderLeft: `1px solid ${C.border}`, height: '100%', overflowY: 'auto', padding: 28, fontFamily: 'DM Mono, monospace' }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, background: C.surface3, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 13 }}>✕ Close</button>
        <div style={{ fontSize: 36, marginBottom: 8 }}>{model.icon}</div>
        <h2 style={{ color: C.white, fontFamily: 'Syne, sans-serif', fontSize: 24, margin: '0 0 4px' }}>{model.name}</h2>
        <p style={{ color: C.muted, fontSize: 13, margin: '0 0 20px' }}>{model.provider}</p>
        <span style={{ background: `${statusColor(model.status)}22`, color: statusColor(model.status), border: `1px solid ${statusColor(model.status)}55`, borderRadius: 8, fontSize: 11, padding: '3px 10px', fontWeight: 600 }}>{model.status}</span>

        <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[['Latency', model.latency, C.teal], ['Cost/1K', model.cost, C.gold], ['Context', model.context, C.purple], ['MMLU', model.mmlu, C.teal], ['HumanEval', model.humaneval, C.purple], ['MATH Score', model.math, C.gold]].map(([k, v, col]) => (
            <div key={k} style={{ background: C.surface3, borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>{k}</div>
              <div style={{ color: col, fontSize: 16, fontWeight: 700 }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24 }}>
          <h3 style={{ color: C.white, fontSize: 14, marginBottom: 12 }}>Benchmark Scores</h3>
          {[['MMLU', model.mmlu, C.teal], ['HumanEval', model.humaneval, C.purple], ['MATH', model.math, C.gold]].map(([label, val, col]) => (
            <div key={label} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: C.muted, fontSize: 12 }}>{label}</span>
                <span style={{ color: col, fontSize: 12 }}>{val}/100</span>
              </div>
              <MiniBar value={val} color={col} />
            </div>
          ))}
        </div>

        <button style={{ marginTop: 20, width: '100%', background: `linear-gradient(135deg, ${C.gold}, #d97706)`, color: '#000', border: 'none', borderRadius: 10, padding: '12px', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
          Set as Primary Model
        </button>
      </div>
    </div>
  );
}

function BenchmarkRace() {
  const [progress, setProgress] = useState([0, 0, 0, 0, 0, 0]);
  const [running, setRunning] = useState(false);
  const [winner, setWinner] = useState(null);
  const intervalRef = useRef(null);
  const speedsRef = useRef([]);

  const startRace = () => {
    setWinner(null);
    setProgress([0, 0, 0, 0, 0, 0]);
    speedsRef.current = RACE_MODELS.map(() => Math.floor(Math.random() * 3) + 1);
    setRunning(true);
  };

  const resetRace = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setWinner(null);
    setProgress([0, 0, 0, 0, 0, 0]);
  };

  useEffect(() => {
    if (!running) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev.map((p, i) => {
          const bump = Math.floor(Math.random() * 4) + speedsRef.current[i];
          return Math.min(p + bump, 100);
        });
        if (next.some((v) => v >= 100)) {
          clearInterval(intervalRef.current);
          setRunning(false);
          const winIdx = next.indexOf(Math.max(...next));
          setWinner(RACE_MODELS[winIdx]);
        }
        return next;
      });
    }, 500);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  return (
    <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, marginBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ color: C.white, fontFamily: 'Syne, sans-serif', fontSize: 20, margin: 0 }}>⚡ Live Benchmark Race</h2>
          <p style={{ color: C.muted, fontSize: 13, margin: '4px 0 0' }}>Real-time model performance comparison</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={resetRace} style={{ background: C.surface3, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 10, padding: '8px 18px', cursor: 'pointer', fontSize: 13 }}>Reset</button>
          <button onClick={startRace} disabled={running} style={{ background: running ? C.surface3 : `linear-gradient(135deg, ${C.gold}, #d97706)`, color: running ? C.muted : '#000', border: 'none', borderRadius: 10, padding: '8px 22px', cursor: running ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 13, transition: 'all 0.2s' }}>
            {running ? '🏃 Racing...' : '🚀 Start Race'}
          </button>
        </div>
      </div>

      {winner && (
        <div style={{ background: `${C.gold}18`, border: `1px solid ${C.gold}55`, borderRadius: 12, padding: '12px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>🏆</span>
          <div>
            <div style={{ color: C.gold, fontWeight: 700, fontSize: 15 }}>Winner: {winner.name} 🎉🎊</div>
            <div style={{ color: C.muted, fontSize: 12 }}>Reached 100% first — fastest model in this race</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {RACE_MODELS.map((m, i) => (
          <div key={m.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: m.color, fontWeight: 600, fontSize: 14 }}>{m.name}</span>
              <span style={{ color: C.muted, fontSize: 12, fontFamily: 'DM Mono, monospace' }}>{progress[i]}%</span>
            </div>
            <div style={{ background: C.surface3, borderRadius: 8, height: 18, overflow: 'hidden', position: 'relative' }}>
              <div style={{ width: `${progress[i]}%`, height: '100%', background: `linear-gradient(90deg, ${m.color}88, ${m.color})`, borderRadius: 8, transition: 'width 0.5s ease', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 4 }}>
                {progress[i] > 10 && <span style={{ fontSize: 10 }}>🏁</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CostCalculator() {
  const [tokens, setTokens] = useState(100000);

  const costs = MODELS.map((m) => {
    const costPer1k = parseFloat(m.cost.replace('$', ''));
    const totalCost = (tokens / 1000) * costPer1k;
    const monthly = totalCost * 30;
    return { name: m.name, icon: m.icon, costPer1k, totalCost, monthly };
  }).sort((a, b) => a.costPer1k - b.costPer1k);

  const cheapest = costs[0];

  return (
    <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, marginBottom: 28 }}>
      <h2 style={{ color: C.white, fontFamily: 'Syne, sans-serif', fontSize: 20, margin: '0 0 20px' }}>💰 Cost Calculator</h2>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <label style={{ color: C.muted, fontSize: 13 }}>Token Count</label>
          <span style={{ color: C.gold, fontFamily: 'DM Mono, monospace', fontSize: 14 }}>{tokens.toLocaleString()} tokens</span>
        </div>
        <input
          type="range" min={1000} max={1000000} step={1000} value={tokens}
          onChange={(e) => setTokens(Number(e.target.value))}
          style={{ width: '100%', accentColor: C.gold }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ color: C.muted, fontSize: 11 }}>1K</span>
          <span style={{ color: C.muted, fontSize: 11 }}>1M</span>
        </div>
      </div>

      <div style={{ background: `${C.green}18`, border: `1px solid ${C.green}44`, borderRadius: 10, padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 18 }}>💡</span>
        <span style={{ color: C.green, fontSize: 13 }}>Cheapest: <strong>{cheapest.name}</strong> — ${cheapest.totalCost.toFixed(4)} for {tokens.toLocaleString()} tokens</span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'DM Mono, monospace' }}>
          <thead>
            <tr>
              {['Model', 'Cost/1K', 'This Run', 'Monthly Est.'].map((h) => (
                <th key={h} style={{ color: C.muted, fontWeight: 500, padding: '8px 12px', textAlign: 'left', borderBottom: `1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {costs.slice(0, 8).map((c, i) => (
              <tr key={c.name} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: '8px 12px', color: i === 0 ? C.green : C.text }}>{c.icon} {c.name}{i === 0 ? ' ⭐' : ''}</td>
                <td style={{ padding: '8px 12px', color: C.gold }}>${c.costPer1k.toFixed(4)}</td>
                <td style={{ padding: '8px 12px', color: C.teal }}>${c.totalCost.toFixed(4)}</td>
                <td style={{ padding: '8px 12px', color: C.purple }}>${c.monthly.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ApiKeyManager() {
  const [keys, setKeys] = useState(API_KEYS_INITIAL);
  const [visible, setVisible] = useState({});
  const [testing, setTesting] = useState({});
  const [copied, setCopied] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKey, setNewKey] = useState({ provider: '', key: '' });

  const toggleVisible = (id) => setVisible((v) => ({ ...v, [id]: !v[id] }));

  const testConnection = (id) => {
    setTesting((t) => ({ ...t, [id]: 'testing' }));
    setTimeout(() => {
      setTesting((t) => ({ ...t, [id]: 'done' }));
      setTimeout(() => setTesting((t) => ({ ...t, [id]: null })), 2000);
    }, 800);
  };

  const copyKey = (id, key) => {
    navigator.clipboard.writeText(key).catch(() => {});
    setCopied((c) => ({ ...c, [id]: true }));
    setTimeout(() => setCopied((c) => ({ ...c, [id]: false })), 1500);
  };

  const addKey = () => {
    if (!newKey.provider || !newKey.key) return;
    setKeys((k) => [...k, { id: Date.now(), provider: newKey.provider, icon: '🔑', key: newKey.key, connected: false }]);
    setNewKey({ provider: '', key: '' });
    setShowAddForm(false);
  };

  return (
    <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, marginBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ color: C.white, fontFamily: 'Syne, sans-serif', fontSize: 20, margin: 0 }}>🔐 API Key Manager</h2>
        <button onClick={() => setShowAddForm((s) => !s)} style={{ background: `${C.teal}22`, border: `1px solid ${C.teal}55`, color: C.teal, borderRadius: 10, padding: '7px 16px', cursor: 'pointer', fontSize: 13 }}>
          {showAddForm ? 'Cancel' : '+ Add Key'}
        </button>
      </div>

      {showAddForm && (
        <div style={{ background: C.surface3, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input placeholder="Provider name" value={newKey.provider} onChange={(e) => setNewKey((k) => ({ ...k, provider: e.target.value }))}
            style={{ flex: 1, minWidth: 140, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 12px', color: C.text, fontSize: 13, outline: 'none' }} />
          <input placeholder="API key" value={newKey.key} onChange={(e) => setNewKey((k) => ({ ...k, key: e.target.value }))}
            style={{ flex: 2, minWidth: 200, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 12px', color: C.text, fontSize: 13, fontFamily: 'DM Mono, monospace', outline: 'none' }} />
          <button onClick={addKey} style={{ background: C.gold, color: '#000', border: 'none', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>Add</button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {keys.map((k) => (
          <div key={k.id} style={{ background: C.surface3, border: `1px solid ${k.connected ? `${C.green}33` : C.border}`, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 20 }}>{k.icon}</span>
            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ color: C.white, fontWeight: 600, fontSize: 14 }}>{k.provider}</div>
              <div style={{ color: k.connected ? C.green : C.red, fontSize: 11, marginTop: 2 }}>{k.connected ? '● Connected' : '○ Not Connected'}</div>
            </div>
            <div style={{ flex: 2, fontFamily: 'DM Mono, monospace', fontSize: 12, color: C.muted, background: C.surface2, borderRadius: 8, padding: '6px 12px', minWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {visible[k.id] ? k.key : maskKey(k.key)}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => toggleVisible(k.id)} style={{ background: C.surface2, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontSize: 12 }}>
                {visible[k.id] ? '🙈' : '👁'}
              </button>
              <button onClick={() => copyKey(k.id, k.key)} style={{ background: copied[k.id] ? `${C.green}22` : C.surface2, border: `1px solid ${copied[k.id] ? C.green : C.border}`, color: copied[k.id] ? C.green : C.muted, borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontSize: 12 }}>
                {copied[k.id] ? '✓' : '📋'}
              </button>
              <button onClick={() => testConnection(k.id)} style={{ background: testing[k.id] === 'done' ? `${C.green}22` : C.surface2, border: `1px solid ${testing[k.id] === 'done' ? C.green : C.border}`, color: testing[k.id] === 'done' ? C.green : testing[k.id] === 'testing' ? C.gold : C.muted, borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontSize: 12 }}>
                {testing[k.id] === 'testing' ? '⏳' : testing[k.id] === 'done' ? '✓' : '🔌'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RadarChart({ modelA, modelB }) {
  const axes = ['Speed', 'Quality', 'Context', 'Cost', 'Safety', 'Reasoning'];
  const cx = 130, cy = 130, r = 100;
  const n = axes.length;
  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const valA = [82, modelA.mmlu, 70, 60, 85, 78];
  const valB = [75, modelB.mmlu, 80, 85, 80, 72];

  const toXY = (i, val) => {
    const a = angle(i);
    const len = (val / 100) * r;
    return { x: cx + len * Math.cos(a), y: cy + len * Math.sin(a) };
  };

  const polyPoints = (vals) => vals.map((v, i) => { const p = toXY(i, v); return `${p.x},${p.y}`; }).join(' ');
  const gridPoints = (pct) => Array.from({ length: n }, (_, i) => { const a = angle(i); return `${cx + pct * r * Math.cos(a)},${cy + pct * r * Math.sin(a)}`; }).join(' ');

  return (
    <svg width={260} height={260} style={{ display: 'block', margin: '0 auto' }}>
      {[0.25, 0.5, 0.75, 1].map((pct) => (
        <polygon key={pct} points={gridPoints(pct)} fill="none" stroke={C.border} strokeWidth={1} />
      ))}
      {axes.map((ax, i) => {
        const a = angle(i);
        return (
          <g key={ax}>
            <line x1={cx} y1={cy} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} stroke={C.border} strokeWidth={1} />
            <text x={cx + (r + 14) * Math.cos(a)} y={cy + (r + 14) * Math.sin(a)} fill={C.muted} fontSize={10} textAnchor="middle" dominantBaseline="middle">{ax}</text>
          </g>
        );
      })}
      <polygon points={polyPoints(valA)} fill={`${C.gold}28`} stroke={C.gold} strokeWidth={2} />
      <polygon points={polyPoints(valB)} fill={`${C.teal}28`} stroke={C.teal} strokeWidth={2} />
    </svg>
  );
}

function ComparisonMatrix() {
  const [idxA, setIdxA] = useState(0);
  const [idxB, setIdxB] = useState(1);
  const modelA = MODELS[idxA];
  const modelB = MODELS[idxB];

  return (
    <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, marginBottom: 28 }}>
      <h2 style={{ color: C.white, fontFamily: 'Syne, sans-serif', fontSize: 20, margin: '0 0 20px' }}>🔍 Model Comparison Matrix</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        {[['Model A', idxA, setIdxA, C.gold], ['Model B', idxB, setIdxB, C.teal]].map(([label, val, setter, col]) => (
          <div key={label} style={{ flex: 1, minWidth: 180 }}>
            <label style={{ color: col, fontSize: 12, display: 'block', marginBottom: 6 }}>{label}</label>
            <select value={val} onChange={(e) => setter(Number(e.target.value))}
              style={{ width: '100%', background: C.surface3, border: `1px solid ${col}55`, borderRadius: 10, padding: '9px 12px', color: C.text, fontSize: 13, outline: 'none', cursor: 'pointer' }}>
              {MODELS.map((m, i) => <option key={m.id} value={i}>{m.icon} {m.name}</option>)}
            </select>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ flex: '0 0 260px' }}>
          <RadarChart modelA={modelA} modelB={modelB} />
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 3, background: C.gold, borderRadius: 2 }} />
              <span style={{ color: C.gold, fontSize: 11 }}>{modelA.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 3, background: C.teal, borderRadius: 2 }} />
              <span style={{ color: C.teal, fontSize: 11 }}>{modelB.name}</span>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 220 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'DM Mono, monospace' }}>
            <thead>
              <tr>
                <th style={{ color: C.muted, padding: '8px 10px', textAlign: 'left', borderBottom: `1px solid ${C.border}` }}>Metric</th>
                <th style={{ color: C.gold, padding: '8px 10px', textAlign: 'left', borderBottom: `1px solid ${C.border}` }}>{modelA.name}</th>
                <th style={{ color: C.teal, padding: '8px 10px', textAlign: 'left', borderBottom: `1px solid ${C.border}` }}>{modelB.name}</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Provider', modelA.provider, modelB.provider],
                ['Latency', modelA.latency, modelB.latency],
                ['Cost/1K', modelA.cost, modelB.cost],
                ['Context', modelA.context, modelB.context],
                ['MMLU', modelA.mmlu, modelB.mmlu],
                ['HumanEval', modelA.humaneval, modelB.humaneval],
                ['MATH', modelA.math, modelB.math],
                ['Status', modelA.status, modelB.status],
              ].map(([label, a, b]) => (
                <tr key={label} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '8px 10px', color: C.muted }}>{label}</td>
                  <td style={{ padding: '8px 10px', color: C.text }}>{a}</td>
                  <td style={{ padding: '8px 10px', color: C.text }}>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function UsageAnalytics() {
  const maxCalls = Math.max(...USAGE_DATA.flatMap((d) => d.calls));
  const barColors = [C.gold, C.teal, C.purple, C.green, '#f97316'];
  const chartW = 560, chartH = 160, padL = 30, padB = 30, padT = 10;

  const barW = Math.floor((chartW - padL) / (USAGE_DATA.length * DAYS.length + USAGE_DATA.length));
  const groupW = barW * USAGE_DATA.length + barW;

  return (
    <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, marginBottom: 28 }}>
      <h2 style={{ color: C.white, fontFamily: 'Syne, sans-serif', fontSize: 20, margin: '0 0 20px' }}>📊 Usage Analytics</h2>

      <div style={{ overflowX: 'auto', marginBottom: 28 }}>
        <svg width={chartW} height={chartH + padB + padT} style={{ display: 'block' }}>
          {[0.25, 0.5, 0.75, 1].map((pct) => {
            const y = padT + (1 - pct) * chartH;
            return (
              <g key={pct}>
                <line x1={padL} y1={y} x2={chartW} y2={y} stroke={C.border} strokeWidth={1} />
                <text x={padL - 4} y={y} fill={C.muted} fontSize={9} textAnchor="end" dominantBaseline="middle">{Math.round(pct * maxCalls)}</text>
              </g>
            );
          })}
          {DAYS.map((day, di) => {
            const gx = padL + di * groupW;
            return (
              <g key={day}>
                {USAGE_DATA.map((model, mi) => {
                  const h = (model.calls[di] / maxCalls) * chartH;
                  const x = gx + mi * barW;
                  const y = padT + chartH - h;
                  return <rect key={mi} x={x} y={y} width={barW - 2} height={h} fill={barColors[mi]} opacity={0.8} rx={2} />;
                })}
                <text x={gx + groupW / 2} y={padT + chartH + 14} fill={C.muted} fontSize={10} textAnchor="middle">{day}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {USAGE_DATA.map((d, i) => (
          <div key={d.model} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: barColors[i] }} />
            <span style={{ color: C.muted, fontSize: 11 }}>{d.model}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
        {USAGE_DATA.map((d, i) => (
          <div key={d.model} style={{ background: C.surface3, border: `1px solid ${barColors[i]}33`, borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ color: barColors[i], fontWeight: 600, fontSize: 13 }}>{d.model}</span>
              <span style={{ color: C.muted, fontSize: 11 }}>${d.spend.toFixed(2)}/mo</span>
            </div>
            <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>Total Tokens</div>
            <div style={{ color: C.white, fontFamily: 'DM Mono, monospace', fontSize: 14, fontWeight: 700 }}>{(d.tokens / 1_000_000).toFixed(1)}M</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function AIModels() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [scanOffset, setScanOffset] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setScanOffset((o) => (o + 1) % 200), 30);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: C.surface, color: C.text, fontFamily: 'DM Mono, monospace', padding: '0 0 60px' }}>

      {/* ── HERO ── */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${C.surface2} 0%, ${C.surface} 100%)`,
        borderBottom: `1px solid ${C.border}`,
        padding: '48px 40px 40px',
        marginBottom: 36,
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${C.gold}, ${C.teal}, transparent)`, backgroundSize: '200% 100%', backgroundPositionX: `${scanOffset}%`, transition: 'background-position-x 0.03s linear' }} />
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 20% 50%, ${C.gold}08 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, ${C.teal}08 0%, transparent 60%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <span style={{ fontSize: 36 }}>🤖</span>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 36, fontWeight: 800, background: `linear-gradient(135deg, ${C.white}, ${C.gold})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
              AI Model Hub
            </h1>
          </div>
          <p style={{ color: C.muted, fontSize: 15, margin: '0 0 20px' }}>Manage, benchmark, and compare your AI model integrations in real time.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <HeroBadge value="12" label="Models" />
            <HeroBadge value="3" label="Active" />
            <HeroBadge value="99.2%" label="Uptime" />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>

        {/* ── MODEL CARDS GRID ── */}
        <h2 style={{ color: C.white, fontFamily: 'Syne, sans-serif', fontSize: 20, margin: '0 0 16px' }}>🗂️ Model Library</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 16, marginBottom: 36 }}>
          {MODELS.map((m) => (
            <ModelCard key={m.id} model={m} onClick={setSelectedModel} />
          ))}
        </div>

        {/* ── BENCHMARK RACE ── */}
        <BenchmarkRace />

        {/* ── COST CALCULATOR ── */}
        <CostCalculator />

        {/* ── API KEY MANAGER ── */}
        <ApiKeyManager />

        {/* ── COMPARISON MATRIX ── */}
        <ComparisonMatrix />

        {/* ── USAGE ANALYTICS ── */}
        <UsageAnalytics />
      </div>

      {/* ── DRAWER ── */}
      {selectedModel && <ModelDrawer model={selectedModel} onClose={() => setSelectedModel(null)} />}
    </div>
  );
}

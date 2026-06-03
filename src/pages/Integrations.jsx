import { useState, useCallback, useRef, useEffect } from 'react';
import { sound } from '../lib/soundEngine';

/* ─────────────────────────────────────────────────────────────────── */
/*  Platform data                                                       */
/* ─────────────────────────────────────────────────────────────────── */
const PLATFORMS = [
  { id: 'bolt',    name: 'Bolt',    icon: '⚡', color: '#f59e0b', version: 'v2.4.1', rateLimit: 78, connected: true,  lastSync: '2 min ago',  desc: 'AI full-stack web development platform' },
  { id: 'lovable', name: 'Lovable', icon: '💜', color: '#ec4899', version: 'v1.8.0', rateLimit: 45, connected: true,  lastSync: '8 min ago',  desc: 'AI-powered UI and app builder' },
  { id: 'manus',   name: 'Manus',   icon: '🤖', color: '#8b5cf6', version: 'v3.0.2', rateLimit: 91, connected: true,  lastSync: '1 min ago',  desc: 'Autonomous AI agent platform' },
  { id: 'replit',  name: 'Replit',  icon: '🔵', color: '#10b981', version: 'v2.1.5', rateLimit: 32, connected: false, lastSync: '3 hrs ago',  desc: 'Collaborative browser-based IDE' },
  { id: 'claude',  name: 'Claude',  icon: '🧠', color: '#f97316', version: 'v3.5-s', rateLimit: 60, connected: true,  lastSync: '5 min ago',  desc: 'Anthropic conversational AI model' },
  { id: 'cursor',  name: 'Cursor',  icon: '🎯', color: '#3b82f6', version: 'v0.42',  rateLimit: 55, connected: true,  lastSync: '12 min ago', desc: 'AI-first code editor with pair programming' },
  { id: 'v0',      name: 'v0',      icon: '🌊', color: '#06b6d4', version: 'v1.0.0', rateLimit: 20, connected: false, lastSync: '1 day ago',  desc: "Vercel's generative UI component builder" },
];

/* ─────────────────────────────────────────────────────────────────── */
/*  Webhook seed data                                                   */
/* ─────────────────────────────────────────────────────────────────── */
const EVENT_TYPES = [
  { value: 'broadcast.sent',      label: 'broadcast.sent' },
  { value: 'account.connected',   label: 'account.connected' },
  { value: 'workflow.completed',  label: 'workflow.completed' },
  { value: 'prompt.used',         label: 'prompt.used' },
];

function makeLog(status, offsetMinutes) {
  const ts = new Date(Date.now() - (offsetMinutes || 10) * 60000).toISOString();
  return { status, ts };
}

const SEED_WEBHOOKS = [
  {
    id: 'wh1',
    url: 'https://hooks.zapier.com/hooks/catch/12345/abcdef/',
    event: 'broadcast.sent',
    active: true,
    lastTriggered: '3 min ago',
    deliveries: 142,
    logs: [
      makeLog(200, 10), makeLog(200, 20), makeLog(200, 30), makeLog(500, 40), makeLog(200, 50),
    ],
  },
  {
    id: 'wh2',
    url: 'https://api.slack.com/webhooks/T01234/B56789/XYZSecret',
    event: 'account.connected',
    active: true,
    lastTriggered: '1 hr ago',
    deliveries: 37,
    logs: [
      makeLog(200, 60), makeLog(200, 70), makeLog(408, 80), makeLog(200, 90), makeLog(200, 100),
    ],
  },
  {
    id: 'wh3',
    url: 'https://webhook.site/unique-token-here-999',
    event: 'workflow.completed',
    active: false,
    lastTriggered: '2 days ago',
    deliveries: 8,
    logs: [
      makeLog(200, 120), makeLog(503, 240), makeLog(503, 360), makeLog(200, 480), makeLog(200, 600),
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────── */
/*  Helpers                                                             */
/* ─────────────────────────────────────────────────────────────────── */
function statusColor(code) {
  if (code >= 200 && code < 300) return '#10b981';
  if (code >= 400 && code < 500) return '#f59e0b';
  return '#f43f5e';
}

function RateLimitBar({ value, color }) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: 5, borderRadius: 3, background: '#1e293b', overflow: 'hidden', marginTop: 4 }}>
        <div style={{ height: '100%', borderRadius: 3, width: `${value}%`, background: value > 80 ? 'var(--red,#f43f5e)' : value > 50 ? 'var(--gold,#f59e0b)' : color, transition: 'width 0.6s ease' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#475569', marginTop: 2 }}>
        <span>Rate Limit Usage</span>
        <span style={{ color: value > 80 ? 'var(--red,#f43f5e)' : '#64748b' }}>{value}%</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/*  Delivery Log Popover                                                */
/* ─────────────────────────────────────────────────────────────────── */
function DeliveryLogPopover({ logs, onClose }) {
  const ref = useRef();
  useEffect(() => {
    function handle(e) { if (ref.current && !ref.current.contains(e.target)) onClose(); }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [onClose]);

  return (
    <div ref={ref} style={{
      position: 'absolute', top: '100%', right: 0, zIndex: 200,
      background: '#0f1621', border: '1px solid #2dd4bf33',
      borderRadius: 12, padding: '1rem', width: 280, marginTop: 6,
      boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
    }}>
      <div style={{ fontSize: '0.72rem', color: '#2dd4bf', fontWeight: 700, marginBottom: '0.6rem', fontFamily: 'Syne, sans-serif' }}>
        Last 5 Delivery Attempts
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {logs.map((log, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem' }}>
            <span style={{ color: '#475569', fontFamily: 'DM Mono, monospace' }}>
              {new Date(log.ts).toLocaleTimeString('en-US', { hour12: false })}
            </span>
            <span style={{
              padding: '2px 8px', borderRadius: 6,
              background: `${statusColor(log.status)}22`,
              color: statusColor(log.status),
              fontFamily: 'DM Mono, monospace', fontWeight: 700, fontSize: '0.68rem',
            }}>
              HTTP {log.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/*  Add Webhook Modal                                                   */
/* ─────────────────────────────────────────────────────────────────── */
function AddWebhookModal({ onClose, onAdd }) {
  const [url, setUrl] = useState('');
  const [event, setEvent] = useState(EVENT_TYPES[0].value);
  const [secret, setSecret] = useState('');
  const [err, setErr] = useState('');

  const inputStyle = {
    width: '100%', padding: '0.55rem 0.8rem',
    background: '#0d1117', border: '1px solid #1e293b',
    borderRadius: 8, color: '#e2e8f0',
    fontFamily: 'DM Mono, monospace', fontSize: '0.8rem',
    outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle = { fontSize: '0.72rem', color: '#64748b', marginBottom: 6, display: 'block' };

  function handleSubmit(e) {
    e.preventDefault();
    if (!url.trim().startsWith('http')) { setErr('URL must start with http:// or https://'); return; }
    onAdd({ id: 'wh' + Date.now(), url: url.trim(), event, secret: secret.trim(), active: true, lastTriggered: 'Never', deliveries: 0, logs: [] });
    onClose();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: '#131720', border: '1px solid #2dd4bf33', borderRadius: 18, padding: '2rem', width: 480, maxWidth: '95vw' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#e2e8f0' }}>
            🔗 Add Webhook
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#475569', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Endpoint URL *</label>
            <input style={inputStyle} placeholder="https://hooks.example.com/…" value={url} onChange={e => { setUrl(e.target.value); setErr(''); }} />
          </div>
          <div>
            <label style={labelStyle}>Event Type</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={event} onChange={e => setEvent(e.target.value)}>
              {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Secret Key (optional — used for HMAC signing)</label>
            <input style={inputStyle} placeholder="whsec_…" value={secret} onChange={e => setSecret(e.target.value)} />
          </div>
          {err && <div style={{ fontSize: '0.75rem', color: '#f43f5e' }}>{err}</div>}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: 4 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '0.6rem', borderRadius: 8, border: '1px solid #1e293b', background: 'transparent', color: '#64748b', cursor: 'pointer', fontFamily: 'DM Mono, monospace', fontSize: '0.8rem' }}>
              Cancel
            </button>
            <button type="submit" style={{ flex: 2, padding: '0.6rem', borderRadius: 8, border: '1px solid #2dd4bf55', background: 'linear-gradient(135deg,#0f3d3a,#1a4a4a)', color: '#2dd4bf', cursor: 'pointer', fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', fontWeight: 700 }}>
              ＋ Register Webhook
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/*  Toast                                                               */
/* ─────────────────────────────────────────────────────────────────── */
function Toast({ msg, ok, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{
      position: 'fixed', bottom: 32, right: 32, zIndex: 2000,
      background: ok ? '#0f2e22' : '#2e0f14',
      border: `1px solid ${ok ? '#10b98155' : '#f43f5e55'}`,
      borderRadius: 12, padding: '0.9rem 1.4rem',
      color: ok ? '#10b981' : '#f43f5e',
      fontFamily: 'DM Mono, monospace', fontSize: '0.82rem',
      boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
      animation: 'fadeIn 0.25s ease',
      display: 'flex', alignItems: 'center', gap: '0.6rem',
    }}>
      <span style={{ fontSize: '1rem' }}>{ok ? '✓' : '✕'}</span>
      {msg}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/*  Webhook Row                                                         */
/* ─────────────────────────────────────────────────────────────────── */
function WebhookRow({ wh, onToggle, onTest, onDelete, testing }) {
  const [showLog, setShowLog] = useState(false);

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 160px 80px 120px 100px 140px',
      alignItems: 'center', gap: '0.75rem',
      padding: '0.85rem 1.1rem',
      background: '#0d1117', border: '1px solid #1e293b',
      borderRadius: 10, fontSize: '0.78rem',
    }}>
      {/* URL */}
      <div style={{ overflow: 'hidden' }}>
        <div style={{ color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'DM Mono, monospace', fontSize: '0.72rem' }}>{wh.url}</div>
        <div style={{ color: '#475569', fontSize: '0.65rem', marginTop: 2 }}>id: {wh.id}</div>
      </div>

      {/* Event */}
      <span style={{ padding: '3px 10px', borderRadius: 20, background: '#1e293b', color: '#2dd4bf', fontSize: '0.67rem', fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap' }}>
        {wh.event}
      </span>

      {/* Status badge */}
      <span style={{
        padding: '3px 10px', borderRadius: 20, fontSize: '0.67rem', fontWeight: 700, textAlign: 'center',
        background: wh.active ? '#10b98122' : '#f43f5e22',
        color: wh.active ? '#10b981' : '#f43f5e',
      }}>
        {wh.active ? 'active' : 'paused'}
      </span>

      {/* Last triggered */}
      <span style={{ color: '#475569', fontSize: '0.68rem' }}>{wh.lastTriggered}</span>

      {/* Deliveries + log popover */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>{wh.deliveries}</span>
        <button
          onClick={() => setShowLog(v => !v)}
          style={{ background: 'none', border: '1px solid #1e293b', borderRadius: 6, color: '#64748b', cursor: 'pointer', fontSize: '0.62rem', padding: '2px 6px' }}
        >
          📋 log
        </button>
        {showLog && wh.logs.length > 0 && <DeliveryLogPopover logs={wh.logs} onClose={() => setShowLog(false)} />}
        {showLog && wh.logs.length === 0 && (
          <div style={{ position: 'absolute', top: '100%', right: 0, zIndex: 200, background: '#0f1621', border: '1px solid #2dd4bf33', borderRadius: 12, padding: '0.8rem', fontSize: '0.72rem', color: '#475569', whiteSpace: 'nowrap', marginTop: 6 }}>
            No deliveries yet
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
        <button
          onClick={() => onTest(wh.id)}
          disabled={testing === wh.id}
          style={{ padding: '3px 8px', borderRadius: 6, border: '1px solid #2dd4bf44', background: '#2dd4bf11', color: '#2dd4bf', cursor: testing === wh.id ? 'wait' : 'pointer', fontSize: '0.65rem', fontFamily: 'DM Mono, monospace' }}
        >
          {testing === wh.id ? '⟳' : '⚡ test'}
        </button>
        <button
          onClick={() => onToggle(wh.id)}
          style={{ padding: '3px 8px', borderRadius: 6, border: `1px solid ${wh.active ? '#f43f5e44' : '#10b98144'}`, background: wh.active ? '#f43f5e11' : '#10b98111', color: wh.active ? '#f43f5e' : '#10b981', cursor: 'pointer', fontSize: '0.65rem', fontFamily: 'DM Mono, monospace' }}
        >
          {wh.active ? '⏸' : '▶'}
        </button>
        <button
          onClick={() => onDelete(wh.id)}
          style={{ padding: '3px 8px', borderRadius: 6, border: '1px solid #f43f5e22', background: 'transparent', color: '#f43f5e66', cursor: 'pointer', fontSize: '0.65rem' }}
        >
          🗑
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/*  Platform Card                                                       */
/* ─────────────────────────────────────────────────────────────────── */
function PlatformCard({ p, onToggle, onTest, pingState }) {
  const s = {
    card: { background: 'var(--surface,#131720)', border: `1px solid ${p.connected ? `${p.color}33` : '#1e293b'}`, borderRadius: 16, padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'border-color 0.3s' },
    head: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
    iconBox: { width: 44, height: 44, borderRadius: 12, background: `${p.color}15`, border: `1px solid ${p.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 },
    name: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#e2e8f0' },
    ver: { fontSize: '0.68rem', color: '#475569', marginTop: 1 },
    statusDot: { width: 8, height: 8, borderRadius: '50%', background: p.connected ? '#10b981' : '#f43f5e', marginLeft: 'auto', flexShrink: 0, boxShadow: p.connected ? '0 0 6px #10b98155' : 'none' },
    statusLabel: { fontSize: '0.7rem', color: p.connected ? '#10b981' : '#f43f5e', marginLeft: 4 },
    desc: { fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 },
    meta: { fontSize: '0.72rem', color: '#475569' },
    actions: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: 'auto' },
    testBtn: { flex: 1, padding: '0.45rem 0', borderRadius: 8, border: `1px solid ${p.color}55`, background: `${p.color}10`, color: p.color, cursor: 'pointer', fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', transition: 'all 0.2s', textAlign: 'center' },
    guideBtn: { flex: 1, padding: '0.45rem 0', borderRadius: 8, border: '1px solid #334155', background: 'transparent', color: '#64748b', cursor: 'pointer', fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', textAlign: 'center' },
    toggleBtn: { flex: 1, padding: '0.45rem 0', borderRadius: 8, border: `1px solid ${p.connected ? '#f43f5e55' : '#10b98155'}`, background: p.connected ? '#f43f5e10' : '#10b98110', color: p.connected ? '#f43f5e' : '#10b981', cursor: 'pointer', fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', textAlign: 'center' },
    pingResult: { fontSize: '0.72rem', textAlign: 'center', marginTop: -4, color: pingState?.status === 'ok' ? '#10b981' : pingState?.status === 'fail' ? '#f43f5e' : '#64748b', minHeight: 16 },
  };

  const pingText = pingState?.status === 'pinging' ? '⟳ Pinging…' : pingState?.status === 'ok' ? `✓ ${p.name} reachable — ${pingState.latency}ms` : pingState?.status === 'fail' ? '✕ Connection failed' : '';

  return (
    <div style={s.card}>
      <div style={s.head}>
        <div style={s.iconBox}>{p.icon}</div>
        <div>
          <div style={s.name}>{p.name}</div>
          <div style={s.ver}>{p.version}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
          <div style={s.statusDot} />
          <span style={s.statusLabel}>{p.connected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>
      <div style={s.desc}>{p.desc}</div>
      <RateLimitBar value={p.connected ? p.rateLimit : 0} color={p.color} />
      <div style={s.meta}>🕐 Last sync: {p.connected ? p.lastSync : 'N/A'}</div>
      <div style={s.actions}>
        <button style={s.testBtn} onClick={() => onTest(p.id)} disabled={pingState?.status === 'pinging'}>
          {pingState?.status === 'pinging' ? '…' : '⚡ Test'}
        </button>
        <button style={s.guideBtn}>📖 Guide</button>
        <button style={s.toggleBtn} onClick={() => onToggle(p.id)}>
          {p.connected ? '⏏ Disconnect' : '⚡ Connect'}
        </button>
      </div>
      {pingText && <div style={s.pingResult}>{pingText}</div>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/*  Main Page                                                           */
/* ─────────────────────────────────────────────────────────────────── */
export default function Integrations() {
  const [platforms, setPlatforms] = useState(PLATFORMS);
  const [pingStates, setPingStates] = useState({});
  const [webhooks, setWebhooks] = useState(SEED_WEBHOOKS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [testingWh, setTestingWh] = useState(null);
  const [toast, setToast] = useState(null); // { msg, ok }
  const [activeTab, setActiveTab] = useState('platforms'); // 'platforms' | 'webhooks'
  const [signatureKey, setSignatureKey] = useState('whsec_7d2f9b8c5a4e3d2c1b0a7d9f8e7d6c5b');

  const generateSignatureKey = () => {
    sound.play('success');
    const chars = '0123456789abcdef';
    let key = 'whsec_';
    for (let i = 0; i < 32; i++) {
      key += chars[Math.floor(Math.random() * 16)];
    }
    setSignatureKey(key);
  };

  /* ── Platform handlers ── */
  const toggleConnection = (id) => {
    setPlatforms(prev => prev.map(p => p.id === id ? { ...p, connected: !p.connected, lastSync: !p.connected ? 'just now' : p.lastSync } : p));
  };

  const testConnection = useCallback(async (id) => {
    setPingStates(prev => ({ ...prev, [id]: { status: 'pinging' } }));
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
    const plat = platforms.find(p => p.id === id);
    const latency = 80 + Math.floor(Math.random() * 120);
    setPingStates(prev => ({ ...prev, [id]: plat?.connected ? { status: 'ok', latency } : { status: 'fail' } }));
    setTimeout(() => setPingStates(prev => ({ ...prev, [id]: null })), 4000);
  }, [platforms]);

  /* ── Webhook handlers ── */
  const toggleWebhook = (id) => {
    setWebhooks(prev => prev.map(w => w.id === id ? { ...w, active: !w.active } : w));
  };

  const deleteWebhook = (id) => {
    setWebhooks(prev => prev.filter(w => w.id !== id));
  };

  const addWebhook = (wh) => {
    setWebhooks(prev => [wh, ...prev]);
  };

  const testWebhook = useCallback(async (id) => {
    setTestingWh(id);
    await new Promise(r => setTimeout(r, 1500));
    const success = Math.random() > 0.2;
    const code = success ? 200 : [500, 503, 408][Math.floor(Math.random() * 3)];
    setWebhooks(prev => prev.map(w => {
      if (w.id !== id) return w;
      const newLog = { status: code, ts: new Date().toISOString() };
      return { ...w, lastTriggered: 'just now', deliveries: w.deliveries + (success ? 1 : 0), logs: [newLog, ...w.logs].slice(0, 5) };
    }));
    setToast({ msg: success ? `✓ Test delivery succeeded — HTTP 200 OK` : `✕ Delivery failed — HTTP ${code}`, ok: success });
    setTestingWh(null);
  }, []);

  /* ── Stats ── */
  const connectedCount = platforms.filter(p => p.connected).length;
  const avgRate = Math.round(platforms.filter(p => p.connected).reduce((a, p) => a + p.rateLimit, 0) / (connectedCount || 1));
  const activeWebhooks = webhooks.filter(w => w.active).length;

  /* ── Styles ── */
  const s = {
    page: { padding: '2rem', fontFamily: 'DM Mono, monospace', color: 'var(--fg,#e2e8f0)', background: 'var(--bg,#0d0f14)', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
    titleRow: { display: 'flex', alignItems: 'center', gap: '1rem' },
    iconBox: { width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#0f2937,#1a3b5c)', border: '1px solid #3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 },
    title: { margin: 0, fontSize: '1.6rem', fontFamily: 'Syne, sans-serif', fontWeight: 700 },
    sub: { margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' },
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' },
    stat: { background: '#131720', border: '1px solid #1e293b', borderRadius: 12, padding: '1rem 1.5rem' },
    statVal: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.8rem', color: '#e2e8f0' },
    statLabel: { fontSize: '0.75rem', color: '#64748b', marginTop: 2 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.2rem' },
    tabBar: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
    tab: (active) => ({
      padding: '0.5rem 1.2rem', borderRadius: 8, border: active ? '1px solid #2dd4bf55' : '1px solid #1e293b',
      background: active ? '#2dd4bf15' : 'transparent', color: active ? '#2dd4bf' : '#64748b',
      cursor: 'pointer', fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', fontWeight: active ? 700 : 400,
      transition: 'all 0.2s',
    }),
    sectionHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
    sectionTitle: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#e2e8f0' },
    addBtn: { padding: '0.5rem 1.1rem', borderRadius: 8, border: '1px solid #2dd4bf55', background: 'linear-gradient(135deg,#0f3d3a,#1a4a4a)', color: '#2dd4bf', cursor: 'pointer', fontFamily: 'DM Mono, monospace', fontSize: '0.78rem', fontWeight: 700 },
    tableHead: { display: 'grid', gridTemplateColumns: '1fr 160px 80px 120px 100px 140px', gap: '0.75rem', padding: '0.5rem 1.1rem', fontSize: '0.65rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' },
    emptyState: { textAlign: 'center', padding: '3rem', color: '#475569', fontSize: '0.82rem', background: '#0d1117', borderRadius: 10, border: '1px dashed #1e293b' },
  };

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.titleRow}>
          <div style={s.iconBox}>🔌</div>
          <div>
            <h1 style={s.title}>Integrations</h1>
            <p style={s.sub}>Manage your AI platform connections, API keys, and webhooks</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={s.statsRow}>
        <div style={s.stat}>
          <div style={{ ...s.statVal, color: '#10b981' }}>{connectedCount}/{platforms.length}</div>
          <div style={s.statLabel}>Platforms Connected</div>
        </div>
        <div style={s.stat}>
          <div style={{ ...s.statVal, color: avgRate > 70 ? 'var(--red,#f43f5e)' : 'var(--gold,#f59e0b)' }}>{avgRate}%</div>
          <div style={s.statLabel}>Avg Rate Limit Usage</div>
        </div>
        <div style={s.stat}>
          <div style={{ ...s.statVal, color: 'var(--teal,#2dd4bf)' }}>{platforms.length - connectedCount}</div>
          <div style={s.statLabel}>Available to Connect</div>
        </div>
        <div style={s.stat}>
          <div style={{ ...s.statVal, color: '#f59e0b' }}>{activeWebhooks}/{webhooks.length}</div>
          <div style={s.statLabel}>Active Webhooks</div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={s.tabBar}>
        <button style={s.tab(activeTab === 'platforms')} onClick={() => setActiveTab('platforms')}>🔌 Platforms</button>
        <button style={s.tab(activeTab === 'webhooks')} onClick={() => setActiveTab('webhooks')}>🔗 Webhook Manager</button>
      </div>

      {/* ── Platforms tab ── */}
      {activeTab === 'platforms' && (
        <div style={s.grid}>
          {platforms.map(p => (
            <PlatformCard key={p.id} p={p} onToggle={toggleConnection} onTest={testConnection} pingState={pingStates[p.id]} />
          ))}
        </div>
      )}

      {/* ── Webhooks tab ── */}
      {activeTab === 'webhooks' && (
        <div>
          <div style={s.sectionHead}>
            <div>
              <div style={s.sectionTitle}>🔗 Webhook Manager</div>
              <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: 4 }}>
                Push real-time events to your services when things happen inside Bolt Studio Pro
              </div>
            </div>
            <button style={s.addBtn} onClick={() => setShowAddModal(true)}>＋ Add Webhook</button>
          </div>

          {/* Table header */}
          {webhooks.length > 0 && (
            <div style={s.tableHead}>
              <span>Endpoint URL</span>
              <span>Event</span>
              <span>Status</span>
              <span>Last Triggered</span>
              <span>Deliveries</span>
              <span style={{ textAlign: 'right' }}>Actions</span>
            </div>
          )}

          {/* Webhook rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {webhooks.length === 0 ? (
              <div style={s.emptyState}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔗</div>
                <div>No webhooks configured yet.</div>
                <div style={{ marginTop: '0.5rem', color: '#334155' }}>Click "＋ Add Webhook" to register your first endpoint.</div>
              </div>
            ) : (
              webhooks.map(wh => (
                <WebhookRow
                  key={wh.id}
                  wh={wh}
                  onToggle={toggleWebhook}
                  onTest={testWebhook}
                  onDelete={deleteWebhook}
                  testing={testingWh}
                />
              ))
            )}
          </div>

          {/* Info panel */}
          {webhooks.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ marginTop: '1.5rem', padding: '1rem 1.4rem', background: '#0f1a2b', border: '1px solid #1e3a5f', borderRadius: 10 }}>
                <div style={{ fontSize: '0.72rem', color: '#3b82f6', fontWeight: 700, marginBottom: 6 }}>📘 How Webhooks Work</div>
                <div style={{ fontSize: '0.72rem', color: '#475569', lineHeight: 1.7 }}>
                  When a registered event fires, Bolt Studio Pro sends an HTTP POST to your endpoint with a JSON payload.
                  Optionally provide a secret key — we'll include an <code style={{ color: '#64748b' }}>X-BSP-Signature</code> HMAC-SHA256 header so you can verify authenticity.
                  We retry failed deliveries up to 3 times with exponential backoff.
                </div>
              </div>

              {/* Webhook Signature Secret Key Generator */}
              <div style={{ padding: '1rem 1.4rem', background: 'var(--surface2,#131720)', border: '1px solid var(--border,#1e293b)', borderRadius: 10 }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--gold,#f5b731)', fontWeight: 700, marginBottom: 8 }}>🔑 Webhook Signature Secret Key Generator</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted,#64748b)', marginBottom: 12 }}>
                  Generate a cryptographically secure secret signature key to assign to your webhook endpoints.
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input
                    type="text"
                    readOnly
                    value={signatureKey}
                    style={{
                      flex: 1,
                      padding: '6px 12px',
                      background: '#0d1117',
                      border: '1px solid var(--border,#1e293b)',
                      borderRadius: 6,
                      color: '#fff',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '0.75rem',
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={() => { sound.play('click'); navigator.clipboard.writeText(signatureKey); setToast({ msg: 'Signature key copied to clipboard!', ok: true }); }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 6,
                      border: '1px solid var(--border,#1e293b)',
                      background: 'transparent',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '0.72rem',
                    }}
                  >
                    📋 Copy
                  </button>
                  <button
                    onClick={generateSignatureKey}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 6,
                      border: '1px solid rgba(245,183,49,0.3)',
                      background: 'rgba(245,183,49,0.1)',
                      color: 'var(--gold,#f5b731)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.72rem',
                    }}
                  >
                    🔄 Generate Key
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals & Overlays */}
      {showAddModal && <AddWebhookModal onClose={() => setShowAddModal(false)} onAdd={addWebhook} />}

      {/* Toast */}
      {toast && <Toast msg={toast.msg} ok={toast.ok} onDone={() => setToast(null)} />}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}

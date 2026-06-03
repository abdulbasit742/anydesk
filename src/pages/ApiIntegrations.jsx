import { useState, useEffect, useCallback } from 'react';

// ── CSS vars shim ──────────────────────────────────────────────────────────────
const C = {
  gold:    '#f5b731',
  teal:    '#22d3ee',
  purple:  '#a78bfa',
  surface: '#0e0e16',
  s2:      '#16161e',
  s3:      '#1d1d28',
  border:  'rgba(255,255,255,0.07)',
  muted:   '#6e7191',
  red:     '#ef4444',
  green:   '#22c55e',
  white:   '#e2e8f0',
  text:    '#c4c9e2',
};

// ── Seed data ──────────────────────────────────────────────────────────────────
const APIS = [
  { id:'openai',    name:'OpenAI',     emoji:'🤖', url:'https://api.openai.com/v1',      status:'Connected', latency:38,  ping:'2m ago' },
  { id:'anthropic', name:'Anthropic',  emoji:'🧠', url:'https://api.anthropic.com/v1',   status:'Connected', latency:45,  ping:'1m ago' },
  { id:'bolt',      name:'Bolt.new',   emoji:'⚡', url:'https://api.bolt.new/v1',         status:'Connected', latency:29,  ping:'5m ago' },
  { id:'lovable',   name:'Lovable',    emoji:'💜', url:'https://api.lovable.dev/v1',      status:'Pending',   latency:null,ping:'12m ago'},
  { id:'manus',     name:'Manus.im',   emoji:'🦾', url:'https://api.manus.im/v1',         status:'Connected', latency:61,  ping:'3m ago' },
  { id:'replit',    name:'Replit',     emoji:'🔄', url:'https://api.replit.com/v1',       status:'Error',     latency:999, ping:'8m ago' },
  { id:'cursor',    name:'Cursor',     emoji:'🖱️', url:'https://api.cursor.sh/v1',        status:'Connected', latency:22,  ping:'1m ago' },
  { id:'v0',        name:'V0.dev',     emoji:'🎨', url:'https://api.v0.dev/v1',           status:'Connected', latency:54,  ping:'6m ago' },
  { id:'github',    name:'GitHub',     emoji:'🐙', url:'https://api.github.com',          status:'Connected', latency:18,  ping:'<1m ago'},
  { id:'vercel',    name:'Vercel',     emoji:'▲',  url:'https://api.vercel.com',          status:'Connected', latency:31,  ping:'2m ago' },
  { id:'supabase',  name:'Supabase',   emoji:'⚙️', url:'https://api.supabase.io/v1',      status:'Connected', latency:42,  ping:'4m ago' },
  { id:'stripe',    name:'Stripe',     emoji:'💳', url:'https://api.stripe.com/v1',       status:'Error',     latency:null,ping:'15m ago'},
];

const WEBHOOKS_SEED = [
  { id:1, url:'https://myapp.com/hooks/deploy',   event:'push',    secret:'whs_••••••••a1b2', deliveries:1204, lastStatus:'200 OK', active:true  },
  { id:2, url:'https://myapp.com/hooks/pr',       event:'pull_request', secret:'whs_••••••••c3d4', deliveries:387, lastStatus:'200 OK', active:true  },
  { id:3, url:'https://myapp.com/hooks/release',  event:'release', secret:'whs_••••••••e5f6', deliveries:54,   lastStatus:'200 OK', active:false },
  { id:4, url:'https://myapp.com/hooks/issue',    event:'issues',  secret:'whs_••••••••g7h8', deliveries:992,  lastStatus:'422',    active:true  },
  { id:5, url:'https://myapp.com/hooks/stripe',   event:'payment', secret:'whsec_••••••i9j0', deliveries:2107, lastStatus:'200 OK', active:true  },
  { id:6, url:'https://myapp.com/hooks/analytics',event:'pageview',secret:'whs_••••••••k1l2', deliveries:18432,lastStatus:'200 OK', active:true  },
];

const KEYS_SEED = [
  { id:1, service:'OpenAI',    key:'sk-proj-●●●●●●●●●●●●●●●●●●●●●●●●●●●●6Xab', full:'sk-proj-abc123xyz456def789ghi012jkl345mno6Xab', added:'2025-12-01', expires:'2026-12-01', status:'Active'  },
  { id:2, service:'Anthropic', key:'sk-ant-●●●●●●●●●●●●●●●●●●●●●●●●●●●●9Ycd', full:'sk-ant-api03-abc123xyz456def789ghi012jkl34569Ycd', added:'2026-01-10', expires:'2027-01-10', status:'Active'  },
  { id:3, service:'GitHub',    key:'ghp_●●●●●●●●●●●●●●●●●●●●●●●●●●●●3Zef',    full:'ghp_abc123xyz456def789ghi012jkl3456mno3Zef',     added:'2026-02-14', expires:'Never',      status:'Active'  },
  { id:4, service:'Stripe',    key:'sk_live_●●●●●●●●●●●●●●●●●●●●●●●●●●●●7Wgh',full:'sk_live_abc123xyz456def789ghi012jkl34567Wgh',    added:'2025-11-20', expires:'2026-11-20', status:'Expiring'},
  { id:5, service:'Vercel',    key:'vercel_●●●●●●●●●●●●●●●●●●●●●●●●●●●●2Qij', full:'vercel_abc123xyz456def789ghi012jkl34562Qij',     added:'2026-03-01', expires:'Never',      status:'Active'  },
];

const AUDIT_SEED = [
  { id:1,  ts:'14:27:03', method:'GET',  endpoint:'/v1/models',            code:200, latency:38  },
  { id:2,  ts:'14:26:51', method:'POST', endpoint:'/v1/chat/completions',   code:200, latency:912 },
  { id:3,  ts:'14:25:40', method:'GET',  endpoint:'/api/github.com/repos',  code:200, latency:22  },
  { id:4,  ts:'14:24:18', method:'POST', endpoint:'/v1/stripe/charges',     code:402, latency:180 },
  { id:5,  ts:'14:23:55', method:'POST', endpoint:'/v1/completions',        code:429, latency:55  },
  { id:6,  ts:'14:22:10', method:'GET',  endpoint:'/v1/supabase/tables',    code:200, latency:44  },
  { id:7,  ts:'14:21:04', method:'DELETE',endpoint:'/v1/vercel/deploys/x', code:200, latency:31  },
  { id:8,  ts:'14:20:59', method:'POST', endpoint:'/v1/replit/run',         code:500, latency:3002},
  { id:9,  ts:'14:19:33', method:'GET',  endpoint:'/v1/bolt/projects',      code:200, latency:29  },
  { id:10, ts:'14:18:22', method:'PATCH',endpoint:'/v1/anthropic/messages', code:200, latency:601 },
];

const RATE_LIMITS = [
  { api:'OpenAI',    used:4800,  total:10000, reset:287  },
  { api:'Anthropic', used:2100,  total:5000,  reset:512  },
  { api:'GitHub',    used:4950,  total:5000,  reset:43   },
  { api:'Vercel',    used:350,   total:1000,  reset:1800 },
  { api:'Stripe',    used:180,   total:1000,  reset:3600 },
  { api:'Supabase',  used:7800,  total:10000, reset:900  },
  { api:'Cursor',    used:1200,  total:3000,  reset:600  },
  { api:'V0.dev',    used:48,    total:100,   reset:86400},
];

function generateLatency(base = 40) {
  return Array.from({ length: 30 }, () => Math.max(5, Math.round(base + (Math.random() - 0.5) * 40)));
}

// ── Small helpers ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = { Connected: C.green, Error: C.red, Pending: C.gold };
  const color = map[status] || C.muted;
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color, background: color + '22', padding: '2px 8px', borderRadius: 20, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>
      {status}
    </span>
  );
}

function Spinner() {
  return (
    <span style={{ display:'inline-block', width:14, height:14, border:`2px solid ${C.teal}33`, borderTop:`2px solid ${C.teal}`, borderRadius:'50%', animation:'spin 0.7s linear infinite', verticalAlign:'middle' }} />
  );
}

function Btn({ children, onClick, color = C.teal, small, style = {} }) {
  const [hov, setHov] = useState(false);
  const base = {
    background: hov ? color + '28' : color + '14',
    border: `1px solid ${color}44`,
    color,
    padding: small ? '4px 10px' : '6px 14px',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: small ? 11 : 13,
    fontFamily: "'DM Mono', monospace",
    fontWeight: 600,
    letterSpacing: '0.02em',
    transition: 'all 0.18s',
    ...style,
  };
  return <button style={base} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onClick}>{children}</button>;
}

function Section({ title, icon, children, accent = C.teal }) {
  return (
    <div style={{ background: C.s2, border: `1px solid ${C.border}`, borderRadius: 16, padding: '28px 32px', marginBottom: 32 }}>
      <div style={{ display:'flex', alignItems:'center', gap: 10, marginBottom: 24 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <h2 style={{ margin:0, fontSize: 18, fontWeight: 700, color: C.white, fontFamily:"'Syne', sans-serif", letterSpacing:'-0.01em' }}>{title}</h2>
        <div style={{ flex:1, height:1, background: `linear-gradient(to right, ${accent}44, transparent)`, marginLeft: 8 }} />
      </div>
      {children}
    </div>
  );
}

// ── SVG Line Chart ─────────────────────────────────────────────────────────────
function LatencyChart({ data, label }) {
  const W = 720, H = 180, PAD = 40;
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const xs = data.map((_, i) => PAD + (i / (data.length - 1)) * (W - PAD * 2));
  const ys = data.map(v => PAD + ((max - v) / (max - min + 1)) * (H - PAD * 2));
  const path = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x} ${ys[i]}`).join(' ');
  const area = `${path} L ${xs[xs.length-1]} ${H - PAD} L ${xs[0]} ${H - PAD} Z`;
  const [drawn, setDrawn] = useState(0);

  useEffect(() => {
    let active = true;
    const t1 = setTimeout(() => {
      if (active) setDrawn(0);
      const t2 = setTimeout(() => {
        if (active) setDrawn(1);
      }, 50);
      return () => clearTimeout(t2);
    }, 0);
    return () => {
      active = false;
      clearTimeout(t1);
    };
  }, [data]);

  const gridYs = [0, 0.25, 0.5, 0.75, 1].map(f => PAD + f * (H - PAD * 2));

  return (
    <div style={{ overflowX:'auto' }}>
      <svg width={W} height={H} style={{ display:'block', maxWidth:'100%', fontFamily:"'DM Mono', monospace" }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.teal} stopOpacity="0.3" />
            <stop offset="100%" stopColor={C.teal} stopOpacity="0" />
          </linearGradient>
          <clipPath id="chartClip">
            <rect x={PAD} y={PAD} width={(W - PAD * 2) * drawn} height={H - PAD * 2} style={{ transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
          </clipPath>
        </defs>
        {/* grid lines */}
        {gridYs.map((gy, i) => (
          <g key={i}>
            <line x1={PAD} y1={gy} x2={W - PAD} y2={gy} stroke={C.border} strokeWidth={1} />
            <text x={PAD - 6} y={gy + 4} textAnchor="end" fontSize={10} fill={C.muted}>
              {Math.round(max - (i / 4) * (max - min))}
            </text>
          </g>
        ))}
        {/* x-axis ticks */}
        {xs.filter((_, i) => i % 5 === 0).map((x, i) => (
          <text key={i} x={x} y={H - 6} textAnchor="middle" fontSize={10} fill={C.muted}>{i * 5}s</text>
        ))}
        {/* area fill */}
        <path d={area} fill="url(#areaGrad)" clipPath="url(#chartClip)" />
        {/* line */}
        <path d={path} fill="none" stroke={C.gold} strokeWidth={2.5} strokeLinejoin="round" clipPath="url(#chartClip)" />
        {/* dots */}
        {xs.map((x, i) => (
          <circle key={i} cx={x} cy={ys[i]} r={3} fill={C.gold} clipPath="url(#chartClip)" />
        ))}
        {/* label */}
        <text x={W / 2} y={14} textAnchor="middle" fontSize={11} fill={C.muted} fontWeight={600}>{label} — Last 30 Readings (ms)</text>
      </svg>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function ApiIntegrations() {
  // API cards state
  const [apis, setApis] = useState(APIS.map(a => ({ ...a, latencyHistory: generateLatency(a.latency || 60) })));
  const [testing, setTesting] = useState({});
  const [selectedApi, setSelectedApi] = useState('openai');

  // Webhook state
  const [webhooks, setWebhooks] = useState(WEBHOOKS_SEED);
  const [testingWh, setTestingWh] = useState({});

  // API Key state
  const [keys, setKeys] = useState(KEYS_SEED);
  const [revealed, setRevealed] = useState({});
  const [addKeyForm, setAddKeyForm] = useState({ service:'', key:'' });
  const [showAddKey, setShowAddKey] = useState(false);
  const [copied, setCopied] = useState({});

  // Rate limits — auto-update every 5s
  const [rateLimits, setRateLimits] = useState(RATE_LIMITS.map(r => ({ ...r, countdown: r.reset })));
  useEffect(() => {
    const iv = setInterval(() => {
      setRateLimits(prev => prev.map(r => ({
        ...r,
        used: Math.max(0, Math.min(r.total, r.used + Math.round((Math.random() - 0.3) * 10))),
        countdown: Math.max(0, r.countdown - 5),
      })));
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  // Request inspector
  const [inspectApi, setInspectApi] = useState('openai');
  const [inspectResult, setInspectResult] = useState({
    req: { method:'POST', url:'https://api.openai.com/v1/chat/completions', headers:{ 'Authorization':'Bearer sk-...', 'Content-Type':'application/json' }, body:{ model:'gpt-4o', messages:[{ role:'user', content:'Hello!' }] } },
    res: { status:200, time:912, body:{ id:'chatcmpl-abc', object:'chat.completion', choices:[{ message:{ role:'assistant', content:'Hi there!' } }] } },
  });
  const [replaying, setReplaying] = useState(false);

  // Audit log
  const [audit, setAudit] = useState(AUDIT_SEED);
  const [auditSearch, setAuditSearch] = useState('');

  // Health dashboard
  const [health] = useState(() =>
    APIS.slice(0,8).map(a => ({
      api: a.name,
      hours: Array.from({ length: 8 }, () => {
        const r = Math.random();
        return r > 0.85 ? 'red' : r > 0.7 ? 'yellow' : 'green';
      }),
    }))
  );

  // Import/export
  const [importJson, setImportJson] = useState('');
  const [importMsg, setImportMsg] = useState('');

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const testApi = useCallback((id) => {
    setTesting(prev => ({ ...prev, [id]: 'loading' }));
    setTimeout(() => {
      const success = Math.random() > 0.25;
      setTesting(prev => ({ ...prev, [id]: success ? 'ok' : 'fail' }));
      setApis(prev => prev.map(a => a.id === id ? {
        ...a,
        status: success ? 'Connected' : 'Error',
        latency: success ? Math.round(20 + Math.random() * 80) : null,
        ping: '<1m ago',
        latencyHistory: generateLatency(success ? Math.round(20 + Math.random() * 80) : 200),
      } : a));
      setTimeout(() => setTesting(prev => ({ ...prev, [id]: null })), 2000);
    }, 1200);
  }, []);

  const disconnectApi = useCallback((id) => {
    setApis(prev => prev.map(a => a.id === id ? { ...a, status: 'Pending', latency: null } : a));
  }, []);

  const testWebhook = (id) => {
    setTestingWh(prev => ({ ...prev, [id]: 'loading' }));
    setTimeout(() => {
      setTestingWh(prev => ({ ...prev, [id]: 'ok' }));
      setWebhooks(prev => prev.map(w => w.id === id ? { ...w, deliveries: w.deliveries + 1, lastStatus:'200 OK' } : w));
      setTimeout(() => setTestingWh(prev => ({ ...prev, [id]: null })), 2000);
    }, 900);
  };

  const toggleWebhook = (id) => setWebhooks(prev => prev.map(w => w.id === id ? { ...w, active: !w.active } : w));

  const revealKey = (id) => setRevealed(prev => ({ ...prev, [id]: !prev[id] }));

  const copyKey = (id, full) => {
    navigator.clipboard?.writeText(full).catch(() => {});
    setCopied(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [id]: false })), 1500);
  };

  const rotateKey = (id) => {
    setKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'Rotating…', key: k.key.slice(0,-4) + '????' } : k));
    setTimeout(() => setKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'Active' } : k)), 1500);
  };

  const addKey = () => {
    if (!addKeyForm.service || !addKeyForm.key) return;
    const masked = addKeyForm.key.slice(0,4) + '●'.repeat(Math.max(0, addKeyForm.key.length - 8)) + addKeyForm.key.slice(-4);
    setKeys(prev => [...prev, { id: Date.now(), service: addKeyForm.service, key: masked, full: addKeyForm.key, added: new Date().toISOString().slice(0,10), expires:'Never', status:'Active' }]);
    setAddKeyForm({ service:'', key:'' });
    setShowAddKey(false);
  };

  const replay = () => {
    setReplaying(true);
    const api = apis.find(a => a.id === inspectApi);
    setTimeout(() => {
      setInspectResult(prev => ({
        ...prev,
        res: { ...prev.res, status: Math.random() > 0.15 ? 200 : 500, time: Math.round(50 + Math.random() * 900) },
      }));
      setReplaying(false);
      const newLog = { id: Date.now(), ts: new Date().toLocaleTimeString('en-GB').slice(0,8), method: 'POST', endpoint: api?.url?.replace('https:/','') || '/v1/replay', code: 200, latency: Math.round(50+Math.random()*900) };
      setAudit(prev => [newLog, ...prev].slice(0,20));
    }, 800);
  };

  const exportConfigs = () => {
    const blob = new Blob([JSON.stringify({ apis, keys: keys.map(k=>({...k,full:'[redacted]'})), webhooks }, null, 2)], { type:'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download='api-configs.json'; a.click();
  };

  const exportCsv = () => {
    const rows = ['Timestamp,Method,Endpoint,Code,Latency(ms)', ...audit.map(r => `${r.ts},${r.method},${r.endpoint},${r.code},${r.latency}`)].join('\n');
    const blob = new Blob([rows], { type:'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download='audit-log.csv'; a.click();
  };

  const importPostman = () => {
    try {
      JSON.parse(importJson);
      setImportMsg('✅ Imported successfully — 12 requests loaded');
    } catch { setImportMsg('❌ Invalid JSON — check your Postman collection'); }
    setTimeout(() => setImportMsg(''), 3000);
  };

  // ── Derived ───────────────────────────────────────────────────────────────────
  const selectedApiData = apis.find(a => a.id === selectedApi);
  const filteredAudit = audit.filter(r =>
    auditSearch === '' || r.endpoint.includes(auditSearch) || String(r.code).includes(auditSearch) || r.method.includes(auditSearch.toUpperCase())
  );

  const sla = health.reduce((acc, api) => {
    const up = api.hours.filter(h => h === 'green').length;
    return acc + up / api.hours.length;
  }, 0) / health.length * 100;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: C.surface, minHeight:'100vh', fontFamily:"'DM Mono', monospace", color: C.text, padding:'32px 40px', boxSizing:'border-box' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:6px; height:6px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:${C.muted}55; border-radius:4px; }
        input, textarea, select { outline:none; }
      `}</style>

      {/* ── 1. HERO ────────────────────────────────────────────────────────────── */}
      <div style={{ background:'linear-gradient(135deg, #0e0e16 0%, #16161e 40%, #1a1024 100%)', border:`1px solid ${C.border}`, borderRadius:20, padding:'40px 48px', marginBottom:32, position:'relative', overflow:'hidden', animation:'fadeIn 0.5s ease' }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:320, height:320, background:`radial-gradient(circle, ${C.gold}18 0%, transparent 70%)`, pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-60, left:200, width:240, height:240, background:`radial-gradient(circle, ${C.teal}12 0%, transparent 70%)`, pointerEvents:'none' }} />
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:24 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
              <span style={{ fontSize:36 }}>🔌</span>
              <h1 style={{ margin:0, fontSize:36, fontWeight:800, fontFamily:"'Syne',sans-serif", background:`linear-gradient(135deg, ${C.gold}, ${C.teal})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:'-0.02em' }}>API Integrations</h1>
            </div>
            <p style={{ margin:0, color:C.muted, fontSize:15 }}>Connect, test, and monitor all external APIs from one unified hub</p>
          </div>
          <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
            {[
              { label:'Connected', value:24, color:C.green  },
              { label:'Active Webhooks', value:7, color:C.teal },
              { label:'Avg Latency', value:'42ms', color:C.gold },
            ].map(b => (
              <div key={b.label} style={{ background: C.s3, border:`1px solid ${b.color}33`, borderRadius:14, padding:'14px 22px', textAlign:'center' }}>
                <div style={{ fontSize:26, fontWeight:800, fontFamily:"'Syne',sans-serif", color:b.color }}>{b.value}</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. API CARDS GRID ──────────────────────────────────────────────────── */}
      <Section title="API Connections" icon="🔗" accent={C.teal}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16 }}>
          {apis.map(api => {
            const isSelected = selectedApi === api.id;
            const glowColor = api.status === 'Connected' ? C.green : api.status === 'Error' ? C.red : C.gold;
            const testState = testing[api.id];
            return (
              <div key={api.id}
                onClick={() => setSelectedApi(api.id)}
                style={{
                  background: isSelected ? `linear-gradient(135deg, ${C.s3}, ${glowColor}10)` : C.s3,
                  border:`1px solid ${isSelected ? glowColor + '88' : glowColor + '33'}`,
                  borderRadius:14, padding:'18px 20px', cursor:'pointer',
                  boxShadow: isSelected ? `0 0 20px ${glowColor}22` : 'none',
                  transition:'all 0.2s ease', animation:'fadeIn 0.4s ease',
                }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ fontSize:24 }}>{api.emoji}</span>
                    <div>
                      <div style={{ fontWeight:700, color:C.white, fontSize:14, fontFamily:"'Syne',sans-serif" }}>{api.name}</div>
                      <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{api.url.replace('https://','')}</div>
                    </div>
                  </div>
                  <StatusBadge status={api.status} />
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                  <span style={{ fontSize:11, color:C.muted }}>Last ping: <span style={{ color:C.text }}>{api.ping}</span></span>
                  {api.latency != null && (
                    <span style={{ fontSize:11, background:`${C.teal}18`, color:C.teal, padding:'2px 8px', borderRadius:10 }}>{api.latency}ms</span>
                  )}
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <Btn small onClick={e => { e.stopPropagation(); testApi(api.id); }} color={C.teal} style={{ flex:1, textAlign:'center', justifyContent:'center', display:'flex', alignItems:'center', gap:4 }}>
                    {testState === 'loading' ? <><Spinner /> Testing…</> : testState === 'ok' ? '✅ OK' : testState === 'fail' ? '❌ Failed' : '⚡ Test'}
                  </Btn>
                  <Btn small onClick={e => { e.stopPropagation(); disconnectApi(api.id); }} color={C.red}>Disconnect</Btn>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── 3. LATENCY CHART ──────────────────────────────────────────────────── */}
      <Section title="Live Latency Chart" icon="📈" accent={C.gold}>
        <div style={{ marginBottom:16, display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:13, color:C.muted }}>Viewing:</span>
          <span style={{ fontSize:22 }}>{selectedApiData?.emoji}</span>
          <span style={{ fontSize:16, fontWeight:700, color:C.white, fontFamily:"'Syne',sans-serif" }}>{selectedApiData?.name}</span>
          {selectedApiData?.latency && <span style={{ fontSize:11, background:`${C.gold}18`, color:C.gold, padding:'3px 10px', borderRadius:10 }}>Current: {selectedApiData.latency}ms</span>}
        </div>
        <div style={{ background:C.surface, borderRadius:12, padding:'16px 12px', border:`1px solid ${C.border}` }}>
          <LatencyChart data={selectedApiData?.latencyHistory || generateLatency()} label={selectedApiData?.name || 'API'} />
        </div>
        <div style={{ display:'flex', gap:20, marginTop:12 }}>
          {[{ label:'Min', val:`${Math.min(...(selectedApiData?.latencyHistory||[0]))}ms`, color:C.green },
            { label:'Max', val:`${Math.max(...(selectedApiData?.latencyHistory||[0]))}ms`, color:C.red },
            { label:'Avg', val:`${Math.round((selectedApiData?.latencyHistory||[0]).reduce((a,b)=>a+b,0)/((selectedApiData?.latencyHistory||[1]).length))}ms`, color:C.gold }
          ].map(s => (
            <div key={s.label} style={{ background:C.s3, borderRadius:10, padding:'8px 16px', textAlign:'center' }}>
              <div style={{ fontSize:18, fontWeight:700, fontFamily:"'Syne',sans-serif", color:s.color }}>{s.val}</div>
              <div style={{ fontSize:10, color:C.muted }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 4. API KEY MANAGER ────────────────────────────────────────────────── */}
      <Section title="API Key Manager" icon="🔑" accent={C.gold}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>{['Service','API Key','Added','Expires','Status','Actions'].map(h=>(
                <th key={h} style={{ textAlign:'left', padding:'8px 12px', fontSize:11, color:C.muted, fontWeight:600, borderBottom:`1px solid ${C.border}`, letterSpacing:'0.05em' }}>{h.toUpperCase()}</th>
              ))}</tr>
            </thead>
            <tbody>
              {keys.map(k => (
                <tr key={k.id} style={{ borderBottom:`1px solid ${C.border}` }}>
                  <td style={{ padding:'12px 12px', fontWeight:700, color:C.white, fontSize:13 }}>{k.service}</td>
                  <td style={{ padding:'12px 12px', fontFamily:"'DM Mono', monospace", fontSize:12, color:C.teal }}>
                    {revealed[k.id] ? k.full : k.key}
                  </td>
                  <td style={{ padding:'12px 12px', fontSize:12, color:C.muted }}>{k.added}</td>
                  <td style={{ padding:'12px 12px', fontSize:12, color: k.expires==='Never' ? C.muted : C.gold }}>{k.expires}</td>
                  <td style={{ padding:'12px 12px' }}>
                    <span style={{ fontSize:11, color: k.status==='Active' ? C.green : k.status==='Expiring' ? C.gold : C.teal, background:(k.status==='Active'?C.green:k.status==='Expiring'?C.gold:C.teal)+'22', padding:'2px 8px', borderRadius:10 }}>{k.status}</span>
                  </td>
                  <td style={{ padding:'12px 12px' }}>
                    <div style={{ display:'flex', gap:6 }}>
                      <Btn small onClick={() => revealKey(k.id)} color={C.purple}>{revealed[k.id]?'Hide':'Reveal'}</Btn>
                      <Btn small onClick={() => copyKey(k.id, k.full)} color={C.teal}>{copied[k.id]?'Copied!':'Copy'}</Btn>
                      <Btn small onClick={() => rotateKey(k.id)} color={C.gold}>Rotate</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop:16 }}>
          {!showAddKey ? (
            <Btn onClick={() => setShowAddKey(true)} color={C.green}>+ Add New Key</Btn>
          ) : (
            <div style={{ background:C.s3, borderRadius:12, padding:20, display:'flex', gap:12, alignItems:'flex-end', flexWrap:'wrap', marginTop:8 }}>
              <div style={{ flex:'0 0 160px' }}>
                <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>Service Name</div>
                <input value={addKeyForm.service} onChange={e=>setAddKeyForm(p=>({...p,service:e.target.value}))} placeholder="e.g. OpenAI" style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:'8px 12px', color:C.white, fontSize:13, fontFamily:"'DM Mono',monospace" }} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>API Key</div>
                <input value={addKeyForm.key} onChange={e=>setAddKeyForm(p=>({...p,key:e.target.value}))} placeholder="Paste key here…" type="password" style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:'8px 12px', color:C.white, fontSize:13, fontFamily:"'DM Mono',monospace" }} />
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <Btn onClick={addKey} color={C.green}>Save</Btn>
                <Btn onClick={() => setShowAddKey(false)} color={C.muted}>Cancel</Btn>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* ── 5. WEBHOOK MANAGER ────────────────────────────────────────────────── */}
      <Section title="Webhook Manager" icon="🪝" accent={C.purple}>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {webhooks.map(wh => {
            const st = testingWh[wh.id];
            return (
              <div key={wh.id} style={{ background:C.s3, border:`1px solid ${wh.active ? C.purple+'44' : C.border}`, borderRadius:12, padding:'16px 20px', display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
                {/* toggle */}
                <div onClick={() => toggleWebhook(wh.id)} style={{ width:40, height:22, background: wh.active ? C.purple+'55' : C.border, borderRadius:11, position:'relative', cursor:'pointer', border:`1px solid ${wh.active?C.purple:C.border}`, transition:'all 0.2s', flexShrink:0 }}>
                  <div style={{ width:16, height:16, background: wh.active ? C.purple : C.muted, borderRadius:'50%', position:'absolute', top:2, left: wh.active ? 20 : 2, transition:'left 0.2s' }} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, color:C.white, fontWeight:600, marginBottom:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{wh.url}</div>
                  <div style={{ fontSize:11, color:C.muted, display:'flex', gap:16 }}>
                    <span>Event: <span style={{ color:C.purple }}>{wh.event}</span></span>
                    <span>Secret: <span style={{ color:C.teal }}>{wh.secret}</span></span>
                    <span>Deliveries: <span style={{ color:C.white }}>{wh.deliveries.toLocaleString()}</span></span>
                  </div>
                </div>
                <span style={{ fontSize:11, padding:'2px 8px', borderRadius:10, background:(wh.lastStatus==='200 OK'?C.green:C.red)+'22', color:wh.lastStatus==='200 OK'?C.green:C.red }}>{wh.lastStatus}</span>
                <Btn small onClick={() => testWebhook(wh.id)} color={C.teal}>
                  {st==='loading'?<><Spinner/> Firing…</>:st==='ok'?'✅ 200 OK':'▶ Test Delivery'}
                </Btn>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── 6. REQUEST INSPECTOR ─────────────────────────────────────────────── */}
      <Section title="Request Inspector" icon="🔬" accent={C.teal}>
        <div style={{ display:'flex', gap:12, marginBottom:20, alignItems:'center' }}>
          <select value={inspectApi} onChange={e=>setInspectApi(e.target.value)} style={{ background:C.s3, border:`1px solid ${C.border}`, color:C.white, padding:'8px 14px', borderRadius:8, fontFamily:"'DM Mono',monospace", fontSize:13 }}>
            {apis.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <Btn onClick={replay} color={C.teal}>
            {replaying ? <><Spinner /> Replaying…</> : '↺ Replay Request'}
          </Btn>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <div>
            <div style={{ fontSize:11, color:C.muted, marginBottom:8, letterSpacing:'0.05em' }}>REQUEST</div>
            <div style={{ background:C.surface, borderRadius:10, padding:16, border:`1px solid ${C.border}` }}>
              <div style={{ marginBottom:8 }}>
                <span style={{ background:`${C.teal}22`, color:C.teal, padding:'2px 8px', borderRadius:6, fontSize:12, fontWeight:700, marginRight:8 }}>{inspectResult.req.method}</span>
                <span style={{ fontSize:12, color:C.white }}>{inspectResult.req.url}</span>
              </div>
              <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>Headers</div>
              <pre style={{ margin:0, fontSize:11, color:C.text, background:C.s3, borderRadius:8, padding:10, overflow:'auto', maxHeight:120 }}>{JSON.stringify(inspectResult.req.headers, null, 2)}</pre>
              <div style={{ fontSize:11, color:C.muted, margin:'10px 0 4px' }}>Body</div>
              <pre style={{ margin:0, fontSize:11, color:C.text, background:C.s3, borderRadius:8, padding:10, overflow:'auto', maxHeight:120 }}>{JSON.stringify(inspectResult.req.body, null, 2)}</pre>
            </div>
          </div>
          <div>
            <div style={{ fontSize:11, color:C.muted, marginBottom:8, letterSpacing:'0.05em' }}>RESPONSE</div>
            <div style={{ background:C.surface, borderRadius:10, padding:16, border:`1px solid ${C.border}` }}>
              <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:10 }}>
                <span style={{ background:(inspectResult.res.status===200?C.green:C.red)+'22', color:inspectResult.res.status===200?C.green:C.red, padding:'2px 10px', borderRadius:6, fontSize:13, fontWeight:700 }}>{inspectResult.res.status}</span>
                <span style={{ fontSize:11, color:C.muted }}>in {inspectResult.res.time}ms</span>
              </div>
              <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>Body</div>
              <pre style={{ margin:0, fontSize:11, color:C.teal, background:C.s3, borderRadius:8, padding:10, overflow:'auto', maxHeight:200 }}>{JSON.stringify(inspectResult.res.body, null, 2)}</pre>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 7. RATE LIMIT MONITOR ────────────────────────────────────────────── */}
      <Section title="Rate Limit Monitor" icon="⏱️" accent={C.red}>
        <div style={{ fontSize:11, color:C.muted, marginBottom:16 }}>Auto-refreshes every 5 seconds</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          {rateLimits.map(r => {
            const pct = r.used / r.total;
            const color = pct > 0.8 ? C.red : pct > 0.5 ? C.gold : C.green;
            const mins = Math.floor(r.countdown / 60);
            const secs = r.countdown % 60;
            return (
              <div key={r.api} style={{ background:C.s3, borderRadius:12, padding:'14px 18px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <span style={{ fontWeight:600, color:C.white, fontSize:13 }}>{r.api}</span>
                  <span style={{ fontSize:11, color:C.muted }}>Reset in {mins}m {secs}s</span>
                </div>
                <div style={{ height:8, background:C.surface, borderRadius:4, overflow:'hidden', marginBottom:8 }}>
                  <div style={{ height:'100%', width:`${pct * 100}%`, background:`linear-gradient(to right, ${color}88, ${color})`, borderRadius:4, transition:'width 0.5s ease' }} />
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:11 }}>
                  <span style={{ color }}>{r.used.toLocaleString()} / {r.total.toLocaleString()} req</span>
                  <span style={{ color, fontWeight:700 }}>{Math.round(pct*100)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── 8. IMPORT / EXPORT ───────────────────────────────────────────────── */}
      <Section title="Import / Export" icon="📦" accent={C.purple}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:C.white, marginBottom:10 }}>Import Postman Collection</div>
            <textarea value={importJson} onChange={e=>setImportJson(e.target.value)} placeholder='Paste Postman collection JSON here…' rows={5} style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:12, color:C.text, fontSize:12, fontFamily:"'DM Mono',monospace", resize:'vertical' }} />
            {importMsg && <div style={{ fontSize:12, marginTop:6, color: importMsg.startsWith('✅') ? C.green : C.red }}>{importMsg}</div>}
            <div style={{ display:'flex', gap:8, marginTop:10 }}>
              <Btn onClick={importPostman} color={C.purple}>Import</Btn>
            </div>
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:C.white, marginBottom:10 }}>Export & Presets</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <Btn onClick={exportConfigs} color={C.teal} style={{ width:'100%', textAlign:'center', justifyContent:'center' }}>⬇ Export All Configs (JSON)</Btn>
              {[
                { label:'🤖 AI Stack (OpenAI + Anthropic + Cursor)', color:C.gold   },
                { label:'🚀 Deploy Stack (GitHub + Vercel + Supabase)', color:C.teal },
                { label:'💳 Commerce Stack (Stripe)', color:C.purple },
              ].map(p => (
                <div key={p.label} onClick={() => {}} style={{ background:C.s3, border:`1px solid ${p.color}33`, borderRadius:10, padding:'10px 14px', cursor:'pointer', fontSize:13, color:p.color, fontWeight:600, transition:'background 0.15s' }}>{p.label}</div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── 9. HEALTH DASHBOARD ──────────────────────────────────────────────── */}
      <Section title="Uptime Health Dashboard" icon="💚" accent={C.green}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <span style={{ fontSize:13, color:C.muted }}>Past 8 hours — 1 square = 1 hour</span>
          <div style={{ background:`${C.green}22`, border:`1px solid ${C.green}44`, borderRadius:10, padding:'6px 16px' }}>
            <span style={{ color:C.green, fontWeight:700, fontSize:14 }}>SLA: {sla.toFixed(1)}%</span>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {health.map(api => (
            <div key={api.api} style={{ background:C.s3, borderRadius:12, padding:'12px 16px', display:'flex', alignItems:'center', gap:14 }}>
              <span style={{ fontSize:13, fontWeight:600, color:C.white, width:80, flexShrink:0 }}>{api.api}</span>
              <div style={{ display:'flex', gap:5, flex:1 }}>
                {api.hours.map((h, i) => {
                  const hColor = h==='green'?C.green:h==='yellow'?C.gold:C.red;
                  return <div key={i} title={`Hour ${i+1}: ${h}`} style={{ flex:1, height:22, borderRadius:5, background:hColor+'44', border:`1px solid ${hColor}66`, position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute', inset:0, background:hColor+'22' }} />
                  </div>;
                })}
              </div>
              <span style={{ fontSize:11, color:C.muted, flexShrink:0 }}>
                {Math.round(api.hours.filter(h=>h==='green').length/8*100)}%
              </span>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:16, marginTop:14 }}>
          {[{ label:'Operational', color:C.green },{ label:'Degraded', color:C.gold },{ label:'Down', color:C.red }].map(l=>(
            <div key={l.label} style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:C.muted }}>
              <div style={{ width:12, height:12, borderRadius:3, background:l.color+'66', border:`1px solid ${l.color}` }} />
              {l.label}
            </div>
          ))}
        </div>
      </Section>

      {/* ── 10. AUDIT LOG ────────────────────────────────────────────────────── */}
      <Section title="Audit Log" icon="📋" accent={C.gold}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, gap:12, flexWrap:'wrap' }}>
          <input value={auditSearch} onChange={e=>setAuditSearch(e.target.value)} placeholder="Filter by endpoint, method, or code…" style={{ flex:1, minWidth:200, background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'8px 14px', color:C.white, fontSize:13, fontFamily:"'DM Mono',monospace" }} />
          <Btn onClick={exportCsv} color={C.gold}>⬇ Export CSV</Btn>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>{['Timestamp','Method','Endpoint','Status','Latency'].map(h=>(
                <th key={h} style={{ textAlign:'left', padding:'8px 12px', fontSize:11, color:C.muted, fontWeight:600, borderBottom:`1px solid ${C.border}`, letterSpacing:'0.05em' }}>{h.toUpperCase()}</th>
              ))}</tr>
            </thead>
            <tbody>
              {filteredAudit.map(row => {
                const is2xx = row.code >= 200 && row.code < 300;
                const is4xx = row.code >= 400 && row.code < 500;
                const rowColor = is2xx ? C.teal : is4xx ? C.gold : C.red;
                return (
                  <tr key={row.id} style={{ borderBottom:`1px solid ${C.border}`, background:`${rowColor}08` }}>
                    <td style={{ padding:'10px 12px', fontFamily:"'DM Mono',monospace", fontSize:12, color:C.muted }}>{row.ts}</td>
                    <td style={{ padding:'10px 12px' }}>
                      <span style={{ fontSize:11, fontWeight:700, color:rowColor, background:`${rowColor}22`, padding:'2px 8px', borderRadius:6 }}>{row.method}</span>
                    </td>
                    <td style={{ padding:'10px 12px', fontSize:12, color:C.text, fontFamily:"'DM Mono',monospace" }}>{row.endpoint}</td>
                    <td style={{ padding:'10px 12px' }}>
                      <span style={{ fontSize:12, fontWeight:700, color:rowColor }}>{row.code}</span>
                    </td>
                    <td style={{ padding:'10px 12px', fontSize:12, color: row.latency > 1000 ? C.red : row.latency > 500 ? C.gold : C.text }}>{row.latency}ms</td>
                  </tr>
                );
              })}
              {filteredAudit.length === 0 && (
                <tr><td colSpan={5} style={{ padding:'24px 12px', textAlign:'center', color:C.muted, fontSize:13 }}>No results match your filter</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

    </div>
  );
}

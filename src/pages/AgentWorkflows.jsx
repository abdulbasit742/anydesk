import React, { useState, useEffect, useRef } from 'react';

// ─── CSS VARS ─────────────────────────────────────────────────────────────────
const C = {
  gold:     '#f5b731',
  teal:     '#22d3ee',
  purple:   '#a78bfa',
  surface:  '#0e0e16',
  surface2: '#16161e',
  surface3: '#1d1d28',
  border:   'rgba(255,255,255,0.07)',
  muted:    '#6e7191',
  red:      '#ef4444',
  green:    '#22c55e',
  text:     '#e2e8f0',
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const ts = () => new Date().toLocaleTimeString('en-US', { hour12: false });
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pad2 = (n) => String(n).padStart(2, '0');

const fmtUptime = (seconds) => {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  return `${d}d ${pad2(h)}h`;
};

// ─── ICONS (inline SVG) ───────────────────────────────────────────────────────
const Icon = ({ name, size = 16, color = 'currentColor' }) => {
  const icons = {
    input:    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>,
    transform:<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"/>,
    branch:   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"/>,
    execute:  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"/>,
    output:   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"/>,
    copy:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"/>,
    logs:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.75 9h16.5m-16.5 6.75h16.5"/>,
    pause:    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.75 5.25v13.5m-7.5-13.5v13.5"/>,
    restart:  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>,
    plus:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.5v15m7.5-7.5h-15"/>,
    chevron:  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>,
    webhook:  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"/>,
    terminal: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"/>,
    check:    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5"/>,
    bolt:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>,
    trash:    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>,
    export:   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} style={{ flexShrink: 0 }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────
const AnimCounter = ({ target, duration = 1800, suffix = '', prefix = '' }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  const display = typeof target === 'number' && target > 999
    ? val.toLocaleString()
    : val;
  return <span>{prefix}{display}{suffix}</span>;
};

// ─── PULSE DOT ────────────────────────────────────────────────────────────────
const PulseDot = ({ color }) => (
  <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 10, height: 10 }}>
    <span style={{
      position: 'absolute', inset: 0, borderRadius: '50%',
      background: color, opacity: 0.4,
      animation: 'pulse-ring 1.4s ease-out infinite',
    }}/>
    <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'block' }}/>
  </span>
);

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const statusMeta = {
  Running:  { color: C.teal,   bg: 'rgba(34,211,238,0.12)',  pulse: true },
  Queued:   { color: C.gold,   bg: 'rgba(245,183,49,0.12)',  pulse: false },
  Done:     { color: C.green,  bg: 'rgba(34,197,94,0.12)',   pulse: false },
  Error:    { color: C.red,    bg: 'rgba(239,68,68,0.12)',   pulse: false },
  Paused:   { color: C.muted,  bg: 'rgba(110,113,145,0.12)', pulse: false },
};
const StatusBadge = ({ status }) => {
  const m = statusMeta[status] || statusMeta.Queued;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 99,
      background: m.bg, color: m.color, fontSize: 11, fontWeight: 600,
      letterSpacing: '0.05em', textTransform: 'uppercase',
      border: `1px solid ${m.color}28`,
    }}>
      {m.pulse ? <PulseDot color={m.color}/> : <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.color, display: 'inline-block'}}/>}
      {status}
    </span>
  );
};

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
const ProgressBar = ({ value, color = C.teal }) => (
  <div style={{ position: 'relative', width: '100%', height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
    <div style={{
      height: '100%', borderRadius: 99, background: color,
      width: `${value}%`, transition: 'width 0.6s ease',
      boxShadow: `0 0 8px ${color}88`,
    }}/>
  </div>
);

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const PLATFORMS = ['Bolt', 'Lovable', 'Manus', 'Replit', 'Cursor'];
const CATEGORIES = ['All', 'Broadcast', 'Data Processing', 'Code Gen', 'Monitoring', 'Custom'];
const PLATFORM_COLORS = { Bolt: C.gold, Lovable: C.purple, Manus: C.teal, Replit: C.green, Cursor: C.red };

const initAgents = [
  { id: 1,  name: 'DataSyncBot',      platform: 'Bolt',     status: 'Running', progress: 68, lastRun: '14:21:05', category: 'Data Processing', tokens: 12400 },
  { id: 2,  name: 'CodeReviewAgent',  platform: 'Cursor',   status: 'Done',    progress: 100, lastRun: '14:18:44', category: 'Code Gen', tokens: 8700 },
  { id: 3,  name: 'AlertMonitor',     platform: 'Manus',    status: 'Running', progress: 42, lastRun: '14:22:11', category: 'Monitoring', tokens: 3200 },
  { id: 4,  name: 'NewsDigest',       platform: 'Lovable',  status: 'Queued',  progress: 0,  lastRun: '14:05:30', category: 'Broadcast', tokens: 0 },
  { id: 5,  name: 'TestSuiteRunner',  platform: 'Replit',   status: 'Running', progress: 85, lastRun: '14:20:58', category: 'Code Gen', tokens: 22100 },
  { id: 6,  name: 'LogAggregator',    platform: 'Bolt',     status: 'Error',   progress: 37, lastRun: '14:15:02', category: 'Monitoring', tokens: 5600 },
  { id: 7,  name: 'SlackBroadcast',   platform: 'Manus',    status: 'Done',    progress: 100, lastRun: '14:10:17', category: 'Broadcast', tokens: 1900 },
  { id: 8,  name: 'DBOptimizer',      platform: 'Cursor',   status: 'Queued',  progress: 0,  lastRun: '13:58:44', category: 'Data Processing', tokens: 0 },
  { id: 9,  name: 'CustomWorkflow',   platform: 'Lovable',  status: 'Running', progress: 55, lastRun: '14:23:01', category: 'Custom', tokens: 6700 },
  { id: 10, name: 'ReportBuilder',    platform: 'Replit',   status: 'Done',    progress: 100, lastRun: '14:12:33', category: 'Data Processing', tokens: 14300 },
];

const PIPELINE_STEPS = [
  { id: 'input',     icon: 'input',     label: 'Input',     status: 'active', desc: 'Receive raw data from source triggers', fields: ['Source URL', 'Auth Token', 'Timeout (ms)'] },
  { id: 'transform', icon: 'transform', label: 'Transform', status: 'active', desc: 'Parse and reshape incoming payload',    fields: ['Schema Map', 'Filter Rules', 'Encoding'] },
  { id: 'branch',    icon: 'branch',    label: 'Branch',    status: 'idle',   desc: 'Route execution based on conditions',   fields: ['Condition A', 'Condition B', 'Default Path'] },
  { id: 'execute',   icon: 'execute',   label: 'Execute',   status: 'active', desc: 'Run the AI agent with context',         fields: ['Model', 'Max Tokens', 'Temperature'] },
  { id: 'output',    icon: 'output',    label: 'Output',    status: 'idle',   desc: 'Deliver results to target systems',     fields: ['Endpoint URL', 'Format', 'Retry'] },
];

const LOG_COLORS = { success: C.green, warn: C.gold, error: C.red, info: C.teal, debug: C.muted };
const INIT_LOGS = [
  { id: 1,  time: '14:21:05', level: 'info',    msg: 'Agent DataSyncBot initialized — context loaded (12.4k tokens)' },
  { id: 2,  time: '14:21:06', level: 'success', msg: 'Pipeline step [Input] completed in 142ms' },
  { id: 3,  time: '14:21:07', level: 'info',    msg: 'Fetching payload from https://api.datasource.io/v2/stream' },
  { id: 4,  time: '14:21:08', level: 'success', msg: 'Pipeline step [Transform] completed — 2,341 records normalized' },
  { id: 5,  time: '14:21:09', level: 'warn',    msg: 'Branch condition B did not match — falling back to default path' },
  { id: 6,  time: '14:21:10', level: 'info',    msg: 'Executing model: gpt-4o-mini | temp: 0.3 | max_tokens: 2048' },
  { id: 7,  time: '14:21:12', level: 'success', msg: 'Inference complete in 1.84s — confidence: 0.97' },
  { id: 8,  time: '14:21:13', level: 'info',    msg: 'Writing output to target endpoint /api/results' },
  { id: 9,  time: '14:21:14', level: 'error',   msg: 'LogAggregator encountered HTTP 503 from upstream — retrying (1/3)' },
  { id: 10, time: '14:21:15', level: 'warn',    msg: 'Memory usage at 87% — consider reducing batch size' },
  { id: 11, time: '14:21:16', level: 'success', msg: 'SlackBroadcast delivered 12 notifications to #alerts channel' },
  { id: 12, time: '14:21:17', level: 'info',    msg: 'Queue depth: 8 | Active workers: 5 | Idle: 3' },
  { id: 13, time: '14:21:18', level: 'debug',   msg: 'Heartbeat OK — all monitors nominal' },
  { id: 14, time: '14:21:19', level: 'success', msg: 'ReportBuilder export finalized — PDF (4.2 MB) stored at /reports/' },
  { id: 15, time: '14:21:20', level: 'info',    msg: 'System uptime: 14d 6h 42m | Load: 73% | Mem: 2.1 GB' },
];

const NEW_LOG_POOL = [
  { level: 'info',    msg: 'Polling source endpoint — interval: 5000ms' },
  { level: 'success', msg: 'Agent CustomWorkflow checkpoint saved successfully' },
  { level: 'warn',    msg: 'Rate limit approaching — backing off for 2s' },
  { level: 'info',    msg: 'Token budget: 18,400 / 32,768 used' },
  { level: 'error',   msg: 'Timeout on webhook callback — no response after 10s' },
  { level: 'success', msg: 'DataSyncBot batch #47 processed in 0.92s' },
  { level: 'debug',   msg: 'GC sweep complete — freed 142 MB heap' },
  { level: 'info',    msg: 'AlertMonitor triggered on metric anomaly: p99 latency > 800ms' },
  { level: 'success', msg: 'TestSuiteRunner: 231/234 tests passed (98.7%)' },
  { level: 'warn',    msg: 'DBOptimizer: index fragmentation at 34% — optimization recommended' },
];

const INIT_TIMELINE = Array.from({ length: 20 }, (_, i) => {
  const statuses = ['Done', 'Done', 'Done', 'Error', 'Done', 'Running'];
  const names    = ['DataSyncBot', 'CodeReview', 'AlertMonitor', 'LogAggregator', 'ReportBuilder', 'NewsDigest', 'CustomFlow', 'TestRunner'];
  const durations = ['0.8s', '1.2s', '2.4s', '0.5s', '3.1s', '1.7s', '0.9s', '4.2s'];
  const status = statuses[i % statuses.length];
  const minsAgo = (20 - i) * 3;
  const d = new Date(Date.now() - minsAgo * 60000);
  return {
    id: i + 1,
    time: d.toLocaleTimeString('en-US', { hour12: false }),
    name: names[i % names.length],
    duration: durations[i % durations.length],
    status,
  };
});

const WEBHOOK_EVENTS = [
  { id: 1, time: '14:22:48', type: 'agent.completed', payload: '{"agent":"DataSyncBot","status":"done","rows":2341}' },
  { id: 2, time: '14:21:15', type: 'agent.error',     payload: '{"agent":"LogAggregator","code":503,"retry":1}' },
  { id: 3, time: '14:20:03', type: 'pipeline.started', payload: '{"pipeline":"main","trigger":"cron","ts":1748771403}' },
  { id: 4, time: '14:18:44', type: 'agent.completed', payload: '{"agent":"CodeReviewAgent","status":"done"}' },
  { id: 5, time: '14:15:02', type: 'webhook.test',    payload: '{"source":"dashboard","event":"ping"}' },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function AgentWorkflows() {
  // Pipeline state
  const [expandedStep, setExpandedStep] = useState(null);
  const [stepConfigs, setStepConfigs]   = useState({});

  // Agents / Table state
  const [agents, setAgents]       = useState(initAgents);
  const [activeTab, setActiveTab] = useState('All');
  const [agentCounter, setAgentCounter] = useState(11);

  // Creation form
  const [showCreate, setShowCreate] = useState(false);
  const [newAgent, setNewAgent] = useState({ name: '', platform: 'Bolt', trigger: 'manual', prompt: '', retries: 3 });
  const [createFlash, setCreateFlash] = useState(false);

  // Logs
  const [logs, setLogs] = useState(INIT_LOGS);
  const [logCounter, setLogCounter] = useState(16);
  const logsRef = useRef(null);

  // Timeline
  const [timeline, setTimeline] = useState(INIT_TIMELINE);
  const timelineRef = useRef(null);
  const timelineCounter = useRef(21);

  // Metrics animation trigger
  const [metricsVisible, setMetricsVisible] = useState(false);
  const metricsRef = useRef(null);

  // Webhook
  const [copied, setCopied] = useState(false);
  const [webhookEventType, setWebhookEventType] = useState('agent.completed');
  const WEBHOOK_URL = 'https://hooks.antigravity.dev/wh/ab3c91f2-ee7d';

  // Uptime ticker
  const [uptime, setUptime] = useState(14 * 86400 + 6 * 3600 + 42 * 60);

  // ── Effects ─────────────────────────────────────────────────────────────────

  // Animate running agent progress
  useEffect(() => {
    const id = setInterval(() => {
      setAgents(prev => prev.map(a => {
        if (a.status !== 'Running') return a;
        const next = Math.min(a.progress + rand(1, 4), 99);
        return { ...a, progress: next };
      }));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  // Auto-scroll logs + append new line every 3s
  useEffect(() => {
    const id = setInterval(() => {
      const entry = NEW_LOG_POOL[rand(0, NEW_LOG_POOL.length - 1)];
      setLogs(prev => {
        const next = [...prev, { ...entry, id: logCounter, time: ts() }];
        return next.slice(-60); // keep last 60
      });
      setLogCounter(c => c + 1);
    }, 3000);
    return () => clearInterval(id);
  }, [logCounter]);

  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  // Append timeline event every 5s
  useEffect(() => {
    const id = setInterval(() => {
      const names   = ['DataSyncBot', 'CodeReview', 'AlertMonitor', 'ReportBuilder', 'CustomFlow'];
      const durs    = ['0.7s', '1.1s', '2.9s', '0.5s', '3.4s'];
      const statuses = ['Done', 'Done', 'Error', 'Running'];
      const entry = {
        id: timelineCounter.current++,
        time: ts(),
        name: names[rand(0, names.length - 1)],
        duration: durs[rand(0, durs.length - 1)],
        status: statuses[rand(0, statuses.length - 1)],
        isNew: true,
      };
      setTimeline(prev => [...prev.slice(-25), entry]);
      setTimeout(() => setTimeline(prev => prev.map(t => t.id === entry.id ? { ...t, isNew: false } : t)), 600);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollLeft = timelineRef.current.scrollWidth;
    }
  }, [timeline]);

  // Uptime ticker
  useEffect(() => {
    const id = setInterval(() => setUptime(u => u + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Intersection observer for metrics
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setMetricsVisible(true); }, { threshold: 0.3 });
    if (metricsRef.current) obs.observe(metricsRef.current);
    return () => obs.disconnect();
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const toggleStep = (id) => setExpandedStep(prev => prev === id ? null : id);

  const handleConfigChange = (stepId, field, val) => {
    setStepConfigs(prev => ({ ...prev, [stepId]: { ...(prev[stepId] || {}), [field]: val } }));
  };

  const handleCreateAgent = () => {
    if (!newAgent.name.trim()) return;
    const created = {
      id: agentCounter, name: newAgent.name.trim(), platform: newAgent.platform,
      status: 'Queued', progress: 0, lastRun: ts(), category: 'Custom', tokens: 0,
    };
    setAgents(prev => [created, ...prev]);
    setAgentCounter(c => c + 1);
    setNewAgent({ name: '', platform: 'Bolt', trigger: 'manual', prompt: '', retries: 3 });
    setShowCreate(false);
    setCreateFlash(true);
    setTimeout(() => setCreateFlash(false), 2000);
  };

  const handlePauseAgent = (id) => {
    setAgents(prev => prev.map(a => a.id === id && a.status === 'Running' ? { ...a, status: 'Paused' } : a));
  };

  const handleRestartAgent = (id) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status: 'Running', progress: 0, lastRun: ts() } : a));
  };

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(WEBHOOK_URL).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearLogs = () => setLogs([]);

  const filteredAgents = agents.filter(a => activeTab === 'All' || a.category === activeTab);

  // ── Shared Styles ────────────────────────────────────────────────────────────
  const card = {
    background: C.surface2,
    border: `1px solid ${C.border}`,
    borderRadius: 14,
    padding: '20px 24px',
  };

  const inputStyle = {
    width: '100%', background: C.surface3,
    border: `1px solid ${C.border}`, borderRadius: 8,
    color: C.text, padding: '9px 12px', fontSize: 13,
    outline: 'none', fontFamily: 'DM Mono, monospace',
    boxSizing: 'border-box',
  };

  const btnPrimary = {
    background: `linear-gradient(135deg, ${C.gold}, #e09b1a)`,
    color: '#0e0e16', border: 'none', borderRadius: 8,
    padding: '9px 18px', fontWeight: 700, fontSize: 13,
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
    fontFamily: 'Syne, sans-serif', letterSpacing: '0.03em',
    transition: 'transform 0.15s, box-shadow 0.15s',
    boxShadow: `0 0 16px ${C.gold}44`,
  };

  const btnGhost = {
    background: 'transparent', border: `1px solid ${C.border}`,
    borderRadius: 8, color: C.muted, padding: '7px 12px',
    fontSize: 12, cursor: 'pointer', display: 'inline-flex',
    alignItems: 'center', gap: 5, fontFamily: 'DM Mono, monospace',
    transition: 'border-color 0.15s, color 0.15s',
  };

  const sectionLabel = {
    fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: C.muted, marginBottom: 12,
    fontFamily: 'Syne, sans-serif',
  };

  return (
    <>
      {/* Global keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { background: ${C.surface}; color: ${C.text}; font-family: 'DM Mono', monospace; }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:.4} 70%{transform:scale(2.2);opacity:0} 100%{transform:scale(1);opacity:0} }
        @keyframes slide-in-right { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fade-up { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow-pulse { 0%,100%{box-shadow:0 0 10px ${C.teal}44} 50%{box-shadow:0 0 24px ${C.teal}88} }
        @keyframes flash-green { 0%,100%{background:${C.surface2}} 50%{background:rgba(34,197,94,0.18)} }
        .agent-row:hover { background: ${C.surface3} !important; }
        .btn-action:hover { background: rgba(255,255,255,0.07) !important; color: ${C.text} !important; border-color: rgba(255,255,255,0.15) !important; }
        .tab-btn:hover { color: ${C.text} !important; }
        .step-card:hover .step-configure { border-color: ${C.gold}66 !important; color: ${C.gold} !important; }
        .pipeline-step:hover { border-color: ${C.teal}55 !important; transform: translateY(-2px); }
        .metric-card:hover { border-color: rgba(245,183,49,0.25) !important; transform: translateY(-3px); }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: ${C.surface3}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 99px; }
        .new-timeline-item { animation: slide-in-right 0.5s ease; }
        .flash-row { animation: flash-green 1.5s ease; }
      `}</style>

      <div style={{ minHeight: '100vh', background: C.surface, fontFamily: 'DM Mono, monospace', paddingBottom: 64 }}>

        {/* ── 1. HERO HEADER ─────────────────────────────────────────────────── */}
        <div style={{
          background: `linear-gradient(135deg, #0d0d1a 0%, #111128 40%, #0a1520 100%)`,
          borderBottom: `1px solid ${C.border}`,
          padding: '40px 32px 36px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* decorative blobs */}
          <div style={{ position:'absolute', top:-60, right:120, width:320, height:320, borderRadius:'50%', background:`radial-gradient(circle, ${C.teal}18 0%, transparent 70%)`, pointerEvents:'none' }}/>
          <div style={{ position:'absolute', bottom:-80, left:80, width:260, height:260, borderRadius:'50%', background:`radial-gradient(circle, ${C.gold}14 0%, transparent 70%)`, pointerEvents:'none' }}/>
          <div style={{ position:'absolute', top:20, left:'55%', width:180, height:180, borderRadius:'50%', background:`radial-gradient(circle, ${C.purple}12 0%, transparent 70%)`, pointerEvents:'none' }}/>

          <div style={{ position:'relative', maxWidth: 1400, margin:'0 auto' }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:24 }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:`linear-gradient(135deg,${C.teal},${C.purple})`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon name="bolt" size={18} color="#fff"/>
                  </div>
                  <span style={{ fontSize:12, color:C.teal, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', fontFamily:'Syne,sans-serif' }}>Bolt Studio Pro</span>
                </div>
                <h1 style={{ margin:0, fontSize: 36, fontWeight:800, fontFamily:'Syne,sans-serif', letterSpacing:'-0.02em', background:`linear-gradient(135deg, #fff 0%, ${C.teal} 60%, ${C.gold} 100%)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                  Agent Workflows
                </h1>
                <p style={{ margin:'10px 0 0', color:C.muted, fontSize:14, maxWidth:520, lineHeight:1.6 }}>
                  Orchestrate, monitor, and deploy intelligent AI automation pipelines — all in one command center.
                </p>
              </div>

              {/* Stat badges */}
              <div style={{ display:'flex', gap:14, flexWrap:'wrap', alignSelf:'center' }}>
                {[
                  { label:'Total Agents', value:'47',  color:C.gold,   bg:'rgba(245,183,49,0.1)',  border:`rgba(245,183,49,0.25)` },
                  { label:'Running',      value:'12',  color:C.teal,   bg:'rgba(34,211,238,0.1)',  border:`rgba(34,211,238,0.25)`, pulse:true },
                  { label:'Completed Today', value:'284', color:C.green, bg:'rgba(34,197,94,0.1)', border:`rgba(34,197,94,0.25)` },
                ].map(s => (
                  <div key={s.label} style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:12, padding:'14px 20px', minWidth:130, transition:'transform 0.2s' }}
                    onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
                    onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                      {s.pulse && <PulseDot color={s.color}/>}
                      <span style={{ fontSize:11, color:s.color, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', fontFamily:'Syne,sans-serif' }}>{s.label}</span>
                    </div>
                    <div style={{ fontSize:28, fontWeight:800, color:s.color, fontFamily:'Syne,sans-serif', lineHeight:1 }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth:1400, margin:'0 auto', padding:'28px 32px', display:'flex', flexDirection:'column', gap:28 }}>

          {/* ── 6. METRICS GRID (above fold) ──────────────────────────────────── */}
          <div ref={metricsRef} style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
            {[
              { label:'Total Runs',    value: metricsVisible ? 8432 : 0,   suffix:'',   prefix:'',  color:C.teal,   icon:'execute' },
              { label:'Success Rate',  value: metricsVisible ? 97.3 : 0,   suffix:'%',  prefix:'',  color:C.green,  icon:'check',  decimals:1 },
              { label:'Avg Duration',  value: metricsVisible ? 1.8 : 0,    suffix:'s',  prefix:'',  color:C.gold,   icon:'bolt',   decimals:1 },
              { label:'Tokens Used',   value: metricsVisible ? 2.4 : 0,    suffix:'M',  prefix:'',  color:C.purple, icon:'terminal', decimals:1 },
            ].map((m, i) => (
              <div key={m.label} className="metric-card" style={{
                ...card, display:'flex', flexDirection:'column', gap:12,
                borderLeft:`3px solid ${m.color}`, transition:'transform 0.2s, border-color 0.2s',
                animation: metricsVisible ? `fade-up 0.5s ease ${i * 0.1}s both` : 'none',
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ ...sectionLabel, marginBottom:0 }}>{m.label}</span>
                  <div style={{ width:32, height:32, borderRadius:8, background:`${m.color}18`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon name={m.icon} size={15} color={m.color}/>
                  </div>
                </div>
                <div style={{ fontSize:32, fontWeight:800, fontFamily:'Syne,sans-serif', color:m.color, lineHeight:1 }}>
                  {m.decimals ? (
                    <span>{m.prefix}{metricsVisible ? m.value.toFixed(m.decimals) : '0.0'}{m.suffix}</span>
                  ) : (
                    <AnimCounter target={m.value} suffix={m.suffix} prefix={m.prefix}/>
                  )}
                </div>
                <ProgressBar value={m.label === 'Success Rate' ? m.value : 70 + i * 7} color={m.color}/>
              </div>
            ))}
          </div>

          {/* ── 2. AGENT PIPELINE BUILDER ──────────────────────────────────────── */}
          <div style={card}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <div>
                <div style={sectionLabel}>Pipeline Builder</div>
                <h2 style={{ margin:0, fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:18 }}>Main Execution Pipeline</h2>
              </div>
              <button style={btnPrimary} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow=`0 4px 20px ${C.gold}66`}} onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow=`0 0 16px ${C.gold}44`}}>
                <Icon name="execute" size={14} color="#0e0e16"/> Deploy Pipeline
              </button>
            </div>

            {/* Pipeline steps row */}
            <div style={{ display:'flex', alignItems:'flex-start', gap:0, overflowX:'auto', paddingBottom:8 }}>
              {PIPELINE_STEPS.map((step, idx) => {
                const isOpen = expandedStep === step.id;
                const dotColor = step.status === 'active' ? C.green : step.status === 'error' ? C.red : C.muted;
                return (
                  <React.Fragment key={step.id}>
                    {/* Connector arrow */}
                    {idx > 0 && (
                      <div style={{ display:'flex', alignItems:'center', flexShrink:0, marginTop:32 }}>
                        <div style={{ width:32, height:2, background:`linear-gradient(90deg, ${C.teal}44, ${C.teal})` }}/>
                        <div style={{ width:0, height:0, borderLeft:`7px solid ${C.teal}`, borderTop:'5px solid transparent', borderBottom:'5px solid transparent' }}/>
                      </div>
                    )}
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', minWidth:140 }}>
                      <div className="pipeline-step" onClick={() => toggleStep(step.id)} style={{
                        background: isOpen ? `rgba(34,211,238,0.07)` : C.surface3,
                        border: `1px solid ${isOpen ? C.teal : C.border}`,
                        borderRadius:12, padding:'14px 18px', cursor:'pointer', width:'100%',
                        transition:'all 0.2s', display:'flex', flexDirection:'column', gap:8,
                        boxShadow: isOpen ? `0 0 20px ${C.teal}22` : 'none',
                      }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                          <div style={{ width:30, height:30, borderRadius:8, background:`${C.teal}18`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <Icon name={step.icon} size={15} color={C.teal}/>
                          </div>
                          <span style={{ width:8, height:8, borderRadius:'50%', background:dotColor, display:'block', boxShadow:`0 0 6px ${dotColor}` }}/>
                        </div>
                        <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:13 }}>{step.label}</div>
                        <div style={{ fontSize:11, color:C.muted, lineHeight:1.5 }}>{step.desc}</div>
                        <button className="step-configure" style={{ ...btnGhost, fontSize:11, padding:'5px 10px', marginTop:4, borderRadius:6, justifyContent:'center', transition:'all 0.15s' }}>
                          {isOpen ? 'Close ▲' : 'Configure ▼'}
                        </button>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            {/* Inline config panel */}
            {expandedStep && (() => {
              const step = PIPELINE_STEPS.find(s => s.id === expandedStep);
              const cfg = stepConfigs[expandedStep] || {};
              return (
                <div style={{ marginTop:16, background:C.surface3, borderRadius:12, padding:20, border:`1px solid ${C.teal}33`, animation:'fade-up 0.25s ease' }}>
                  <div style={{ ...sectionLabel, color:C.teal }}>Configure: {step.label}</div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
                    {step.fields.map(f => (
                      <div key={f}>
                        <label style={{ fontSize:11, color:C.muted, display:'block', marginBottom:5, fontFamily:'Syne,sans-serif' }}>{f}</label>
                        <input
                          style={inputStyle}
                          placeholder={`Enter ${f}...`}
                          value={cfg[f] || ''}
                          onChange={e => handleConfigChange(step.id, f, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                  <button style={{ ...btnPrimary, marginTop:14 }}
                    onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'}
                    onMouseLeave={e=>e.currentTarget.style.transform=''}>
                    <Icon name="check" size={13} color="#0e0e16"/> Save Configuration
                  </button>
                </div>
              );
            })()}
          </div>

          {/* ── 9. CATEGORY TABS + 4. CREATION PANEL ──────────────────────────── */}
          <div style={card}>
            {/* Tab bar + create button */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16, flexWrap:'wrap', gap:12 }}>
              <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                {CATEGORIES.map(tab => {
                  const active = activeTab === tab;
                  return (
                    <button key={tab} className="tab-btn" onClick={() => setActiveTab(tab)} style={{
                      background: active ? `rgba(34,211,238,0.12)` : 'transparent',
                      border: `1px solid ${active ? C.teal : C.border}`,
                      borderRadius:8, padding:'7px 14px', fontSize:12, fontWeight: active ? 700 : 400,
                      color: active ? C.teal : C.muted, cursor:'pointer', fontFamily:'Syne,sans-serif',
                      transition:'all 0.15s', letterSpacing:'0.02em',
                    }}>{tab}</button>
                  );
                })}
              </div>
              <button style={btnPrimary} onClick={() => setShowCreate(s => !s)}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow=`0 4px 20px ${C.gold}66`}}
                onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow=`0 0 16px ${C.gold}44`}}>
                <Icon name="plus" size={14} color="#0e0e16"/> New Agent
              </button>
            </div>

            {/* Creation form */}
            {showCreate && (
              <div style={{ background:C.surface3, borderRadius:12, padding:20, marginBottom:18, border:`1px solid ${C.gold}33`, animation:'fade-up 0.25s ease' }}>
                <div style={{ ...sectionLabel, color:C.gold }}>Create New Agent</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
                  <div>
                    <label style={{ fontSize:11, color:C.muted, display:'block', marginBottom:5 }}>Agent Name</label>
                    <input style={inputStyle} placeholder="MyAwesomeAgent" value={newAgent.name} onChange={e=>setNewAgent(p=>({...p,name:e.target.value}))}/>
                  </div>
                  <div>
                    <label style={{ fontSize:11, color:C.muted, display:'block', marginBottom:5 }}>Platform</label>
                    <select style={{ ...inputStyle, cursor:'pointer' }} value={newAgent.platform} onChange={e=>setNewAgent(p=>({...p,platform:e.target.value}))}>
                      {PLATFORMS.map(pl => <option key={pl} value={pl}>{pl}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:11, color:C.muted, display:'block', marginBottom:5 }}>Trigger Type</label>
                    <select style={{ ...inputStyle, cursor:'pointer' }} value={newAgent.trigger} onChange={e=>setNewAgent(p=>({...p,trigger:e.target.value}))}>
                      <option value="manual">Manual</option>
                      <option value="cron">Cron Schedule</option>
                      <option value="webhook">Webhook</option>
                    </select>
                  </div>
                  <div style={{ gridColumn:'1/-1' }}>
                    <label style={{ fontSize:11, color:C.muted, display:'block', marginBottom:5 }}>System Prompt</label>
                    <textarea style={{ ...inputStyle, height:80, resize:'vertical', lineHeight:1.6 }} placeholder="You are an expert AI agent that..." value={newAgent.prompt} onChange={e=>setNewAgent(p=>({...p,prompt:e.target.value}))}/>
                  </div>
                  <div>
                    <label style={{ fontSize:11, color:C.muted, display:'block', marginBottom:5 }}>Max Retries</label>
                    <input type="number" min={0} max={10} style={inputStyle} value={newAgent.retries} onChange={e=>setNewAgent(p=>({...p,retries:Number(e.target.value)}))}/>
                  </div>
                </div>
                <div style={{ display:'flex', gap:10, marginTop:14 }}>
                  <button style={btnPrimary} onClick={handleCreateAgent}
                    onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'}
                    onMouseLeave={e=>e.currentTarget.style.transform=''}>
                    <Icon name="plus" size={13} color="#0e0e16"/> Create Agent
                  </button>
                  <button style={btnGhost} onClick={()=>setShowCreate(false)}>Cancel</button>
                </div>
              </div>
            )}

            {/* ── 3. LIVE AGENT MONITOR TABLE ──────────────────────────────────── */}
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead>
                  <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                    {['Agent Name','Platform','Status','Progress','Last Run','Actions'].map(h => (
                      <th key={h} style={{ textAlign:'left', padding:'8px 12px', color:C.muted, fontSize:11, fontWeight:600, letterSpacing:'0.07em', textTransform:'uppercase', fontFamily:'Syne,sans-serif', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredAgents.map((agent, i) => (
                    <tr key={agent.id} className={`agent-row ${createFlash && i === 0 && agent.id === agents[0].id ? 'flash-row' : ''}`} style={{ borderBottom:`1px solid ${C.border}`, transition:'background 0.15s' }}>
                      <td style={{ padding:'12px' }}>
                        <div style={{ fontWeight:600, color:C.text }}>{agent.name}</div>
                        <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>#{agent.id.toString().padStart(4,'0')} · {agent.category}</div>
                      </td>
                      <td style={{ padding:'12px' }}>
                        <span style={{ color: PLATFORM_COLORS[agent.platform] || C.muted, fontWeight:600, fontSize:12 }}>
                          {agent.platform}
                        </span>
                      </td>
                      <td style={{ padding:'12px' }}>
                        <StatusBadge status={agent.status}/>
                      </td>
                      <td style={{ padding:'12px', minWidth:120 }}>
                        <div style={{ marginBottom:4, fontSize:11, color:agent.status==='Error'?C.red:C.muted }}>{agent.progress}%</div>
                        <ProgressBar value={agent.progress} color={
                          agent.status==='Error' ? C.red :
                          agent.status==='Done'  ? C.green :
                          agent.status==='Running' ? C.teal : C.gold
                        }/>
                      </td>
                      <td style={{ padding:'12px', color:C.muted, fontSize:12, whiteSpace:'nowrap' }}>{agent.lastRun}</td>
                      <td style={{ padding:'12px' }}>
                        <div style={{ display:'flex', gap:6 }}>
                          <button className="btn-action" style={{ ...btnGhost, fontSize:11 }} title="View Logs">
                            <Icon name="terminal" size={12} color={C.teal}/>
                          </button>
                          <button className="btn-action" style={{ ...btnGhost, fontSize:11 }} title="Pause" onClick={() => handlePauseAgent(agent.id)}>
                            <Icon name="pause" size={12} color={C.gold}/>
                          </button>
                          <button className="btn-action" style={{ ...btnGhost, fontSize:11 }} title="Restart" onClick={() => handleRestartAgent(agent.id)}>
                            <Icon name="restart" size={12} color={C.green}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredAgents.length === 0 && (
                    <tr><td colSpan={6} style={{ padding:'32px', textAlign:'center', color:C.muted, fontSize:13 }}>No agents in this category.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── 5. EXECUTION TIMELINE ─────────────────────────────────────────── */}
          <div style={card}>
            <div style={{ ...sectionLabel }}>Execution Timeline</div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <h2 style={{ margin:0, fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:17 }}>Last 20 Agent Runs</h2>
              <span style={{ fontSize:11, color:C.teal, display:'flex', alignItems:'center', gap:5 }}>
                <PulseDot color={C.teal}/> Live
              </span>
            </div>
            <div ref={timelineRef} style={{ display:'flex', gap:10, overflowX:'auto', paddingBottom:10, scrollBehavior:'smooth' }}>
              {timeline.map((item) => {
                const m = statusMeta[item.status] || statusMeta.Queued;
                return (
                  <div key={item.id} className={item.isNew ? 'new-timeline-item' : ''}
                    style={{ flexShrink:0, width:120, background:C.surface3, border:`1px solid ${item.isNew ? m.color : C.border}`, borderRadius:10, padding:'12px', display:'flex', flexDirection:'column', gap:5, transition:'border-color 0.3s' }}>
                    <div style={{ fontSize:10, color:C.muted, fontFamily:'DM Mono,monospace' }}>{item.time}</div>
                    <div style={{ fontWeight:600, fontSize:12, color:C.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.name}</div>
                    <div style={{ fontSize:11, color:C.muted }}>⏱ {item.duration}</div>
                    <div style={{ marginTop:4, height:4, borderRadius:99, background:m.color, boxShadow:`0 0 8px ${m.color}66` }}/>
                    <div style={{ fontSize:10, color:m.color, fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase' }}>{item.status}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Two-column row: Webhook + Logs ──────────────────────────────────── */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>

            {/* ── 7. WEBHOOK TRIGGER PANEL ──────────────────────────────────────── */}
            <div style={card}>
              <div style={sectionLabel}>Webhook Triggers</div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:`${C.purple}18`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon name="webhook" size={15} color={C.purple}/>
                </div>
                <h3 style={{ margin:0, fontFamily:'Syne,sans-serif', fontSize:15, fontWeight:700 }}>Incoming Webhook</h3>
              </div>

              {/* URL row */}
              <div style={{ display:'flex', gap:8, marginBottom:16, alignItems:'center' }}>
                <div style={{ flex:1, background:C.surface3, border:`1px solid ${C.border}`, borderRadius:8, padding:'9px 12px', fontSize:12, color:C.muted, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontFamily:'DM Mono,monospace' }}>
                  {WEBHOOK_URL}
                </div>
                <button style={{ ...btnGhost, color: copied ? C.green : C.muted, borderColor: copied ? C.green : C.border, whiteSpace:'nowrap', transition:'all 0.15s' }} onClick={handleCopyWebhook}>
                  {copied ? <Icon name="check" size={13} color={C.green}/> : <Icon name="copy" size={13} color={C.muted}/>}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Event type selector */}
              <label style={{ fontSize:11, color:C.muted, display:'block', marginBottom:5 }}>Filter Event Type</label>
              <select style={{ ...inputStyle, marginBottom:16, cursor:'pointer' }} value={webhookEventType} onChange={e=>setWebhookEventType(e.target.value)}>
                <option value="agent.completed">agent.completed</option>
                <option value="agent.error">agent.error</option>
                <option value="pipeline.started">pipeline.started</option>
                <option value="webhook.test">webhook.test</option>
              </select>

              {/* Recent events */}
              <div style={sectionLabel}>Recent Events</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {WEBHOOK_EVENTS.filter(e => webhookEventType === 'all' || e.type === webhookEventType || true).slice(0,5).map(ev => {
                  const isErr = ev.type.includes('error');
                  const c = isErr ? C.red : C.teal;
                  return (
                    <div key={ev.id} style={{ background:C.surface3, borderRadius:8, padding:'10px 12px', border:`1px solid ${C.border}`, transition:'border-color 0.2s' }}
                      onMouseEnter={e=>e.currentTarget.style.borderColor=`${c}44`}
                      onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                        <span style={{ fontSize:11, fontWeight:600, color:c, fontFamily:'Syne,sans-serif', letterSpacing:'0.04em' }}>{ev.type}</span>
                        <span style={{ fontSize:10, color:C.muted }}>{ev.time}</span>
                      </div>
                      <div style={{ fontSize:10, color:C.muted, fontFamily:'DM Mono,monospace', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{ev.payload}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── 8. LOGS VIEWER ──────────────────────────────────────────────────── */}
            <div style={card}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:`${C.green}18`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon name="terminal" size={15} color={C.green}/>
                  </div>
                  <div>
                    <div style={sectionLabel}>System Logs</div>
                    <h3 style={{ margin:0, fontFamily:'Syne,sans-serif', fontSize:15, fontWeight:700 }}>Live Log Stream</h3>
                  </div>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button className="btn-action" style={{ ...btnGhost, fontSize:11 }} onClick={clearLogs}>
                    <Icon name="trash" size={12} color={C.red}/> Clear
                  </button>
                  <button className="btn-action" style={{ ...btnGhost, fontSize:11 }}>
                    <Icon name="export" size={12} color={C.teal}/> Export
                  </button>
                </div>
              </div>

              <div ref={logsRef} style={{
                background:'#080810', borderRadius:10, height:320, overflowY:'auto',
                padding:'14px 16px', fontFamily:'DM Mono,monospace', fontSize:12, lineHeight:1.8,
                border:`1px solid ${C.border}`, scrollBehavior:'smooth',
                animation:'glow-pulse 3s ease infinite',
              }}>
                {logs.map(log => (
                  <div key={log.id} style={{ display:'flex', gap:10, borderBottom:`1px solid rgba(255,255,255,0.03)`, padding:'2px 0' }}>
                    <span style={{ color:C.muted, flexShrink:0 }}>{log.time}</span>
                    <span style={{ color: LOG_COLORS[log.level] || C.muted, flexShrink:0, minWidth:52, fontWeight:600, textTransform:'uppercase', fontSize:10, letterSpacing:'0.05em', alignSelf:'center' }}>[{log.level}]</span>
                    <span style={{ color: log.level === 'error' ? '#fca5a5' : log.level === 'warn' ? '#fde68a' : log.level === 'success' ? '#bbf7d0' : log.level === 'debug' ? C.muted : '#e0e7ff' }}>{log.msg}</span>
                  </div>
                ))}
                {logs.length === 0 && (
                  <div style={{ color:C.muted, textAlign:'center', marginTop:40 }}>No logs. Logs will appear here in real time.</div>
                )}
              </div>
            </div>
          </div>

          {/* ── SPACER for bottom status bar ────────────────────────────────────── */}
          <div style={{ height:24 }}/>
        </div>

        {/* ── 10. BOTTOM STATUS BAR ──────────────────────────────────────────────── */}
        <div style={{
          position:'fixed', bottom:0, left:0, right:0,
          background:'rgba(14,14,22,0.96)', backdropFilter:'blur(12px)',
          borderTop:`1px solid ${C.border}`,
          padding:'0 32px', height:48, display:'flex', alignItems:'center',
          justifyContent:'space-between', zIndex:100, fontSize:12, fontFamily:'DM Mono,monospace',
        }}>
          <div style={{ display:'flex', gap:28, alignItems:'center' }}>
            {/* Queue depth */}
            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
              <span style={{ color:C.muted }}>Queue</span>
              <span style={{ background:`${C.gold}18`, color:C.gold, borderRadius:4, padding:'1px 7px', fontWeight:600, fontSize:11 }}>8 pending</span>
            </div>
            {/* System load */}
            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
              <span style={{ color:C.muted }}>Load</span>
              <div style={{ width:60, height:4, borderRadius:99, background:'rgba(255,255,255,0.07)', overflow:'hidden' }}>
                <div style={{ height:'100%', width:'73%', background:C.teal, borderRadius:99 }}/>
              </div>
              <span style={{ color:C.teal, fontWeight:600 }}>73%</span>
            </div>
            {/* Memory */}
            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
              <span style={{ color:C.muted }}>Mem</span>
              <div style={{ width:50, height:4, borderRadius:99, background:'rgba(255,255,255,0.07)', overflow:'hidden' }}>
                <div style={{ height:'100%', width:'55%', background:C.purple, borderRadius:99 }}/>
              </div>
              <span style={{ color:C.purple, fontWeight:600 }}>2.1 GB</span>
            </div>
          </div>

          <div style={{ display:'flex', gap:24, alignItems:'center' }}>
            {/* Uptime */}
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ color:C.muted }}>Uptime</span>
              <span style={{ color:C.green, fontWeight:600 }}>{fmtUptime(uptime)}</span>
            </div>
            {/* Live indicator */}
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <PulseDot color={C.green}/>
              <span style={{ color:C.green, fontWeight:600, fontSize:11, letterSpacing:'0.08em' }}>ALL SYSTEMS NOMINAL</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { useState, useEffect, useRef, useCallback } from 'react';

// ─── CSS VARS (inline) ────────────────────────────────────────────────────────
const V = {
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
  yellow: '#eab308',
  white: '#e8e8f0',
};

// ─── KEYFRAMES injected once ──────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap');
@keyframes scanLine {
  0%   { transform: translateY(-100%); opacity: 0; }
  10%  { opacity: 0.4; }
  90%  { opacity: 0.4; }
  100% { transform: translateY(100vh); opacity: 0; }
}
@keyframes pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
  50% { opacity: 0.7; box-shadow: 0 0 0 6px rgba(34,197,94,0); }
}
@keyframes ticker {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes toastIn {
  0%   { transform: translateX(120%); opacity: 0; }
  15%  { transform: translateX(0); opacity: 1; }
  85%  { transform: translateX(0); opacity: 1; }
  100% { transform: translateX(120%); opacity: 0; }
}
@keyframes progressBar {
  from { width: 0%; }
  to   { width: 100%; }
}
@keyframes ringRotate {
  to { stroke-dashoffset: -283; }
}
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 8px rgba(245,183,49,0.3); }
  50% { box-shadow: 0 0 20px rgba(245,183,49,0.7), 0 0 40px rgba(245,183,49,0.3); }
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'DM Mono', monospace; }
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(245,183,49,0.3); border-radius: 2px; }
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt2 = n => String(n).padStart(2, '0');
function useClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  return t;
}
function useUptime(start) {
  const [secs, setSecs] = useState(0);
  useEffect(() => { const id = setInterval(() => setSecs(s => s + 1), 1000); return () => clearInterval(id); }, []);
  const total = start + secs;
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${d}d ${fmt2(h)}h ${fmt2(m)}m ${fmt2(s)}s`;
}

// ─── TICKER DATA ─────────────────────────────────────────────────────────────
const TICKER_EVENTS = [
  { text: '⚡ Bolt.new broadcast delivered — prompt accepted', color: V.teal },
  { text: '✓ Lovable session active — 3 tasks queued', color: V.green },
  { text: '⚠ Low credits: cursor_main — 142 remaining', color: V.yellow },
  { text: '⚡ Replit broadcast complete — 200ms latency', color: V.teal },
  { text: '✓ v0.dev session keepalive successful', color: V.green },
  { text: '📊 Nightly report generated — 18 pages', color: V.purple },
  { text: '⚠ API rate limit approaching: openai_key_3', color: V.yellow },
  { text: '⚡ Emergency broadcast sent to all 7 platforms', color: V.gold },
  { text: '✓ Token budget guard triggered — capped at 50k', color: V.green },
  { text: '🔒 Security scan completed — 0 threats found', color: V.green },
  { text: '⚡ Windsurf agent completed task #482', color: V.teal },
  { text: '❌ bolt_backup connection timeout — retrying…', color: V.red },
  { text: '✓ Weekly summary exported to S3', color: V.green },
  { text: '⚡ Cursor session restored from snapshot', color: V.teal },
];

// ─── COMMAND HISTORY ──────────────────────────────────────────────────────────
const INIT_HISTORY = [
  { cmd: 'broadcast --all --prompt "Build me a responsive navbar"', out: '✓ Queued to 7 platforms. ETA: 12s', ok: true },
  { cmd: 'status --platform bolt', out: '● bolt.new: ACTIVE | session: abc123 | credits: 8,421', ok: true },
  { cmd: 'credits --check --all', out: 'bolt: 8421 | cursor: 142 ⚠ | lovable: 3200 | replit: 5100 | v0: 2800 | windsurf: 4400 | copilot: 9900', ok: true },
  { cmd: 'ping --all', out: 'bolt: 34ms ✓ | cursor: 89ms ✓ | lovable: 12ms ✓ | replit: 201ms ⚠ | v0: 45ms ✓', ok: true },
  { cmd: 'schedule --list', out: '3 jobs scheduled | next: nightly_report in 4h 22m', ok: true },
  { cmd: 'agent --list', out: '4 agents running: broadcast_agent, credit_monitor, session_keeper, health_checker', ok: true },
  { cmd: 'export --type=report --last=7d', out: '✓ report_2026-05-25_to_2026-06-01.pdf written to /exports/', ok: true },
  { cmd: 'broadcast --platform lovable --priority high --prompt "Fix auth bug"', out: '✓ High-priority task sent. Position: 1 in queue', ok: true },
  { cmd: 'help', out: 'Commands: broadcast, status, ping, credits, schedule, agent, export, clear, help', ok: true },
  { cmd: 'status --all', out: '● System: OPERATIONAL | Uptime: 14d 6h | Active: 4 agents | Queue: 18 | Failed: 3', ok: true },
];

const CMD_SUGGESTIONS = {
  br: ['broadcast', 'browse'],
  st: ['status', 'stop'],
  pi: ['ping'],
  cr: ['credits'],
  sc: ['schedule'],
  ag: ['agent'],
  ex: ['export'],
  cl: ['clear'],
  he: ['help'],
};

const CMD_OUTPUTS = {
  broadcast: '✓ Broadcasting to all 7 platforms… ETA: 14s',
  status: '● System: OPERATIONAL | 4 agents | 18 queued | uptime: 14d 6h',
  ping: 'bolt: 34ms ✓ | cursor: 89ms ✓ | lovable: 12ms ✓ | replit: 201ms ⚠ | v0: 45ms ✓',
  credits: 'bolt: 8421 | cursor: 142 ⚠ | lovable: 3200 | replit: 5100 | v0: 2800 | windsurf: 4400',
  schedule: '3 jobs | nightly_report → 4h 22m | weekly_summary → 3d | health_check → 15m',
  agent: 'broadcast_agent ● | credit_monitor ● | session_keeper ● | health_checker ●',
  export: '✓ Export queued — report_2026-06-01.pdf',
  clear: '__CLEAR__',
  help: 'broadcast  status  ping  credits  schedule  agent  export  clear  help',
};

// ─── AUTOMATIONS ─────────────────────────────────────────────────────────────
const INIT_AUTOMATIONS = [
  { id: 1, name: 'Auto-Broadcast', desc: 'Send queued prompts every 30 min', status: true, lastRun: '14m ago', nextRun: '16m' },
  { id: 2, name: 'Credit Top-Up Alert', desc: 'Alert when any account < 200 credits', status: true, lastRun: '2h ago', nextRun: '10m' },
  { id: 3, name: 'Session Keepalive', desc: 'Ping all sessions every 5 min', status: true, lastRun: '4m ago', nextRun: '1m' },
  { id: 4, name: 'Nightly Report', desc: 'Generate daily summary at 00:00', status: true, lastRun: '14h ago', nextRun: '9h 38m' },
  { id: 5, name: 'Weekly Summary', desc: 'Compile weekly metrics every Monday', status: false, lastRun: '6d ago', nextRun: 'Paused' },
  { id: 6, name: 'Error Recovery', desc: 'Auto-retry failed tasks after 60s', status: true, lastRun: '1h ago', nextRun: '~1min' },
  { id: 7, name: 'Token Budget Guard', desc: 'Cap token spend at 50k/day', status: true, lastRun: '30m ago', nextRun: '5m' },
  { id: 8, name: 'Platform Health Check', desc: 'Full API health sweep every hour', status: true, lastRun: '22m ago', nextRun: '38m' },
];

// ─── PLATFORMS ───────────────────────────────────────────────────────────────
const PLATFORMS = [
  { id: 'bolt', label: 'bolt.new', credits: 8421, status: 'up' },
  { id: 'cursor', label: 'Cursor', credits: 142, status: 'degraded' },
  { id: 'lovable', label: 'Lovable', credits: 3200, status: 'up' },
  { id: 'replit', label: 'Replit', credits: 5100, status: 'up' },
  { id: 'v0', label: 'v0.dev', credits: 2800, status: 'up' },
  { id: 'windsurf', label: 'Windsurf', credits: 4400, status: 'up' },
  { id: 'copilot', label: 'GitHub Copilot', credits: 9900, status: 'up' },
];

// ─── INCIDENTS ────────────────────────────────────────────────────────────────
const INIT_INCIDENTS = [
  { id: 1, sev: 'P1', title: 'Cursor credits critically low', platform: 'Cursor', since: '2h 14m', assignee: 'Auto', resolved: false },
  { id: 2, sev: 'P2', title: 'Replit API latency spike (>200ms)', platform: 'Replit', since: '38m', assignee: 'Unassigned', resolved: false },
  { id: 3, sev: 'P3', title: 'bolt_backup session timeout', platform: 'bolt.new', since: '12m', assignee: 'Unassigned', resolved: false },
];

// ─── MACROS ──────────────────────────────────────────────────────────────────
const MACROS = [
  { id: 1, name: 'Morning Standup', icon: '🌅', desc: 'Status all, ping all, generate daily briefing', cmds: ['status --all', 'ping --all', 'export --type=briefing'] },
  { id: 2, name: 'End of Day', icon: '🌆', desc: 'Export report, clear queue, set agents to idle', cmds: ['export --type=report --last=1d', 'schedule --pause-all', 'agent --idle-all'] },
  { id: 3, name: 'Weekly Deploy', icon: '🚀', desc: 'Full broadcast, bump all sessions, export summary', cmds: ['broadcast --all --priority high', 'agent --restart-all', 'export --type=weekly'] },
  { id: 4, name: 'Emergency Broadcast', icon: '🚨', desc: 'High-priority blast to ALL platforms immediately', cmds: ['broadcast --all --priority critical --skip-queue'] },
  { id: 5, name: 'Credit Refill', icon: '💳', desc: 'Check all credits, alert for low, auto top-up', cmds: ['credits --check --all', 'credits --topup --threshold=500'] },
  { id: 6, name: 'Full Ping Sweep', icon: '📡', desc: 'Ping all APIs, record latencies, flag degraded', cmds: ['ping --all --verbose', 'status --api-health'] },
  { id: 7, name: 'Export All', icon: '📦', desc: 'Export all reports, logs, and session snapshots', cmds: ['export --all --format=zip'] },
  { id: 8, name: 'Reset Sessions', icon: '🔄', desc: 'Kill and restart all platform sessions', cmds: ['agent --kill-all', 'agent --restart-all', 'status --all'] },
];

// ─── SVG CHART ────────────────────────────────────────────────────────────────
function Sparkline({ data, color, fill, width = 280, height = 60 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data) || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / (max - min || 1)) * (height - 8) - 4;
    return `${x},${y}`;
  });
  const pathD = `M ${pts.join(' L ')}`;
  const areaD = `M ${pts[0]} L ${pts.join(' L ')} L ${width},${height} L 0,${height} Z`;
  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      {fill && <path d={areaD} fill={`${color}22`} />}
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1].split(',')[0]} cy={pts[pts.length - 1].split(',')[1]} r="3" fill={color} />
    </svg>
  );
}

// ─── TOGGLE SWITCH ────────────────────────────────────────────────────────────
function Toggle({ on, onChange }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
        background: on ? V.teal : V.surface3,
        border: `1px solid ${on ? V.teal : V.border}`,
        position: 'relative', transition: 'all 0.25s',
        boxShadow: on ? `0 0 10px ${V.teal}55` : 'none',
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: on ? 23 : 3,
        width: 16, height: 16, borderRadius: '50%',
        background: on ? '#fff' : V.muted,
        transition: 'left 0.25s',
      }} />
    </div>
  );
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
function Card({ children, style, glow }) {
  return (
    <div style={{
      background: V.surface2,
      border: `1px solid ${V.border}`,
      borderRadius: 12,
      padding: '18px 20px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: glow ? `0 0 20px ${glow}22` : '0 2px 12px rgba(0,0,0,0.4)',
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── BADGE ────────────────────────────────────────────────────────────────────
function Badge({ label, color, pulse: doPulse }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 10px', borderRadius: 99,
      background: `${color}22`,
      border: `1px solid ${color}55`,
      color,
      fontSize: 11, fontFamily: 'DM Mono, monospace', fontWeight: 500,
      letterSpacing: '0.04em',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: color,
        animation: doPulse ? 'pulse 1.8s ease-in-out infinite' : 'none',
        display: 'inline-block',
      }} />
      {label}
    </span>
  );
}

// ─── SECTION TITLE ────────────────────────────────────────────────────────────
function SectionTitle({ icon, title, sub }) {
  return (
    <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: V.white, letterSpacing: '0.02em' }}>{title}</div>
        {sub && <div style={{ fontSize: 11, color: V.muted, marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: V.surface3, border: `1px solid ${t.color || V.gold}55`,
          borderLeft: `3px solid ${t.color || V.gold}`,
          borderRadius: 8, padding: '10px 16px',
          color: V.white, fontSize: 13, fontFamily: 'DM Mono, monospace',
          animation: 'toastIn 3.2s ease forwards',
          maxWidth: 340,
          boxShadow: `0 4px 24px rgba(0,0,0,0.5)`,
        }}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function CommandCenter() {
  const clock = useClock();
  const uptime = useUptime(14 * 86400 + 6 * 3600 + 22 * 60 + 18);

  const [toasts, setToasts] = useState([]);
  const [automations, setAutomations] = useState(INIT_AUTOMATIONS);
  const [incidents, setIncidents] = useState(INIT_INCIDENTS);
  const [cmdInput, setCmdInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState(INIT_HISTORY);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState(PLATFORMS.map(p => p.id));
  const [broadcastPrompt, setBroadcastPrompt] = useState('');
  const [broadcastDelay, setBroadcastDelay] = useState(1);
  const [priorityMode, setPriorityMode] = useState(false);
  const [launchStep, setLaunchStep] = useState(0); // 0=idle, 1=confirm, 2=running, 3=done
  const [launchProgress, setLaunchProgress] = useState([]);
  const [activeMacro, setActiveMacro] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [expandPastIncidents, setExpandPastIncidents] = useState(false);
  const [schedulerPaused, setSchedulerPaused] = useState(false);
  const [agentCount, setAgentCount] = useState(4);
  const [showMacroForm, setShowMacroForm] = useState(false);

  // Charts data
  const [bpmData, setBpmData] = useState(() => Array.from({ length: 30 }, () => Math.floor(Math.random() * 40 + 10)));
  const [burnData, setBurnData] = useState(() => Array.from({ length: 30 }, () => Math.floor(Math.random() * 200 + 50)));
  const [latencyData, setLatencyData] = useState(() => Array.from({ length: 30 }, () => Math.floor(Math.random() * 150 + 20)));

  const termRef = useRef(null);
  const toastId = useRef(0);

  const pushToast = useCallback((msg, color = V.gold) => {
    const id = ++toastId.current;
    setToasts(t => [...t, { id, msg, color }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3300);
  }, []);

  // Chart update every 2s
  useEffect(() => {
    const id = setInterval(() => {
      setBpmData(d => [...d.slice(1), Math.floor(Math.random() * 40 + 10)]);
      setBurnData(d => [...d.slice(1), Math.floor(Math.random() * 200 + 50)]);
      setLatencyData(d => [...d.slice(1), Math.floor(Math.random() * 150 + 20)]);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  // Auto-log every 3s
  useEffect(() => {
    const msgs = [
      { cmd: 'session --keepalive --all', out: '✓ 7/7 sessions refreshed', ok: true },
      { cmd: 'credits --check cursor', out: '⚠ cursor: 142 credits remaining', ok: false },
      { cmd: 'agent --heartbeat', out: '● broadcast_agent alive | ● session_keeper alive', ok: true },
      { cmd: 'ping --bolt', out: 'bolt.new: 31ms ✓', ok: true },
      { cmd: 'queue --status', out: 'Depth: 18 | Processing: 2 | ETA: ~8m', ok: true },
    ];
    let i = 0;
    const id = setInterval(() => {
      setCmdHistory(h => [...h.slice(-19), msgs[i % msgs.length]]);
      i++;
    }, 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [cmdHistory]);

  const handleCmd = (e) => {
    e.preventDefault();
    const raw = cmdInput.trim();
    if (!raw) return;
    const base = raw.split(' ')[0].toLowerCase();
    const outStr = CMD_OUTPUTS[base] || `bash: ${base}: command not found`;
    if (outStr === '__CLEAR__') {
      setCmdHistory([]);
    } else {
      const ok = !!CMD_OUTPUTS[base];
      setCmdHistory(h => [...h.slice(-18), { cmd: raw, out: outStr, ok }]);
    }
    setCmdInput('');
    setSuggestions([]);
  };

  const handleCmdChange = (val) => {
    setCmdInput(val);
    const prefix = val.slice(0, 2).toLowerCase();
    setSuggestions(CMD_SUGGESTIONS[prefix] || []);
  };

  const toggleAutomation = (id) => {
    setAutomations(a => a.map(x => x.id === id ? { ...x, status: !x.status } : x));
    const a = automations.find(x => x.id === id);
    if (a) pushToast(`${a.name} ${a.status ? 'paused' : 'activated'}`, a.status ? V.yellow : V.teal);
  };

  const handleLaunch = () => {
    if (!broadcastPrompt.trim()) { pushToast('⚠ Enter a prompt first', V.yellow); return; }
    if (selectedPlatforms.length === 0) { pushToast('⚠ Select at least one platform', V.yellow); return; }
    if (launchStep === 0) { setLaunchStep(1); return; }
    if (launchStep === 1) {
      setLaunchStep(2);
      setLaunchProgress([]);
      let idx = 0;
      const selected = PLATFORMS.filter(p => selectedPlatforms.includes(p.id));
      const run = () => {
        if (idx >= selected.length) { setLaunchStep(3); pushToast('🚀 Broadcast complete!', V.gold); return; }
        setTimeout(() => {
          setLaunchProgress(p => [...p, selected[idx].id]);
          idx++;
          run();
        }, (broadcastDelay * 1000) + 300);
      };
      run();
    }
  };

  const resolveIncident = (id) => {
    setIncidents(inc => inc.map(x => x.id === id ? { ...x, resolved: true } : x));
    pushToast('✓ Incident resolved', V.green);
  };

  const services = [
    { name: 'bolt.new API', status: 'up' }, { name: 'Cursor API', status: 'degraded' },
    { name: 'Lovable API', status: 'up' }, { name: 'Replit API', status: 'up' },
    { name: 'v0.dev API', status: 'up' }, { name: 'Windsurf API', status: 'up' },
    { name: 'GitHub Copilot', status: 'up' }, { name: 'OpenAI Gateway', status: 'up' },
    { name: 'Auth Service', status: 'up' }, { name: 'Export Worker', status: 'down' },
  ];
  const upCount = services.filter(s => s.status === 'up').length;
  const healthPct = Math.round((upCount / services.length) * 100);

  const statusColor = s => s === 'up' ? V.green : s === 'degraded' ? V.yellow : V.red;
  const sevColor = s => s === 'P1' ? V.red : s === 'P2' ? V.yellow : V.muted;

  const pastIncidents = [
    { id: 10, sev: 'P2', title: 'Lovable rate limit exceeded', platform: 'Lovable', resolvedAt: '2d ago', duration: '22m' },
    { id: 11, sev: 'P3', title: 'Export worker slow response', platform: 'Export', resolvedAt: '4d ago', duration: '8m' },
    { id: 12, sev: 'P1', title: 'OpenAI gateway outage', platform: 'OpenAI', resolvedAt: '6d ago', duration: '1h 14m' },
  ];

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{STYLES}</style>
      <Toast toasts={toasts} />

      {/* Service Detail Popup */}
      {selectedService && (
        <div
          onClick={() => setSelectedService(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 8888,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: V.surface2, border: `1px solid ${statusColor(selectedService.status)}55`,
              borderRadius: 14, padding: 28, width: 360,
              animation: 'fadeIn 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontFamily: 'Syne', fontWeight: 700, color: V.white, fontSize: 16 }}>{selectedService.name}</span>
              <Badge label={selectedService.status.toUpperCase()} color={statusColor(selectedService.status)} pulse={selectedService.status === 'up'} />
            </div>
            {[
              ['Endpoint', `https://api.${selectedService.name.toLowerCase().replace(/\s/g, '')}.com`],
              ['Latency', selectedService.status === 'down' ? 'N/A' : '42ms'],
              ['Last Check', '3m ago'],
              ['Uptime (30d)', selectedService.status === 'down' ? '94.2%' : '99.8%'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${V.border}`, padding: '8px 0', fontSize: 13, fontFamily: 'DM Mono' }}>
                <span style={{ color: V.muted }}>{k}</span>
                <span style={{ color: V.white }}>{v}</span>
              </div>
            ))}
            <button
              onClick={() => setSelectedService(null)}
              style={{ marginTop: 18, width: '100%', padding: '9px', borderRadius: 8, border: `1px solid ${V.border}`, background: V.surface3, color: V.white, cursor: 'pointer', fontFamily: 'DM Mono', fontSize: 13 }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Macro Confirm Popup */}
      {activeMacro && (
        <div
          onClick={() => setActiveMacro(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 8888, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: V.surface2, border: `1px solid ${V.gold}33`, borderRadius: 14, padding: 28, width: 420, animation: 'fadeIn 0.2s ease' }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{activeMacro.icon}</div>
            <div style={{ fontFamily: 'Syne', fontWeight: 700, color: V.white, fontSize: 18, marginBottom: 8 }}>{activeMacro.name}</div>
            <div style={{ color: V.muted, fontSize: 13, marginBottom: 18 }}>{activeMacro.desc}</div>
            <div style={{ background: V.surface, borderRadius: 8, padding: '12px 14px', marginBottom: 20 }}>
              {activeMacro.cmds.map((c, i) => (
                <div key={i} style={{ fontFamily: 'DM Mono', fontSize: 12, color: V.teal, marginBottom: 4 }}>$ {c}</div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => { pushToast(`🚀 ${activeMacro.name} executed`, V.gold); setActiveMacro(null); }}
                style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: V.gold, color: V.surface, fontWeight: 700, cursor: 'pointer', fontFamily: 'Syne', fontSize: 14 }}
              >
                Run Macro
              </button>
              <button
                onClick={() => setActiveMacro(null)}
                style={{ flex: 1, padding: '10px', borderRadius: 8, border: `1px solid ${V.border}`, background: 'transparent', color: V.muted, cursor: 'pointer', fontFamily: 'DM Mono', fontSize: 13 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAGE WRAPPER */}
      <div style={{ background: V.surface, minHeight: '100vh', fontFamily: 'DM Mono, monospace', color: V.white, padding: '0 0 80px 0' }}>

        {/* ── 1. CINEMATIC HEADER ────────────────────────────────────────────── */}
        <div style={{
          background: `linear-gradient(180deg, #0a0a12 0%, ${V.surface2} 100%)`,
          borderBottom: `1px solid ${V.border}`,
          position: 'relative',
          overflow: 'hidden',
          paddingBottom: 0,
        }}>
          {/* Scan line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, transparent 0%, ${V.teal}88 50%, transparent 100%)`,
            animation: 'scanLine 4s linear infinite',
            zIndex: 1,
          }} />
          {/* Grid bg */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `linear-gradient(${V.border} 1px, transparent 1px), linear-gradient(90deg, ${V.border} 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            opacity: 0.4,
          }} />

          <div style={{ position: 'relative', zIndex: 2, padding: '28px 40px 0' }}>
            {/* Main row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                {/* System status ring SVG */}
                <svg width={64} height={64} style={{ flexShrink: 0 }}>
                  <circle cx={32} cy={32} r={28} fill="none" stroke={V.surface3} strokeWidth={4} />
                  <circle cx={32} cy={32} r={28} fill="none" stroke={V.green} strokeWidth={4}
                    strokeDasharray={`${2 * Math.PI * 28 * 0.9} ${2 * Math.PI * 28 * 0.1}`}
                    strokeDashoffset={2 * Math.PI * 28 * 0.25}
                    style={{ transition: 'stroke-dasharray 1s ease' }} />
                  <text x={32} y={37} textAnchor="middle" fill={V.green} fontSize={13} fontFamily="DM Mono" fontWeight="500">{healthPct}%</text>
                </svg>
                <div>
                  <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 32, letterSpacing: '-0.02em', color: V.white, lineHeight: 1 }}>
                    Command Center
                  </h1>
                  <div style={{ fontFamily: 'Syne', fontSize: 11, color: V.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 4 }}>
                    Bolt Studio Pro — Mission Control
                  </div>
                </div>
                <Badge label="OPERATIONAL" color={V.green} pulse />
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'DM Mono', fontSize: 28, color: V.gold, letterSpacing: '0.04em', fontWeight: 500 }}>
                  {fmt2(clock.getHours())}:{fmt2(clock.getMinutes())}:{fmt2(clock.getSeconds())}
                </div>
                <div style={{ fontSize: 11, color: V.muted }}>
                  {clock.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Sub-header stats bar */}
            <div style={{
              display: 'flex', gap: 0, marginTop: 20,
              borderTop: `1px solid ${V.border}`,
              background: `${V.surface}88`,
            }}>
              {[
                { label: 'Total Operations Today', val: '4,821', color: V.teal },
                { label: 'Queued', val: '18', color: V.gold },
                { label: 'Failed', val: '3', color: V.red },
                { label: 'Uptime', val: uptime, color: V.green },
                { label: 'Active Agents', val: agentCount.toString(), color: V.purple },
                { label: 'Platforms', val: '7 / 7', color: V.teal },
              ].map((s, i) => (
                <div key={i} style={{
                  flex: 1, borderRight: `1px solid ${V.border}`, padding: '12px 16px',
                  borderBottom: '3px solid transparent',
                  ...(i === 0 && { borderLeft: 'none' }),
                }}>
                  <div style={{ fontSize: 10, color: V.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 500, color: s.color, fontFamily: 'DM Mono' }}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* ── 2. MASTER CONTROL PANEL ──────────────────────────────────────── */}
          <section>
            <SectionTitle icon="🎛" title="Master Control Panel" sub="3×3 command pods — live system controls" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>

              {/* 🚀 Launch Broadcast */}
              <Card glow={V.gold}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span>🚀</span>
                  <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14 }}>Launch Broadcast</span>
                </div>
                <select style={{ width: '100%', background: V.surface3, border: `1px solid ${V.border}`, borderRadius: 6, padding: '6px 10px', color: V.white, fontSize: 12, marginBottom: 8, fontFamily: 'DM Mono' }}>
                  <option>All Platforms (7)</option>
                  {PLATFORMS.map(p => <option key={p.id}>{p.label}</option>)}
                </select>
                <input
                  placeholder="Quick prompt…"
                  style={{ width: '100%', background: V.surface3, border: `1px solid ${V.border}`, borderRadius: 6, padding: '7px 10px', color: V.white, fontSize: 12, marginBottom: 10, fontFamily: 'DM Mono', outline: 'none' }}
                />
                <button
                  onClick={() => pushToast('🚀 Broadcast queued!', V.gold)}
                  style={{ width: '100%', padding: '8px', borderRadius: 7, border: 'none', background: V.gold, color: V.surface, fontWeight: 700, cursor: 'pointer', fontFamily: 'Syne', fontSize: 13 }}
                >
                  FIRE ALL
                </button>
              </Card>

              {/* ⏱ Scheduler Control */}
              <Card glow={V.teal}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span>⏱</span>
                  <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14 }}>Scheduler Control</span>
                </div>
                <div style={{ fontSize: 11, color: V.muted, marginBottom: 6 }}>Next job in</div>
                <div style={{ fontSize: 28, fontFamily: 'DM Mono', color: V.teal, marginBottom: 12 }}>00:14:38</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => { setSchedulerPaused(p => !p); pushToast(schedulerPaused ? '▶ Scheduler resumed' : '⏸ Scheduler paused', V.teal); }}
                    style={{ flex: 1, padding: '7px', borderRadius: 6, border: `1px solid ${V.teal}55`, background: schedulerPaused ? V.teal : 'transparent', color: schedulerPaused ? V.surface : V.teal, cursor: 'pointer', fontFamily: 'DM Mono', fontSize: 12 }}
                  >
                    {schedulerPaused ? '▶ Resume' : '⏸ Pause'}
                  </button>
                  <button
                    onClick={() => pushToast('↺ Scheduler restarted', V.gold)}
                    style={{ flex: 1, padding: '7px', borderRadius: 6, border: `1px solid ${V.border}`, background: 'transparent', color: V.muted, cursor: 'pointer', fontFamily: 'DM Mono', fontSize: 12 }}
                  >
                    ↺ Restart
                  </button>
                </div>
              </Card>

              {/* 🤖 Agent Orchestrator */}
              <Card glow={V.purple}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span>🤖</span>
                  <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14 }}>Agent Orchestrator</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 36, fontFamily: 'DM Mono', color: V.purple }}>{agentCount}</span>
                  <span style={{ fontSize: 12, color: V.muted }}>running agents</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['Pause', 'Kill', 'Restart'].map(a => (
                    <button key={a}
                      onClick={() => { pushToast(`${a === 'Kill' ? '⚠' : '●'} All agents ${a.toLowerCase()}ed`, a === 'Kill' ? V.red : V.purple); if (a === 'Kill') setAgentCount(0); if (a === 'Restart') setAgentCount(4); }}
                      style={{ flex: 1, padding: '7px 4px', borderRadius: 6, border: `1px solid ${a === 'Kill' ? V.red + '44' : V.border}`, background: 'transparent', color: a === 'Kill' ? V.red : V.muted, cursor: 'pointer', fontFamily: 'DM Mono', fontSize: 11 }}
                    >{a}</button>
                  ))}
                </div>
              </Card>

              {/* 💳 Credit Guard */}
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span>💳</span>
                  <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14 }}>Credit Guard</span>
                </div>
                <div style={{ fontSize: 11, color: V.muted, marginBottom: 4 }}>Total credits</div>
                <div style={{ fontSize: 26, fontFamily: 'DM Mono', color: V.gold, marginBottom: 8 }}>
                  {PLATFORMS.reduce((s, p) => s + p.credits, 0).toLocaleString()}
                </div>
                {PLATFORMS.filter(p => p.credits < 300).map(p => (
                  <div key={p.id} style={{ fontSize: 11, color: V.red, marginBottom: 3 }}>⚠ {p.label}: {p.credits} remaining</div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                  <span style={{ fontSize: 12, color: V.muted }}>Low credit alert</span>
                  <Toggle on={true} onChange={() => pushToast('💳 Credit alert toggled', V.gold)} />
                </div>
              </Card>

              {/* 🔒 Security Status */}
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span>🔒</span>
                  <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14 }}>Security Status</span>
                </div>
                <Badge label="THREAT LEVEL: LOW" color={V.green} pulse />
                <div style={{ marginTop: 12, fontSize: 11, color: V.muted }}>Last scan: 2m ago</div>
                <div style={{ marginTop: 4, fontSize: 11, color: V.green }}>0 threats detected</div>
                <button
                  onClick={() => pushToast('🔒 Security scan initiated…', V.green)}
                  style={{ marginTop: 14, width: '100%', padding: '8px', borderRadius: 7, border: `1px solid ${V.green}44`, background: `${V.green}11`, color: V.green, cursor: 'pointer', fontFamily: 'DM Mono', fontSize: 12 }}
                >
                  Scan Now
                </button>
              </Card>

              {/* 📊 Analytics Pulse */}
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span>📊</span>
                  <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14 }}>Analytics Pulse</span>
                </div>
                {[
                  { l: 'Today\'s Broadcasts', v: '4,821', trend: '↑ 12%', c: V.green },
                  { l: 'Avg Response', v: '84ms', trend: '↓ 8ms', c: V.teal },
                  { l: 'Last Broadcast', v: '2m ago', trend: '', c: V.gold },
                ].map(r => (
                  <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
                    <span style={{ color: V.muted }}>{r.l}</span>
                    <span style={{ color: r.c }}>{r.v} <span style={{ fontSize: 10 }}>{r.trend}</span></span>
                  </div>
                ))}
              </Card>

              {/* 🔗 API Health */}
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span>🔗</span>
                  <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14 }}>API Health</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 26, fontFamily: 'DM Mono', color: V.red }}>1</span>
                  <span style={{ fontSize: 12, color: V.muted }}>failed endpoint</span>
                </div>
                <div style={{ fontSize: 11, color: V.muted, marginBottom: 12 }}>export_worker: DOWN</div>
                <button
                  onClick={() => pushToast('📡 Pinging all endpoints…', V.teal)}
                  style={{ width: '100%', padding: '8px', borderRadius: 7, border: `1px solid ${V.teal}44`, background: `${V.teal}11`, color: V.teal, cursor: 'pointer', fontFamily: 'DM Mono', fontSize: 12 }}
                >
                  Ping All
                </button>
              </Card>

              {/* 📡 Broadcast Queue */}
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span>📡</span>
                  <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14 }}>Broadcast Queue</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 30, fontFamily: 'DM Mono', color: V.teal }}>18</span>
                  <span style={{ fontSize: 12, color: V.muted }}>pending tasks</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, fontSize: 12 }}>
                  <span style={{ color: V.muted }}>Priority mode</span>
                  <Toggle on={priorityMode} onChange={() => { setPriorityMode(p => !p); pushToast(`Priority mode ${priorityMode ? 'off' : 'on'}`, V.gold); }} />
                </div>
                <button
                  onClick={() => pushToast('🗑 Queue draining…', V.red)}
                  style={{ width: '100%', padding: '8px', borderRadius: 7, border: `1px solid ${V.red}44`, background: `${V.red}11`, color: V.red, cursor: 'pointer', fontFamily: 'DM Mono', fontSize: 12 }}
                >
                  Drain Queue
                </button>
              </Card>

              {/* ⚙ System Health */}
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span>⚙</span>
                  <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14 }}>System Health</span>
                </div>
                {[{ l: 'CPU', val: 34, color: V.teal }, { l: 'Memory', val: 62, color: V.purple }, { l: 'Disk', val: 48, color: V.gold }].map(m => (
                  <div key={m.l} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                      <span style={{ color: V.muted }}>{m.l}</span>
                      <span style={{ color: m.color }}>{m.val}%</span>
                    </div>
                    <div style={{ height: 4, background: V.surface3, borderRadius: 99 }}>
                      <div style={{ height: '100%', width: `${m.val}%`, background: m.color, borderRadius: 99, transition: 'width 1s ease' }} />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => pushToast('⚙ Services restarting…', V.gold)}
                  style={{ width: '100%', padding: '7px', borderRadius: 7, border: `1px solid ${V.border}`, background: 'transparent', color: V.muted, cursor: 'pointer', fontFamily: 'DM Mono', fontSize: 12, marginTop: 4 }}
                >
                  ↺ Restart Services
                </button>
              </Card>
            </div>
          </section>

          {/* ── 3. LIVE OPERATIONS TICKER ──────────────────────────────────── */}
          <div style={{
            background: V.surface2, border: `1px solid ${V.border}`,
            borderRadius: 10, overflow: 'hidden',
            display: 'flex', alignItems: 'stretch',
          }}>
            <div style={{
              background: V.surface3, padding: '10px 16px', display: 'flex', alignItems: 'center',
              borderRight: `1px solid ${V.border}`, flexShrink: 0,
              fontSize: 10, letterSpacing: '0.12em', color: V.gold, fontWeight: 500,
            }}>
              ● LIVE
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{
                display: 'flex', gap: 40, padding: '10px 24px',
                animation: 'ticker 28s linear infinite',
                whiteSpace: 'nowrap',
                width: 'max-content',
              }}>
                {[...TICKER_EVENTS, ...TICKER_EVENTS].map((ev, i) => (
                  <span key={i} style={{ fontSize: 12, color: ev.color, flexShrink: 0 }}>{ev.text}</span>
                ))}
              </div>
            </div>
          </div>

          {/* ── 4. COMMAND CONSOLE ────────────────────────────────────────────── */}
          <section>
            <SectionTitle icon="💻" title="Command Console" sub="bsp-cmd — interactive terminal" />
            <div style={{
              background: '#09090f', border: `1px solid ${V.border}`,
              borderRadius: 12, overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            }}>
              {/* Terminal bar */}
              <div style={{ background: V.surface3, borderBottom: `1px solid ${V.border}`, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                {[V.red, V.yellow, V.green].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
                <span style={{ marginLeft: 12, fontSize: 12, color: V.muted, fontFamily: 'DM Mono' }}>bsp-cmd — bolt-studio-pro</span>
              </div>

              {/* Output area */}
              <div ref={termRef} style={{ height: 320, overflowY: 'auto', padding: '16px 20px', fontFamily: 'DM Mono', fontSize: 12 }}>
                <div style={{ color: V.muted, marginBottom: 12, fontSize: 11 }}>
                  Bolt Studio Pro Command Interface v2.4.1 — Type 'help' for available commands
                </div>
                {cmdHistory.map((h, i) => (
                  <div key={i} style={{ marginBottom: 10, animation: 'fadeIn 0.2s ease' }}>
                    <div style={{ color: V.gold }}>
                      <span style={{ color: V.teal }}>bsp-cmd</span>
                      <span style={{ color: V.purple }}> ❯ </span>
                      {h.cmd}
                    </div>
                    <div style={{ color: h.ok ? V.white : V.red, paddingLeft: 16, marginTop: 2 }}>{h.out}</div>
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', color: V.gold }}>
                  <span style={{ color: V.teal }}>bsp-cmd</span>
                  <span style={{ color: V.purple }}> ❯ </span>
                  <span style={{ animation: 'blink 1s step-end infinite', marginLeft: 2 }}>█</span>
                </div>
              </div>

              {/* Suggestion bar */}
              {suggestions.length > 0 && (
                <div style={{ background: V.surface2, borderTop: `1px solid ${V.border}`, padding: '6px 20px', display: 'flex', gap: 8 }}>
                  {suggestions.map(s => (
                    <button key={s} onClick={() => { setCmdInput(s + ' '); setSuggestions([]); }}
                      style={{ padding: '3px 12px', borderRadius: 5, border: `1px solid ${V.gold}44`, background: `${V.gold}11`, color: V.gold, cursor: 'pointer', fontFamily: 'DM Mono', fontSize: 11 }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <form onSubmit={handleCmd} style={{ borderTop: `1px solid ${V.border}`, display: 'flex', alignItems: 'center', padding: '0 20px' }}>
                <span style={{ color: V.teal, fontFamily: 'DM Mono', fontSize: 13, marginRight: 4 }}>bsp-cmd</span>
                <span style={{ color: V.purple, fontFamily: 'DM Mono', fontSize: 13, marginRight: 8 }}>❯</span>
                <input
                  value={cmdInput}
                  onChange={e => handleCmdChange(e.target.value)}
                  placeholder="broadcast --all --prompt '...'"
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    color: V.white, fontFamily: 'DM Mono', fontSize: 13,
                    padding: '14px 0',
                    caretColor: V.gold,
                  }}
                />
                <button type="submit" style={{ background: 'transparent', border: 'none', color: V.gold, cursor: 'pointer', fontFamily: 'DM Mono', fontSize: 12 }}>↵</button>
              </form>
            </div>

            {/* Available commands */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
              {['broadcast', 'status', 'ping', 'credits', 'schedule', 'agent', 'export', 'clear', 'help'].map(c => (
                <button key={c} onClick={() => { setCmdInput(c + ' '); setSuggestions([]); }}
                  style={{ padding: '4px 12px', borderRadius: 6, border: `1px solid ${V.border}`, background: V.surface2, color: V.muted, cursor: 'pointer', fontFamily: 'DM Mono', fontSize: 11 }}>
                  {c}
                </button>
              ))}
            </div>
          </section>

          {/* ── 5. AUTOMATION GRID ───────────────────────────────────────────── */}
          <section>
            <SectionTitle icon="⚡" title="Automation Grid" sub="8 active automations — toggle to enable/disable" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {automations.map(a => (
                <Card key={a.id} style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, color: V.white, lineHeight: 1.3 }}>{a.name}</div>
                    <Toggle on={a.status} onChange={() => toggleAutomation(a.id)} />
                  </div>
                  <div style={{ fontSize: 11, color: V.muted, marginBottom: 10, lineHeight: 1.5 }}>{a.desc}</div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 9, color: V.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Last Run</div>
                      <div style={{ fontSize: 11, color: V.teal }}>{a.lastRun}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: V.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Next Run</div>
                      <div style={{ fontSize: 11, color: a.status ? V.gold : V.muted }}>{a.nextRun}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Badge label={a.status ? 'ACTIVE' : 'PAUSED'} color={a.status ? V.green : V.muted} pulse={a.status} />
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* ── 6. BROADCAST BLAST LAUNCHER ──────────────────────────────────── */}
          <section>
            <SectionTitle icon="📡" title="Broadcast Blast Launcher" sub="Simultaneous multi-platform prompt delivery" />
            <Card glow={V.red} style={{ padding: '24px 28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
                <div>
                  <label style={{ fontSize: 11, color: V.muted, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Broadcast Prompt</label>
                  <textarea
                    value={broadcastPrompt}
                    onChange={e => { setBroadcastPrompt(e.target.value); if (launchStep > 0) setLaunchStep(0); }}
                    placeholder="Enter your prompt for all platforms..."
                    rows={6}
                    style={{
                      width: '100%', background: V.surface3, border: `1px solid ${V.border}`,
                      borderRadius: 8, padding: '14px 16px', color: V.white,
                      fontFamily: 'DM Mono', fontSize: 13, resize: 'vertical', outline: 'none',
                      lineHeight: 1.6,
                    }}
                  />

                  {/* Delivery progress */}
                  {launchStep >= 2 && (
                    <div style={{ marginTop: 16 }}>
                      <div style={{ fontSize: 11, color: V.muted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Delivery Progress</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {PLATFORMS.filter(p => selectedPlatforms.includes(p.id)).map(p => {
                          const done = launchProgress.includes(p.id);
                          return (
                            <div key={p.id} style={{
                              padding: '6px 14px', borderRadius: 6,
                              border: `1px solid ${done ? V.green + '66' : V.border}`,
                              background: done ? `${V.green}11` : V.surface3,
                              color: done ? V.green : V.muted,
                              fontSize: 12, fontFamily: 'DM Mono',
                              transition: 'all 0.3s ease',
                              display: 'flex', alignItems: 'center', gap: 6,
                            }}>
                              {done ? '✓' : <span style={{ display: 'inline-block', width: 10, height: 10, border: `2px solid ${V.muted}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />}
                              {p.label}
                            </div>
                          );
                        })}
                      </div>
                      {launchStep === 3 && (
                        <div style={{ marginTop: 14, color: V.green, fontFamily: 'DM Mono', fontSize: 13 }}>
                          ✓ Broadcast complete — {launchProgress.length} platforms delivered
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ fontSize: 11, color: V.muted, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>Target Platforms</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                    {PLATFORMS.map(p => (
                      <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '7px 10px', borderRadius: 7, background: selectedPlatforms.includes(p.id) ? `${V.teal}11` : 'transparent', border: `1px solid ${selectedPlatforms.includes(p.id) ? V.teal + '44' : V.border}`, transition: 'all 0.2s' }}>
                        <input type="checkbox" checked={selectedPlatforms.includes(p.id)}
                          onChange={() => setSelectedPlatforms(sel => sel.includes(p.id) ? sel.filter(x => x !== p.id) : [...sel, p.id])}
                          style={{ accentColor: V.teal }} />
                        <span style={{ flex: 1, fontSize: 12, color: V.white }}>{p.label}</span>
                        <span style={{ fontSize: 10, color: p.credits < 300 ? V.red : V.muted }}>{p.credits.toLocaleString()} cr</span>
                      </label>
                    ))}
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: V.muted, marginBottom: 8 }}>
                      <span>Delay between sends</span>
                      <span style={{ color: V.gold }}>{broadcastDelay}s</span>
                    </div>
                    <input type="range" min={0} max={5} step={0.5} value={broadcastDelay} onChange={e => setBroadcastDelay(Number(e.target.value))}
                      style={{ width: '100%', accentColor: V.gold }} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <span style={{ fontSize: 12, color: V.muted }}>Priority Mode</span>
                    <Toggle on={priorityMode} onChange={() => setPriorityMode(p => !p)} />
                  </div>

                  {launchStep === 1 && (
                    <div style={{ background: `${V.red}11`, border: `1px solid ${V.red}44`, borderRadius: 8, padding: '12px 14px', marginBottom: 14, fontSize: 12, color: V.red }}>
                      ⚠ Confirm broadcast to {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''}?
                    </div>
                  )}

                  <button
                    onClick={handleLaunch}
                    disabled={launchStep === 2}
                    style={{
                      width: '100%', padding: '14px', borderRadius: 9, border: 'none',
                      background: launchStep === 2 ? V.muted : launchStep === 1 ? V.red : `linear-gradient(135deg, ${V.red}, #b91c1c)`,
                      color: '#fff', fontWeight: 800, cursor: launchStep === 2 ? 'not-allowed' : 'pointer',
                      fontFamily: 'Syne', fontSize: 18, letterSpacing: '0.06em',
                      boxShadow: launchStep !== 2 ? `0 0 24px ${V.red}66, 0 4px 12px rgba(0,0,0,0.4)` : 'none',
                      animation: launchStep !== 2 ? 'glowPulse 2s ease infinite' : 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    {launchStep === 0 ? '🚀 LAUNCH' : launchStep === 1 ? '⚠ CONFIRM LAUNCH' : launchStep === 2 ? '⏳ BROADCASTING…' : '✓ COMPLETE'}
                  </button>
                  {launchStep === 3 && (
                    <button onClick={() => { setLaunchStep(0); setLaunchProgress([]); }}
                      style={{ width: '100%', marginTop: 10, padding: '9px', borderRadius: 8, border: `1px solid ${V.border}`, background: 'transparent', color: V.muted, cursor: 'pointer', fontFamily: 'DM Mono', fontSize: 12 }}>
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </Card>
          </section>

          {/* ── 7. REAL-TIME METRICS WALL ────────────────────────────────────── */}
          <section>
            <SectionTitle icon="📈" title="Real-Time Metrics Wall" sub="Updating every 2s — last 30 data points" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { title: 'Broadcasts / min', color: V.teal, data: bpmData, fill: true, unit: 'bpm', icon: '⚡' },
                { title: 'Token Burn Rate', color: V.gold, data: burnData, fill: true, unit: 'tok/s', icon: '🔥' },
                { title: 'API Response Time', color: V.purple, data: latencyData, fill: false, unit: 'ms', icon: '📡' },
              ].map(chart => (
                <Card key={chart.title} style={{ padding: '18px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{chart.icon}</span>
                      <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13 }}>{chart.title}</span>
                    </div>
                    <div style={{ fontFamily: 'DM Mono', fontSize: 18, color: chart.color }}>
                      {chart.data[chart.data.length - 1]}<span style={{ fontSize: 10, color: V.muted, marginLeft: 3 }}>{chart.unit}</span>
                    </div>
                  </div>
                  <Sparkline data={chart.data} color={chart.color} fill={chart.fill} width={260} height={60} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: V.muted }}>
                    <span>min: {Math.min(...chart.data)}</span>
                    <span>avg: {Math.round(chart.data.reduce((a, b) => a + b, 0) / chart.data.length)}</span>
                    <span>max: {Math.max(...chart.data)}</span>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* ── 8. INCIDENT MANAGER ──────────────────────────────────────────── */}
          <section>
            <SectionTitle icon="🚨" title="Incident Manager" sub="Active & resolved incidents — P1/P2/P3 severity" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: V.muted }}>Active Incidents ({incidents.filter(i => !i.resolved).length})</span>
                  <button
                    onClick={() => pushToast('+ New incident created', V.red)}
                    style={{ padding: '5px 14px', borderRadius: 6, border: `1px solid ${V.red}55`, background: `${V.red}11`, color: V.red, cursor: 'pointer', fontFamily: 'DM Mono', fontSize: 11 }}
                  >
                    + Create
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {incidents.map(inc => (
                    <Card key={inc.id} style={{
                      padding: '14px 16px',
                      borderLeft: `3px solid ${sevColor(inc.sev)}`,
                      opacity: inc.resolved ? 0.5 : 1,
                      transition: 'opacity 0.4s',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <Badge label={inc.sev} color={sevColor(inc.sev)} />
                        <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, flex: 1 }}>{inc.title}</span>
                        {inc.resolved && <Badge label="RESOLVED" color={V.green} />}
                      </div>
                      <div style={{ display: 'flex', gap: 20, fontSize: 11, color: V.muted, marginBottom: 10 }}>
                        <span>Platform: <span style={{ color: V.white }}>{inc.platform}</span></span>
                        <span>Since: <span style={{ color: V.yellow }}>{inc.since}</span></span>
                      </div>
                      {!inc.resolved && (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <select style={{ background: V.surface3, border: `1px solid ${V.border}`, borderRadius: 5, padding: '4px 8px', color: V.white, fontSize: 11, fontFamily: 'DM Mono', flex: 1 }}>
                            <option>Unassigned</option>
                            <option>Auto Recovery</option>
                            <option>On-Call Eng</option>
                          </select>
                          <button onClick={() => resolveIncident(inc.id)}
                            style={{ padding: '4px 14px', borderRadius: 5, border: `1px solid ${V.green}55`, background: `${V.green}11`, color: V.green, cursor: 'pointer', fontFamily: 'DM Mono', fontSize: 11 }}>
                            ✓ Resolve
                          </button>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>

                {/* Past incidents */}
                <div style={{ marginTop: 16 }}>
                  <button
                    onClick={() => setExpandPastIncidents(e => !e)}
                    style={{ width: '100%', padding: '10px', borderRadius: 8, border: `1px solid ${V.border}`, background: V.surface2, color: V.muted, cursor: 'pointer', fontFamily: 'DM Mono', fontSize: 12, textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span>Past Incidents (last 7 days)</span>
                    <span>{expandPastIncidents ? '▲' : '▼'}</span>
                  </button>
                  {expandPastIncidents && (
                    <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {pastIncidents.map(p => (
                        <Card key={p.id} style={{ padding: '12px 14px', opacity: 0.7 }}>
                          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            <Badge label={p.sev} color={sevColor(p.sev)} />
                            <span style={{ flex: 1, fontSize: 12, color: V.white }}>{p.title}</span>
                            <span style={{ fontSize: 11, color: V.muted }}>+{p.duration}</span>
                            <Badge label="RESOLVED" color={V.green} />
                          </div>
                          <div style={{ fontSize: 10, color: V.muted, marginTop: 6 }}>{p.platform} · resolved {p.resolvedAt}</div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Incident summary */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Card>
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Incident Summary</div>
                  {[
                    { label: 'Active P1', val: incidents.filter(i => i.sev === 'P1' && !i.resolved).length, color: V.red },
                    { label: 'Active P2', val: incidents.filter(i => i.sev === 'P2' && !i.resolved).length, color: V.yellow },
                    { label: 'Active P3', val: incidents.filter(i => i.sev === 'P3' && !i.resolved).length, color: V.muted },
                    { label: 'Resolved Today', val: 8, color: V.green },
                    { label: 'MTTR (avg)', val: '22m', color: V.teal },
                  ].map(s => (
                    <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${V.border}`, padding: '8px 0', fontSize: 13 }}>
                      <span style={{ color: V.muted }}>{s.label}</span>
                      <span style={{ color: s.color, fontFamily: 'DM Mono', fontWeight: 500 }}>{s.val}</span>
                    </div>
                  ))}
                </Card>
                <Card style={{ background: `${V.red}09`, borderColor: `${V.red}33` }}>
                  <div style={{ fontSize: 12, color: V.red, fontFamily: 'Syne', fontWeight: 600, marginBottom: 10 }}>🚨 Escalation Policy</div>
                  <div style={{ fontSize: 11, color: V.muted, lineHeight: 1.7 }}>
                    P1 → PagerDuty + Slack #incidents<br />
                    P2 → Slack #incidents<br />
                    P3 → Log only, auto-heal if possible
                  </div>
                </Card>
              </div>
            </div>
          </section>

          {/* ── 9. QUICK MACROS ──────────────────────────────────────────────── */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <SectionTitle icon="⚡" title="Quick Macros" sub="Pre-saved command sequences — one-click execution" />
              <button
                onClick={() => setShowMacroForm(f => !f)}
                style={{ padding: '7px 16px', borderRadius: 7, border: `1px solid ${V.gold}55`, background: `${V.gold}11`, color: V.gold, cursor: 'pointer', fontFamily: 'DM Mono', fontSize: 12 }}
              >
                + New Macro
              </button>
            </div>

            {showMacroForm && (
              <Card style={{ marginBottom: 20, padding: '20px 24px', border: `1px solid ${V.gold}44` }}>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Create New Macro</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, color: V.muted, display: 'block', marginBottom: 6 }}>Macro Name</label>
                    <input placeholder="e.g. Daily Healthcheck" style={{ width: '100%', background: V.surface3, border: `1px solid ${V.border}`, borderRadius: 6, padding: '8px 12px', color: V.white, fontFamily: 'DM Mono', fontSize: 12, outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: V.muted, display: 'block', marginBottom: 6 }}>Icon</label>
                    <input placeholder="🔧" style={{ width: '100%', background: V.surface3, border: `1px solid ${V.border}`, borderRadius: 6, padding: '8px 12px', color: V.white, fontFamily: 'DM Mono', fontSize: 12, outline: 'none' }} />
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, color: V.muted, display: 'block', marginBottom: 6 }}>Commands (one per line)</label>
                  <textarea rows={4} placeholder="status --all&#10;ping --all" style={{ width: '100%', background: V.surface3, border: `1px solid ${V.border}`, borderRadius: 6, padding: '10px 12px', color: V.white, fontFamily: 'DM Mono', fontSize: 12, outline: 'none', resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => { pushToast('✓ Macro created', V.gold); setShowMacroForm(false); }}
                    style={{ padding: '8px 20px', borderRadius: 7, border: 'none', background: V.gold, color: V.surface, fontWeight: 700, cursor: 'pointer', fontFamily: 'Syne', fontSize: 13 }}>
                    Save Macro
                  </button>
                  <button onClick={() => setShowMacroForm(false)}
                    style={{ padding: '8px 20px', borderRadius: 7, border: `1px solid ${V.border}`, background: 'transparent', color: V.muted, cursor: 'pointer', fontFamily: 'DM Mono', fontSize: 12 }}>
                    Cancel
                  </button>
                </div>
              </Card>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {MACROS.map(m => (
                <Card key={m.id} style={{ padding: '16px 18px', cursor: 'pointer', transition: 'all 0.2s', ':hover': { borderColor: V.gold } }}
                  onClick={() => setActiveMacro(m)}>
                  <div style={{ fontSize: 24, marginBottom: 10 }}>{m.icon}</div>
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, marginBottom: 6, color: V.white }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: V.muted, lineHeight: 1.5, marginBottom: 12 }}>{m.desc}</div>
                  <div style={{ fontSize: 10, color: V.muted }}>{m.cmds.length} command{m.cmds.length !== 1 ? 's' : ''}</div>
                </Card>
              ))}
            </div>
          </section>

          {/* ── 10. SYSTEM STATUS MATRIX ──────────────────────────────────────── */}
          <section>
            <SectionTitle icon="🟢" title="System Status Matrix" sub="All connected services — click for details" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 20 }}>
              <Card>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
                  {services.map(svc => (
                    <div key={svc.name}
                      onClick={() => setSelectedService(svc)}
                      style={{
                        padding: '14px 12px', borderRadius: 10, cursor: 'pointer',
                        background: V.surface3,
                        border: `1px solid ${statusColor(svc.status)}33`,
                        textAlign: 'center',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{
                        width: 14, height: 14, borderRadius: '50%',
                        background: statusColor(svc.status),
                        margin: '0 auto 10px',
                        boxShadow: `0 0 8px ${statusColor(svc.status)}88`,
                        animation: svc.status === 'up' ? 'pulse 2s ease infinite' : 'none',
                      }} />
                      <div style={{ fontSize: 10, color: V.muted, lineHeight: 1.4 }}>{svc.name}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 20, marginTop: 18, paddingTop: 16, borderTop: `1px solid ${V.border}` }}>
                  {[{ label: 'Operational', color: V.green, count: services.filter(s => s.status === 'up').length },
                    { label: 'Degraded', color: V.yellow, count: services.filter(s => s.status === 'degraded').length },
                    { label: 'Down', color: V.red, count: services.filter(s => s.status === 'down').length }].map(s => (
                    <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                      <span style={{ fontSize: 12, color: V.muted }}>{s.label}</span>
                      <span style={{ fontSize: 12, color: s.color, fontFamily: 'DM Mono' }}>{s.count}</span>
                    </div>
                  ))}
                  <div style={{ marginLeft: 'auto', fontSize: 11, color: V.muted }}>
                    Last scan: <span style={{ color: V.white }}>2m ago</span>
                  </div>
                </div>
              </Card>

              {/* Health percentage */}
              <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{ position: 'relative', width: 140, height: 140 }}>
                  <svg width={140} height={140} style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx={70} cy={70} r={56} fill="none" stroke={V.surface3} strokeWidth={10} />
                    <circle cx={70} cy={70} r={56} fill="none" stroke={healthPct >= 90 ? V.green : healthPct >= 70 ? V.yellow : V.red}
                      strokeWidth={10}
                      strokeDasharray={`${2 * Math.PI * 56 * (healthPct / 100)} ${2 * Math.PI * 56 * (1 - healthPct / 100)}`}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dasharray 1s ease' }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'DM Mono', fontSize: 32, fontWeight: 500, color: healthPct >= 90 ? V.green : healthPct >= 70 ? V.yellow : V.red }}>
                      {healthPct}%
                    </span>
                    <span style={{ fontSize: 10, color: V.muted }}>health</span>
                  </div>
                </div>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, marginTop: 14, color: V.white }}>
                  {healthPct >= 90 ? 'All Systems Go' : healthPct >= 70 ? 'Partial Degradation' : 'Critical Issues'}
                </div>
                <div style={{ fontSize: 11, color: V.muted, marginTop: 4 }}>
                  {upCount}/{services.length} services operational
                </div>
                <button
                  onClick={() => pushToast('🔍 Full system scan initiated…', V.teal)}
                  style={{ marginTop: 18, width: '100%', padding: '9px', borderRadius: 8, border: `1px solid ${V.teal}44`, background: `${V.teal}11`, color: V.teal, cursor: 'pointer', fontFamily: 'DM Mono', fontSize: 12 }}
                >
                  Run Full Scan
                </button>
              </Card>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}

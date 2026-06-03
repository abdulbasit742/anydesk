import { useState, useEffect, useRef } from 'react';
import { sound } from '../lib/soundEngine';
import { useToast } from '../components/Toast';

const LOG_TYPES = {
  INFO:    { color: 'var(--blue)',   bg: 'rgba(79,142,247,0.08)',   icon: 'ℹ', label: 'INFO' },
  SUCCESS: { color: 'var(--teal)',   bg: 'rgba(0,212,170,0.08)',    icon: '✓', label: 'OK' },
  WARN:    { color: 'var(--gold)',   bg: 'rgba(245,183,49,0.08)',   icon: '⚠', label: 'WARN' },
  ERROR:   { color: 'var(--red)',    bg: 'rgba(255,95,95,0.08)',    icon: '✕', label: 'ERR' },
  SYSTEM:  { color: 'var(--purple)', bg: 'rgba(167,139,250,0.08)', icon: '⚙', label: 'SYS' },
  BROADCAST:{ color: 'var(--gold)', bg: 'rgba(245,183,49,0.1)',    icon: '📡', label: 'BC' },
};

function makeLog(type, message, source = 'system') {
  return { id: Math.random().toString(36).slice(2), type, message, source, ts: new Date().toISOString() };
}

const INITIAL_LOGS = [
  makeLog('SYSTEM',  'Bolt Studio Pro initialized', 'core'),
  makeLog('INFO',    'Loading account data from storage', 'store'),
  makeLog('SUCCESS', 'State hydrated successfully', 'store'),
  makeLog('INFO',    'WebSocket listener attached', 'network'),
  makeLog('SYSTEM',  'CSS design system loaded (48.87 kB)', 'style'),
  makeLog('SUCCESS', 'App ready — 55 modules loaded', 'vite'),
];

const DEMO_EVENTS = [
  { delay: 3000,  type: 'INFO',    msg: 'Health check cycle started', src: 'health' },
  { delay: 5000,  type: 'SUCCESS', msg: 'Ping OK — bolt.new (42ms)', src: 'health' },
  { delay: 5500,  type: 'SUCCESS', msg: 'Ping OK — lovable.dev (67ms)', src: 'health' },
  { delay: 6000,  type: 'WARN',    msg: 'Ping slow — manus.im (412ms)', src: 'health' },
  { delay: 8000,  type: 'BROADCAST', msg: 'Broadcast started → 8 accounts', src: 'broadcast' },
  { delay: 9000,  type: 'SUCCESS', msg: 'Delivered to bolt_prod_1', src: 'broadcast' },
  { delay: 9500,  type: 'SUCCESS', msg: 'Delivered to lovable_main', src: 'broadcast' },
  { delay: 10000, type: 'ERROR',   msg: 'Failed — claude_staging (401 Unauthorized)', src: 'broadcast' },
  { delay: 12000, type: 'INFO',    msg: 'Credit check started', src: 'credits' },
  { delay: 13000, type: 'WARN',    msg: 'Low credits — manus_free (8/50)', src: 'credits' },
];

export default function LiveConsole() {
  const toast = useToast();
  const [logs, setLogs]       = useState(INITIAL_LOGS);
  const [filter, setFilter]   = useState('ALL');
  const [search, setSearch]   = useState('');
  const [paused, setPaused]   = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [liveMode, setLiveMode]     = useState(true);
  
  // Custom font size scale (Feature 20)
  const [fontSize, setFontSize]     = useState(11);
  // Line wrapping toggle (Feature 19)
  const [wrapLines, setWrapLines]   = useState(true);

  const bottomRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // Simulate live log stream
  useEffect(() => {
    if (!liveMode) return;
    const timers = DEMO_EVENTS.map(ev =>
      setTimeout(() => {
        if (!pausedRef.current) {
          setLogs(prev => [...prev.slice(-200), makeLog(ev.type, ev.msg, ev.src)]);
        }
      }, ev.delay)
    );
    const repeat = setInterval(() => {
      if (!pausedRef.current) {
        const types = ['INFO','SUCCESS','WARN','INFO','SUCCESS','INFO'];
        const msgs = ['Heartbeat OK','Store sync complete','Rate limit: 48/60 rpm','Cache hit ratio: 94%','Broadcast queue empty','Session token refreshed'];
        const srcs = ['core','store','network','cache','broadcast','auth'];
        const i = Math.floor(Math.random() * msgs.length);
        setLogs(prev => [...prev.slice(-200), makeLog(types[i], msgs[i], srcs[i])]);
      }
    }, 8000);
    return () => { timers.forEach(clearTimeout); clearInterval(repeat); };
  }, [liveMode]);

  useEffect(() => {
    if (autoScroll && !paused) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll, paused]);

  const filtered = logs.filter(l => {
    const matchType   = filter === 'ALL' || l.type === filter;
    const matchSearch = !search.trim() || l.message.toLowerCase().includes(search.toLowerCase()) || l.source.includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const counts = Object.keys(LOG_TYPES).reduce((acc, t) => { acc[t] = logs.filter(l => l.type === t).length; return acc; }, {});

  const fmt = (iso) => {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}.${String(d.getMilliseconds()).padStart(3,'0')}`;
  };

  // Feature 21: Inject custom error/warning simulation
  const handleInjectError = () => {
    sound.play('warning');
    const errorsList = [
      { type: 'ERROR', msg: 'Network timeout: host gateway bolt.new refused connection', src: 'network' },
      { type: 'ERROR', msg: 'Lovable API token invalidated (403 Forbidden)', src: 'auth' },
      { type: 'WARN', msg: 'API Rate limit exceeded on claude-3-5-sonnet endpoint', src: 'governor' },
      { type: 'ERROR', msg: 'Credit balance depleted to critical reserve limit ($0.12)', src: 'credits' },
    ];
    const item = errorsList[Math.floor(Math.random() * errorsList.length)];
    const log = makeLog(item.type, item.msg, item.src);
    setLogs(prev => [...prev.slice(-200), log]);
    toast.error(`Injected Mock Log: ${item.msg}`);
  };

  // Feature 22: Export either ALL or only filtered logs
  const handleExportFiltered = () => {
    sound.play('success');
    const exportText = filtered.map(l => `[${fmt(l.ts)}] [${l.type}] [${l.source}] ${l.message}`).join('\n');
    const blob = new Blob([exportText], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filter === 'ALL' ? 'console_all.log' : `console_${filter.toLowerCase()}_only.log`;
    a.click();
    toast.success(`Exported ${filtered.length} log rows successfully!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: 'linear-gradient(135deg,rgba(0,212,170,.2),rgba(79,142,247,.12))', border: '1px solid rgba(0,212,170,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🖥</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-.4px' }}>Live Console</div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono,monospace' }}>
              {filtered.length}/{logs.length} entries
              {liveMode && !paused && <span style={{ color: 'var(--teal)', marginLeft: 8 }}>● LIVE</span>}
            </div>
          </div>
        </div>

        {/* Console control options toolbar */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Feature 21 Inject Error */}
          <button onClick={handleInjectError} className="btn btn-xs btn-ghost" style={{ fontSize: 10, color: 'var(--red)', border: '1px dashed rgba(255,95,95,0.3)' }}>
            🚨 Inject Error
          </button>

          {/* Feature 19 Text Wrap Toggle */}
          <button onClick={() => { sound.play('click'); setWrapLines(!wrapLines); }} className={`btn btn-xs ${wrapLines ? 'btn-teal' : 'btn-ghost'}`} style={{ fontSize: 10 }}>
            🔤 {wrapLines ? 'Wrap' : 'No Wrap'}
          </button>

          {/* Feature 20 Font Resizer Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface2)', padding: '2px 8px', borderRadius: 6, border: '1px solid var(--border)' }}>
            <span style={{ fontSize: 9.5, color: 'var(--muted)' }}>Font Size</span>
            <input
              type="range"
              min="9"
              max="14"
              value={fontSize}
              onChange={e => setFontSize(Number(e.target.value))}
              style={{ width: 60, accentColor: 'var(--teal)' }}
            />
            <span style={{ fontSize: 9.5, color: 'var(--teal)', fontFamily: 'DM Mono, monospace' }}>{fontSize}px</span>
          </div>

          <span style={{ color: 'rgba(255,255,255,0.06)' }}>|</span>

          <button onClick={() => { sound.play('click'); setLiveMode(l => !l); }} className={`btn btn-xs ${liveMode ? 'btn-teal' : 'btn-ghost'}`} style={{ fontSize: 10 }}>
            {liveMode ? '● Live' : '○ Live'}
          </button>
          
          <button onClick={() => { sound.play('click'); setPaused(p => !p); }} className={`btn btn-xs ${paused ? 'btn-gold' : 'btn-ghost'}`} style={{ fontSize: 10 }}>
            {paused ? '▶ Resume' : '⏸ Pause'}
          </button>
          
          <button onClick={() => { sound.play('click'); setAutoScroll(a => !a); }} className={`btn btn-xs btn-ghost`} style={{ fontSize: 10, color: autoScroll ? 'var(--teal)' : 'var(--muted)' }}>⬇ Auto</button>
          
          <button onClick={() => { sound.play('click'); setLogs([]); }} className="btn btn-xs btn-ghost" style={{ fontSize: 10 }}>🗑 Clear</button>
          
          {/* Feature 22 Exporter */}
          <button onClick={handleExportFiltered} className="btn btn-xs btn-gold" style={{ fontSize: 10 }}>⬇ Export Log</button>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => { sound.play('click'); setFilter('ALL'); }} className={`btn btn-xs ${filter === 'ALL' ? 'btn-gold' : 'btn-ghost'}`} style={{ fontSize: 10 }}>All ({logs.length})</button>
        {Object.entries(LOG_TYPES).map(([type, cfg]) => (
          <button key={type} onClick={() => { sound.play('click'); setFilter(filter === type ? 'ALL' : type); }}
            className={`btn btn-xs ${filter === type ? 'btn-gold' : 'btn-ghost'}`}
            style={{ fontSize: 10, color: filter === type ? undefined : cfg.color }}>
            {cfg.icon} {cfg.label} ({counts[type] || 0})
          </button>
        ))}
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter logs…"
          style={{ flex: 1, minWidth: 120, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 7, padding: '4px 10px', color: '#e4e4ed', fontSize: 10.5, outline: 'none', fontFamily: 'DM Mono,monospace' }}
          onFocus={e => e.target.style.borderColor = 'var(--teal)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      {/* Console output with dynamic styles for wrap and scale */}
      <div style={{ flex: 1, background: '#080810', border: '1px solid rgba(0,212,170,0.2)', borderRadius: 14, overflow: 'auto', fontFamily: 'DM Mono,monospace', fontSize: fontSize, lineHeight: 1.7, minHeight: 400, maxHeight: 600 }}>
        <div style={{ padding: '10px 14px' }}>
          {filtered.map((log) => {
            const cfg = LOG_TYPES[log.type] || LOG_TYPES.INFO;
            return (
              <div key={log.id} style={{ display: 'flex', gap: 10, padding: '1px 0', borderRadius: 4, transition: 'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <span style={{ color: '#4a4a6a', flexShrink: 0, fontSize: `${fontSize - 1.5}px` }}>{fmt(log.ts)}</span>
                <span style={{ width: 42, flexShrink: 0, fontSize: `${fontSize - 2}px`, fontWeight: 700, textAlign: 'center', borderRadius: 4, background: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cfg.icon} {cfg.label}</span>
                <span style={{ color: 'rgba(0,212,170,0.5)', flexShrink: 0, fontSize: `${fontSize - 1.5}px` }}>[{log.source}]</span>
                <span style={{
                  color: log.type === 'ERROR' ? '#ff9090' : log.type === 'WARN' ? '#f5d280' : log.type === 'SUCCESS' ? '#80e8d0' : '#c8d0e8',
                  flex: 1,
                  whiteSpace: wrapLines ? 'pre-wrap' : 'pre',
                  wordBreak: wrapLines ? 'break-word' : 'normal',
                  overflowX: wrapLines ? 'hidden' : 'auto'
                }}>{log.message}</span>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ color: '#4a4a6a', textAlign: 'center', padding: '40px' }}>No log entries{search ? ` matching "${search}"` : ''}</div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}

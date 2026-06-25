import { useState, useEffect, useRef } from 'react';

const LEVELS = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
const SERVICES = ['api-gateway', 'auth-service', 'db-pool', 'cache', 'worker', 'scheduler'];
const LEVEL_COLORS = { DEBUG: '#6e7191', INFO: '#22d3ee', WARN: '#f5b731', ERROR: '#ef4444' };

function randomLog(i) {
  const level = LEVELS[Math.floor(Math.random() * LEVELS.length)];
  const service = SERVICES[Math.floor(Math.random() * SERVICES.length)];
  const msgs = {
    DEBUG: ['Cache lookup miss', 'Query plan analyzed', 'Token refreshed'],
    INFO: ['Request processed in 42ms', 'User session started', 'Job completed'],
    WARN: ['High memory usage: 78%', 'Slow query detected: 1200ms', 'Rate limit approaching'],
    ERROR: ['Connection refused: db-pool', 'Auth token invalid', 'Unhandled exception in worker'],
  };
  const msg = msgs[level][Math.floor(Math.random() * 3)];
  return { id: i, level, service, message: msg, timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString() };
}

const INIT_LOGS = Array.from({ length: 80 }, (_, i) => randomLog(i));

export default function SystemLogsPage() {
  const [logs, setLogs] = useState(INIT_LOGS);
  const [search, setSearch] = useState('');
  const [regex, setRegex] = useState(false);
  const [tail, setTail] = useState(false);
  const [activeServices, setActiveServices] = useState([]);
  const [activeLevels, setActiveLevels] = useState([]);
  const [maxLines, setMaxLines] = useState(50);
  const [counter, setCounter] = useState(INIT_LOGS.length);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!tail) return;
    const interval = setInterval(() => {
      setCounter(c => {
        const newLog = randomLog(c);
        setLogs(prev => [...prev.slice(-199), newLog]);
        return c + 1;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [tail]);

  useEffect(() => {
    if (tail && bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [logs, tail]);

  const filtered = logs.filter(l => {
    if (activeServices.length && !activeServices.includes(l.service)) return false;
    if (activeLevels.length && !activeLevels.includes(l.level)) return false;
    if (search) {
      try {
        const pat = regex ? new RegExp(search, 'i') : null;
        if (pat) return pat.test(l.message) || pat.test(l.service);
        return l.message.toLowerCase().includes(search.toLowerCase()) || l.service.includes(search.toLowerCase());
      } catch { return true; }
    }
    return true;
  }).slice(-maxLines);

  const counts = LEVELS.reduce((a, lv) => ({ ...a, [lv]: logs.filter(l => l.level === lv).length }), {});

  const toggleArr = (arr, setArr, val) => setArr(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

  const exportLogs = (fmt) => {
    const content = fmt === 'json'
      ? JSON.stringify(filtered, null, 2)
      : fmt === 'csv'
        ? 'timestamp,level,service,message\n' + filtered.map(l => `${l.timestamp},${l.level},${l.service},"${l.message}"`).join('\n')
        : filtered.map(l => `[${l.timestamp}] [${l.level}] [${l.service}] ${l.message}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `logs.${fmt}`; a.click();
  };

  const s = {
    page: { minHeight: '100vh', background: 'var(--surface, #0e0e16)', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' },
    hero: { background: 'linear-gradient(135deg, #0e0e16 0%, #1a1040 50%, #0e1628 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '48px 40px 36px' },
    heroTitle: { fontSize: 36, fontWeight: 800, background: 'linear-gradient(90deg, #22d3ee, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
    heroSub: { color: '#6e7191', marginTop: 8, fontSize: 15 },
    badge: (lv) => ({ background: LEVEL_COLORS[lv] + '22', color: LEVEL_COLORS[lv], border: `1px solid ${LEVEL_COLORS[lv]}44`, borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 700, display: 'inline-flex', gap: 6, alignItems: 'center' }),
    statsRow: { display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 24 },
    controls: { padding: '24px 40px', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.07)' },
    input: { background: '#16161e', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', borderRadius: 8, padding: '8px 14px', fontSize: 13, outline: 'none', flex: 1, minWidth: 180 },
    pill: (active) => ({ background: active ? '#22d3ee22' : '#16161e', border: `1px solid ${active ? '#22d3ee' : 'rgba(255,255,255,0.1)'}`, color: active ? '#22d3ee' : '#6e7191', borderRadius: 20, padding: '4px 12px', fontSize: 12, cursor: 'pointer', fontWeight: 600 }),
    btn: (color = '#22d3ee') => ({ background: color + '22', border: `1px solid ${color}44`, color, borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer', fontWeight: 600 }),
    logArea: { padding: '0 40px 40px', overflow: 'auto', maxHeight: '55vh' },
    logLine: () => ({ display: 'flex', gap: 12, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13, fontFamily: 'monospace', alignItems: 'flex-start' }),
    lineNum: { color: '#3d3d5c', minWidth: 36, textAlign: 'right', userSelect: 'none' },
    ts: { color: '#6e7191', minWidth: 190 },
    svcTag: { background: '#a78bfa22', color: '#a78bfa', borderRadius: 4, padding: '1px 6px', fontSize: 11, fontWeight: 700, minWidth: 90, textAlign: 'center' },
    footer: { padding: '16px 40px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 12, alignItems: 'center' },
    counterRef: { display: 'none' }
  };

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div>
            <h1 style={s.heroTitle}>System Logs</h1>
            <p style={s.heroSub}>Real-time aggregated log stream across all services</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            {tail && <span style={{ background: '#ef444422', color: '#ef4444', border: '1px solid #ef444444', borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 700, animation: 'pulse 1s infinite' }}>● LIVE</span>}
          </div>
        </div>
        <div style={s.statsRow}>
          {LEVELS.map(lv => (
            <div key={lv} style={s.badge(lv)}>
              <span>{lv}</span><span style={{ fontWeight: 800 }}>{counts[lv]}</span>
            </div>
          ))}
          <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, padding: '4px 14px', fontSize: 12, color: '#6e7191' }}>
            Total: <strong style={{ color: '#e2e8f0' }}>{logs.length}</strong> entries
          </div>
          <div style={{ background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, padding: '4px 14px', fontSize: 12, color: '#6e7191' }}>
            Showing: <strong style={{ color: '#22d3ee' }}>{filtered.length}</strong>
          </div>
        </div>
      </div>

      <div style={s.controls}>
        <input style={s.input} placeholder="Search logs…" value={search} onChange={e => setSearch(e.target.value)} />
        <button style={s.btn(regex ? '#f5b731' : '#6e7191')} onClick={() => setRegex(r => !r)}>Regex {regex ? 'ON' : 'OFF'}</button>
        <button style={s.btn(tail ? '#ef4444' : '#22d3ee')} onClick={() => setTail(t => !t)}>{tail ? '⏹ Stop Tail' : '▶ Tail Mode'}</button>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {LEVELS.map(lv => <button key={lv} style={{ ...s.pill(activeLevels.includes(lv)), borderColor: LEVEL_COLORS[lv] + (activeLevels.includes(lv) ? '' : '44'), color: activeLevels.includes(lv) ? LEVEL_COLORS[lv] : '#6e7191' }} onClick={() => toggleArr(activeLevels, setActiveLevels, lv)}>{lv}</button>)}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SERVICES.map(sv => <button key={sv} style={s.pill(activeServices.includes(sv))} onClick={() => toggleArr(activeServices, setActiveServices, sv)}>{sv}</button>)}
        </div>
      </div>

      <div style={{ padding: '12px 40px', display: 'flex', gap: 12, alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <label style={{ color: '#6e7191', fontSize: 13 }}>Max lines:</label>
        <input type="range" min={20} max={200} step={10} value={maxLines} onChange={e => setMaxLines(+e.target.value)} style={{ accentColor: '#22d3ee' }} />
        <span style={{ color: '#22d3ee', fontWeight: 700, fontSize: 13 }}>{maxLines}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {['log', 'csv', 'json'].map(fmt => (
            <button key={fmt} style={s.btn('#a78bfa')} onClick={() => exportLogs(fmt)}>↓ .{fmt}</button>
          ))}
        </div>
      </div>

      <div style={s.logArea}>
        {filtered.map((log, idx) => (
          <div key={log.id} style={s.logLine(log.level)}>
            <span style={s.lineNum}>{idx + 1}</span>
            <span style={s.ts}>{log.timestamp.replace('T', ' ').slice(0, 19)}</span>
            <span style={{ ...s.badge(log.level), minWidth: 52, justifyContent: 'center', padding: '1px 6px', fontSize: 11 }}>{log.level}</span>
            <span style={s.svcTag}>{log.service}</span>
            <span style={{ color: '#c4c9e2', flex: 1 }}>{log.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={s.footer}>
        <span style={{ color: '#6e7191', fontSize: 13 }}>Service filters: {activeServices.length ? activeServices.join(', ') : 'All'}</span>
        <span style={{ color: '#6e7191', fontSize: 13 }}>Level filters: {activeLevels.length ? activeLevels.join(', ') : 'All'}</span>
        <span style={s.counterRef}>{counter}</span>
        <button style={{ ...s.btn('#ef4444'), marginLeft: 'auto' }} onClick={() => { setActiveServices([]); setActiveLevels([]); setSearch(''); }}>Clear Filters</button>
      </div>
    </div>
  );
}

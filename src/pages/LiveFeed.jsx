import { useState, useEffect, useRef } from 'react';

const EVENT_TYPES = ['API', 'Broadcast', 'Alert', 'Workflow'];
const SEVERITIES = ['low', 'medium', 'high'];

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateEvent(id) {
  const type = randomFrom(EVENT_TYPES);
  const severity = randomFrom(SEVERITIES);
  const messages = {
    API: ['GET /api/v2/accounts returned 200', 'POST /api/broadcast triggered', 'Rate limit hit on /api/keys', 'Auth token refreshed'],
    Broadcast: ['Broadcast #4821 delivered to 1,204 accounts', 'Bulk send completed in 3.2s', 'Broadcast queued: 500 targets', 'Retry broadcast #4819'],
    Alert: ['Memory usage exceeded 85%', 'API latency spike detected', 'Failed auth from 192.168.1.44', 'Disk usage at 91%'],
    Workflow: ['Workflow "Onboard Users" triggered', 'Step 3 of 5 completed', 'Workflow paused: approval needed', 'Automation rule fired: tag=premium'],
  };
  return {
    id,
    type,
    severity,
    message: randomFrom(messages[type]),
    timestamp: new Date().toISOString(),
    source: randomFrom(['api-gw-01', 'worker-02', 'scheduler', 'notifier', 'ml-engine']),
  };
}

const severityColor = { low: '#22d3ee', medium: '#f5b731', high: '#ef4444' };
const typeColor = { API: '#60a5fa', Broadcast: '#a78bfa', Alert: '#ef4444', Workflow: '#22d3ee' };

export default function LiveFeed() {
  const [events, setEvents] = useState(() => Array.from({ length: 20 }, (_, i) => generateEvent(i)));
  const [filter, setFilter] = useState('All');
  const [paused, setPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [search, setSearch] = useState('');
  const [nextId, setNextId] = useState(20);
  const logRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(() => {
        setEvents(prev => {
          const e = generateEvent(nextId);
          setNextId(n => n + 1);
          return [e, ...prev].slice(0, 200);
        });
      }, 1800);
    }
    return () => clearInterval(intervalRef.current);
  }, [paused, nextId]);

  useEffect(() => {
    if (autoScroll && logRef.current) {
      logRef.current.scrollTop = 0;
    }
  }, [events, autoScroll]);

  const filtered = events.filter(e => {
    const matchType = filter === 'All' || e.type === filter;
    const matchSearch = search === '' || e.message.toLowerCase().includes(search.toLowerCase()) || e.source.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'events.json'; a.click();
  };

  const counts = EVENT_TYPES.reduce((acc, t) => { acc[t] = events.filter(e => e.type === t).length; return acc; }, {});

  return (
    <div style={{ minHeight: '100vh', background: '#0e0e16', color: '#fff', fontFamily: 'Inter, sans-serif', padding: '0 0 60px' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1d1d28 0%, #0e0e16 60%, #16161e 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '48px 40px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 12px #22d3ee', animation: 'pulse 1.5s infinite' }} />
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: 0, background: 'linear-gradient(90deg,#22d3ee,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Live Feed</h1>
          <span style={{ marginLeft: 'auto', background: 'rgba(34,211,238,0.12)', border: '1px solid #22d3ee', color: '#22d3ee', padding: '4px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>{events.length} events</span>
        </div>
        <p style={{ color: '#6e7191', margin: '0 0 28px', fontSize: 15 }}>Real-time global event stream across all platform services.</p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {EVENT_TYPES.map(t => (
            <div key={t} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '10px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: typeColor[t] }}>{counts[t]}</div>
              <div style={{ fontSize: 12, color: '#6e7191', marginTop: 2 }}>{t}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '28px 40px' }}>
        {/* Controls */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' }}>
          {/* Filter pills */}
          {['All', ...EVENT_TYPES].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 18px', borderRadius: 20, border: filter === f ? `1px solid ${typeColor[f] || '#a78bfa'}` : '1px solid rgba(255,255,255,0.1)', background: filter === f ? `${typeColor[f] || '#a78bfa'}22` : 'rgba(255,255,255,0.03)', color: filter === f ? (typeColor[f] || '#a78bfa') : '#6e7191', fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all .2s' }}>
              {f}
            </button>
          ))}

          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search events..."
            style={{ flex: 1, minWidth: 180, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 14px', color: '#fff', fontSize: 13, outline: 'none' }}
          />

          <button onClick={() => setPaused(p => !p)} style={{ padding: '8px 18px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: paused ? 'rgba(245,183,49,0.12)' : 'rgba(34,211,238,0.08)', color: paused ? '#f5b731' : '#22d3ee', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            {paused ? '▶ Resume' : '⏸ Pause'}
          </button>
          <button onClick={() => setAutoScroll(a => !a)} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: autoScroll ? 'rgba(167,139,250,0.1)' : 'rgba(255,255,255,0.03)', color: autoScroll ? '#a78bfa' : '#6e7191', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            ↕ Auto-scroll
          </button>
          <button onClick={() => setEvents([])} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            Clear Log
          </button>
          <button onClick={exportJSON} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid rgba(245,183,49,0.3)', background: 'rgba(245,183,49,0.08)', color: '#f5b731', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            ⬇ Export JSON
          </button>
        </div>

        {/* Event Log */}
        <div ref={logRef} style={{ background: '#0a0a12', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, maxHeight: 520, overflowY: 'auto', padding: '8px 0' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '180px 90px 90px 1fr 110px', gap: 0, padding: '8px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: '#6e7191', textTransform: 'uppercase', letterSpacing: 1 }}>
            <span>Timestamp</span><span>Type</span><span>Severity</span><span>Message</span><span>Source</span>
          </div>
          {filtered.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6e7191' }}>No events match filters.</div>
          )}
          {filtered.map(e => (
            <div key={e.id} style={{ display: 'grid', gridTemplateColumns: '180px 90px 90px 1fr 110px', gap: 0, padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: 13, alignItems: 'center', transition: 'background .15s' }}
              onMouseEnter={ev => ev.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
              onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}
            >
              <span style={{ color: '#6e7191', fontFamily: 'monospace', fontSize: 11 }}>{new Date(e.timestamp).toLocaleTimeString()}</span>
              <span style={{ background: `${typeColor[e.type]}18`, color: typeColor[e.type], borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700, width: 'fit-content' }}>{e.type}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: severityColor[e.severity], display: 'inline-block' }} />
                <span style={{ fontSize: 11, color: severityColor[e.severity] }}>{e.severity}</span>
              </span>
              <span style={{ color: '#ddd' }}>{e.message}</span>
              <span style={{ color: '#6e7191', fontFamily: 'monospace', fontSize: 11 }}>{e.source}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14, color: '#6e7191', fontSize: 12, textAlign: 'right' }}>
          Showing {filtered.length} of {events.length} events • {paused ? <span style={{ color: '#f5b731' }}>Paused</span> : <span style={{ color: '#22d3ee' }}>● Live</span>}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';

// ── CSS VAR TOKENS ──────────────────────────────────────────────────────────
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
  textDim:  '#94a3b8',
};

// ── STATIC DATA ──────────────────────────────────────────────────────────────
const DATASETS = [
  { id: 'ds1', name: 'user_events',      rows: 842000, size: 142.3, icon: '📊', updated: '2h ago',  status: 'active',  cols: ['user_id','event_type','timestamp','session_id','properties'] },
  { id: 'ds2', name: 'revenue_ledger',   rows: 128400, size: 34.7,  icon: '📈', updated: '15m ago', status: 'active',  cols: ['tx_id','amount','currency','user_id','created_at'] },
  { id: 'ds3', name: 'product_catalog',  rows: 18200,  size: 8.1,   icon: '🗃️', updated: '1d ago',  status: 'active',  cols: ['sku','name','category','price','stock'] },
  { id: 'ds4', name: 'session_logs',     rows: 2400000,size: 612.0, icon: '📊', updated: '5m ago',  status: 'active',  cols: ['session_id','user_id','start','end','pages'] },
  { id: 'ds5', name: 'ab_experiments',   rows: 94100,  size: 22.5,  icon: '📈', updated: '3h ago',  status: 'pending', cols: ['exp_id','variant','user_id','converted','value'] },
  { id: 'ds6', name: 'geo_ip_mappings',  rows: 51000,  size: 11.2,  icon: '🗃️', updated: '7d ago',  status: 'active',  cols: ['ip_prefix','country','city','lat','lon'] },
  { id: 'ds7', name: 'error_traces',     rows: 312000, size: 87.4,  icon: '📊', updated: '1h ago',  status: 'error',   cols: ['trace_id','service','level','message','ts'] },
  { id: 'ds8', name: 'ml_feature_store', rows: 1120000,size: 289.6, icon: '📈', updated: '30m ago', status: 'active',  cols: ['feature_id','version','value','entity_id','ts'] },
];

const SAMPLE_ROWS = [
  ['u_4821', 'page_view', '2026-05-31T18:02:11Z', 's_99321', '{"path":"/dashboard"}'],
  ['u_3317', 'click',     '2026-05-31T18:02:15Z', 's_87411', '{"el":"btn-upgrade"}'],
  ['u_1104', 'purchase',  '2026-05-31T18:02:19Z', 's_22009', '{"amount":49.00}'],
  ['u_9988', 'page_view', '2026-05-31T18:02:22Z', 's_33421', '{"path":"/pricing"}'],
  ['u_5512', 'sign_up',   '2026-05-31T18:02:28Z', 's_10071', '{"plan":"pro"}'],
];

const STAT_COLS = [
  { col: 'user_id',    min: '—',     max: '—',     mean: '—',     std: '—',    nulls: 0.1  },
  { col: 'amount',     min: '0.99',  max: '9999',  mean: '47.32', std: '128.4',nulls: 2.3  },
  { col: 'timestamp',  min: '2025-01-01',max:'2026-06-01',mean:'—', std:'—',   nulls: 0.0  },
  { col: 'session_id', min: '—',     max: '—',     mean: '—',     std: '—',    nulls: 4.7  },
  { col: 'properties', min: '—',     max: '—',     mean: '—',     std: '—',    nulls: 12.4 },
];

const QUERY_HISTORY = [
  'SELECT * FROM user_events WHERE event_type = \'purchase\' LIMIT 100',
  'SELECT user_id, COUNT(*) as events FROM session_logs GROUP BY user_id',
  'SELECT sku, price FROM product_catalog WHERE category = \'saas\'',
  'SELECT * FROM error_traces WHERE level = \'ERROR\' LIMIT 50',
  'SELECT avg(amount) FROM revenue_ledger WHERE currency = \'USD\'',
];

const MOCK_RESULT_ROWS = Array.from({ length: 10 }, (_, i) => ({
  user_id: `u_${1000 + i * 137}`,
  event_type: ['page_view','click','purchase','sign_up'][i % 4],
  timestamp: `2026-05-31T${(12 + i).toString().padStart(2,'0')}:${(i * 7 % 60).toString().padStart(2,'0')}:00Z`,
  session_id: `s_${20000 + i * 431}`,
  properties: `{"val": ${i * 3 + 1}}`,
}));

const PIPELINES = [
  { name: 'Ingest',     status: 'done',    records: 2400000, duration: '1m 12s', pct: 100 },
  { name: 'Validate',   status: 'done',    records: 2398142, duration: '0m 44s', pct: 100 },
  { name: 'Transform',  status: 'running', records: 1820000, duration: '2m 08s', pct: 76  },
  { name: 'Enrich',     status: 'pending', records: 0,       duration: '—',      pct: 0   },
  { name: 'Aggregate',  status: 'pending', records: 0,       duration: '—',      pct: 0   },
  { name: 'Export',     status: 'error',   records: 0,       duration: '—',      pct: 0   },
];

const COLOR_SCHEMES = [
  { name: 'Gold-Teal', a: C.gold,   b: C.teal   },
  { name: 'Purple-Red',a: C.purple, b: C.red    },
  { name: 'Green-Blue',a: C.green,  b: '#3b82f6' },
  { name: 'Mono',      a: C.text,   b: C.muted  },
];

// ── UTILITY ──────────────────────────────────────────────────────────────────
function fmtNum(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toString();
}



function statusColor(s) {
  return { done: C.green, running: C.gold, pending: C.muted, error: C.red }[s] || C.muted;
}

function statusDot(s) {
  return <span style={{
    display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
    background: statusColor(s), marginRight: 5,
  }} />;
}

// ── SUB-COMPONENTS (all at module scope) ─────────────────────────────────────

function HeroBadge({ label, value }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: C.surface3, border: `1px solid ${C.border}`,
      borderRadius: 8, padding: '6px 14px',
    }}>
      <span style={{ color: C.muted, fontSize: 11, fontFamily: 'DM Mono, monospace' }}>{label}</span>
      <span style={{ color: C.gold, fontWeight: 700, fontSize: 13, fontFamily: 'DM Mono, monospace' }}>{value}</span>
    </div>
  );
}

function DatasetBrowser() {
  const [expanded, setExpanded] = useState(null);

  function toggle(id) {
    setExpanded(prev => prev === id ? null : id);
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {DATASETS.map(ds => (
          <div key={ds.id}>
            <div
              onClick={() => toggle(ds.id)}
              style={{
                background: expanded === ds.id ? C.surface3 : C.surface2,
                border: `1px solid ${expanded === ds.id ? C.gold : C.border}`,
                borderRadius: 12, padding: '16px 18px', cursor: 'pointer',
                transition: 'border 0.2s, background 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 22 }}>{ds.icon}</div>
                <span style={{
                  fontSize: 9, fontFamily: 'DM Mono, monospace', fontWeight: 700,
                  padding: '2px 7px', borderRadius: 5, letterSpacing: 1,
                  background: ds.status === 'active' ? 'rgba(34,197,94,0.12)' :
                              ds.status === 'error'  ? 'rgba(239,68,68,0.12)' : 'rgba(110,113,145,0.18)',
                  color: ds.status === 'active' ? C.green :
                         ds.status === 'error'  ? C.red   : C.muted,
                  border: `1px solid ${ds.status === 'active' ? C.green :
                           ds.status === 'error' ? C.red : C.muted}`,
                  textTransform: 'uppercase',
                }}>{ds.status}</span>
              </div>
              <div style={{ color: C.teal, fontWeight: 700, fontSize: 13, fontFamily: 'DM Mono, monospace', marginTop: 10, marginBottom: 4 }}>
                {ds.name}
              </div>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10, color: C.muted, fontFamily: 'DM Mono, monospace' }}>🗄 {fmtNum(ds.rows)} rows</span>
                <span style={{ fontSize: 10, color: C.muted, fontFamily: 'DM Mono, monospace' }}>💾 {ds.size} MB</span>
                <span style={{ fontSize: 10, color: C.muted, fontFamily: 'DM Mono, monospace' }}>🕐 {ds.updated}</span>
              </div>
            </div>

            {expanded === ds.id && (
              <div style={{
                background: C.surface3, border: `1px solid ${C.gold}`, borderTop: 'none',
                borderRadius: '0 0 12px 12px', padding: '14px 18px',
              }}>
                <div style={{ fontSize: 11, color: C.muted, fontFamily: 'DM Mono, monospace', marginBottom: 10 }}>
                  Column Preview (5 rows)
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, fontFamily: 'DM Mono, monospace' }}>
                    <thead>
                      <tr>
                        {ds.cols.map(c => (
                          <th key={c} style={{ padding: '5px 10px', color: C.gold, textAlign: 'left', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SAMPLE_ROWS.map((row, ri) => (
                        <tr key={ri}>
                          {row.map((cell, ci) => (
                            <td key={ci} style={{ padding: '4px 10px', color: C.textDim, borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                  <button style={{ background: C.gold, color: C.surface, border: 'none', borderRadius: 7, padding: '7px 16px', fontSize: 11, fontFamily: 'DM Mono, monospace', fontWeight: 700, cursor: 'pointer' }}>
                    ▶ Query
                  </button>
                  <button style={{ background: 'transparent', color: C.teal, border: `1px solid ${C.teal}`, borderRadius: 7, padding: '7px 16px', fontSize: 11, fontFamily: 'DM Mono, monospace', cursor: 'pointer' }}>
                    ⬇ Export
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function WhereRow({ row, idx, onChange, onRemove }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
      <input value={row.col} onChange={e => onChange(idx, 'col', e.target.value)} placeholder="column"
        style={{ background: C.surface3, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, padding: '6px 10px', fontSize: 11, fontFamily: 'DM Mono, monospace', outline: 'none', width: 120 }} />
      <select value={row.op} onChange={e => onChange(idx, 'op', e.target.value)}
        style={{ background: C.surface3, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, padding: '6px 8px', fontSize: 11, fontFamily: 'DM Mono, monospace', outline: 'none' }}>
        {['=','!=','>','<','>=','<=','LIKE','IN'].map(o => <option key={o}>{o}</option>)}
      </select>
      <input value={row.val} onChange={e => onChange(idx, 'val', e.target.value)} placeholder="value"
        style={{ background: C.surface3, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, padding: '6px 10px', fontSize: 11, fontFamily: 'DM Mono, monospace', outline: 'none', flex: 1 }} />
      <button onClick={() => onRemove(idx)} style={{ background: 'transparent', border: `1px solid ${C.red}`, color: C.red, borderRadius: 6, padding: '6px 10px', cursor: 'pointer', fontSize: 12, fontFamily: 'DM Mono, monospace' }}>✕</button>
    </div>
  );
}

function QueryBuilder() {
  const [selectClause, setSelectClause] = useState('*');
  const [fromDs, setFromDs] = useState('user_events');
  const [whereRows, setWhereRows] = useState([{ col: 'event_type', op: '=', val: 'purchase' }]);
  const [orderBy, setOrderBy] = useState('timestamp DESC');
  const [limit, setLimit] = useState('100');
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [historyIdx, setHistoryIdx] = useState(null);

  function addWhere() {
    setWhereRows(prev => [...prev, { col: '', op: '=', val: '' }]);
  }
  function updateWhere(idx, field, val) {
    setWhereRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: val } : r));
  }
  function removeWhere(idx) {
    setWhereRows(prev => prev.filter((_, i) => i !== idx));
  }
  function runQuery() {
    setRunning(true);
    setResults(null);
    setTimeout(() => {
      setRunning(false);
      setResults(MOCK_RESULT_ROWS);
    }, 1200);
  }

  const inputStyle = {
    background: C.surface3, border: `1px solid ${C.border}`, borderRadius: 8,
    color: C.text, padding: '8px 12px', fontSize: 12,
    fontFamily: 'DM Mono, monospace', outline: 'none', width: '100%', boxSizing: 'border-box',
  };

  return (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
      <div style={{ flex: '2 1 400px' }}>
        {/* SELECT */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ color: C.gold, fontSize: 11, fontFamily: 'DM Mono, monospace', marginBottom: 6, fontWeight: 700 }}>SELECT</div>
          <textarea value={selectClause} onChange={e => setSelectClause(e.target.value)}
            rows={2} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'DM Mono, monospace' }} />
        </div>
        {/* FROM */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ color: C.gold, fontSize: 11, fontFamily: 'DM Mono, monospace', marginBottom: 6, fontWeight: 700 }}>FROM</div>
          <select value={fromDs} onChange={e => setFromDs(e.target.value)} style={{ ...inputStyle }}>
            {DATASETS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
          </select>
        </div>
        {/* WHERE */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: C.gold, fontSize: 11, fontFamily: 'DM Mono, monospace', fontWeight: 700 }}>WHERE</span>
            <button onClick={addWhere} style={{ background: 'transparent', border: `1px solid ${C.teal}`, color: C.teal, borderRadius: 6, padding: '3px 10px', cursor: 'pointer', fontSize: 11, fontFamily: 'DM Mono, monospace' }}>+ Add Condition</button>
          </div>
          {whereRows.map((r, i) => (
            <WhereRow key={i} row={r} idx={i} onChange={updateWhere} onRemove={removeWhere} />
          ))}
        </div>
        {/* ORDER BY + LIMIT */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
          <div style={{ flex: 2 }}>
            <div style={{ color: C.gold, fontSize: 11, fontFamily: 'DM Mono, monospace', marginBottom: 6, fontWeight: 700 }}>ORDER BY</div>
            <input value={orderBy} onChange={e => setOrderBy(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: C.gold, fontSize: 11, fontFamily: 'DM Mono, monospace', marginBottom: 6, fontWeight: 700 }}>LIMIT</div>
            <input value={limit} onChange={e => setLimit(e.target.value)} type="number" style={inputStyle} />
          </div>
        </div>
        <button onClick={runQuery} disabled={running} style={{
          background: running ? C.surface3 : C.gold, color: C.surface, border: 'none',
          borderRadius: 9, padding: '10px 28px', fontWeight: 700,
          fontSize: 13, fontFamily: 'DM Mono, monospace', cursor: running ? 'wait' : 'pointer',
          transition: 'background 0.2s',
        }}>
          {running ? '⏳ Running…' : '▶ Run Query'}
        </button>

        {/* Results */}
        {results && (
          <div style={{ marginTop: 20 }}>
            <div style={{ color: C.green, fontSize: 11, fontFamily: 'DM Mono, monospace', marginBottom: 10 }}>
              ✓ {results.length} rows returned
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: 'DM Mono, monospace' }}>
                <thead>
                  <tr>
                    {Object.keys(results[0]).map(k => (
                      <th key={k} style={{ padding: '7px 12px', color: C.gold, textAlign: 'left', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                      {Object.values(r).map((v, j) => (
                        <td key={j} style={{ padding: '6px 12px', color: C.textDim, borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Query History */}
      <div style={{ flex: '1 1 240px' }}>
        <div style={{ color: C.text, fontSize: 13, fontWeight: 700, fontFamily: 'Syne, sans-serif', marginBottom: 14 }}>Query History</div>
        {QUERY_HISTORY.map((q, i) => (
          <div key={i} onClick={() => setHistoryIdx(i === historyIdx ? null : i)} style={{
            background: historyIdx === i ? C.surface3 : 'transparent',
            border: `1px solid ${historyIdx === i ? C.teal : C.border}`,
            borderRadius: 8, padding: '10px 12px', marginBottom: 8,
            cursor: 'pointer', fontSize: 10, fontFamily: 'DM Mono, monospace',
            color: C.muted, transition: 'all 0.15s',
            wordBreak: 'break-all',
          }}>{q}</div>
        ))}
      </div>
    </div>
  );
}

function ChartBuilder() {
  const CHART_TYPES = ['Line','Bar','Scatter','Area','Heatmap'];
  const [xCol, setXCol] = useState('timestamp');
  const [yCol, setYCol] = useState('amount');
  const [chartType, setChartType] = useState('Line');
  const [colorScheme, setColorScheme] = useState(0);
  const [chartName, setChartName] = useState('My Chart');
  const [saved, setSaved] = useState(false);

  const mockX = Array.from({ length: 12 }, (_, i) => i + 1);
  const mockY = [42,67,54,88,73,91,65,78,84,96,71,89];
  const scheme = COLOR_SCHEMES[colorScheme];

  const W = 480, H = 160, padL = 36, padB = 28, padT = 16, padR = 16;
  const cw = W - padL - padR;
  const ch = H - padT - padB;
  const mn = Math.min(...mockY), mx = Math.max(...mockY);
  function fx(i) { return padL + (i / (mockX.length - 1)) * cw; }
  function fy(v) { return padT + ch - ((v - mn) / (mx - mn || 1)) * ch; }

  function renderChart() {
    if (chartType === 'Line') {
      const path = mockX.map((_, i) => `${i === 0 ? 'M' : 'L'}${fx(i).toFixed(1)},${fy(mockY[i]).toFixed(1)}`).join(' ');
      return (
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
          {[0.25,0.5,0.75,1].map(t => (
            <line key={t} x1={padL} y1={padT + ch * (1 - t)} x2={W - padR} y2={padT + ch * (1 - t)}
              stroke={C.border} strokeWidth={1} />
          ))}
          <path d={path} fill="none" stroke={scheme.a} strokeWidth={2} strokeLinejoin="round" />
          {mockX.map((_, i) => (
            <circle key={i} cx={fx(i)} cy={fy(mockY[i])} r={3} fill={scheme.b} />
          ))}
          {mockX.filter((_, i) => i % 3 === 0).map((x, ii) => {
            const i = ii * 3;
            return <text key={i} x={fx(i)} y={H - 6} fill={C.muted} fontSize={8} textAnchor="middle" fontFamily="DM Mono, monospace">{x}</text>;
          })}
        </svg>
      );
    }
    if (chartType === 'Bar') {
      const bw = Math.floor((cw / mockX.length) * 0.7);
      return (
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
          {[0.25,0.5,0.75,1].map(t => (
            <line key={t} x1={padL} y1={padT + ch * (1 - t)} x2={W - padR} y2={padT + ch * (1 - t)}
              stroke={C.border} strokeWidth={1} />
          ))}
          {mockX.map((x, i) => {
            const barH = ((mockY[i] - mn) / (mx - mn || 1)) * ch;
            const bx   = fx(i) - bw / 2;
            const by   = padT + ch - barH;
            return (
              <g key={i}>
                <rect x={bx} y={by} width={bw} height={barH} rx={2}
                  fill={scheme.a} fillOpacity={0.7} />
                <text x={fx(i)} y={H - 6} fill={C.muted} fontSize={8} textAnchor="middle" fontFamily="DM Mono, monospace">{x}</text>
              </g>
            );
          })}
        </svg>
      );
    }
    // Skeleton for others
    return (
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
        <rect width={W} height={H} fill={C.surface3} rx={8} />
        <text x={W / 2} y={H / 2 - 6} fill={C.muted} fontSize={13} textAnchor="middle" fontFamily="Syne, sans-serif">{chartType}</text>
        <text x={W / 2} y={H / 2 + 14} fill={C.border} fontSize={10} textAnchor="middle" fontFamily="DM Mono, monospace">Chart preview coming soon</text>
      </svg>
    );
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const selStyle = {
    background: C.surface3, border: `1px solid ${C.border}`, borderRadius: 8,
    color: C.text, padding: '7px 12px', fontSize: 12,
    fontFamily: 'DM Mono, monospace', outline: 'none',
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20, alignItems: 'flex-end' }}>
        <div>
          <div style={{ color: C.muted, fontSize: 10, fontFamily: 'DM Mono, monospace', marginBottom: 5 }}>X AXIS</div>
          <select value={xCol} onChange={e => setXCol(e.target.value)} style={selStyle}>
            {DATASETS[0].cols.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <div style={{ color: C.muted, fontSize: 10, fontFamily: 'DM Mono, monospace', marginBottom: 5 }}>Y AXIS</div>
          <select value={yCol} onChange={e => setYCol(e.target.value)} style={selStyle}>
            {DATASETS[1].cols.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <div style={{ color: C.muted, fontSize: 10, fontFamily: 'DM Mono, monospace', marginBottom: 5 }}>CHART TYPE</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {CHART_TYPES.map(t => (
              <button key={t} onClick={() => setChartType(t)} style={{
                background: chartType === t ? C.gold : 'transparent',
                color: chartType === t ? C.surface : C.muted,
                border: `1px solid ${chartType === t ? C.gold : C.border}`,
                borderRadius: 7, padding: '7px 13px', fontSize: 11,
                fontFamily: 'DM Mono, monospace', cursor: 'pointer', fontWeight: chartType === t ? 700 : 400,
              }}>{t}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ color: C.muted, fontSize: 10, fontFamily: 'DM Mono, monospace', marginBottom: 5 }}>COLOR SCHEME</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {COLOR_SCHEMES.map((sc, i) => (
              <div key={i} onClick={() => setColorScheme(i)} style={{
                width: 28, height: 28, borderRadius: 6, cursor: 'pointer',
                background: `linear-gradient(135deg, ${sc.a}, ${sc.b})`,
                border: colorScheme === i ? `2px solid ${C.text}` : `2px solid transparent`,
                transition: 'border 0.15s',
              }} title={sc.name} />
            ))}
          </div>
        </div>
      </div>

      {/* Chart Preview */}
      <div style={{ background: C.surface3, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
        {renderChart()}
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input value={chartName} onChange={e => setChartName(e.target.value)}
          placeholder="Chart name…"
          style={{ background: C.surface3, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, padding: '8px 14px', fontSize: 12, fontFamily: 'DM Mono, monospace', outline: 'none', flex: 1 }} />
        <button onClick={handleSave} style={{
          background: saved ? C.green : C.purple, color: C.surface, border: 'none',
          borderRadius: 8, padding: '9px 22px', fontSize: 12, fontFamily: 'DM Mono, monospace',
          fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s',
        }}>
          {saved ? '✓ Saved!' : '💾 Save Chart'}
        </button>
      </div>
    </div>
  );
}

function PipelineMonitor() {
  const [restarting, setRestarting] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);

  function handleRestart() {
    setRestarting(true);
    setTimeout(() => setRestarting(false), 2000);
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 0, overflowX: 'auto', paddingBottom: 8, marginBottom: 24 }}>
        {PIPELINES.map((p, i) => (
          <div key={p.name} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              background: C.surface3, border: `1.5px solid ${statusColor(p.status)}`,
              borderRadius: 10, padding: '14px 18px', minWidth: 130,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                {statusDot(p.status)}
                <span style={{ color: C.text, fontSize: 12, fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>{p.name}</span>
              </div>
              <div style={{ color: C.muted, fontSize: 10, fontFamily: 'DM Mono, monospace', marginBottom: 6 }}>
                {fmtNum(p.records)} rec · {p.duration}
              </div>
              <div style={{ background: C.surface, borderRadius: 4, height: 5, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 4, background: statusColor(p.status),
                  width: `${p.pct}%`, transition: 'width 1s ease',
                }} />
              </div>
            </div>
            {i < PIPELINES.length - 1 && (
              <div style={{ color: C.muted, fontSize: 16, padding: '0 6px', flexShrink: 0 }}>→</div>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={handleRestart} style={{
          background: restarting ? C.surface3 : 'transparent', color: C.gold,
          border: `1px solid ${C.gold}`, borderRadius: 8,
          padding: '8px 18px', fontSize: 12, fontFamily: 'DM Mono, monospace',
          fontWeight: 600, cursor: 'pointer',
        }}>
          {restarting ? '⏳ Restarting…' : '↺ Restart Pipeline'}
        </button>
        <button onClick={() => setLogsOpen(v => !v)} style={{
          background: 'transparent', color: C.teal,
          border: `1px solid ${C.teal}`, borderRadius: 8,
          padding: '8px 18px', fontSize: 12, fontFamily: 'DM Mono, monospace',
          fontWeight: 600, cursor: 'pointer',
        }}>
          📋 {logsOpen ? 'Hide Logs' : 'View Logs'}
        </button>
      </div>
      {logsOpen && (
        <div style={{
          marginTop: 14, background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 8, padding: 14, fontFamily: 'DM Mono, monospace',
          fontSize: 10, color: C.muted, lineHeight: 1.8,
          maxHeight: 160, overflowY: 'auto',
        }}>
          {[
            '[INFO]  2026-06-01 22:00:01 — Ingest started, source: s3://data-lake/raw/',
            '[INFO]  2026-06-01 22:00:42 — Ingest complete. 2,400,000 records.',
            '[INFO]  2026-06-01 22:01:00 — Validate started.',
            '[WARN]  2026-06-01 22:01:21 — 1,858 malformed rows dropped.',
            '[INFO]  2026-06-01 22:01:44 — Validate complete. 2,398,142 valid.',
            '[INFO]  2026-06-01 22:02:00 — Transform started.',
            '[INFO]  2026-06-01 22:04:08 — Transform 76% complete…',
            '[ERROR] 2026-06-01 22:02:11 — Export failed: connection timeout.',
          ].map((l, i) => (
            <div key={i} style={{ color: l.includes('[ERROR]') ? C.red : l.includes('[WARN]') ? C.gold : C.muted }}>{l}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatSummary() {
  const [downloading, setDownloading] = useState(false);

  function handleDownload() {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 1500);
  }

  return (
    <div>
      <div style={{ overflowX: 'auto', marginBottom: 14 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'DM Mono, monospace' }}>
          <thead>
            <tr>
              {['Column','Min','Max','Mean','Std Dev','Nulls %'].map(h => (
                <th key={h} style={{ padding: '9px 14px', color: C.gold, textAlign: 'left', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap', fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STAT_COLS.map((row, i) => (
              <tr key={row.col} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                <td style={{ padding: '8px 14px', color: C.teal, borderBottom: `1px solid ${C.border}` }}>{row.col}</td>
                <td style={{ padding: '8px 14px', color: C.text, borderBottom: `1px solid ${C.border}` }}>{row.min}</td>
                <td style={{ padding: '8px 14px', color: C.text, borderBottom: `1px solid ${C.border}` }}>{row.max}</td>
                <td style={{ padding: '8px 14px', color: C.text, borderBottom: `1px solid ${C.border}` }}>{row.mean}</td>
                <td style={{ padding: '8px 14px', color: C.text, borderBottom: `1px solid ${C.border}` }}>{row.std}</td>
                <td style={{ padding: '8px 14px', borderBottom: `1px solid ${C.border}`, color: row.nulls > 10 ? C.red : row.nulls > 5 ? C.gold : C.green, fontWeight: row.nulls > 10 ? 700 : 400 }}>
                  {row.nulls > 10 && <span style={{ marginRight: 4 }}>⚠</span>}
                  {row.nulls}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={handleDownload} style={{
        background: downloading ? C.surface3 : 'transparent', color: C.green,
        border: `1px solid ${C.green}`, borderRadius: 8,
        padding: '8px 18px', fontSize: 12, fontFamily: 'DM Mono, monospace',
        fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s',
      }}>
        {downloading ? '⏳ Preparing…' : '⬇ Download CSV'}
      </button>
    </div>
  );
}

const SENSITIVITY_MAP = { Low: 2.5, Medium: 1.8, High: 1.2 };
const SENSITIVITY_LABELS = ['Low', 'Medium', 'High'];

function AnomalyDetector() {
  const W = 560, H = 160, padL = 40, padB = 28, padT = 14, padR = 16;
  const MAX_PTS = 40;

  const [sensitivity, setSensitivity] = useState('Medium');
  const [series, setSeries] = useState(() =>
    Array.from({ length: MAX_PTS }, (_, i) => ({
      v: 50 + Math.sin(i * 0.4) * 15 + (i * 0.3),
      anomaly: false,
    }))
  );
  const [anomalyLog, setAnomalyLog] = useState([]);
  const counterRef = useRef(MAX_PTS);

  useEffect(() => {
    const id = setInterval(() => {
      const base = 50 + Math.sin(counterRef.current * 0.4) * 15 + (counterRef.current * 0.05);
      const spike = Math.random() < 0.15;
      const v = spike ? base + (Math.random() > 0.5 ? 1 : -1) * (25 + Math.random() * 20) : base + (Math.random() - 0.5) * 6;
      const threshold = SENSITIVITY_MAP[sensitivity];
      const isAnomaly = spike || Math.abs(v - base) > threshold * 8;

      setSeries(prev => {
        const next = [...prev.slice(1), { v, anomaly: isAnomaly }];
        return next;
      });

      if (isAnomaly) {
        const now = new Date();
        const ts = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
        setAnomalyLog(prev => [{ ts, v: v.toFixed(1) }, ...prev].slice(0, 5));
      }
      counterRef.current++;
    }, 3000);
    return () => clearInterval(id);
  }, [sensitivity]);

  const vals = series.map(s => s.v);
  const mn = Math.min(...vals) - 2;
  const mx = Math.max(...vals) + 2;
  const cw = W - padL - padR;
  const ch = H - padT - padB;

  function fx(i) { return padL + (i / (series.length - 1)) * cw; }
  function fy(v) { return padT + ch - ((v - mn) / (mx - mn || 1)) * ch; }

  const path = series.map((s, i) => `${i === 0 ? 'M' : 'L'}${fx(i).toFixed(1)},${fy(s.v).toFixed(1)}`).join(' ');

  return (
    <div>
      {/* Sensitivity */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
        <span style={{ color: C.muted, fontSize: 11, fontFamily: 'DM Mono, monospace' }}>Sensitivity:</span>
        {SENSITIVITY_LABELS.map(s => (
          <button key={s} onClick={() => setSensitivity(s)} style={{
            background: sensitivity === s ? C.red : 'transparent',
            color: sensitivity === s ? C.surface : C.muted,
            border: `1px solid ${sensitivity === s ? C.red : C.border}`,
            borderRadius: 7, padding: '5px 14px', fontSize: 11,
            fontFamily: 'DM Mono, monospace', cursor: 'pointer', fontWeight: sensitivity === s ? 700 : 400,
          }}>{s}</button>
        ))}
      </div>

      {/* SVG Chart */}
      <div style={{ background: C.surface3, borderRadius: 10, padding: 12, marginBottom: 16, overflowX: 'auto' }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
          {[0.25,0.5,0.75,1].map(t => (
            <line key={t} x1={padL} y1={padT + ch * (1 - t)} x2={W - padR} y2={padT + ch * (1 - t)}
              stroke={C.border} strokeWidth={1} />
          ))}
          <path d={path} fill="none" stroke={C.teal} strokeWidth={1.8} strokeLinejoin="round" />
          {series.map((s, i) =>
            s.anomaly ? (
              <circle key={i} cx={fx(i)} cy={fy(s.v)} r={5} fill={C.red}
                stroke="rgba(239,68,68,0.4)" strokeWidth={6} />
            ) : null
          )}
          {series.filter((_, i) => i % 10 === 0).map((_, ii) => {
            const i = ii * 10;
            return <text key={i} x={fx(i)} y={H - 6} fill={C.muted} fontSize={8} textAnchor="middle" fontFamily="DM Mono, monospace">{i}s</text>;
          })}
          <text x={padL - 4} y={padT + 4} fill={C.muted} fontSize={8} textAnchor="end" fontFamily="DM Mono, monospace">{mx.toFixed(0)}</text>
          <text x={padL - 4} y={padT + ch} fill={C.muted} fontSize={8} textAnchor="end" fontFamily="DM Mono, monospace">{mn.toFixed(0)}</text>
        </svg>
      </div>

      {/* Anomaly Log */}
      <div style={{ color: C.text, fontSize: 13, fontWeight: 700, fontFamily: 'Syne, sans-serif', marginBottom: 10 }}>
        Anomaly Log {anomalyLog.length === 0 && <span style={{ color: C.muted, fontSize: 11, fontWeight: 400 }}> — none yet</span>}
      </div>
      {anomalyLog.map((a, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'rgba(239,68,68,0.07)', border: `1px solid rgba(239,68,68,0.2)`,
          borderRadius: 7, padding: '7px 14px', marginBottom: 6,
        }}>
          <span style={{ color: C.red, fontSize: 11, fontFamily: 'DM Mono, monospace', fontWeight: 700 }}>⚠ ANOMALY</span>
          <span style={{ color: C.muted, fontSize: 10, fontFamily: 'DM Mono, monospace' }}>{a.ts}</span>
          <span style={{ color: C.text, fontSize: 11, fontFamily: 'DM Mono, monospace' }}>value={a.v}</span>
        </div>
      ))}
    </div>
  );
}

// ── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function DataAnalytics() {

  const section = (title, children, extra = {}) => (
    <div style={{
      background: C.surface2, border: `1px solid ${C.border}`,
      borderRadius: 14, padding: 28, marginBottom: 24, ...extra,
    }}>
      <div style={{ color: C.text, fontWeight: 700, fontSize: 16, fontFamily: 'Syne, sans-serif', marginBottom: 22 }}>
        {title}
      </div>
      {children}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh', background: C.surface,
      padding: '32px 40px', fontFamily: 'DM Mono, monospace',
      color: C.text, boxSizing: 'border-box',
    }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: 'Syne, sans-serif', fontSize: 30, fontWeight: 800,
          margin: 0, marginBottom: 16,
          background: `linear-gradient(90deg, ${C.purple}, ${C.teal})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Data Analytics Studio
        </h1>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <HeroBadge label="Datasets"  value="14" />
          <HeroBadge label="Total Rows" value="2.4M" />
          <HeroBadge label="Accuracy"  value="99.8%" />
        </div>
      </div>

      {/* ── DATASET BROWSER ───────────────────────────────────────────────── */}
      {section('Dataset Browser', <DatasetBrowser />)}

      {/* ── QUERY BUILDER ─────────────────────────────────────────────────── */}
      {section('Query Builder', <QueryBuilder />)}

      {/* ── CHART BUILDER ─────────────────────────────────────────────────── */}
      {section('Chart Builder', <ChartBuilder />)}

      {/* ── PIPELINE MONITOR ──────────────────────────────────────────────── */}
      {section('Data Pipeline Monitor', <PipelineMonitor />)}

      {/* ── STATISTICAL SUMMARY ───────────────────────────────────────────── */}
      {section('Statistical Summary — user_events', <StatSummary />)}

      {/* ── ANOMALY DETECTOR ──────────────────────────────────────────────── */}
      {section('Anomaly Detector', <AnomalyDetector />)}

    </div>
  );
}

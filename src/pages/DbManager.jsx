import { useState, useEffect } from 'react';
import { sound } from '../lib/soundEngine';

const injectStyles = () => {
  if (document.getElementById('db-styles')) return;
  const s = document.createElement('style');
  s.id = 'db-styles';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
    @keyframes db-fadeup { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    .db-card:hover { border-color:rgba(245,183,49,0.3)!important; transform:translateY(-2px); box-shadow:0 8px 32px rgba(0,0,0,0.4)!important; }
    .db-btn:hover { filter:brightness(1.15); transform:translateY(-1px); }
    .db-row:hover { background:rgba(255,255,255,0.03)!important; }
  `;
  document.head.appendChild(s);
};

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
  blue: '#3b82f6',
};

const TABLES = [
  {
    name: 'users',
    count: 24500,
    columns: [
      { name: 'id', type: 'uuid', key: 'PK' },
      { name: 'email', type: 'varchar(255)', key: 'UQ' },
      { name: 'password_hash', type: 'varchar(255)', key: '' },
      { name: 'created_at', type: 'timestamp', key: '' }
    ],
    mockData: [
      { id: '1a2b-3c4d', email: 'alice@example.com', created_at: '2026-05-12' },
      { id: '5e6f-7g8h', email: 'bob@example.com', created_at: '2026-05-14' },
      { id: '9i0j-1k2l', email: 'charlie@example.com', created_at: '2026-05-18' }
    ]
  },
  {
    name: 'sessions',
    count: 1240,
    columns: [
      { name: 'id', type: 'varchar(128)', key: 'PK' },
      { name: 'user_id', type: 'uuid', key: 'FK' },
      { name: 'token', type: 'varchar(512)', key: '' },
      { name: 'expires_at', type: 'timestamp', key: '' }
    ],
    mockData: [
      { id: 'sess_1', user_id: '1a2b-3c4d', expires_at: '2026-06-02' },
      { id: 'sess_2', user_id: '5e6f-7g8h', expires_at: '2026-06-05' }
    ]
  },
  {
    name: 'broadcasts',
    count: 4812,
    columns: [
      { name: 'id', type: 'uuid', key: 'PK' },
      { name: 'account_id', type: 'uuid', key: 'FK' },
      { name: 'payload', type: 'text', key: '' },
      { name: 'sent_at', type: 'timestamp', key: '' }
    ],
    mockData: [
      { id: 'bc_1', account_id: 'acc_01', payload: 'Deploy pipeline active...', sent_at: '2026-06-01' }
    ]
  }
];

export default function DbManager() {
  useEffect(() => {
    injectStyles();
  }, []);

  const [activeTab, setActiveTab] = useState('explorer');
  const [selectedTable, setSelectedTable] = useState('users');
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM users LIMIT 10;');
  const [queryResults, setQueryResults] = useState([]);
  const [queryError, setQueryError] = useState(null);
  const [executing, setExecuting] = useState(false);

  const tableObj = TABLES.find(t => t.name === selectedTable) || TABLES[0];

  const handleRunQuery = () => {
    sound.play('click');
    setExecuting(true);
    setQueryError(null);
    setQueryResults([]);

    setTimeout(() => {
      setExecuting(false);
      const q = sqlQuery.trim().toLowerCase();

      if (q.includes('select * from users')) {
        setQueryResults(TABLES[0].mockData);
        sound.play('success');
      } else if (q.includes('select * from sessions')) {
        setQueryResults(TABLES[1].mockData);
        sound.play('success');
      } else if (q.includes('select * from broadcasts')) {
        setQueryResults(TABLES[2].mockData);
        sound.play('success');
      } else {
        setQueryError('SQL Error: Table or index not found or invalid statement syntax.');
        sound.play('warning');
      }
    }, 800);
  };

  return (
    <div style={{ padding: '0 0 80px', fontFamily: 'Syne, sans-serif', background: V.surface, minHeight: '100vh' }}>

      {/* HERO HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #0e0e16 0%, #101920 50%, #18130d 100%)', borderBottom: `1px solid ${V.border}`, padding: '32px 32px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{ fontSize: 28 }}>🗄️</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>Database Schema Manager</h1>
            <div style={{ fontSize: 12, color: V.muted, marginTop: 2 }}>Inspect database schemas, visualize tables relation mappings, and run sandbox queries</div>
          </div>
        </div>

        {/* METRIC STRIP */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 12 }}>
          {[
            { title: 'Total Tables', value: `${TABLES.length} schemas`, icon: '📊', color: V.teal },
            { title: 'Active Connections', value: '14 pool', icon: '🔌', color: V.green },
            { title: 'Index Size footprint', value: '42.8 MB', icon: '💾', color: V.purple },
            { title: 'Db Engine Engine', value: 'PostgreSQL 15', icon: '⚙️', color: V.gold }
          ].map((m, mi) => (
            <div key={mi} style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${V.border}`, borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>{m.icon}</span>
              <div>
                <div style={{ fontSize: 9.5, color: V.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.title}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: m.color, marginTop: 1 }}>{m.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* TABS */}
        <div style={{ display: 'flex', gap: 6, background: V.surface2, borderRadius: 10, padding: 5, border: `1px solid ${V.border}`, width: 'fit-content' }}>
          {[
            { id: 'explorer', label: 'Schema Explorer' },
            { id: 'visualizer', label: 'Relational Graph' },
            { id: 'sandbox', label: 'SQL Editor' }
          ].map(t => (
            <button key={t.id} className={`scraper-tab${activeTab === t.id ? ' active' : ''}`} onClick={() => { sound.play('click'); setActiveTab(t.id); }} style={{ border: 'none', cursor: 'pointer' }}>{t.label}</button>
          ))}
        </div>

        {/* SCHEMA EXPLORER TAB */}
        {activeTab === 'explorer' && (
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1.2fr 1fr', gap: 24, animation: 'db-fadeup 0.3s ease' }}>

            {/* TABLES LIST */}
            <div style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16, padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: V.muted, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 6 }}>Tables</div>
              {TABLES.map(t => (
                <div key={t.name} onClick={() => { sound.play('click'); setSelectedTable(t.name); }} style={{ padding: '10px 12px', borderRadius: 8, background: selectedTable === t.name ? 'rgba(245,183,49,0.12)' : 'transparent', border: `1px solid ${selectedTable === t.name ? V.gold : 'transparent'}`, color: selectedTable === t.name ? V.gold : '#dde0f0', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>📄 {t.name}</span>
                  <span style={{ fontSize: 10, color: V.muted }}>{t.count} r</span>
                </div>
              ))}
            </div>

            {/* COLUMNS IN SPECIFIED TABLE */}
            <div style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16, padding: '20px' }}>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: 14, marginBottom: 16 }}>Table Schema Schema: {tableObj.name}</div>
              <div style={{ border: `1px solid ${V.border}`, borderRadius: 10, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead style={{ background: V.surface3 }}>
                    <tr>
                      <th style={{ padding: '10px 12px', textAlign: 'left', color: V.muted }}>Column</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', color: V.muted }}>Type</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center', color: V.muted }}>Key</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableObj.columns.map((c, idx) => (
                      <tr key={idx} style={{ borderTop: `1px solid ${V.border}` }}>
                        <td style={{ padding: '10px 12px', color: '#fff', fontWeight: 600 }}>{c.name}</td>
                        <td style={{ padding: '10px 12px', color: V.teal, fontFamily: 'DM Mono, monospace' }}>{c.type}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          {c.key && (
                            <span style={{ fontSize: 9, fontWeight: 800, background: c.key === 'PK' ? 'rgba(245,183,49,0.15)' : 'rgba(34,211,238,0.12)', color: c.key === 'PK' ? V.gold : V.teal, padding: '2px 6px', borderRadius: 4 }}>
                              {c.key}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOCK ROWS FOR SELECTED TABLE */}
            <div style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16, padding: '20px' }}>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: 14, marginBottom: 16 }}>Sample Records</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {tableObj.mockData.map((row, ri) => (
                  <div key={ri} style={{ background: V.surface3, border: `1px solid ${V.border}`, borderRadius: 8, padding: 12, fontFamily: 'DM Mono, monospace', fontSize: 11 }}>
                    {Object.entries(row).map(([k, val]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                        <span style={{ color: V.muted }}>{k}:</span>
                        <span style={{ color: V.teal }}>{val}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* RELATIONAL MAP GRAPH */}
        {activeTab === 'visualizer' && (
          <div style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16, padding: '24px', animation: 'db-fadeup 0.3s ease' }}>
            <h3 style={{ margin: 0, color: '#fff', fontSize: 15, marginBottom: 8 }}>Database ER Diagram Visualizer</h3>
            <div style={{ fontSize: 11, color: V.muted, marginBottom: 20 }}>Visual layout map of relationships between active developer platform schemas.</div>

            {/* ER Diagram Canvas */}
            <div style={{ border: `1px solid ${V.border}`, borderRadius: 12, padding: 20, background: 'rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'center' }}>
              <svg viewBox="0 0 520 220" width="100%" height="220">

                {/* Users Table */}
                <g>
                  <rect x="20" y="20" width="120" height="90" rx="8" fill="var(--surface3)" stroke={V.gold} strokeWidth="1.5" />
                  <rect x="20" y="20" width="120" height="24" rx="8" fill="rgba(245,183,49,0.12)" />
                  <text x="32" y="36" fill={V.gold} fontSize="10.5" fontWeight="bold">users</text>
                  <text x="32" y="60" fill="#fff" fontSize="9" fontFamily="DM Mono">🔑 id (uuid)</text>
                  <text x="32" y="75" fill="#dde0f0" fontSize="9" fontFamily="DM Mono">email (varchar)</text>
                  <text x="32" y="90" fill="#dde0f0" fontSize="9" fontFamily="DM Mono">created_at (ts)</text>
                </g>

                {/* Sessions Table */}
                <g>
                  <rect x="200" y="80" width="120" height="90" rx="8" fill="var(--surface3)" stroke={V.border} strokeWidth="1.5" />
                  <rect x="200" y="80" width="120" height="24" rx="8" fill="rgba(255,255,255,0.03)" />
                  <text x="212" y="96" fill="#fff" fontSize="10.5" fontWeight="bold">sessions</text>
                  <text x="212" y="120" fill="#fff" fontSize="9" fontFamily="DM Mono">🔑 id (varchar)</text>
                  <text x="212" y="135" fill={V.teal} fontSize="9" fontFamily="DM Mono">🔗 user_id (uuid)</text>
                  <text x="212" y="150" fill="#dde0f0" fontSize="9" fontFamily="DM Mono">expires_at (ts)</text>
                </g>

                {/* Broadcasts Table */}
                <g>
                  <rect x="380" y="20" width="120" height="90" rx="8" fill="var(--surface3)" stroke={V.border} strokeWidth="1.5" />
                  <rect x="380" y="20" width="120" height="24" rx="8" fill="rgba(255,255,255,0.03)" />
                  <text x="392" y="36" fill="#fff" fontSize="10.5" fontWeight="bold">broadcasts</text>
                  <text x="392" y="60" fill="#fff" fontSize="9" fontFamily="DM Mono">🔑 id (uuid)</text>
                  <text x="392" y="75" fill={V.teal} fontSize="9" fontFamily="DM Mono">🔗 account_id (uuid)</text>
                  <text x="392" y="90" fill="#dde0f0" fontSize="9" fontFamily="DM Mono">sent_at (ts)</text>
                </g>

                {/* Relational connectors */}
                {/* Users to Sessions */}
                <path d="M 140 60 C 170 60, 170 135, 200 135" fill="none" stroke={V.teal} strokeWidth="1.5" strokeDasharray="3" />

                {/* Users to Broadcasts */}
                <path d="M 140 80 C 260 80, 260 75, 380 75" fill="none" stroke={V.teal} strokeWidth="1.5" strokeDasharray="3" />

              </svg>
            </div>
          </div>
        )}

        {/* SQL QUERY SANDBOX EDITOR */}
        {activeTab === 'sandbox' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, animation: 'db-fadeup 0.3s ease' }}>

            {/* EDITOR */}
            <div style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16, padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Sandbox SQL Terminal</span>
                <span style={{ fontSize: 10, color: V.muted, fontFamily: 'DM Mono' }}>Postgres Sandbox</span>
              </div>
              <textarea value={sqlQuery} onChange={e => setSqlQuery(e.target.value)} style={{ width: '100%', height: '140px', background: '#07070b', border: `1px solid ${V.border}`, borderRadius: 10, color: V.teal, padding: 12, fontSize: 12.5, fontFamily: 'DM Mono, monospace', outline: 'none', resize: 'none' }} />
              <button className="db-btn" onClick={handleRunQuery} disabled={executing} style={{ padding: '10px 20px', borderRadius: 8, background: executing ? V.surface3 : V.gold, border: 'none', color: executing ? V.muted : '#000', cursor: executing ? 'not-allowed' : 'pointer', fontWeight: 800, fontSize: 13, fontFamily: 'Syne, sans-serif' }}>
                {executing ? '⏳ Compiling Query Plan...' : '▶ Run Query'}
              </button>
            </div>

            {/* RESULTS VIEW */}
            <div style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16, padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: 14 }}>Query Execution Results</div>
              <div style={{ flex: 1, border: `1px solid ${V.border}`, borderRadius: 10, background: '#07070b', padding: 16, fontFamily: 'DM Mono, monospace', fontSize: 11, minHeight: '160px', overflowY: 'auto' }}>
                {executing && <div style={{ color: V.muted }}>Executing SQL sweep...</div>}

                {!executing && queryError && (
                  <div style={{ color: V.red }}>{queryError}</div>
                )}

                {!executing && !queryError && queryResults.length > 0 && (
                  <pre style={{ margin: 0, color: '#dde0f0', whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(queryResults, null, 2)}
                  </pre>
                )}

                {!executing && !queryError && queryResults.length === 0 && (
                  <div style={{ color: V.muted }}>Run query to inspect results rows.</div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

import { useState, useRef, useEffect } from 'react';

const connections = [
  { id: 1, name: 'Production Web', host: '192.168.1.10', user: 'ubuntu', port: 22, auth: 'key', status: 'online' },
  { id: 2, name: 'Staging DB', host: '10.0.0.5', user: 'admin', port: 2222, auth: 'password', status: 'offline' },
  { id: 3, name: 'Dev Bastion', host: 'bastion.dev.io', user: 'ec2-user', port: 22, auth: 'key', status: 'online' },
  { id: 4, name: 'Analytics Node', host: '172.16.0.8', user: 'root', port: 22, auth: 'key', status: 'offline' },
];

const initialLogs = [
  'Welcome to SSH Manager Terminal',
  'Connected to Production Web (192.168.1.10)',
  'Last login: Mon Jun  2 08:00:12 2026',
  'ubuntu@prod-web:~$ ',
];

const commandHistory = ['ls -la', 'cd /var/log', 'tail -f nginx/access.log', 'ps aux | grep node', 'df -h'];

export default function SSHManager() {
  const [activeConn, setActiveConn] = useState(connections[0]);
  const [termLog, setTermLog] = useState(initialLogs);
  const [cmdInput, setCmdInput] = useState('');
  const [histIdx, setHistIdx] = useState(-1);
  const [showModal, setShowModal] = useState(false);
  const [newConn, setNewConn] = useState({ name: '', host: '', user: '', port: '22', auth: 'key' });
  const [portFwd, setPortFwd] = useState([{ local: '8080', remote: '80', host: '192.168.1.10' }]);
  const [recentCmds] = useState(commandHistory);
  const [activeTab, setActiveTab] = useState('terminal');
  const termRef = useRef(null);

  useEffect(() => { if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight; }, [termLog]);

  const sendCmd = () => {
    if (!cmdInput.trim()) return;
    const prompt = `${activeConn.user}@${activeConn.host.split('.')[0]}:~$ `;
    const responses = { 'ls': 'bin  boot  dev  etc  home  lib  media  mnt  opt  proc  root  run  srv  sys  tmp  usr  var', 'pwd': '/home/ubuntu', 'whoami': activeConn.user, 'uptime': ' 08:09:00 up 12 days,  3:22,  1 user,  load average: 0.12, 0.08, 0.05', 'date': new Date().toString() };
    const resp = responses[cmdInput.trim().split(' ')[0]] || `bash: ${cmdInput.split(' ')[0]}: command not found`;
    setTermLog(l => [...l, prompt + cmdInput, resp, prompt]);
    setCmdInput('');
    setHistIdx(-1);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') { sendCmd(); }
    else if (e.key === 'ArrowUp') { const idx = Math.min(histIdx + 1, recentCmds.length - 1); setHistIdx(idx); setCmdInput(recentCmds[idx] || ''); }
    else if (e.key === 'ArrowDown') { const idx = Math.max(histIdx - 1, -1); setHistIdx(idx); setCmdInput(idx === -1 ? '' : recentCmds[idx]); }
  };

  const s = {
    page: { minHeight: '100vh', background: '#0e0e16', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" },
    hero: { background: 'linear-gradient(135deg, #0e0e16 0%, #16161e 40%, #1a1a2e 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '32px 40px' },
    heroTitle: { fontSize: 32, fontWeight: 800, background: 'linear-gradient(90deg, #22d3ee, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
    badge: (c) => ({ background: c + '22', border: `1px solid ${c}44`, color: c, borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 }),
    body: { display: 'flex', height: 'calc(100vh - 160px)' },
    sidebar: { width: 260, borderRight: '1px solid rgba(255,255,255,0.07)', background: '#0e0e16', display: 'flex', flexDirection: 'column' },
    connItem: (active) => ({ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', background: active ? 'rgba(34,211,238,0.08)' : 'transparent', borderLeft: active ? '3px solid #22d3ee' : '3px solid transparent' }),
    dot: (s) => ({ width: 8, height: 8, borderRadius: '50%', background: s === 'online' ? '#22d3ee' : '#6e7191', display: 'inline-block', marginRight: 8 }),
    main: { flex: 1, display: 'flex', flexDirection: 'column' },
    tabBar: { display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#16161e' },
    tab: (a) => ({ padding: '12px 20px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: a ? '#22d3ee' : '#6e7191', borderBottom: a ? '2px solid #22d3ee' : '2px solid transparent', background: 'none', border: 'none', borderBottomWidth: 2, borderBottomStyle: 'solid', borderBottomColor: a ? '#22d3ee' : 'transparent' }),
    terminal: { flex: 1, background: '#0a0a12', fontFamily: 'monospace', padding: 16, overflow: 'auto', fontSize: 13, lineHeight: 1.6 },
    termInput: { display: 'flex', background: '#0a0a12', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '8px 16px', alignItems: 'center', gap: 8 },
    input: { flex: 1, background: 'transparent', border: 'none', color: '#22d3ee', fontFamily: 'monospace', fontSize: 13, outline: 'none' },
    btn: (c) => ({ background: c + '22', border: `1px solid ${c}44`, color: c, borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }),
    modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
    modalBox: { background: '#16161e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, width: 440 },
    formInput: { width: '100%', background: '#0e0e16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e2e8f0', padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' },
    label: { fontSize: 12, color: '#6e7191', marginBottom: 4, display: 'block' },
  };

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <span style={s.badge('#22d3ee')}>⚡ SSH Manager</span>
              <span style={s.badge('#a78bfa')}>v2.4</span>
            </div>
            <h1 style={s.heroTitle}>SSH Manager</h1>
            <p style={{ color: '#6e7191', margin: '8px 0 0', fontSize: 14 }}>Secure shell connections with terminal emulation, key management & port forwarding</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {[['3', 'Online', '#22d3ee'], ['1', 'Offline', '#6e7191'], ['4', 'Saved', '#a78bfa']].map(([n, l, c]) => (
              <div key={l} style={{ background: '#1d1d28', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: c }}>{n}</div>
                <div style={{ fontSize: 12, color: '#6e7191' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={s.body}>
        <div style={s.sidebar}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#6e7191', textTransform: 'uppercase' }}>Connections</span>
            <button onClick={() => setShowModal(true)} style={s.btn('#22d3ee')}>+ New</button>
          </div>
          {connections.map(c => (
            <div key={c.id} style={s.connItem(activeConn?.id === c.id)} onClick={() => setActiveConn(c)}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <span style={s.dot(c.status)} />
                <span style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</span>
              </div>
              <div style={{ fontSize: 11, color: '#6e7191' }}>{c.user}@{c.host}:{c.port}</div>
              <div style={{ fontSize: 11, color: '#6e7191', marginTop: 2 }}>Auth: {c.auth}</div>
            </div>
          ))}
          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 'auto' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#6e7191', textTransform: 'uppercase', marginBottom: 8 }}>Recent Commands</div>
            {recentCmds.slice(0, 4).map((cmd, i) => (
              <div key={i} onClick={() => setCmdInput(cmd)} style={{ fontSize: 12, fontFamily: 'monospace', color: '#a78bfa', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', background: 'rgba(167,139,250,0.06)', marginBottom: 4 }}>{cmd}</div>
            ))}
          </div>
        </div>

        <div style={s.main}>
          <div style={s.tabBar}>
            {['terminal', 'port-forward', 'key-pairs', 'jump-host'].map(t => (
              <button key={t} style={s.tab(activeTab === t)} onClick={() => setActiveTab(t)}>
                {t === 'terminal' ? '⌨ Terminal' : t === 'port-forward' ? '🔀 Port Forwarding' : t === 'key-pairs' ? '🔑 Key Pairs' : '🔗 Jump Host'}
              </button>
            ))}
          </div>

          {activeTab === 'terminal' && (
            <>
              <div ref={termRef} style={s.terminal}>
                {termLog.map((line, i) => (
                  <div key={i} style={{ color: line.includes('$') ? '#22d3ee' : line.includes('Welcome') ? '#a78bfa' : line.includes('Last login') ? '#f5b731' : '#e2e8f0' }}>{line}</div>
                ))}
              </div>
              <div style={s.termInput}>
                <span style={{ color: '#22d3ee', fontFamily: 'monospace', fontSize: 13 }}>{activeConn?.user}@{activeConn?.host?.split('.')[0]}:~$</span>
                <input style={s.input} value={cmdInput} onChange={e => setCmdInput(e.target.value)} onKeyDown={onKeyDown} placeholder="Enter command..." autoFocus />
                <button onClick={sendCmd} style={s.btn('#22d3ee')}>Run</button>
                <button onClick={() => setTermLog(initialLogs)} style={s.btn('#6e7191')}>Clear</button>
              </div>
            </>
          )}

          {activeTab === 'port-forward' && (
            <div style={{ padding: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Port Forwarding Rules</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Local Port', 'Remote Port', 'Remote Host', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#6e7191', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {portFwd.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: '#22d3ee' }}>:{r.local}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: '#f5b731' }}>:{r.remote}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{r.host}</td>
                      <td style={{ padding: '10px 12px' }}><span style={s.badge('#22d3ee')}>Active</span></td>
                      <td style={{ padding: '10px 12px' }}>
                        <button onClick={() => setPortFwd(p => p.filter((_, j) => j !== i))} style={s.btn('#ef4444')}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={() => setPortFwd(p => [...p, { local: '9090', remote: '9090', host: activeConn?.host }])} style={{ ...s.btn('#22d3ee'), marginTop: 16 }}>+ Add Rule</button>
            </div>
          )}

          {activeTab === 'key-pairs' && (
            <div style={{ padding: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Key Pair Manager</div>
              {[{ name: 'prod-key.pem', type: 'RSA 4096', fingerprint: 'SHA256:xK9...mP2', created: '2026-01-15' }, { name: 'dev-key.pem', type: 'ED25519', fingerprint: 'SHA256:aB3...nQ7', created: '2026-03-22' }].map((kp, i) => (
                <div key={i} style={{ background: '#1d1d28', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>🔑 {kp.name}</div>
                      <div style={{ fontSize: 12, color: '#6e7191' }}>{kp.type} · {kp.fingerprint} · Created {kp.created}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button style={s.btn('#a78bfa')}>Copy Public Key</button>
                      <button style={s.btn('#ef4444')}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              <button style={{ ...s.btn('#22d3ee'), marginTop: 8 }}>+ Generate New Key Pair</button>
            </div>
          )}

          {activeTab === 'jump-host' && (
            <div style={{ padding: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Jump Host Configuration</div>
              <div style={{ background: '#1d1d28', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 20 }}>
                {[['Jump Host', 'bastion.prod.io'], ['Username', 'ec2-user'], ['Port', '22'], ['Auth Method', 'Key (prod-key.pem)'], ['Timeout', '30s']].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: '#6e7191', fontSize: 13 }}>{k}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#22d3ee' }}>{v}</span>
                  </div>
                ))}
              </div>
              <button style={{ ...s.btn('#22d3ee'), marginTop: 16 }}>Save Jump Host Config</button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div style={s.modal}>
          <div style={s.modalBox}>
            <h3 style={{ margin: '0 0 20px', fontSize: 18 }}>New SSH Connection</h3>
            {[['Connection Name', 'name', 'text', 'My Server'], ['Host / IP', 'host', 'text', '192.168.1.1'], ['Username', 'user', 'text', 'ubuntu'], ['Port', 'port', 'number', '22']].map(([label, field, type, ph]) => (
              <div key={field} style={{ marginBottom: 16 }}>
                <label style={s.label}>{label}</label>
                <input type={type} placeholder={ph} value={newConn[field]} onChange={e => setNewConn(n => ({ ...n, [field]: e.target.value }))} style={s.formInput} />
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <label style={s.label}>Auth Method</label>
              <select value={newConn.auth} onChange={e => setNewConn(n => ({ ...n, auth: e.target.value }))} style={{ ...s.formInput, cursor: 'pointer' }}>
                <option value="key">SSH Key</option>
                <option value="password">Password</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={s.btn('#6e7191')}>Cancel</button>
              <button onClick={() => setShowModal(false)} style={s.btn('#22d3ee')}>Save Connection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

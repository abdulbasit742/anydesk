import { useState } from 'react';

const services = [
  { id: 'db', label: 'PostgreSQL', image: 'postgres:16', ports: ['5432:5432'], volumes: ['pg_data:/var/lib/postgresql'], env: ['POSTGRES_DB=app', 'POSTGRES_PASSWORD=secret'], status: 'running', deps: [], color: '#60a5fa' },
  { id: 'redis', label: 'Redis', image: 'redis:7-alpine', ports: ['6379:6379'], volumes: ['redis_data:/data'], env: ['REDIS_PASSWORD=secret'], status: 'running', deps: [], color: '#ef4444' },
  { id: 'api', label: 'API Server', image: 'node:20-alpine', ports: ['3000:3000'], volumes: ['./api:/app'], env: ['DATABASE_URL=postgres://db:5432/app', 'REDIS_URL=redis://redis:6379'], status: 'running', deps: ['db', 'redis'], color: '#22d3ee' },
  { id: 'worker', label: 'Worker', image: 'node:20-alpine', ports: [], volumes: ['./worker:/app'], env: ['DATABASE_URL=postgres://db:5432/app', 'REDIS_URL=redis://redis:6379'], status: 'stopped', deps: ['db', 'redis'], color: '#a78bfa' },
  { id: 'nginx', label: 'Nginx', image: 'nginx:alpine', ports: ['80:80', '443:443'], volumes: ['./nginx.conf:/etc/nginx/nginx.conf'], env: [], status: 'running', deps: ['api'], color: '#f5b731' },
];

const statusColor = { running: '#22d3ee', stopped: '#ef4444', restarting: '#f5b731' };

const composeYaml = `version: '3.9'
services:
  db:
    image: postgres:16
    ports: ["5432:5432"]
    volumes: [pg_data:/var/lib/postgresql]
    environment:
      POSTGRES_DB: app
      POSTGRES_PASSWORD: secret

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  api:
    image: node:20-alpine
    ports: ["3000:3000"]
    depends_on: [db, redis]
    environment:
      DATABASE_URL: postgres://db:5432/app

  worker:
    image: node:20-alpine
    depends_on: [db, redis]

  nginx:
    image: nginx:alpine
    ports: ["80:80","443:443"]
    depends_on: [api]

volumes:
  pg_data:
  redis_data:`;

export default function DockerComposer() {
  const [selectedService, setSelectedService] = useState('api');
  const [serviceStatus, setServiceStatus] = useState(Object.fromEntries(services.map(s => [s.id, s.status])));
  const [showYaml, setShowYaml] = useState(false);

  const toggleService = (id) => {
    setServiceStatus(prev => ({ ...prev, [id]: prev[id] === 'running' ? 'stopped' : 'running' }));
  };

  const sel = services.find(s => s.id === selectedService);



  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0e1a1e 0%, #16161e 55%, #1e1a0e 100%)', padding: '48px 40px 36px', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: 60, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,165,250,0.07) 0%, transparent 70%)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>🐳</span>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, background: 'linear-gradient(90deg, #60a5fa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Docker Composer</h1>
        </div>
        <p style={{ color: '#6e7191', margin: '0 0 24px', fontSize: 15 }}>Visual docker-compose editor with service management and dependency visualization</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {[['Services', '5', '#60a5fa'], ['Running', '4', '#22d3ee'], ['Stopped', '1', '#ef4444'], ['Exposed Ports', '6', '#f5b731']].map(([l, v, c]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 18px' }}>
              <div style={{ fontSize: 11, color: '#6e7191', marginBottom: 2 }}>{l}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: c }}>{v}</div>
            </div>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            <button onClick={() => setShowYaml(v => !v)} style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>{showYaml ? '🎨 Grid View' : '📄 YAML View'}</button>
            <button style={{ background: 'linear-gradient(90deg, #065f46, #047857)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>▶ docker-compose up</button>
          </div>
        </div>
      </div>

      <div style={{ padding: '32px 40px' }}>
        {showYaml ? (
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>docker-compose.yml</h2>
            <pre style={{ background: '#0a0a12', borderRadius: 8, padding: 20, fontFamily: 'monospace', fontSize: 12, color: '#22d3ee', overflow: 'auto', margin: 0, lineHeight: 1.7 }}>{composeYaml}</pre>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
            {/* Services Grid */}
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                {services.map(s => {
                  const st = serviceStatus[s.id];
                  return (
                    <div key={s.id} onClick={() => setSelectedService(s.id)} style={{ background: selectedService === s.id ? 'rgba(255,255,255,0.07)' : 'var(--surface2)', border: `2px solid ${selectedService === s.id ? s.color : 'var(--border)'}`, borderRadius: 14, padding: 18, cursor: 'pointer', transition: 'all 0.2s' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 14, color: s.color, marginBottom: 2 }}>{s.label}</div>
                          <div style={{ fontSize: 10, color: '#6e7191', fontFamily: 'monospace' }}>{s.image}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor[st] }} />
                          <span style={{ fontSize: 10, color: statusColor[st] }}>{st}</span>
                        </div>
                      </div>
                      {s.ports.length > 0 && <div style={{ fontSize: 11, color: '#6e7191', marginBottom: 4 }}>🔌 {s.ports.join(', ')}</div>}
                      {s.deps.length > 0 && <div style={{ fontSize: 11, color: '#6e7191', marginBottom: 10 }}>depends_on: {s.deps.join(', ')}</div>}
                      <button onClick={e => { e.stopPropagation(); toggleService(s.id); }} style={{ width: '100%', background: st === 'running' ? 'rgba(239,68,68,0.1)' : 'rgba(34,211,238,0.1)', border: `1px solid ${st === 'running' ? 'rgba(239,68,68,0.3)' : 'rgba(34,211,238,0.3)'}`, color: st === 'running' ? '#ef4444' : '#22d3ee', borderRadius: 8, padding: '6px', cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>
                        {st === 'running' ? '■ Stop' : '▶ Start'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Network panel */}
              <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
                <h2 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700 }}>Network Configuration</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[['Default Network', 'app_default (bridge)'], ['Subnet', '172.20.0.0/16'], ['Gateway', '172.20.0.1'], ['DNS', '127.0.0.11']].map(([k, v]) => (
                    <div key={k} style={{ background: 'var(--surface3)', borderRadius: 8, padding: 10 }}>
                      <div style={{ fontSize: 11, color: '#6e7191', marginBottom: 3 }}>{k}</div>
                      <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#60a5fa' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detail Panel */}
            {sel && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ background: 'var(--surface2)', border: `1px solid ${sel.color}44`, borderRadius: 14, padding: 20 }}>
                  <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: sel.color }}>{sel.label} — Details</h2>
                  <div style={{ fontSize: 12, color: '#6e7191', marginBottom: 8 }}>Image</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#e2e8f0', background: '#0a0a12', borderRadius: 6, padding: '6px 10px', marginBottom: 14 }}>{sel.image}</div>

                  {sel.ports.length > 0 && <>
                    <div style={{ fontSize: 12, color: '#6e7191', marginBottom: 6 }}>Ports</div>
                    {sel.ports.map(p => <div key={p} style={{ fontFamily: 'monospace', fontSize: 12, color: '#22d3ee', marginBottom: 4 }}>🔌 {p}</div>)}
                  </>}

                  {sel.volumes.length > 0 && <>
                    <div style={{ fontSize: 12, color: '#6e7191', margin: '10px 0 6px' }}>Volumes</div>
                    {sel.volumes.map(v => <div key={v} style={{ fontFamily: 'monospace', fontSize: 11, color: '#f5b731', marginBottom: 4 }}>💾 {v}</div>)}
                  </>}

                  {sel.env.length > 0 && <>
                    <div style={{ fontSize: 12, color: '#6e7191', margin: '10px 0 6px' }}>Environment</div>
                    <div style={{ background: '#0a0a12', borderRadius: 8, padding: 10 }}>
                      {sel.env.map(e => <div key={e} style={{ fontFamily: 'monospace', fontSize: 11, color: '#a78bfa', marginBottom: 3 }}>{e}</div>)}
                    </div>
                  </>}
                </div>

                <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
                  <h2 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700 }}>Resource Limits</h2>
                  {[['CPU', '0.5 cores'], ['Memory', '512 MB'], ['Restart Policy', 'unless-stopped']].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                      <span style={{ color: '#6e7191' }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';

const SESSION_ID = 'RD-' + Date.now().toString(36).toUpperCase().slice(-8);

const PLATFORMS = [
  { id: 'university-hpc', name: 'University HPC Cluster (Slurm/GPU)', category: 'University', icon: '🏛️', host: 'hpc.campus.edu:22' },
  { id: 'eduroam-lab', name: 'Eduroam Lab VDI Node (Proxy 3128)', category: 'University', icon: '🎓', host: '172.30.10.10:3128' },
  { id: 'guacamole-ws', name: 'Guacamole Workstation (Linux VDI)', category: 'University', icon: '🔬', host: 'guac.campus.edu:8443' },
  { id: 'campus-library', name: 'Digital Library Node', category: 'University', icon: '📚', host: 'library.campus.edu' },
  { id: 'bolt', name: 'Bolt.new (AI Cloud)', category: 'AI Cloud', icon: '⚡', host: 'bolt.new' },
  { id: 'lovable', name: 'Lovable (Frontend)', category: 'AI Cloud', icon: '✨', host: 'lovable.dev' },
  { id: 'cursor', name: 'Cursor (IDE Remote)', category: 'AI Cloud', icon: '🖱️', host: 'cursor.sh' },
  { id: 'claude', name: 'Claude.ai (Anthropic)', category: 'AI Cloud', icon: '🧠', host: 'claude.ai' },
  { id: 'chatgpt', name: 'ChatGPT (OpenAI)', category: 'AI Cloud', icon: '💬', host: 'chatgpt.com' },
  { id: 'replit', name: 'Replit (Agent Workspace)', category: 'AI Cloud', icon: '🚀', host: 'replit.com' },
];

const HPC_LOGS = [
  '[SLURM] sbatch job #92014 queued: distributed-agent-training.sh',
  '[SLURM] Allocating 4x NVIDIA A100-SXM4-80GB on node c04',
  '[PROXY] Eduroam tunnel upstream verified via 172.30.10.10:3128',
  '[VDI] Guacamole WebRTC session established (rtt: 18ms)',
];

export default function RemoteSession({ onNav }) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [sessionId] = useState(SESSION_ID);
  const [quality, setQuality] = useState(85);
  const [latency, setLatency] = useState(24);
  const [fps, setFps] = useState(60);
  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0].id);
  const [eduroamProxy, setEduroamProxy] = useState(true);
  const [activeTab, setActiveTab] = useState('display');
  const intervalRef = useRef(null);

  const currentPlatform = PLATFORMS.find(p => p.id === selectedPlatform) || PLATFORMS[0];
  const isUniversity = currentPlatform.category === 'University';

  const connect = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnected(true);
      setConnecting(false);
      intervalRef.current = setInterval(() => {
        setLatency(Math.floor(Math.random() * 20) + (isUniversity ? 12 : 25));
        setFps(Math.floor(Math.random() * 8) + 56);
      }, 2000);
    }, 1200);
  };

  const disconnect = () => {
    setConnected(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  return (
    <div style={{ padding: 24, color: '#e2e8f0', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <button 
              onClick={() => onNav && onNav('remote')}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              ← Catalog
            </button>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
              {currentPlatform.icon} {currentPlatform.name}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--muted)' }}>
            <span>Session: <strong style={{ color: '#6366f1', fontFamily: 'DM Mono, monospace' }}>{sessionId}</strong></span>
            <span>•</span>
            <span>Host: <code style={{ color: '#94a3b8' }}>{currentPlatform.host}</code></span>
            <span>•</span>
            <button
              onClick={() => setEduroamProxy(v => !v)}
              style={{
                background: eduroamProxy ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                border: `1px solid ${eduroamProxy ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
                color: eduroamProxy ? '#10b981' : '#f87171',
                borderRadius: 99,
                padding: '2px 10px',
                fontSize: 11,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {eduroamProxy ? '📡 Eduroam Proxy: 172.30.10.10:3128' : '🌐 Direct Network (No Proxy)'}
            </button>
          </div>
        </div>

        {/* Action Connect Button */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {!connected ? (
            <button
              onClick={connect}
              disabled={connecting}
              style={{
                padding: '9px 22px',
                borderRadius: 8,
                border: 'none',
                background: connecting ? 'rgba(99,102,241,0.3)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: '#fff',
                cursor: connecting ? 'not-allowed' : 'pointer',
                fontSize: 13,
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
              }}
            >
              {connecting ? '⏳ Tunneling & Connecting...' : '⚡ Connect Node'}
            </button>
          ) : (
            <button
              onClick={disconnect}
              style={{
                padding: '9px 20px',
                borderRadius: 8,
                border: 'none',
                background: 'rgba(239,68,68,0.2)',
                borderWidth: 1,
                borderColor: 'rgba(239,68,68,0.4)',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              ✕ Terminate Session
            </button>
          )}
        </div>
      </div>

      {/* Tab Switcher if University Node */}
      {isUniversity && connected && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button
            onClick={() => setActiveTab('display')}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'display' ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.05)',
              color: activeTab === 'display' ? '#818cf8' : 'var(--muted)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            🖥️ VDI Display
          </button>
          <button
            onClick={() => setActiveTab('slurm')}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'slurm' ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.05)',
              color: activeTab === 'slurm' ? '#34d399' : 'var(--muted)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            📊 Slurm & HPC Cluster Logs
          </button>
        </div>
      )}

      {/* Main Remote Display Canvas / Terminal */}
      <div style={{
        background: '#070913',
        border: `1px solid ${connected ? 'rgba(16,185,129,0.35)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 12,
        aspectRatio: '16/9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: connected ? '0 0 24px rgba(16,185,129,0.08)' : 'none',
      }}>
        {connected ? (
          activeTab === 'slurm' ? (
            <div style={{ width: '100%', height: '100%', padding: 24, boxSizing: 'border-box', fontFamily: 'monospace', fontSize: 13, color: '#38bdf8', overflowY: 'auto' }}>
              <div style={{ color: '#10b981', marginBottom: 12, fontWeight: 700 }}>
                === CAMPUS HPC CLUSTER JOB MONITOR [NODE c04 / A100 GPU] ===
              </div>
              {HPC_LOGS.map((log, i) => (
                <div key={i} style={{ marginBottom: 6 }}>{log}</div>
              ))}
              <div style={{ color: '#94a3b8', marginTop: 14 }}>
                $ squeue -u $(whoami)
                <br />
                JOBID   PARTITION   NAME      USER    ST   TIME  NODES NODELIST(REASON)
                <br />
                92014   gpu-a100    dist-ai   student R    0:14      1 c04
              </div>
            </div>
          ) : (
            <>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.08) 0%, transparent 80%)',
              }} />
              <div style={{ textAlign: 'center', zIndex: 1 }}>
                <div style={{ fontSize: 52, marginBottom: 10 }}>{currentPlatform.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#10b981' }}>{currentPlatform.name}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                  Encrypted WebRTC VDI Stream • {eduroamProxy ? 'Proxied via Eduroam' : 'Direct P2P'}
                </div>
              </div>
              {/* Status overlay */}
              <div style={{
                position: 'absolute', top: 12, right: 12,
                display: 'flex', gap: 8, alignItems: 'center',
              }}>
                <span style={{ fontSize: 10, color: '#10b981', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(16,185,129,0.3)', padding: '3px 8px', borderRadius: 99 }}>
                  ● {fps} FPS
                </span>
                <span style={{ fontSize: 10, color: latency < 30 ? '#10b981' : '#f59e0b', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.1)', padding: '3px 8px', borderRadius: 99 }}>
                  {latency}ms RTT
                </span>
                <span style={{ fontSize: 10, color: '#38bdf8', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(56,189,248,0.3)', padding: '3px 8px', borderRadius: 99 }}>
                  {quality}% Q
                </span>
              </div>
            </>
          )
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>{currentPlatform.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>
              {connecting ? `Connecting to ${currentPlatform.name}...` : 'Ready to Connect'}
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
              Click Connect Node to launch remote desktop stream
            </div>
          </div>
        )}
      </div>

      {/* Control Configuration Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 12,
      }}>
        <div style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8, fontWeight: 600 }}>Target Remote Node / Workstation</div>
          <select
            value={selectedPlatform}
            onChange={e => setSelectedPlatform(e.target.value)}
            disabled={connected}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 6,
              padding: '8px 10px',
              color: '#e2e8f0',
              fontSize: 12,
              cursor: connected ? 'not-allowed' : 'pointer',
            }}
          >
            <optgroup label="University Campus Infrastructure">
              {PLATFORMS.filter(p => p.category === 'University').map(p => (
                <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
              ))}
            </optgroup>
            <optgroup label="AI Cloud Platforms">
              {PLATFORMS.filter(p => p.category === 'AI Cloud').map(p => (
                <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
              ))}
            </optgroup>
          </select>
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8, fontWeight: 600 }}>Adaptive Video Quality: {quality}%</div>
          <input
            type="range"
            min={30}
            max={100}
            value={quality}
            onChange={e => setQuality(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#6366f1' }}
          />
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8, fontWeight: 600 }}>Node Status & Network</div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12, alignItems: 'center' }}>
            <span style={{ color: connected ? '#10b981' : '#ef4444', fontWeight: 600 }}>
              {connected ? '● Session Active' : '○ Disconnected'}
            </span>
            {connected && (
              <>
                <span style={{ color: '#94a3b8' }}>{fps} FPS</span>
                <span style={{ color: '#94a3b8' }}>{latency}ms</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

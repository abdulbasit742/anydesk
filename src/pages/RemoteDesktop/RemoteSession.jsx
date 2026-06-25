import { useState, useEffect, useRef } from 'react';

const SESSION_ID = 'RD-' + Date.now().toString(36).toUpperCase().slice(-8);

export default function RemoteSession({ onNav }) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [sessionId] = useState(SESSION_ID);
  const [quality, setQuality] = useState(85);
  const [latency, setLatency] = useState(24);
  const [fps, setFps] = useState(60);
  const [platform, setPlatform] = useState('Bolt.new');
  const intervalRef = useRef(null);

  const connect = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnected(true);
      setConnecting(false);
      intervalRef.current = setInterval(() => {
        setLatency(Math.floor(Math.random() * 40) + 10);
        setFps(Math.floor(Math.random() * 10) + 55);
      }, 2000);
    }, 1800);
  };

  const disconnect = () => {
    setConnected(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  return (
    <div style={{ padding: 24, color: '#e2e8f0', minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <button 
              onClick={() => onNav && onNav('remote')}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                color: '#fff',
                padding: '6px 10px',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              ← Back
            </button>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>🔗 Remote Session</h1>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0 }}>
            Session ID: <span style={{ color: '#6366f1', fontFamily: 'DM Mono, monospace' }}>{sessionId}</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {!connected ? (
            <button
              onClick={connect}
              disabled={connecting}
              style={{
                padding: '9px 20px',
                borderRadius: 8,
                border: 'none',
                background: connecting ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.8)',
                color: '#fff',
                cursor: connecting ? 'not-allowed' : 'pointer',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {connecting ? '⏳ Connecting...' : '⚡ Connect'}
            </button>
          ) : (
            <button
              onClick={disconnect}
              style={{
                padding: '9px 20px',
                borderRadius: 8,
                border: 'none',
                background: 'rgba(239,68,68,0.2)',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              ✕ Disconnect
            </button>
          )}
        </div>
      </div>

      {/* Session screen */}
      <div style={{
        background: 'rgba(0,0,0,0.6)',
        border: `1px solid ${connected ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 12,
        aspectRatio: '16/9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {connected ? (
          <>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(16,185,129,0.05) 100%)',
            }} />
            <div style={{ textAlign: 'center', zIndex: 1 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>⚡</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#10b981' }}>{platform}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Remote session active</div>
            </div>
            {/* Status overlay */}
            <div style={{
              position: 'absolute', top: 12, right: 12,
              display: 'flex', gap: 8, alignItems: 'center',
            }}>
              <span style={{ fontSize: 10, color: '#10b981', background: 'rgba(0,0,0,0.6)', padding: '3px 8px', borderRadius: 99 }}>
                ● {fps} FPS
              </span>
              <span style={{ fontSize: 10, color: '#f59e0b', background: 'rgba(0,0,0,0.6)', padding: '3px 8px', borderRadius: 99 }}>
                {latency}ms
              </span>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🖥️</div>
            <div style={{ fontSize: 14 }}>
              {connecting ? 'Establishing connection...' : 'No active session'}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 12,
      }}>
        <div style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>Platform</div>
          <select
            value={platform}
            onChange={e => setPlatform(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 6,
              padding: '6px 8px',
              color: '#e2e8f0',
              fontSize: 12,
            }}
          >
            {['Bolt.new', 'Lovable', 'Cursor', 'Claude.ai', 'ChatGPT', 'Replit'].map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>Quality: {quality}%</div>
          <input
            type="range"
            min={30}
            max={100}
            value={quality}
            onChange={e => setQuality(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>Session Stats</div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
            <span style={{ color: connected ? '#10b981' : '#ef4444' }}>
              {connected ? '● Live' : '○ Offline'}
            </span>
            {connected && (
              <>
                <span style={{ color: 'var(--muted)' }}>{fps} fps</span>
                <span style={{ color: 'var(--muted)' }}>{latency}ms</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

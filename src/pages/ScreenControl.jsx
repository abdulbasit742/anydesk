import { useState } from 'react';

const screens = [
  { id: 1, name: 'Main Monitor', width: 1920, height: 1080, active: true, fps: 60 },
  { id: 2, name: 'Secondary', width: 2560, height: 1440, active: false, fps: 144 },
  { id: 3, name: 'Ultrawide', width: 3440, height: 1440, active: false, fps: 75 },
];

export default function ScreenControl() {
  const [selected, setSelected] = useState(1);
  const [recording, setRecording] = useState(false);
  const [quality, setQuality] = useState('HD');

  return (
    <div style={{ padding: 24, color: '#e2e8f0', minHeight: '100vh', background: 'var(--bg)' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>🖥️ Screen Control</h1>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 24 }}>
        Monitor and control screens, manage display outputs, and record sessions.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 24 }}>
        {screens.map(screen => (
          <div
            key={screen.id}
            onClick={() => setSelected(screen.id)}
            style={{
              background: selected === screen.id ? 'rgba(99,102,241,0.15)' : 'var(--card)',
              border: `1px solid ${selected === screen.id ? '#6366f1' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: 12,
              padding: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{screen.name}</span>
              <span style={{
                fontSize: 10,
                padding: '2px 8px',
                borderRadius: 99,
                background: screen.active ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)',
                color: screen.active ? '#10b981' : 'var(--muted)',
              }}>
                {screen.active ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>
            <div style={{ display: 'flex', flex: 1, background: 'rgba(0,0,0,0.4)', borderRadius: 8, aspectRatio: '16/9', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 28 }}>🖥️</span>
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--muted)' }}>
              <span>{screen.width}×{screen.height}</span>
              <span>•</span>
              <span>{screen.fps}Hz</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'var(--card)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12,
        padding: 20,
      }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Control Panel</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            onClick={() => setRecording(r => !r)}
            style={{
              padding: '9px 18px',
              borderRadius: 8,
              border: 'none',
              background: recording ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)',
              color: recording ? '#ef4444' : '#10b981',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {recording ? '⏹ Stop Recording' : '⏺ Start Recording'}
          </button>

          {['HD', 'FHD', '4K'].map(q => (
            <button
              key={q}
              onClick={() => setQuality(q)}
              style={{
                padding: '9px 16px',
                borderRadius: 8,
                border: `1px solid ${quality === q ? '#6366f1' : 'rgba(255,255,255,0.08)'}`,
                background: quality === q ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: quality === q ? '#6366f1' : 'var(--muted)',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {q}
            </button>
          ))}

          <button style={{
            padding: '9px 18px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'transparent',
            color: 'var(--muted)',
            cursor: 'pointer',
            fontSize: 13,
          }}>
            📷 Screenshot
          </button>
        </div>

        {recording && (
          <div style={{
            marginTop: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12,
            color: '#ef4444',
          }}>
            <div style={{
              width: 8, height: 8,
              borderRadius: '50%',
              background: '#ef4444',
              animation: 'pulse 1s infinite',
            }} />
            Recording in progress — {quality} quality
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';

const STATUS_CONFIG = {
  online: { color: 'var(--teal, #00d4aa)', label: 'Online', pulse: true },
  offline: { color: 'var(--red, #ff4757)', label: 'Offline', pulse: false },
  idle: { color: '#f5a623', label: 'Idle', pulse: false },
  degraded: { color: '#f5c518', label: 'Degraded', pulse: true },
  unknown: { color: 'var(--text-muted, #888)', label: 'Unknown', pulse: false },
};

function StatusDot({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.unknown;

  return (
    <div style={{ position: 'relative', width: '10px', height: '10px', flexShrink: 0 }}>
      <div style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: cfg.color,
        position: 'relative',
        zIndex: 1,
      }} />
      {cfg.pulse && (
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: cfg.color,
          animation: 'statusPulse 2s ease-out infinite',
          opacity: 0.4,
        }} />
      )}
    </div>
  );
}

function StatusCard({ item, index }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.unknown;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 50);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 14px',
        background: hovered ? 'rgba(255,255,255,0.04)' : 'var(--surface-2, #14141f)',
        border: `1px solid ${hovered ? cfg.color + '44' : 'var(--border, #2a2a3e)'}`,
        borderRadius: '10px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.96)',
        transition: 'all 0.25s ease',
        cursor: 'default',
      }}
    >
      {item.icon && (
        <span style={{
          fontSize: '18px',
          width: '28px',
          textAlign: 'center',
          flexShrink: 0,
        }}>
          {item.icon}
        </span>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '12px',
          fontWeight: '600',
          color: 'var(--text, #f0f0f0)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {item.label}
        </div>
        <div style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '10px',
          color: cfg.color,
          marginTop: '2px',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          {cfg.label}
        </div>
      </div>
      <StatusDot status={item.status} />
    </div>
  );
}

const defaultItems = [
  { id: 'api', label: 'API Gateway', status: 'online', icon: '🌐' },
  { id: 'db', label: 'Database Cluster', status: 'online', icon: '🗄️' },
  { id: 'cache', label: 'Redis Cache', status: 'idle', icon: '⚡' },
  { id: 'ml', label: 'ML Inference', status: 'degraded', icon: '🤖' },
  { id: 'queue', label: 'Message Queue', status: 'online', icon: '📬' },
  { id: 'storage', label: 'Object Storage', status: 'offline', icon: '📦' },
  { id: 'auth', label: 'Auth Service', status: 'online', icon: '🔐' },
  { id: 'cdn', label: 'CDN Edge', status: 'unknown', icon: '🌍' },
];

export default function StatusGrid({ items = [], cols = 4 }) {
  const data = items.length > 0 ? items : defaultItems;

  return (
    <div style={{
      background: 'var(--surface, #1a1a2e)',
      border: '1px solid var(--border, #2a2a3e)',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes statusPulse {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(2.4); opacity: 0; }
        }
      `}</style>
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border, #2a2a3e)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: '600', color: 'var(--text, #f0f0f0)' }}>
          Service Status
        </span>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {Object.entries(STATUS_CONFIG).slice(0, 3).map(([key, cfg]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: cfg.color }} />
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--text-muted, #888)', textTransform: 'capitalize' }}>{key}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: '10px',
        padding: '14px',
      }}>
        {data.map((item, i) => (
          <StatusCard key={item.id ?? i} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';

const TYPE_COLORS = {
  success: 'var(--teal, #00d4aa)',
  error: 'var(--red, #ff4757)',
  warning: '#f5a623',
  info: 'var(--gold, #f5c518)',
  default: '#a78bfa',
};

const TYPE_BG = {
  success: 'rgba(0,212,170,0.12)',
  error: 'rgba(255,71,87,0.12)',
  warning: 'rgba(245,166,35,0.12)',
  info: 'rgba(245,197,24,0.12)',
  default: 'rgba(167,139,250,0.12)',
};

function formatTs(ts) {
  if (!ts) return '';
  const d = ts instanceof Date ? ts : new Date(ts);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString();
}

function FeedItem({ event, index }) {
  const [visible, setVisible] = useState(false);
  const color = TYPE_COLORS[event.type] || TYPE_COLORS.default;
  const bg = TYPE_BG[event.type] || TYPE_BG.default;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 40);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '12px 16px',
        borderBottom: '1px solid var(--border, #2a2a3e)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-10px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        background: 'transparent',
        cursor: 'default',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{
        width: '34px',
        height: '34px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        flexShrink: 0,
        background: bg,
        color,
      }}>
        {event.icon || '●'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '13px',
          color: 'var(--text, #f0f0f0)',
          margin: '0 0 4px 0',
          lineHeight: 1.4,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {event.text}
        </p>
        <span style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '11px',
          color: 'var(--text-muted, #888)',
        }}>
          {formatTs(event.ts)}
        </span>
      </div>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: color,
        flexShrink: 0,
        marginTop: '6px',
        boxShadow: `0 0 6px ${color}88`,
      }} />
    </div>
  );
}

const defaultEvents = [
  { type: 'success', text: 'Deployment pipeline completed successfully', ts: new Date(Date.now() - 60000), icon: '✓' },
  { type: 'error', text: 'Connection timeout on endpoint /api/v2/query', ts: new Date(Date.now() - 300000), icon: '✕' },
  { type: 'info', text: 'New model version v3.2.1 is available', ts: new Date(Date.now() - 900000), icon: '★' },
  { type: 'warning', text: 'Memory usage exceeded 85% threshold', ts: new Date(Date.now() - 1800000), icon: '⚠' },
  { type: 'success', text: 'User authentication service restarted', ts: new Date(Date.now() - 3600000), icon: '↺' },
  { type: 'info', text: 'Scheduled backup completed — 2.4 GB stored', ts: new Date(Date.now() - 7200000), icon: '📦' },
];

export default function ActivityFeed({ events = [], onLoadMore, hasMore = false }) {
  const data = events.length > 0 ? events : defaultEvents;
  const [loading, setLoading] = useState(false);
  const feedRef = useRef(null);

  const handleLoadMore = async () => {
    if (loading) return;
    setLoading(true);
    if (onLoadMore) await onLoadMore();
    setTimeout(() => setLoading(false), 600);
  };

  return (
    <div style={{
      background: 'var(--surface, #1a1a2e)',
      border: '1px solid var(--border, #2a2a3e)',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border, #2a2a3e)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '14px',
          fontWeight: '600',
          color: 'var(--text, #f0f0f0)',
        }}>Activity Feed</span>
        <span style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '11px',
          color: 'var(--text-muted, #888)',
          background: 'rgba(255,255,255,0.06)',
          padding: '3px 8px',
          borderRadius: '20px',
        }}>{data.length} events</span>
      </div>
      <div
        ref={feedRef}
        style={{
          overflowY: 'auto',
          maxHeight: '360px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--border, #2a2a3e) transparent',
        }}
      >
        {data.map((ev, i) => (
          <FeedItem key={ev.id ?? i} event={ev} index={i} />
        ))}
        {data.length === 0 && (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: 'var(--text-muted, #888)',
            fontFamily: 'DM Mono, monospace',
            fontSize: '13px',
          }}>
            No activity yet
          </div>
        )}
      </div>
      {(hasMore || data === defaultEvents) && (
        <div style={{ padding: '12px', textAlign: 'center', borderTop: '1px solid var(--border, #2a2a3e)' }}>
          <button
            onClick={handleLoadMore}
            disabled={loading}
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '12px',
              color: loading ? 'var(--text-muted, #888)' : 'var(--gold, #f5c518)',
              background: 'rgba(245,197,24,0.08)',
              border: '1px solid rgba(245,197,24,0.2)',
              borderRadius: '8px',
              padding: '8px 20px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              letterSpacing: '0.05em',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'rgba(245,197,24,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,197,24,0.08)'; }}
          >
            {loading ? 'Loading...' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  );
}

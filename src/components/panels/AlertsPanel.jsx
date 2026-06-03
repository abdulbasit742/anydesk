import { useState } from 'react';

const TYPE_CONFIG = {
  error: { color: 'var(--red, #ff4757)', bg: 'rgba(255,71,87,0.10)', icon: '✕', label: 'Error' },
  warning: { color: '#f5a623', bg: 'rgba(245,166,35,0.10)', icon: '⚠', label: 'Warning' },
  info: { color: 'var(--gold, #f5c518)', bg: 'rgba(245,197,24,0.10)', icon: 'ℹ', label: 'Info' },
  success: { color: 'var(--teal, #00d4aa)', bg: 'rgba(0,212,170,0.10)', icon: '✓', label: 'Success' },
};

function AlertItem({ alert, onDismiss }) {
  const [dismissed, setDismissed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const cfg = TYPE_CONFIG[alert.type] || TYPE_CONFIG.info;

  const handleDismiss = () => {
    setDismissed(true);
    setTimeout(() => onDismiss(alert.id), 280);
  };

  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      padding: '14px 16px',
      borderRadius: '10px',
      background: hovered ? cfg.bg.replace('0.10', '0.15') : cfg.bg,
      border: `1px solid ${cfg.color}33`,
      marginBottom: '8px',
      opacity: dismissed ? 0 : 1,
      transform: dismissed ? 'translateX(20px) scale(0.97)' : 'translateX(0) scale(1)',
      transition: 'opacity 0.28s ease, transform 0.28s ease, background 0.2s ease',
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: `${cfg.color}22`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        color: cfg.color,
        flexShrink: 0,
        fontWeight: '700',
      }}>
        {cfg.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '10px',
            fontWeight: '600',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: cfg.color,
          }}>
            {cfg.label}
          </span>
          <span style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--text, #f0f0f0)',
          }}>
            {alert.title}
          </span>
        </div>
        <p style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '12px',
          color: 'var(--text-muted, #aaa)',
          margin: '0 0 8px 0',
          lineHeight: 1.5,
        }}>
          {alert.body}
        </p>
        {alert.action && (
          <button
            onClick={alert.action.onClick}
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              color: cfg.color,
              background: `${cfg.color}15`,
              border: `1px solid ${cfg.color}44`,
              borderRadius: '6px',
              padding: '4px 12px',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = `${cfg.color}28`}
            onMouseLeave={e => e.currentTarget.style.background = `${cfg.color}15`}
          >
            {alert.action.label}
          </button>
        )}
      </div>
      <button
        onClick={handleDismiss}
        title="Dismiss"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-muted, #888)',
          fontSize: '16px',
          lineHeight: 1,
          padding: '2px 6px',
          borderRadius: '4px',
          flexShrink: 0,
          alignSelf: 'flex-start',
          transition: 'color 0.15s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text, #f0f0f0)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted, #888)'}
      >
        ×
      </button>
    </div>
  );
}

const defaultAlerts = [
  { id: 1, type: 'error', title: 'Service Down', body: 'API endpoint /v2/predict is not responding. Uptime: 0%.' },
  { id: 2, type: 'warning', title: 'High Memory Usage', body: 'Worker node 3 is at 91% memory. Consider scaling.', action: { label: 'Scale Now', onClick: () => {} } },
  { id: 3, type: 'info', title: 'Model Update Available', body: 'Version 3.2.1 brings 14% accuracy improvement.', action: { label: 'View Changelog', onClick: () => {} } },
];

export default function AlertsPanel({ alerts: propAlerts = [] }) {
  const [alerts, setAlerts] = useState(propAlerts.length > 0 ? propAlerts : defaultAlerts);
  const dismissOne = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const dismissAll = () => {
    setTimeout(() => setAlerts([]), 300);
  };

  return (
    <div style={{
      background: 'var(--surface, #1a1a2e)',
      border: '1px solid var(--border, #2a2a3e)',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border, #2a2a3e)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: '600', color: 'var(--text, #f0f0f0)' }}>
            Alerts
          </span>
          {alerts.length > 0 && (
            <span style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              background: 'var(--red, #ff4757)',
              color: '#fff',
              borderRadius: '20px',
              padding: '2px 7px',
              fontWeight: '700',
            }}>
              {alerts.length}
            </span>
          )}
        </div>
        {alerts.length > 0 && (
          <button
            onClick={dismissAll}
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              color: 'var(--text-muted, #888)',
              background: 'none',
              border: '1px solid var(--border, #2a2a3e)',
              borderRadius: '6px',
              padding: '4px 10px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--red, #ff4757)'; e.currentTarget.style.borderColor = 'var(--red, #ff4757)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted, #888)'; e.currentTarget.style.borderColor = 'var(--border, #2a2a3e)'; }}
          >
            Dismiss all
          </button>
        )}
      </div>
      <div style={{ padding: '12px' }}>
        {alerts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            animation: 'fadeIn 0.4s ease',
          }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>✅</div>
            <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', color: 'var(--text, #f0f0f0)', margin: '0 0 6px 0' }}>
              All clear
            </p>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'var(--text-muted, #888)', margin: 0 }}>
              No active alerts at this time
            </p>
          </div>
        ) : (
          alerts.map(alert => (
            <AlertItem key={alert.id} alert={alert} onDismiss={dismissOne} />
          ))
        )}
      </div>
    </div>
  );
}

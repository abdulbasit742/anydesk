import { useState } from 'react';

function ActionItem({ action, index }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const color = action.color || 'var(--gold, #f5c518)';

  return (
    <button
      onClick={action.onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        width: '100%',
        padding: '12px 14px',
        background: hovered ? `${color}12` : 'transparent',
        border: `1px solid ${hovered ? color + '44' : 'var(--border, #2a2a3e)'}`,
        borderRadius: '10px',
        cursor: 'pointer',
        textAlign: 'left',
        transform: pressed ? 'scale(0.98)' : 'scale(1)',
        transition: 'all 0.18s ease',
        marginBottom: index > 0 ? 0 : 0,
      }}
    >
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        background: `${color}18`,
        color,
        flexShrink: 0,
        transition: 'background 0.18s ease',
      }}>
        {action.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '13px',
          fontWeight: '600',
          color: hovered ? color : 'var(--text, #f0f0f0)',
          marginBottom: '2px',
          transition: 'color 0.18s ease',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {action.label}
        </div>
        {action.sub && (
          <div style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '11px',
            color: 'var(--text-muted, #888)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {action.sub}
          </div>
        )}
      </div>
      <span style={{
        fontSize: '16px',
        color: hovered ? color : 'var(--text-muted, #888)',
        opacity: hovered ? 1 : 0.4,
        transition: 'all 0.18s ease',
        transform: hovered ? 'translateX(2px)' : 'translateX(0)',
      }}>
        →
      </span>
    </button>
  );
}

const defaultActions = [
  { icon: '🚀', label: 'Deploy Model', sub: 'Push to production', color: 'var(--teal, #00d4aa)', onClick: () => {} },
  { icon: '📊', label: 'Run Analysis', sub: 'Generate full report', color: 'var(--gold, #f5c518)', onClick: () => {} },
  { icon: '⚙️', label: 'Configure Pipeline', sub: 'Edit workflow settings', color: '#a78bfa', onClick: () => {} },
  { icon: '📥', label: 'Export Data', sub: 'Download as CSV/JSON', color: '#38bdf8', onClick: () => {} },
  { icon: '🔄', label: 'Sync Sources', sub: 'Pull latest changes', color: '#fb923c', onClick: () => {} },
];

export default function QuickActions({ actions = [] }) {
  const data = actions.length > 0 ? actions : defaultActions;

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
      }}>
        <span style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '14px',
          fontWeight: '600',
          color: 'var(--text, #f0f0f0)',
        }}>
          Quick Actions
        </span>
      </div>
      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {data.map((action, i) => (
          <ActionItem key={action.label ?? i} action={action} index={i} />
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';

export default function Tabs({
  tabs = [],
  activeTab,
  onChange,
  variant = 'underline',
  style: extraStyle = {},
}) {
  const [internalActive, setInternalActive] = useState(tabs[0]?.id);
  const current = activeTab !== undefined ? activeTab : internalActive;

  const handleChange = (id) => {
    setInternalActive(id);
    onChange?.(id);
  };

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: variant === 'pills' ? '4px' : variant === 'cards' ? '4px' : '0',
    borderBottom: variant === 'underline' ? '1px solid var(--border, #2a2a3a)' : 'none',
    padding: variant === 'pills' ? '4px' : variant === 'cards' ? '4px' : '0',
    background: variant === 'pills' ? 'rgba(255,255,255,0.04)' : 'transparent',
    borderRadius: variant === 'pills' ? '10px' : variant === 'cards' ? '10px' : '0',
    ...extraStyle,
  };

  const getTabStyle = (tab) => {
    const isActive = tab.id === current;
    const base = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontFamily: 'DM Mono, monospace',
      fontSize: '13px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.16s ease',
      whiteSpace: 'nowrap',
      border: 'none',
      outline: 'none',
      userSelect: 'none',
    };

    if (variant === 'underline') {
      return {
        ...base,
        padding: '10px 14px',
        background: 'transparent',
        color: isActive ? 'var(--gold, #f5c518)' : 'var(--text-muted, #6b6b8a)',
        borderBottom: isActive ? '2px solid var(--gold, #f5c518)' : '2px solid transparent',
        marginBottom: '-1px',
        borderRadius: 0,
      };
    }
    if (variant === 'pills') {
      return {
        ...base,
        padding: '7px 14px',
        background: isActive ? 'var(--gold, #f5c518)' : 'transparent',
        color: isActive ? '#0a0a0f' : 'var(--text-muted, #6b6b8a)',
        borderRadius: '8px',
      };
    }
    if (variant === 'cards') {
      return {
        ...base,
        padding: '8px 16px',
        background: isActive ? 'var(--surface, #13131f)' : 'transparent',
        color: isActive ? 'var(--text-primary, #e8e8f0)' : 'var(--text-muted, #6b6b8a)',
        border: isActive ? '1px solid var(--border, #2a2a3a)' : '1px solid transparent',
        borderRadius: '8px',
        boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
      };
    }
    return base;
  };

  return (
    <div style={containerStyle} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={tab.id === current}
          style={getTabStyle(tab)}
          onClick={() => handleChange(tab.id)}
          onMouseEnter={(e) => {
            if (tab.id !== current) {
              e.currentTarget.style.color = 'var(--text-primary, #e8e8f0)';
            }
          }}
          onMouseLeave={(e) => {
            if (tab.id !== current) {
              e.currentTarget.style.color = 'var(--text-muted, #6b6b8a)';
            }
          }}
        >
          {tab.icon && <span style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

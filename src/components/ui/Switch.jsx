import { useId } from 'react';

const switchCss = `
  @keyframes switch-thumb {
    from { transform: translateX(0); }
  }
`;

function injectSwitchStyles() {
  if (typeof document !== 'undefined' && !document.getElementById('bsp-switch-styles')) {
    const el = document.createElement('style');
    el.id = 'bsp-switch-styles';
    el.textContent = switchCss;
    document.head.appendChild(el);
  }
}

export default function Switch({
  checked = false,
  onChange,
  label,
  disabled = false,
  id,
  style: extraStyle = {},
}) {
  injectSwitchStyles();
  const generatedId = useId();
  const switchId = id || generatedId;

  const trackBg = checked
    ? 'var(--gold, #f5c518)'
    : 'rgba(255,255,255,0.1)';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
        ...extraStyle,
      }}
      onClick={() => !disabled && onChange?.(!checked)}
    >
      <span
        role="switch"
        aria-checked={checked}
        id={switchId}
        style={{
          display: 'block',
          width: 40,
          height: 22,
          borderRadius: 11,
          background: trackBg,
          position: 'relative',
          transition: 'background 0.22s ease',
          flexShrink: 0,
          border: checked ? '1px solid rgba(0,0,0,0.15)' : '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <span
          style={{
            display: 'block',
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: checked ? '#0a0a0f' : '#e8e8f0',
            position: 'absolute',
            top: '50%',
            transform: `translateX(${checked ? '20px' : '2px'}) translateY(-50%)`,
            transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1), background 0.22s ease',
            boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
          }}
        />
      </span>

      {label && (
        <label
          htmlFor={switchId}
          style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '13px',
            color: 'var(--text-primary, #e8e8f0)',
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        >
          {label}
        </label>
      )}
    </div>
  );
}

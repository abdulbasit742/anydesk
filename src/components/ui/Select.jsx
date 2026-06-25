import { useId } from 'react';

const selectStyle = `
  .bsp-select:focus {
    outline: none;
    border-color: var(--gold, #f5c518) !important;
    box-shadow: 0 0 0 2px rgba(245,197,24,0.18) !important;
  }
  .bsp-select option {
    background: #13131f;
    color: #e8e8f0;
  }
`;

function injectSelectStyles() {
  if (typeof document !== 'undefined' && !document.getElementById('bsp-select-styles')) {
    const el = document.createElement('style');
    el.id = 'bsp-select-styles';
    el.textContent = selectStyle;
    document.head.appendChild(el);
  }
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ pointerEvents: 'none' }}>
      <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Select({
  label,
  options = [],
  placeholder,
  error,
  value,
  defaultValue,
  onChange,
  disabled = false,
  required = false,
  id,
  name,
  style: extraStyle = {},
  ...props
}) {
  injectSelectStyles();
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', ...extraStyle }}>
      {label && (
        <label
          htmlFor={selectId}
          style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-muted, #6b6b8a)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {label}{required && <span style={{ color: 'var(--red, #e53e3e)', marginLeft: 3 }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative', width: '100%' }}>
        <select
          id={selectId}
          name={name}
          className="bsp-select"
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          required={required}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${error ? 'var(--red, #e53e3e)' : 'var(--border, #2a2a3a)'}`,
            borderRadius: '8px',
            padding: '9px 36px 9px 12px',
            fontSize: '13px',
            fontFamily: 'DM Mono, monospace',
            color: value || defaultValue ? 'var(--text-primary, #e8e8f0)' : 'var(--text-muted, #6b6b8a)',
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            outline: 'none',
          }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const optValue = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={optValue} value={optValue}>
                {optLabel}
              </option>
            );
          })}
        </select>

        <span
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted, #6b6b8a)',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <ChevronIcon />
        </span>
      </div>

      {error && (
        <div
          style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '11px',
            color: 'var(--red, #e53e3e)',
            lineHeight: 1.5,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

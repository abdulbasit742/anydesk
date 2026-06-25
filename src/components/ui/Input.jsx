import { useId } from 'react';

const inputGlobalStyle = `
  .bsp-input:focus {
    outline: none;
    border-color: var(--gold, #f5c518) !important;
    box-shadow: 0 0 0 2px rgba(245,197,24,0.18) !important;
  }
  .bsp-input::placeholder {
    color: var(--text-muted, #6b6b8a);
    opacity: 1;
  }
  .bsp-input::-webkit-inner-spin-button,
  .bsp-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
`;

function injectInputStyles() {
  if (typeof document !== 'undefined' && !document.getElementById('bsp-input-styles')) {
    const el = document.createElement('style');
    el.id = 'bsp-input-styles';
    el.textContent = inputGlobalStyle;
    document.head.appendChild(el);
  }
}

export default function Input({
  label,
  placeholder,
  error,
  hint,
  leftIcon,
  rightIcon,
  prefix,
  suffix,
  value,
  defaultValue,
  onChange,
  type = 'text',
  disabled = false,
  required = false,
  id,
  name,
  style: extraStyle = {},
  inputStyle: extraInputStyle = {},
  autoComplete,
  ...props
}) {
  injectInputStyles();
  const generatedId = useId();
  const inputId = id || generatedId;
  const hasLeft = leftIcon || prefix;
  const hasRight = rightIcon || suffix;

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%',
    ...extraStyle,
  };

  const labelStyle = {
    fontFamily: 'DM Mono, monospace',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-muted, #6b6b8a)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  const wrapStyle = {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.03)',
    border: `1px solid ${error ? 'var(--red, #e53e3e)' : 'var(--border, #2a2a3a)'}`,
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
    opacity: disabled ? 0.5 : 1,
  };

  const adornStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0 10px',
    color: 'var(--text-muted, #6b6b8a)',
    fontSize: '13px',
    fontFamily: 'DM Mono, monospace',
    flexShrink: 0,
    whiteSpace: 'nowrap',
    background: 'rgba(0,0,0,0.15)',
    alignSelf: 'stretch',
    borderRight: prefix ? '1px solid var(--border, #2a2a3a)' : undefined,
    borderLeft: suffix ? '1px solid var(--border, #2a2a3a)' : undefined,
  };

  const inputBaseStyle = {
    flex: 1,
    background: 'transparent',
    border: 'none',
    padding: `9px ${hasRight ? '0' : '12px'} 9px ${hasLeft ? '0' : '12px'}`,
    fontSize: '13px',
    fontFamily: 'DM Mono, monospace',
    color: 'var(--text-primary, #e8e8f0)',
    width: '100%',
    minWidth: 0,
    ...extraInputStyle,
  };

  const iconStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    color: 'var(--text-muted, #6b6b8a)',
    fontSize: '15px',
    flexShrink: 0,
  };

  return (
    <div style={containerStyle}>
      {label && (
        <label htmlFor={inputId} style={labelStyle}>
          {label}
          {required && <span style={{ color: 'var(--red, #e53e3e)' }}>*</span>}
        </label>
      )}

      <div style={wrapStyle}>
        {prefix && <div style={adornStyle}>{prefix}</div>}
        {leftIcon && !prefix && <div style={iconStyle}>{leftIcon}</div>}

        <input
          id={inputId}
          name={name}
          type={type}
          className="bsp-input"
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          style={inputBaseStyle}
          {...props}
        />

        {rightIcon && !suffix && <div style={iconStyle}>{rightIcon}</div>}
        {suffix && <div style={{ ...adornStyle, borderRight: 'none', borderLeft: '1px solid var(--border, #2a2a3a)' }}>{suffix}</div>}
      </div>

      {(error || hint) && (
        <div
          style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '11px',
            color: error ? 'var(--red, #e53e3e)' : 'var(--text-muted, #6b6b8a)',
            lineHeight: 1.5,
          }}
        >
          {error || hint}
        </div>
      )}
    </div>
  );
}

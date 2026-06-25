import { useRef, useState, useId } from 'react';

const taStyle = `
  .bsp-textarea:focus {
    outline: none;
    border-color: var(--gold, #f5c518) !important;
    box-shadow: 0 0 0 2px rgba(245,197,24,0.18) !important;
  }
  .bsp-textarea::placeholder {
    color: var(--text-muted, #6b6b8a);
    opacity: 1;
  }
  .bsp-textarea {
    resize: vertical;
  }
  .bsp-textarea.no-resize {
    resize: none;
  }
`;

function injectTaStyles() {
  if (typeof document !== 'undefined' && !document.getElementById('bsp-ta-styles')) {
    const el = document.createElement('style');
    el.id = 'bsp-ta-styles';
    el.textContent = taStyle;
    document.head.appendChild(el);
  }
}

export default function Textarea({
  label,
  placeholder,
  rows = 4,
  autoResize = false,
  maxLength,
  value,
  defaultValue,
  onChange,
  disabled = false,
  required = false,
  error,
  hint,
  id,
  name,
  style: extraStyle = {},
  ...props
}) {
  injectTaStyles();
  const ref = useRef(null);
  const generatedId = useId();
  const inputId = id || generatedId;

  const [localCharCount, setLocalCharCount] = useState(
    value?.length || defaultValue?.length || 0
  );
  const charCount = value !== undefined ? value.length : localCharCount;

  const handleChange = (e) => {
    if (autoResize && ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
    setLocalCharCount(e.target.value.length);
    onChange && onChange(e);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', ...extraStyle }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label
            htmlFor={inputId}
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
          {maxLength != null && (
            <span
              style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '11px',
                color: charCount >= maxLength ? 'var(--red, #e53e3e)' : 'var(--text-muted, #6b6b8a)',
                transition: 'color 0.15s',
              }}
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}

      <textarea
        ref={ref}
        id={inputId}
        name={name}
        className={`bsp-textarea${autoResize ? ' no-resize' : ''}`}
        placeholder={placeholder}
        rows={rows}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${error ? 'var(--red, #e53e3e)' : 'var(--border, #2a2a3a)'}`,
          borderRadius: '8px',
          padding: '10px 12px',
          fontSize: '13px',
          fontFamily: 'DM Mono, monospace',
          color: 'var(--text-primary, #e8e8f0)',
          width: '100%',
          lineHeight: 1.6,
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          boxSizing: 'border-box',
          opacity: disabled ? 0.5 : 1,
          minHeight: `${rows * 22 + 20}px`,
        }}
        {...props}
      />

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

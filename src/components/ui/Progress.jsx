import { useEffect, useRef, useState } from 'react';

const progressStyle = `
  @keyframes progress-stripe {
    from { background-position: 0 0; }
    to   { background-position: 40px 0; }
  }
  @keyframes progress-fill {
    from { width: 0%; }
  }
`;

function injectProgressStyles() {
  if (typeof document !== 'undefined' && !document.getElementById('bsp-progress-styles')) {
    const el = document.createElement('style');
    el.id = 'bsp-progress-styles';
    el.textContent = progressStyle;
    document.head.appendChild(el);
  }
}

export default function Progress({
  value = 0,
  color,
  height = 8,
  label,
  striped = false,
  gradient = true,
  animate = true,
  showValue = false,
  style: extraStyle = {},
}) {
  injectProgressStyles();
  const clampedValue = Math.min(100, Math.max(0, value));
  const [displayed, setDisplayed] = useState(animate ? 0 : clampedValue);
  const rafRef = useRef(null);
  const displayedRef = useRef(displayed);

  useEffect(() => {
    displayedRef.current = displayed;
  }, [displayed]);

  if (!animate && displayed !== clampedValue) {
    setDisplayed(clampedValue);
  }

  useEffect(() => {
    if (!animate) return;
    const start = displayedRef.current;
    const end = clampedValue;
    const duration = 600;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(start + (end - start) * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [clampedValue, animate]);

  const fillBg = color
    ? color
    : gradient
    ? 'linear-gradient(90deg, var(--gold, #f5c518) 0%, var(--teal, #38b2ac) 100%)'
    : 'var(--gold, #f5c518)';

  const stripedBg = striped
    ? `repeating-linear-gradient(
        45deg,
        rgba(255,255,255,0.12) 0px,
        rgba(255,255,255,0.12) 10px,
        transparent 10px,
        transparent 20px
      )`
    : undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...extraStyle }}>
      {(label || showValue) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {label && (
            <span
              style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '12px',
                color: 'var(--text-muted, #6b6b8a)',
                fontWeight: 600,
                letterSpacing: '0.04em',
              }}
            >
              {label}
            </span>
          )}
          {showValue && (
            <span
              style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '11px',
                color: 'var(--text-muted, #6b6b8a)',
              }}
            >
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      )}

      <div
        style={{
          width: '100%',
          height,
          borderRadius: height / 2,
          background: 'rgba(255,255,255,0.07)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${displayed}%`,
            background: fillBg,
            borderRadius: height / 2,
            position: 'relative',
            transition: animate ? 'none' : 'width 0.4s ease',
          }}
        >
          {striped && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: stripedBg,
                backgroundSize: '40px 40px',
                animation: 'progress-stripe 1s linear infinite',
                borderRadius: 'inherit',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

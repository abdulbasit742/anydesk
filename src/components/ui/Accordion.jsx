import { useState, useRef, useEffect } from 'react';

const accordionStyle = `
  @keyframes acc-expand {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;

function injectAccordionStyles() {
  if (typeof document !== 'undefined' && !document.getElementById('bsp-accordion-styles')) {
    const el = document.createElement('style');
    el.id = 'bsp-accordion-styles';
    el.textContent = accordionStyle;
    document.head.appendChild(el);
  }
}

function AccordionItem({ title, content, isOpen, onToggle, isLast }) {
  const bodyRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) {
      setHeight(isOpen ? bodyRef.current.scrollHeight : 0);
    }
  }, [isOpen, content]);

  return (
    <div
      style={{
        borderBottom: isLast ? 'none' : '1px solid var(--border, #2a2a3a)',
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'Syne, sans-serif',
          fontWeight: 600,
          fontSize: '14px',
          color: isOpen ? 'var(--gold, #f5c518)' : 'var(--text-primary, #e8e8f0)',
          textAlign: 'left',
          transition: 'color 0.15s ease',
          outline: 'none',
          gap: '12px',
        }}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            transition: 'transform 0.25s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            color: isOpen ? 'var(--gold, #f5c518)' : 'var(--text-muted, #6b6b8a)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      <div
        style={{
          height: `${height}px`,
          overflow: 'hidden',
          transition: 'height 0.28s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div
          ref={bodyRef}
          style={{
            padding: '0 16px 14px 16px',
            fontFamily: 'DM Mono, monospace',
            fontSize: '13px',
            color: 'var(--text-muted, #6b6b8a)',
            lineHeight: 1.7,
            animation: isOpen ? 'acc-expand 0.2s ease' : undefined,
          }}
        >
          {content}
        </div>
      </div>
    </div>
  );
}

export default function Accordion({
  items = [],
  multiple = false,
  defaultOpen = [],
  style: extraStyle = {},
}) {
  injectAccordionStyles();
  const [openItems, setOpenItems] = useState(new Set(defaultOpen));

  const toggle = (id) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!multiple) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div
      style={{
        background: 'var(--surface, #13131f)',
        border: '1px solid var(--border, #2a2a3a)',
        borderRadius: '10px',
        overflow: 'hidden',
        ...extraStyle,
      }}
    >
      {items.map((item, i) => (
        <AccordionItem
          key={item.id ?? i}
          title={item.title}
          content={item.content}
          isOpen={openItems.has(item.id ?? i)}
          onToggle={() => toggle(item.id ?? i)}
          isLast={i === items.length - 1}
        />
      ))}
    </div>
  );
}

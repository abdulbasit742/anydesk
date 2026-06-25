// PanelGroup.jsx — Resizable panel group with drag divider
import { useState, useCallback, useRef } from 'react';

export function PanelGroup({ left, right, initialSplit = 50, direction = 'horizontal' }) {
  const [split, setSplit] = useState(initialSplit);
  const containerRef = useRef(null);
  const dragging = useRef(false);

  const handleMouseDown = useCallback((e) => {
    dragging.current = true;
    e.preventDefault();

    const onMove = (moveEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = direction === 'horizontal'
        ? ((moveEvent.clientX - rect.left) / rect.width) * 100
        : ((moveEvent.clientY - rect.top) / rect.height) * 100;
      setSplit(Math.max(20, Math.min(80, pct)));
    };

    const onUp = () => { dragging.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [direction]);

  const isH = direction === 'horizontal';

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: isH ? 'row' : 'column', height: '100%', width: '100%', overflow: 'hidden' }}>
      <div style={{ [isH ? 'width' : 'height']: `${split}%`, overflow: 'auto', flexShrink: 0 }}>{left}</div>
      <div onMouseDown={handleMouseDown} style={{ [isH ? 'width' : 'height']: 6, background: '#1e2340', cursor: isH ? 'col-resize' : 'row-resize', flexShrink: 0, transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = '#00FFAA44'} onMouseLeave={e => e.currentTarget.style.background = '#1e2340'} />
      <div style={{ flex: 1, overflow: 'auto' }}>{right}</div>
    </div>
  );
}

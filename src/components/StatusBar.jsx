import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [time, setTime] = useState(new Date());
  const [ping, setPing] = useState(12);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    const p = setInterval(() => setPing(Math.floor(Math.random() * 30) + 8), 3000);
    return () => { clearInterval(t); clearInterval(p); };
  }, []);

  const fmt = (d) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      fontSize: 10.5,
      color: 'rgba(255,255,255,0.35)',
      fontFamily: 'DM Mono, monospace',
    }}>
      <span style={{ color: '#10b981' }}>● LIVE</span>
      <span>{ping}ms</span>
      <span>{fmt(time)}</span>
    </div>
  );
}

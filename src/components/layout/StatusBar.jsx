// StatusBar.jsx — Bottom status bar with connection and sync indicators
import { useState, useEffect } from 'react';
import { getActiveWatchers } from '../../data/store/SessionWatchdog.js';

export function StatusBar() {
  const [online, setOnline] = useState(navigator.onLine);
  const [time, setTime] = useState(new Date());
  const [activeSessions, setActiveSessions] = useState(0);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline); };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setActiveSessions(getActiveWatchers().length);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dot = (color) => <span style={{ color, fontSize: 10 }}>●</span>;

  return (
    <footer style={{ height: 24, background: '#050810', borderTop: '1px solid #111a30', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 16, fontFamily: 'monospace', fontSize: 11, color: '#444', flexShrink: 0 }}>
      <span>{dot(online ? '#00FF88' : '#FF4D4D')} {online ? 'Online' : 'Offline'}</span>
      <span>|</span>
      <span>{dot('#6699FF')} {activeSessions} sessions</span>
      <span>|</span>
      <span>Bolt Studio Pro v2.0</span>
      <div style={{ flex: 1 }} />
      <span style={{ color: '#333' }}>{time.toLocaleTimeString('en-US', { hour12: false })}</span>
    </footer>
  );
}

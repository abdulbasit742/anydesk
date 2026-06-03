import React from 'react';

export function OfflineIndicator() {
  const [online, setOnline] = React.useState(navigator.onLine);
  const [showBanner, setShowBanner] = React.useState(false);

  React.useEffect(() => {
    const onOnline  = () => { setOnline(true);  setShowBanner(true); setTimeout(() => setShowBanner(false), 3000); };
    const onOffline = () => { setOnline(false); setShowBanner(true); };
    window.addEventListener('online',  onOnline);
    window.addEventListener('offline', onOffline);
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline); };
  }, []);

  if (!showBanner && online) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 60, left: '50%', transform: 'translateX(-50%)',
      background: online ? '#00FFAA22' : '#FF4D4D22',
      border: `1px solid ${online ? '#00FFAA44' : '#FF4D4D44'}`,
      borderRadius: 20, padding: '6px 16px', fontFamily: 'monospace', fontSize: 12,
      color: online ? '#00FFAA' : '#FF4D4D', zIndex: 9997,
      display: 'flex', alignItems: 'center', gap: 8,
      animation: 'fadeIn 0.2s ease',
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: online ? '#00FFAA' : '#FF4D4D', display: 'inline-block' }} />
      {online ? 'Back online' : 'No internet connection'}
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateX(-50%) translateY(8px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>
    </div>
  );
}

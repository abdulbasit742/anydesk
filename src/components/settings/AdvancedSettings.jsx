import React from 'react';

export function AdvancedSettings({ settings = {}, onChange, onResetSchema }) {
  const [resetConfirm, setResetConfirm] = React.useState(false);
  const set = (key, value) => onChange?.({ ...settings, [key]: value });

  const TOGGLES = [
    { key: 'devMode',        label: 'Developer mode',         sub: 'Show raw state, IDs, and debug panels' },
    { key: 'telemetry',      label: 'Usage telemetry',        sub: 'Send anonymous crash/performance data' },
    { key: 'verboseErrors',  label: 'Verbose error messages', sub: 'Display full stack traces in UI' },
    { key: 'mockLatency',    label: 'Simulate network latency', sub: 'Add realistic delays to platform calls' },
    { key: 'interceptFetch', label: 'Mock API intercept',     sub: 'Route all fetch calls through MockFetch' },
  ];

  return (
    <div style={{ fontFamily: 'monospace' }}>
      <div style={{ color: '#888', fontSize: 11, marginBottom: 16 }}>ADVANCED OPTIONS</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
        {TOGGLES.map(t => (
          <div key={t.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: '#ccc', fontSize: 13 }}>{t.label}</div>
              <div style={{ color: '#555', fontSize: 11 }}>{t.sub}</div>
            </div>
            <label style={{ cursor: 'pointer' }}>
              <input type="checkbox" checked={!!settings[t.key]} onChange={e => set(t.key, e.target.checked)} style={{ display: 'none' }} />
              <div style={{ width: 36, height: 20, background: settings[t.key] ? '#00FFAA' : '#1e2340', borderRadius: 10, position: 'relative', transition: '0.2s' }}>
                <div style={{ position: 'absolute', top: 3, left: settings[t.key] ? 18 : 3, width: 14, height: 14, borderRadius: '50%', background: settings[t.key] ? '#000' : '#555', transition: '0.2s' }} />
              </div>
            </label>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #1e2340', paddingTop: 16 }}>
        <div style={{ color: '#FF4D4D', fontSize: 11, marginBottom: 10 }}>DANGER ZONE</div>
        {!resetConfirm ? (
          <button onClick={() => setResetConfirm(true)} style={{ background: '#FF4D4D11', border: '1px solid #FF4D4D44', borderRadius: 7, color: '#FF4D4D', fontSize: 12, padding: '8px 16px', cursor: 'pointer' }}>
            Reset schema to defaults
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ color: '#888', fontSize: 12 }}>Are you sure? All data will be lost.</span>
            <button onClick={() => { onResetSchema?.(); setResetConfirm(false); }} style={{ background: '#FF4D4D', border: 'none', borderRadius: 6, color: '#fff', fontSize: 11, padding: '6px 14px', cursor: 'pointer' }}>Yes, Reset</button>
            <button onClick={() => setResetConfirm(false)} style={{ background: 'none', border: '1px solid #1e2340', borderRadius: 6, color: '#888', fontSize: 11, padding: '6px 14px', cursor: 'pointer' }}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

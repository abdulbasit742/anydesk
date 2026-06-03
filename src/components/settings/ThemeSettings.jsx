// ThemeSettings.jsx — Color accent, font size, animation, density controls
const ACCENT_PRESETS = [
  { name: 'Neon Green', value: '#00FFAA' },
  { name: 'Cyber Blue',  value: '#00AAFF' },
  { name: 'Hot Pink',    value: '#FF4D8F' },
  { name: 'Solar Gold',  value: '#FFB800' },
  { name: 'Plasma Violet', value: '#AA44FF' },
];

const DENSITIES = ['compact', 'normal', 'relaxed'];

export function ThemeSettings({ settings = {}, onChange }) {
  const set = (key, value) => onChange?.({ ...settings, [key]: value });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'monospace' }}>
      <div>
        <label style={{ color: '#888', fontSize: 11, display: 'block', marginBottom: 10 }}>ACCENT COLOR</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {ACCENT_PRESETS.map(p => (
            <button key={p.value} onClick={() => set('accent', p.value)} title={p.name} style={{
              width: 32, height: 32, borderRadius: '50%', background: p.value, border: settings.accent === p.value ? `3px solid #fff` : '3px solid transparent',
              cursor: 'pointer', outline: 'none',
            }} />
          ))}
          <input type="color" value={settings.accent || '#00FFAA'} onChange={e => set('accent', e.target.value)}
            style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #1e2340', background: 'none', cursor: 'pointer', padding: 0 }} />
        </div>
      </div>

      <div>
        <label style={{ color: '#888', fontSize: 11, display: 'block', marginBottom: 6 }}>FONT SIZE — {settings.fontSize || 13}px</label>
        <input type="range" min={11} max={17} value={settings.fontSize || 13} onChange={e => set('fontSize', parseInt(e.target.value))}
          style={{ width: '100%', accentColor: settings.accent || '#00FFAA' }} />
      </div>

      <div>
        <label style={{ color: '#888', fontSize: 11, display: 'block', marginBottom: 8 }}>DENSITY</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {DENSITIES.map(d => (
            <button key={d} onClick={() => set('density', d)} style={{
              flex: 1, background: settings.density === d ? `${settings.accent || '#00FFAA'}22` : 'none',
              border: `1px solid ${settings.density === d ? settings.accent || '#00FFAA' : '#1e2340'}`,
              borderRadius: 7, color: settings.density === d ? settings.accent || '#00FFAA' : '#888',
              fontSize: 12, padding: '7px 0', cursor: 'pointer', textTransform: 'capitalize',
            }}>{d}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ color: '#ccc', fontSize: 13 }}>Enable animations</div>
          <div style={{ color: '#555', fontSize: 11 }}>Canvas particles, transitions, effects</div>
        </div>
        <label style={{ cursor: 'pointer' }}>
          <input type="checkbox" checked={settings.animations !== false} onChange={e => set('animations', e.target.checked)} style={{ display: 'none' }} />
          <div style={{ width: 36, height: 20, background: settings.animations !== false ? settings.accent || '#00FFAA' : '#1e2340', borderRadius: 10, position: 'relative', transition: '0.2s' }}>
            <div style={{ position: 'absolute', top: 3, left: settings.animations !== false ? 18 : 3, width: 14, height: 14, borderRadius: '50%', background: settings.animations !== false ? '#000' : '#555', transition: '0.2s' }} />
          </div>
        </label>
      </div>
    </div>
  );
}

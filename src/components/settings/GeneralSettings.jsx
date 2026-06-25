// GeneralSettings.jsx — App name, language, timezone, startup preferences
const TIMEZONES = ['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Kolkata'];
const LANGUAGES = [{ code: 'en', label: 'English' }, { code: 'de', label: 'Deutsch' }, { code: 'ja', label: '日本語' }];

export function GeneralSettings({ settings = {}, onChange }) {
  const set = (key, value) => onChange?.({ ...settings, [key]: value });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'monospace' }}>
      <div>
        <label style={{ color: '#888', fontSize: 11, display: 'block', marginBottom: 6 }}>WORKSPACE NAME</label>
        <input value={settings.workspaceName || 'Bolt Studio Pro'} onChange={e => set('workspaceName', e.target.value)}
          style={{ width: '100%', background: '#080c14', border: '1px solid #1e2340', borderRadius: 7, color: '#ccc', fontSize: 13, padding: '8px 12px', boxSizing: 'border-box' }} />
      </div>
      <div>
        <label style={{ color: '#888', fontSize: 11, display: 'block', marginBottom: 6 }}>LANGUAGE</label>
        <select value={settings.language || 'en'} onChange={e => set('language', e.target.value)}
          style={{ width: '100%', background: '#080c14', border: '1px solid #1e2340', borderRadius: 7, color: '#ccc', fontSize: 13, padding: '8px 12px' }}>
          {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>
      </div>
      <div>
        <label style={{ color: '#888', fontSize: 11, display: 'block', marginBottom: 6 }}>TIMEZONE</label>
        <select value={settings.timezone || 'UTC'} onChange={e => set('timezone', e.target.value)}
          style={{ width: '100%', background: '#080c14', border: '1px solid #1e2340', borderRadius: 7, color: '#ccc', fontSize: 13, padding: '8px 12px' }}>
          {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ color: '#ccc', fontSize: 13 }}>Launch on startup</div>
          <div style={{ color: '#555', fontSize: 11 }}>Open automatically when you log in</div>
        </div>
        <label style={{ cursor: 'pointer' }}>
          <input type="checkbox" checked={!!settings.launchOnStartup} onChange={e => set('launchOnStartup', e.target.checked)} style={{ display: 'none' }} />
          <div style={{ width: 36, height: 20, background: settings.launchOnStartup ? '#00FFAA' : '#1e2340', borderRadius: 10, position: 'relative', transition: '0.2s' }}>
            <div style={{ position: 'absolute', top: 3, left: settings.launchOnStartup ? 18 : 3, width: 14, height: 14, borderRadius: '50%', background: settings.launchOnStartup ? '#000' : '#555', transition: '0.2s' }} />
          </div>
        </label>
      </div>
    </div>
  );
}

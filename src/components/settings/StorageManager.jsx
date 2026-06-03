// StorageManager.jsx — localStorage usage, IndexedDB info, cache controls
import { useState } from 'react';
import { clearHandlers, getHandlerCount } from '../../lib/adapters/MockFetch.js';
import { clearState } from '../../data/store/PersistEngine.js';

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getLocalStorageSize() {
  let total = 0;
  for (let key in localStorage) {
    if (!Object.prototype.hasOwnProperty.call(localStorage, key)) continue;
    total += (localStorage.getItem(key)?.length || 0) * 2;
  }
  return total;
}

export function StorageManager() {
  const [stats, setStats] = useState(() => ({
    localStorage: getLocalStorageSize(),
    lsKeys: Object.keys(localStorage).length,
    mockHandlers: getHandlerCount(),
    ts: Date.now(),
  }));
  const [clearing, setClearing] = useState(false);

  const refresh = () => {
    setStats({
      localStorage: getLocalStorageSize(),
      lsKeys: Object.keys(localStorage).length,
      mockHandlers: getHandlerCount(),
      ts: Date.now(),
    });
  };

  const handleClearCache = () => {
    clearHandlers();
    refresh();
  };

  const handleClearState = async () => {
    setClearing(true);
    await clearState();
    refresh();
    setClearing(false);
  };

  return (
    <div style={{ fontFamily: 'monospace' }}>
      <div style={{ color: '#888', fontSize: 11, marginBottom: 12 }}>STORAGE USAGE</div>

      {stats && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {[
            { label: 'localStorage', value: formatBytes(stats.localStorage), sub: `${stats.lsKeys} keys` },
            { label: 'Mock handlers', value: `${stats.mockHandlers}`, sub: 'active intercepts' },
          ].map(row => (
            <div key={row.label} style={{ background: '#080c14', border: '1px solid #1e2340', borderRadius: 8, padding: '10px 14px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#ccc', fontSize: 13 }}>{row.label}</div>
                <div style={{ color: '#555', fontSize: 11 }}>{row.sub}</div>
              </div>
              <div style={{ color: '#00FFAA', fontSize: 14, alignSelf: 'center' }}>{row.value}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button onClick={handleClearCache} style={{ background: 'none', border: '1px solid #1e2340', borderRadius: 7, color: '#888', fontSize: 12, padding: '8px 16px', cursor: 'pointer', textAlign: 'left' }}>
          Clear mock handler cache
        </button>
        <button onClick={handleClearState} disabled={clearing} style={{ background: '#FF4D4D11', border: '1px solid #FF4D4D44', borderRadius: 7, color: '#FF4D4D', fontSize: 12, padding: '8px 16px', cursor: 'pointer', textAlign: 'left' }}>
          {clearing ? 'Clearing...' : 'Clear all persisted state'}
        </button>
        <button onClick={refresh} style={{ background: 'none', border: '1px solid #1e2340', borderRadius: 7, color: '#555', fontSize: 12, padding: '8px 16px', cursor: 'pointer', textAlign: 'left' }}>
          Refresh statistics
        </button>
      </div>
    </div>
  );
}

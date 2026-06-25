// RecipientSelector.jsx — Select target accounts for broadcast
import { usePlatformResolver } from '../../hooks/usePlatformResolver.js';

function AccountRow({ account, selected, onToggle }) {
  const platform = usePlatformResolver(account.platform);
  return (
    <div onClick={() => onToggle(account.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', cursor: 'pointer', background: selected ? '#0d1520' : 'transparent', borderRadius: 8, transition: 'background 0.15s' }}>
      <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${selected ? '#00FFAA' : '#2a2e4e'}`, background: selected ? '#00FFAA' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#080c14', flexShrink: 0 }}>
        {selected && '✓'}
      </div>
      <span style={{ fontSize: 14 }}>{platform.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: '#ccc', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{account.label}</div>
        <div style={{ color: '#444', fontSize: 10 }}>{platform.label}</div>
      </div>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: account.active ? '#00FF88' : '#333', flexShrink: 0 }} />
    </div>
  );
}

export function RecipientSelector({ accounts = [], selected = [], onChange }) {
  const activeAccounts = accounts.filter(a => a.active);
  const toggle = (id) => onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
  const selectAll = () => onChange(activeAccounts.map(a => a.id));
  const clearAll = () => onChange([]);

  return (
    <div style={{ background: '#0d1020', border: '1px solid #1e2340', borderRadius: 12, overflow: 'hidden', fontFamily: 'monospace' }}>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e2340', display: 'flex', alignItems: 'center' }}>
        <span style={{ color: '#555', fontSize: 12 }}>RECIPIENTS</span>
        <div style={{ flex: 1 }} />
        <button onClick={selectAll} style={{ background: 'transparent', border: 'none', color: '#00FFAA', fontSize: 11, cursor: 'pointer' }}>All</button>
        <span style={{ color: '#333', margin: '0 6px' }}>·</span>
        <button onClick={clearAll} style={{ background: 'transparent', border: 'none', color: '#555', fontSize: 11, cursor: 'pointer' }}>None</button>
      </div>
      <div style={{ padding: 8, maxHeight: 280, overflowY: 'auto' }}>
        {activeAccounts.length === 0 && <div style={{ color: '#333', fontSize: 12, padding: '20px', textAlign: 'center' }}>No active accounts</div>}
        {activeAccounts.map(a => <AccountRow key={a.id} account={a} selected={selected.includes(a.id)} onToggle={toggle} />)}
      </div>
      {selected.length > 0 && <div style={{ padding: '8px 16px', borderTop: '1px solid #1e2340', color: '#00FFAA', fontSize: 11 }}>{selected.length} recipient{selected.length !== 1 ? 's' : ''} selected</div>}
    </div>
  );
}

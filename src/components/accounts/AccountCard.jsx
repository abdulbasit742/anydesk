// AccountCard.jsx — Platform account display card
import { usePlatformResolver } from '../../hooks/usePlatformResolver.js';
import { maskByPlatform } from '../../lib/security/CredentialsMasker.js';

export function AccountCard({ account, selected, onSelect, onEdit, onDelete, onToggle }) {
  const platform = usePlatformResolver(account.platform);

  return (
    <div onClick={() => onSelect?.(account.id)} style={{ background: selected ? '#0d1520' : '#0d1020', border: `1px solid ${selected ? '#00FFAA44' : '#1e2340'}`, borderRadius: 12, padding: 16, cursor: 'pointer', position: 'relative', fontFamily: 'monospace', transition: 'border-color 0.15s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${platform.color}22`, border: `2px solid ${platform.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{platform.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#e0e0e0', fontSize: 13, fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{account.label}</div>
          <div style={{ color: platform.color, fontSize: 11 }}>{platform.label}</div>
        </div>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: account.active ? '#00FF88' : '#444' }} />
      </div>

      {account.apiKey && (
        <div style={{ background: '#080c14', borderRadius: 6, padding: '6px 10px', marginBottom: 12, fontSize: 11, color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {maskByPlatform(account.apiKey, account.platform)}
        </div>
      )}

      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={e => { e.stopPropagation(); onToggle?.(account.id); }} style={{ flex: 1, background: account.active ? '#0d3321' : '#1a1e2e', border: 'none', borderRadius: 6, color: account.active ? '#00FF88' : '#555', fontSize: 11, padding: '5px 0', cursor: 'pointer' }}>
          {account.active ? 'Active' : 'Disabled'}
        </button>
        <button onClick={e => { e.stopPropagation(); onEdit?.(account); }} style={{ background: '#1e2340', border: 'none', borderRadius: 6, color: '#888', fontSize: 11, padding: '5px 10px', cursor: 'pointer' }}>Edit</button>
        <button onClick={e => { e.stopPropagation(); onDelete?.(account.id); }} style={{ background: '#2a0a0a', border: 'none', borderRadius: 6, color: '#FF4D4D', fontSize: 11, padding: '5px 10px', cursor: 'pointer' }}>✕</button>
      </div>
    </div>
  );
}

// AccountGrid.jsx — Responsive grid of account cards
import { AccountCard } from './AccountCard.jsx';

export function AccountGrid({ accounts = [], selected = [], onSelect, onEdit, onDelete, onToggle }) {
  const toggle = (id) => {
    const next = selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id];
    onSelect?.(next);
  };

  if (!accounts.length) {
    return (
      <div style={{ textAlign: 'center', padding: 80, color: '#333', fontFamily: 'monospace' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
        <p style={{ fontSize: 14 }}>No accounts yet</p>
        <p style={{ fontSize: 12 }}>Add your first platform account to get started</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
      {accounts.map(account => (
        <AccountCard key={account.id} account={account} selected={selected.includes(account.id)} onSelect={toggle} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
      ))}
    </div>
  );
}

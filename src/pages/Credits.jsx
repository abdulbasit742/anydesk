import { useState } from 'react';

const CREDIT_HISTORY = [
  { id: 1, type: 'purchase', amount: 5000, label: 'Pro Plan - Monthly', date: '2024-01-15', icon: '💳' },
  { id: 2, type: 'spend', amount: -120, label: 'Claude API - 60k tokens', date: '2024-01-16', icon: '🤖' },
  { id: 3, type: 'spend', amount: -85, label: 'GPT-4 - 42k tokens', date: '2024-01-16', icon: '💬' },
  { id: 4, type: 'bonus', amount: 500, label: 'Referral bonus - @user42', date: '2024-01-17', icon: '🎁' },
  { id: 5, type: 'spend', amount: -340, label: 'Broadcast campaign - 200 msgs', date: '2024-01-18', icon: '📡' },
  { id: 6, type: 'purchase', amount: 2000, label: 'Credit top-up', date: '2024-01-19', icon: '💳' },
];

const balance = CREDIT_HISTORY.reduce((sum, t) => sum + t.amount, 0);

export default function Credits() {
  const [tab, setTab] = useState('history');

  return (
    <div style={{ padding: 24, color: '#e2e8f0', minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>🪙 Credits</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>Manage your credit balance, purchases, and usage history.</p>
      </div>

      {/* Balance card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(245,158,11,0.1) 100%)',
        border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: 16,
        padding: '24px 28px',
        marginBottom: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Available Balance
          </div>
          <div style={{ fontSize: 42, fontWeight: 800, color: '#fff', lineHeight: 1 }}>
            {balance.toLocaleString()}
            <span style={{ fontSize: 18, fontWeight: 400, color: 'rgba(255,255,255,0.5)', marginLeft: 6 }}>credits</span>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
            ≈ ${(balance * 0.001).toFixed(2)} USD equivalent
          </div>
        </div>
        <button style={{
          padding: '12px 24px',
          borderRadius: 10,
          border: 'none',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: '#fff',
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 600,
          boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
        }}>
          + Buy Credits
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 0 }}>
        {['history', 'packages', 'usage'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '9px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${tab === t ? '#6366f1' : 'transparent'}`,
              color: tab === t ? '#6366f1' : 'var(--muted)',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: tab === t ? 600 : 400,
              textTransform: 'capitalize',
              marginBottom: -1,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {CREDIT_HISTORY.map(tx => (
            <div key={tx.id} style={{
              background: 'var(--card)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}>
              <span style={{ fontSize: 20 }}>{tx.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{tx.label}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{tx.date}</div>
              </div>
              <span style={{
                fontSize: 15,
                fontWeight: 700,
                color: tx.amount > 0 ? '#10b981' : '#ef4444',
              }}>
                {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === 'packages' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {[
            { credits: 1000, price: 1, bonus: 0 },
            { credits: 5000, price: 4.5, bonus: 10 },
            { credits: 15000, price: 12, bonus: 25 },
            { credits: 50000, price: 35, bonus: 50 },
          ].map(pkg => (
            <div key={pkg.credits} style={{
              background: 'var(--card)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12,
              padding: 18,
              textAlign: 'center',
              cursor: 'pointer',
            }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                {(pkg.credits + pkg.credits * pkg.bonus / 100).toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 12 }}>
                credits {pkg.bonus > 0 && <span style={{ color: '#10b981' }}>+{pkg.bonus}% bonus</span>}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#6366f1', marginBottom: 12 }}>${pkg.price}</div>
              <button style={{
                width: '100%',
                padding: '8px',
                borderRadius: 7,
                border: 'none',
                background: 'rgba(99,102,241,0.2)',
                color: '#6366f1',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
              }}>Buy</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'usage' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {[
            { label: 'Claude', spend: 120, icon: '🤖' },
            { label: 'GPT-4', spend: 85, icon: '💬' },
            { label: 'Broadcasts', spend: 340, icon: '📡' },
            { label: 'Other', spend: 55, icon: '📊' },
          ].map(u => (
            <div key={u.label} style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 16 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <span>{u.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{u.label}</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#ef4444' }}>-{u.spend}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>credits spent</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

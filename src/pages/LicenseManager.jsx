import { useState } from 'react';

const LICENSES = [
  { id: 1, software: 'Datadog APM', type: 'SaaS', expiry: '2026-06-25', seatsUsed: 18, seatsTotal: 20, costPerSeat: 30, annual: 7200, risk: 'HIGH' },
  { id: 2, software: 'GitHub Enterprise', type: 'SaaS', expiry: '2026-09-01', seatsUsed: 74, seatsTotal: 100, costPerSeat: 21, annual: 25200, risk: 'LOW' },
  { id: 3, software: 'JetBrains All Products', type: 'Perpetual', expiry: '2026-07-14', seatsUsed: 12, seatsTotal: 15, costPerSeat: 65, annual: 11700, risk: 'MEDIUM' },
  { id: 4, software: 'Figma Professional', type: 'SaaS', expiry: '2026-08-20', seatsUsed: 8, seatsTotal: 10, costPerSeat: 15, annual: 1800, risk: 'LOW' },
  { id: 5, software: 'Slack Pro', type: 'SaaS', expiry: '2027-01-01', seatsUsed: 90, seatsTotal: 100, costPerSeat: 8, annual: 9600, risk: 'LOW' },
  { id: 6, software: 'Adobe Creative Cloud', type: 'SaaS', expiry: '2026-06-15', seatsUsed: 5, seatsTotal: 5, costPerSeat: 55, annual: 3300, risk: 'HIGH' },
  { id: 7, software: 'AWS Business Support', type: 'Cloud', expiry: '2026-12-31', seatsUsed: 1, seatsTotal: 1, costPerSeat: 15000, annual: 15000, risk: 'LOW' },
];

function daysUntil(dateStr) {
  return Math.ceil((new Date(dateStr) - new Date()) / 86400000);
}

function CostChart({ licenses }) {
  const max = Math.max(...licenses.map(l => l.annual));
  const w = 340, barH = 28, gap = 8, labelW = 130, barMaxW = w - labelW - 60;
  const colors = ['#22d3ee', '#a78bfa', '#f5b731', '#60a5fa', '#22d3ee', '#ef4444', '#a78bfa'];
  return (
    <svg width={w} height={licenses.length * (barH + gap) + 10}>
      {licenses.map((l, i) => {
        const barW = (l.annual / max) * barMaxW;
        const y = i * (barH + gap);
        return (
          <g key={l.id}>
            <text x={0} y={y + barH / 2 + 4} fill="#9ca3af" fontSize={11}>{l.software.slice(0, 16)}</text>
            <rect x={labelW} y={y + 2} width={barW} height={barH - 4} rx={4} fill={colors[i % colors.length] + '88'} stroke={colors[i % colors.length]} strokeWidth={1} />
            <text x={labelW + barW + 6} y={y + barH / 2 + 4} fill={colors[i % colors.length]} fontSize={11} fontWeight={700}>${(l.annual / 1000).toFixed(1)}k</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function LicenseManager() {
  const [licenses, setLicenses] = useState(LICENSES);
  const [reminders, setReminders] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newLic, setNewLic] = useState({ software: '', type: 'SaaS', expiry: '', seatsUsed: 0, seatsTotal: 1, costPerSeat: 0 });
  const totalAnnual = licenses.reduce((a, l) => a + l.annual, 0);

  const expiringCount = licenses.filter(l => daysUntil(l.expiry) <= 60).length;

  const s = {
    page: { minHeight: '100vh', background: '#0e0e16', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' },
    hero: { background: 'linear-gradient(135deg, #0e0e16 0%, #101428 60%, #180e28 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '48px 40px 36px' },
    heroTitle: { fontSize: 36, fontWeight: 800, background: 'linear-gradient(90deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
    body: { padding: '32px 40px' },
    card: { background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24, marginBottom: 24 },
    cardTitle: { fontSize: 14, fontWeight: 700, color: '#6e7191', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
    th: { padding: '10px 12px', color: '#6e7191', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.07)', textAlign: 'left', fontSize: 12 },
    td: { padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.04)' },
    btn: (c = '#a78bfa') => ({ background: c + '22', border: `1px solid ${c}44`, color: c, borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 12 }),
    statBadge: (c) => ({ background: c + '18', border: `1px solid ${c}33`, borderRadius: 12, padding: '12px 20px', textAlign: 'center', flex: 1 }),
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalBox: { background: '#16161e', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: 32, minWidth: 400 },
    input: { background: '#1d1d28', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box', marginTop: 6 },
  };

  const expBadge = (days) => {
    const c = days < 30 ? '#ef4444' : days < 60 ? '#f5b731' : '#22d3ee';
    return <span style={{ background: c + '22', color: c, border: `1px solid ${c}44`, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{days < 0 ? 'EXPIRED' : `${days}d`}</span>;
  };

  const seatBar = (used, total) => {
    const pct = used / total;
    const c = pct > 0.9 ? '#ef4444' : pct > 0.7 ? '#f5b731' : '#22d3ee';
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
          <div style={{ width: `${pct * 100}%`, height: '100%', background: c, borderRadius: 4 }} />
        </div>
        <span style={{ color: '#6e7191', fontSize: 11 }}>{used}/{total}</span>
      </div>
    );
  };

  const handleAdd = () => {
    const annual = newLic.costPerSeat * newLic.seatsTotal;
    const days = daysUntil(newLic.expiry);
    setLicenses(prev => [...prev, { ...newLic, id: prev.length + 1, annual, risk: days < 30 ? 'HIGH' : days < 90 ? 'MEDIUM' : 'LOW' }]);
    setShowModal(false);
    setNewLic({ software: '', type: 'SaaS', expiry: '', seatsUsed: 0, seatsTotal: 1, costPerSeat: 0 });
  };

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <h1 style={s.heroTitle}>License Manager</h1>
        <p style={{ color: '#6e7191', marginTop: 8, fontSize: 15 }}>Track software licenses, seats, costs and compliance risks</p>
        <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
          <div style={s.statBadge('#a78bfa')}><div style={{ fontSize: 24, fontWeight: 800, color: '#a78bfa' }}>{licenses.length}</div><div style={{ fontSize: 11, color: '#6e7191' }}>Total Licenses</div></div>
          <div style={s.statBadge('#ef4444')}><div style={{ fontSize: 24, fontWeight: 800, color: '#ef4444' }}>{expiringCount}</div><div style={{ fontSize: 11, color: '#6e7191' }}>Expiring Soon</div></div>
          <div style={s.statBadge('#f5b731')}><div style={{ fontSize: 24, fontWeight: 800, color: '#f5b731' }}>${(totalAnnual / 1000).toFixed(1)}k</div><div style={{ fontSize: 11, color: '#6e7191' }}>Annual Spend</div></div>
          <div style={s.statBadge('#22d3ee')}><div style={{ fontSize: 24, fontWeight: 800, color: '#22d3ee' }}>{licenses.filter(l => l.seatsUsed / l.seatsTotal > 0.9).length}</div><div style={{ fontSize: 11, color: '#6e7191' }}>Near Seat Limit</div></div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <button style={s.btn('#22d3ee')}>📥 Import CSV</button>
            <button style={s.btn('#a78bfa')} onClick={() => setShowModal(true)}>+ Add License</button>
          </div>
        </div>
      </div>

      <div style={s.body}>
        <div style={s.card}>
          <div style={s.cardTitle}>Software Licenses</div>
          <table style={s.table}>
            <thead>
              <tr>{['Software', 'Type', 'Expiry', 'Seats', 'Cost/Seat', 'Annual', 'Reminder', 'Risk'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {licenses.map(lic => (
                <tr key={lic.id}>
                  <td style={{ ...s.td, fontWeight: 600 }}>{lic.software}</td>
                  <td style={{ ...s.td, color: '#6e7191' }}>{lic.type}</td>
                  <td style={s.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#6e7191', fontSize: 12 }}>{lic.expiry}</span>
                      {expBadge(daysUntil(lic.expiry))}
                    </div>
                  </td>
                  <td style={s.td}><div style={{ minWidth: 120 }}>{seatBar(lic.seatsUsed, lic.seatsTotal)}</div></td>
                  <td style={{ ...s.td, color: '#6e7191' }}>${lic.costPerSeat}/mo</td>
                  <td style={{ ...s.td, color: '#f5b731', fontWeight: 700 }}>${lic.annual.toLocaleString()}</td>
                  <td style={s.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div
                        onClick={() => setReminders(r => ({ ...r, [lic.id]: !r[lic.id] }))}
                        style={{ width: 36, height: 20, borderRadius: 10, background: reminders[lic.id] ? '#22d3ee' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                        <div style={{ width: 14, height: 14, background: '#fff', borderRadius: '50%', position: 'absolute', top: 3, left: reminders[lic.id] ? 19 : 3, transition: 'left 0.2s' }} />
                      </div>
                    </div>
                  </td>
                  <td style={s.td}>
                    <span style={{ background: (lic.risk === 'HIGH' ? '#ef4444' : lic.risk === 'MEDIUM' ? '#f5b731' : '#22d3ee') + '22', color: lic.risk === 'HIGH' ? '#ef4444' : lic.risk === 'MEDIUM' ? '#f5b731' : '#22d3ee', border: `1px solid ${(lic.risk === 'HIGH' ? '#ef4444' : lic.risk === 'MEDIUM' ? '#f5b731' : '#22d3ee')}44`, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{lic.risk}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ ...s.card }}>
          <div style={s.cardTitle}>Annual Cost Analysis</div>
          <CostChart licenses={licenses} />
        </div>
      </div>

      {showModal && (
        <div style={s.modal} onClick={() => setShowModal(false)}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#a78bfa', marginBottom: 20, marginTop: 0 }}>Add New License</h3>
            {[['Software Name', 'software', 'text'], ['Type', 'type', 'text'], ['Expiry Date', 'expiry', 'date'], ['Seats Used', 'seatsUsed', 'number'], ['Seats Total', 'seatsTotal', 'number'], ['Cost/Seat ($/mo)', 'costPerSeat', 'number']].map(([label, key, type]) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: '#6e7191', display: 'block' }}>{label}</label>
                <input style={s.input} type={type} value={newLic[key]} onChange={e => setNewLic(n => ({ ...n, [key]: type === 'number' ? +e.target.value : e.target.value }))} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button style={s.btn('#a78bfa')} onClick={handleAdd}>Add License</button>
              <button style={s.btn('#6e7191')} onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

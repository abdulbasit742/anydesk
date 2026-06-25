import { useState, useMemo } from 'react';
import { sound } from '../lib/soundEngine';

const V = {
  gold: '#f5b731',
  teal: '#22d3ee',
  purple: '#a78bfa',
  surface: '#0e0e16',
  surface2: '#16161e',
  surface3: '#1d1d28',
  border: 'rgba(255,255,255,0.07)',
  muted: '#6e7191',
  red: '#ef4444',
  blue: '#60a5fa',
  green: '#22c55e',
};

const Card = ({ children, style = {}, ...props }) => (
  <div style={{
    background: '#16161e',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 12,
    padding: '20px 22px',
    boxSizing: 'border-box',
    ...style
  }} {...props}>
    {children}
  </div>
);

const SectionTitle = ({ children, color = '#22d3ee' }) => (
  <h2 style={{
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color,
    margin: '0 0 16px 0',
  }}>{children}</h2>
);

export default function Affiliates() {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedLink, setCopiedLink] = useState(false);
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  // Custom link constructor UTM states
  const [campaignSource, setCampaignSource] = useState('twitter');
  const [campaignMedium, setCampaignMedium] = useState('social');
  const [campaignName, setCampaignName] = useState('summer2026');

  // Payout request wizard states
  const [payoutMethod, setPayoutMethod] = useState('paypal');
  const [payoutAddress, setPayoutAddress] = useState('');
  const [payoutThreshold, setPayoutThreshold] = useState(100);
  const [payoutRequestAmount, setPayoutRequestAmount] = useState(50);
  const [payoutAddressError, setPayoutAddressError] = useState('');
  const [isSubmittingPayout, setIsSubmittingPayout] = useState(false);


  const [downloadProgress, setDownloadProgress] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Email swipes variables replacement
  const [partnerFirstName, setPartnerFirstName] = useState('Subscriber');
  const [partnerDiscountCode, setPartnerDiscountCode] = useState('AGENT30');

  const referralLink = useMemo(() => {
    return `https://agentflow.sh/?ref=dev_absh5&utm_source=${campaignSource}&utm_medium=${campaignMedium}&utm_campaign=${campaignName}`;
  }, [campaignSource, campaignMedium, campaignName]);

  const [payoutHistory, setPayoutHistory] = useState([
    { id: 'pay-0019', date: '2026-06-01', amount: 142.20, status: 'Paid', method: 'PayPal (a***@example.com)' },
    { id: 'pay-0018', date: '2026-05-01', amount: 98.40, status: 'Paid', method: 'PayPal (a***@example.com)' },
    { id: 'pay-0017', date: '2026-04-01', amount: 120.00, status: 'Paid', method: 'Crypto (0x74a...3ba)' }
  ]);

  const handleCopyLink = () => {
    sound.play('success');
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopySwipe = (textId) => {
    sound.play('success');
    const el = document.getElementById(textId);
    if (el) {
      navigator.clipboard.writeText(el.innerText);
      alert("[COPY SUCCESS] Email swipe copied to clipboard.");
    }
  };

  const handleDownloadAsset = (assetName) => {
    if (isDownloading) return;
    sound.play('click');
    setIsDownloading(true);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          setDownloadProgress(null);
          sound.play('success');
          alert(`[DOWNLOAD COMPLETE] Promomational asset package: ${assetName}.zip saved to local folder.`);
          return null;
        }
        return p + 10;
      });
    }, 150);
  };

  const handlePayoutRequestSubmit = (e) => {
    e.preventDefault();
    if (!payoutAddress) {
      setPayoutAddressError('Address parameter cannot be empty.');
      sound.play('hover');
      return;
    }
    // Simple verification regex patterns
    if (payoutMethod === 'paypal' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payoutAddress)) {
      setPayoutAddressError('Invalid email format for PayPal payment.');
      sound.play('hover');
      return;
    }
    if (payoutMethod === 'crypto' && !/^0x[a-fA-F0-9]{40}$/.test(payoutAddress)) {
      setPayoutAddressError('Invalid ERC-20 ethereum address format.');
      sound.play('hover');
      return;
    }

    setPayoutAddressError('');
    setIsSubmittingPayout(true);
    sound.play('click');

    setTimeout(() => {
      setIsSubmittingPayout(false);
      sound.play('success');
      const newPay = {
        id: 'pay-00' + Math.floor(20 + Math.random() * 80),
        date: new Date().toISOString().split('T')[0],
        amount: parseFloat(payoutRequestAmount),
        status: 'Pending',
        method: `${payoutMethod.toUpperCase()} (${payoutAddress.substring(0, 3)}...${payoutAddress.slice(-3)})`
      };
      setPayoutHistory(prev => [newPay, ...prev]);
      setPayoutAddress('');
      alert(`[PAYOUT SYSTEM] Payout request ${newPay.id} created successfully.`);
    }, 1200);
  };

  const chartData = [
    { day: 'Mon', clicks: 80, conv: 2, rawDate: 'May 27' },
    { day: 'Tue', clicks: 120, conv: 4, rawDate: 'May 28' },
    { day: 'Wed', clicks: 190, conv: 7, rawDate: 'May 29' },
    { day: 'Thu', clicks: 150, conv: 5, rawDate: 'May 30' },
    { day: 'Fri', clicks: 220, conv: 9, rawDate: 'May 31' },
    { day: 'Sat', clicks: 140, conv: 4, rawDate: 'Jun 01' },
    { day: 'Sun', clicks: 170, conv: 6, rawDate: 'Jun 02' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ─── Hero Header ─── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(34,211,238,0.06) 0%, rgba(167,139,250,0.03) 100%)',
        border: '1px solid rgba(34,211,238,0.15)', borderRadius: 16, padding: '24px 32px'
      }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, margin: 0 }}>
          Partner Affiliate & Referral Dashboard
        </h1>
        <p style={{ margin: '4px 0 0', color: V.muted, fontSize: 13 }}>
          Earn 30% lifetime recurring commissions by promoting AgentFlow. Generate custom referral links, track conversion metrics, and inspect historical payouts.
        </p>
      </div>

      {/* ─── KPI Metrics ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Referral Clicks', value: '1,283 clicks', sub: '92 new visitors this week', color: V.teal },
          { label: 'Conversions', value: '47 conversions', sub: 'Starter: 12 | Pro: 25 | Agency: 10', color: V.purple },
          { label: 'Conversion Rate', value: '3.66%', sub: 'Avg industry benchmark: 1.8%', color: V.green },
          { label: 'Lifetime Affiliate Earnings', value: '$484.20', sub: 'Next payout scheduled for July 1', color: V.gold }
        ].map(kpi => (
          <Card key={kpi.label} style={{ borderTop: `2.5px solid ${kpi.color}` }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', color: V.muted, letterSpacing: '0.04em' }}>{kpi.label}</span>
            <div style={{ fontSize: 22, fontWeight: 800, color: kpi.color, marginTop: 4 }}>{kpi.value}</div>
            <div style={{ fontSize: 9.5, color: V.muted, marginTop: 4 }}>{kpi.sub}</div>
          </Card>
        ))}
      </div>

      {/* ─── Link Generator Card with UTM Parameters ─── */}
      <Card>
        <SectionTitle color="var(--teal)">Custom Campaign UTM Constructor</SectionTitle>
        <p style={{ fontSize: 12.5, color: V.muted, margin: '0 0 16px', lineHeight: 1.45 }}>
          Construct custom referral links with target tracking parameters to evaluate traffic sources performance metrics.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10.5, color: V.muted }}>Campaign Source (utm_source)</span>
            <input
              type="text" value={campaignSource} onChange={e => setCampaignSource(e.target.value.toLowerCase())}
              style={{ background: V.surface3, border: `1px solid ${V.border}`, color: '#fff', fontSize: 12, padding: 8, borderRadius: 6, outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10.5, color: V.muted }}>Campaign Medium (utm_medium)</span>
            <input
              type="text" value={campaignMedium} onChange={e => setCampaignMedium(e.target.value.toLowerCase())}
              style={{ background: V.surface3, border: `1px solid ${V.border}`, color: '#fff', fontSize: 12, padding: 8, borderRadius: 6, outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10.5, color: V.muted }}>Campaign Name (utm_campaign)</span>
            <input
              type="text" value={campaignName} onChange={e => setCampaignName(e.target.value.toLowerCase())}
              style={{ background: V.surface3, border: `1px solid ${V.border}`, color: '#fff', fontSize: 12, padding: 8, borderRadius: 6, outline: 'none' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <input
            type="text"
            readOnly
            value={referralLink}
            style={{
              flex: 1, padding: '10px 14px', fontSize: 13, background: V.surface3,
              color: V.teal, border: `1px solid ${V.border}`, borderRadius: 8,
              fontFamily: 'DM Mono, monospace', outline: 'none'
            }}
          />
          <button
            onClick={handleCopyLink}
            style={{
              padding: '0 20px', borderRadius: 8, border: 'none',
              background: copiedLink ? V.green : V.teal, color: '#0e0e16',
              fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: "'Syne', sans-serif",
              transition: 'background 0.2s', minWidth: 110
            }}
          >
            {copiedLink ? "✓ Copied!" : "Copy URL"}
          </button>
        </div>
      </Card>

      {/* ─── Tabs Navigation ─── */}
      <div style={{ display: 'flex', gap: 12, borderBottom: `1px solid ${V.border}`, paddingBottom: 16 }}>
        {[
          { id: 'overview', label: 'Program Overview' },
          { id: 'assets', label: 'Promotional Assets' },
          { id: 'payouts', label: 'Affiliate Payouts' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { sound.play('click'); setActiveTab(tab.id); }}
            style={{
              cursor: 'pointer', padding: '8px 16px', borderRadius: 8, fontSize: 12.5, fontWeight: 700,
              background: activeTab === tab.id ? 'rgba(255,255,255,0.05)' : 'transparent',
              border: `1px solid ${activeTab === tab.id ? V.border : 'transparent'}`,
              color: activeTab === tab.id ? '#fff' : V.muted,
              fontFamily: "'Syne', sans-serif", transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }}>

          {/* Daily clicks chart */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <SectionTitle color="var(--purple)">Performance Metrics (Interactive Clicks)</SectionTitle>
              {hoveredBarIndex !== null && (
                <span style={{ fontSize: 11, fontFamily: 'DM Mono', color: V.gold }}>
                  Date: {chartData[hoveredBarIndex].rawDate} | Clicks: {chartData[hoveredBarIndex].clicks} | Conversions: {chartData[hoveredBarIndex].conv}
                </span>
              )}
            </div>

            <div style={{ height: 160, background: '#0e0e16', border: `1px solid ${V.border}`, borderRadius: 8, padding: '20px 12px 12px 12px', position: 'relative' }}>
              <svg style={{ width: '100%', height: '100%' }}>
                {chartData.map((item, idx) => {
                  const x = 50 + idx * 60;
                  const clicksH = (item.clicks / 250) * 100;
                  const convH = (item.conv / 10) * 100;

                  return (
                    <g
                      key={idx}
                      onMouseEnter={() => setHoveredBarIndex(idx)}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Click bar */}
                      <rect x={x} y={120 - clicksH} width="16" height={clicksH} fill={hoveredBarIndex === idx ? V.gold : V.purple} rx="3" style={{ transition: 'all 0.2s' }} />
                      {/* Conversion bar */}
                      <rect x={x + 20} y={120 - convH} width="16" height={convH} fill={V.teal} rx="3" />
                      {/* Labels */}
                      <text x={x + 18} y="138" fill={V.muted} fontSize="8.5" textAnchor="middle" fontFamily="DM Mono">{item.day}</text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div style={{ display: 'flex', gap: 20, marginTop: 12, fontSize: 11, fontFamily: 'DM Mono, monospace', color: V.muted }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, background: V.purple, borderRadius: 2 }} /> Click count
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, background: V.teal, borderRadius: 2 }} /> Registration Conversions
              </span>
            </div>
          </Card>

          {/* Commission tiers description */}
          <Card>
            <SectionTitle color="var(--gold)">Commission Tiers</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { tier: "30% Lifetime recurring", desc: "You receive 30% recurring payout from Starter ($5.70), Pro ($14.70), and Agency ($29.70) subscriptions as long as users stay active." },
                { tier: "60-day cookie matches", desc: "We track users across browser cookies for up to 60 days to match the initial referral connection details." },
                { tier: "Paiements paid monthly", desc: "Payout approvals are processed on the 1st of every month automatically via PayPal or direct IBAN wire configurations." }
              ].map((c, i) => (
                <div key={i} style={{ borderLeft: `2.5px solid ${V.gold}`, paddingLeft: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{c.tier}</div>
                  <div style={{ fontSize: 10.5, color: V.muted, marginTop: 2, lineHeight: 1.45 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </Card>

        </div>
      )}

      {/* Tab 2: Promotional Assets & Swipes */}
      {activeTab === 'assets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Download promotion kits */}
          <Card>
            <SectionTitle color="var(--purple)">Download Partner Marketing Kits</SectionTitle>
            <p style={{ fontSize: 12.5, color: V.muted, margin: '0 0 20px', lineHeight: 1.45 }}>
              Over 20+ responsive banners, client logos bundle, promotional copy, and cold email templates to help optimize your conversion campaigns.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { title: "HTML5 Banners Package", type: "ZIP Bundle (4.2 MB)", icon: "🎨" },
                { title: "Client logos & Icons SVG", type: "ZIP Bundle (1.8 MB)", icon: "📐" },
                { title: "Promotional copywriting copy", type: "TXT Markdown (12 KB)", icon: "📝" }
              ].map((asset, idx) => (
                <div
                  key={idx}
                  style={{
                    background: V.surface3, border: `1px solid ${V.border}`, borderRadius: 10,
                    padding: 16, display: 'flex', flexDirection: 'column', gap: 8
                  }}
                >
                  <div style={{ fontSize: 24 }}>{asset.icon}</div>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{asset.title}</span>
                  <span style={{ fontSize: 9.5, color: V.muted, fontFamily: 'DM Mono, monospace' }}>{asset.type}</span>

                  {isDownloading && downloadProgress !== null ? (
                    <div style={{ width: '100%', height: 4, background: V.surface, borderRadius: 2, overflow: 'hidden', marginTop: 10 }}>
                      <div style={{ width: `${downloadProgress}%`, height: '100%', background: V.purple, borderRadius: 2 }} />
                    </div>
                  ) : (
                    <button
                      onClick={() => handleDownloadAsset(asset.title)}
                      disabled={isDownloading}
                      style={{
                        padding: '6px 0', background: 'transparent', border: `1px solid ${V.purple}55`,
                        borderRadius: 6, color: V.purple, fontSize: 10.5, fontWeight: 700, cursor: 'pointer',
                        transition: 'all 0.2s', marginTop: 4
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = V.purple; e.currentTarget.style.color = '#0e0e16'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = V.purple; }}
                    >
                      Download Asset
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Email promotional swipes cards */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
              <SectionTitle color="var(--teal)">Email Copy Swipes</SectionTitle>

              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text" placeholder="Recipient First Name"
                  value={partnerFirstName} onChange={e => setPartnerFirstName(e.target.value)}
                  style={{ background: V.surface3, border: `1px solid ${V.border}`, color: '#fff', fontSize: 11, padding: '4px 8px', borderRadius: 4, outline: 'none' }}
                />
                <input
                  type="text" placeholder="Promo discount code"
                  value={partnerDiscountCode} onChange={e => setPartnerDiscountCode(e.target.value.toUpperCase())}
                  style={{ background: V.surface3, border: `1px solid ${V.border}`, color: '#fff', fontSize: 11, padding: '4px 8px', borderRadius: 4, outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                {
                  id: 'swipe-1',
                  subject: `Resilient multi-account billing relays for developers 👽`,
                  body: `Hi ${partnerFirstName},\n\nIf you deploy parallel agents workspace routines, you know how quickly billing credit caps deplete.\n\nAgentFlow automates session rotation seamlessly. Let the linter checks verify packages before credit pools empty.\n\nGet started with coupon code "${partnerDiscountCode}" for 20% off:\n`
                },
                {
                  id: 'swipe-2',
                  subject: `Zero-Defect ESLint builder cockpit 🛠️`,
                  body: `Hey ${partnerFirstName},\n\nWe just launched our new 12-Agent builder swarm workspace.\n\nCoordinate linter runs, package handoff ZIP directories, and rotate workspace credentials securely.\n\nUse code "${partnerDiscountCode}" to activate your Pro tier:\n`
                }
              ].map(swipe => (
                <div key={swipe.id} style={{ background: V.surface3, border: `1px solid ${V.border}`, borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <span style={{ fontSize: 11, color: V.muted, textTransform: 'uppercase' }}>Subject:</span>
                    <div style={{ fontSize: 12.5, fontWeight: 700, marginTop: 2, color: '#fff' }}>{swipe.subject}</div>
                  </div>
                  <div style={{ height: 1, background: V.border }} />
                  <div id={swipe.id} style={{ fontSize: 11.5, color: V.muted, fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: 1.5, background: V.surface, padding: 10, borderRadius: 6, border: `1px solid ${V.border}` }}>
                    {swipe.body}
                    <span style={{ color: V.teal }}>{referralLink}</span>
                  </div>
                  <button
                    onClick={() => handleCopySwipe(swipe.id)}
                    style={{
                      padding: '8px 0', border: 'none', background: V.teal, color: '#0e0e16',
                      fontWeight: 700, borderRadius: 6, fontSize: 11.5, cursor: 'pointer', fontFamily: "'Syne', sans-serif"
                    }}
                  >
                    Copy Swipe Content
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Affiliate Payouts & request wizard */}
      {activeTab === 'payouts' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 20 }}>

          {/* Payout records table */}
          <Card style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <SectionTitle color="var(--gold)">Affiliate Payout History</SectionTitle>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: '#0a0a0f', borderBottom: `1px solid ${V.border}` }}>
                    <th style={{ padding: '10px 14px', color: V.muted }}>PAYOUT ID</th>
                    <th style={{ padding: '10px 14px', color: V.muted }}>DATE</th>
                    <th style={{ padding: '10px 14px', color: V.muted }}>AMOUNT</th>
                    <th style={{ padding: '10px 14px', color: V.muted }}>STATUS</th>
                    <th style={{ padding: '10px 14px', color: V.muted }}>METHOD</th>
                  </tr>
                </thead>
                <tbody>
                  {payoutHistory.map((pay, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${V.border}` }}>
                      <td style={{ padding: '10px 14px', fontFamily: 'DM Mono, monospace', fontSize: 11 }}>{pay.id}</td>
                      <td style={{ padding: '10px 14px' }}>{pay.date}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 800, color: V.green }}>${pay.amount.toFixed(2)}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{
                          fontSize: 9, padding: '2px 6px', borderRadius: 4, fontWeight: 700,
                          background: pay.status === 'Paid' ? 'rgba(34,197,94,0.15)' : 'rgba(245,183,49,0.15)',
                          color: pay.status === 'Paid' ? V.green : V.gold
                        }}>
                          {pay.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', color: V.muted }}>{pay.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Request Payout Wizard Card */}
          <Card>
            <SectionTitle color="var(--teal)">Request Commission Payout</SectionTitle>
            <form onSubmit={handlePayoutRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 11, color: V.muted }}>Method</span>
                  <select
                    value={payoutMethod} onChange={e => { sound.play('click'); setPayoutMethod(e.target.value); }}
                    style={{ background: V.surface3, border: `1px solid ${V.border}`, color: '#fff', fontSize: 12, padding: 8, borderRadius: 6, outline: 'none' }}
                  >
                    <option value="paypal">PayPal</option>
                    <option value="crypto">Crypto Wallet</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 11, color: V.muted }}>Amount ($)</span>
                  <input
                    type="number" min="20" max="400" value={payoutRequestAmount}
                    onChange={e => setPayoutRequestAmount(e.target.value)}
                    style={{ background: V.surface3, border: `1px solid ${V.border}`, color: '#fff', fontSize: 12, padding: 8, borderRadius: 6, outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 11, color: V.muted }}>Payout Address (Email or Ethereum public key)</span>
                <input
                  type="text" placeholder={payoutMethod === 'paypal' ? 'paypal_account@example.com' : '0x74a...3ba'}
                  value={payoutAddress} onChange={e => setPayoutAddress(e.target.value)}
                  style={{ background: V.surface3, border: `1px solid ${V.border}`, color: '#fff', fontSize: 12, padding: 8, borderRadius: 6, outline: 'none', fontFamily: 'DM Mono' }}
                />
              </div>

              {payoutAddressError && <span style={{ fontSize: 11, color: V.red }}>{payoutAddressError}</span>}

              {/* Threshold configurations slider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, background: V.surface, padding: 10, borderRadius: 6, border: `1px solid ${V.border}`, marginTop: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5 }}>
                  <span style={{ color: V.muted }}>Auto-Withdraw Threshold:</span>
                  <span style={{ color: V.gold, fontWeight: 700 }}>${payoutThreshold}</span>
                </div>
                <input
                  type="range" min="50" max="500" step="50" value={payoutThreshold}
                  onChange={e => { sound.play('click'); setPayoutThreshold(parseInt(e.target.value)); }}
                  style={{ width: '100%', accentColor: V.gold }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingPayout || !payoutAddress}
                style={{
                  width: '100%', padding: '10px 0', border: 'none', background: V.teal,
                  color: '#0e0e16', fontWeight: 700, borderRadius: 6, fontSize: 12.5,
                  cursor: (isSubmittingPayout || !payoutAddress) ? 'not-allowed' : 'pointer',
                  fontFamily: "'Syne', sans-serif", marginTop: 8
                }}
              >
                {isSubmittingPayout ? 'Submitting request details...' : 'Submit Payout Request'}
              </button>
            </form>
          </Card>

        </div>
      )}

    </div>
  );
}

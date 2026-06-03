import { useState, useEffect, useRef } from 'react';

// ─── Static data ────────────────────────────────────────────────────────────

const REGIONS = [
  { id: 'na', name: 'North America', x: 60, y: 120, w: 200, h: 160, calls: 521000, success: 99.2, latency: 28, cost: 4820, gdpr: false, countries: ['US', 'CA', 'MX'], color: '#f5b731' },
  { id: 'eu', name: 'Europe',        x: 380, y: 80,  w: 160, h: 140, calls: 312000, success: 99.5, latency: 35, cost: 2890, gdpr: true,  countries: ['DE', 'FR', 'UK', 'NL', 'SE'], color: '#22d3ee' },
  { id: 'asia', name: 'Asia Pacific',x: 620, y: 100, w: 240, h: 180, calls: 287000, success: 98.8, latency: 62, cost: 2340, gdpr: false, countries: ['JP', 'SG', 'AU', 'IN', 'KR'], color: '#a78bfa' },
  { id: 'sa', name: 'South America', x: 140, y: 280, w: 160, h: 150, calls: 48000,  success: 98.1, latency: 78, cost: 390,  gdpr: false, countries: ['BR', 'AR', 'CL'], color: '#f97316' },
  { id: 'af', name: 'Africa',        x: 380, y: 230, w: 180, h: 160, calls: 21000,  success: 97.4, latency: 102,cost: 170,  gdpr: false, countries: ['ZA', 'NG', 'EG'], color: '#60a5fa' },
  { id: 'me', name: 'Middle East',   x: 520, y: 200, w: 120, h: 100, calls: 15000,  success: 98.6, latency: 55, cost: 125,  gdpr: false, countries: ['AE', 'SA', 'IL'], color: '#ec4899' },
];

const COUNTRIES = [
  { flag: '🇺🇸', name: 'United States', calls: 421000, success: 99.3, latency: 26, cost: 3890, gdpr: false },
  { flag: '🇩🇪', name: 'Germany',       calls: 98000,  success: 99.7, latency: 32, cost: 910,  gdpr: true  },
  { flag: '🇯🇵', name: 'Japan',         calls: 87000,  success: 99.1, latency: 54, cost: 810,  gdpr: false },
  { flag: '🇬🇧', name: 'United Kingdom',calls: 76000,  success: 99.4, latency: 37, cost: 700,  gdpr: true  },
  { flag: '🇸🇬', name: 'Singapore',     calls: 68000,  success: 98.9, latency: 48, cost: 630,  gdpr: false },
  { flag: '🇧🇷', name: 'Brazil',        calls: 42000,  success: 98.2, latency: 81, cost: 340,  gdpr: false },
  { flag: '🇨🇦', name: 'Canada',        calls: 38000,  success: 99.1, latency: 31, cost: 350,  gdpr: false },
  { flag: '🇦🇺', name: 'Australia',     calls: 34000,  success: 98.8, latency: 71, cost: 310,  gdpr: false },
  { flag: '🇫🇷', name: 'France',        calls: 31000,  success: 99.2, latency: 34, cost: 285,  gdpr: true  },
  { flag: '🇮🇳', name: 'India',         calls: 28000,  success: 98.4, latency: 68, cost: 210,  gdpr: false },
];

const ENDPOINTS = ['/v2/chat', '/v2/embed', '/v2/complete', '/v1/image', '/v2/classify'];

const TIMEZONES = [
  { tz: 'UTC-8 PST', peak: [14, 15, 16, 17, 18], label: 'West US' },
  { tz: 'UTC-5 EST', peak: [13, 14, 15, 16, 17], label: 'East US' },
  { tz: 'UTC+1 CET', peak: [9,  10, 11, 12, 13], label: 'Europe'  },
  { tz: 'UTC+5:30 IST', peak: [4, 5, 6, 7, 8],  label: 'India'   },
  { tz: 'UTC+8 SGT',   peak: [1, 2, 3, 4, 5],   label: 'SE Asia' },
  { tz: 'UTC+9 JST',   peak: [0, 1, 2, 3, 23],  label: 'Japan'   },
  { tz: 'UTC+11 AET',  peak: [22, 23, 0, 1, 2], label: 'Australia'},
];

const LATENCY_GRID = [
  [22,24,28,32,28,35,42],[35,38,32,30,38,42,48],[45,41,38,36,40,45,52],
  [58,55,50,48,52,58,65],[72,68,65,62,66,72,80],[88,85,82,78,82,88,96],
  [102,98,95,92,96,102,110],
];
const LATENCY_X = ['US-W','US-E','EU-W','EU-E','ME','AS-SE','AS-E'];
const LATENCY_Y = ['US-W','US-E','EU-W','ME','IN','SG','JP'];

// World heatmap city hotspots (svgX, svgY are in 900x400 coordinate space)
const CITY_HOTSPOTS = [
  { id: 'nyc',  city: 'New York',    svgX: 180, svgY: 155, baseSessions: 142000, revenue: 128000, conversion: 4.2, traffic: 'high'   },
  { id: 'sfo',  city: 'San Francisco',svgX: 95, svgY: 160, baseSessions: 98000,  revenue: 92000,  conversion: 5.1, traffic: 'high'   },
  { id: 'lon',  city: 'London',      svgX: 430, svgY: 110, baseSessions: 87000,  revenue: 79000,  conversion: 3.8, traffic: 'high'   },
  { id: 'ber',  city: 'Berlin',      svgX: 462, svgY: 108, baseSessions: 54000,  revenue: 51000,  conversion: 3.5, traffic: 'medium' },
  { id: 'tok',  city: 'Tokyo',       svgX: 780, svgY: 148, baseSessions: 71000,  revenue: 68000,  conversion: 4.4, traffic: 'high'   },
  { id: 'sgp',  city: 'Singapore',   svgX: 720, svgY: 235, baseSessions: 49000,  revenue: 44000,  conversion: 3.9, traffic: 'medium' },
  { id: 'syd',  city: 'Sydney',      svgX: 790, svgY: 310, baseSessions: 31000,  revenue: 28000,  conversion: 3.2, traffic: 'medium' },
  { id: 'sao',  city: 'São Paulo',   svgX: 235, svgY: 325, baseSessions: 22000,  revenue: 16000,  conversion: 2.8, traffic: 'low'    },
  { id: 'lag',  city: 'Lagos',       svgX: 430, svgY: 270, baseSessions: 9000,   revenue: 6000,   conversion: 1.9, traffic: 'low'    },
  { id: 'dub',  city: 'Dubai',       svgX: 575, svgY: 225, baseSessions: 14000,  revenue: 13000,  conversion: 3.6, traffic: 'low'    },
];

// Region breakdown (12 rows)
const REGION_ROWS = [
  { flag: '🇺🇸', region: 'North America – West', sessions: 312000, revenue: 289000, conversion: 5.1, growth: '+12.4' },
  { flag: '🇺🇸', region: 'North America – East', sessions: 209000, revenue: 198000, conversion: 4.6, growth: '+8.7'  },
  { flag: '🇩🇪', region: 'Europe – DACH',         sessions: 142000, revenue: 131000, conversion: 4.1, growth: '+3.2'  },
  { flag: '🇬🇧', region: 'Europe – UK / IE',       sessions: 98000,  revenue: 91000,  conversion: 3.9, growth: '+5.8'  },
  { flag: '🇫🇷', region: 'Europe – Southern',      sessions: 72000,  revenue: 65000,  conversion: 3.4, growth: '-1.2'  },
  { flag: '🇯🇵', region: 'Asia – Japan',           sessions: 87000,  revenue: 81000,  conversion: 4.4, growth: '+6.9'  },
  { flag: '🇸🇬', region: 'Asia – SE Asia',         sessions: 68000,  revenue: 61000,  conversion: 3.8, growth: '+15.3' },
  { flag: '🇦🇺', region: 'Asia – ANZ',             sessions: 34000,  revenue: 31000,  conversion: 3.2, growth: '+2.1'  },
  { flag: '🇮🇳', region: 'Asia – South Asia',      sessions: 28000,  revenue: 21000,  conversion: 2.6, growth: '+22.4' },
  { flag: '🇧🇷', region: 'South America',          sessions: 22000,  revenue: 16000,  conversion: 2.8, growth: '-0.5'  },
  { flag: '🇿🇦', region: 'Africa',                 sessions: 9000,   revenue: 6000,   conversion: 1.9, growth: '+4.1'  },
  { flag: '🇦🇪', region: 'Middle East',            sessions: 14000,  revenue: 13000,  conversion: 3.6, growth: '+9.7'  },
];

// City breakdown per region (for expand)
const CITY_BREAKDOWN = {
  'North America – West': [{ city: 'San Francisco', sessions: 98000 }, { city: 'Los Angeles', sessions: 71000 }, { city: 'Seattle', sessions: 48000 }, { city: 'Denver', sessions: 29000 }],
  'North America – East': [{ city: 'New York', sessions: 142000 }, { city: 'Boston', sessions: 38000 }, { city: 'Miami', sessions: 29000 }],
  'Europe – DACH':        [{ city: 'Berlin', sessions: 54000 }, { city: 'Munich', sessions: 41000 }, { city: 'Zurich', sessions: 31000 }, { city: 'Vienna', sessions: 16000 }],
  'Europe – UK / IE':     [{ city: 'London', sessions: 87000 }, { city: 'Dublin', sessions: 11000 }],
  'Europe – Southern':    [{ city: 'Paris', sessions: 31000 }, { city: 'Barcelona', sessions: 22000 }, { city: 'Rome', sessions: 19000 }],
  'Asia – Japan':         [{ city: 'Tokyo', sessions: 71000 }, { city: 'Osaka', sessions: 16000 }],
  'Asia – SE Asia':       [{ city: 'Singapore', sessions: 49000 }, { city: 'Bangkok', sessions: 12000 }, { city: 'Jakarta', sessions: 7000 }],
  'Asia – ANZ':           [{ city: 'Sydney', sessions: 21000 }, { city: 'Melbourne', sessions: 13000 }],
  'Asia – South Asia':    [{ city: 'Mumbai', sessions: 14000 }, { city: 'Bangalore', sessions: 9000 }, { city: 'Delhi', sessions: 5000 }],
  'South America':        [{ city: 'São Paulo', sessions: 14000 }, { city: 'Buenos Aires', sessions: 8000 }],
  'Africa':               [{ city: 'Lagos', sessions: 4000 }, { city: 'Nairobi', sessions: 3000 }, { city: 'Cape Town', sessions: 2000 }],
  'Middle East':          [{ city: 'Dubai', sessions: 9000 }, { city: 'Tel Aviv', sessions: 5000 }],
};

// Hourly sessions (24h) — static base, perturbed in useEffect
const BASE_HOURLY = [420,310,260,200,180,210,380,640,820,920,980,1010,1050,1100,1120,1090,1040,1000,940,880,780,680,580,490];
const BASE_REVENUE = [3100,2200,1900,1500,1300,1600,2800,4700,6100,6900,7400,7600,7900,8300,8500,8100,7700,7400,7100,6600,5900,5100,4300,3700];

// Language distribution
const LANGUAGES = [
  { lang: 'English',    users: 421000, pagesPerSession: 4.2, bounceRate: 28.4, color: '#f5b731', sliceAngle: 140 },
  { lang: 'German',     users: 98000,  pagesPerSession: 3.8, bounceRate: 31.2, color: '#22d3ee', sliceAngle: 33  },
  { lang: 'Japanese',   users: 87000,  pagesPerSession: 4.5, bounceRate: 24.1, color: '#a78bfa', sliceAngle: 29  },
  { lang: 'Portuguese', users: 72000,  pagesPerSession: 3.2, bounceRate: 38.9, color: '#f97316', sliceAngle: 24  },
  { lang: 'French',     users: 54000,  pagesPerSession: 3.5, bounceRate: 34.6, color: '#60a5fa', sliceAngle: 18  },
  { lang: 'Spanish',    users: 48000,  pagesPerSession: 3.1, bounceRate: 41.2, color: '#ec4899', sliceAngle: 16  },
  { lang: 'Korean',     users: 31000,  pagesPerSession: 3.9, bounceRate: 26.8, color: '#34d399', sliceAngle: 10  },
  { lang: 'Other',      users: 28000,  pagesPerSession: 2.9, bounceRate: 44.1, color: '#6e7191', sliceAngle: 9   },
];

const LANG_TOP_PAGES = {
  English:    ['/dashboard', '/api-docs', '/chat', '/billing', '/integrations'],
  German:     ['/dashboard', '/datenschutz', '/preise', '/api-docs'],
  Japanese:   ['/dashboard', '/サポート', '/api-docs', '/pricing'],
  Portuguese: ['/dashboard', '/precos', '/api-docs', '/suporte'],
  French:     ['/dashboard', '/tarifs', '/api-docs', '/confidentialite'],
  Spanish:    ['/dashboard', '/precios', '/api-docs', '/soporte'],
  Korean:     ['/dashboard', '/api-docs', '/pricing', '/support'],
  Other:      ['/dashboard', '/api-docs', '/pricing'],
};

// Geo-fence alerts
const INITIAL_ALERTS = [
  { id: 1, region: 'North America', metric: 'sessions', threshold: 50000, enabled: true,  condition: 'drops below' },
  { id: 2, region: 'Europe',        metric: 'sessions', threshold: 20000, enabled: true,  condition: 'drops below' },
  { id: 3, region: 'Asia Pacific',  metric: 'conversion', threshold: 3.0, enabled: false, condition: 'drops below' },
  { id: 4, region: 'South America', metric: 'sessions', threshold: 5000,  enabled: true,  condition: 'drops below' },
];

const ALERT_HISTORY = [
  { id: 1, ts: '2026-06-01 14:22', region: 'South America', metric: 'sessions', value: 4820,  threshold: 5000,  severity: 'warn' },
  { id: 2, ts: '2026-05-31 09:14', region: 'Africa',        metric: 'sessions', value: 3100,  threshold: 4000,  severity: 'warn' },
  { id: 3, ts: '2026-05-30 18:55', region: 'Asia Pacific',  metric: 'conversion', value: 2.8, threshold: 3.0,   severity: 'crit' },
  { id: 4, ts: '2026-05-29 11:40', region: 'Europe',        metric: 'sessions', value: 18200, threshold: 20000, severity: 'warn' },
  { id: 5, ts: '2026-05-28 22:10', region: 'Middle East',   metric: 'sessions', value: 1900,  threshold: 2000,  severity: 'warn' },
  { id: 6, ts: '2026-05-27 07:03', region: 'South America', metric: 'sessions', value: 4600,  threshold: 5000,  severity: 'crit' },
  { id: 7, ts: '2026-05-26 13:27', region: 'Africa',        metric: 'sessions', value: 2800,  threshold: 4000,  severity: 'warn' },
  { id: 8, ts: '2026-05-25 16:44', region: 'Europe',        metric: 'sessions', value: 19800, threshold: 20000, severity: 'warn' },
  { id: 9, ts: '2026-05-24 05:58', region: 'Asia Pacific',  metric: 'conversion', value: 2.9, threshold: 3.0,   severity: 'warn' },
  { id: 10,ts: '2026-05-23 20:31', region: 'South America', metric: 'sessions', value: 4100,  threshold: 5000,  severity: 'crit' },
];

// ─── Pure helpers ────────────────────────────────────────────────────────────

function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return (n / 1000).toFixed(0) + 'K';
  return n.toString();
}

function fmtDollar(n) {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return '$' + (n / 1000).toFixed(0) + 'K';
  return '$' + n.toString();
}

function getLatencyColor(ms) {
  if (ms <= 30) return '#22d3ee';
  if (ms <= 50) return '#f5b731';
  if (ms <= 75) return '#f97316';
  return '#ef4444';
}

function getTrafficColor(traffic) {
  if (traffic === 'high')   return '#f5b731';
  if (traffic === 'medium') return '#22d3ee';
  return '#6e7191';
}

function buildDonutSlices(languages) {
  const total = languages.reduce((s, l) => s + l.users, 0);
  let cumAngle = -90;
  return languages.map(l => {
    const angle = (l.users / total) * 360;
    const startAngle = cumAngle;
    cumAngle += angle;
    const endAngle = cumAngle;
    const r = 80;
    const cx = 110;
    const cy = 110;
    const toRad = deg => (deg * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));
    const ri = 44;
    const ix1 = cx + ri * Math.cos(toRad(startAngle));
    const iy1 = cy + ri * Math.sin(toRad(startAngle));
    const ix2 = cx + ri * Math.cos(toRad(endAngle));
    const iy2 = cy + ri * Math.sin(toRad(endAngle));
    const large = angle > 180 ? 1 : 0;
    const path = `M ${ix1} ${iy1} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${ri} ${ri} 0 ${large} 0 ${ix1} ${iy1} Z`;
    return { ...l, path, midAngle: startAngle + angle / 2, pct: ((l.users / total) * 100).toFixed(1) };
  });
}

// ─── Sub-components (module scope only) ──────────────────────────────────────

function HotspotPopup({ spot }) {
  return (
    <div style={{
      position: 'absolute',
      left: Math.min(spot.svgX + 10, 760),
      top: spot.svgY + 10,
      zIndex: 50,
      background: '#16161e',
      border: '1px solid rgba(245,183,49,0.4)',
      borderRadius: 10,
      padding: '12px 14px',
      minWidth: 180,
      boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
      pointerEvents: 'none',
    }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: '#f5b731', marginBottom: 8 }}>{spot.city}</div>
      {[
        ['Sessions',    fmt(spot.sessions)],
        ['Revenue',     fmtDollar(spot.revenue)],
        ['Conversion',  spot.conversion.toFixed(1) + '%'],
        ['Traffic',     spot.traffic],
      ].map(([label, val]) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, marginBottom: 3 }}>
          <span style={{ color: '#6e7191' }}>{label}</span>
          <span style={{ color: '#e4e4ed', fontWeight: 700 }}>{val}</span>
        </div>
      ))}
    </div>
  );
}

function RegionTable({ rows }) {
  const [sortKey, setSortKey]   = useState('sessions');
  const [sortDir, setSortDir]   = useState('desc');
  const [search, setSearch]     = useState('');
  const [expanded, setExpanded] = useState(null);

  const cols = [
    { key: 'region',     label: 'Region',      sortable: false },
    { key: 'sessions',   label: 'Sessions',    sortable: true  },
    { key: 'revenue',    label: 'Revenue',     sortable: true  },
    { key: 'conversion', label: 'Conv %',      sortable: true  },
    { key: 'growth',     label: 'Growth',      sortable: true  },
    { key: '_actions',   label: '',            sortable: false },
  ];

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const filtered = rows
    .filter(r => r.region.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const av = parseFloat(a[sortKey]) || 0;
      const bv = parseFloat(b[sortKey]) || 0;
      return sortDir === 'asc' ? av - bv : bv - av;
    });

  return (
    <div style={{ background: 'var(--surface2)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#e4e4ed' }}>Region Breakdown</span>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search regions…"
          style={{ background: '#0e0e16', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 7, padding: '5px 10px', fontSize: 11, color: '#e4e4ed', outline: 'none', width: 180 }}
        />
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {cols.map(c => (
                <th key={c.key}
                  onClick={() => c.sortable && handleSort(c.key)}
                  style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, color: sortKey === c.key ? 'var(--gold)' : 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', cursor: c.sortable ? 'pointer' : 'default', whiteSpace: 'nowrap', userSelect: 'none' }}>
                  {c.label}{c.sortable && (sortKey === c.key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ↕')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => {
              const isExpanded = expanded === r.region;
              const isPos = r.growth.startsWith('+');
              return (
                <>
                  <tr key={r.region} style={{ borderBottom: isExpanded ? 'none' : '1px solid var(--border)', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#16161e'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '11px 14px' }}>
                      <span style={{ fontSize: 16, marginRight: 8 }}>{r.flag}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#e4e4ed' }}>{r.region}</span>
                    </td>
                    <td style={{ padding: '11px 14px', fontSize: 12, color: 'var(--gold)', fontWeight: 700 }}>{fmt(r.sessions)}</td>
                    <td style={{ padding: '11px 14px', fontSize: 12, color: '#a78bfa', fontWeight: 700 }}>{fmtDollar(r.revenue)}</td>
                    <td style={{ padding: '11px 14px', fontSize: 12, color: '#22d3ee', fontWeight: 700 }}>{r.conversion}%</td>
                    <td style={{ padding: '11px 14px', fontSize: 12, fontWeight: 700, color: isPos ? '#22c55e' : '#ef4444' }}>{isPos ? '▲' : '▼'} {r.growth}%</td>
                    <td style={{ padding: '11px 14px' }}>
                      <button onClick={() => setExpanded(isExpanded ? null : r.region)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)', background: isExpanded ? 'rgba(245,183,49,0.1)' : '#0e0e16', color: isExpanded ? 'var(--gold)' : 'var(--muted)', cursor: 'pointer', fontSize: 10, fontWeight: 600 }}>
                        {isExpanded ? '▲ Hide' : '▼ View Details'}
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={r.region + '-expand'} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td colSpan={6} style={{ padding: '0 14px 12px 14px', background: 'rgba(245,183,49,0.03)' }}>
                        <div style={{ fontSize: 10.5, color: 'var(--muted)', marginBottom: 8, marginTop: 8 }}>City Breakdown</div>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                          {(CITY_BREAKDOWN[r.region] || []).map(c => (
                            <div key={c.city} style={{ padding: '6px 12px', background: '#0e0e16', borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 12, alignItems: 'center' }}>
                              <span style={{ fontSize: 11, color: '#e4e4ed', fontWeight: 600 }}>{c.city}</span>
                              <span style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 700 }}>{fmt(c.sessions)}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TimezoneChart({ hourlyData, revenueData }) {
  const maxSessions = Math.max(...hourlyData);
  const maxRevenue  = Math.max(...revenueData);
  const W = 860, H = 180, padL = 32, padB = 24, padT = 12, barW = (W - padL) / 24 - 2;
  // Find peak hour
  let peakHour = 0;
  let peakVal = 0;
  hourlyData.forEach((v, i) => { if (v > peakVal) { peakVal = v; peakHour = i; } });

  // Revenue line path
  const rPts = revenueData.map((v, i) => {
    const x = padL + i * ((W - padL) / 24) + barW / 2;
    const y = padT + (H - padT - padB) * (1 - v / maxRevenue);
    return `${x},${y}`;
  });
  const linePath = 'M ' + rPts.join(' L ');

  return (
    <div style={{ background: 'var(--surface2)', borderRadius: 14, border: '1px solid var(--border)', padding: '20px 20px 14px', marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#e4e4ed' }}>
          24-Hour Session Volume
          <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 400, marginLeft: 8 }}>with revenue overlay</span>
        </div>
        <div style={{ display: 'flex', gap: 14, fontSize: 10, color: 'var(--muted)' }}>
          <span><span style={{ color: '#22d3ee' }}>■</span> Sessions</span>
          <span><span style={{ color: '#f5b731' }}>—</span> Revenue</span>
          <span><span style={{ color: '#f5b731' }}>★</span> Peak {peakHour}:00</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map(f => {
          const y = padT + (H - padT - padB) * (1 - f);
          return <line key={f} x1={padL} y1={y} x2={W} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />;
        })}
        {/* Bars */}
        {hourlyData.map((v, i) => {
          const x = padL + i * ((W - padL) / 24) + 1;
          const barH = (v / maxSessions) * (H - padT - padB);
          const y = padT + (H - padT - padB) - barH;
          const isPeak = i === peakHour;
          return (
            <rect key={i} x={x} y={y} width={barW} height={barH} rx="2"
              fill={isPeak ? '#f5b731' : '#22d3ee'}
              fillOpacity={isPeak ? 0.9 : 0.45}
            />
          );
        })}
        {/* Revenue line */}
        <path d={linePath} fill="none" stroke="#f5b731" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
        {/* Revenue dots */}
        {revenueData.map((v, i) => {
          const x = padL + i * ((W - padL) / 24) + barW / 2;
          const y = padT + (H - padT - padB) * (1 - v / maxRevenue);
          return <circle key={i} cx={x} cy={y} r="2.5" fill="#f5b731" fillOpacity="0.8" />;
        })}
        {/* X-axis labels */}
        {[0, 4, 8, 12, 16, 20, 23].map(h => {
          const x = padL + h * ((W - padL) / 24) + barW / 2;
          return <text key={h} x={x} y={H - 4} textAnchor="middle" fill="#6e7191" fontSize="9" fontFamily="DM Mono, monospace">{h}:00</text>;
        })}
      </svg>
      {/* Peak callout */}
      <div style={{ marginTop: 8, padding: '7px 14px', background: 'rgba(245,183,49,0.08)', borderRadius: 8, border: '1px solid rgba(245,183,49,0.2)', display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 11 }}>
        <span style={{ color: '#f5b731', fontWeight: 700 }}>★ Peak Hour: {peakHour}:00 UTC</span>
        <span style={{ color: 'var(--muted)' }}>{fmt(hourlyData[peakHour])} sessions</span>
        <span style={{ color: '#a78bfa' }}>{fmtDollar(revenueData[peakHour])} revenue</span>
      </div>
    </div>
  );
}

function LanguageDonut({ slices, onSelect, selected }) {
  const [hovered, setHovered] = useState(null);
  return (
    <svg viewBox="0 0 220 220" style={{ width: 220, flexShrink: 0 }}>
      {slices.map((s) => {
        const isActive = selected === s.lang || hovered === s.lang;
        return (
          <path key={s.lang} d={s.path}
            fill={s.color}
            fillOpacity={isActive ? 0.95 : 0.6}
            stroke="#0e0e16" strokeWidth="2"
            style={{ cursor: 'pointer', transition: 'fill-opacity 0.15s', transform: isActive ? `translate(${Math.cos((s.midAngle * Math.PI) / 180) * 4}px, ${Math.sin((s.midAngle * Math.PI) / 180) * 4}px)` : 'none' }}
            onClick={() => onSelect(selected === s.lang ? null : s.lang)}
            onMouseEnter={() => setHovered(s.lang)}
            onMouseLeave={() => setHovered(null)}
          >
            <title>{s.lang}: {s.pct}%</title>
          </path>
        );
      })}
      <text x="110" y="105" textAnchor="middle" fill="#e4e4ed" fontSize="14" fontWeight="800" fontFamily="Syne, sans-serif">
        {slices.reduce((s, l) => s + l.users, 0) >= 1000000
          ? (slices.reduce((s, l) => s + l.users, 0) / 1000000).toFixed(1) + 'M'
          : fmt(slices.reduce((s, l) => s + l.users, 0))}
      </text>
      <text x="110" y="119" textAnchor="middle" fill="#6e7191" fontSize="9" fontFamily="DM Mono, monospace">users</text>
    </svg>
  );
}

function GeoAlerts({ alerts, setAlerts }) {
  return (
    <div>
      <div style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
        {alerts.map(a => (
          <div key={a.id} style={{ padding: '14px 18px', background: 'var(--surface2)', borderRadius: 12, border: `1px solid ${a.enabled ? 'rgba(245,183,49,0.2)' : 'rgba(255,255,255,0.07)'}`, display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={() => setAlerts(prev => prev.map(x => x.id === a.id ? { ...x, enabled: !x.enabled } : x))} style={{ width: 38, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer', position: 'relative', background: a.enabled ? '#f5b731' : '#333344', transition: 'background 0.2s', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 3, left: a.enabled ? 18 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: a.enabled ? '#e4e4ed' : 'var(--muted)', fontWeight: 600 }}>
                Alert when traffic from <span style={{ color: a.enabled ? 'var(--gold)' : 'var(--muted)', fontWeight: 700 }}>{a.region}</span> {a.condition} <span style={{ color: '#22d3ee', fontWeight: 700 }}>{fmt(a.threshold)}</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{a.metric} • {a.enabled ? '🟢 Active' : '⚫ Disabled'}</div>
            </div>
            <span style={{ fontSize: 9.5, padding: '3px 8px', borderRadius: 6, background: a.enabled ? 'rgba(245,183,49,0.1)' : 'transparent', color: a.enabled ? 'var(--gold)' : 'var(--muted)', border: `1px solid ${a.enabled ? 'rgba(245,183,49,0.2)' : 'var(--border)'}`, fontWeight: 700 }}>
              {a.enabled ? 'MONITORING' : 'OFF'}
            </span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#e4e4ed', marginBottom: 10 }}>Alert History (last 10)</div>
      <div style={{ background: 'var(--surface2)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
        {ALERT_HISTORY.map((h, i) => (
          <div key={h.id} style={{ padding: '10px 14px', borderBottom: i < ALERT_HISTORY.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 14 }}>{h.severity === 'crit' ? '🔴' : '🟡'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#e4e4ed', fontWeight: 600 }}>{h.region} — {h.metric} dropped to <span style={{ color: h.severity === 'crit' ? '#ef4444' : '#f97316', fontWeight: 700 }}>{typeof h.value === 'number' && h.value > 100 ? fmt(h.value) : h.value}</span></div>
              <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 1 }}>Threshold: {typeof h.threshold === 'number' && h.threshold > 100 ? fmt(h.threshold) : h.threshold} • {h.ts}</div>
            </div>
            <span style={{ fontSize: 9.5, padding: '2px 7px', borderRadius: 4, background: h.severity === 'crit' ? 'rgba(239,68,68,0.1)' : 'rgba(249,115,22,0.1)', color: h.severity === 'crit' ? '#ef4444' : '#f97316', border: `1px solid ${h.severity === 'crit' ? 'rgba(239,68,68,0.3)' : 'rgba(249,115,22,0.3)'}`, fontWeight: 700 }}>
              {h.severity.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function GeoAnalytics() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredRegion,  setHoveredRegion]  = useState(null);
  const [liveFeed,       setLiveFeed]       = useState([]);
  const [activeTab,      setActiveTab]      = useState('map');
  const feedRef = useRef(null);

  // Heatmap hotspot state (sessions updated every 5s)
  const [hotspots,       setHotspots]       = useState(() => CITY_HOTSPOTS.map(h => ({ ...h, sessions: h.baseSessions })));
  const [hoveredSpot,    setHoveredSpot]    = useState(null);
  const [clickedSpot,    setClickedSpot]    = useState(null);

  // Hourly chart data
  const [hourlyData,     setHourlyData]     = useState(BASE_HOURLY);
  const [revenueData]                       = useState(BASE_REVENUE);

  // Language donut
  const [selectedLang,   setSelectedLang]   = useState(null);
  const donutSlices = buildDonutSlices(LANGUAGES);

  // Geo alerts
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);

  // Sort / search for region table
  const totalCalls = REGIONS.reduce((a, r) => a + r.calls, 0);
  const countries  = REGIONS.reduce((a, r) => a + r.countries.length, 0);
  const currentHour = new Date().getHours();

  // Live request feed
  useEffect(() => {
    const interval = setInterval(() => {
      const country  = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
      const endpoint = ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)];
      const latency  = Math.floor(country.latency * (0.8 + Math.random() * 0.4));
      setLiveFeed(prev => [{
        id: Date.now() + Math.random(),
        flag: country.flag, country: country.name, endpoint, latency,
        ts: new Date().toLocaleTimeString(), ok: latency < 200,
      }, ...prev].slice(0, 20));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Update hotspot sizes every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setHotspots(prev => prev.map(h => ({
        ...h,
        sessions: Math.max(1000, h.baseSessions + Math.floor((Math.random() - 0.5) * h.baseSessions * 0.08)),
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Pulse hourly data every 10s (minor jitter)
  useEffect(() => {
    const interval = setInterval(() => {
      setHourlyData(prev => prev.map(v => Math.max(100, v + Math.floor((Math.random() - 0.5) * 60))));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const getRegionIntensity = (r) => {
    const maxC = Math.max(...REGIONS.map(rr => rr.calls));
    return r.calls / maxC;
  };

  const maxHotspotSessions = Math.max(...hotspots.map(h => h.sessions));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)', color: '#e4e4ed', paddingBottom: 80, fontFamily: 'DM Mono, monospace' }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div style={{ padding: '32px 32px 24px', borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg,rgba(167,139,250,0.05) 0%,transparent 60%)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, background: 'linear-gradient(135deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8, fontFamily: 'Syne, sans-serif' }}>
              🌍 Geo Analytics
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>Global API usage heatmap • Real-time regional intelligence</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { label: `${countries} Countries Active`, color: '#a78bfa' },
                { label: `${fmt(totalCalls)} API Calls`,  color: '#f5b731' },
                { label: `${REGIONS.length} Regions`,     color: '#22d3ee' },
                { label: `${REGIONS.filter(r => r.gdpr).length} GDPR Regions`, color: '#22d3ee' },
              ].map((b, i) => (
                <span key={i} style={{ padding: '4px 12px', borderRadius: 999, fontSize: 11.5, fontWeight: 700, background: `${b.color}15`, color: b.color, border: `1px solid ${b.color}30` }}>{b.label}</span>
              ))}
            </div>
          </div>
          <button onClick={() => alert('Regional report export initiated!')} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface2)', color: '#e4e4ed', cursor: 'pointer', fontSize: 12 }}>📊 Export Report</button>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────── */}
      <div style={{ padding: '0 32px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 4, overflowX: 'auto' }}>
        {[
          ['map',       '🗺️ World Map'],
          ['heatmap',   '🔥 Live Heatmap'],
          ['regions',   '📊 Region Table'],
          ['timezones', '⏱️ Time Zones'],
          ['languages', '🌐 Languages'],
          ['alerts',    '🚨 Alerts'],
          ['countries', '🏳️ Countries'],
          ['latency',   '⚡ Latency Grid'],
        ].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{ padding: '12px 16px', border: 'none', cursor: 'pointer', fontSize: 11.5, fontWeight: 600, background: 'transparent', color: activeTab === id ? '#a78bfa' : 'var(--muted)', borderBottom: activeTab === id ? '2px solid #a78bfa' : '2px solid transparent', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 0, minHeight: 500 }}>

        {/* ── Main content ─────────────────────────────────────── */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px' }}>

          {/* ── Tab: World Map (original) ─────────────────────── */}
          {activeTab === 'map' && (
            <div>
              <div style={{ background: 'var(--surface2)', borderRadius: 14, border: '1px solid var(--border)', padding: 20, marginBottom: 20, overflow: 'hidden' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#e4e4ed', marginBottom: 14 }}>
                  Global API Heat Map <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 400 }}>— click a region to drill down</span>
                </div>
                <svg viewBox="0 0 900 400" style={{ width: '100%', borderRadius: 10, background: 'rgba(0,0,0,0.3)' }}>
                  <rect x="0" y="0" width="900" height="400" fill="rgba(14,14,22,0.8)" />
                  {[100,200,300,400,500,600,700,800].map(x => <line key={x} x1={x} y1="0" x2={x} y2="400" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />)}
                  {[80,160,240,320].map(y => <line key={y} x1="0" y1={y} x2="900" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />)}
                  <line x1="0" y1="200" x2="900" y2="200" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
                  {REGIONS.map(r => {
                    const intensity  = getRegionIntensity(r);
                    const isSelected = selectedRegion?.id === r.id;
                    const isHovered  = hoveredRegion === r.id;
                    const alpha = 0.15 + intensity * 0.65;
                    return (
                      <g key={r.id} onClick={() => setSelectedRegion(selectedRegion?.id === r.id ? null : r)} onMouseEnter={() => setHoveredRegion(r.id)} onMouseLeave={() => setHoveredRegion(null)} style={{ cursor: 'pointer' }}>
                        <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="8" fill={r.color} fillOpacity={isHovered ? alpha + 0.15 : alpha} stroke={isSelected ? r.color : 'rgba(255,255,255,0.1)'} strokeWidth={isSelected ? 2 : 1} />
                        {isSelected && <rect x={r.x - 2} y={r.y - 2} width={r.w + 4} height={r.h + 4} rx="10" fill="none" stroke={r.color} strokeWidth="1" strokeOpacity="0.4" />}
                        <text x={r.x + r.w / 2} y={r.y + r.h / 2 - 8} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" style={{ userSelect: 'none', fontFamily: 'sans-serif' }}>{r.name}</text>
                        <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 8} textAnchor="middle" fill={r.color} fontSize="11" fontWeight="800" style={{ userSelect: 'none', fontFamily: 'sans-serif' }}>{fmt(r.calls)}</text>
                        {r.gdpr && <text x={r.x + r.w - 12} y={r.y + 16} textAnchor="middle" fontSize="10" style={{ userSelect: 'none' }}>🛡️</text>}
                      </g>
                    );
                  })}
                  {REGIONS.slice(0, 3).map((r, i) => (
                    <circle key={`pulse-${r.id}`} cx={r.x + r.w / 2} cy={r.y + r.h / 2} r={6 + i} fill={r.color} fillOpacity="0.3">
                      <animate attributeName="r" from={4} to={16} dur="2s" repeatCount="indefinite" begin={`${i * 0.5}s`} />
                      <animate attributeName="fill-opacity" from={0.5} to={0} dur="2s" repeatCount="indefinite" begin={`${i * 0.5}s`} />
                    </circle>
                  ))}
                </svg>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                  <span style={{ fontSize: 10, color: 'var(--muted)' }}>Low traffic</span>
                  <div style={{ flex: 1, height: 6, borderRadius: 999, background: 'linear-gradient(90deg,rgba(245,183,49,0.15),rgba(245,183,49,0.9))' }} />
                  <span style={{ fontSize: 10, color: 'var(--muted)' }}>High traffic</span>
                  <span style={{ fontSize: 10, color: 'var(--muted)', marginLeft: 12 }}>🛡️ GDPR region</span>
                </div>
              </div>

              {selectedRegion && (
                <div style={{ padding: 20, background: 'var(--surface2)', borderRadius: 14, border: `1px solid ${selectedRegion.color}40`, marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: selectedRegion.color }}>{selectedRegion.name}</div>
                    {selectedRegion.gdpr && <span style={{ fontSize: 10, padding: '3px 8px', background: 'rgba(34,211,238,0.1)', color: '#22d3ee', borderRadius: 4, border: '1px solid #22d3ee', fontWeight: 700 }}>🛡️ GDPR Compliant</span>}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                    {[
                      { label: 'API Calls',    value: fmt(selectedRegion.calls),                  color: selectedRegion.color },
                      { label: 'Success Rate', value: `${selectedRegion.success}%`,               color: '#22d3ee' },
                      { label: 'Avg Latency',  value: `${selectedRegion.latency}ms`,              color: '#f5b731' },
                      { label: 'Monthly Cost', value: `$${selectedRegion.cost.toLocaleString()}`, color: '#a78bfa' },
                    ].map(s => (
                      <div key={s.label} style={{ padding: 12, background: '#0e0e16', borderRadius: 10 }}>
                        <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>Countries:</span>
                    {selectedRegion.countries.map(c => <span key={c} style={{ fontSize: 10, padding: '2px 6px', background: '#0e0e16', borderRadius: 4, color: '#e4e4ed', border: '1px solid var(--border)' }}>{c}</span>)}
                  </div>
                </div>
              )}

              <div style={{ background: 'var(--surface2)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontSize: 12, fontWeight: 700, color: '#e4e4ed' }}>Region Summary</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Region','API Calls','Success Rate','Avg Latency','Monthly Cost','GDPR'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {REGIONS.slice().sort((a, b) => b.calls - a.calls).map(r => (
                      <tr key={r.id} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                        onClick={() => setSelectedRegion(r)}
                        onMouseEnter={e => e.currentTarget.style.background = '#16161e'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color }} />
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#e4e4ed' }}>{r.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 12, color: r.color, fontWeight: 700 }}>{fmt(r.calls)}</td>
                        <td style={{ padding: '12px 16px', fontSize: 12, color: r.success >= 99 ? '#22d3ee' : '#f5b731' }}>{r.success}%</td>
                        <td style={{ padding: '12px 16px', fontSize: 12, color: getLatencyColor(r.latency) }}>{r.latency}ms</td>
                        <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--muted)' }}>${r.cost.toLocaleString()}</td>
                        <td style={{ padding: '12px 16px', fontSize: 12 }}>{r.gdpr ? '✅' : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Tab: Live Heatmap ─────────────────────────────── */}
          {activeTab === 'heatmap' && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 14 }}>
                Hotspot circles update every 5s · Click a city for details
              </div>
              <div style={{ background: 'var(--surface2)', borderRadius: 14, border: '1px solid var(--border)', padding: 20, marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#e4e4ed', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                  Live World Heatmap
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 8px #22d3ee', animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 400 }}>— {hotspots.length} city hotspots</span>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 14, fontSize: 10 }}>
                    {[['High', '#f5b731'], ['Medium', '#22d3ee'], ['Low', '#6e7191']].map(([l, c]) => (
                      <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block' }} />
                        <span style={{ color: 'var(--muted)' }}>{l}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ position: 'relative' }}>
                  <svg viewBox="0 0 900 400" style={{ width: '100%', borderRadius: 10, background: 'rgba(0,0,0,0.4)', display: 'block' }}>
                    {/* Ocean */}
                    <rect x="0" y="0" width="900" height="400" fill="#060610" />
                    {/* Grid */}
                    {[0,1,2,3,4,5,6,7,8].map(i => <line key={`vg${i}`} x1={i*112} y1="0" x2={i*112} y2="400" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />)}
                    {[0,1,2,3,4].map(i => <line key={`hg${i}`} x1="0" y1={i*100} x2="900" y2={i*100} stroke="rgba(255,255,255,0.025)" strokeWidth="1" />)}
                    <line x1="0" y1="200" x2="900" y2="200" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 6" />
                    {/* Continent outlines — rough polygons */}
                    {/* North America */}
                    <polygon points="60,90 220,90 260,120 270,200 240,270 180,290 120,300 80,260 55,200 50,140" fill="rgba(30,30,50,0.7)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    {/* South America */}
                    <polygon points="155,295 240,295 260,320 255,370 225,390 180,385 155,360 148,330" fill="rgba(30,30,50,0.7)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    {/* Europe */}
                    <polygon points="375,75 530,75 545,95 520,140 480,155 440,155 390,130 368,110" fill="rgba(30,30,50,0.7)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    {/* Africa */}
                    <polygon points="390,155 520,155 545,200 535,290 500,350 455,365 420,355 390,300 370,250 375,200" fill="rgba(30,30,50,0.7)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    {/* Middle East */}
                    <polygon points="525,155 610,155 630,175 625,215 585,225 540,220 520,200" fill="rgba(30,30,50,0.7)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    {/* Asia */}
                    <polygon points="530,70 860,70 880,90 870,200 840,230 800,250 750,240 700,215 660,190 630,175 610,155 550,140 540,100" fill="rgba(30,30,50,0.7)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    {/* Australia */}
                    <polygon points="740,270 860,270 875,310 860,350 815,365 760,355 738,320" fill="rgba(30,30,50,0.7)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

                    {/* Hotspot glow rings */}
                    {hotspots.map(h => {
                      const r = 8 + (h.sessions / maxHotspotSessions) * 24;
                      const col = getTrafficColor(h.traffic);
                      return (
                        <circle key={h.id + '-glow'} cx={h.svgX} cy={h.svgY} r={r + 6} fill={col} fillOpacity="0.06" />
                      );
                    })}
                    {/* Hotspot circles */}
                    {hotspots.map(h => {
                      const r = 8 + (h.sessions / maxHotspotSessions) * 24;
                      const col = getTrafficColor(h.traffic);
                      const isHigh = h.traffic === 'high';
                      return (
                        <g key={h.id} style={{ cursor: 'pointer' }}
                          onClick={() => setClickedSpot(clickedSpot?.id === h.id ? null : h)}
                          onMouseEnter={() => setHoveredSpot(h)}
                          onMouseLeave={() => setHoveredSpot(null)}>
                          {isHigh && (
                            <circle cx={h.svgX} cy={h.svgY} r={r} fill={col} fillOpacity="0.18">
                              <animate attributeName="r" from={r} to={r + 10} dur="2s" repeatCount="indefinite" />
                              <animate attributeName="fill-opacity" from="0.18" to="0" dur="2s" repeatCount="indefinite" />
                            </circle>
                          )}
                          <circle cx={h.svgX} cy={h.svgY} r={r} fill={col} fillOpacity={clickedSpot?.id === h.id ? 0.95 : 0.7} stroke={col} strokeWidth={clickedSpot?.id === h.id ? 2 : 0.5} strokeOpacity="0.8" />
                          <text x={h.svgX} y={h.svgY + 3} textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700" style={{ userSelect: 'none', pointerEvents: 'none', fontFamily: 'DM Mono, monospace' }}>
                            {h.city.length > 8 ? h.city.slice(0, 7) + '…' : h.city}
                          </text>
                        </g>
                      );
                    })}
                    {/* Labels for continents */}
                    {[['N. America',155,195],['S. America',200,345],['Europe',450,115],['Africa',452,265],['Asia',695,150],['Australia',808,315],['M. East',572,190]].map(([l,x,y]) => (
                      <text key={l} x={x} y={y} textAnchor="middle" fill="rgba(255,255,255,0.18)" fontSize="9" fontFamily="sans-serif" style={{ userSelect: 'none', pointerEvents: 'none' }}>{l}</text>
                    ))}
                  </svg>
                  {/* Popup for hovered / clicked spot */}
                  {(clickedSpot || hoveredSpot) && (
                    <HotspotPopup spot={clickedSpot || hoveredSpot} onClose={() => setClickedSpot(null)} />
                  )}
                </div>
              </div>

              {/* City table */}
              <div style={{ background: 'var(--surface2)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontSize: 12, fontWeight: 700, color: '#e4e4ed' }}>City Hotspot Details</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['City','Traffic Level','Sessions','Revenue','Conversion'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {hotspots.slice().sort((a, b) => b.sessions - a.sessions).map(h => {
                      const col = getTrafficColor(h.traffic);
                      return (
                        <tr key={h.id} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                          onClick={() => setClickedSpot(clickedSpot?.id === h.id ? null : h)}
                          onMouseEnter={e => e.currentTarget.style.background = '#16161e'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '11px 16px', fontSize: 12, fontWeight: 600, color: '#e4e4ed' }}>{h.city}</td>
                          <td style={{ padding: '11px 16px' }}>
                            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: `${col}18`, color: col, border: `1px solid ${col}40`, fontWeight: 700, textTransform: 'uppercase' }}>{h.traffic}</span>
                          </td>
                          <td style={{ padding: '11px 16px', fontSize: 12, color: col, fontWeight: 700 }}>{fmt(h.sessions)}</td>
                          <td style={{ padding: '11px 16px', fontSize: 12, color: '#a78bfa', fontWeight: 700 }}>{fmtDollar(h.revenue)}</td>
                          <td style={{ padding: '11px 16px', fontSize: 12, color: '#22d3ee', fontWeight: 700 }}>{h.conversion.toFixed(1)}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Tab: Region Table ─────────────────────────────── */}
          {activeTab === 'regions' && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 14 }}>
                12 regions — sortable columns · search · expand for city breakdown
              </div>
              <RegionTable rows={REGION_ROWS} />
            </div>
          )}

          {/* ── Tab: Timezones ────────────────────────────────── */}
          {activeTab === 'timezones' && (
            <div>
              <TimezoneChart hourlyData={hourlyData} revenueData={revenueData} />
              <div style={{ fontSize: 14, fontWeight: 700, color: '#e4e4ed', marginBottom: 8 }}>Peak Usage Hours by Region</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 20 }}>
                Current hour: <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{currentHour}:00 UTC</span>
              </div>
              {TIMEZONES.map(tz => (
                <div key={tz.tz} style={{ marginBottom: 14, padding: '14px 16px', background: 'var(--surface2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#e4e4ed' }}>{tz.label}</span>
                      <span style={{ fontSize: 10, color: 'var(--muted)', marginLeft: 8 }}>{tz.tz}</span>
                    </div>
                    {tz.peak.includes(currentHour) && (
                      <span style={{ fontSize: 9.5, padding: '2px 8px', background: 'rgba(34,211,238,0.15)', color: '#22d3ee', borderRadius: 4, border: '1px solid #22d3ee', fontWeight: 700 }}>◉ PEAK NOW</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {Array.from({ length: 24 }, (_, h) => {
                      const isPeak   = tz.peak.includes(h);
                      const isCurrent = h === currentHour;
                      return (
                        <div key={h} style={{ flex: 1, height: 20, borderRadius: 3, background: isPeak ? 'rgba(34,211,238,0.5)' : 'var(--surface3,#1c1c2a)', border: isCurrent ? '1px solid var(--gold)' : '1px solid transparent' }} title={`${h}:00 UTC`} />
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 9, color: 'var(--muted)' }}>
                    <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Tab: Languages ────────────────────────────────── */}
          {activeTab === 'languages' && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 20 }}>Click a slice to see top pages for that language</div>
              <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 20 }}>
                <LanguageDonut slices={donutSlices} onSelect={setSelectedLang} selected={selectedLang} />
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {donutSlices.map(s => (
                      <div key={s.lang} onClick={() => setSelectedLang(selectedLang === s.lang ? null : s.lang)} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 12px', borderRadius: 8, background: selectedLang === s.lang ? `${s.color}10` : 'transparent', border: selectedLang === s.lang ? `1px solid ${s.color}40` : '1px solid transparent', transition: 'all 0.15s' }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#e4e4ed', flex: 1 }}>{s.lang}</span>
                        <span style={{ fontSize: 11, color: s.color, fontWeight: 700 }}>{s.pct}%</span>
                        <span style={{ fontSize: 10, color: 'var(--muted)' }}>{fmt(s.users)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedLang && (
                <div style={{ padding: '14px 18px', background: 'rgba(245,183,49,0.06)', borderRadius: 12, border: '1px solid rgba(245,183,49,0.2)', marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)', marginBottom: 8 }}>Top pages for {selectedLang} speakers</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {(LANG_TOP_PAGES[selectedLang] || []).map(p => (
                      <span key={p} style={{ fontSize: 11, padding: '4px 10px', background: '#0e0e16', borderRadius: 6, border: '1px solid var(--border)', color: '#e4e4ed', fontFamily: 'DM Mono, monospace' }}>{p}</span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ background: 'var(--surface2)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontSize: 12, fontWeight: 700, color: '#e4e4ed' }}>Language Distribution</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Language','Users','Pages / Session','Bounce Rate'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {LANGUAGES.map(l => (
                      <tr key={l.lang} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer', background: selectedLang === l.lang ? `${l.color}08` : 'transparent' }}
                        onClick={() => setSelectedLang(selectedLang === l.lang ? null : l.lang)}
                        onMouseEnter={e => e.currentTarget.style.background = '#16161e'}
                        onMouseLeave={e => e.currentTarget.style.background = selectedLang === l.lang ? `${l.color}08` : 'transparent'}>
                        <td style={{ padding: '11px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#e4e4ed' }}>{l.lang}</span>
                          </div>
                        </td>
                        <td style={{ padding: '11px 16px', fontSize: 12, color: l.color, fontWeight: 700 }}>{fmt(l.users)}</td>
                        <td style={{ padding: '11px 16px', fontSize: 12, color: '#22d3ee', fontWeight: 700 }}>{l.pagesPerSession}</td>
                        <td style={{ padding: '11px 16px', fontSize: 12, color: l.bounceRate > 40 ? '#ef4444' : l.bounceRate > 32 ? '#f97316' : '#22c55e', fontWeight: 700 }}>{l.bounceRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Tab: Alerts ───────────────────────────────────── */}
          {activeTab === 'alerts' && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 16 }}>Configure geo-fence alerts — triggered when regional traffic drops below threshold</div>
              <GeoAlerts alerts={alerts} setAlerts={setAlerts} />
            </div>
          )}

          {/* ── Tab: Countries ────────────────────────────────── */}
          {activeTab === 'countries' && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#e4e4ed', marginBottom: 16 }}>Top 10 Countries by API Usage</div>
              {COUNTRIES.map((c, i) => {
                const maxC = COUNTRIES[0].calls;
                const pct  = (c.calls / maxC) * 100;
                return (
                  <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12, padding: '14px 16px', background: 'var(--surface2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--muted)', minWidth: 24, textAlign: 'right' }}>#{i + 1}</div>
                    <div style={{ fontSize: 22 }}>{c.flag}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#e4e4ed' }}>{c.name}</span>
                        <div style={{ display: 'flex', gap: 16, fontSize: 10.5 }}>
                          <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{fmt(c.calls)}</span>
                          <span style={{ color: '#22d3ee' }}>{c.success}%</span>
                          <span style={{ color: getLatencyColor(c.latency) }}>{c.latency}ms</span>
                          {c.gdpr && <span style={{ color: '#22d3ee' }}>🛡️ GDPR</span>}
                        </div>
                      </div>
                      <div style={{ height: 6, background: '#1c1c2a', borderRadius: 999 }}>
                        <div style={{ height: '100%', borderRadius: 999, width: `${pct}%`, background: 'linear-gradient(90deg,#f5b731,#22d3ee)', transition: 'width 0.5s ease' }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Tab: Latency Grid ─────────────────────────────── */}
          {activeTab === 'latency' && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#e4e4ed', marginBottom: 8 }}>Latency Heatmap (ms) — Origin × Destination</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 20 }}>Average round-trip latency between global data centers</div>
              <div style={{ overflowX: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: `80px repeat(${LATENCY_X.length},1fr)`, minWidth: 600, gap: 3 }}>
                  <div />
                  {LATENCY_X.map(x => <div key={x} style={{ fontSize: 9.5, color: 'var(--gold)', textAlign: 'center', padding: '4px 0', fontWeight: 700 }}>{x}</div>)}
                  {LATENCY_GRID.map((row, ri) => (
                    <>
                      <div key={`row-${ri}`} style={{ fontSize: 9.5, color: 'var(--muted)', display: 'flex', alignItems: 'center', paddingRight: 8, fontWeight: 600 }}>{LATENCY_Y[ri]}</div>
                      {row.map((ms, ci) => {
                        const bg = getLatencyColor(ms);
                        return (
                          <div key={ci} style={{ padding: '10px 4px', borderRadius: 6, background: `${bg}20`, border: `1px solid ${bg}30`, textAlign: 'center', fontSize: 10.5, fontWeight: 700, color: bg }}>{ms}</div>
                        );
                      })}
                    </>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 20, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {[['≤30ms','#22d3ee'],['≤50ms','#f5b731'],['≤75ms','#f97316'],['>75ms','#ef4444']].map(([label, color]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, background: `${color}30`, border: `1px solid ${color}` }} />
                    <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Live Feed Panel ───────────────────────────────────── */}
        <div style={{ width: 300, borderLeft: '1px solid var(--border)', flexShrink: 0, background: 'var(--surface2)', overflowY: 'auto' }} ref={feedRef}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 8px #22d3ee' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#e4e4ed' }}>Live Request Feed</span>
          </div>
          {liveFeed.map(entry => (
            <div key={entry.id} style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ fontSize: 18, flexShrink: 0 }}>{entry.flag}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10.5, color: '#e4e4ed', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.country}</div>
                <div style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono, monospace', marginTop: 1 }}>{entry.endpoint}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: getLatencyColor(entry.latency) }}>{entry.latency}ms</div>
                <div style={{ fontSize: 9, color: 'var(--muted)' }}>{entry.ts}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

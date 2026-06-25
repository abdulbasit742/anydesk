import { useState, useMemo, useEffect, useRef } from 'react';
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

export default function Admin() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [adminLogs, setAdminLogs] = useState([
    "[SYS] Initializing SaaS Super-Admin Interface...",
    "[DB] Connecting to auth user tables...",
    "[SYS] Sweeping Stripe API subscription syncs...",
    "[SYS] Live telemetry sockets connected.",
  ]);
  const [mrrIncrement, setMrrIncrement] = useState(4820);
  const [chartHoverDay, setChartHoverDay] = useState(null);

  // Global feature flags
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [sandboxAutoPass, setSandboxAutoPass] = useState(true);
  const [emailVerifyRequired, setEmailVerifyRequired] = useState(false);
  const [webhookAlertsEnabled, setWebhookAlertsEnabled] = useState(true);
  const [googleAuthBypass, setGoogleAuthBypass] = useState(false);
  const [autoLockDuration, setAutoLockDuration] = useState(15); // minutes

  // Live telemetry console state
  const [consoleLogSearch, setConsoleLogSearch] = useState('');
  const [telemetryActive, setTelemetryActive] = useState(true);

  // Impersonate / Actions states
  const [users, setUsers] = useState([
    { name: "John Doe", email: "john@example.com", plan: "pro", active: true, registeredAt: "2026-05-28", country: "US" },
    { name: "Samantha Vance", email: "samantha@cloud.io", plan: "agency", active: true, registeredAt: "2026-05-30", country: "CA" },
    { name: "Bob Harris", email: "bob@gmail.com", plan: "starter", active: true, registeredAt: "2026-06-01", country: "UK" },
    { name: "Alice Smith", email: "alice@design.co", plan: "trial", active: false, registeredAt: "2026-05-15", country: "AU" },
    { name: "DevOps Engineer", email: "devops@firm.com", plan: "pro", active: true, registeredAt: "2026-05-29", country: "DE" },
    { name: "David Miller", email: "david@mill.com", plan: "starter", active: true, registeredAt: "2026-06-02", country: "FR" },
    { name: "Sarah Connor", email: "sconnor@resistance.net", plan: "agency", active: true, registeredAt: "2026-05-02", country: "US" }
  ]);

  const logEndRef = useRef(null);

  // Background activity console simulator
  useEffect(() => {

    const interval = setInterval(() => {
      if (telemetryActive) {
        const liveEvents = [
          `[STRIPE] New subscription registration: usr_${Math.floor(1000+Math.random()*9000)} (Starter Plan — $19/mo)`,
          `[STRIPE] Recurring payout success: inv_${Math.floor(100000+Math.random()*900000)} ($49.00)`,
          `[SYS] Handshake audit passed on active workspaces.`,
          `[SEC] Scanning keys rotation compliance index... Compliant.`,
          `[DB] Cache database clean: removed 14 expired session profiles.`,
          `[API] Gateway request routing count: threshold=412 calls/sec`
        ];
        const randomEvent = liveEvents[Math.floor(Math.random() * liveEvents.length)];
        setAdminLogs(prev => [...prev.slice(-30), `[${new Date().toLocaleTimeString()}] ${randomEvent}`]);

        // MRR fluctuation simulation
        setMrrIncrement(prev => prev + (Math.random() > 0.65 ? 19 : Math.random() > 0.85 ? -49 : 0));
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [telemetryActive]);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [adminLogs]);

  // Filtering users list
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.country.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPlan = selectedPlanFilter === 'all' || u.plan === selectedPlanFilter;
      const matchStatus = selectedStatusFilter === 'all' || (selectedStatusFilter === 'active' ? u.active : !u.active);
      return matchSearch && matchPlan && matchStatus;
    });
  }, [users, searchQuery, selectedPlanFilter, selectedStatusFilter]);

  const handleActionClick = (actionName, userName) => {
    sound.play('click');
    alert(`[SUPER-ADMIN ACTION] Executing "${actionName}" trigger for ${userName}...`);
  };

  const handleToggleActive = (index) => {
    sound.play('click');
    setUsers(prev => {
      const copy = [...prev];
      copy[index].active = !copy[index].active;
      return copy;
    });
  };

  const handlePlanChange = (index, newPlan) => {
    sound.play('success');
    setUsers(prev => {
      const copy = [...prev];
      copy[index].plan = newPlan;
      return copy;
    });
  };

  // Seeding simulation
  const handleSeedMockData = () => {
    sound.play('success');
    const fakeNames = ['Mick Jagger', 'Keith Richards', 'Charlie Watts', 'Ron Wood', 'Brian Jones'];
    const fakeEmails = ['mick@stones.com', 'keith@stones.com', 'charlie@stones.com', 'ronnie@stones.com', 'brian@stones.com'];
    const plansArr = ['trial', 'starter', 'pro', 'agency'];

    const newItems = fakeNames.map((name, i) => ({
      name,
      email: fakeEmails[i],
      plan: plansArr[Math.floor(Math.random() * plansArr.length)],
      active: Math.random() > 0.2,
      registeredAt: new Date().toISOString().split('T')[0],
      country: ['US', 'UK', 'CA', 'AU', 'DE'][Math.floor(Math.random() * 5)]
    }));

    setUsers(prev => [...prev, ...newItems]);
    setAdminLogs(prev => [...prev, `[SYS] Seeded 5 new developer account records in database...`]);
  };

  const handleResetDatabases = () => {
    sound.play('warning');
    if (confirm("Reset registration database to initial templates?")) {
      setUsers([
        { name: "John Doe", email: "john@example.com", plan: "pro", active: true, registeredAt: "2026-05-28", country: "US" },
        { name: "Samantha Vance", email: "samantha@cloud.io", plan: "agency", active: true, registeredAt: "2026-05-30", country: "CA" }
      ]);
      setAdminLogs(prev => [...prev, `[SYS] Registration tables cleared. Default parameters loaded.`]);
    }
  };

  const handleLogsExport = () => {
    sound.play('success');
    alert("[SYS-LOGGER] Compiling system-wide diagnostic logs files into local disk log file...");
  };

  const mrrSplinePoints = [
    { day: '27-May', val: 4120, cx: 50, cy: 130 },
    { day: '28-May', val: 4280, cx: 120, cy: 110 },
    { day: '29-May', val: 4350, cx: 190, cy: 100 },
    { day: '30-May', val: 4490, cx: 260, cy: 85 },
    { day: '31-May', val: 4620, cx: 330, cy: 75 },
    { day: '01-Jun', val: 4790, cx: 400, cy: 55 },
    { day: '02-Jun', val: mrrIncrement, cx: 470, cy: 45 },
  ];

  const filteredLogs = adminLogs.filter(log => log.toLowerCase().includes(consoleLogSearch.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ─── Hero Header ─── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245,183,49,0.06) 0%, rgba(34, 211, 238, 0.03) 100%)',
        border: '1px solid rgba(245,183,49,0.15)', borderRadius: 16, padding: '24px 32px'
      }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, margin: 0 }}>
          Super-Admin Console & Analytics
        </h1>
        <p style={{ margin: '4px 0 0', color: V.muted, fontSize: 13 }}>
          Monitor system-wide metrics, oversee active user subscription plan allocations, and inspect Stripe payout telemetry.
        </p>
      </div>

      {/* ─── KPI Metrics ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Monthly Recurring Revenue', value: `$${mrrIncrement.toLocaleString()}`, sub: '+14% growth this week', color: V.gold },
          { label: 'Active Subscribers', value: `${users.length} users`, sub: `Starter: ${users.filter(u=>u.plan==='starter').length} | Pro: ${users.filter(u=>u.plan==='pro').length}`, color: V.teal },
          { label: 'API Gateway Uptime', value: '99.98%', sub: 'DNS/WS ping loops clear', color: V.green },
          { label: 'Total Transaction Volume', value: '$12,492', sub: '99% Stripe invoice collection', color: V.purple }
        ].map(kpi => (
          <Card key={kpi.label} style={{ borderTop: `2.5px solid ${kpi.color}` }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', color: V.muted, letterSpacing: '0.04em' }}>{kpi.label}</span>
            <div style={{ fontSize: 22, fontWeight: 800, color: kpi.color, marginTop: 4 }}>{kpi.value}</div>
            <div style={{ fontSize: 9.5, color: V.muted, marginTop: 4 }}>{kpi.sub}</div>
          </Card>
        ))}
      </div>

      {/* ─── Revenue Spline Graph & Logger Split ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }}>

        {/* Left Side: SVG line graph */}
        <Card>
          <SectionTitle color="var(--teal)">MRR Growth Spline (Interactive)</SectionTitle>
          <div style={{ height: 160, background: '#0e0e16', border: `1px solid ${V.border}`, borderRadius: 8, padding: 12, position: 'relative' }}>
            <svg style={{ width: '100%', height: '100%' }}>
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="600" y2="40" stroke="rgba(255,255,255,0.02)" />
              <line x1="0" y1="80" x2="600" y2="80" stroke="rgba(255,255,255,0.02)" />
              <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(255,255,255,0.02)" />

              {/* Area spline path */}
              <path
                d={`M 50 130 L 120 110 L 190 100 L 260 85 L 330 75 L 400 55 L 470 45 L 470 150 L 50 150 Z`}
                fill="rgba(34,211,238,0.05)"
              />
              <path
                d="M 50 130 L 120 110 L 190 100 L 260 85 L 330 75 L 400 55 L 470 45"
                fill="none" stroke={V.teal} strokeWidth="2.5"
              />

              {/* Interactive Circles */}
              {mrrSplinePoints.map((pt, i) => (
                <circle
                  key={i} cx={pt.cx} cy={pt.cy} r={chartHoverDay === i ? 6 : 4}
                  fill={chartHoverDay === i ? V.gold : V.teal}
                  style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={() => setChartHoverDay(i)}
                  onMouseLeave={() => setChartHoverDay(null)}
                />
              ))}

              {/* Day Labels */}
              <text x="50" y="146" fill={V.muted} fontSize="8" textAnchor="middle" fontFamily="DM Mono">27-MAY</text>
              <text x="190" y="146" fill={V.muted} fontSize="8" textAnchor="middle" fontFamily="DM Mono">29-MAY</text>
              <text x="330" y="146" fill={V.muted} fontSize="8" textAnchor="middle" fontFamily="DM Mono">31-MAY</text>
              <text x="470" y="146" fill={V.muted} fontSize="8" textAnchor="middle" fontFamily="DM Mono">02-JUN</text>
            </svg>

            {chartHoverDay !== null && (
              <div style={{
                position: 'absolute', top: 10, left: 10, background: V.surface3,
                border: `1px solid ${V.border}`, padding: '4px 8px', borderRadius: 4, fontSize: 10.5
              }}>
                <span style={{ color: V.muted }}>Day:</span> <span style={{ color: '#fff', fontWeight: 700 }}>{mrrSplinePoints[chartHoverDay].day}</span> |
                <span style={{ color: V.muted, marginLeft: 6 }}>MRR:</span> <span style={{ color: V.gold, fontWeight: 700 }}>${mrrSplinePoints[chartHoverDay].val}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Right Side: Super-Admin Live Diagnostics console */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <SectionTitle color="var(--gold)">Events Log Console</SectionTitle>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => { sound.play('click'); setTelemetryActive(!telemetryActive); }}
                style={{ background: 'none', border: 'none', color: V.purple, fontSize: 10, cursor: 'pointer', textDecoration: 'underline' }}
              >
                {telemetryActive ? 'Pause Stream' : 'Resume Stream'}
              </button>
              <span style={{ color: 'rgba(255,255,255,0.06)' }}>|</span>
              <button
                onClick={handleLogsExport}
                style={{ background: 'none', border: 'none', color: V.teal, fontSize: 10, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Export Log
              </button>
            </div>
          </div>

          <input
            type="text" placeholder="Filter console logs..."
            value={consoleLogSearch} onChange={e => setConsoleLogSearch(e.target.value)}
            style={{
              background: V.surface, border: `1px solid ${V.border}`, color: '#fff',
              fontSize: 10.5, padding: '4px 8px', borderRadius: 6, outline: 'none'
            }}
          />

          <div style={{
            background: '#040406', border: `1px solid ${V.border}`, borderRadius: 8,
            padding: '12px 16px', height: 110, overflowY: 'auto',
            fontFamily: 'DM Mono, monospace', fontSize: 11, color: V.gold,
            display: 'flex', flexDirection: 'column', gap: 4
          }}>
            {filteredLogs.map((log, idx) => (
              <div key={idx} style={{ opacity: idx === filteredLogs.length - 1 ? 1 : 0.6 }}>
                {log}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </Card>

      </div>

      {/* ─── Global System Settings Override Panel ─── */}
      <Card>
        <SectionTitle color="var(--purple)">Feature Flag overrides</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {/* Toggle 1 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: V.surface, padding: 12, borderRadius: 8, border: `1px solid ${V.border}` }}>
            <div>
              <span style={{ fontSize: 12.5, fontWeight: 700, display: 'block' }}>Maintenance Mode</span>
              <span style={{ fontSize: 9.5, color: V.muted }}>Block all external routing queries</span>
            </div>
            <input
              type="checkbox" checked={maintenanceMode}
              onChange={e => { sound.play('click'); setMaintenanceMode(e.target.checked); }}
              style={{ accentColor: V.purple, cursor: 'pointer', width: 16, height: 16 }}
            />
          </div>

          {/* Toggle 2 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: V.surface, padding: 12, borderRadius: 8, border: `1px solid ${V.border}` }}>
            <div>
              <span style={{ fontSize: 12.5, fontWeight: 700, display: 'block' }}>Sandbox Bypass</span>
              <span style={{ fontSize: 9.5, color: V.muted }}>Bypass Stripe on trial activations</span>
            </div>
            <input
              type="checkbox" checked={sandboxAutoPass}
              onChange={e => { sound.play('click'); setSandboxAutoPass(e.target.checked); }}
              style={{ accentColor: V.purple, cursor: 'pointer', width: 16, height: 16 }}
            />
          </div>

          {/* Toggle 3 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: V.surface, padding: 12, borderRadius: 8, border: `1px solid ${V.border}` }}>
            <div>
              <span style={{ fontSize: 12.5, fontWeight: 700, display: 'block' }}>Email Verification</span>
              <span style={{ fontSize: 9.5, color: V.muted }}>Enforce token verification walls</span>
            </div>
            <input
              type="checkbox" checked={emailVerifyRequired}
              onChange={e => { sound.play('click'); setEmailVerifyRequired(e.target.checked); }}
              style={{ accentColor: V.purple, cursor: 'pointer', width: 16, height: 16 }}
            />
          </div>

          {/* Toggle 4 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: V.surface, padding: 12, borderRadius: 8, border: `1px solid ${V.border}` }}>
            <div>
              <span style={{ fontSize: 12.5, fontWeight: 700, display: 'block' }}>Webhooks Alerts</span>
              <span style={{ fontSize: 9.5, color: V.muted }}>Stream Discord webhook alerts</span>
            </div>
            <input
              type="checkbox" checked={webhookAlertsEnabled}
              onChange={e => { sound.play('click'); setWebhookAlertsEnabled(e.target.checked); }}
              style={{ accentColor: V.purple, cursor: 'pointer', width: 16, height: 16 }}
            />
          </div>

          {/* Toggle 5 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: V.surface, padding: 12, borderRadius: 8, border: `1px solid ${V.border}` }}>
            <div>
              <span style={{ fontSize: 12.5, fontWeight: 700, display: 'block' }}>Direct Google OAuth</span>
              <span style={{ fontSize: 9.5, color: V.muted }}>Skip consent prompts on google login</span>
            </div>
            <input
              type="checkbox" checked={googleAuthBypass}
              onChange={e => { sound.play('click'); setGoogleAuthBypass(e.target.checked); }}
              style={{ accentColor: V.purple, cursor: 'pointer', width: 16, height: 16 }}
            />
          </div>

          {/* Slider 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, background: V.surface, padding: '10px 12px', borderRadius: 8, border: `1px solid ${V.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ fontWeight: 700 }}>Idle Auto-Lock</span>
              <span style={{ color: V.purple, fontWeight: 700 }}>{autoLockDuration} mins</span>
            </div>
            <input
              type="range" min="5" max="120" step="5" value={autoLockDuration}
              onChange={e => { sound.play('click'); setAutoLockDuration(parseInt(e.target.value)); }}
              style={{ width: '100%', accentColor: V.purple }}
            />
          </div>
        </div>
      </Card>

      {/* ─── Registered Users Table ─── */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <SectionTitle color="var(--purple)">Registered SaaS Accounts</SectionTitle>

          <div style={{ display: 'flex', gap: 10 }}>
            {/* Database seeder actions */}
            <button
              onClick={handleSeedMockData}
              style={{ padding: '6px 12px', background: V.green, color: '#000', border: 'none', borderRadius: 6, fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}
            >
              🌱 Seed Users
            </button>
            <button
              onClick={handleResetDatabases}
              style={{ padding: '6px 12px', background: V.red, color: '#fff', border: 'none', borderRadius: 6, fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}
            >
              🧹 Reset Tables
            </button>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search user registry..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                padding: '6px 12px', fontSize: 11.5, background: V.surface3,
                color: '#fff', border: `1px solid ${V.border}`, borderRadius: 6
              }}
            />
            {/* Plan Filter dropdown */}
            <select
              value={selectedPlanFilter}
              onChange={e => { sound.play('click'); setSelectedPlanFilter(e.target.value); }}
              style={{
                padding: '6px 10px', fontSize: 11.5, background: V.surface3,
                color: '#fff', border: `1px solid ${V.border}`, borderRadius: 6
              }}
            >
              <option value="all">All Plans</option>
              <option value="trial">Trial</option>
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
              <option value="agency">Agency</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={e => { sound.play('click'); setSelectedStatusFilter(e.target.value); }}
              style={{
                padding: '6px 10px', fontSize: 11.5, background: V.surface3,
                color: '#fff', border: `1px solid ${V.border}`, borderRadius: 6
              }}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: '#0a0a0f', borderBottom: `1px solid ${V.border}` }}>
                <th style={{ padding: '12px 14px', color: V.muted }}>USER</th>
                <th style={{ padding: '12px 14px', color: V.muted }}>EMAIL</th>
                <th style={{ padding: '12px 14px', color: V.muted }}>COUNTRY</th>
                <th style={{ padding: '12px 14px', color: V.muted }}>PLAN</th>
                <th style={{ padding: '12px 14px', color: V.muted }}>CREATED AT</th>
                <th style={{ padding: '12px 14px', color: V.muted }}>STATUS</th>
                <th style={{ padding: '12px 14px', color: V.muted }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr key={idx} style={{ borderBottom: `1px solid ${V.border}` }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700 }}>{user.name}</td>
                  <td style={{ padding: '12px 14px' }}>{user.email}</td>
                  <td style={{ padding: '12px 14px', fontFamily: 'DM Mono' }}>{user.country}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <select
                      value={user.plan}
                      onChange={e => handlePlanChange(idx, e.target.value)}
                      style={{
                        fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
                        padding: '2px 4px', borderRadius: 4, background: V.surface3, color: '#fff',
                        border: `1.5px solid ${V.border}`
                      }}
                    >
                      <option value="trial">Trial</option>
                      <option value="starter">Starter</option>
                      <option value="pro">Pro</option>
                      <option value="agency">Agency</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'DM Mono, monospace', fontSize: 11 }}>{user.registeredAt}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <button
                      onClick={() => handleToggleActive(idx)}
                      style={{
                        padding: '2px 8px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 9.5, fontWeight: 700,
                        background: user.active ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                        color: user.active ? V.green : V.red
                      }}
                    >
                      {user.active ? 'ACTIVE' : 'SUSPENDED'}
                    </button>
                  </td>
                  <td style={{ padding: '12px 14px', display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => handleActionClick("Impersonate", user.name)}
                      style={{ padding: '4px 8px', fontSize: 10, background: V.teal, border: 'none', borderRadius: 4, color: '#0e0e16', cursor: 'pointer', fontWeight: 700 }}
                    >
                      Impersonate
                    </button>
                    <button
                      onClick={() => handleActionClick("Reset Vault Keys", user.name)}
                      style={{ padding: '4px 8px', fontSize: 10, background: V.purple, border: 'none', borderRadius: 4, color: '#0e0e16', cursor: 'pointer', fontWeight: 700 }}
                    >
                      Reset Vault
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}

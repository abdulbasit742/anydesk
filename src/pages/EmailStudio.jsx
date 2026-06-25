import { useState, useEffect } from "react";

const V = {
  gold: "#f5b731",
  teal: "#22d3ee",
  purple: "#a78bfa",
  surface: "#0e0e16",
  surface2: "#16161e",
  surface3: "#1d1d28",
  border: "rgba(255,255,255,0.07)",
  muted: "#6e7191",
  red: "#ef4444",
  green: "#22c55e",
  text: "#e2e8f0",
};

const card = (extra = {}) => ({
  background: V.surface2,
  border: `1px solid ${V.border}`,
  borderRadius: 16,
  padding: 24,
  ...extra,
});

const badge = (color) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "3px 10px",
  borderRadius: 20,
  fontSize: 11,
  fontWeight: 700,
  background: `${color}18`,
  color,
  border: `1px solid ${color}33`,
});

const btn = (color = V.gold, extra = {}) => ({
  background: `${color}18`,
  color,
  border: `1px solid ${color}44`,
  borderRadius: 10,
  padding: "9px 18px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
  transition: "all 0.2s",
  ...extra,
});

const inputStyle = {
  width: "100%",
  background: V.surface3,
  border: `1px solid ${V.border}`,
  borderRadius: 10,
  padding: "10px 14px",
  color: V.text,
  fontSize: 13,
  fontFamily: "inherit",
  boxSizing: "border-box",
  outline: "none",
};

const CAMPAIGNS = [
  { name: "Welcome to Bolt Studio", status: "Sent", recipients: 4200, openRate: "71.2%", clickRate: "24.5%", date: "Jun 01" },
  { name: "May Feature Update", status: "Sent", recipients: 12800, openRate: "64.8%", clickRate: "18.2%", date: "May 28" },
  { name: "Premium Plan Launch", status: "Scheduled", recipients: 8500, openRate: "—", clickRate: "—", date: "Jun 05" },
  { name: "AI Credits Promo", status: "Draft", recipients: 0, openRate: "—", clickRate: "—", date: "Jun 10" },
  { name: "Re-engagement Wave 4", status: "Paused", recipients: 2100, openRate: "41.3%", clickRate: "9.8%", date: "May 22" },
  { name: "API Docs Newsletter", status: "Sent", recipients: 3400, openRate: "68.9%", clickRate: "31.4%", date: "May 20" },
  { name: "Credit Expiry Warning", status: "Sent", recipients: 980, openRate: "83.4%", clickRate: "52.1%", date: "May 18" },
  { name: "Q2 Retrospective", status: "Draft", recipients: 0, openRate: "—", clickRate: "—", date: "Jun 15" },
];

const SEGMENTS = [
  { name: "All Subscribers", count: 24500, color: V.teal },
  { name: "Active Users", count: 14200, color: V.green },
  { name: "Premium Plan", count: 4800, color: V.gold },
  { name: "Free Trial", count: 3100, color: V.purple },
  { name: "Churned", count: 1200, color: V.red },
  { name: "Enterprise", count: 1200, color: "#22d3ee" },
];

const SUBSCRIBERS = [
  { email: "alex@devhub.io", name: "Alex Chen", segment: "Premium", joined: "Jan 12", lastOpen: "2h ago" },
  { email: "sarah.m@techlab.com", name: "Sarah Miller", segment: "Active", joined: "Feb 03", lastOpen: "1d ago" },
  { email: "jamal@codespace.dev", name: "Jamal Osei", segment: "Enterprise", joined: "Mar 18", lastOpen: "5h ago" },
  { email: "priya@aibuilder.io", name: "Priya Singh", segment: "Free Trial", joined: "May 20", lastOpen: "3d ago" },
  { email: "lucas@boltstudio.com", name: "Lucas Ferreira", segment: "Premium", joined: "Dec 01", lastOpen: "12h ago" },
];

const TEMPLATES = [
  { name: "Welcome Onboarding", category: "Transactional", lastUsed: "Jun 01" },
  { name: "Feature Announcement", category: "Marketing", lastUsed: "May 28" },
  { name: "Credit Low Warning", category: "Alert", lastUsed: "May 18" },
  { name: "Monthly Newsletter", category: "Newsletter", lastUsed: "May 01" },
  { name: "Re-engagement", category: "Automation", lastUsed: "Apr 22" },
  { name: "Invoice Receipt", category: "Transactional", lastUsed: "Jun 02" },
  { name: "Referral Reward", category: "Marketing", lastUsed: "May 15" },
  { name: "Platform Update", category: "Newsletter", lastUsed: "Apr 30" },
];

const AUTOMATIONS = [
  { name: "Welcome Series", steps: 4, subscribers: 1240, conversion: "42%", status: true, color: V.teal },
  { name: "Onboarding Drip", steps: 6, subscribers: 880, conversion: "38%", status: true, color: V.purple },
  { name: "Re-engagement", steps: 3, subscribers: 430, conversion: "18%", status: false, color: V.gold },
  { name: "Credit Expiry Warning", steps: 2, subscribers: 210, conversion: "67%", status: true, color: V.red },
];

const BLACKLISTS = [
  { name: "Spamhaus SBL", status: "Clean" },
  { name: "Spamhaus XBL", status: "Clean" },
  { name: "SORBS", status: "Clean" },
  { name: "Barracuda BRBL", status: "Clean" },
  { name: "SpamCop", status: "Clean" },
];

const AI_SUBJECTS = [
  "🚀 Your AI credits are ready — start building today",
  "✦ Exclusive: Premium features unlocked for you",
  "⚡ 3x faster deployments are here — see how",
];

const GEO = [
  { country: "United States", pct: 38, count: "9,310" },
  { country: "United Kingdom", pct: 17, count: "4,165" },
  { country: "Germany", pct: 12, count: "2,940" },
  { country: "India", pct: 10, count: "2,450" },
  { country: "Canada", pct: 8, count: "1,960" },
];

function useCounter(target, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return val;
}

function OpenRateChart() {
  const points = [58,62,55,70,68,72,65,74,78,72,80,75,82,79,85,81,88,84,90,86,88,91,87,92,89,93,91,94,92,95];
  const w = 500, h = 100;
  const max = Math.max(...points), min = Math.min(...points);
  const range = max - min;
  const pts = points.map((v, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 10) - 5;
    return `${x},${y}`;
  }).join(" ");
  const filled = `${pts} ${w},${h} 0,${h}`;
  return (
    <svg width="100%" height={h + 20} viewBox={`0 0 ${w} ${h + 20}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="openGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={V.teal} stopOpacity="0.3" />
          <stop offset="100%" stopColor={V.teal} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={filled} fill="url(#openGrad)" />
      <polyline points={pts} fill="none" stroke={V.teal} strokeWidth={2} strokeLinejoin="round" />
    </svg>
  );
}

function DonutChart({ segments, size = 110 }) {
  const cx = size / 2, cy = size / 2;
  const r = size / 2 - 10, stroke = 14;
  const circumference = 2 * Math.PI * r;
  const arcs = [];
  let cumulative = 0;
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const offset = cumulative * circumference;
    const len = (seg.pct / 100) * circumference;
    cumulative += seg.pct / 100;
    arcs.push({ ...seg, offset: circumference - offset, dasharray: `${len} ${circumference - len}` });
  }
  return (
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={V.surface3} strokeWidth={stroke} />
      {arcs.map((a, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={a.color} strokeWidth={stroke}
          strokeDasharray={a.dasharray} strokeDashoffset={a.offset}
          transform={`rotate(-90 ${cx} ${cy})`} style={{ transition: "all 0.5s" }} />
      ))}
    </svg>
  );
}

function SpamGauge({ score = 2.1 }) {
  const r = 54, cx = 70, cy = 70;
  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;
  const angle = startAngle + (score / 10) * (endAngle - startAngle);
  const x = cx + r * Math.cos(angle);
  const y = cy + r * Math.sin(angle);
  const arcPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  const filledPath = `M ${cx - r} ${cy} A ${r} ${r} 0 ${score > 5 ? 1 : 0} 1 ${x} ${y}`;
  const color = score < 3 ? V.green : score < 6 ? V.gold : V.red;
  return (
    <svg width={140} height={90}>
      <path d={arcPath} fill="none" stroke={V.surface3} strokeWidth={12} strokeLinecap="round" />
      <path d={filledPath} fill="none" stroke={color} strokeWidth={12} strokeLinecap="round" />
      <text x={cx} y={cy - 4} textAnchor="middle" fill={color} fontSize={22} fontWeight={700}>{score}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill={V.muted} fontSize={10}>/ 10</text>
      <text x={cx} y={cy + 24} textAnchor="middle" fill={V.green} fontSize={11} fontWeight={600}>Low Risk</text>
    </svg>
  );
}

function HeatmapGrid() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const hotHours = [9, 10, 11, 14, 15, 16, 17];
  const hotDays = [0, 1, 2, 3, 4];
  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: `40px repeat(24, 1fr)`, gap: 2, minWidth: 600 }}>
        <div />
        {hours.map((h) => (
          <div key={h} style={{ fontSize: 9, color: V.muted, textAlign: "center", paddingBottom: 4 }}>{h}</div>
        ))}
        {days.map((d, di) => (
          <>
            <div key={d} style={{ fontSize: 10, color: V.muted, display: "flex", alignItems: "center" }}>{d}</div>
            {hours.map((h) => {
              const hot = hotHours.includes(h) && hotDays.includes(di);
              const warm = (hotHours.includes(h) || hotDays.includes(di)) && !hot;
              const opacity = hot ? 0.9 : warm ? 0.4 : 0.1;
              const bg = hot ? V.teal : warm ? V.purple : V.muted;
              return (
                <div key={h} style={{ height: 14, borderRadius: 2, background: bg, opacity }} />
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}

export default function EmailStudio() {
  const [campaignFilter, setCampaignFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("compose");
  const [subject, setSubject] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [segment, setSegment] = useState("All");
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [showImproved, setShowImproved] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiTone, setAiTone] = useState("Professional");
  const [aiLength, setAiLength] = useState("Medium");
  const [generatedContent, setGeneratedContent] = useState("");
  const [flowToggles, setFlowToggles] = useState(AUTOMATIONS.map((a) => a.status));
  const [twoFAToggle, setTwoFAToggle] = useState(true);
  const [dkimToggle] = useState(true);
  const [spfToggle] = useState(true);
  const [dmarcToggle] = useState(true);
  const [abWinner, setAbWinner] = useState(null);

  const sentToday = useCounter(12847);
  const subscribers = useCounter(24500);

  const statusColors = { Sent: V.green, Scheduled: V.teal, Draft: V.muted, Paused: V.gold };

  const filteredCampaigns = campaignFilter === "All" ? CAMPAIGNS : CAMPAIGNS.filter((c) => c.status === campaignFilter);

  const toggleFlow = (i) => setFlowToggles((prev) => prev.map((v, idx) => idx === i ? !v : v));

  const handleGenerate = () => {
    if (!aiTopic) return;
    setGeneratedContent(`Subject: ${aiTopic} — Your Next Step with Bolt Studio\n\nHi [First Name],\n\nWe wanted to reach out about ${aiTopic}. As a valued member of the Bolt Studio community, you have exclusive access to our latest AI-powered tools designed to accelerate your workflow.\n\nHere's what's new:\n• Enhanced AI code generation with 40% faster output\n• Real-time collaboration features now in beta\n• 500 bonus AI credits added to your account\n\nLog in now to explore everything waiting for you.\n\nBest regards,\nThe Bolt Studio Team`);
  };

  const devSegments = [
    { label: "Desktop", pct: 58, color: V.teal },
    { label: "Mobile", pct: 34, color: V.gold },
    { label: "Tablet", pct: 8, color: V.purple },
  ];

  const navTabs = [
    { id: "compose", label: "Compose" },
    { id: "campaigns", label: "Campaigns" },
    { id: "analytics", label: "Analytics" },
    { id: "subscribers", label: "Subscribers" },
    { id: "templates", label: "Templates" },
    { id: "automation", label: "Automation" },
    { id: "abtests", label: "A/B Tests" },
    { id: "ai", label: "AI Engine" },
    { id: "delivery", label: "Deliverability" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: V.surface, fontFamily: "'DM Mono', 'Courier New', monospace", color: V.text, paddingBottom: 80 }}>

      {/* HERO */}
      <div style={{ background: `linear-gradient(135deg, ${V.surface2} 0%, ${V.surface3} 100%)`, borderBottom: `1px solid ${V.border}`, padding: "48px 48px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: `${V.teal}22`, border: `1px solid ${V.teal}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>✉</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#fff", fontFamily: "'Syne', sans-serif" }}>Email Studio</h1>
            <p style={{ margin: 0, fontSize: 14, color: V.muted }}>Design, automate, and send AI-crafted email campaigns</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginTop: 32 }}>
          {[
            { label: "Campaigns", value: "48", color: V.gold, icon: "◫" },
            { label: "Open Rate", value: "67.3%", color: V.green, icon: "◎" },
            { label: "Sent Today", value: sentToday.toLocaleString(), color: V.teal, icon: "↗" },
            { label: "Subscribers", value: `${(subscribers / 1000).toFixed(1)}K`, color: V.purple, icon: "♟" },
          ].map((s) => (
            <div key={s.label} style={{ ...card(), padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 11, color: V.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
                </div>
                <span style={{ fontSize: 24, opacity: 0.5 }}>{s.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* NAV TABS */}
        <div style={{ display: "flex", gap: 4, marginTop: 32, flexWrap: "wrap" }}>
          {navTabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600, background: activeTab === t.id ? `${V.teal}22` : "transparent", color: activeTab === t.id ? V.teal : V.muted, borderBottom: activeTab === t.id ? `2px solid ${V.teal}` : "2px solid transparent", transition: "all 0.2s" }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "40px 48px", display: "grid", gap: 32 }}>

        {/* CAMPAIGN COMPOSER */}
        {activeTab === "compose" && (
          <div style={card()}>
            <h2 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'Syne', sans-serif" }}>Campaign Composer</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, color: V.muted, display: "block", marginBottom: 6 }}>Subject Line</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Write a compelling subject..." style={{ ...inputStyle, flex: 1 }} />
                    <button onClick={() => setShowAISuggestions(!showAISuggestions)} style={btn(V.purple, { whiteSpace: "nowrap", padding: "10px 14px" })}>✦ AI</button>
                  </div>
                  {showAISuggestions && (
                    <div style={{ marginTop: 8, background: V.surface3, borderRadius: 10, padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ fontSize: 11, color: V.purple, marginBottom: 4 }}>AI Subject Suggestions</div>
                      {AI_SUBJECTS.map((s, i) => (
                        <div key={i} onClick={() => { setSubject(s); setShowAISuggestions(false); }} style={{ padding: "8px 12px", background: V.surface2, borderRadius: 8, fontSize: 12, color: V.text, cursor: "pointer", border: `1px solid ${V.border}` }}>{s}</div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label style={{ fontSize: 12, color: V.muted, display: "block", marginBottom: 6 }}>Recipients</label>
                  <select style={{ ...inputStyle }} value={segment} onChange={(e) => setSegment(e.target.value)}>
                    {SEGMENTS.map((s) => <option key={s.name} value={s.name}>{s.name} ({s.count.toLocaleString()})</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <label style={{ fontSize: 12, color: V.muted }}>Email Body</label>
                    <span style={{ fontSize: 11, color: V.muted }}>{bodyText.length} chars · {bodyText.split(/\s+/).filter(Boolean).length} words</span>
                  </div>
                  <textarea value={bodyText} onChange={(e) => setBodyText(e.target.value)} placeholder="Write your email content here..." rows={8} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }} />
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button onClick={() => setShowImproved(!showImproved)} style={btn(V.teal, { flex: 1 })}>✦ AI Improve</button>
                  </div>
                </div>
                {showImproved && (
                  <div style={{ background: V.surface3, borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 12, color: V.teal, fontWeight: 700, marginBottom: 12 }}>AI Improvement Suggestion</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <div style={{ fontSize: 11, color: V.red, marginBottom: 6 }}>Before</div>
                        <div style={{ fontSize: 12, color: V.muted, background: V.surface2, borderRadius: 8, padding: 10, lineHeight: 1.6 }}>{bodyText || "Click AI Improve after writing your content."}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: V.green, marginBottom: 6 }}>After</div>
                        <div style={{ fontSize: 12, color: V.text, background: `${V.teal}08`, border: `1px solid ${V.teal}22`, borderRadius: 8, padding: 10, lineHeight: 1.6 }}>Hi [First Name],{"\n\n"}We have exciting news that will transform your workflow. {bodyText.slice(0, 80) || "Discover exclusive features designed just for you."}{"\n\n"}→ Try it now</div>
                      </div>
                    </div>
                    <button onClick={() => { setBodyText("Hi [First Name],\n\nWe have exciting news that will transform your workflow. Discover exclusive features designed just for you.\n\n→ Try it now"); setShowImproved(false); }} style={btn(V.green, { marginTop: 12, width: "100%", textAlign: "center" })}>Use Improved Version</button>
                  </div>
                )}
                <div style={{ display: "flex", gap: 12 }}>
                  <button style={{ ...btn(V.gold, { flex: 1, textAlign: "center" }), background: `${V.gold}22` }}>✈ Send Now</button>
                  <button style={btn(V.muted, { flex: 1, textAlign: "center" })}>⏱ Schedule</button>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: V.muted, marginBottom: 12 }}>Email Templates</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {TEMPLATES.slice(0, 6).map((t) => (
                    <div key={t.name} style={{ background: V.surface3, borderRadius: 10, padding: 14, cursor: "pointer", border: `1px solid ${V.border}` }}>
                      <div style={{ height: 50, background: `${V.teal}10`, borderRadius: 6, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>✉</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{t.name}</div>
                      <div style={{ fontSize: 10, color: V.muted }}>{t.category}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CAMPAIGN LIST */}
        {activeTab === "campaigns" && (
          <div style={card()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'Syne', sans-serif" }}>Campaigns</h2>
              <div style={{ display: "flex", gap: 8 }}>
                {["All", "Sent", "Scheduled", "Draft", "Paused"].map((f) => (
                  <button key={f} onClick={() => setCampaignFilter(f)} style={{ ...btn(campaignFilter === f ? V.teal : V.muted, { padding: "6px 14px", fontSize: 12 }), background: campaignFilter === f ? `${V.teal}20` : "transparent" }}>{f}</button>
                ))}
              </div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${V.border}` }}>
                  {["Campaign", "Status", "Recipients", "Open Rate", "Click Rate", "Date", "Actions"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: V.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((c, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${V.border}` }}>
                    <td style={{ padding: "14px 12px", fontSize: 13, fontWeight: 600, color: "#fff" }}>{c.name}</td>
                    <td style={{ padding: "14px 12px" }}><span style={badge(statusColors[c.status])}>{c.status}</span></td>
                    <td style={{ padding: "14px 12px", fontSize: 13, color: V.text }}>{c.recipients.toLocaleString()}</td>
                    <td style={{ padding: "14px 12px", fontSize: 13, color: c.openRate !== "—" ? V.green : V.muted }}>{c.openRate}</td>
                    <td style={{ padding: "14px 12px", fontSize: 13, color: c.clickRate !== "—" ? V.teal : V.muted }}>{c.clickRate}</td>
                    <td style={{ padding: "14px 12px", fontSize: 12, color: V.muted }}>{c.date}</td>
                    <td style={{ padding: "14px 12px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {["Edit", "Duplicate", "Stats"].map((a) => (
                          <button key={a} style={{ ...btn(V.muted, { padding: "4px 10px", fontSize: 11 }) }}>{a}</button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ANALYTICS */}
        {activeTab === "analytics" && (
          <div style={{ display: "grid", gap: 24 }}>
            <div style={card()}>
              <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'Syne', sans-serif" }}>Open Rate Trend (30 Days)</h2>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: V.muted }}>Daily open rate %</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: V.teal }}>67.3% avg</span>
              </div>
              <OpenRateChart />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div style={card()}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 20 }}>Device Breakdown</div>
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  <DonutChart segments={devSegments} size={110} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {devSegments.map((s) => (
                      <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color }} />
                        <span style={{ fontSize: 13, color: V.text }}>{s.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: s.color, marginLeft: "auto" }}>{s.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={card()}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 20 }}>Geo Distribution</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {GEO.map((g) => (
                    <div key={g.country}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                        <span style={{ color: V.text }}>{g.country}</span>
                        <span style={{ color: V.muted }}>{g.count}</span>
                      </div>
                      <div style={{ height: 6, background: V.surface3, borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${g.pct}%`, background: `linear-gradient(90deg, ${V.teal}, ${V.purple})`, borderRadius: 3, transition: "width 0.8s ease" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={card()}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Best Send Time (Engagement Heatmap)</div>
              <HeatmapGrid />
              <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 11, color: V.muted }}>
                <span>■ <span style={{ color: V.teal }}>High Engagement</span></span>
                <span>■ <span style={{ color: V.purple }}>Medium</span></span>
                <span>■ <span style={{ color: V.muted }}>Low</span></span>
              </div>
            </div>
          </div>
        )}

        {/* SUBSCRIBERS */}
        {activeTab === "subscribers" && (
          <div style={{ display: "grid", gap: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
              <div style={card()}>
                <div style={{ fontSize: 12, color: V.muted, marginBottom: 4 }}>Total Subscribers</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: V.teal }}>{subscribers.toLocaleString()}</div>
                <div style={{ fontSize: 12, color: V.green, marginTop: 4 }}>▲ +342 this week</div>
                <div style={{ marginTop: 16, fontSize: 11, color: V.muted }}>Unsubscribe Rate</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: V.text, marginTop: 2 }}>0.8%</div>
                <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                  <button style={btn(V.gold, { flex: 1, textAlign: "center", padding: "8px" })}>↓ Import CSV</button>
                  <button style={btn(V.teal, { flex: 1, textAlign: "center", padding: "8px" })}>↑ Export</button>
                </div>
              </div>
              <div style={card()}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Segments</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {SEGMENTS.map((s) => (
                    <div key={s.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: V.surface3, borderRadius: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
                        <span style={{ fontSize: 12, color: V.text }}>{s.name}</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={card()}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Subscriber List</div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${V.border}` }}>
                    {["Email", "Name", "Segment", "Joined", "Last Open"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: V.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SUBSCRIBERS.map((s, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${V.border}` }}>
                      <td style={{ padding: "12px", fontSize: 13, color: V.teal, fontFamily: "monospace" }}>{s.email}</td>
                      <td style={{ padding: "12px", fontSize: 13, color: "#fff" }}>{s.name}</td>
                      <td style={{ padding: "12px" }}><span style={badge(V.purple)}>{s.segment}</span></td>
                      <td style={{ padding: "12px", fontSize: 12, color: V.muted }}>{s.joined}</td>
                      <td style={{ padding: "12px", fontSize: 12, color: V.green }}>{s.lastOpen}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TEMPLATES */}
        {activeTab === "templates" && (
          <div style={card()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'Syne', sans-serif" }}>Email Templates</h2>
              <button style={{ ...btn(V.gold, { padding: "10px 20px" }), background: `${V.gold}22` }}>+ Create New Template</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {TEMPLATES.map((t) => (
                <div key={t.name} style={{ background: V.surface3, borderRadius: 12, overflow: "hidden", border: `1px solid ${V.border}` }}>
                  <div style={{ height: 100, background: `linear-gradient(135deg, ${V.surface}88, ${V.teal}18)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, borderBottom: `1px solid ${V.border}` }}>✉</div>
                  <div style={{ padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{t.name}</div>
                      <span style={badge(V.purple)}>{t.category}</span>
                    </div>
                    <div style={{ fontSize: 11, color: V.muted, marginBottom: 12 }}>Last used: {t.lastUsed}</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {["Preview", "Edit", "Duplicate"].map((a) => (
                        <button key={a} style={btn(V.muted, { padding: "5px 12px", fontSize: 11 })}>{a}</button>
                      ))}
                      <button style={btn(V.red, { padding: "5px 12px", fontSize: 11 })}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AUTOMATION */}
        {activeTab === "automation" && (
          <div style={card()}>
            <h2 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'Syne', sans-serif" }}>Automation Flows</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {AUTOMATIONS.map((flow, i) => (
                <div key={flow.name} style={{ background: V.surface3, borderRadius: 14, padding: 20, borderLeft: `3px solid ${flow.color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{flow.name}</div>
                      <div style={{ display: "flex", gap: 16, fontSize: 12, color: V.muted }}>
                        <span>{flow.steps} steps</span>
                        <span>{flow.subscribers} subscribers in flow</span>
                        <span style={{ color: V.green }}>Conv: {flow.conversion}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={badge(flowToggles[i] ? V.green : V.muted)}>{flowToggles[i] ? "Active" : "Paused"}</span>
                      <div onClick={() => toggleFlow(i)} style={{ width: 44, height: 24, borderRadius: 12, background: flowToggles[i] ? `${flow.color}30` : V.surface, border: `1px solid ${flowToggles[i] ? flow.color : V.border}`, cursor: "pointer", position: "relative", transition: "all 0.2s" }}>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", background: flowToggles[i] ? flow.color : V.muted, position: "absolute", top: 3, left: flowToggles[i] ? 23 : 3, transition: "all 0.2s" }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto" }}>
                    {Array.from({ length: flow.steps }).map((_, si) => (
                      <div key={si} style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ background: V.surface2, border: `1px solid ${flow.color}44`, borderRadius: 8, padding: "8px 14px", fontSize: 11, color: V.text, whiteSpace: "nowrap" }}>
                          {si === 0 ? "Trigger" : si === flow.steps - 1 ? "Complete" : `Email ${si}`}
                        </div>
                        {si < flow.steps - 1 && (
                          <div style={{ display: "flex", alignItems: "center", margin: "0 4px" }}>
                            <div style={{ width: 16, height: 1, background: `${flow.color}66` }} />
                            <div style={{ color: flow.color, fontSize: 10 }}>▶</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* A/B TESTING */}
        {activeTab === "abtests" && (
          <div style={{ display: "grid", gap: 24 }}>
            {[
              {
                name: "Subject Line Test — Premium Promo",
                a: "🚀 Your AI credits expire soon — act now",
                b: "✦ Unlock premium features before credits reset",
                aOpen: 71.2, bOpen: 64.8, progress: 68,
                aClick: 24.5, bClick: 18.2,
              },
              {
                name: "Welcome Email Tone Test",
                a: "Welcome to Bolt Studio — let's get started",
                b: "You're in. Here's everything you can do now",
                aOpen: 82.4, bOpen: 78.9, progress: 45,
                aClick: 38.2, bClick: 31.4,
              },
            ].map((test, i) => (
              <div key={i} style={card()}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{test.name}</div>
                  <span style={badge(V.teal)}>Active</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                  {[{ label: "Variant A", subject: test.a, open: test.aOpen, click: test.aClick, color: V.teal },
                    { label: "Variant B", subject: test.b, open: test.bOpen, click: test.bClick, color: V.purple }].map((v) => (
                    <div key={v.label} style={{ background: V.surface3, borderRadius: 10, padding: 16, border: `1px solid ${v.color}33` }}>
                      <div style={{ fontSize: 11, color: v.color, fontWeight: 700, marginBottom: 8 }}>{v.label}</div>
                      <div style={{ fontSize: 12, color: V.text, marginBottom: 12, lineHeight: 1.5 }}>"{v.subject}"</div>
                      <div style={{ display: "flex", gap: 16 }}>
                        <div><div style={{ fontSize: 10, color: V.muted }}>Open Rate</div><div style={{ fontSize: 16, fontWeight: 700, color: v.color }}>{v.open}%</div></div>
                        <div><div style={{ fontSize: 10, color: V.muted }}>Click Rate</div><div style={{ fontSize: 16, fontWeight: 700, color: V.text }}>{v.click}%</div></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: V.muted, marginBottom: 6 }}>
                    <span>Winner detection progress</span>
                    <span>{test.progress}% confidence</span>
                  </div>
                  <div style={{ height: 8, background: V.surface3, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${test.progress}%`, background: `linear-gradient(90deg, ${V.teal}, ${V.purple})`, borderRadius: 4, transition: "width 1s ease" }} />
                  </div>
                  <div style={{ fontSize: 11, color: V.muted, marginTop: 4 }}>Need 95% confidence to declare a winner</div>
                </div>
                <button onClick={() => setAbWinner(i)} style={{ ...btn(abWinner === i ? V.green : V.gold, { padding: "10px 24px" }), background: abWinner === i ? `${V.green}20` : `${V.gold}18` }}>
                  {abWinner === i ? "✓ Winner Declared — Variant A" : "Declare Winner"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* AI CONTENT ENGINE */}
        {activeTab === "ai" && (
          <div style={card()}>
            <h2 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'Syne', sans-serif" }}>AI Content Engine</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, color: V.muted, display: "block", marginBottom: 6 }}>Email Topic</label>
                  <input value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g. AI credits expiry reminder..." style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: V.muted, display: "block", marginBottom: 8 }}>Tone</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["Professional", "Friendly", "Urgent", "Promotional"].map((t) => (
                      <button key={t} onClick={() => setAiTone(t)} style={{ ...btn(aiTone === t ? V.purple : V.muted, { padding: "7px 16px", fontSize: 12 }), background: aiTone === t ? `${V.purple}22` : "transparent" }}>{t}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: V.muted, display: "block", marginBottom: 8 }}>Length</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["Short", "Medium", "Long"].map((l) => (
                      <button key={l} onClick={() => setAiLength(l)} style={{ ...btn(aiLength === l ? V.teal : V.muted, { padding: "7px 20px", fontSize: 12, flex: 1 }), background: aiLength === l ? `${V.teal}22` : "transparent" }}>{l}</button>
                    ))}
                  </div>
                </div>
                <button onClick={handleGenerate} style={{ ...btn(V.gold, { padding: "13px", textAlign: "center" }), background: `${V.gold}22` }}>✦ Generate Email</button>
                {generatedContent && (
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={handleGenerate} style={btn(V.muted, { flex: 1, textAlign: "center" })}>⟳ Regenerate</button>
                    <button style={{ ...btn(V.green, { flex: 1, textAlign: "center" }), background: `${V.green}18` }}>✓ Use Content</button>
                  </div>
                )}
              </div>
              <div>
                {generatedContent ? (
                  <div>
                    <div style={{ fontSize: 12, color: V.muted, marginBottom: 8 }}>Generated Content Preview</div>
                    <div style={{ background: V.surface3, border: `1px solid ${V.gold}33`, borderRadius: 12, padding: 20, fontSize: 13, color: V.text, lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "sans-serif" }}>{generatedContent}</div>
                  </div>
                ) : (
                  <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, opacity: 0.5 }}>
                    <div style={{ fontSize: 48 }}>✦</div>
                    <div style={{ fontSize: 13, color: V.muted, textAlign: "center" }}>Enter a topic and click Generate to create AI-crafted email content</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DELIVERABILITY */}
        {activeTab === "delivery" && (
          <div style={{ display: "grid", gap: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: 24 }}>
              <div style={{ ...card(), display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Spam Score</div>
                <SpamGauge score={2.1} />
                <div style={{ fontSize: 11, color: V.green }}>Excellent deliverability</div>
              </div>
              <div style={card()}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 16 }}>DNS Blacklist Check</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {BLACKLISTS.map((b) => (
                    <div key={b.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: V.surface3, borderRadius: 8 }}>
                      <span style={{ fontSize: 12, color: V.text }}>{b.name}</span>
                      <span style={badge(V.green)}>✓ {b.status}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={card()}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Authentication Status</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { label: "DKIM", desc: "DomainKeys Identified Mail", ok: dkimToggle },
                    { label: "SPF", desc: "Sender Policy Framework", ok: spfToggle },
                    { label: "DMARC", desc: "Domain-based Message Auth", ok: dmarcToggle },
                    { label: "2FA", desc: "Account Two-Factor Auth", ok: twoFAToggle },
                  ].map((a) => (
                    <div key={a.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{a.label}</div>
                        <div style={{ fontSize: 11, color: V.muted }}>{a.desc}</div>
                      </div>
                      <span style={badge(a.ok ? V.green : V.red)}>{a.ok ? "✓ Pass" : "✗ Fail"}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 20, padding: 14, background: V.surface3, borderRadius: 10 }}>
                  <div style={{ fontSize: 12, color: V.muted, marginBottom: 4 }}>Domain Reputation</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={badge(V.green)}>★ Excellent</span>
                    <span style={{ fontSize: 12, color: V.muted }}>boltstudio.com</span>
                  </div>
                </div>
                <div style={{ marginTop: 16, padding: 14, background: V.surface3, borderRadius: 10 }}>
                  <div style={{ fontSize: 12, color: V.muted, marginBottom: 4 }}>Bounce Rate</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: V.green }}>0.42%</div>
                  <div style={{ fontSize: 11, color: V.muted }}>Industry avg: 2.0%</div>
                </div>
              </div>
            </div>

            {/* Also show settings toggle for 2FA here contextually */}
            <div style={{ ...card(), display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Two-Factor Authentication</div>
                <div style={{ fontSize: 12, color: V.muted }}>Protect your Email Studio account with 2FA</div>
              </div>
              <div onClick={() => setTwoFAToggle(!twoFAToggle)} style={{ width: 52, height: 28, borderRadius: 14, background: twoFAToggle ? `${V.green}30` : V.surface3, border: `1px solid ${twoFAToggle ? V.green : V.border}`, cursor: "pointer", position: "relative", transition: "all 0.2s" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: twoFAToggle ? V.green : V.muted, position: "absolute", top: 3, left: twoFAToggle ? 27 : 3, transition: "all 0.2s" }} />
              </div>
            </div>
          </div>
        )}

        {/* DEFAULT: show compose if no matching tab shown */}
        {!["compose", "campaigns", "analytics", "subscribers", "templates", "automation", "abtests", "ai", "delivery"].includes(activeTab) && (
          <div style={{ textAlign: "center", padding: 60, color: V.muted }}>Select a tab to begin.</div>
        )}

      </div>
    </div>
  );
}

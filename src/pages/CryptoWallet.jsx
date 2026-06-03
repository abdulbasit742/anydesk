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

const TOKENS = [
  { sym: "BTC", name: "Bitcoin", emoji: "₿", balance: 0.4812, usd: 8432.5, change: 2.34, color: V.gold, sparks: [40,45,38,50,48,55,52,60,58,65,62,70] },
  { sym: "ETH", name: "Ethereum", emoji: "Ξ", balance: 2.891, usd: 1890.2, change: -1.22, color: V.purple, sparks: [60,58,55,52,50,48,52,55,58,60,62,65] },
  { sym: "USDT", name: "Tether", emoji: "₮", balance: 1205.0, usd: 1205.0, change: 0.01, color: V.green, sparks: [50,50,51,50,50,51,50,50,51,50,50,50] },
  { sym: "AIC", name: "AI Credits", emoji: "✦", balance: 4250, usd: 850.0, change: 5.67, color: V.teal, sparks: [30,35,40,38,45,50,55,52,60,65,70,75] },
  { sym: "PLC", name: "Platform Credits", emoji: "◈", balance: 880, usd: 352.0, change: -0.45, color: V.gold, sparks: [55,52,50,48,50,52,55,58,56,54,55,57] },
  { sym: "CTK", name: "Custom Token", emoji: "⬡", balance: 2000, usd: 117.5, change: 12.3, color: V.red, sparks: [20,25,30,35,45,50,60,55,70,65,80,90] },
];

const TXNS = [
  { id: "1", type: "Deposit", token: "BTC", amount: "+0.12", usd: "+$2,100", platform: "Coinbase", time: "2m ago", status: "Confirmed", hash: "0x3f...a91b" },
  { id: "2", type: "Purchase", token: "AIC", amount: "-500", usd: "-$100", platform: "Bolt Studio", time: "15m ago", status: "Confirmed", hash: "0x7c...f032" },
  { id: "3", type: "Reward", token: "PLC", amount: "+80", usd: "+$32", platform: "Staking", time: "1h ago", status: "Confirmed", hash: "0x1a...9e4d" },
  { id: "4", type: "Withdrawal", token: "ETH", amount: "-0.5", usd: "-$327", platform: "MetaMask", time: "3h ago", status: "Confirmed", hash: "0x5b...c129" },
  { id: "5", type: "Purchase", token: "AIC", amount: "-1000", usd: "-$200", platform: "Bolt Studio", time: "5h ago", status: "Confirmed", hash: "0x8d...2f11" },
  { id: "6", type: "Deposit", token: "USDT", amount: "+500", usd: "+$500", platform: "Binance", time: "8h ago", status: "Confirmed", hash: "0x2e...7b88" },
  { id: "7", type: "Reward", token: "AIC", amount: "+200", usd: "+$40", platform: "Referral", time: "1d ago", status: "Confirmed", hash: "0x9a...3c55" },
  { id: "8", type: "Withdrawal", token: "BTC", amount: "-0.05", usd: "-$875", platform: "Hardware", time: "1d ago", status: "Confirmed", hash: "0x4f...e772" },
  { id: "9", type: "Purchase", token: "CTK", amount: "-500", usd: "-$29", platform: "DEX", time: "2d ago", status: "Pending", hash: "0x6c...d933" },
  { id: "10", type: "Deposit", token: "ETH", amount: "+1.0", usd: "+$654", platform: "Kraken", time: "2d ago", status: "Confirmed", hash: "0x0b...aa44" },
  { id: "11", type: "Reward", token: "PLC", amount: "+40", usd: "+$16", platform: "Staking", time: "3d ago", status: "Confirmed", hash: "0xf1...5509" },
  { id: "12", type: "Purchase", token: "USDT", amount: "-200", usd: "-$200", platform: "API Calls", time: "4d ago", status: "Confirmed", hash: "0xe3...b8a0" },
];

const STAKING = [
  { name: "BTC Flex Pool", apy: 4.2, staked: 0.2, stakedUsd: 3500, rewards: 0.0035, rewardUsd: 61.25, lock: "None", color: V.gold },
  { name: "ETH Staking", apy: 5.8, staked: 1.0, stakedUsd: 654, rewards: 0.0145, rewardUsd: 9.48, lock: "30 days", color: V.purple },
  { name: "AI Credits Pool", apy: 12.5, staked: 1000, stakedUsd: 200, rewards: 31.25, rewardUsd: 6.25, lock: "7 days", color: V.teal },
];

const ALERTS = [
  { token: "BTC", condition: "Above", threshold: "$75,000", current: "$69,842", status: "Active", color: V.green },
  { token: "ETH", condition: "Below", threshold: "$3,000", current: "$3,280", status: "Active", color: V.green },
  { token: "AIC", condition: "Above", threshold: "$0.25", current: "$0.20", status: "Active", color: V.green },
  { token: "BTC", condition: "Below", threshold: "$60,000", current: "$69,842", status: "Active", color: V.green },
  { token: "CTK", condition: "Above", threshold: "$0.08", current: "$0.059", status: "Triggered", color: V.gold },
];

const DEVICES = [
  { name: "MacBook Pro 16\"", location: "San Francisco, US", time: "Current", browser: "Chrome 124" },
  { name: "iPhone 15 Pro", location: "San Francisco, US", time: "2h ago", browser: "Safari iOS" },
  { name: "Windows Desktop", location: "New York, US", time: "3d ago", browser: "Firefox 125" },
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

function Sparkline({ data, color, width = 80, height = 30 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}

function PieChart({ segments, size = 120 }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 8;
  const arcs = [];
  let cumulative = 0;
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const startAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    cumulative += seg.pct / 100;
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const large = seg.pct > 50 ? 1 : 0;
    arcs.push({ ...seg, d: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z` });
  }
  return (
    <svg width={size} height={size}>
      {arcs.map((a, i) => <path key={i} d={a.d} fill={a.color} opacity={0.85} />)}
      <circle cx={cx} cy={cy} r={r * 0.55} fill={V.surface2} />
    </svg>
  );
}

function QRPattern({ size = 140 }) {
  const cells = [];
  for (let r = 0; r < 14; r++) {
    for (let c = 0; c < 14; c++) {
      const on = (r < 3 && c < 3) || (r < 3 && c > 10) || (r > 10 && c < 3) || (((r * 7 + c * 13) % 5) === 0);
      if (on) cells.push({ r, c });
    }
  }
  const cell = size / 14;
  return (
    <svg width={size} height={size} style={{ borderRadius: 8 }}>
      <rect width={size} height={size} fill="white" rx={6} />
      {cells.map((c, i) => (
        <rect key={i} x={c.c * cell + 1} y={c.r * cell + 1} width={cell - 2} height={cell - 2} rx={1} fill="#0e0e16" />
      ))}
    </svg>
  );
}

export default function CryptoWallet() {
  const [activeTab, setActiveTab] = useState("send");
  const [txFilter, setTxFilter] = useState("All");
  const [sendStep, setSendStep] = useState(0);
  const [sendAmt, setSendAmt] = useState("");
  const [sendAddr, setSendAddr] = useState("");
  const [fromCredit, setFromCredit] = useState("");
  const [twoFA, setTwoFA] = useState(true);
  const [alertToggles, setAlertToggles] = useState(ALERTS.map(() => true));
  const [stakeAction, setStakeAction] = useState(null);
  const [copied, setCopied] = useState(false);
  const [convertSuccess, setConvertSuccess] = useState(false);
  const [addAlertOpen, setAddAlertOpen] = useState(false);

  const totalBalance = useCounter(12847);
  const totalRewards = useCounter(77);

  const walletAddr = "0x3f8A92bC1d4e7F09a3c2B5d6E891f034aA72C8b";

  const txTypeColors = { Deposit: V.green, Withdrawal: V.red, Purchase: V.teal, Reward: V.gold };
  const txTypeIcons = { Deposit: "↓", Withdrawal: "↑", Purchase: "⊕", Reward: "★" };

  const filteredTxns = txFilter === "All" ? TXNS : TXNS.filter((t) => t.type === txFilter);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const toggleAlert = (i) => {
    setAlertToggles((prev) => prev.map((v, idx) => idx === i ? !v : v));
  };

  const convRate = 0.2;
  const convertedAmt = fromCredit ? (parseFloat(fromCredit) * convRate).toFixed(4) : "";

  const spendSegments = [
    { label: "AI Credits", pct: 45, color: V.teal },
    { label: "API Calls", pct: 28, color: V.gold },
    { label: "Storage", pct: 15, color: V.purple },
    { label: "Compute", pct: 12, color: V.red },
  ];

  const monthlySpend = [1890, 2100, 2340];
  const maxSpend = Math.max(...monthlySpend);

  return (
    <div style={{ minHeight: "100vh", background: V.surface, fontFamily: "'DM Mono', 'Courier New', monospace", color: V.text, padding: "0 0 80px" }}>

      {/* HERO */}
      <div style={{ background: `linear-gradient(135deg, ${V.surface2} 0%, ${V.surface3} 100%)`, borderBottom: `1px solid ${V.border}`, padding: "48px 48px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: `${V.gold}22`, border: `1px solid ${V.gold}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>₿</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#fff", fontFamily: "'Syne', sans-serif" }}>Crypto Wallet</h1>
            <p style={{ margin: 0, fontSize: 14, color: V.muted }}>Manage tokens, credits, and platform payments</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginTop: 32 }}>
          {[
            { label: "Total Balance", value: `$${totalBalance.toLocaleString()}`, color: V.gold, icon: "◎" },
            { label: "Active Tokens", value: "6", color: V.teal, icon: "⬡" },
            { label: "Monthly Spend", value: "$2,340", color: V.purple, icon: "↗" },
            { label: "Savings vs Traditional", value: "67%", color: V.green, icon: "★" },
          ].map((s) => (
            <div key={s.label} style={{ ...card(), padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 11, color: V.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
                </div>
                <span style={{ fontSize: 22, opacity: 0.6 }}>{s.icon}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "40px 48px", display: "grid", gap: 32 }}>

        {/* BALANCE OVERVIEW */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div style={card()}>
            <div style={{ fontSize: 12, color: V.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Portfolio Balance</div>
            <div style={{ fontSize: 42, fontWeight: 700, color: V.gold, fontFamily: "'Syne', sans-serif" }}>${totalBalance.toLocaleString()}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <span style={{ color: V.green, fontSize: 13, fontWeight: 600 }}>▲ +4.28% (24h)</span>
              <span style={{ color: V.muted, fontSize: 12 }}>+$527.40</span>
            </div>
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 11, color: V.muted, marginBottom: 8 }}>7-Day Performance</div>
              <Sparkline data={[9800, 10200, 9950, 10800, 11200, 12100, 12847]} color={V.gold} width={320} height={50} />
            </div>
          </div>
          <div style={{ ...card(), display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: 12, color: V.muted, textTransform: "uppercase", letterSpacing: 1 }}>Asset Breakdown</div>
            <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
              <PieChart segments={[
                { pct: 65.6, color: V.gold },
                { pct: 14.7, color: V.purple },
                { pct: 9.4, color: V.green },
                { pct: 6.6, color: V.teal },
                { pct: 2.7, color: V.red },
                { pct: 0.9, color: "#888" },
              ]} size={130} />
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                {TOKENS.map((t) => (
                  <div key={t.sym} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color }} />
                      <span style={{ fontSize: 12, color: V.text }}>{t.sym}</span>
                    </div>
                    <span style={{ fontSize: 12, color: V.muted }}>${t.usd.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TOKEN PORTFOLIO */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'Syne', sans-serif" }}>Token Portfolio</h2>
            <div style={{ fontSize: 13, color: V.muted }}>Total: <span style={{ color: V.gold, fontWeight: 700 }}>${TOKENS.reduce((a, t) => a + t.usd, 0).toLocaleString()}</span></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {TOKENS.map((t) => (
              <div key={t.sym} style={{ ...card(), borderLeft: `3px solid ${t.color}`, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${t.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: t.color }}>{t.emoji}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{t.sym}</div>
                      <div style={{ fontSize: 11, color: V.muted }}>{t.name}</div>
                    </div>
                  </div>
                  <span style={{ ...badge(t.change >= 0 ? V.green : V.red) }}>{t.change >= 0 ? "▲" : "▼"} {Math.abs(t.change)}%</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: t.color }}>{t.balance.toLocaleString()} <span style={{ fontSize: 12, color: V.muted }}>{t.sym}</span></div>
                <div style={{ fontSize: 13, color: V.muted, marginBottom: 12 }}>${t.usd.toLocaleString()}</div>
                <Sparkline data={t.sparks} color={t.color} width={180} height={28} />
              </div>
            ))}
          </div>
        </div>

        {/* TRANSACTION HISTORY */}
        <div style={card()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'Syne', sans-serif" }}>Transaction History</h2>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {["All", "Deposit", "Withdrawal", "Purchase", "Reward"].map((f) => (
                <button key={f} onClick={() => setTxFilter(f)} style={{ ...btn(txFilter === f ? V.gold : V.muted, { padding: "6px 14px", fontSize: 12 }), background: txFilter === f ? `${V.gold}20` : "transparent" }}>{f}</button>
              ))}
              <button style={btn(V.teal, { padding: "6px 14px", fontSize: 12 })}>↓ Export CSV</button>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {filteredTxns.map((tx) => (
              <div key={tx.id} style={{ display: "grid", gridTemplateColumns: "36px 1fr 1fr 1fr 1fr 1fr", gap: 12, alignItems: "center", padding: "12px 16px", borderRadius: 10, background: V.surface3, marginBottom: 4 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${txTypeColors[tx.type]}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: txTypeColors[tx.type] }}>{txTypeIcons[tx.type]}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{tx.type}</div>
                  <div style={{ fontSize: 11, color: V.muted }}>{tx.platform}</div>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: txTypeColors[tx.type] }}>{tx.amount} {tx.token}</div>
                  <div style={{ fontSize: 11, color: V.muted }}>{tx.usd}</div>
                </div>
                <div style={{ fontSize: 12, color: V.muted }}>{tx.time}</div>
                <span style={badge(tx.status === "Confirmed" ? V.green : V.gold)}>{tx.status}</span>
                <div style={{ fontSize: 11, color: V.muted, fontFamily: "monospace" }}>{tx.hash}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SEND / RECEIVE */}
        <div style={card()}>
          <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'Syne', sans-serif" }}>Send / Receive</h2>
          <div style={{ display: "flex", gap: 4, marginBottom: 24, background: V.surface3, borderRadius: 10, padding: 4, width: "fit-content" }}>
            {["send", "receive"].map((t) => (
              <button key={t} onClick={() => { setActiveTab(t); setSendStep(0); }} style={{ padding: "8px 28px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600, background: activeTab === t ? V.gold : "transparent", color: activeTab === t ? V.surface : V.muted, transition: "all 0.2s" }}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
            ))}
          </div>
          {activeTab === "send" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {sendStep === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, color: V.muted, display: "block", marginBottom: 6 }}>Recipient Address</label>
                    <input value={sendAddr} onChange={(e) => setSendAddr(e.target.value)} placeholder="0x..." style={{ width: "100%", background: V.surface3, border: `1px solid ${V.border}`, borderRadius: 10, padding: "10px 14px", color: V.text, fontSize: 13, fontFamily: "monospace", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, color: V.muted, display: "block", marginBottom: 6 }}>Amount</label>
                      <input value={sendAmt} onChange={(e) => setSendAmt(e.target.value)} placeholder="0.00" style={{ width: "100%", background: V.surface3, border: `1px solid ${V.border}`, borderRadius: 10, padding: "10px 14px", color: V.text, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: V.muted, display: "block", marginBottom: 6 }}>Token</label>
                      <select style={{ width: "100%", background: V.surface3, border: `1px solid ${V.border}`, borderRadius: 10, padding: "10px 14px", color: V.text, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" }}>
                        {TOKENS.map((t) => <option key={t.sym} value={t.sym}>{t.sym}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ background: V.surface3, borderRadius: 10, padding: 12, fontSize: 12, color: V.muted }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span>Network Fee</span><span style={{ color: V.text }}>~0.0002 ETH ($0.13)</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span>Estimated Time</span><span style={{ color: V.text }}>~30 seconds</span></div>
                  </div>
                  <button onClick={() => setSendStep(1)} style={{ ...btn(V.gold, { padding: "12px", textAlign: "center" }), background: `${V.gold}22` }}>Continue → Confirm Send</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ background: `${V.gold}10`, border: `1px solid ${V.gold}33`, borderRadius: 12, padding: 20 }}>
                    <div style={{ fontSize: 13, color: V.gold, fontWeight: 700, marginBottom: 12 }}>Confirm Transaction</div>
                    <div style={{ fontSize: 12, color: V.muted, marginBottom: 4 }}>To: <span style={{ color: V.text, fontFamily: "monospace" }}>{sendAddr || "0x3f...a91b"}</span></div>
                    <div style={{ fontSize: 12, color: V.muted, marginBottom: 4 }}>Amount: <span style={{ color: V.gold, fontWeight: 700 }}>{sendAmt || "0.00"} BTC</span></div>
                    <div style={{ fontSize: 12, color: V.muted }}>Fee: <span style={{ color: V.text }}>0.0002 ETH</span></div>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button onClick={() => setSendStep(0)} style={btn(V.muted, { flex: 1 })}>← Back</button>
                    <button onClick={() => setSendStep(0)} style={{ ...btn(V.green, { flex: 2 }), background: `${V.green}22` }}>✓ Confirm & Send</button>
                  </div>
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontSize: 12, color: V.muted }}>Recent Recipients</div>
                {["0x7a...F2c1", "0x9b...3E08", "0x1f...aA22"].map((addr) => (
                  <div key={addr} onClick={() => setSendAddr(addr)} style={{ background: V.surface3, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: V.text, cursor: "pointer", fontFamily: "monospace" }}>{addr}</div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "receive" && (
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 40, alignItems: "start" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <QRPattern size={140} />
                <div style={{ fontSize: 11, color: V.muted }}>Scan to send funds</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: V.muted, marginBottom: 8 }}>Your Wallet Address</div>
                  <div style={{ background: V.surface3, borderRadius: 10, padding: "12px 16px", fontFamily: "monospace", fontSize: 12, color: V.text, wordBreak: "break-all" }}>{walletAddr}</div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={handleCopy} style={btn(copied ? V.green : V.teal, { flex: 1, textAlign: "center" })}>{copied ? "✓ Copied!" : "⧉ Copy Address"}</button>
                  <button style={btn(V.purple, { flex: 1, textAlign: "center" })}>↗ Share</button>
                </div>
                <div style={{ fontSize: 12, color: V.muted, background: `${V.gold}08`, border: `1px solid ${V.gold}22`, borderRadius: 10, padding: 12 }}>
                  ⚠ Only send supported tokens to this address. Sending unsupported assets may result in permanent loss.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CREDIT CONVERTER */}
        <div style={card()}>
          <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'Syne', sans-serif" }}>Credit Converter</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto", gap: 16, alignItems: "flex-end" }}>
            <div>
              <label style={{ fontSize: 12, color: V.muted, display: "block", marginBottom: 6 }}>From: AI Credits</label>
              <input value={fromCredit} onChange={(e) => setFromCredit(e.target.value)} placeholder="1000" style={{ width: "100%", background: V.surface3, border: `1px solid ${V.teal}44`, borderRadius: 10, padding: "10px 14px", color: V.text, fontSize: 16, fontFamily: "inherit", boxSizing: "border-box" }} />
            </div>
            <div style={{ paddingBottom: 8, fontSize: 20, color: V.muted }}>⇄</div>
            <div>
              <label style={{ fontSize: 12, color: V.muted, display: "block", marginBottom: 6 }}>To: USDT</label>
              <div style={{ background: V.surface3, border: `1px solid ${V.green}44`, borderRadius: 10, padding: "10px 14px", fontSize: 16, color: V.green, fontWeight: 700 }}>{convertedAmt || "0.0000"}</div>
            </div>
            <button onClick={() => { setConvertSuccess(true); setTimeout(() => setConvertSuccess(false), 2000); }} style={{ ...btn(V.gold, { padding: "12px 24px" }), background: `${V.gold}22`, marginBottom: 0 }}>{convertSuccess ? "Converted!" : "Convert"}</button>
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 24, fontSize: 12, color: V.muted }}>
            <span>Rate: <span style={{ color: V.teal }}>1 AIC = $0.20 USDT</span></span>
            <span>Platform Fee: <span style={{ color: V.text }}>0.5%</span></span>
            <span>Min: <span style={{ color: V.text }}>100 AIC</span></span>
          </div>
        </div>

        {/* STAKING */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'Syne', sans-serif" }}>Staking Dashboard</h2>
            <div style={{ fontSize: 13, color: V.muted }}>Total Rewards: <span style={{ color: V.gold, fontWeight: 700 }}>${totalRewards.toFixed(2)}</span></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {STAKING.map((pool) => (
              <div key={pool.name} style={{ ...card(), borderTop: `3px solid ${pool.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{pool.name}</div>
                  <span style={badge(pool.color)}>{pool.apy}% APY</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, color: V.muted, marginBottom: 3 }}>Staked</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: pool.color }}>{pool.staked}</div>
                    <div style={{ fontSize: 11, color: V.muted }}>${pool.stakedUsd}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: V.muted, marginBottom: 3 }}>Rewards</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: V.green }}>{pool.rewards}</div>
                    <div style={{ fontSize: 11, color: V.muted }}>${pool.rewardUsd}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: V.muted, marginBottom: 14 }}>Lock Period: <span style={{ color: V.text }}>{pool.lock}</span></div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setStakeAction(pool.name)} style={btn(pool.color, { flex: 1, padding: "8px", fontSize: 11, textAlign: "center" })}>Stake</button>
                  <button style={btn(V.muted, { flex: 1, padding: "8px", fontSize: 11, textAlign: "center" })}>Unstake</button>
                  <button style={btn(V.green, { flex: 1, padding: "8px", fontSize: 11, textAlign: "center" })}>Claim</button>
                </div>
                {stakeAction === pool.name && (
                  <div style={{ marginTop: 10, background: `${pool.color}12`, border: `1px solid ${pool.color}33`, borderRadius: 8, padding: 10, fontSize: 12, color: pool.color }}>
                    Staking initiated for {pool.name}!
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* PRICE ALERTS */}
        <div style={card()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'Syne', sans-serif" }}>Price Alerts</h2>
            <button onClick={() => setAddAlertOpen(!addAlertOpen)} style={btn(V.gold, { padding: "8px 18px", fontSize: 13 })}>+ Add Alert</button>
          </div>
          {addAlertOpen && (
            <div style={{ background: V.surface3, borderRadius: 12, padding: 20, marginBottom: 20, display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, alignItems: "flex-end" }}>
              <div>
                <label style={{ fontSize: 11, color: V.muted, display: "block", marginBottom: 4 }}>Token</label>
                <select style={{ width: "100%", background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 8, padding: "8px 12px", color: V.text, fontSize: 12, fontFamily: "inherit" }}>
                  {TOKENS.map((t) => <option key={t.sym}>{t.sym}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: V.muted, display: "block", marginBottom: 4 }}>Condition</label>
                <select style={{ width: "100%", background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 8, padding: "8px 12px", color: V.text, fontSize: 12, fontFamily: "inherit" }}>
                  <option>Above</option><option>Below</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: V.muted, display: "block", marginBottom: 4 }}>Threshold</label>
                <input placeholder="$0.00" style={{ width: "100%", background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 8, padding: "8px 12px", color: V.text, fontSize: 12, fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
              <button onClick={() => setAddAlertOpen(false)} style={btn(V.gold, { padding: "8px 16px" })}>Save</button>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ALERTS.map((a, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "80px 80px 1fr 1fr 1fr auto", gap: 16, alignItems: "center", padding: "12px 16px", background: V.surface3, borderRadius: 10 }}>
                <div style={{ fontWeight: 700, color: V.text, fontSize: 13 }}>{a.token}</div>
                <div style={{ fontSize: 12, color: V.muted }}>{a.condition}</div>
                <div style={{ fontSize: 13, color: V.text }}>{a.threshold}</div>
                <div style={{ fontSize: 12, color: V.muted }}>Current: <span style={{ color: V.text }}>{a.current}</span></div>
                <span style={badge(a.status === "Triggered" ? V.gold : V.green)}>{a.status}</span>
                <div onClick={() => toggleAlert(i)} style={{ width: 36, height: 20, borderRadius: 10, background: alertToggles[i] ? `${V.teal}40` : V.surface, border: `1px solid ${alertToggles[i] ? V.teal : V.border}`, cursor: "pointer", position: "relative", transition: "all 0.2s" }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: alertToggles[i] ? V.teal : V.muted, position: "absolute", top: 2, left: alertToggles[i] ? 18 : 2, transition: "all 0.2s" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SPENDING ANALYTICS */}
        <div style={card()}>
          <h2 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'Syne', sans-serif" }}>Spending Analytics</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32 }}>
            <div>
              <div style={{ fontSize: 12, color: V.muted, marginBottom: 16 }}>This Month's Breakdown</div>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <PieChart segments={spendSegments} size={110} />
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {spendSegments.map((s) => (
                    <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
                      <span style={{ fontSize: 11, color: V.text }}>{s.label}</span>
                      <span style={{ fontSize: 11, color: V.muted }}>{s.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: V.muted, marginBottom: 16 }}>3-Month Trend</div>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-end", height: 80 }}>
                {monthlySpend.map((v, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
                    <div style={{ fontSize: 10, color: V.muted }}>${v}</div>
                    <div style={{ width: "100%", background: `${V.teal}20`, borderRadius: 4, height: (v / maxSpend) * 60, border: `1px solid ${V.teal}44` }} />
                    <div style={{ fontSize: 10, color: V.muted }}>{["Apr", "May", "Jun"][i]}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: V.muted, marginBottom: 16 }}>Cost Comparison</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[["Bolt Studio", "$2,340", V.gold], ["Traditional APIs", "$7,090", V.red], ["Savings", "$4,750", V.green]].map(([label, val, color]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: V.surface3, borderRadius: 8 }}>
                    <span style={{ fontSize: 12, color: V.muted }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECURITY CENTER */}
        <div style={card()}>
          <h2 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'Syne', sans-serif" }}>Security Center</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: V.surface3, borderRadius: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Multi-Signature</div>
                  <div style={{ fontSize: 11, color: V.muted }}>2-of-3 signers required</div>
                </div>
                <span style={badge(V.green)}>✓ Active</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: V.surface3, borderRadius: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Two-Factor Auth</div>
                  <div style={{ fontSize: 11, color: V.muted }}>Google Authenticator</div>
                </div>
                <div onClick={() => setTwoFA(!twoFA)} style={{ width: 44, height: 24, borderRadius: 12, background: twoFA ? `${V.green}40` : V.surface, border: `1px solid ${twoFA ? V.green : V.border}`, cursor: "pointer", position: "relative", transition: "all 0.2s" }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: twoFA ? V.green : V.muted, position: "absolute", top: 3, left: twoFA ? 23 : 3, transition: "all 0.2s" }} />
                </div>
              </div>
              <button style={{ ...btn(V.purple, { padding: "14px", textAlign: "center" }), background: `${V.purple}12` }}>⬡ Connect Hardware Wallet</button>
              <button style={{ ...btn(V.red, { padding: "14px", textAlign: "center" }), background: `${V.red}12` }}>🔒 Lock Wallet</button>
            </div>
            <div>
              <div style={{ fontSize: 12, color: V.muted, marginBottom: 12 }}>Recent Login Devices</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {DEVICES.map((d) => (
                  <div key={d.name} style={{ background: V.surface3, borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{d.name}</div>
                      <div style={{ fontSize: 11, color: V.muted }}>{d.browser} · {d.location}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={badge(d.time === "Current" ? V.green : V.muted)}>{d.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Constants ───────────────────────────────────────────────────────────────
const C = {
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
  white: "#f1f1f8",
};

// ─── Static Data ─────────────────────────────────────────────────────────────
const MARKET_INIT = [
  { id: "sp500", name: "S&P 500", value: 5248.32, delta: 12.4, pct: 0.24 },
  { id: "nasdaq", name: "NASDAQ", value: 18432.91, delta: -38.2, pct: -0.21 },
  { id: "btc", name: "BTC/USD", value: 67841.0, delta: 423.5, pct: 0.63 },
  { id: "eth", name: "ETH/USD", value: 3521.44, delta: -28.6, pct: -0.81 },
  { id: "gold", name: "Gold", value: 2318.7, delta: 5.2, pct: 0.22 },
  { id: "oil", name: "Oil (WTI)", value: 78.34, delta: -0.88, pct: -1.11 },
];

const SPARKLINE_INIT = {
  sp500: [5200, 5212, 5198, 5230, 5220, 5245, 5248],
  nasdaq: [18500, 18480, 18510, 18455, 18470, 18461, 18433],
  btc: [66900, 67200, 67050, 67600, 67400, 67810, 67841],
  eth: [3560, 3540, 3555, 3530, 3540, 3525, 3521],
  gold: [2300, 2308, 2310, 2305, 2312, 2316, 2319],
  oil: [79.1, 78.9, 78.7, 78.8, 78.5, 78.4, 78.34],
};

const COMPETITORS = [
  { id: 1, name: "DataForge AI", domain: "dataforge.ai", mrr: "$124K", alexa: 12340, followers: "18.4K", tech: ["Python", "FastAPI", "Postgres"], trend: "↑ Growing" },
  { id: 2, name: "ScrapePro", domain: "scrapepro.io", mrr: "$89K", alexa: 23100, followers: "9.2K", tech: ["Node.js", "Redis", "React"], trend: "→ Stable" },
  { id: 3, name: "Crawlify", domain: "crawlify.com", mrr: "$212K", alexa: 7800, followers: "31.1K", tech: ["Go", "Kafka", "ClickHouse"], trend: "↑ Growing" },
  { id: 4, name: "WebHarvest", domain: "webharvest.dev", mrr: "$47K", alexa: 45600, followers: "4.8K", tech: ["PHP", "MySQL", "Vue"], trend: "↓ Declining" },
  { id: 5, name: "Extractly", domain: "extractly.co", mrr: "$178K", alexa: 9200, followers: "22.6K", tech: ["Rust", "GraphQL", "Next.js"], trend: "↑ Growing" },
  { id: 6, name: "DataSnap", domain: "datasnap.net", mrr: "$63K", alexa: 34500, followers: "7.1K", tech: ["Java", "Spring", "Angular"], trend: "→ Stable" },
];

const KEYWORDS = [
  { id: "web-scraping", label: "web scraping", score: "Viral" },
  { id: "ai-agents", label: "AI agents", score: "Rising" },
  { id: "data-pipeline", label: "data pipeline", score: "Stable" },
  { id: "no-code", label: "no-code tools", score: "Fading" },
  { id: "llm-apis", label: "LLM APIs", score: "Viral" },
];

const TREND_DATA = {
  "web-scraping": [120, 135, 128, 142, 139, 155, 168, 171, 180, 178, 182, 195, 200, 210, 205, 215, 220, 225, 232, 240, 245, 248, 252, 258, 262, 265, 270, 275, 280, 285],
  "ai-agents":    [80, 85, 90, 100, 110, 125, 140, 145, 160, 175, 185, 195, 210, 225, 230, 240, 250, 265, 275, 280, 290, 298, 305, 310, 316, 320, 328, 332, 340, 345],
  "data-pipeline":[200, 198, 202, 199, 203, 201, 205, 203, 206, 204, 207, 205, 208, 206, 209, 207, 210, 208, 211, 209, 212, 210, 213, 211, 214, 212, 215, 213, 216, 214],
  "no-code":      [310, 300, 295, 288, 280, 272, 268, 260, 255, 248, 242, 238, 230, 225, 218, 212, 208, 202, 196, 190, 185, 180, 175, 170, 165, 160, 156, 152, 148, 145],
  "llm-apis":     [50, 58, 70, 90, 120, 150, 180, 210, 240, 265, 290, 310, 335, 360, 385, 405, 428, 450, 470, 488, 510, 528, 548, 565, 580, 598, 612, 628, 642, 658],
};

const RELATED_TERMS = {
  "web-scraping": [
    { term: "playwright", size: 18 }, { term: "puppeteer", size: 16 }, { term: "scrapy", size: 20 },
    { term: "proxy rotation", size: 14 }, { term: "headless browser", size: 15 }, { term: "data extraction", size: 22 },
    { term: "selenium", size: 13 }, { term: "beautifulsoup", size: 12 }, { term: "CAPTCHA bypass", size: 16 },
  ],
  "ai-agents":   [
    { term: "LangChain", size: 20 }, { term: "AutoGPT", size: 18 }, { term: "ReAct", size: 14 },
    { term: "tool use", size: 16 }, { term: "multi-agent", size: 22 }, { term: "RAG", size: 15 },
    { term: "function calling", size: 13 }, { term: "CrewAI", size: 17 }, { term: "Gemini", size: 19 },
  ],
  "data-pipeline": [
    { term: "ETL", size: 22 }, { term: "Airflow", size: 20 }, { term: "dbt", size: 18 },
    { term: "Kafka", size: 16 }, { term: "Spark", size: 15 }, { term: "Fivetran", size: 13 },
    { term: "data lakehouse", size: 14 }, { term: "orchestration", size: 17 }, { term: "streaming", size: 19 },
  ],
  "no-code":     [
    { term: "Bubble", size: 20 }, { term: "Webflow", size: 19 }, { term: "Airtable", size: 17 },
    { term: "Zapier", size: 18 }, { term: "Make.com", size: 16 }, { term: "Notion", size: 15 },
    { term: "visual builder", size: 13 }, { term: "automation", size: 22 }, { term: "citizen dev", size: 14 },
  ],
  "llm-apis":    [
    { term: "GPT-4o", size: 22 }, { term: "Claude", size: 20 }, { term: "Gemini", size: 19 },
    { term: "token cost", size: 14 }, { term: "prompt engineering", size: 16 }, { term: "fine-tuning", size: 15 },
    { term: "embeddings", size: 17 }, { term: "context window", size: 18 }, { term: "inference", size: 13 },
  ],
};

const NEWS_INIT = [
  { id: 1, source: "TechCrunch", headline: "AI scraping tools now account for 40% of all web traffic", sentiment: "Neutral", time: "2m ago", bookmarked: false },
  { id: 2, source: "Bloomberg", headline: "Data intelligence market projected to reach $2.4T by 2027", sentiment: "Positive", time: "18m ago", bookmarked: false },
  { id: 3, source: "Reuters", headline: "EU regulators crack down on unauthorized data collection practices", sentiment: "Negative", time: "34m ago", bookmarked: false },
  { id: 4, source: "Forbes", headline: "Venture capital floods into AI-powered market research startups", sentiment: "Positive", time: "1h ago", bookmarked: false },
  { id: 5, source: "WSJ", headline: "Major retailer sues data aggregator over price scraping", sentiment: "Negative", time: "2h ago", bookmarked: false },
  { id: 6, source: "Wired", headline: "Open-source scraping frameworks see record GitHub stars in Q1", sentiment: "Positive", time: "3h ago", bookmarked: false },
  { id: 7, source: "Axios", headline: "Cloudflare expands anti-bot protection to SMB tier customers", sentiment: "Neutral", time: "4h ago", bookmarked: false },
  { id: 8, source: "VentureBeat", headline: "LLM-powered data extraction reduces manual labeling by 80%", sentiment: "Positive", time: "5h ago", bookmarked: false },
  { id: 9, source: "The Verge", headline: "Reddit enforces stricter API pricing amid scraper concerns", sentiment: "Negative", time: "6h ago", bookmarked: false },
  { id: 10, source: "TechRadar", headline: "Headless browser detection arms race intensifies in 2026", sentiment: "Neutral", time: "8h ago", bookmarked: false },
];

const OPPORTUNITIES = [
  { id: 1, title: "Untapped SMB Market", desc: "80% of SMBs lack automated competitive intelligence tools. High willingness-to-pay with low current adoption.", confidence: 87, priority: "High", action: "Explore" },
  { id: 2, title: "Weak Competitor UX", desc: "DataForge AI has 42% churn — users cite poor onboarding. Opportunity to win with superior DX.", confidence: 92, priority: "High", action: "Target" },
  { id: 3, title: "Rising LLM API Demand", desc: "LLM API usage growing 340% YoY. Bundle data + AI analysis as unified offering.", confidence: 78, priority: "High", action: "Build" },
  { id: 4, title: "Geographic Expansion — APAC", desc: "Southeast Asia market has limited local scraping solutions. First-mover advantage available.", confidence: 65, priority: "Medium", action: "Research" },
  { id: 5, title: "Compliance Angle", desc: "New EU data regulations create demand for compliant scraping solutions with audit logs.", confidence: 71, priority: "Medium", action: "Pivot" },
  { id: 6, title: "Vertical SaaS — Real Estate", desc: "Property data aggregation is fragmented. Vertical-specific solution could command 3x pricing.", confidence: 58, priority: "Medium", action: "Validate" },
  { id: 7, title: "API Marketplace Listing", desc: "Rapid API marketplace has 3M developers. Listing scraping APIs could drive low-CAC acquisition.", confidence: 44, priority: "Low", action: "List" },
  { id: 8, title: "White-label Reseller Program", desc: "Agencies need white-label data solutions. Reseller margin opportunity at scale.", confidence: 49, priority: "Low", action: "Partner" },
];

const PLATFORMS = [
  { emoji: "🐦", name: "Twitter" },
  { emoji: "🟠", name: "Reddit" },
  { emoji: "💼", name: "LinkedIn" },
  { emoji: "📘", name: "Facebook" },
  { emoji: "📺", name: "YouTube" },
];

const MENTION_POOL = [
  "Just switched to Bolt Studio Pro — game changer for our data team 🔥",
  "Anyone else using this platform? The proxy rotation is insane",
  "Compared 5 scraping tools — Bolt Studio wins on reliability",
  "Our pipeline processes 2M records/day with zero downtime",
  "The scheduled jobs feature saved us 20 hours/week",
  "Real-time market intelligence finally accessible for startups",
  "Webhook delivery is flawless — zero missed events in 3 months",
  "The JSON extraction is so clean compared to competitors",
  "Love the dark theme and the DX. Finally a tool that doesn't feel like 2010",
  "If you're not using automated market intel you're already behind",
];

const USERNAMES = ["@devhunter99", "@sarahdataops", "@techfounder_x", "@growthlab", "@ml_mike", "@startup_cto", "@datanerve", "@apigeek42", "@scrapequeen", "@prodmarketer"];

const MENTION_VOL = [42, 58, 51, 73, 68, 84, 91];

// ─── Sub-components (all at module scope) ────────────────────────────────────

function Badge({ children, color = C.teal, pulse }) {
  return (
    <span style={{
      background: `${color}18`,
      border: `1px solid ${color}44`,
      color,
      fontSize: 11,
      fontWeight: 700,
      padding: "2px 10px",
      borderRadius: 20,
      letterSpacing: 0.5,
      fontFamily: "'DM Mono', monospace",
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
    }}>
      {pulse && (
        <span style={{
          width: 6, height: 6, borderRadius: "50%", background: color,
          display: "inline-block",
          boxShadow: `0 0 6px ${color}`,
          animation: "livePulse 1.2s ease-in-out infinite",
        }} />
      )}
      {children}
    </span>
  );
}

function Card({ children, style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: C.surface2,
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        padding: 20,
        cursor: onClick ? "pointer" : "default",
        transition: onClick ? "border-color 0.15s, transform 0.15s" : undefined,
        ...style,
      }}
    >{children}</div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 style={{
      fontFamily: "'Syne', sans-serif",
      fontSize: 17,
      fontWeight: 700,
      color: C.white,
      margin: "0 0 18px",
      letterSpacing: 0.3,
    }}>{children}</h2>
  );
}

function Btn({ children, onClick, color = C.teal, outline, small, style = {} }) {
  return (
    <button onClick={onClick} style={{
      background: outline ? "transparent" : `${color}22`,
      border: `1px solid ${color}55`,
      color,
      borderRadius: 8,
      padding: small ? "5px 12px" : "9px 20px",
      fontSize: small ? 12 : 13,
      fontWeight: 700,
      fontFamily: "'DM Mono', monospace",
      cursor: "pointer",
      transition: "all 0.15s",
      letterSpacing: 0.3,
      ...style,
    }}>{children}</button>
  );
}

function Sparkline({ data, color = C.teal, width = 80, height = 36 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  });
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MarketCard({ market, spark }) {
  const up = market.delta >= 0;
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 11, color: C.muted, letterSpacing: 0.5, fontFamily: "'DM Mono', monospace" }}>{market.name}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.white, fontFamily: "'Syne', sans-serif", marginTop: 2 }}>
            {market.name.includes("BTC") || market.name.includes("ETH")
              ? `$${market.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : market.name === "Oil (WTI)"
              ? `$${market.value.toFixed(2)}`
              : market.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <Sparkline data={spark} color={up ? C.green : C.red} />
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ color: up ? C.green : C.red, fontSize: 13, fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>
          {up ? "+" : ""}{market.delta.toFixed(2)}
        </span>
        <span style={{
          background: up ? `${C.green}18` : `${C.red}18`,
          border: `1px solid ${up ? C.green : C.red}44`,
          color: up ? C.green : C.red,
          fontSize: 11, fontWeight: 700, padding: "1px 8px", borderRadius: 20,
          fontFamily: "'DM Mono', monospace",
        }}>
          {up ? "+" : ""}{market.pct.toFixed(2)}%
        </span>
      </div>
    </Card>
  );
}

function CompetitorCard({ comp, onClick }) {
  const trendColor = comp.trend.startsWith("↑") ? C.green : comp.trend.startsWith("↓") ? C.red : C.gold;
  return (
    <Card onClick={onClick} style={{ cursor: "pointer" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: C.white }}>{comp.name}</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.teal, marginTop: 2 }}>{comp.domain}</div>
        </div>
        <span style={{ color: trendColor, fontWeight: 700, fontSize: 13 }}>{comp.trend}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
        {[["MRR", comp.mrr], ["Alexa", `#${comp.alexa.toLocaleString()}`], ["Followers", comp.followers]].map(([label, val]) => (
          <div key={label} style={{ background: C.surface3, borderRadius: 8, padding: "8px 10px" }}>
            <div style={{ fontSize: 10, color: C.muted, letterSpacing: 0.5 }}>{label}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: C.white, fontWeight: 700 }}>{val}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {comp.tech.map((t) => (
          <span key={t} style={{
            background: `${C.purple}18`, border: `1px solid ${C.purple}33`,
            color: C.purple, fontSize: 10, padding: "2px 8px", borderRadius: 20,
            fontFamily: "'DM Mono', monospace",
          }}>{t}</span>
        ))}
      </div>
    </Card>
  );
}

function CompetitorDrawer({ comp, onClose }) {
  if (!comp) return null;
  return (
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0, width: 380,
      background: C.surface2, borderLeft: `1px solid ${C.border}`,
      zIndex: 1000, padding: 28, overflowY: "auto",
      boxShadow: `-20px 0 60px ${C.surface}cc`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: C.white }}>{comp.name}</div>
        <Btn small outline color={C.muted} onClick={onClose}>✕ Close</Btn>
      </div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.teal, marginBottom: 16 }}>{comp.domain}</div>
      {[["MRR Estimate", comp.mrr], ["Alexa Rank", `#${comp.alexa.toLocaleString()}`], ["Social Followers", comp.followers]].map(([k, v]) => (
        <div key={k} style={{ background: C.surface3, borderRadius: 10, padding: "12px 16px", marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: C.muted, letterSpacing: 0.5, marginBottom: 4 }}>{k}</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, color: C.white, fontWeight: 700 }}>{v}</div>
        </div>
      ))}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 10, color: C.muted, letterSpacing: 0.5, marginBottom: 10 }}>TECH STACK</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {comp.tech.map((t) => (
            <span key={t} style={{
              background: `${C.purple}18`, border: `1px solid ${C.purple}33`,
              color: C.purple, fontSize: 13, padding: "5px 14px", borderRadius: 20,
              fontFamily: "'DM Mono', monospace",
            }}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 10, color: C.muted, letterSpacing: 0.5, marginBottom: 8 }}>GROWTH TREND</div>
        <div style={{
          background: C.surface3, borderRadius: 10, padding: "12px 16px",
          fontFamily: "'DM Mono', monospace", fontSize: 15, fontWeight: 700,
          color: comp.trend.startsWith("↑") ? C.green : comp.trend.startsWith("↓") ? C.red : C.gold,
        }}>{comp.trend}</div>
      </div>
    </div>
  );
}

function TrendChart({ data, color = C.teal, width = "100%", height = 160 }) {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(600);

  useEffect(() => {
    if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
    const ro = new ResizeObserver(() => {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const W = containerWidth;
  const H = height;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = W / (data.length - 1);
  const pts = data.map((v, i) => ({ x: i * step, y: H - ((v - min) / range) * (H - 16) - 8 }));
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = path + ` L${pts[pts.length - 1].x},${H} L0,${H} Z`;

  return (
    <div ref={containerRef} style={{ width }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#trendGrad)" />
        <path d={path} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p, i) => i % 5 === 0 && (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill={color} />
        ))}
      </svg>
    </div>
  );
}

function MentionVolChart({ data }) {
  const max = Math.max(...data);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 60 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{
            width: "100%", borderRadius: 4,
            height: `${Math.max((v / max) * 52, 4)}px`,
            background: `${C.teal}88`,
            transition: "height 0.4s ease",
          }} />
          <div style={{ fontSize: 9, color: C.muted, fontFamily: "'DM Mono', monospace" }}>{days[i]}</div>
        </div>
      ))}
    </div>
  );
}

function SentimentBadge({ sentiment }) {
  const map = { Positive: [C.green, "↑"], Negative: [C.red, "↓"], Neutral: [C.muted, "→"] };
  const [color, icon] = map[sentiment] || [C.muted, "—"];
  return (
    <span style={{
      background: `${color}18`, border: `1px solid ${color}44`,
      color, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
      fontFamily: "'DM Mono', monospace",
    }}>{icon} {sentiment}</span>
  );
}

function NewsItem({ item, onBookmark }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 12,
      padding: "12px 0", borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
          <span style={{
            background: `${C.purple}18`, color: C.purple,
            fontSize: 10, padding: "1px 7px", borderRadius: 20,
            fontFamily: "'DM Mono', monospace", fontWeight: 700,
          }}>{item.source}</span>
          <SentimentBadge sentiment={item.sentiment} />
          <span style={{ fontSize: 10, color: C.muted, fontFamily: "'DM Mono', monospace" }}>{item.time}</span>
        </div>
        <div style={{ fontSize: 13, color: C.white, lineHeight: 1.5 }}>{item.headline}</div>
      </div>
      <button
        onClick={() => onBookmark(item.id)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 16, color: item.bookmarked ? C.gold : C.muted,
          padding: 4, flexShrink: 0,
        }}
      >★</button>
    </div>
  );
}

function OpportunityCard({ opp }) {
  const priorityColor = { High: C.red, Medium: C.gold, Low: C.muted }[opp.priority] || C.muted;
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: C.white, flex: 1, marginRight: 8 }}>{opp.title}</div>
        <span style={{
          background: `${priorityColor}18`, border: `1px solid ${priorityColor}44`,
          color: priorityColor, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
          fontFamily: "'DM Mono', monospace", flexShrink: 0,
        }}>{opp.priority}</span>
      </div>
      <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{opp.desc}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ flex: 1, marginRight: 12 }}>
          <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>Confidence: <span style={{ color: C.white }}>{opp.confidence}%</span></div>
          <div style={{ background: C.surface3, borderRadius: 99, height: 5, overflow: "hidden" }}>
            <div style={{
              width: `${opp.confidence}%`, height: "100%", borderRadius: 99,
              background: opp.confidence > 75 ? C.green : opp.confidence > 55 ? C.gold : C.muted,
            }} />
          </div>
        </div>
        <Btn small color={C.teal}>{opp.action} →</Btn>
      </div>
    </Card>
  );
}

function MentionCard({ mention }) {
  return (
    <div style={{
      background: C.surface3, border: `1px solid ${C.border}`,
      borderRadius: 10, padding: 14, marginBottom: 8,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 16 }}>{mention.platform}</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.teal }}>{mention.username}</span>
        <span style={{ fontSize: 10, color: C.muted, marginLeft: "auto" }}>{mention.time}</span>
        <SentimentBadge sentiment={mention.sentiment} />
      </div>
      <div style={{ fontSize: 13, color: C.white, lineHeight: 1.5 }}>"{mention.text}"</div>
    </div>
  );
}

function AddCompetitorForm({ onAdd }) {
  const [val, setVal] = useState("");
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="competitor-domain.com"
        style={{
          background: C.surface3, border: `1px solid ${C.border}`, borderRadius: 8,
          color: C.white, fontFamily: "'DM Mono', monospace", fontSize: 13,
          padding: "9px 14px", flex: 1, outline: "none",
        }}
      />
      <Btn color={C.green} onClick={() => { if (val) { onAdd(val); setVal(""); } }}>+ Add</Btn>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function MarketIntelligence() {
  // Market state
  const [markets, setMarkets] = useState(MARKET_INIT);
  const [sparklines, setSparklines] = useState(SPARKLINE_INIT);

  // Competitor state
  const [competitors, setCompetitors] = useState(COMPETITORS);
  const [selectedComp, setSelectedComp] = useState(null);

  // Trend state
  const [selectedKeyword, setSelectedKeyword] = useState("web-scraping");

  // News state
  const [news, setNews] = useState(NEWS_INIT);
  const [sentimentFilter, setSentimentFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  // Opportunity state
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortByConfidence, setSortByConfidence] = useState(false);

  // Social listening state
  const [mentions, setMentions] = useState(() => {
    const sentiments = ["Positive", "Neutral", "Negative"];
    return Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      platform: PLATFORMS[i % PLATFORMS.length].emoji,
      username: USERNAMES[i],
      text: MENTION_POOL[i],
      sentiment: sentiments[i % 3],
      time: `${i + 1}m ago`,
    }));
  });
  const [mentionCount, setMentionCount] = useState(284);
  const [mentionVol, setMentionVol] = useState(MENTION_VOL);

  const mentionIdRef = useRef(100);

  // Live price updates every 3s
  useEffect(() => {
    const id = setInterval(() => {
      setMarkets((prev) =>
        prev.map((m) => {
          const seed = (Math.sin(Date.now() / 1000 + m.value) * 0.5 + 0.5);
          const chg = (seed - 0.5) * m.value * 0.004;
          const newVal = Math.max(0.01, m.value + chg);
          return {
            ...m,
            delta: parseFloat((m.delta + chg * 0.1).toFixed(2)),
            pct: parseFloat(((newVal - m.value) / m.value * 100 + m.pct).toFixed(2)),
            value: parseFloat(newVal.toFixed(m.id === "oil" ? 2 : m.id === "gold" ? 1 : m.id === "sp500" || m.id === "nasdaq" ? 2 : 2)),
          };
        })
      );
      setSparklines((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((k) => {
          const arr = [...next[k]];
          const last = arr[arr.length - 1];
          const seed = (Math.sin(Date.now() / 1000 + last) * 0.5 + 0.5);
          const chg = (seed - 0.5) * last * 0.003;
          arr.shift();
          arr.push(parseFloat((last + chg).toFixed(2)));
          next[k] = arr;
        });
        return next;
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // New mention every 5s
  useEffect(() => {
    const id = setInterval(() => {
      const sentiments = ["Positive", "Neutral", "Negative"];
      const idx = Math.floor(Date.now() / 5000) % MENTION_POOL.length;
      const pidx = Math.floor(Date.now() / 5000) % PLATFORMS.length;
      const uidx = Math.floor(Date.now() / 5000) % USERNAMES.length;
      const sidx = Math.floor(Date.now() / 5000) % sentiments.length;
      mentionIdRef.current += 1;
      const newMention = {
        id: mentionIdRef.current,
        platform: PLATFORMS[pidx].emoji,
        username: USERNAMES[uidx],
        text: MENTION_POOL[idx],
        sentiment: sentiments[sidx],
        time: "just now",
      };
      setMentions((prev) => [newMention, ...prev].slice(0, 8));
      setMentionCount((prev) => prev + 1);
      setMentionVol((prev) => {
        const next = [...prev];
        next[6] = next[6] + 1;
        return next;
      });
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const refreshNews = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setNews((prev) => {
        const replacements = [
          { id: Date.now(), source: "Bloomberg", headline: "New AI regulation bill targets data harvesting at scale", sentiment: "Negative", time: "just now", bookmarked: false },
          { id: Date.now() + 1, source: "TechCrunch", headline: "Scraping-as-a-Service market hits $800M valuation", sentiment: "Positive", time: "1m ago", bookmarked: false },
          { id: Date.now() + 2, source: "Reuters", headline: "Cloudflare reports 60% increase in bot traffic interception", sentiment: "Neutral", time: "2m ago", bookmarked: false },
        ];
        return [...replacements, ...prev.slice(3)];
      });
      setRefreshing(false);
    }, 1200);
  }, []);

  const toggleBookmark = (id) => setNews((prev) => prev.map((n) => n.id === id ? { ...n, bookmarked: !n.bookmarked } : n));

  const addCompetitor = (domain) => {
    setCompetitors((prev) => [
      ...prev,
      {
        id: prev.length + 10, name: domain, domain,
        mrr: "—", alexa: 99999, followers: "—",
        tech: ["Unknown"], trend: "→ Stable",
      },
    ]);
  };

  const filteredNews = sentimentFilter === "All" ? news : news.filter((n) => n.sentiment === sentimentFilter);

  const filteredOpps = OPPORTUNITIES
    .filter((o) => priorityFilter === "All" || o.priority === priorityFilter)
    .sort((a, b) => sortByConfidence ? b.confidence - a.confidence : 0);

  const selectedKW = KEYWORDS.find((k) => k.id === selectedKeyword) || KEYWORDS[0];
  const scoreColor = { Viral: C.red, Rising: C.green, Stable: C.teal, Fading: C.muted }[selectedKW.score] || C.muted;

  return (
    <>
      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.4); }
        }
      `}</style>
      <div style={{
        background: C.surface, minHeight: "100vh",
        fontFamily: "'DM Mono', monospace",
        padding: "32px 28px",
        color: C.white,
      }}>
        {/* HERO HEADER */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800,
              color: C.white, margin: 0, letterSpacing: -0.5,
            }}>
              Market Intelligence <span style={{ color: C.gold }}>Hub</span>
            </h1>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Badge color={C.red} pulse>LIVE</Badge>
              <Badge color={C.teal}>23 Sources</Badge>
              <Badge color={C.gold}>$2.4T Market Coverage</Badge>
            </div>
          </div>
          <p style={{ color: C.muted, fontSize: 13, marginTop: 8 }}>
            Real-time competitive intelligence, market signals, and opportunity discovery powered by continuous data feeds.
          </p>
        </div>

        {/* ── MARKET OVERVIEW ── */}
        <section style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <SectionTitle>📈 Market Overview</SectionTitle>
            <Badge color={C.red} pulse>LIVE</Badge>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
            {markets.map((m) => (
              <MarketCard key={m.id} market={m} spark={sparklines[m.id]} />
            ))}
          </div>
        </section>

        {/* ── COMPETITOR TRACKER ── */}
        <section style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <SectionTitle>🏢 Competitor Tracker</SectionTitle>
            <Badge color={C.purple}>{competitors.length} Tracked</Badge>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {competitors.map((c) => (
              <CompetitorCard key={c.id} comp={c} onClick={() => setSelectedComp(c)} />
            ))}
          </div>
          <AddCompetitorForm onAdd={addCompetitor} />
        </section>

        {/* ── TREND ANALYSIS ── */}
        <section style={{ marginBottom: 32 }}>
          <Card style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <SectionTitle>📉 Trend Analysis</SectionTitle>
              <span style={{
                background: `${scoreColor}18`, border: `1px solid ${scoreColor}44`,
                color: scoreColor, fontSize: 12, fontWeight: 700, padding: "3px 12px",
                borderRadius: 20, fontFamily: "'DM Mono', monospace",
              }}>{selectedKW.score}</span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {KEYWORDS.map((kw) => (
                <button
                  key={kw.id}
                  onClick={() => setSelectedKeyword(kw.id)}
                  style={{
                    background: selectedKeyword === kw.id ? `${C.teal}22` : C.surface3,
                    border: `1px solid ${selectedKeyword === kw.id ? C.teal : C.border}`,
                    color: selectedKeyword === kw.id ? C.teal : C.muted,
                    borderRadius: 20, padding: "5px 14px",
                    fontFamily: "'DM Mono', monospace", fontSize: 12,
                    fontWeight: selectedKeyword === kw.id ? 700 : 400,
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                >{kw.label}</button>
              ))}
            </div>
            <div style={{ marginBottom: 8 }}>
              <TrendChart data={TREND_DATA[selectedKeyword]} color={C.teal} height={160} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted, marginTop: 4, fontFamily: "'DM Mono', monospace" }}>
                <span>30 days ago</span><span>Today</span>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, color: C.muted, letterSpacing: 0.5, marginBottom: 10 }}>RELATED TERMS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(RELATED_TERMS[selectedKeyword] || []).map((t) => (
                  <span key={t.term} style={{
                    color: C.white, opacity: 0.5 + (t.size - 12) / 20,
                    fontSize: t.size * 0.6 + 8,
                    fontFamily: "'DM Mono', monospace",
                    cursor: "default",
                    padding: "2px 4px",
                  }}>{t.term}</span>
                ))}
              </div>
            </div>
          </Card>
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
          {/* ── NEWS & SIGNAL FEED ── */}
          <Card style={{ gridColumn: "1 / 2" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
              <SectionTitle>📰 News & Signal Feed</SectionTitle>
              <Btn small color={C.teal} onClick={refreshNews}>{refreshing ? "⏳ Fetching…" : "⟳ Refresh"}</Btn>
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
              {["All", "Positive", "Neutral", "Negative"].map((f) => (
                <button
                  key={f}
                  onClick={() => setSentimentFilter(f)}
                  style={{
                    background: sentimentFilter === f ? `${C.teal}22` : C.surface3,
                    border: `1px solid ${sentimentFilter === f ? C.teal : C.border}`,
                    color: sentimentFilter === f ? C.teal : C.muted,
                    borderRadius: 20, padding: "4px 12px",
                    fontFamily: "'DM Mono', monospace", fontSize: 11,
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                >{f}</button>
              ))}
            </div>
            <div style={{ maxHeight: 420, overflowY: "auto" }}>
              {filteredNews.map((item) => (
                <NewsItem key={item.id} item={item} onBookmark={toggleBookmark} />
              ))}
            </div>
          </Card>

          {/* ── SOCIAL LISTENING ── */}
          <Card style={{ gridColumn: "2 / 3" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <SectionTitle>💬 Social Listening</SectionTitle>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: C.gold, fontWeight: 700 }}>
                {mentionCount.toLocaleString()} mentions
              </span>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: C.muted, letterSpacing: 0.5, marginBottom: 8 }}>MENTION VOLUME — LAST 7 DAYS</div>
              <MentionVolChart data={mentionVol} />
            </div>
            <div style={{ maxHeight: 360, overflowY: "auto" }}>
              {mentions.map((m) => (
                <MentionCard key={m.id} mention={m} />
              ))}
            </div>
          </Card>
        </div>

        {/* ── OPPORTUNITY SCANNER ── */}
        <section style={{ marginBottom: 32 }}>
          <Card style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <SectionTitle>🎯 Opportunity Scanner</SectionTitle>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {["All", "High", "Medium", "Low"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriorityFilter(p)}
                      style={{
                        background: priorityFilter === p ? `${C.gold}22` : C.surface3,
                        border: `1px solid ${priorityFilter === p ? C.gold : C.border}`,
                        color: priorityFilter === p ? C.gold : C.muted,
                        borderRadius: 20, padding: "4px 12px",
                        fontFamily: "'DM Mono', monospace", fontSize: 11,
                        cursor: "pointer", transition: "all 0.15s",
                      }}
                    >{p}</button>
                  ))}
                </div>
                <Btn small color={C.purple} onClick={() => setSortByConfidence((v) => !v)}>
                  {sortByConfidence ? "↓ Confidence" : "Sort by Confidence"}
                </Btn>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {filteredOpps.map((o) => (
                <OpportunityCard key={o.id} opp={o} />
              ))}
            </div>
          </Card>
        </section>
      </div>

      {/* Competitor Drawer */}
      {selectedComp && (
        <>
          <div
            onClick={() => setSelectedComp(null)}
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
              zIndex: 999,
            }}
          />
          <CompetitorDrawer comp={selectedComp} onClose={() => setSelectedComp(null)} />
        </>
      )}
    </>
  );
}

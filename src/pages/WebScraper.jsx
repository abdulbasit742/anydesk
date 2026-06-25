import React, { useState, useEffect, useRef, useCallback } from "react";

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

const SAVED_JOBS_INIT = [
  { id: 1, name: "E-commerce Prices", domain: "shop.example.com", schedule: "Every 6h", lastRun: "4m ago", records: 14823, status: "Active" },
  { id: 2, name: "News Headlines", domain: "news.example.com", schedule: "Every 1h", lastRun: "58m ago", records: 3201, status: "Active" },
  { id: 3, name: "Job Listings", domain: "jobs.example.com", schedule: "Daily 9am", lastRun: "7h ago", records: 8764, status: "Paused" },
  { id: 4, name: "Social Profiles", domain: "social.example.com", schedule: "Weekly", lastRun: "3d ago", records: 1203, status: "Error" },
  { id: 5, name: "Stock Prices", domain: "finance.example.com", schedule: "Every 15m", lastRun: "12m ago", records: 52100, status: "Active" },
  { id: 6, name: "Real Estate", domain: "realty.example.com", schedule: "Daily 6am", lastRun: "16h ago", records: 9430, status: "Completed" },
  { id: 7, name: "Product Reviews", domain: "reviews.example.com", schedule: "Every 12h", lastRun: "2h ago", records: 27654, status: "Active" },
  { id: 8, name: "Weather Data", domain: "weather.example.com", schedule: "Every 30m", lastRun: "29m ago", records: 4312, status: "Paused" },
];

const MOCK_RESULTS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `Product ${String.fromCharCode(65 + i)} — Premium Edition`,
  price: `$${(19.99 + i * 7.5).toFixed(2)}`,
  rating: (3.5 + (i % 3) * 0.5).toFixed(1),
  url: `https://shop.example.com/product-${i + 1}`,
  inStock: i % 3 !== 2 ? "Yes" : "No",
}));

const PROXY_INIT = [
  { id: 1, ip: "45.67.89.101", port: 8080, country: "🇺🇸", latency: 42, status: "Online", enabled: true },
  { id: 2, ip: "91.234.56.78", port: 3128, country: "🇩🇪", latency: 78, status: "Online", enabled: true },
  { id: 3, ip: "103.45.67.12", port: 8888, country: "🇯🇵", latency: 122, status: "Online", enabled: false },
  { id: 4, ip: "178.23.45.67", port: 1080, country: "🇫🇷", latency: 65, status: "Online", enabled: true },
  { id: 5, ip: "212.34.56.78", port: 3128, country: "🇬🇧", latency: 55, status: "Offline", enabled: false },
  { id: 6, ip: "5.79.12.34", port: 8080, country: "🇳🇱", latency: 48, status: "Online", enabled: true },
  { id: 7, ip: "95.213.45.67", port: 9090, country: "🇨🇦", latency: 88, status: "Online", enabled: true },
  { id: 8, ip: "62.171.34.56", port: 8118, country: "🇸🇬", latency: 155, status: "Offline", enabled: false },
];

const SCHEDULE_INIT = [
  { id: 1, name: "E-commerce Prices", cron: "0 */6 * * *", nextRun: "1h 23m", lastStatus: "Success", enabled: true },
  { id: 2, name: "News Headlines", cron: "0 * * * *", nextRun: "4m", lastStatus: "Success", enabled: true },
  { id: 3, name: "Job Listings", cron: "0 9 * * *", nextRun: "10h 34m", lastStatus: "Warning", enabled: false },
  { id: 4, name: "Stock Prices", cron: "*/15 * * * *", nextRun: "3m", lastStatus: "Success", enabled: true },
  { id: 5, name: "Real Estate", cron: "0 6 * * *", nextRun: "7h 51m", lastStatus: "Error", enabled: false },
];

const WEBHOOK_INIT = [
  { id: 1, url: "https://hooks.zapier.com/hooks/catch/****/****", count: 4821, lastStatus: "200 OK", lastTime: "4m ago" },
  { id: 2, url: "https://webhook.site/****-****-****-****", count: 1204, lastStatus: "200 OK", lastTime: "1h ago" },
  { id: 3, url: "https://api.myapp.io/webhooks/scraper", count: 312, lastStatus: "503 Error", lastTime: "3h ago" },
];

const LOG_TEMPLATES = [
  (p) => ({ type: "success", msg: `[Page ${p}] Fetched 25 records` }),
  (p) => ({ type: "success", msg: `[Page ${p}] Parsed HTML structure` }),
  (p) => ({ type: "warning", msg: `[Page ${p}] Rate limit warning — backing off 500ms` }),
  (p) => ({ type: "success", msg: `[Page ${p}] Extracted 25/25 items` }),
  (p) => ({ type: "info", msg: `[Page ${p}] Navigating to next page…` }),
  (p) => ({ type: "error", msg: `[Page ${p}] CAPTCHA detected — retrying with proxy rotation` }),
  (p) => ({ type: "success", msg: `[Page ${p}] Proxy rotated successfully` }),
];

function isValidUrl(str) {
  try { new URL(str); return true; } catch { return false; }
}

// ─── Sub-components (all at module scope) ────────────────────────────────────

function Badge({ children, color = C.teal }) {
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
    }}>{children}</span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: C.surface2,
      border: `1px solid ${C.border}`,
      borderRadius: 14,
      padding: 24,
      ...style,
    }}>{children}</div>
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

function StatusBadge({ status }) {
  const map = {
    Active: C.green,
    Paused: C.gold,
    Error: C.red,
    Completed: C.teal,
  };
  const color = map[status] || C.muted;
  return <Badge color={color}>{status}</Badge>;
}

function Input({ value, onChange, placeholder, style = {}, invalid }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        background: C.surface3,
        border: `1px solid ${invalid ? C.red : C.border}`,
        borderRadius: 8,
        color: C.white,
        fontFamily: "'DM Mono', monospace",
        fontSize: 13,
        padding: "9px 14px",
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
        transition: "border-color 0.2s",
        ...style,
      }}
    />
  );
}

function Btn({ children, onClick, color = C.teal, outline, small, disabled, style = {} }) {
  const base = {
    background: outline ? "transparent" : `${color}22`,
    border: `1px solid ${color}55`,
    color,
    borderRadius: 8,
    padding: small ? "5px 12px" : "9px 20px",
    fontSize: small ? 12 : 13,
    fontWeight: 700,
    fontFamily: "'DM Mono', monospace",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: "all 0.15s",
    letterSpacing: 0.3,
    ...style,
  };
  return <button onClick={disabled ? undefined : onClick} style={base}>{children}</button>;
}

function ProgressBar({ value, max, color = C.teal }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div style={{ background: C.surface3, borderRadius: 99, height: 6, overflow: "hidden" }}>
      <div style={{
        width: `${pct}%`,
        height: "100%",
        background: color,
        borderRadius: 99,
        transition: "width 0.4s ease",
      }} />
    </div>
  );
}

function LogLine({ line }) {
  const col = line.type === "success" ? C.green : line.type === "warning" ? C.gold : line.type === "error" ? C.red : C.muted;
  return (
    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: col, lineHeight: 1.7 }}>
      <span style={{ color: C.muted, marginRight: 8 }}>{line.time}</span>
      {line.msg}
    </div>
  );
}

function SelectorRow({ row, idx, onUpdate, onRemove }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
      <Input
        value={row.fieldName}
        onChange={(e) => onUpdate(idx, "fieldName", e.target.value)}
        placeholder="Field Name"
        style={{ width: 130, flex: "none" }}
      />
      <Input
        value={row.selector}
        onChange={(e) => onUpdate(idx, "selector", e.target.value)}
        placeholder="CSS Selector"
        style={{ flex: 1 }}
      />
      <select
        value={row.type}
        onChange={(e) => onUpdate(idx, "type", e.target.value)}
        style={{
          background: C.surface3, border: `1px solid ${C.border}`, color: C.white,
          borderRadius: 8, padding: "9px 10px", fontFamily: "'DM Mono', monospace", fontSize: 13,
        }}
      >
        <option>text</option><option>href</option><option>src</option>
      </select>
      <Btn color={C.red} small outline onClick={() => onRemove(idx)}>✕</Btn>
    </div>
  );
}

function HeaderRow({ row, idx, onUpdate, onRemove }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
      <Input value={row.key} onChange={(e) => onUpdate(idx, "key", e.target.value)} placeholder="Header Key" style={{ flex: 1 }} />
      <Input value={row.value} onChange={(e) => onUpdate(idx, "value", e.target.value)} placeholder="Header Value" style={{ flex: 1 }} />
      <Btn color={C.red} small outline onClick={() => onRemove(idx)}>✕</Btn>
    </div>
  );
}

function ProxyRow({ proxy, onToggle, onTest, testResult }) {
  const statusColor = proxy.status === "Online" ? C.green : C.red;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, padding: "10px 16px",
      background: C.surface3, borderRadius: 10, marginBottom: 8, flexWrap: "wrap",
    }}>
      <span style={{ fontSize: 18 }}>{proxy.country}</span>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.white, flex: 1 }}>{proxy.ip}:{proxy.port}</span>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.muted }}>{proxy.latency}ms</span>
      <Badge color={statusColor}>{proxy.status}</Badge>
      {testResult && <Badge color={testResult === "OK" ? C.green : C.red}>{testResult}</Badge>}
      <Btn small color={C.teal} onClick={() => onTest(proxy.id)}>Test</Btn>
      <div
        onClick={() => onToggle(proxy.id)}
        style={{
          width: 36, height: 20, borderRadius: 99,
          background: proxy.enabled ? C.teal : C.surface,
          border: `1px solid ${C.border}`, cursor: "pointer",
          position: "relative", transition: "background 0.2s",
        }}
      >
        <div style={{
          width: 14, height: 14, borderRadius: "50%", background: C.white,
          position: "absolute", top: 2, left: proxy.enabled ? 18 : 2,
          transition: "left 0.2s",
        }} />
      </div>
    </div>
  );
}

function ScheduleCard({ job, onToggle, onEdit }) {
  const statusColor = { Success: C.green, Warning: C.gold, Error: C.red }[job.lastStatus] || C.muted;
  return (
    <div style={{
      background: C.surface3, border: `1px solid ${C.border}`,
      borderRadius: 12, padding: 16, marginBottom: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontWeight: 700, color: C.white, fontSize: 14, fontFamily: "'Syne', sans-serif" }}>{job.name}</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.muted, marginTop: 2 }}>{job.cron}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: C.muted }}>Next run</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.gold }}>{job.nextRun}</div>
          </div>
          <Badge color={statusColor}>{job.lastStatus}</Badge>
          <Btn small color={C.purple} onClick={() => onEdit(job.id)}>Edit</Btn>
          <div
            onClick={() => onToggle(job.id)}
            style={{
              width: 36, height: 20, borderRadius: 99,
              background: job.enabled ? C.teal : C.surface,
              border: `1px solid ${C.border}`, cursor: "pointer",
              position: "relative", transition: "background 0.2s",
            }}
          >
            <div style={{
              width: 14, height: 14, borderRadius: "50%", background: C.white,
              position: "absolute", top: 2, left: job.enabled ? 18 : 2,
              transition: "left 0.2s",
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function WebhookRow({ wh, onTest }) {
  const statusColor = wh.lastStatus.startsWith("200") ? C.green : C.red;
  const maskedUrl = wh.url.replace(/(?<=.{20}).(?=.{10})/g, "*");
  return (
    <div style={{
      background: C.surface3, border: `1px solid ${C.border}`,
      borderRadius: 12, padding: 16, marginBottom: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.teal }}>{maskedUrl}</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>
            {wh.count.toLocaleString()} deliveries · Last: {wh.lastTime}
          </div>
        </div>
        <Badge color={statusColor}>{wh.lastStatus}</Badge>
        <Btn small color={C.teal} onClick={() => onTest(wh.id)}>Test</Btn>
      </div>
    </div>
  );
}

function ResultsTable({ data }) {
  const keys = Object.keys(data[0] || {});
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
        <thead>
          <tr>
            {keys.map((k) => (
              <th key={k} style={{
                padding: "8px 12px", textAlign: "left",
                color: C.gold, borderBottom: `1px solid ${C.border}`,
                fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase",
              }}>{k}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? C.surface2 : C.surface3 }}>
              {keys.map((k) => (
                <td key={k} style={{ padding: "8px 12px", color: C.white, borderBottom: `1px solid ${C.border}` }}>
                  {String(row[k])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function JsonView({ data }) {
  const json = JSON.stringify(data, null, 2);
  const highlighted = json
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"([^"]+)":/g, `<span style="color:${C.gold}">"$1"</span>:`)
    .replace(/: "([^"]*)"/g, `: <span style="color:${C.teal}">"$1"</span>`);
  return (
    <div
      style={{
        background: C.surface, borderRadius: 10, padding: 16,
        fontFamily: "'DM Mono', monospace", fontSize: 12, lineHeight: 1.7,
        color: C.white, overflowX: "auto", maxHeight: 340, overflowY: "auto",
      }}
      dangerouslySetInnerHTML={{ __html: `<pre style="margin:0">${highlighted}</pre>` }}
    />
  );
}

function CsvView({ data }) {
  if (!data.length) return null;
  const keys = Object.keys(data[0]);
  const lines = [keys.join(","), ...data.map((r) => keys.map((k) => `"${r[k]}"`).join(","))].join("\n");
  return (
    <div style={{
      background: C.surface, borderRadius: 10, padding: 16,
      fontFamily: "'DM Mono', monospace", fontSize: 12, lineHeight: 1.7,
      color: C.teal, overflowX: "auto", maxHeight: 340, overflowY: "auto",
    }}>
      <pre style={{ margin: 0 }}>{lines}</pre>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function WebScraper() {
  // Job builder state
  const [url, setUrl] = useState("https://example.com/products");
  const [urlTouched, setUrlTouched] = useState(false);
  const [selectors, setSelectors] = useState([
    { fieldName: "title", selector: "h2.product-title", type: "text" },
    { fieldName: "price", selector: "span.price", type: "text" },
    { fieldName: "image", selector: "img.thumb", type: "src" },
  ]);
  const [pagination, setPagination] = useState("auto");
  const [pageCount, setPageCount] = useState("10");
  const [headers, setHeaders] = useState([
    { key: "User-Agent", value: "Mozilla/5.0 (compatible; BoltBot/1.0)" },
  ]);
  const [rateLimit, setRateLimit] = useState(3);

  // Scraping state
  const [scraping, setScraping] = useState(false);
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages] = useState(10);
  const [recordCount, setRecordCount] = useState(0);
  const scrapeRef = useRef(null);
  const logEndRef = useRef(null);

  // Saved jobs state
  const [savedJobs, setSavedJobs] = useState(SAVED_JOBS_INIT);
  const [hoveredRow, setHoveredRow] = useState(null);

  // Results viewer
  const [viewMode, setViewMode] = useState("table");
  const [copied, setCopied] = useState(false);

  // Proxy state
  const [proxies, setProxies] = useState(PROXY_INIT);
  const [proxyTestResults, setProxyTestResults] = useState({});
  const [proxyIp, setProxyIp] = useState("");
  const [proxyPort, setProxyPort] = useState("");
  const [testingAll, setTestingAll] = useState(false);

  // Scheduler
  const [schedules, setSchedules] = useState(SCHEDULE_INIT);
  const [editingCron, setEditingCron] = useState(null);
  const [cronEdit, setCronEdit] = useState("");

  // Webhooks
  const [webhooks, setWebhooks] = useState(WEBHOOK_INIT);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookTests, setWebhookTests] = useState({});

  // Auto-scroll logs
  useEffect(() => {
    if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const getNow = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
  };

  const startScrape = useCallback(() => {
    if (!isValidUrl(url)) { setUrlTouched(true); return; }
    setScraping(true);
    setLogs([]);
    setCurrentPage(0);
    setRecordCount(0);
    let page = 1;
    let records = 0;
    const templates = LOG_TEMPLATES;
    scrapeRef.current = setInterval(() => {
      if (page > totalPages) {
        clearInterval(scrapeRef.current);
        setScraping(false);
        setLogs((prev) => [
          ...prev,
          { type: "success", msg: `✓ Scrape complete — ${records} records extracted`, time: getNow() },
        ]);
        return;
      }
      const tmpl = templates[page % templates.length];
      const line = tmpl(page);
      setLogs((prev) => [...prev, { ...line, time: getNow() }]);
      records += 25;
      setRecordCount(records);
      setCurrentPage(page);
      page++;
    }, 700);
  }, [url, totalPages]);

  const cancelScrape = useCallback(() => {
    clearInterval(scrapeRef.current);
    setScraping(false);
    setLogs((prev) => [...prev, { type: "warning", msg: "Scrape cancelled by user", time: getNow() }]);
  }, []);

  useEffect(() => () => clearInterval(scrapeRef.current), []);

  const addSelector = () => setSelectors((prev) => [...prev, { fieldName: "", selector: "", type: "text" }]);
  const removeSelector = (i) => setSelectors((prev) => prev.filter((_, idx) => idx !== i));
  const updateSelector = (i, key, val) => setSelectors((prev) => prev.map((r, idx) => idx === i ? { ...r, [key]: val } : r));

  const addHeader = () => setHeaders((prev) => [...prev, { key: "", value: "" }]);
  const removeHeader = (i) => setHeaders((prev) => prev.filter((_, idx) => idx !== i));
  const updateHeader = (i, key, val) => setHeaders((prev) => prev.map((r, idx) => idx === i ? { ...r, [key]: val } : r));

  const handleCopy = () => {
    const text = JSON.stringify(MOCK_RESULTS, null, 2);
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const testProxy = (id) => {
    setProxyTestResults((prev) => ({ ...prev, [id]: "Testing…" }));
    setTimeout(() => {
      setProxyTestResults((prev) => ({ ...prev, [id]: id % 3 === 0 ? "FAIL" : "OK" }));
    }, 1000 + (id * 200) % 800);
  };

  const testAllProxies = () => {
    setTestingAll(true);
    proxies.forEach((p) => testProxy(p.id));
    setTimeout(() => setTestingAll(false), 3000);
  };

  const toggleProxy = (id) => setProxies((prev) => prev.map((p) => p.id === id ? { ...p, enabled: !p.enabled } : p));

  const addProxy = () => {
    if (!proxyIp || !proxyPort) return;
    setProxies((prev) => [...prev, {
      id: prev.length + 10, ip: proxyIp, port: parseInt(proxyPort), country: "🌐",
      latency: 0, status: "Unknown", enabled: true,
    }]);
    setProxyIp(""); setProxyPort("");
  };

  const toggleSchedule = (id) => setSchedules((prev) => prev.map((s) => s.id === id ? { ...s, enabled: !s.enabled } : s));

  const startEditCron = (id) => {
    const job = schedules.find((s) => s.id === id);
    setEditingCron(id);
    setCronEdit(job.cron);
  };

  const saveCron = () => {
    setSchedules((prev) => prev.map((s) => s.id === editingCron ? { ...s, cron: cronEdit } : s));
    setEditingCron(null);
  };

  const testWebhook = (id) => {
    setWebhookTests((prev) => ({ ...prev, [id]: "Sending…" }));
    setTimeout(() => {
      setWebhookTests((prev) => ({ ...prev, [id]: id === 3 ? "503 Error" : "200 OK" }));
    }, 1200);
  };

  const addWebhook = () => {
    if (!webhookUrl) return;
    setWebhooks((prev) => [...prev, { id: prev.length + 10, url: webhookUrl, count: 0, lastStatus: "Never", lastTime: "—" }]);
    setWebhookUrl("");
  };

  const deleteJob = (id) => setSavedJobs((prev) => prev.filter((j) => j.id !== id));

  const urlInvalid = urlTouched && !isValidUrl(url);

  return (
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
            Web Scraper <span style={{ color: C.gold }}>Studio</span>
          </h1>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Badge color={C.green}>🟢 8 Active Jobs</Badge>
            <Badge color={C.teal}>1.2M Records</Badge>
            <Badge color={C.muted}>Last Run 4m ago</Badge>
          </div>
        </div>
        <p style={{ color: C.muted, fontSize: 13, marginTop: 8 }}>
          Automate data extraction from any website with intelligent selectors, proxy rotation, and scheduled delivery.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* ── SCRAPE JOB BUILDER ── */}
        <Card style={{ gridColumn: "1 / -1" }}>
          <SectionTitle>⚙ Scrape Job Builder</SectionTitle>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: C.muted, letterSpacing: 0.5, display: "block", marginBottom: 6 }}>TARGET URL</label>
            <Input
              value={url}
              onChange={(e) => { setUrl(e.target.value); setUrlTouched(true); }}
              placeholder="https://example.com/products"
              invalid={urlInvalid}
              style={{ fontSize: 15 }}
            />
            {urlInvalid && <div style={{ color: C.red, fontSize: 11, marginTop: 4 }}>⚠ Please enter a valid URL</div>}
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <label style={{ fontSize: 11, color: C.muted, letterSpacing: 0.5 }}>CSS SELECTOR RULES</label>
              <Btn small color={C.teal} onClick={addSelector}>+ Add Field</Btn>
            </div>
            {selectors.map((row, i) => (
              <SelectorRow key={i} row={row} idx={i} onUpdate={updateSelector} onRemove={removeSelector} />
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 11, color: C.muted, letterSpacing: 0.5, display: "block", marginBottom: 6 }}>PAGINATION MODE</label>
              <select
                value={pagination}
                onChange={(e) => setPagination(e.target.value)}
                style={{
                  background: C.surface3, border: `1px solid ${C.border}`, color: C.white,
                  borderRadius: 8, padding: "9px 14px", fontFamily: "'DM Mono', monospace",
                  fontSize: 13, width: "100%",
                }}
              >
                <option value="auto">Auto-detect</option>
                <option value="manual">Manual Page Count</option>
                <option value="infinite">Infinite Scroll</option>
              </select>
              {pagination === "manual" && (
                <Input value={pageCount} onChange={(e) => setPageCount(e.target.value)} placeholder="10" style={{ marginTop: 8 }} />
              )}
            </div>
            <div>
              <label style={{ fontSize: 11, color: C.muted, letterSpacing: 0.5, display: "block", marginBottom: 6 }}>
                RATE LIMIT — <span style={{ color: C.gold }}>{rateLimit} req/s</span>
              </label>
              <input
                type="range" min={1} max={10} value={rateLimit}
                onChange={(e) => setRateLimit(Number(e.target.value))}
                style={{ width: "100%", accentColor: C.gold, marginTop: 8 }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted }}>
                <span>1 req/s</span><span>10 req/s</span>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <label style={{ fontSize: 11, color: C.muted, letterSpacing: 0.5 }}>REQUEST HEADERS</label>
              <Btn small color={C.purple} onClick={addHeader}>+ Add Header</Btn>
            </div>
            {headers.map((row, i) => (
              <HeaderRow key={i} row={row} idx={i} onUpdate={updateHeader} onRemove={removeHeader} />
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Btn onClick={startScrape} disabled={scraping} color={C.gold} style={{ minWidth: 160 }}>
              {scraping ? "⏳ Scraping…" : "▶ Start Scrape"}
            </Btn>
            {scraping && <Btn color={C.red} onClick={cancelScrape}>⏹ Cancel</Btn>}
          </div>
        </Card>

        {/* ── LIVE SCRAPING FEED ── */}
        {(logs.length > 0 || scraping) && (
          <Card style={{ gridColumn: "1 / -1" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <SectionTitle>📡 Live Scraping Feed</SectionTitle>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: C.teal }}>
                  {recordCount.toLocaleString()} records extracted
                </span>
                {scraping && <Btn color={C.red} small onClick={cancelScrape}>⏹ Cancel</Btn>}
              </div>
            </div>

            <ProgressBar value={currentPage} max={totalPages} color={C.teal} />
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4, marginBottom: 12 }}>
              Page {currentPage} / {totalPages} scraped
            </div>

            <div style={{
              background: C.surface, borderRadius: 10, padding: 16,
              maxHeight: 220, overflowY: "auto", border: `1px solid ${C.border}`,
            }}>
              {logs.map((line, i) => <LogLine key={i} line={line} />)}
              {scraping && (
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.muted }}>
                  <span style={{ animation: "pulse 1s infinite" }}>▌</span> Processing…
                </div>
              )}
              <div ref={logEndRef} />
            </div>
          </Card>
        )}

        {/* ── SAVED JOBS TABLE ── */}
        <Card style={{ gridColumn: "1 / -1" }}>
          <SectionTitle>📋 Saved Jobs</SectionTitle>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
              <thead>
                <tr>
                  {["Job Name", "Domain", "Schedule", "Last Run", "Records", "Status", "Actions"].map((h) => (
                    <th key={h} style={{
                      padding: "8px 14px", textAlign: "left", color: C.gold,
                      borderBottom: `1px solid ${C.border}`, fontWeight: 700,
                      letterSpacing: 0.5, textTransform: "uppercase", fontSize: 11,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {savedJobs.map((job) => (
                  <tr
                    key={job.id}
                    onMouseEnter={() => setHoveredRow(job.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      background: hoveredRow === job.id ? `${C.teal}08` : "transparent",
                      transition: "background 0.15s",
                    }}
                  >
                    <td style={{ padding: "10px 14px", color: C.white, borderBottom: `1px solid ${C.border}` }}>{job.name}</td>
                    <td style={{ padding: "10px 14px", color: C.teal, borderBottom: `1px solid ${C.border}` }}>{job.domain}</td>
                    <td style={{ padding: "10px 14px", color: C.muted, borderBottom: `1px solid ${C.border}` }}>{job.schedule}</td>
                    <td style={{ padding: "10px 14px", color: C.muted, borderBottom: `1px solid ${C.border}` }}>{job.lastRun}</td>
                    <td style={{ padding: "10px 14px", color: C.white, borderBottom: `1px solid ${C.border}` }}>{job.records.toLocaleString()}</td>
                    <td style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}` }}><StatusBadge status={job.status} /></td>
                    <td style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}` }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <Btn small color={C.green} onClick={() => {}}>▶ Run</Btn>
                        <Btn small color={C.gold} outline onClick={() => {}}>Edit</Btn>
                        <Btn small color={C.teal} outline onClick={() => {}}>Results</Btn>
                        <Btn small color={C.red} outline onClick={() => deleteJob(job.id)}>✕</Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* ── RESULTS VIEWER ── */}
        <Card style={{ gridColumn: "1 / -1" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
            <SectionTitle>📊 Results Viewer</SectionTitle>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {["table", "json", "csv"].map((m) => (
                <Btn key={m} small color={viewMode === m ? C.gold : C.muted} onClick={() => setViewMode(m)}>
                  {m.toUpperCase()}
                </Btn>
              ))}
              <Btn small color={C.teal} onClick={handleCopy}>{copied ? "✓ Copied" : "Copy"}</Btn>
              <Btn small color={C.purple}>⬇ Download</Btn>
            </div>
          </div>
          {viewMode === "table" && <ResultsTable data={MOCK_RESULTS} />}
          {viewMode === "json" && <JsonView data={MOCK_RESULTS} />}
          {viewMode === "csv" && <CsvView data={MOCK_RESULTS} />}
        </Card>

        {/* ── PROXY MANAGER ── */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <SectionTitle>🌐 Proxy Manager</SectionTitle>
            <Btn small color={C.teal} onClick={testAllProxies} disabled={testingAll}>
              {testingAll ? "Testing…" : "Test All"}
            </Btn>
          </div>
          {proxies.map((p) => (
            <ProxyRow key={p.id} proxy={p} onToggle={toggleProxy} onTest={testProxy} testResult={proxyTestResults[p.id]} />
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <Input value={proxyIp} onChange={(e) => setProxyIp(e.target.value)} placeholder="IP Address" />
            <Input value={proxyPort} onChange={(e) => setProxyPort(e.target.value)} placeholder="Port" style={{ width: 90, flex: "none" }} />
            <Btn color={C.green} small onClick={addProxy} style={{ flex: "none" }}>Add</Btn>
          </div>
        </Card>

        {/* ── SCHEDULER ── */}
        <Card>
          <SectionTitle>🕒 Job Scheduler</SectionTitle>
          {schedules.map((job) => (
            <React.Fragment key={job.id}>
              <ScheduleCard job={job} onToggle={toggleSchedule} onEdit={startEditCron} />
              {editingCron === job.id && (
                <div style={{
                  background: C.surface, border: `1px solid ${C.teal}44`,
                  borderRadius: 10, padding: 14, marginBottom: 10,
                }}>
                  <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 6 }}>CRON EXPRESSION</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Input value={cronEdit} onChange={(e) => setCronEdit(e.target.value)} placeholder="* * * * *" />
                    <Btn small color={C.green} onClick={saveCron}>Save</Btn>
                    <Btn small color={C.muted} outline onClick={() => setEditingCron(null)}>✕</Btn>
                  </div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 6 }}>
                    min hour day month weekday
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </Card>

        {/* ── WEBHOOK DELIVERY ── */}
        <Card style={{ gridColumn: "1 / -1" }}>
          <SectionTitle>🔔 Webhook Delivery</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12, marginBottom: 16 }}>
            {webhooks.map((wh) => (
              <WebhookRow key={wh.id} wh={wh} onTest={testWebhook} />
            ))}
          </div>
          {Object.entries(webhookTests).length > 0 && (
            <div style={{ marginBottom: 14 }}>
              {Object.entries(webhookTests).map(([id, result]) => (
                <div key={id} style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: result.includes("200") ? C.green : C.red }}>
                  Webhook #{id}: {result}
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Input
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-endpoint.com/webhook"
              style={{ flex: 1 }}
            />
            <Btn color={C.green} onClick={addWebhook} style={{ flex: "none" }}>+ Add Webhook</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

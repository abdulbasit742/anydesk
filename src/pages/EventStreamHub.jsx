import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

// ─── CSS VARS ────────────────────────────────────────────────────────────────
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
  blue: "#60a5fa",
  green: "#4ade80",
  amber: "#fbbf24",
  white: "#f0f0fa",
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const INITIAL_CONNECTIONS = [
  { id: "c1", name: "AI Broadcast Stream", protocol: "SSE", url: "wss://api.bolt.ai/stream", status: "CONNECTED", color: V.teal },
  { id: "c2", name: "Workflow Trigger Bus", protocol: "WS", url: "wss://workflows.bolt.ai/ws", status: "CONNECTED", color: V.purple },
  { id: "c3", name: "Analytics Feed", protocol: "SSE", url: "https://analytics.bolt.ai/events", status: "CONNECTED", color: V.blue },
  { id: "c4", name: "Notification Relay", protocol: "WS", url: "wss://notify.bolt.ai/ws", status: "DISCONNECTED", color: V.muted },
  { id: "c5", name: "Market Data Feed", protocol: "SSE", url: "https://market.bolt.ai/stream", status: "ERROR", color: V.red },
  { id: "c6", name: "Deployment Events", protocol: "WS", url: "wss://deploy.bolt.ai/ws", status: "IDLE", color: V.gold },
];

const EVENT_TYPES = ["message", "ping", "error", "connected", "data", "heartbeat", "broadcast", "trigger", "alert"];

const EVENT_TYPE_COLORS = {
  message: V.white,
  ping: V.teal,
  error: V.red,
  connected: V.green,
  data: V.green,
  heartbeat: V.teal,
  broadcast: V.amber,
  trigger: V.purple,
  alert: V.red,
};

const INITIAL_RULES = [
  { id: "r1", name: "Error Alert", conditions: [{ field: "type", op: "equals", value: "error" }], action: "Show toast", enabled: true, hits: 14 },
  { id: "r2", name: "AI Broadcast Watch", conditions: [{ field: "source", op: "equals", value: "AI Broadcast Stream" }], action: "Log to file", enabled: true, hits: 241 },
  { id: "r3", name: "Trigger Escalation", conditions: [{ field: "type", op: "equals", value: "trigger" }, { field: "source", op: "equals", value: "Workflow Trigger Bus" }], action: "Trigger webhook", enabled: false, hits: 7 },
  { id: "r4", name: "Large Payload", conditions: [{ field: "size", op: "gt", value: "1024" }], action: "Show toast", enabled: true, hits: 3 },
];

function generatePayload(type, connName) {
  const base = {
    eventId: `evt_${Math.random().toString(36).slice(2, 10)}`,
    type,
    source: connName,
    timestamp: new Date().toISOString(),
    version: "1.0",
  };
  if (type === "data" || type === "message") {
    return { ...base, body: { value: +(Math.random() * 1000).toFixed(2), unit: "req/s", node: `node-${Math.floor(Math.random() * 8) + 1}` } };
  }
  if (type === "error") {
    const codes = [500, 502, 503, 429, 408];
    return { ...base, body: { code: codes[Math.floor(Math.random() * codes.length)], message: "Upstream connection refused", retryAfter: 3000 } };
  }
  if (type === "trigger") {
    return { ...base, body: { workflowId: `wf_${Math.random().toString(36).slice(2, 8)}`, step: Math.floor(Math.random() * 10) + 1, totalSteps: 10 } };
  }
  if (type === "broadcast") {
    return { ...base, body: { channel: "global", payload: { users: Math.floor(Math.random() * 5000), message: "System update scheduled" } } };
  }
  return { ...base, body: { ok: true } };
}

function generateEvent(connections) {
  const active = connections.filter((c) => c.status === "CONNECTED");
  if (!active.length) return null;
  const conn = active[Math.floor(Math.random() * active.length)];
  const type = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
  const payload = generatePayload(type, conn.name);
  const payloadStr = JSON.stringify(payload.body);
  return {
    id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date(),
    source: conn.name,
    sourceColor: conn.color,
    sourceId: conn.id,
    type,
    payload,
    size: payloadStr.length,
    latency: Math.floor(Math.random() * 80) + 2,
  };
}

function fmt(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}.${String(d.getMilliseconds()).padStart(3, "0")}`;
}

// ─── SYNTAX HIGHLIGHT ─────────────────────────────────────────────────────────
function JsonNode({ data, depth = 0 }) {
  const [collapsed, setCollapsed] = useState(depth > 2);
  const indent = depth * 16;
  if (data === null) return <span style={{ color: V.muted }}>null</span>;
  if (typeof data === "boolean") return <span style={{ color: V.purple }}>{String(data)}</span>;
  if (typeof data === "number") return <span style={{ color: V.gold }}>{data}</span>;
  if (typeof data === "string") return <span style={{ color: V.green }}>"{data}"</span>;
  if (Array.isArray(data)) {
    if (!data.length) return <span style={{ color: V.muted }}>[]</span>;
    return (
      <span>
        <span style={{ color: V.muted, cursor: "pointer", userSelect: "none" }} onClick={() => setCollapsed((p) => !p)}>{collapsed ? "▶" : "▼"}</span>
        <span style={{ color: V.border }}> [</span>
        {collapsed ? (
          <span style={{ color: V.muted, cursor: "pointer" }} onClick={() => setCollapsed(false)}> {data.length} items… </span>
        ) : (
          <div style={{ paddingLeft: 16 }}>
            {data.map((item, i) => (
              <div key={i} style={{ paddingLeft: indent }}>
                <JsonNode data={item} depth={depth + 1} />
                {i < data.length - 1 && <span style={{ color: V.muted }}>,</span>}
              </div>
            ))}
          </div>
        )}
        <span style={{ color: V.border }}>]</span>
      </span>
    );
  }
  if (typeof data === "object") {
    const keys = Object.keys(data);
    if (!keys.length) return <span style={{ color: V.muted }}>{"{}"}</span>;
    return (
      <span>
        <span style={{ color: V.muted, cursor: "pointer", userSelect: "none" }} onClick={() => setCollapsed((p) => !p)}>{collapsed ? "▶" : "▼"}</span>
        <span style={{ color: V.border }}> {"{"}</span>
        {collapsed ? (
          <span style={{ color: V.muted, cursor: "pointer" }} onClick={() => setCollapsed(false)}> {keys.length} keys… </span>
        ) : (
          <div style={{ paddingLeft: 16 }}>
            {keys.map((k, i) => (
              <div key={k}>
                <span style={{ color: V.teal }}>"{k}"</span>
                <span style={{ color: V.muted }}>: </span>
                <JsonNode data={data[k]} depth={depth + 1} />
                {i < keys.length - 1 && <span style={{ color: V.muted }}>,</span>}
              </div>
            ))}
          </div>
        )}
        <span style={{ color: V.border }}>{"}"}</span>
      </span>
    );
  }
  return <span>{String(data)}</span>;
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function ToastStack({ toasts, onDismiss }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => onDismiss(t.id)}
          style={{
            background: t.kind === "error" ? "#2a0a0a" : t.kind === "rule" ? "#1a1500" : V.surface3,
            border: `1px solid ${t.kind === "error" ? V.red : t.kind === "rule" ? V.gold : V.teal}`,
            borderLeft: `4px solid ${t.kind === "error" ? V.red : t.kind === "rule" ? V.gold : V.teal}`,
            color: V.white,
            padding: "10px 16px",
            borderRadius: 8,
            fontSize: 13,
            fontFamily: "'DM Mono', monospace",
            cursor: "pointer",
            boxShadow: `0 4px 20px rgba(0,0,0,0.5)`,
            maxWidth: 320,
            animation: "slideIn 0.2s ease",
          }}
        >
          <div style={{ fontWeight: 600, color: t.kind === "error" ? V.red : t.kind === "rule" ? V.gold : V.teal }}>{t.title}</div>
          <div style={{ color: V.muted, marginTop: 2, fontSize: 12 }}>{t.message}</div>
        </div>
      ))}
    </div>
  );
}

// ─── THROUGHPUT CHART ─────────────────────────────────────────────────────────
// ─── THROUGHPUT CHART CONSTANTS ──────────────────────────────────────────────
const CHART_W = 700;
const CHART_H = 160;
const CHART_PAD = { t: 12, r: 12, b: 36, l: 44 };
const CHART_iW = CHART_W - CHART_PAD.l - CHART_PAD.r;
const CHART_iH = CHART_H - CHART_PAD.t - CHART_PAD.b;
const CHART_POINTS = 60;

function ThroughputChart({ history, connections }) {
  const connLines = useMemo(() => {
    return connections
      .filter((c) => c.status === "CONNECTED")
      .map((c) => {
        const pts = history[c.id] || Array(CHART_POINTS).fill(0);
        const maxVal = Math.max(...pts, 1);
        const points = pts.map((v, i) => {
          const x = CHART_PAD.l + (i / (CHART_POINTS - 1)) * CHART_iW;
          const y = CHART_PAD.t + CHART_iH - (v / maxVal) * CHART_iH;
          return `${x},${y}`;
        });
        return { conn: c, path: `M ${points.join(" L ")}` };
      });
  }, [history, connections]);

  const globalMax = useMemo(() => {
    const all = connections.flatMap((c) => history[c.id] || []);
    return Math.max(...all, 1);
  }, [history, connections]);

  const yLabels = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
    y: CHART_PAD.t + CHART_iH - f * CHART_iH,
    val: Math.round(f * globalMax),
  }));

  return (
    <svg width="100%" viewBox={`0 0 ${CHART_W} ${CHART_H}`} style={{ display: "block" }}>
      {/* Grid */}
      {yLabels.map((l) => (
        <g key={l.val}>
          <line x1={CHART_PAD.l} y1={l.y} x2={CHART_PAD.l + CHART_iW} y2={l.y} stroke={V.border} strokeWidth={1} strokeDasharray="4,4" />
          <text x={CHART_PAD.l - 6} y={l.y + 4} textAnchor="end" fill={V.muted} fontSize={10} fontFamily="'DM Mono',monospace">{l.val}</text>
        </g>
      ))}
      {/* X axis labels */}
      {[-60, -45, -30, -15, 0].map((s) => {
        const x = CHART_PAD.l + ((s + 60) / 60) * CHART_iW;
        return (
          <text key={s} x={x} y={CHART_H - 8} textAnchor="middle" fill={V.muted} fontSize={10} fontFamily="'DM Mono',monospace">{s}s</text>
        );
      })}
      {/* Lines */}
      {connLines.map(({ conn, path }) => (
        <path key={conn.id} d={path} fill="none" stroke={conn.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" opacity={0.85} />
      ))}
      {/* Axes */}
      <line x1={CHART_PAD.l} y1={CHART_PAD.t} x2={CHART_PAD.l} y2={CHART_PAD.t + CHART_iH} stroke={V.border} strokeWidth={1} />
      <line x1={CHART_PAD.l} y1={CHART_PAD.t + CHART_iH} x2={CHART_PAD.l + CHART_iW} y2={CHART_PAD.t + CHART_iH} stroke={V.border} strokeWidth={1} />
      {/* Legend */}
      {connLines.map(({ conn }, i) => (
        <g key={conn.id} transform={`translate(${CHART_PAD.l + i * 150}, ${CHART_H - 4})`}>
          <line x1={0} y1={-8} x2={16} y2={-8} stroke={conn.color} strokeWidth={2} />
          <text x={20} y={-4} fill={V.muted} fontSize={9} fontFamily="'DM Mono',monospace">{conn.name.slice(0, 16)}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── DONUT CHART ──────────────────────────────────────────────────────────────
function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  const cx = 60, cy = 60, r = 48, inner = 28;
  const slices = [];
  let currentAngle = -Math.PI / 2;
  for (const d of data) {
    const sweep = (d.count / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(currentAngle);
    const y1 = cy + r * Math.sin(currentAngle);
    const x2 = cx + r * Math.cos(currentAngle + sweep);
    const y2 = cy + r * Math.sin(currentAngle + sweep);
    const xi1 = cx + inner * Math.cos(currentAngle);
    const yi1 = cy + inner * Math.sin(currentAngle);
    const xi2 = cx + inner * Math.cos(currentAngle + sweep);
    const yi2 = cy + inner * Math.sin(currentAngle + sweep);
    const large = sweep > Math.PI ? 1 : 0;
    const path = `M ${xi1} ${yi1} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${inner} ${inner} 0 ${large} 0 ${xi1} ${yi1} Z`;
    currentAngle += sweep;
    slices.push({ ...d, path });
  }
  return (
    <svg width={120} height={120}>
      {slices.map((s) => <path key={s.type} d={s.path} fill={s.color} opacity={0.9} />)}
      <text x={cx} y={cy + 4} textAnchor="middle" fill={V.white} fontSize={12} fontFamily="'DM Mono',monospace">{total}</text>
    </svg>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function EventStreamHub() {
  const [connections, setConnections] = useState(INITIAL_CONNECTIONS);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [inspectorHistory, setInspectorHistory] = useState([]);
  const [paused, setPaused] = useState(false);
  const [filterSource, setFilterSource] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterSearch, setFilterSearch] = useState("");
  const [activeTab, setActiveTab] = useState("stream"); // stream | replay | rules | stats | export
  const [toasts, setToasts] = useState([]);
  const [rules, setRules] = useState(INITIAL_RULES);
  const [throughputHistory, setThroughputHistory] = useState({});
  const [lifetimeCount, setLifetimeCount] = useState(0);
  const [lastMinuteEvents, setLastMinuteEvents] = useState([]);
  const [errorRate, setErrorRate] = useState(0);
  const [avgPayloadSize, setAvgPayloadSize] = useState(0);
  const [maxLatency, setMaxLatency] = useState(0);
  const [showAddConn, setShowAddConn] = useState(false);
  const [newConn, setNewConn] = useState({ url: "", protocol: "SSE", token: "", headers: "" });
  const [connectingId, setConnectingId] = useState(null);
  // Replay
  const [replayFrom, setReplayFrom] = useState("");
  const [replayTo, setReplayTo] = useState("");
  const [replaySpeed, setReplaySpeed] = useState(1);
  const [replayRunning, setReplayRunning] = useState(false);
  const [replayPaused, setReplayPaused] = useState(false);
  const [replayProgress, setReplayProgress] = useState(0);
  const [replaySources, setReplaySources] = useState({});
  // Rules editor
  const [newRule, setNewRule] = useState({ name: "", field: "type", op: "equals", value: "", action: "Show toast" });
  // Export
  const [exportFormat, setExportFormat] = useState("NDJSON");
  const [exportCount, setExportCount] = useState(100);
  const [archiveMsg, setArchiveMsg] = useState("");

  const streamRef = useRef(null);
  const pausedRef = useRef(false);
  const eventsRef = useRef([]);
  const replayIntervalRef = useRef(null);
  const toastIdRef = useRef(0);
  const secondBucket = useRef({});

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    eventsRef.current = events;
  }, [events]);

  // ── Toast helpers ──────────────────────────────────────────────────────────
  const addToast = useCallback((title, message, kind = "info") => {
    const id = ++toastIdRef.current;
    setToasts((prev) => {
      const next = [...prev.slice(-2), { id, title, message, kind }];
      return next;
    });
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  const dismissToast = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  // ── Rule evaluation ────────────────────────────────────────────────────────
  const evaluateRules = useCallback((evt, currentRules) => {
    currentRules.forEach((rule) => {
      if (!rule.enabled) return;
      const match = rule.conditions.every((cond) => {
        let fieldVal = "";
        if (cond.field === "type") fieldVal = evt.type;
        else if (cond.field === "source") fieldVal = evt.source;
        else if (cond.field === "size") fieldVal = String(evt.size);
        if (cond.op === "equals") return fieldVal === cond.value;
        if (cond.op === "contains") return fieldVal.includes(cond.value);
        if (cond.op === "gt") return Number(fieldVal) > Number(cond.value);
        if (cond.op === "lt") return Number(fieldVal) < Number(cond.value);
        if (cond.op === "regex") { try { return new RegExp(cond.value).test(fieldVal); } catch { return false; } }
        return false;
      });
      if (match) {
        setRules((prev) => prev.map((r) => r.id === rule.id ? { ...r, hits: r.hits + 1 } : r));
        if (rule.action === "Show toast") {
          addToast(`Rule "${rule.name}" triggered`, `Event: ${evt.type} from ${evt.source}`, "rule");
        }
      }
    });
  }, [addToast]);

  // ── Event generator ────────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      if (pausedRef.current) return;
      const evt = generateEvent(connections);
      if (!evt) return;

      setEvents((prev) => {
        const next = [...prev, evt];
        return next.length > 500 ? next.slice(next.length - 500) : next;
      });
      setLifetimeCount((p) => p + 1);
      setLastMinuteEvents((prev) => {
        const now = Date.now();
        const filtered = prev.filter((e) => now - e < 60000);
        return [...filtered, now];
      });
      setMaxLatency((prev) => Math.max(prev, evt.latency));
      setAvgPayloadSize((prev) => Math.round(prev * 0.95 + evt.size * 0.05));

      // Throughput bucket
      const secKey = Math.floor(Date.now() / 1000);
      secondBucket.current[evt.sourceId] = secondBucket.current[evt.sourceId] || {};
      secondBucket.current[evt.sourceId][secKey] = (secondBucket.current[evt.sourceId][secKey] || 0) + 1;

      if (evt.type === "error") {
        addToast(`Error event from ${evt.source}`, `Payload: ${JSON.stringify(evt.payload.body).slice(0, 60)}`, "error");
      }

      setRules((currentRules) => {
        evaluateRules(evt, currentRules);
        return currentRules;
      });

      if (streamRef.current && !pausedRef.current) {
        streamRef.current.scrollTop = streamRef.current.scrollHeight;
      }
    }, Math.floor(Math.random() * 600) + 200);

    return () => clearInterval(interval);
  }, [connections, addToast, evaluateRules]);

  // ── Throughput history update ──────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      setThroughputHistory((prev) => {
        const next = { ...prev };
        connections.filter((c) => c.status === "CONNECTED").forEach((c) => {
          const arr = prev[c.id] ? [...prev[c.id]] : Array(60).fill(0);
          const count = (secondBucket.current[c.id] || {})[now - 1] || 0;
          arr.push(count);
          if (arr.length > 60) arr.shift();
          next[c.id] = arr;
        });
        return next;
      });
      setErrorRate(() => {
        const recent = eventsRef.current.slice(-100);
        if (!recent.length) return 0;
        return +((recent.filter((e) => e.type === "error").length / recent.length) * 100).toFixed(1);
      });
      setLastMinuteEvents((prev) => {
        const cutoff = Date.now() - 60000;
        return prev.filter((t) => t > cutoff);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [connections]);

  // ── Replay engine ──────────────────────────────────────────────────────────
  const startReplay = useCallback(() => {
    let replayEvents = eventsRef.current.filter((e) => {
      if (Object.values(replaySources).some(Boolean) && !replaySources[e.sourceId]) return false;
      return true;
    });
    if (!replayEvents.length) return;
    let idx = 0;
    setReplayRunning(true);
    setReplayProgress(0);
    const base = 500 / replaySpeed;
    replayIntervalRef.current = setInterval(() => {
      if (idx >= replayEvents.length) {
        clearInterval(replayIntervalRef.current);
        setReplayRunning(false);
        setReplayProgress(100);
        return;
      }
      const evt = { ...replayEvents[idx], id: `replay_${Date.now()}_${idx}`, timestamp: new Date() };
      setEvents((prev) => {
        const next = [...prev, evt];
        return next.length > 500 ? next.slice(next.length - 500) : next;
      });
      idx++;
      setReplayProgress(Math.round((idx / replayEvents.length) * 100));
    }, base);
  }, [replaySources, replaySpeed]);

  const stopReplay = () => {
    clearInterval(replayIntervalRef.current);
    setReplayRunning(false);
    setReplayProgress(0);
  };

  // ── Connection toggle ──────────────────────────────────────────────────────
  const toggleConnection = (id) => {
    const conn = connections.find((c) => c.id === id);
    if (!conn) return;
    if (conn.status === "CONNECTED") {
      setConnections((prev) => prev.map((c) => c.id === id ? { ...c, status: "DISCONNECTED" } : c));
    } else {
      setConnectingId(id);
      setTimeout(() => {
        setConnections((prev) => prev.map((c) => c.id === id ? { ...c, status: "CONNECTED" } : c));
        setConnectingId(null);
        addToast("Connected", `${conn.name} is now active`, "info");
      }, 1800);
    }
  };

  // ── Add connection ─────────────────────────────────────────────────────────
  const addConnection = () => {
    if (!newConn.url) return;
    const colors = [V.teal, V.purple, V.blue, V.gold, V.green];
    const id = `c${Date.now()}`;
    setConnections((prev) => [...prev, {
      id, name: newConn.url.split("/").pop() || "Custom Stream",
      protocol: newConn.protocol, url: newConn.url,
      status: "IDLE", color: colors[Math.floor(Math.random() * colors.length)],
    }]);
    setNewConn({ url: "", protocol: "SSE", token: "", headers: "" });
    setShowAddConn(false);
  };

  // ── Filtered events ────────────────────────────────────────────────────────
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (filterSource !== "all" && e.sourceId !== filterSource) return false;
      if (filterType !== "all" && e.type !== filterType) return false;
      if (filterSearch && !JSON.stringify(e.payload).toLowerCase().includes(filterSearch.toLowerCase()) && !e.source.toLowerCase().includes(filterSearch.toLowerCase())) return false;
      return true;
    });
  }, [events, filterSource, filterType, filterSearch]);

  // ── Stats by type ──────────────────────────────────────────────────────────
  const eventsByType = useMemo(() => {
    const counts = {};
    events.forEach((e) => { counts[e.type] = (counts[e.type] || 0) + 1; });
    return Object.entries(counts).map(([type, count]) => ({ type, count, color: EVENT_TYPE_COLORS[type] || V.white }));
  }, [events]);

  // ── Export ─────────────────────────────────────────────────────────────────
  const handleExport = () => {
    const subset = filteredEvents.slice(-exportCount);
    let content;
    let filename;
    if (exportFormat === "NDJSON") {
      content = subset.map((e) => JSON.stringify(e.payload)).join("\n");
      filename = "events.ndjson";
    } else if (exportFormat === "CSV") {
      const headers = "id,timestamp,source,type,size,latency\n";
      content = headers + subset.map((e) => `${e.id},${e.timestamp.toISOString()},${e.source},${e.type},${e.size},${e.latency}`).join("\n");
      filename = "events.csv";
    } else {
      content = JSON.stringify({ log: { version: "1.2", entries: subset.map((e) => ({ startedDateTime: e.timestamp.toISOString(), time: e.latency, request: { method: "GET", url: connections.find((c) => c.id === e.sourceId)?.url || "" }, response: { status: 200, content: { text: JSON.stringify(e.payload) } } })) } }, null, 2);
      filename = "events.har";
    }
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const handleArchive = () => {
    const data = JSON.stringify(events.map((e) => e.payload));
    const ratio = ((1 - (data.length * 0.3) / data.length) * 100).toFixed(1);
    try { sessionStorage.setItem("bolt_event_archive", data); } catch {
      // ignore
    }
    setArchiveMsg(`✓ Archived ${events.length} events — simulated compression: ~${ratio}% reduction`);
    setTimeout(() => setArchiveMsg(""), 4000);
  };

  // ── Styles ─────────────────────────────────────────────────────────────────
  const sCard = {
    background: V.surface2,
    border: `1px solid ${V.border}`,
    borderRadius: 12,
    padding: 20,
  };

  const sTab = (active) => ({
    padding: "8px 18px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontFamily: "'DM Mono', monospace",
    fontSize: 13,
    fontWeight: 600,
    background: active ? V.surface3 : "transparent",
    color: active ? V.gold : V.muted,
    borderBottom: active ? `2px solid ${V.gold}` : "2px solid transparent",
    transition: "all 0.15s",
  });

  const sBtn = (color = V.teal, outline = false) => ({
    background: outline ? "transparent" : `${color}18`,
    color,
    border: `1px solid ${color}55`,
    borderRadius: 7,
    padding: "6px 14px",
    cursor: "pointer",
    fontFamily: "'DM Mono', monospace",
    fontSize: 12,
    fontWeight: 600,
    transition: "all 0.15s",
  });

  const sInput = {
    background: V.surface3,
    border: `1px solid ${V.border}`,
    borderRadius: 7,
    color: V.white,
    fontFamily: "'DM Mono', monospace",
    fontSize: 13,
    padding: "7px 12px",
    outline: "none",
  };

  const sSelect = { ...sInput, cursor: "pointer" };

  const statusDot = (status) => {
    const colors = { CONNECTED: V.green, DISCONNECTED: V.muted, ERROR: V.red, IDLE: V.gold, CONNECTING: V.teal };
    return (
      <span style={{
        display: "inline-block", width: 10, height: 10, borderRadius: "50%",
        background: colors[status] || V.muted,
        boxShadow: status === "CONNECTED" ? `0 0 6px ${V.green}` : status === "ERROR" ? `0 0 6px ${V.red}` : "none",
        flexShrink: 0,
      }} />
    );
  };

  const eventsPerMin = lastMinuteEvents.length;

  return (
    <div style={{ fontFamily: "'DM Mono', monospace", background: V.surface, minHeight: "100vh", color: V.white }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 4px; }
        @keyframes slideIn { from { opacity:0; transform: translateX(20px); } to { opacity:1; transform: translateX(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      `}</style>

      {/* ── HERO HEADER ─────────────────────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(135deg, #0a0a14 0%, #0e1424 40%, #120e1e 100%)`,
        borderBottom: `1px solid ${V.border}`,
        padding: "32px 40px 28px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${V.teal}12 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: 200, width: 250, height: 250, borderRadius: "50%", background: `radial-gradient(circle, ${V.purple}10 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${V.teal}, ${V.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
              <h1 style={{ margin: 0, fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, background: `linear-gradient(90deg, ${V.teal}, ${V.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Event Stream Hub
              </h1>
            </div>
            <p style={{ margin: 0, color: V.muted, fontSize: 14 }}>Monitor, inspect and replay real-time SSE and WebSocket events</p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { label: "Live Streams", value: "3", color: V.green, icon: "🟢" },
              { label: "Events/min", value: eventsPerMin.toLocaleString(), color: V.gold, icon: "⚡" },
              { label: "Avg Latency", value: `${Math.round((events.slice(-20).reduce((s, e) => s + e.latency, 0) / Math.max(events.slice(-20).length, 1)))}ms`, color: V.teal, icon: "⏱" },
            ].map((stat) => (
              <div key={stat.label} style={{ background: `${stat.color}12`, border: `1px solid ${stat.color}40`, borderRadius: 10, padding: "10px 18px", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: stat.color, fontFamily: "'Syne', sans-serif" }}>{stat.value}</div>
                <div style={{ fontSize: 11, color: V.muted, marginTop: 2 }}>{stat.icon} {stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 40px", maxWidth: 1600, margin: "0 auto" }}>

        {/* ── CONNECTION MANAGER ─────────────────────────────────────────────── */}
        <div style={{ ...sCard, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 15, color: V.gold, fontFamily: "'Syne', sans-serif" }}>🔌 Connection Manager</h2>
            <button style={sBtn(V.teal)} onClick={() => setShowAddConn((p) => !p)}>+ Add Connection</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 10 }}>
            {connections.map((conn) => (
              <div key={conn.id} style={{ background: V.surface3, border: `1px solid ${conn.status === "ERROR" ? V.red + "44" : V.border}`, borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {connectingId === conn.id ? (
                    <span style={{ width: 10, height: 10, border: `2px solid ${V.teal}`, borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite", flexShrink: 0 }} />
                  ) : statusDot(conn.status)}
                  <span style={{ fontWeight: 600, fontSize: 13, color: conn.color, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{conn.name}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: conn.protocol === "SSE" ? V.teal : V.purple, background: conn.protocol === "SSE" ? `${V.teal}18` : `${V.purple}18`, border: `1px solid ${conn.protocol === "SSE" ? V.teal : V.purple}40`, borderRadius: 4, padding: "2px 6px" }}>{conn.protocol}</span>
                </div>
                <div style={{ fontSize: 11, color: V.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{conn.url}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, color: conn.status === "CONNECTED" ? V.green : conn.status === "ERROR" ? V.red : V.muted, fontWeight: 600 }}>
                    {connectingId === conn.id ? "CONNECTING…" : conn.status}
                  </span>
                  <button
                    style={sBtn(conn.status === "CONNECTED" ? V.red : V.green)}
                    onClick={() => toggleConnection(conn.id)}
                    disabled={connectingId === conn.id}
                  >
                    {conn.status === "CONNECTED" ? "Disconnect" : "Connect"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {showAddConn && (
            <div style={{ marginTop: 16, background: V.surface3, border: `1px solid ${V.teal}44`, borderRadius: 10, padding: 16 }}>
              <h3 style={{ margin: "0 0 12px", fontSize: 13, color: V.teal }}>New Connection</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <input style={{ ...sInput, gridColumn: "1/-1" }} placeholder="Stream URL (wss:// or https://)" value={newConn.url} onChange={(e) => setNewConn((p) => ({ ...p, url: e.target.value }))} />
                <select style={sSelect} value={newConn.protocol} onChange={(e) => setNewConn((p) => ({ ...p, protocol: e.target.value }))}>
                  <option>SSE</option><option>WS</option>
                </select>
                <input style={sInput} placeholder="Auth Token (optional)" value={newConn.token} onChange={(e) => setNewConn((p) => ({ ...p, token: e.target.value }))} />
                <input style={{ ...sInput, gridColumn: "1/-1" }} placeholder='Headers JSON e.g. {"X-Api-Key":"..."}' value={newConn.headers} onChange={(e) => setNewConn((p) => ({ ...p, headers: e.target.value }))} />
                <div style={{ gridColumn: "1/-1", display: "flex", gap: 8 }}>
                  <button style={sBtn(V.teal)} onClick={addConnection}>Add Stream</button>
                  <button style={sBtn(V.muted, true)} onClick={() => setShowAddConn(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── TABS ──────────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: `1px solid ${V.border}`, paddingBottom: 0 }}>
          {["stream", "replay", "rules", "stats", "export"].map((t) => (
            <button key={t} style={sTab(activeTab === t)} onClick={() => setActiveTab(t)}>
              {t === "stream" ? "📡 Live Stream" : t === "replay" ? "⏮ Replay" : t === "rules" ? "🔔 Rules" : t === "stats" ? "📊 Statistics" : "📦 Export"}
            </button>
          ))}
        </div>

        {/* ── LIVE STREAM TAB ──────────────────────────────────────────────── */}
        {activeTab === "stream" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20 }}>
            <div>
              {/* Throughput chart */}
              <div style={{ ...sCard, marginBottom: 16 }}>
                <h3 style={{ margin: "0 0 12px", fontSize: 13, color: V.muted }}>Throughput — Events/sec (last 60s)</h3>
                <ThroughputChart history={throughputHistory} connections={connections} />
              </div>

              {/* Filter bar */}
              <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                <select style={{ ...sSelect, flex: 1, minWidth: 140 }} value={filterSource} onChange={(e) => setFilterSource(e.target.value)}>
                  <option value="all">All Sources</option>
                  {connections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select style={{ ...sSelect, flex: 1, minWidth: 120 }} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <option value="all">All Types</option>
                  {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <input style={{ ...sInput, flex: 2, minWidth: 180 }} placeholder="Search payload…" value={filterSearch} onChange={(e) => setFilterSearch(e.target.value)} />
                <button
                  style={sBtn(paused ? V.green : V.gold)}
                  onClick={() => {
                    setPaused((p) => !p);
                    if (paused && streamRef.current) streamRef.current.scrollTop = streamRef.current.scrollHeight;
                  }}
                >
                  {paused ? "▶ Resume" : "⏸ Pause"}
                </button>
              </div>

              {/* Event log */}
              <div
                ref={streamRef}
                style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 12, height: 420, overflowY: "auto", fontFamily: "'DM Mono', monospace", fontSize: 12 }}
                onScroll={(e) => {
                  const el = e.currentTarget;
                  const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
                  if (!atBottom) setPaused(true);
                }}
              >
                {filteredEvents.length === 0 && (
                  <div style={{ padding: 40, textAlign: "center", color: V.muted }}>No events matching filters…</div>
                )}
                {filteredEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => {
                      setSelectedEvent(evt);
                      setInspectorHistory((prev) => {
                        const next = [evt, ...prev.filter((e) => e.id !== evt.id)].slice(0, 10);
                        return next;
                      });
                    }}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "90px 170px 90px 1fr",
                      gap: 8,
                      padding: "6px 14px",
                      borderBottom: `1px solid ${V.border}`,
                      cursor: "pointer",
                      background: selectedEvent?.id === evt.id ? `${V.teal}10` : "transparent",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = `${V.teal}08`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = selectedEvent?.id === evt.id ? `${V.teal}10` : "transparent"; }}
                  >
                    <span style={{ color: V.muted, fontSize: 11 }}>{fmt(evt.timestamp)}</span>
                    <span style={{ color: evt.sourceColor, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 11 }}>{evt.source}</span>
                    <span style={{
                      color: EVENT_TYPE_COLORS[evt.type] || V.white,
                      background: `${EVENT_TYPE_COLORS[evt.type] || V.white}15`,
                      borderRadius: 4,
                      padding: "1px 6px",
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}>{evt.type}</span>
                    <span style={{ color: V.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 11 }}>
                      {JSON.stringify(evt.payload.body).slice(0, 80)}
                    </span>
                  </div>
                ))}
              </div>

              {paused && (
                <button
                  style={{ ...sBtn(V.teal), marginTop: 8, width: "100%", padding: "10px" }}
                  onClick={() => {
                    setPaused(false);
                    if (streamRef.current) streamRef.current.scrollTop = streamRef.current.scrollHeight;
                  }}
                >
                  ↓ Scroll to bottom & resume live stream
                </button>
              )}
            </div>

            {/* ── PAYLOAD INSPECTOR ─────────────────────────────────────────── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ ...sCard, flex: 1, overflow: "hidden" }}>
                <h3 style={{ margin: "0 0 12px", fontSize: 13, color: V.gold }}>🔍 Payload Inspector</h3>
                {!selectedEvent ? (
                  <div style={{ color: V.muted, fontSize: 13, textAlign: "center", paddingTop: 40 }}>Click any event to inspect</div>
                ) : (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
                      {[
                        ["ID", selectedEvent.payload.eventId],
                        ["Type", selectedEvent.type],
                        ["Source", selectedEvent.source],
                        ["Latency", `${selectedEvent.latency}ms`],
                        ["Size", `${selectedEvent.size} bytes`],
                        ["Time", fmt(selectedEvent.timestamp)],
                      ].map(([k, v]) => (
                        <div key={k} style={{ background: V.surface3, borderRadius: 6, padding: "5px 10px" }}>
                          <div style={{ color: V.muted, fontSize: 10 }}>{k}</div>
                          <div style={{ color: V.white, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: V.surface, borderRadius: 8, padding: 12, fontSize: 12, overflow: "auto", maxHeight: 220, border: `1px solid ${V.border}` }}>
                      <JsonNode data={selectedEvent.payload} />
                    </div>
                    <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                      <button style={sBtn(V.teal)} onClick={() => navigator.clipboard.writeText(JSON.stringify(selectedEvent.payload, null, 2)).then(() => addToast("Copied!", "Payload copied to clipboard", "info"))}>
                        📋 Copy
                      </button>
                      <button style={sBtn(V.purple)} onClick={() => {
                        const replayed = { ...selectedEvent, id: `replay_${Date.now()}`, timestamp: new Date() };
                        setEvents((prev) => [...prev.slice(-499), replayed]);
                        addToast("Replayed", `Event ${selectedEvent.payload.eventId} re-injected`, "info");
                      }}>
                        ⏮ Replay
                      </button>
                      <button style={sBtn(V.gold)} onClick={() => {
                        const cond = { field: "type", op: "equals", value: selectedEvent.type };
                        setRules((prev) => [...prev, { id: `r${Date.now()}`, name: `Auto: ${selectedEvent.type} from ${selectedEvent.source.slice(0, 12)}`, conditions: [cond], action: "Show toast", enabled: true, hits: 0 }]);
                        setActiveTab("rules");
                        addToast("Rule created", `Alert on ${selectedEvent.type} events`, "rule");
                      }}>
                        + Rule
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Inspector history */}
              <div style={{ ...sCard }}>
                <h3 style={{ margin: "0 0 10px", fontSize: 13, color: V.muted }}>Recent Inspections</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {inspectorHistory.length === 0 && <div style={{ color: V.muted, fontSize: 12 }}>None yet</div>}
                  {inspectorHistory.map((evt, i) => (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt)}
                      style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "4px 8px", borderRadius: 6, background: selectedEvent?.id === evt.id ? `${V.teal}15` : "transparent" }}
                    >
                      <span style={{ color: V.muted, fontSize: 10 }}>#{i + 1}</span>
                      <span style={{ color: EVENT_TYPE_COLORS[evt.type] || V.white, fontSize: 10, fontWeight: 700 }}>{evt.type}</span>
                      <span style={{ color: V.muted, fontSize: 10, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{evt.source}</span>
                      <span style={{ color: V.muted, fontSize: 10 }}>{fmt(evt.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── REPLAY TAB ───────────────────────────────────────────────────── */}
        {activeTab === "replay" && (
          <div style={{ ...sCard, maxWidth: 760 }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 16, color: V.purple, fontFamily: "'Syne', sans-serif" }}>⏮ Replay Engine</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", color: V.muted, fontSize: 11, marginBottom: 4 }}>FROM timestamp</label>
                <input type="datetime-local" style={sInput} value={replayFrom} onChange={(e) => setReplayFrom(e.target.value)} />
              </div>
              <div>
                <label style={{ display: "block", color: V.muted, fontSize: 11, marginBottom: 4 }}>TO timestamp</label>
                <input type="datetime-local" style={sInput} value={replayTo} onChange={(e) => setReplayTo(e.target.value)} />
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <label style={{ display: "block", color: V.muted, fontSize: 11, marginBottom: 8 }}>Source Filters</label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {connections.map((c) => (
                  <label key={c.id} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", color: V.white, fontSize: 13 }}>
                    <input
                      type="checkbox"
                      checked={!!replaySources[c.id]}
                      onChange={(e) => setReplaySources((p) => ({ ...p, [c.id]: e.target.checked }))}
                    />
                    <span style={{ color: c.color }}>{c.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <label style={{ display: "block", color: V.muted, fontSize: 11, marginBottom: 8 }}>Speed Multiplier</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[0.25, 0.5, 1, 2, 5, 10].map((s) => (
                  <button
                    key={s}
                    style={{ ...sBtn(replaySpeed === s ? V.purple : V.muted), background: replaySpeed === s ? `${V.purple}25` : "transparent" }}
                    onClick={() => setReplaySpeed(s)}
                  >{s}x</button>
                ))}
              </div>
            </div>

            {replayRunning && (
              <div style={{ marginTop: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: V.muted }}>
                  <span>Replay Progress</span><span>{replayProgress}%</span>
                </div>
                <div style={{ background: V.surface3, borderRadius: 99, height: 8, overflow: "hidden" }}>
                  <div style={{ width: `${replayProgress}%`, height: "100%", background: `linear-gradient(90deg, ${V.purple}, ${V.teal})`, transition: "width 0.3s", borderRadius: 99 }} />
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {!replayRunning ? (
                <button style={{ ...sBtn(V.purple), padding: "10px 24px", fontSize: 14 }} onClick={startReplay}>▶ Start Replay</button>
              ) : (
                <>
                  <button style={sBtn(V.gold)} onClick={() => setReplayPaused((p) => !p)}>{replayPaused ? "▶ Resume" : "⏸ Pause"}</button>
                  <button style={sBtn(V.red)} onClick={stopReplay}>⏹ Stop</button>
                </>
              )}
            </div>
            <p style={{ margin: "12px 0 0", color: V.muted, fontSize: 12 }}>Replaying {filteredEvents.length} events from current stream at {replaySpeed}x speed. Events will appear in the live stream view.</p>
          </div>
        )}

        {/* ── RULES TAB ────────────────────────────────────────────────────── */}
        {activeTab === "rules" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 20 }}>
            <div>
              <h2 style={{ margin: "0 0 16px", fontSize: 16, color: V.gold, fontFamily: "'Syne', sans-serif" }}>🔔 Active Rules</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {rules.map((rule) => (
                  <div key={rule.id} style={{ ...sCard, padding: "14px 16px", borderLeft: `3px solid ${rule.enabled ? V.gold : V.muted}`, opacity: rule.enabled ? 1 : 0.6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <span style={{ fontWeight: 700, color: V.white, fontSize: 14 }}>{rule.name}</span>
                      <span style={{ marginLeft: "auto", fontSize: 11, color: V.muted }}>🔥 {rule.hits} hits</span>
                      <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: rule.enabled ? V.green : V.muted, fontSize: 12 }}>
                        <input type="checkbox" checked={rule.enabled} onChange={() => setRules((prev) => prev.map((r) => r.id === rule.id ? { ...r, enabled: !r.enabled } : r))} />
                        {rule.enabled ? "ON" : "OFF"}
                      </label>
                      <button style={{ ...sBtn(V.red, true), padding: "3px 8px", fontSize: 11 }} onClick={() => setRules((prev) => prev.filter((r) => r.id !== rule.id))}>✕</button>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                      {rule.conditions.map((c, i) => (
                        <span key={i} style={{ background: `${V.teal}15`, border: `1px solid ${V.teal}40`, borderRadius: 5, padding: "2px 8px", fontSize: 11, color: V.teal }}>
                          <span style={{ color: V.white }}>{c.field}</span> {c.op} <span style={{ color: V.gold }}>"{c.value}"</span>
                        </span>
                      ))}
                    </div>
                    <div style={{ fontSize: 12, color: V.purple }}>→ {rule.action}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rule builder */}
            <div style={{ ...sCard }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 14, color: V.teal }}>+ New Rule</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <label style={{ display: "block", color: V.muted, fontSize: 11, marginBottom: 4 }}>Rule Name</label>
                  <input style={{ ...sInput, width: "100%" }} placeholder="e.g. Error Escalator" value={newRule.name} onChange={(e) => setNewRule((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div style={{ background: V.surface3, border: `1px solid ${V.border}`, borderRadius: 8, padding: 12 }}>
                  <label style={{ display: "block", color: V.muted, fontSize: 11, marginBottom: 8 }}>Condition</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    <select style={sSelect} value={newRule.field} onChange={(e) => setNewRule((p) => ({ ...p, field: e.target.value }))}>
                      <option value="type">event_type</option>
                      <option value="source">source</option>
                      <option value="size">size</option>
                    </select>
                    <select style={sSelect} value={newRule.op} onChange={(e) => setNewRule((p) => ({ ...p, op: e.target.value }))}>
                      <option value="equals">equals</option>
                      <option value="contains">contains</option>
                      <option value="gt">gt</option>
                      <option value="lt">lt</option>
                      <option value="regex">regex</option>
                    </select>
                    <input style={sInput} placeholder="value" value={newRule.value} onChange={(e) => setNewRule((p) => ({ ...p, value: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", color: V.muted, fontSize: 11, marginBottom: 4 }}>Action</label>
                  <select style={{ ...sSelect, width: "100%" }} value={newRule.action} onChange={(e) => setNewRule((p) => ({ ...p, action: e.target.value }))}>
                    <option>Show toast</option>
                    <option>Play sound</option>
                    <option>Log to file</option>
                    <option>Trigger webhook</option>
                  </select>
                </div>
                <button
                  style={{ ...sBtn(V.gold), padding: "10px", fontSize: 13 }}
                  onClick={() => {
                    if (!newRule.name || !newRule.value) return;
                    setRules((prev) => [...prev, { id: `r${Date.now()}`, name: newRule.name, conditions: [{ field: newRule.field, op: newRule.op, value: newRule.value }], action: newRule.action, enabled: true, hits: 0 }]);
                    setNewRule({ name: "", field: "type", op: "equals", value: "", action: "Show toast" });
                    addToast("Rule created", `"${newRule.name}" is now active`, "rule");
                  }}
                >
                  Create Rule
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STATS TAB ────────────────────────────────────────────────────── */}
        {activeTab === "stats" && (
          <div>
            <h2 style={{ margin: "0 0 20px", fontSize: 16, color: V.teal, fontFamily: "'Syne', sans-serif" }}>📊 Statistics Panel</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
              {[
                { label: "Total Events (lifetime)", value: lifetimeCount.toLocaleString(), color: V.gold },
                { label: "Last Minute", value: lastMinuteEvents.length.toLocaleString(), color: V.teal },
                { label: "Last Hour (est.)", value: (lastMinuteEvents.length * 60).toLocaleString(), color: V.blue },
                { label: "Error Rate", value: `${errorRate}%`, color: errorRate > 10 ? V.red : V.green },
                { label: "Avg Payload Size", value: `${avgPayloadSize} B`, color: V.purple },
                { label: "Max Latency", value: `${maxLatency}ms`, color: maxLatency > 50 ? V.amber : V.green },
              ].map((m) => (
                <div key={m.label} style={{ ...sCard, textAlign: "center" }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: m.color, fontFamily: "'Syne', sans-serif" }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: V.muted, marginTop: 4 }}>{m.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ ...sCard }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 14, color: V.muted }}>Events by Type</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  <DonutChart data={eventsByType} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                    {eventsByType.sort((a, b) => b.count - a.count).map((d) => (
                      <div key={d.type} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                        <span style={{ color: V.white, fontSize: 12, flex: 1 }}>{d.type}</span>
                        <span style={{ color: V.muted, fontSize: 12 }}>{d.count}</span>
                        <div style={{ width: 60, background: V.surface3, borderRadius: 4, height: 4 }}>
                          <div style={{ width: `${(d.count / Math.max(...eventsByType.map((x) => x.count), 1)) * 100}%`, height: "100%", background: d.color, borderRadius: 4 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ ...sCard }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 14, color: V.muted }}>Connection Stats</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {connections.map((conn) => {
                    const connEvents = events.filter((e) => e.sourceId === conn.id);
                    const connErrors = connEvents.filter((e) => e.type === "error").length;
                    return (
                      <div key={conn.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {statusDot(conn.status)}
                        <span style={{ color: conn.color, fontSize: 12, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{conn.name}</span>
                        <span style={{ color: V.muted, fontSize: 11 }}>{connEvents.length} evts</span>
                        <span style={{ color: connErrors > 0 ? V.red : V.green, fontSize: 11 }}>{connErrors} err</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── EXPORT TAB ───────────────────────────────────────────────────── */}
        {activeTab === "export" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ ...sCard }}>
              <h2 style={{ margin: "0 0 20px", fontSize: 16, color: V.blue, fontFamily: "'Syne', sans-serif" }}>📦 Export Events</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", color: V.muted, fontSize: 11, marginBottom: 6 }}>Format</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["NDJSON", "CSV", "HAR"].map((f) => (
                      <button
                        key={f}
                        style={{ ...sBtn(exportFormat === f ? V.blue : V.muted), background: exportFormat === f ? `${V.blue}25` : "transparent" }}
                        onClick={() => setExportFormat(f)}
                      >{f}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", color: V.muted, fontSize: 11, marginBottom: 6 }}>Last N Events</label>
                  <input
                    type="number"
                    min={1} max={500}
                    style={{ ...sInput, width: 120 }}
                    value={exportCount}
                    onChange={(e) => setExportCount(Number(e.target.value))}
                  />
                </div>
                <div style={{ background: V.surface3, borderRadius: 8, padding: 12, fontSize: 12, color: V.muted }}>
                  <div>Events in buffer: <span style={{ color: V.white }}>{events.length}</span></div>
                  <div>Filtered events: <span style={{ color: V.white }}>{filteredEvents.length}</span></div>
                  <div>Will export: <span style={{ color: V.gold }}>{Math.min(exportCount, filteredEvents.length)} events</span></div>
                </div>
                <button style={{ ...sBtn(V.blue), padding: "12px", fontSize: 14 }} onClick={handleExport}>
                  ⬇ Download {exportFormat}
                </button>
              </div>
            </div>

            <div style={{ ...sCard }}>
              <h2 style={{ margin: "0 0 20px", fontSize: 16, color: V.purple, fontFamily: "'Syne', sans-serif" }}>🗄 Archive</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ background: V.surface3, borderRadius: 8, padding: 14, fontSize: 13 }}>
                  <div style={{ color: V.muted, fontSize: 11, marginBottom: 4 }}>Archive target</div>
                  <div style={{ color: V.white }}>Session Storage (in-browser)</div>
                </div>
                <div style={{ background: V.surface3, borderRadius: 8, padding: 14 }}>
                  <div style={{ color: V.muted, fontSize: 11, marginBottom: 4 }}>Estimated compressed size</div>
                  <div style={{ color: V.gold, fontSize: 20, fontWeight: 700 }}>{Math.round(JSON.stringify(events.map((e) => e.payload)).length * 0.3 / 1024)} KB</div>
                  <div style={{ color: V.muted, fontSize: 11 }}>~70% simulated compression</div>
                </div>
                <button style={{ ...sBtn(V.purple), padding: "12px", fontSize: 14 }} onClick={handleArchive}>
                  📦 Archive {events.length} Events
                </button>
                {archiveMsg && <div style={{ color: V.green, fontSize: 12, background: `${V.green}12`, border: `1px solid ${V.green}40`, borderRadius: 7, padding: "8px 12px" }}>{archiveMsg}</div>}
                <div style={{ borderTop: `1px solid ${V.border}`, paddingTop: 14 }}>
                  <h4 style={{ margin: "0 0 10px", fontSize: 12, color: V.muted }}>Filtered Subset Export</h4>
                  <p style={{ color: V.muted, fontSize: 12, margin: "0 0 10px" }}>Export only events matching your current stream filters ({filteredEvents.length} events)</p>
                  <button style={sBtn(V.teal)} onClick={() => {
                    const content = filteredEvents.map((e) => JSON.stringify(e.payload)).join("\n");
                    const blob = new Blob([content], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a"); a.href = url; a.download = "filtered_events.ndjson"; a.click();
                    URL.revokeObjectURL(url);
                  }}>
                    ⬇ Download Filtered NDJSON
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── TOAST STACK ──────────────────────────────────────────────────────── */}
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

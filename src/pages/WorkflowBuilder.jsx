import { useState, useRef, useCallback, useEffect } from "react";

// ─── WORKFLOW NODE TYPES ───────────────────────────────────────────────────────
const NODE_TYPES = {
  trigger:  { label: "Trigger",       color: "#f59e0b", bg: "#f59e0b12", icon: "⚡", desc: "Start workflow" },
  ai:       { label: "AI Model",      color: "#a78bfa", bg: "#a78bfa12", icon: "🤖", desc: "Call an AI model" },
  tool:     { label: "Tool",          color: "#22d3ee", bg: "#22d3ee12", icon: "🔧", desc: "Run a tool or action" },
  branch:   { label: "Branch",        color: "#f472b6", bg: "#f47261 12", icon: "🔀", desc: "Conditional branch" },
  transform:{ label: "Transform",     color: "#34d399", bg: "#34d39912", icon: "🔄", desc: "Format / parse data" },
  output:   { label: "Output",        color: "#fb923c", bg: "#fb923c12", icon: "📤", desc: "Final output / webhook" },
};

const AI_MODELS = [
  "GPT-4o (OpenAI)", "GPT-4o Mini (OpenAI)", "o1 Preview (OpenAI)",
  "Claude 3.5 Sonnet (Anthropic)", "Claude 3.5 Haiku (Anthropic)",
  "Gemini 2.0 Flash (Google)", "Gemini 1.5 Pro (Google)",
  "Llama 3.3 70B (Meta)", "DeepSeek-V3 (DeepSeek)", "DeepSeek-R1 (DeepSeek)",
  "Mistral Large (Mistral)", "Grok-2 (xAI)", "Command R+ (Cohere)",
];

const TOOLS = [
  "Web Search", "Code Executor", "File Reader", "HTTP Request",
  "Email Sender", "Database Query", "Image Generator", "Calculator",
  "JSON Parser", "Text Splitter", "Vector Store", "Slack Notify",
];

const TRANSFORMS = [
  "JSON → Markdown", "Extract Key Fields", "Summarize Text",
  "Translate Language", "Format as Table", "Merge Inputs",
];

const TEMPLATES = [
  {
    id: "research", name: "🔍 Research Pipeline",
    desc: "Search web → AI summarize → format report",
    nodes: [
      { id: "n1", type: "trigger", x: 60, y: 220, label: "User Query", config: { event: "Manual" } },
      { id: "n2", type: "tool", x: 260, y: 220, label: "Web Search", config: { tool: "Web Search" } },
      { id: "n3", type: "ai", x: 460, y: 220, label: "Summarize", config: { model: "Claude 3.5 Sonnet (Anthropic)", prompt: "Summarize the search results into a clear research report." } },
      { id: "n4", type: "transform", x: 660, y: 220, label: "Format Report", config: { transform: "JSON → Markdown" } },
      { id: "n5", type: "output", x: 860, y: 220, label: "Final Report", config: { dest: "Console" } },
    ],
    edges: [["n1","n2"],["n2","n3"],["n3","n4"],["n4","n5"]],
  },
  {
    id: "codereview", name: "💻 Code Review Pipeline",
    desc: "Receive code → AI review → security scan → summary",
    nodes: [
      { id: "n1", type: "trigger", x: 60, y: 220, label: "Code Input", config: { event: "Code Submitted" } },
      { id: "n2", type: "ai", x: 260, y: 140, label: "Quality Review", config: { model: "GPT-4o (OpenAI)", prompt: "Review this code for quality, readability, and best practices." } },
      { id: "n3", type: "ai", x: 260, y: 300, label: "Security Scan", config: { model: "Claude 3.5 Sonnet (Anthropic)", prompt: "Scan this code for security vulnerabilities and injection risks." } },
      { id: "n4", type: "transform", x: 480, y: 220, label: "Merge Results", config: { transform: "Merge Inputs" } },
      { id: "n5", type: "output", x: 680, y: 220, label: "Review Report", config: { dest: "Console" } },
    ],
    edges: [["n1","n2"],["n1","n3"],["n2","n4"],["n3","n4"],["n4","n5"]],
  },
  {
    id: "content", name: "✍️ Content Generation Pipeline",
    desc: "Topic → outline → write → polish → publish",
    nodes: [
      { id: "n1", type: "trigger", x: 60, y: 220, label: "Topic Input", config: { event: "Manual" } },
      { id: "n2", type: "ai", x: 240, y: 220, label: "Create Outline", config: { model: "GPT-4o Mini (OpenAI)", prompt: "Create a detailed outline for an article about this topic." } },
      { id: "n3", type: "ai", x: 420, y: 220, label: "Write Draft", config: { model: "Claude 3.5 Sonnet (Anthropic)", prompt: "Write a full article based on this outline. Be detailed and engaging." } },
      { id: "n4", type: "ai", x: 600, y: 220, label: "Polish & SEO", config: { model: "GPT-4o (OpenAI)", prompt: "Polish this article for grammar, style, and SEO optimization." } },
      { id: "n5", type: "output", x: 780, y: 220, label: "Publish", config: { dest: "Webhook" } },
    ],
    edges: [["n1","n2"],["n2","n3"],["n3","n4"],["n4","n5"]],
  },
  {
    id: "support", name: "🎧 Support Automation Pipeline",
    desc: "Ticket → classify → respond or escalate",
    nodes: [
      { id: "n1", type: "trigger", x: 60, y: 220, label: "Ticket Received", config: { event: "Webhook" } },
      { id: "n2", type: "ai", x: 240, y: 220, label: "Classify Ticket", config: { model: "GPT-4o Mini (OpenAI)", prompt: "Classify this support ticket as: billing, technical, feature-request, or urgent." } },
      { id: "n3", type: "branch", x: 440, y: 220, label: "Urgent?", config: { condition: "Contains 'urgent'" } },
      { id: "n4", type: "ai", x: 640, y: 140, label: "Draft Reply", config: { model: "Claude 3.5 Haiku (Anthropic)", prompt: "Draft a helpful, empathetic support reply for this ticket." } },
      { id: "n5", type: "tool", x: 640, y: 300, label: "Escalate", config: { tool: "Slack Notify" } },
      { id: "n6", type: "output", x: 840, y: 220, label: "Send Reply", config: { dest: "Email Sender" } },
    ],
    edges: [["n1","n2"],["n2","n3"],["n3","n4"],["n3","n5"],["n4","n6"],["n5","n6"]],
  },
];

const MOCK_NODE_OUTPUTS = {
  trigger: "✓ Trigger fired. Input data received:\n{\n  \"query\": \"AI pipeline automation\",\n  \"timestamp\": \"2026-06-30T09:48:00Z\",\n  \"user\": \"admin\"\n}",
  tool: "✓ Tool executed successfully.\n\nResults:\n- Found 12 relevant web results\n- Top source: techcrunch.com, arxiv.org, github.com\n- Data fetched in 0.8s\n- Returning structured JSON with 1,240 tokens",
  ai: "✓ AI model responded.\n\n**Analysis complete:**\nThe input has been processed through the language model. Key findings extracted, summarized, and formatted according to the system prompt instructions.\n\nTokens used: 847 input + 312 output = 1,159 total\nModel: as configured\nLatency: 920ms",
  branch: "✓ Branch evaluated.\n\nCondition: 'Contains urgent' → FALSE\nRouting to: Default path\nContext passed downstream.",
  transform: "✓ Transform applied.\n\nInput format: JSON\nOutput format: Markdown\nFields processed: 8\nOutput size: 2.1KB",
  output: "✓ Output delivered!\n\nDestination: Console\nPayload size: 3.2KB\nDelivered at: " + new Date().toLocaleTimeString(),
};

let nodeIdCounter = 100;
const genId = () => `n${++nodeIdCounter}`;

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  page: { minHeight: "100vh", background: "#08080f", color: "#f0f0f5", fontFamily: "'Inter','Segoe UI',sans-serif", display: "flex", flexDirection: "column", overflow: "hidden" },
  header: { padding: "18px 28px", background: "linear-gradient(135deg,rgba(167,139,250,0.08),transparent)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 16, flexShrink: 0 },
  title: { margin: 0, fontSize: 20, fontWeight: 800, background: "linear-gradient(135deg,#a78bfa,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" },
  badge: (c) => ({ padding: "3px 10px", borderRadius: 12, background: `${c}18`, border: `1px solid ${c}44`, color: c, fontSize: 10, fontWeight: 700 }),
  toolbar: { display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "#0c0c18", borderBottom: "1px solid rgba(255,255,255,0.05)", flexWrap: "wrap", flexShrink: 0 },
  toolbarBtn: (active, color) => ({ padding: "6px 14px", borderRadius: 7, border: `1px solid ${active ? color : "rgba(255,255,255,0.1)"}`, background: active ? `${color}18` : "transparent", color: active ? color : "#6e7191", fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 0.18s", whiteSpace: "nowrap" }),
  primaryBtn: (c) => ({ padding: "7px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg,${c},${c}99)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  body: { display: "flex", flex: 1, overflow: "hidden" },
  canvas: { flex: 1, position: "relative", overflow: "auto", background: "radial-gradient(circle at 50% 50%, #0d0d1f 0%, #08080f 100%)", cursor: "default" },
  canvasInner: { position: "relative", minWidth: 1200, minHeight: 600 },
  grid: { position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, #1a1a2e 1px, transparent 1px)", backgroundSize: "28px 28px", opacity: 0.5 },
  nodeCard: (type, selected) => ({
    position: "absolute", background: NODE_TYPES[type].bg, border: `2px solid ${selected ? NODE_TYPES[type].color : NODE_TYPES[type].color + "44"}`, borderRadius: 12, padding: "12px 14px", width: 180, cursor: "pointer", userSelect: "none", boxShadow: selected ? `0 0 20px ${NODE_TYPES[type].color}33` : "0 4px 16px rgba(0,0,0,0.4)", transition: "box-shadow 0.2s",
  }),
  nodeType: (type) => ({ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9, fontWeight: 700, color: NODE_TYPES[type].color, background: `${NODE_TYPES[type].color}18`, borderRadius: 4, padding: "2px 6px", marginBottom: 4 }),
  nodeLabel: { fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 2 },
  nodeStatus: (s) => ({ fontSize: 9, fontWeight: 700, color: s === "done" ? "#10b981" : s === "running" ? "#f59e0b" : s === "error" ? "#f87171" : "#4a4a6a" }),
  sidebar: { width: 300, background: "#0a0a16", borderLeft: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" },
  sPanel: { padding: "16px", overflowY: "auto", flex: 1 },
  sPanelTitle: { fontSize: 11, fontWeight: 700, color: "#4a4a6a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 },
  log: { background: "#050508", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "10px 16px", height: 160, overflowY: "auto", flexShrink: 0, fontFamily: "'Fira Code',monospace", fontSize: 10 },
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, color: "#f0f0f5", fontSize: 11, padding: "7px 10px", width: "100%", boxSizing: "border-box", outline: "none" },
  label: { fontSize: 10, color: "#6e7191", marginBottom: 3, display: "block" },
  toast: (v) => ({ position: "fixed", bottom: 20, right: 20, background: "#1a1a2e", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "10px 18px", color: "#f0f0f5", fontSize: 12, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(10px)", transition: "all 0.2s", pointerEvents: "none" }),
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function WorkflowBuilder({ onNav }) {
  const [nodes, setNodes] = useState(TEMPLATES[0].nodes.map(n => ({ ...n, status: "idle" })));
  const [edges, setEdges] = useState(TEMPLATES[0].edges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeTemplate, setActiveTemplate] = useState("research");
  const [running, setRunning] = useState(false);
  const [execLog, setExecLog] = useState([{ type: "info", text: "Workflow ready. Press ▶ Run to execute." }]);
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [dragging, setDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  const showToast = (msg) => { setToast({ show: true, msg }); setTimeout(() => setToast({ show: false, msg: "" }), 2200); };
  const addLog = (type, text) => setExecLog(prev => [...prev, { type, text, ts: new Date().toLocaleTimeString() }]);

  const loadTemplate = (tpl) => {
    const t = TEMPLATES.find(t => t.id === tpl);
    if (!t) return;
    setNodes(t.nodes.map(n => ({ ...n, status: "idle" })));
    setEdges(t.edges);
    setSelectedNode(null);
    setActiveTemplate(tpl);
    setExecLog([{ type: "info", text: `Loaded template: ${t.name}` }]);
    showToast(`Template "${t.name}" loaded`);
  };

  const addNode = (type) => {
    const id = genId();
    const newNode = {
      id, type, label: NODE_TYPES[type].label, status: "idle",
      x: 80 + Math.random() * 400, y: 80 + Math.random() * 200,
      config: type === "ai" ? { model: AI_MODELS[0], prompt: "" } : type === "tool" ? { tool: TOOLS[0] } : type === "transform" ? { transform: TRANSFORMS[0] } : type === "trigger" ? { event: "Manual" } : {},
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedNode(id);
    addLog("info", `Added ${NODE_TYPES[type].label} node`);
  };

  const removeNode = (id) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setEdges(prev => prev.filter(([a, b]) => a !== id && b !== id));
    setSelectedNode(null);
    addLog("warn", `Removed node`);
  };

  const updateNodeConfig = (id, key, val) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, config: { ...n.config, [key]: val } } : n));
  };

  const updateNodeLabel = (id, label) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, label } : n));
  };

  // Topological sort for execution order
  const getExecutionOrder = () => {
    const inDegree = {};
    nodes.forEach(n => { inDegree[n.id] = 0; });
    edges.forEach(([, b]) => { inDegree[b] = (inDegree[b] || 0) + 1; });
    const queue = nodes.filter(n => (inDegree[n.id] || 0) === 0).map(n => n.id);
    const order = [];
    while (queue.length) {
      const cur = queue.shift();
      order.push(cur);
      edges.filter(([a]) => a === cur).forEach(([, b]) => {
        inDegree[b]--;
        if (inDegree[b] === 0) queue.push(b);
      });
    }
    return order.length === nodes.length ? order : nodes.map(n => n.id);
  };

  const runWorkflow = async () => {
    if (running) return;
    setRunning(true);
    setNodes(prev => prev.map(n => ({ ...n, status: "idle" })));
    setExecLog([{ type: "info", text: "▶ Workflow execution started..." }]);

    const order = getExecutionOrder();
    for (const nodeId of order) {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) continue;
      setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, status: "running" } : n));
      addLog("run", `⟳ Running: ${node.label} [${NODE_TYPES[node.type].label}]`);
      await new Promise(r => setTimeout(r, 600 + Math.random() * 900));
      setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, status: "done" } : n));
      addLog("ok", `✓ ${node.label} complete`);
    }

    addLog("ok", "✓ Workflow execution complete!");
    showToast("✓ Workflow complete!");
    setRunning(false);
  };

  const saveWorkflow = () => {
    const data = { nodes, edges, template: activeTemplate, savedAt: new Date().toISOString() };
    localStorage.setItem("ag_workflow", JSON.stringify(data));
    showToast("Workflow saved ✓");
    addLog("info", "Workflow saved to localStorage");
  };

  const loadWorkflow = () => {
    const raw = localStorage.getItem("ag_workflow");
    if (!raw) { showToast("No saved workflow found"); return; }
    const data = JSON.parse(raw);
    setNodes(data.nodes.map(n => ({ ...n, status: "idle" })));
    setEdges(data.edges);
    showToast("Workflow loaded ✓");
    addLog("info", `Workflow loaded (saved: ${new Date(data.savedAt).toLocaleString()})`);
  };

  const clearWorkflow = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setExecLog([{ type: "info", text: "Canvas cleared." }]);
  };

  // Drag logic
  const onMouseDown = (e, nodeId) => {
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    setDragging(nodeId);
    setSelectedNode(nodeId);
    const rect = canvasRef.current.getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left - node.x, y: e.clientY - rect.top - node.y });
  };

  const onMouseMove = useCallback((e) => {
    if (!dragging || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, e.clientX - rect.left - dragOffset.x);
    const y = Math.max(0, e.clientY - rect.top - dragOffset.y);
    setNodes(prev => prev.map(n => n.id === dragging ? { ...n, x, y } : n));
  }, [dragging, dragOffset]);

  const onMouseUp = useCallback(() => setDragging(null), []);

  const selNode = nodes.find(n => n.id === selectedNode);

  // SVG edges
  const renderEdges = () => edges.map(([aId, bId], i) => {
    const a = nodes.find(n => n.id === aId);
    const b = nodes.find(n => n.id === bId);
    if (!a || !b) return null;
    const x1 = a.x + 180, y1 = a.y + 44;
    const x2 = b.x, y2 = b.y + 44;
    const mx = (x1 + x2) / 2;
    return (
      <path key={i} d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
        fill="none" stroke="rgba(167,139,250,0.35)" strokeWidth={2} strokeDasharray="6 3"
        markerEnd="url(#arrow)" />
    );
  });

  return (
    <div style={S.page} onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
      {/* Header */}
      <div style={S.header}>
        <span style={{ fontSize: 22 }}>🔗</span>
        <div>
          <h1 style={S.title}>Workflow Builder</h1>
          <div style={{ fontSize: 11, color: "#6e7191" }}>Visual drag-and-drop agent pipeline designer</div>
        </div>
        <span style={S.badge("#a78bfa")}>{nodes.length} Nodes</span>
        <span style={S.badge("#22d3ee")}>{edges.length} Connections</span>
        {running && <span style={S.badge("#f59e0b")}>⟳ Running</span>}
      </div>

      {/* Toolbar */}
      <div style={S.toolbar}>
        <div style={{ fontSize: 10, color: "#4a4a6a", fontWeight: 700, marginRight: 4 }}>TEMPLATES:</div>
        {TEMPLATES.map(t => (
          <button key={t.id} style={S.toolbarBtn(activeTemplate === t.id, "#a78bfa")} onClick={() => loadTemplate(t.id)}>{t.name}</button>
        ))}
        <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.08)", margin: "0 4px" }} />
        <div style={{ fontSize: 10, color: "#4a4a6a", fontWeight: 700 }}>ADD NODE:</div>
        {Object.entries(NODE_TYPES).map(([type, def]) => (
          <button key={type} style={S.toolbarBtn(false, def.color)} onClick={() => addNode(type)}>{def.icon} {def.label}</button>
        ))}
        <div style={{ flex: 1 }} />
        <button style={S.toolbarBtn(false, "#6e7191")} onClick={clearWorkflow}>🗑 Clear</button>
        <button style={S.toolbarBtn(false, "#22d3ee")} onClick={loadWorkflow}>📂 Load</button>
        <button style={S.toolbarBtn(false, "#22d3ee")} onClick={saveWorkflow}>💾 Save</button>
        <button style={{ ...S.primaryBtn(running ? "#4a4a6a" : "#10b981"), fontSize: 12 }} onClick={runWorkflow} disabled={running}>
          {running ? "⟳ Running…" : "▶ Run Workflow"}
        </button>
      </div>

      {/* Body */}
      <div style={S.body}>
        {/* Canvas */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
            <div ref={canvasRef} style={S.canvasInner} onClick={() => setSelectedNode(null)}>
              <div style={S.grid} />

              {/* SVG overlay for edges */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}>
                <defs>
                  <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill="rgba(167,139,250,0.6)" />
                  </marker>
                </defs>
                {renderEdges()}
              </svg>

              {/* Nodes */}
              {nodes.map(node => (
                <div
                  key={node.id}
                  style={{ ...S.nodeCard(node.type, selectedNode === node.id), left: node.x, top: node.y, zIndex: dragging === node.id ? 10 : 2 }}
                  onMouseDown={(e) => onMouseDown(e, node.id)}
                  onClick={(e) => { e.stopPropagation(); setSelectedNode(node.id); }}
                >
                  <div style={S.nodeType(node.type)}>{NODE_TYPES[node.type].icon} {NODE_TYPES[node.type].label}</div>
                  <div style={S.nodeLabel}>{node.label}</div>
                  <div style={S.nodeStatus(node.status)}>
                    {node.status === "running" ? "⟳ Running…" : node.status === "done" ? "✓ Done" : node.status === "error" ? "✗ Error" : "○ Idle"}
                  </div>
                  {node.config?.model && <div style={{ fontSize: 9, color: "#4a4a6a", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{node.config.model.split(" (")[0]}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Execution Log */}
          <div style={S.log}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#4a4a6a", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Execution Log</div>
            {execLog.map((line, i) => (
              <div key={i} style={{ marginBottom: 3, color: line.type === "ok" ? "#10b981" : line.type === "run" ? "#f59e0b" : line.type === "warn" ? "#f87171" : "#6e7191" }}>
                {line.ts && <span style={{ color: "#3d3d5c", marginRight: 6 }}>[{line.ts}]</span>}
                {line.text}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar — Node Config */}
        <div style={S.sidebar}>
          <div style={S.sPanel}>
            {selNode ? (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div>
                    <div style={S.sPanelTitle}>Configure Node</div>
                    <div style={{ ...S.nodeType(selNode.type), display: "inline-flex" }}>{NODE_TYPES[selNode.type].icon} {NODE_TYPES[selNode.type].label}</div>
                  </div>
                  <button onClick={() => removeNode(selNode.id)} style={{ background: "#f87171", border: "none", borderRadius: 6, color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 8px", cursor: "pointer" }}>✕ Remove</button>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <label style={S.label}>Node Label</label>
                  <input value={selNode.label} onChange={e => updateNodeLabel(selNode.id, e.target.value)} style={S.input} />
                </div>

                {selNode.type === "ai" && (
                  <>
                    <div style={{ marginBottom: 10 }}>
                      <label style={S.label}>AI Model</label>
                      <select value={selNode.config.model || ""} onChange={e => updateNodeConfig(selNode.id, "model", e.target.value)} style={{ ...S.input, cursor: "pointer" }}>
                        {AI_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <label style={S.label}>System Prompt</label>
                      <textarea value={selNode.config.prompt || ""} onChange={e => updateNodeConfig(selNode.id, "prompt", e.target.value)}
                        rows={5} style={{ ...S.input, resize: "vertical" }} placeholder="Instructions for this AI node…" />
                    </div>
                  </>
                )}
                {selNode.type === "tool" && (
                  <div style={{ marginBottom: 10 }}>
                    <label style={S.label}>Tool</label>
                    <select value={selNode.config.tool || ""} onChange={e => updateNodeConfig(selNode.id, "tool", e.target.value)} style={{ ...S.input, cursor: "pointer" }}>
                      {TOOLS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                )}
                {selNode.type === "transform" && (
                  <div style={{ marginBottom: 10 }}>
                    <label style={S.label}>Transform</label>
                    <select value={selNode.config.transform || ""} onChange={e => updateNodeConfig(selNode.id, "transform", e.target.value)} style={{ ...S.input, cursor: "pointer" }}>
                      {TRANSFORMS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                )}
                {selNode.type === "trigger" && (
                  <div style={{ marginBottom: 10 }}>
                    <label style={S.label}>Trigger Event</label>
                    <select value={selNode.config.event || "Manual"} onChange={e => updateNodeConfig(selNode.id, "event", e.target.value)} style={{ ...S.input, cursor: "pointer" }}>
                      {["Manual", "Webhook", "Schedule", "File Upload", "Code Submitted", "Form Submit"].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                )}
                {selNode.type === "output" && (
                  <div style={{ marginBottom: 10 }}>
                    <label style={S.label}>Output Destination</label>
                    <select value={selNode.config.dest || "Console"} onChange={e => updateNodeConfig(selNode.id, "dest", e.target.value)} style={{ ...S.input, cursor: "pointer" }}>
                      {["Console", "Webhook", "Email Sender", "Database", "File", "Slack"].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                )}
                {selNode.type === "branch" && (
                  <div style={{ marginBottom: 10 }}>
                    <label style={S.label}>Condition</label>
                    <input value={selNode.config.condition || ""} onChange={e => updateNodeConfig(selNode.id, "condition", e.target.value)} style={S.input} placeholder="e.g. Contains 'urgent'" />
                  </div>
                )}

                {/* Mock output preview */}
                <div style={{ marginTop: 16 }}>
                  <div style={S.sPanelTitle}>Expected Output</div>
                  <pre style={{ background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: 10, fontSize: 9, color: "#6e7191", whiteSpace: "pre-wrap", lineHeight: 1.5, maxHeight: 160, overflowY: "auto" }}>
                    {MOCK_NODE_OUTPUTS[selNode.type]}
                  </pre>
                </div>
              </>
            ) : (
              <>
                <div style={S.sPanelTitle}>Workflow Info</div>
                <div style={{ fontSize: 11, color: "#6e7191", lineHeight: 1.6, marginBottom: 16 }}>
                  Click a node to configure it. Drag nodes to reposition. Use the toolbar to add new nodes or load a template.
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#f0f0f5", marginBottom: 8 }}>Node Legend</div>
                {Object.entries(NODE_TYPES).map(([type, def]) => (
                  <div key={type} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: def.bg, border: `1px solid ${def.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{def.icon}</div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: def.color }}>{def.label}</div>
                      <div style={{ fontSize: 9, color: "#4a4a6a" }}>{def.desc}</div>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 16, fontSize: 11, fontWeight: 700, color: "#f0f0f5", marginBottom: 8 }}>Quick Add</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {Object.entries(NODE_TYPES).map(([type, def]) => (
                    <button key={type} onClick={() => addNode(type)} style={{ fontSize: 10, fontWeight: 600, border: `1px solid ${def.color}44`, borderRadius: 6, color: def.color, background: def.bg, padding: "5px 10px", cursor: "pointer" }}>{def.icon} {def.label}</button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}

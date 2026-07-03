import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA & CONSTANTS ─────────────────────────────────────────────────────────

const PIPELINE_TEMPLATES = [
  {
    id: "research", name: "🔍 Deep Research Pipeline",
    desc: "Collect web data → AI summarize → format article",
    nodes: [
      { id: "n1", type: "input", x: 40, y: 150, label: "Search Query", status: "idle", output: "" },
      { id: "n2", type: "ai", x: 260, y: 150, label: "Llama 3.3 70B", status: "idle", model: "Llama 3.3 70B", prompt: "Expand user query into structured key search terms.", output: "" },
      { id: "n3", type: "tool", x: 480, y: 150, label: "Web Search Tool", status: "idle", tool: "Web Search", output: "" },
      { id: "n4", type: "ai", x: 700, y: 150, label: "Claude 3.5 Sonnet", status: "idle", model: "Claude 3.5 Sonnet", prompt: "Summarize findings into markdown report.", output: "" },
      { id: "n5", type: "output", x: 920, y: 150, label: "Save Report", status: "idle", dest: "File Export", output: "" },
    ],
  },
  {
    id: "coder", name: "💻 Automated QA & Review",
    desc: "Ingest repository files → security scan → compile & verify",
    nodes: [
      { id: "n1", type: "input", x: 40, y: 150, label: "Code Repository", status: "idle", output: "" },
      { id: "n2", type: "ai", x: 260, y: 80, label: "GPT-4o Reviewer", status: "idle", model: "GPT-4o", prompt: "Audit logic architecture and readability.", output: "" },
      { id: "n3", type: "ai", x: 260, y: 240, label: "DeepSeek-R1 Scan", status: "idle", model: "DeepSeek-R1", prompt: "Analyze potential vulnerability and memory leak vector.", output: "" },
      { id: "n4", type: "tool", x: 500, y: 150, label: "Code Executor", status: "idle", tool: "Code Executor", output: "" },
      { id: "n5", type: "output", x: 740, y: 150, label: "Git PR Comment", status: "idle", dest: "Slack / Webhook", output: "" },
    ],
  },
];

const AI_MODELS = ["GPT-4o", "GPT-4o Mini", "Claude 3.5 Sonnet", "Claude 3.5 Haiku", "Gemini 2.0 Flash", "Llama 3.3 70B", "DeepSeek-V3", "DeepSeek-R1", "Mistral Large"];
const TOOLS = ["Web Search", "Code Executor", "File Reader", "Database Query", "Slack Webhook"];
const OUTPUTS = ["File Export", "Console Print", "Slack / Webhook", "Memory Ingestion"];

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column" },
  header: { padding: "18px 30px", background: "linear-gradient(135deg, rgba(167,139,250,0.1), transparent)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContents: "space-between" },
  title: { margin: 0, fontSize: 20, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  badge: (c) => ({ padding: "3px 10px", borderRadius: 12, background: `${c}12`, border: `1px solid ${c}33`, color: c, fontSize: 10, fontWeight: 700 }),
  
  canvas: { flex: 1, position: "relative", minHeight: 460, background: "radial-gradient(circle, #1a1a2e 1px, transparent 1px)", backgroundSize: "24px 24px" },
  nodeCard: (type, active) => {
    const colors = { input: "#3b82f6", ai: "#a78bfa", tool: "#10b981", output: "#f57c00" };
    const color = colors[type] || "#a78bfa";
    return {
      position: "absolute", width: 190, background: `${color}0b`, border: `1px solid ${active ? color : color + "33"}`, borderRadius: 12, padding: 14,
      boxShadow: active ? `0 0 15px ${color}33` : "0 4px 12px rgba(0,0,0,0.3)", cursor: "pointer", transition: "all 0.2s"
    };
  },
  nodeHeader: (type) => {
    const colors = { input: "#3b82f6", ai: "#a78bfa", tool: "#10b981", output: "#f57c00" };
    return { fontSize: 9, fontWeight: 700, textTransform: "uppercase", color: colors[type], marginBottom: 4 };
  },
  
  sidebar: { width: 320, background: "#0e0e22", borderLeft: "1px solid rgba(255,255,255,0.06)", padding: 20, display: "flex", flexDirection: "column", gap: 16 },
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box" },
  label: { fontSize: 10, color: "#6e7191", marginBottom: 4, display: "block" },
  primaryBtn: (c) => ({ padding: "8px 16px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  execLog: { background: "#05050c", borderTop: "1px solid rgba(255,255,255,0.06)", padding: 16, height: 150, overflowY: "auto", fontFamily: "monospace", fontSize: 11, color: "#a0aec0" },
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function AgentPipeline({ onNav }) {
  const [nodes, setNodes] = useState(PIPELINE_TEMPLATES[0].nodes);
  const [selectedNode, setSelectedNode] = useState(nodes[0]);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState(["Pipeline initialized. Ready to execute."]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const runPipeline = async () => {
    if (running) return;
    setRunning(true);
    setLogs(["Starting execution flow..."]);
    
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      setNodes(prev => prev.map(n => n.id === node.id ? { ...n, status: "running" } : n));
      setLogs(prev => [...prev, `[Running] Node: ${node.label}...`]);
      await new Promise(r => setTimeout(r, 1200));

      const output = `Result payload from ${node.label} execution sequence. Successful termination with status code 0.`;
      setNodes(prev => prev.map(n => n.id === node.id ? { ...n, status: "done", output } : n));
      setLogs(prev => [...prev, `[Success] Node: ${node.label} finished.`]);
    }
    
    setRunning(false);
    showToast("Pipeline completed successfully!");
  };

  const updateNode = (id, fields) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, ...fields } : n));
    if (selectedNode?.id === id) {
      setSelectedNode(prev => ({ ...prev, ...fields }));
    }
  };

  const addNode = (type) => {
    const lastNode = nodes[nodes.length - 1];
    const newNode = {
      id: `node_${Date.now()}`,
      type,
      x: lastNode ? lastNode.x + 220 : 50,
      y: 150,
      label: `New ${type.toUpperCase()} Node`,
      status: "idle",
      output: "",
      ...(type === "ai" ? { model: "GPT-4o", prompt: "" } : {}),
      ...(type === "tool" ? { tool: "Web Search" } : {}),
      ...(type === "output" ? { dest: "File Export" } : {}),
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedNode(newNode);
    showToast("Node added!");
  };

  const deleteNode = (id) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setSelectedNode(null);
    showToast("Node deleted.");
  };

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h1 style={S.title}>⛓️ Agent Pipeline</h1>
          <span style={S.badge("#a78bfa")}>{nodes.length} Nodes</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={S.primaryBtn("#3b82f6")} onClick={() => setNodes(PIPELINE_TEMPLATES[0].nodes)}>Template 1</button>
          <button style={S.primaryBtn("#3b82f6")} onClick={() => setNodes(PIPELINE_TEMPLATES[1].nodes)}>Template 2</button>
          <button style={S.primaryBtn("#10b981")} onClick={runPipeline} disabled={running}>
            {running ? "Executing..." : "▶ Run Pipeline"}
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        
        {/* Canvas */}
        <div style={S.canvas}>
          {nodes.map((node, index) => {
            const active = selectedNode?.id === node.id;
            return (
              <div
                key={node.id}
                style={{ ...S.nodeCard(node.type, active), left: node.x, top: node.y }}
                onClick={() => setSelectedNode(node)}
              >
                <div style={S.nodeHeader(node.type)}>{node.type}</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{node.label}</div>
                <div style={{ fontSize: 10, color: node.status === "done" ? "#10b981" : node.status === "running" ? "#f59e0b" : "#6e7191" }}>
                  {node.status === "done" ? "✓ Complete" : node.status === "running" ? "● Running..." : "Idle"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Configuration Sidebar */}
        <div style={S.sidebar}>
          {selectedNode ? (
            <div>
              <div style={{ display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>Configure Node</span>
                <button onClick={() => deleteNode(selectedNode.id)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 11 }}>delete</button>
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={S.label}>Node Label</label>
                <input
                  value={selectedNode.label}
                  onChange={e => updateNode(selectedNode.id, { label: e.target.value })}
                  style={S.input}
                />
              </div>

              {selectedNode.type === "ai" && (
                <>
                  <div style={{ marginBottom: 10 }}>
                    <label style={S.label}>AI Model</label>
                    <select
                      value={selectedNode.model || ""}
                      onChange={e => updateNode(selectedNode.id, { model: e.target.value })}
                      style={S.input}
                    >
                      {AI_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label style={S.label}>Prompt Context</label>
                    <textarea
                      value={selectedNode.prompt || ""}
                      onChange={e => updateNode(selectedNode.id, { prompt: e.target.value })}
                      style={{ ...S.input, height: 80, resize: "none" }}
                    />
                  </div>
                </>
              )}

              {selectedNode.type === "tool" && (
                <div style={{ marginBottom: 10 }}>
                  <label style={S.label}>Choose Tool</label>
                  <select
                    value={selectedNode.tool || ""}
                    onChange={e => updateNode(selectedNode.id, { tool: e.target.value })}
                    style={S.input}
                  >
                    {TOOLS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              )}

              {selectedNode.type === "output" && (
                <div style={{ marginBottom: 10 }}>
                  <label style={S.label}>Destination</label>
                  <select
                    value={selectedNode.dest || ""}
                    onChange={e => updateNode(selectedNode.id, { dest: e.target.value })}
                    style={S.input}
                  >
                    {OUTPUTS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              )}

              {selectedNode.output && (
                <div style={{ marginTop: 14 }}>
                  <label style={S.label}>Output Preview</label>
                  <pre style={{ margin: 0, background: "rgba(0,0,0,0.3)", borderRadius: 6, padding: 8, fontSize: 10, color: "#a78bfa", whiteSpace: "pre-wrap" }}>
                    {selectedNode.output}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div style={{ color: "#6e7191", fontSize: 12 }}>Select a node on the canvas to configure parameters.</div>
          )}

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6e7191", marginBottom: 10 }}>Add Node Elements</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["input", "ai", "tool", "output"].map(t => (
                <button key={t} onClick={() => addNode(t)} style={{ ...S.primaryBtn("#22d3ee"), padding: "6px 12px", fontSize: 10 }}>
                  + {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Execution Logs */}
      <div style={S.execLog}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#6e7191", marginBottom: 6 }}>Execution Logs</div>
        {logs.map((log, idx) => <div key={idx}>{log}</div>)}
      </div>

      {/* TOAST */}
      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}

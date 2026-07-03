import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "340px 1fr", gap: 24 },
  formPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  previewPanel: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 20 },
  
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box", outline: "none" },
  label: { fontSize: 10, color: "#6e7191", marginBottom: 4, display: "block" },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  codeFrame: { background: "#05050c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, fontFamily: "monospace", fontSize: 11, color: "#a0aec0", maxHeight: 300, overflowY: "auto" },
  endpointCard: (active) => ({
    background: active ? "rgba(34,211,238,0.05)" : "rgba(255,255,255,0.01)",
    border: `1px solid ${active ? "#22d3ee" : "rgba(255,255,255,0.06)"}`,
    borderRadius: 10, padding: 12, display: "flex", justifyContents: "space-between", alignItems: "center", cursor: "pointer", transition: "all 0.25s",
  }),
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

const INITIAL_ENDPOINTS = [
  { id: "e1", method: "GET", path: "/api/v1/users", status: 200, response: '{\n  "status": "success",\n  "users": [\n    { "id": 1, "name": "John Doe" }\n  ]\n}' },
  { id: "e2", method: "POST", path: "/api/v1/auth/login", status: 200, response: '{\n  "token": "mock_jwt_token_payload_xyz"\n}' },
];

export default function ApiDesigner({ onNav }) {
  const [endpoints, setEndpoints] = useState(INITIAL_ENDPOINTS);
  const [activeEndpoint, setActiveEndpoint] = useState(INITIAL_ENDPOINTS[0]);
  
  const [newMethod, setNewMethod] = useState("GET");
  const [newPath, setNewPath] = useState("");
  const [newStatus, setNewStatus] = useState(200);
  const [newResponse, setNewResponse] = useState('{\n  "success": true\n}');
  
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const createEndpoint = () => {
    if (!newPath) {
      showToast("Path is required!");
      return;
    }
    const created = {
      id: `e_${Date.now()}`,
      method: newMethod,
      path: newPath,
      status: parseInt(newStatus),
      response: newResponse,
    };
    setEndpoints(prev => [...prev, created]);
    setActiveEndpoint(created);
    setNewPath("");
    setNewResponse('{\n  "success": true\n}');
    showToast("Mock endpoint registered!");
  };

  const deleteEndpoint = (id, e) => {
    e.stopPropagation();
    setEndpoints(prev => prev.filter(e => e.id !== id));
    if (activeEndpoint?.id === id) {
      setActiveEndpoint(null);
    }
    showToast("Endpoint deleted.");
  };

  const simulateCall = () => {
    if (!activeEndpoint) return;
    showToast(`✓ Call simulated: ${activeEndpoint.method} ${activeEndpoint.path} returned ${activeEndpoint.status}`);
  };

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🔌 API Mock Designer</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Design mock REST API endpoints, configure JSON responses, and simulate client integration payloads.</div>
        </div>
      </div>

      {/* Grid */}
      <div style={S.grid}>
        
        {/* Form Panel */}
        <div style={S.formPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 14 }}>Endpoint Setup</div>

          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 10, marginBottom: 10 }}>
            <div>
              <label style={S.label}>Method</label>
              <select value={newMethod} onChange={e => setNewMethod(e.target.value)} style={S.input}>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <div>
              <label style={S.label}>Route Path</label>
              <input value={newPath} onChange={e => setNewPath(e.target.value)} placeholder="/api/v1/data" style={S.input} />
            </div>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={S.label}>HTTP Response Status</label>
            <input type="number" value={newStatus} onChange={e => setNewStatus(e.target.value)} style={S.input} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>JSON Response Body</label>
            <textarea
              value={newResponse}
              onChange={e => setNewResponse(e.target.value)}
              style={{ ...S.input, height: 120, fontFamily: "monospace", fontSize: 11, resize: "none" }}
            />
          </div>

          <button style={S.primaryBtn("#a78bfa")} onClick={createEndpoint}>
            Register Mock Endpoint
          </button>
        </div>

        {/* Preview Panel */}
        <div style={S.previewPanel}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#6e7191", marginBottom: 12 }}>Mock Endpoints List</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {endpoints.map(e => {
                const active = activeEndpoint?.id === e.id;
                const mColors = { GET: "#10b981", POST: "#22d3ee", PUT: "#f59e0b", DELETE: "#ef4444" };
                return (
                  <div
                    key={e.id}
                    onClick={() => setActiveEndpoint(e)}
                    style={S.endpointCard(active)}
                  >
                    <div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: mColors[e.method] || "#22d3ee", marginRight: 8 }}>{e.method}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#f0f0f5" }}>{e.path}</span>
                    </div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ fontSize: 10, color: e.status === 200 ? "#10b981" : "#f59e0b" }}>HTTP {e.status}</span>
                      <button onClick={(event) => deleteEndpoint(e.id, event)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 11 }}>✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {activeEndpoint && (
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
              <div style={{ display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#6e7191" }}>Mock HTTP Response Payload</span>
                <button
                  onClick={simulateCall}
                  style={S.primaryBtn("#22d3ee")}
                >
                  ⚡ Simulate Call
                </button>
              </div>
              <pre style={S.codeFrame}>
                {activeEndpoint.response}
              </pre>
            </div>
          )}
        </div>

      </div>

      {/* TOAST */}
      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}

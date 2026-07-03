import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 },
  formPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  mockPanel: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 20 },
  
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box", outline: "none" },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  mockCard: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 12, display: "flex", justifyContents: "space-between", alignItems: "center" },
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function LiveApiSimulator({ onNav }) {
  const [path, setPath] = useState("/users");
  const [method, setMethod] = useState("GET");
  const [responseJson, setResponseJson] = useState('{"status": "ok"}');
  const [loading, setLoading] = useState(false);
  const [mocks, setMocks] = useState([
    { id: 1, method: "GET", path: "/status", response: '{"healthy": true}' },
    { id: 2, method: "POST", path: "/login", response: '{"token": "xyz123"}' },
  ]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const addMock = () => {
    if (!path) {
      showToast("Mock Path is required!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const created = {
        id: Date.now(),
        method,
        path,
        response: responseJson,
      };
      setMocks(prev => [...prev, created]);
      setPath("");
      setLoading(false);
      showToast("✓ Custom API mock route registered!");
    }, 1200);
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🔌 Live API Mock Simulator</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Configure custom JSON mock endpoints, define methods (GET/POST), and test outputs in browser.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Controls */}
        <div style={S.formPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 14 }}>Create Mock Endpoint</div>
          
          <div style={{ marginBottom: 10 }}>
            <input
              value={path}
              onChange={e => setPath(e.target.value)}
              placeholder="e.g. /users"
              style={S.input}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <select
              value={method}
              onChange={e => setMethod(e.target.value)}
              style={{ ...S.input, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f0f0f5" }}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <textarea
              value={responseJson}
              onChange={e => setResponseJson(e.target.value)}
              placeholder='{"status": "ok"}'
              style={{ ...S.input, height: 100, fontFamily: "monospace", resize: "none" }}
            />
          </div>

          <button style={S.primaryBtn("#a78bfa")} onClick={addMock} disabled={loading}>
            {loading ? "Registering..." : "⚡ Register Route"}
          </button>
        </div>

        {/* List */}
        <div style={S.mockPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5" }}>Active Mock Endpoints ({mocks.length})</div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {mocks.map(m => (
              <div key={m.id} style={S.mockCard}>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#22d3ee", marginRight: 8 }}>[{m.method}]</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5" }}>{m.path}</span>
                  <div style={{ fontSize: 10, color: "#6e7191", fontFamily: "monospace", marginTop: 4 }}>{m.response}</div>
                </div>
                <button
                  onClick={() => showToast(`✓ Sent request to ${m.path} -> Response: ${m.response}`)}
                  style={{ ...S.primaryBtn("#10b981"), padding: "4px 10px", fontSize: 10 }}
                >
                  Test Route
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}

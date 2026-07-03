import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 },
  formPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  orchestraPanel: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 20 },
  
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box", outline: "none" },
  label: { fontSize: 10, color: "#6e7191", marginBottom: 4, display: "block" },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  deviceCard: (alert) => ({
    background: alert ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.02)",
    border: `1px solid ${alert ? "#ef4444" : "rgba(255,255,255,0.06)"}`,
    borderRadius: 10, padding: 12, display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 10
  }),
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function AiDeviceOrchestrator({ onNav }) {
  const [domain, setDomain] = useState("lab1.domain.com");
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [devices, setDevices] = useState([]);
  const [aiDiagnostic, setAiDiagnostic] = useState("");
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const runOrchestrator = () => {
    if (!domain) {
      showToast("Domain Target is required!");
      return;
    }
    setLoading(true);
    setScanned(false);
    
    setTimeout(() => {
      setDevices([
        { id: "node-1", ip: "192.168.1.102", name: "PC-01 (Teacher Node)", CPU: "14%", RAM: "24%", alert: false },
        { id: "node-2", ip: "192.168.1.115", name: "PC-02 (Student Lab)", CPU: "96%", RAM: "92%", alert: true },
      ]);
      setAiDiagnostic(
        "🧠 AI System Review:\n- Node PC-02 displays severe memory throttling (92%). Recommend clean RAM cache flush.\n- Open Port 22 SSH listeners active on both nodes. Highly recommend running Firewall Port Shield audit."
      );
      setScanned(true);
      setLoading(false);
      showToast(`✓ AI scans completed for domain target: ${domain}`);
    }, 1500);
  };

  const triggerRepair = () => {
    setDevices(prev => prev.map(d => d.id === "node-2" ? { ...d, CPU: "8%", RAM: "28%", alert: false } : d));
    setAiDiagnostic("🧠 AI System Review:\n✓ PC-02 RAM cache flushed. All domain connected nodes are currently optimal.");
    showToast("✓ Triggered AI self-repair sequences!");
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🤖 AI Centralized Device Orchestrator</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Scan any domain network target, monitor remote nodes loads, and execute self-healing repair tasks automatically.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Input */}
        <div style={S.formPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 14 }}>Orchestration Target</div>
          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>Lab Domain / Subnet IP</label>
            <input
              value={domain}
              onChange={e => setDomain(e.target.value)}
              placeholder="e.g. lab1.school.edu"
              style={S.input}
            />
          </div>
          <button style={S.primaryBtn("#a78bfa")} onClick={runOrchestrator} disabled={loading}>
            {loading ? "Scanning Domain..." : "⚡ Run AI Scan"}
          </button>
        </div>

        {/* Output */}
        <div style={S.orchestraPanel}>
          
          {scanned ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5", marginBottom: 12 }}>Connected Devices Under {domain}</div>
                {devices.map(d => (
                  <div key={d.id} style={S.deviceCard(d.alert)}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5", marginBottom: 2 }}>{d.name}</div>
                      <div style={{ fontSize: 10, color: "#a0aec0" }}>IP: {d.ip} | CPU: {d.CPU} | RAM: {d.RAM}</div>
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: d.alert ? "#ef4444" : "#10b981" }}>
                      ● {d.alert ? "CRITICAL ALERT" : "HEALTHY"}
                    </span>
                  </div>
                ))}
              </div>

              {/* AI Report */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
                <div style={{ display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa" }}>AI Health Review</span>
                  <button style={{ ...S.primaryBtn("#10b981"), padding: "4px 10px", fontSize: 10 }} onClick={triggerRepair}>
                    Trigger Self-Repair
                  </button>
                </div>
                <pre style={{ margin: 0, background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: 12, fontSize: 11, color: "#a0aec0", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
                  {aiDiagnostic}
                </pre>
              </div>

            </div>
          ) : (
            <div style={{ color: "#6e7191", fontSize: 12, fontStyle: "italic" }}>
              Input domain address coordinates on the left to scan network node endpoints...
            </div>
          )}

        </div>

      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}

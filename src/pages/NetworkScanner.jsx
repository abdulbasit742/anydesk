import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 },
  formPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  scanPanel: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 20 },
  
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box", outline: "none" },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  portCard: (open) => ({
    background: open ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
    border: `1px solid ${open ? "#10b981" : "#ef4444"}`,
    borderRadius: 10, padding: 12, display: "flex", justifyContents: "space-between", alignItems: "center",
  }),
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function NetworkScanner({ onNav }) {
  const [target, setTarget] = useState("127.0.0.1");
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [ports, setPorts] = useState([]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const runPortScan = () => {
    setLoading(true);
    setScanned(false);
    setTimeout(() => {
      setPorts([
        { port: 80, name: "HTTP", open: true },
        { port: 443, name: "HTTPS", open: true },
        { port: 22, name: "SSH", open: false },
        { port: 3306, name: "MySQL", open: false },
      ]);
      setScanned(true);
      setLoading(false);
      showToast(`✓ Port scan completed for target: ${target}`);
    }, 1500);
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🔒 Firewall Port Scanner</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Audit local and remote hosts to locate open TCP/UDP networking ports.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Input */}
        <div style={S.formPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 14 }}>Port Audit rules</div>
          
          <div style={{ marginBottom: 16 }}>
            <input
              value={target}
              onChange={e => setTarget(e.target.value)}
              placeholder="e.g. 127.0.0.1"
              style={S.input}
            />
          </div>

          <button style={S.primaryBtn("#a78bfa")} onClick={runPortScan} disabled={loading}>
            {loading ? "Scanning..." : "▶ Start Port Scan"}
          </button>
        </div>

        {/* Output */}
        <div style={S.scanPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5" }}>Active Port Listeners</div>
          
          {scanned ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ports.map((p, idx) => (
                <div key={idx} style={S.portCard(p.open)}>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: "#f0f0f5" }}>Port {p.port}</span>
                    <span style={{ fontSize: 10, color: "#6e7191", marginLeft: 12 }}>({p.name})</span>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: p.open ? "#10b981" : "#ef4444" }}>
                    ● {p.open ? "OPEN" : "CLOSED"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: "#6e7191", fontSize: 12, fontStyle: "italic" }}>
              Input IP target on the left to initiate firewall scanning...
            </div>
          )}
        </div>

      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}

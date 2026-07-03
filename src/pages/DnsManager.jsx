import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 },
  card: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box", outline: "none" },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  recordCard: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", padding: 12, borderRadius: 10, display: "flex", justifyContents: "space-between", alignItems: "center" },
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function DnsManager({ onNav }) {
  const [domain, setDomain] = useState("app.antigravity.dev");
  const [recordType, setRecordType] = useState("A");
  const [target, setTarget] = useState("162.243.141.12");
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([
    { id: 1, type: "A", domain: "app.antigravity.dev", target: "162.243.141.12" },
    { id: 2, type: "CNAME", domain: "expose.antigravity.dev", target: "tunnels.railway.app" },
  ]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const addRecord = () => {
    if (!domain || !target) {
      showToast("Domain and Target are required!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const created = {
        id: Date.now(),
        type: recordType,
        domain,
        target,
      };
      setRecords(prev => [...prev, created]);
      setDomain("");
      setTarget("");
      setLoading(false);
      showToast("✓ Custom DNS record created!");
    }, 1200);
  };

  const removeRecord = (id) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    showToast("DNS record removed.");
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🌐 Ingress DNS Manager</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Configure DNS records mappings, verify NS propagation latencies, and check MX servers configurations.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Controls */}
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Create DNS Record</div>
          
          <div style={{ marginBottom: 10 }}>
            <input
              value={domain}
              onChange={e => setDomain(e.target.value)}
              placeholder="e.g. app.domain.com"
              style={S.input}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <select
              value={recordType}
              onChange={e => setRecordType(e.target.value)}
              style={{ ...S.input, color: "#f0f0f5", background: "rgba(255,255,255,0.05)" }}
            >
              <option value="A">A (IPv4)</option>
              <option value="CNAME">CNAME (Alias)</option>
              <option value="TXT">TXT (Text)</option>
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <input
              value={target}
              onChange={e => setTarget(e.target.value)}
              placeholder="e.g. 192.168.1.1"
              style={S.input}
            />
          </div>

          <button style={S.primaryBtn("#a78bfa")} onClick={addRecord} disabled={loading}>
            {loading ? "Adding Record..." : "⚡ Register DNS Record"}
          </button>
        </div>

        {/* List */}
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Active DNS Mappings ({records.length})</div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {records.map(r => (
              <div key={r.id} style={S.recordCard}>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#22d3ee", marginRight: 8 }}>[{r.type}]</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5" }}>{r.domain}</span>
                  <div style={{ fontSize: 9, color: "#6e7191", marginTop: 2 }}>Target: {r.target}</div>
                </div>
                <button
                  onClick={() => removeRecord(r.id)}
                  style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 11 }}
                >
                  ✕
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

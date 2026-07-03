import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 },
  formPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  auditorPanel: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 20 },
  
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box", outline: "none" },
  label: { fontSize: 10, color: "#6e7191", marginBottom: 4, display: "block" },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  riskMeter: (score) => {
    let color = "#10b981";
    if (score > 40) color = "#f59e0b";
    if (score > 70) color = "#ef4444";
    return {
      background: "rgba(255,255,255,0.02)", border: `1px solid rgba(255,255,255,0.06)`, borderRadius: 10, padding: 16, display: "flex", alignItems: "center", justifyContents: "space-between",
    };
  },
  
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

const CONTRACT_PRESETS = [
  { id: "saas", name: "SaaS Terms of Service", type: "TOS Agreement" },
  { id: "nda", name: "Mutual Non-Disclosure Agreement", type: "NDA Contract" },
  { id: "emp", name: "Standard Employment Agreement", type: "HR Contract" },
];

export default function LegalRiskAuditor({ onNav }) {
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("TOS Agreement");
  const [loading, setLoading] = useState(false);
  const [audited, setAudited] = useState(false);
  
  const [riskScore, setRiskScore] = useState(0);
  const [riskList, setRiskList] = useState([]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const runAudit = () => {
    if (!docName) {
      showToast("Please select or name a document!");
      return;
    }
    setLoading(true);
    setAudited(false);

    setTimeout(() => {
      let score = 25;
      let risks = [];
      
      if (docType.includes("TOS")) {
        score = 65;
        risks = [
          { clause: "Indemnity Cap", severity: "Medium", desc: "No liability cap found on customer indemnity obligations. Recommend capping at 12 months fee value.", code: "Section 14.2 - Indemnification" },
          { clause: "Auto-Renewal", severity: "Low", desc: "Automatic renewal clause with only 30-day exit notice. Extend to 60 days.", code: "Section 5.1 - Subscription Term" },
        ];
      } else if (docType.includes("NDA")) {
        score = 80;
        risks = [
          { clause: "IP Assignment", severity: "High", desc: "Confidentiality clause contains language allocating ownership of derived ideas to the receiving party. Flagged for review.", code: "Section 8.4 - Intellectual Property" },
          { clause: "Duration Limits", severity: "Medium", desc: "Confidentiality obligations are set to perpetual. Recommend 3-5 years maximum.", code: "Section 3.2 - Term of Obligations" },
        ];
      } else {
        score = 35;
        risks = [
          { clause: "Non-Compete Limits", severity: "Medium", desc: "Geographic restriction radius on non-compete is overly broad. Target for narrowing.", code: "Section 11.2 - Non-Competition" },
        ];
      }

      setRiskScore(score);
      setRiskList(risks);
      setAudited(true);
      setLoading(false);
      showToast("Audit completed. Risks flagged!");
    }, 1500);
  };

  const loadPreset = (p) => {
    setDocName(p.name);
    setDocType(p.type);
    showToast(`Loaded ${p.name}`);
  };

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>⚖️ AI Legal Risk Auditor</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Audit legal contracts instantly. Verify liability limits, NDAs, auto-renewals, and non-competes.</div>
        </div>
      </div>

      {/* Grid */}
      <div style={S.grid}>
        
        {/* Form Panel */}
        <div style={S.formPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 14 }}>Upload & Configure</div>

          <div style={{ marginBottom: 10 }}>
            <label style={S.label}>Document Title</label>
            <input
              value={docName}
              onChange={e => setDocName(e.target.value)}
              placeholder="e.g. Terms of Service"
              style={S.input}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>Contract Type</label>
            <select
              value={docType}
              onChange={e => setDocType(e.target.value)}
              style={S.input}
            >
              <option value="TOS Agreement">TOS Agreement</option>
              <option value="NDA Contract">NDA Contract</option>
              <option value="HR Contract">HR Contract</option>
              <option value="Vendor Agreement">Vendor Agreement</option>
            </select>
          </div>

          <button style={S.primaryBtn("#a78bfa")} onClick={runAudit} disabled={loading}>
            {loading ? "Auditing..." : "🔎 Audit Contract"}
          </button>

          {/* Presets */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16, marginTop: 16 }}>
            <label style={S.label}>Contract Templates</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {CONTRACT_PRESETS.map(p => (
                <button
                  key={p.id}
                  onClick={() => loadPreset(p)}
                  style={{
                    ...S.primaryBtn("#22d3ee"),
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#a0aec0",
                    fontSize: 10,
                    textAlign: "left",
                    padding: "6px 10px",
                  }}
                >
                  📄 {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Auditor Panel */}
        <div style={S.auditorPanel}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Risk Audit Analysis</div>

          {audited ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              
              {/* Risk score */}
              <div style={S.riskMeter(riskScore)}>
                <div>
                  <div style={{ fontSize: 10, color: "#6e7191" }}>Risk Liability Index</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: riskScore > 60 ? "#ef4444" : "#f59e0b", marginTop: 4 }}>
                    {riskScore}% — {riskScore > 60 ? "Critical Action Needed" : "Medium Risk"}
                  </div>
                </div>
                <div style={{ fontSize: 24 }}>⚖️</div>
              </div>

              {/* Risky clauses */}
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#6e7191", marginBottom: 10, display: "block" }}>Flagged Risk Vectors ({riskList.length})</span>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {riskList.map((r, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 14 }}>
                      <div style={{ display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5" }}>{r.clause}</span>
                        <span style={{ fontSize: 9, fontWeight: 700, color: r.severity === "High" ? "#ef4444" : "#f59e0b", background: (r.severity === "High" ? "#ef4444" : "#f59e0b") + "18", borderRadius: 4, padding: "2px 6px" }}>
                          {r.severity} Risk
                        </span>
                      </div>
                      <div style={{ fontSize: 10, color: "#a78bfa", fontFamily: "monospace", marginBottom: 6 }}>{r.code}</div>
                      <div style={{ fontSize: 11, color: "#a0aec0", lineHeight: 1.5 }}>{r.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div style={{ color: "#6e7191", fontSize: 12, fontStyle: "italic" }}>
              Upload contract file or select standard preset template and run audits...
            </div>
          )}
        </div>

      </div>

      {/* TOAST */}
      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}

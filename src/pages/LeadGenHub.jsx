import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "300px 1fr", gap: 24 },
  formPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  leadsPanel: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 20 },
  
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box", outline: "none" },
  label: { fontSize: 10, color: "#6e7191", marginBottom: 4, display: "block" },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  leadCard: (active) => ({
    background: active ? "rgba(34,211,238,0.05)" : "rgba(255,255,255,0.01)",
    border: `1px solid ${active ? "#22d3ee" : "rgba(255,255,255,0.06)"}`,
    borderRadius: 10, padding: 12, display: "flex", justifyContents: "space-between", alignItems: "center", cursor: "pointer", transition: "all 0.2s",
  }),
  
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

const MOCK_LEADS = [
  { id: "l1", name: "Sarah Connor", company: "Cyberdyne Systems", email: "s.connor@cyberdyne.io", phone: "+1 (555) 901-2041", status: "New", value: "$4,500" },
  { id: "l2", name: "Thomas Anderson", company: "Meta Cortex", email: "neo@metacortex.com", phone: "+1 (555) 302-9018", status: "Qualified", value: "$12,000" },
  { id: "l3", name: "Bruce Wayne", company: "Wayne Enterprises", email: "bruce@wayne.corp", phone: "+1 (555) 700-1002", status: "Contacted", value: "$85,000" },
];

export default function LeadGenHub({ onNav }) {
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [leads, setLeads] = useState(MOCK_LEADS);
  const [activeLead, setActiveLead] = useState(MOCK_LEADS[0]);
  const [loading, setLoading] = useState(false);
  const [generatedPitch, setGeneratedPitch] = useState("");
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const searchLeads = () => {
    if (!industry || !location) {
      showToast("Please enter Industry and Location!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const created = [
        { id: `l_${Date.now()}_1`, name: "Alice Smith", company: `${industry} Solutions`, email: `alice@${industry.toLowerCase().replace(/\s+/g, "")}.com`, phone: "+1 (555) 123-4567", status: "New", value: "$8,500" },
        { id: `l_${Date.now()}_2`, name: "Bob Johnson", company: `${location} Growth Corp`, email: `bob@${location.toLowerCase().replace(/\s+/g, "")}growth.com`, phone: "+1 (555) 987-6543", status: "Qualified", value: "$15,000" },
      ];
      setLeads(prev => [...created, ...prev]);
      setActiveLead(created[0]);
      setLoading(false);
      showToast("Found 2 new qualified leads!");
    }, 1500);
  };

  const generateOutboundPitch = () => {
    if (!activeLead) return;
    setLoading(true);
    setTimeout(() => {
      setGeneratedPitch(`Subject: Empowering ${activeLead.company} growth strategies\n\nDear ${activeLead.name},\n\nI noticed ${activeLead.company} has been scaling operations recently. Based on our AI analysis, there are major opportunities to automate your pipeline workflows and reduce customer acquisition costs.\n\nLet me know if you have 10 minutes next Tuesday for a quick walkthrough.\n\nBest regards,\nOutbound AI Agent`);
      setLoading(false);
      showToast("Outbound Pitch generated!");
    }, 1000);
  };

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🎯 Outbound AI Lead Generation</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Find qualified targets in bulk, auto-qualify profiles, and draft high-conversion email pitches.</div>
        </div>
      </div>

      {/* Grid Layout */}
      <div style={S.grid}>
        
        {/* Form Panel */}
        <div style={S.formPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 14 }}>Lead Search Criteria</div>
          
          <div style={{ marginBottom: 10 }}>
            <label style={S.label}>Target Industry / Niche</label>
            <input
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              placeholder="e.g. Real Estate, Laundry, Retail"
              style={S.input}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>Target Geographic Location</label>
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. New York, Paris, Karachi"
              style={S.input}
            />
          </div>

          <button style={S.primaryBtn("#a78bfa")} onClick={searchLeads} disabled={loading}>
            {loading ? "Searching..." : "🔍 Find Lead Targets"}
          </button>
        </div>

        {/* Lead Hub Panel */}
        <div style={S.leadsPanel}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            
            {/* Leads Column */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#6e7191", marginBottom: 12 }}>Target Prospect Profiles ({leads.length})</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {leads.map(l => {
                  const active = activeLead?.id === l.id;
                  return (
                    <div
                      key={l.id}
                      onClick={() => { setActiveLead(l); setGeneratedPitch(""); }}
                      style={S.leadCard(active)}
                    >
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5" }}>{l.name}</div>
                        <div style={{ fontSize: 10, color: "#6e7191" }}>{l.company}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#22d3ee" }}>{l.value}</span>
                        <div style={{ fontSize: 8, color: "#6e7191", marginTop: 2 }}>{l.status}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Campaign Column */}
            {activeLead && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#6e7191", marginBottom: 12 }}>Outreach Pitch & Campaign Builder</div>
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 4 }}>{activeLead.name}</div>
                  <div style={{ fontSize: 11, color: "#6e7191", marginBottom: 14 }}>Contact: {activeLead.email} | {activeLead.phone}</div>
                  
                  <button style={S.primaryBtn("#22d3ee")} onClick={generateOutboundPitch} disabled={loading}>
                    {loading ? "Drafting..." : "⚡ Generate Outreach Pitch"}
                  </button>

                  {generatedPitch && (
                    <div style={{ marginTop: 14 }}>
                      <label style={S.label}>Email Copy Draft</label>
                      <pre style={{ margin: 0, background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: 12, fontSize: 10, color: "#c0caf5", whiteSpace: "pre-wrap", border: "1px solid rgba(255,255,255,0.04)" }}>
                        {generatedPitch}
                      </pre>
                      <button
                        style={{ ...S.primaryBtn("#10b981"), marginTop: 10, width: "100%", fontSize: 10 }}
                        onClick={() => showToast("Campaign pitch sent successfully!")}
                      >
                        ✉ Send Pitch Campaign
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* TOAST */}
      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}

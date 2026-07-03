import { useState } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 },
  formPanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  simulatorPanel: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 20 },
  
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box", outline: "none" },
  label: { fontSize: 10, color: "#6e7191", marginBottom: 4, display: "block" },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  runwayStat: (critical) => ({ background: critical ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)", border: `1px solid ${critical ? "#ef4444" : "#10b981"}`, borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", gap: 4 }),
  
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function BusinessSimulator({ onNav }) {
  const [cash, setCash] = useState(50000);
  const [mrr, setMrr] = useState(12000);
  const [churn, setChurn] = useState(4); // %
  const [cac, setCac] = useState(150);
  const [overhead, setOverhead] = useState(10000);
  const [newHires, setNewHires] = useState(0);

  const [projectedMonths, setProjectedMonths] = useState(12);
  const [recs, setRecs] = useState([]);
  const [simulated, setSimulated] = useState(false);

  const runSimulation = () => {
    setSimulated(true);
    const growth = mrr * 0.15; // mock growth
    const loss = mrr * (churn / 100);
    const net = growth - loss;
    const expense = overhead + (newHires * 4000) + (cac * 10);
    const cashflow = net - expense;

    let runway = "Infinite";
    if (cashflow < 0) {
      runway = `${Math.floor(cash / Math.abs(cashflow))} Months`;
    }

    const calculatedRecs = [];
    if (churn > 5) {
      calculatedRecs.push("⚠ High churn rate! Enhance customer success portals and feature alignment workflows.");
    }
    if (cashflow < 0) {
      calculatedRecs.push("💡 Cashflow is negative. Consider decreasing Overhead spend or increasing MRR via optimized lead campaigns.");
    } else {
      calculatedRecs.push("✓ Health metric: Cashflow is positive! Consider hiring engineering assets to scale backend tunnels.");
    }
    setRecs(calculatedRecs);
  };

  const cashflowVal = (mrr * 0.15 - mrr * (churn / 100)) - (overhead + (newHires * 4000) + (cac * 10));

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>📊 Business Runway Simulator</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Simulate monthly cashflow, check projected runway, and get AI recommendations.</div>
        </div>
      </div>

      {/* Grid */}
      <div style={S.grid}>
        
        {/* Form Panel */}
        <div style={S.formPanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 14 }}>Financial Parameters</div>

          <div style={{ marginBottom: 10 }}>
            <label style={S.label}>Starting Cash Balance ($)</label>
            <input type="number" value={cash} onChange={e => setCash(parseFloat(e.target.value) || 0)} style={S.input} />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={S.label}>Current Monthly Recurring Revenue ($)</label>
            <input type="number" value={mrr} onChange={e => setMrr(parseFloat(e.target.value) || 0)} style={S.input} />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={S.label}>Monthly Churn Rate (%)</label>
            <input type="number" value={churn} onChange={e => setChurn(parseFloat(e.target.value) || 0)} style={S.input} />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={S.label}>Customer Acquisition Cost - CAC ($)</label>
            <input type="number" value={cac} onChange={e => setCac(parseFloat(e.target.value) || 0)} style={S.input} />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={S.label}>Fixed Monthly Overhead ($)</label>
            <input type="number" value={overhead} onChange={e => setOverhead(parseFloat(e.target.value) || 0)} style={S.input} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>Planned New Hires (Salary ~ $4K/mo each)</label>
            <input type="number" value={newHires} onChange={e => setNewHires(parseInt(e.target.value) || 0)} style={S.input} />
          </div>

          <button style={S.primaryBtn("#a78bfa")} onClick={runSimulation}>
            ▶ Simulate Runway
          </button>
        </div>

        {/* Simulator Panel */}
        <div style={S.simulatorPanel}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Simulation Output Projection</div>

          {simulated ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                
                {/* Net Cashflow Stat */}
                <div style={S.runwayStat(cashflowVal < 0)}>
                  <span style={{ fontSize: 10, color: "#6e7191", textTransform: "uppercase" }}>Monthly Net Cashflow</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: cashflowVal < 0 ? "#ef4444" : "#10b981" }}>
                    {cashflowVal < 0 ? "-" : "+"}${Math.abs(cashflowVal).toFixed(2)}
                  </span>
                </div>

                {/* Runway Stat */}
                <div style={S.runwayStat(cashflowVal < 0)}>
                  <span style={{ fontSize: 10, color: "#6e7191", textTransform: "uppercase" }}>Projected Runway</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: cashflowVal < 0 ? "#ef4444" : "#10b981" }}>
                    {cashflowVal < 0 ? `${Math.floor(cash / Math.abs(cashflowVal))} Months` : "Infinite"}
                  </span>
                </div>

              </div>

              {/* Simple SVGs Chart representing cash runway depletion or accumulation */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#6e7191" }}>Cash Curve Over 12 Months</span>
                <div style={{ height: 120, display: "flex", alignItems: "flex-end", gap: 20, marginTop: 14, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  {[...Array(12)].map((_, i) => {
                    const monthCash = cash + (cashflowVal * i);
                    const pct = Math.max(10, Math.min(100, (monthCash / cash) * 100));
                    return (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ width: "100%", height: pct, background: cashflowVal < 0 ? "linear-gradient(0deg, rgba(239,68,68,0.2) 0%, #ef4444 100%)" : "linear-gradient(0deg, rgba(16,185,129,0.2) 0%, #10b981 100%)", borderRadius: "3px 3px 0 0" }} />
                        <span style={{ fontSize: 8, color: "#6e7191", marginTop: 4 }}>M{i+1}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa", marginBottom: 8 }}>AI Strategic Recommendations</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {recs.map((r, i) => (
                    <div key={i} style={{ fontSize: 12, color: "#a0aec0", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 12px" }}>
                      {r}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div style={{ color: "#6e7191", fontSize: 12, fontStyle: "italic" }}>
              Configure parameter metrics and trigger simulation computation...
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

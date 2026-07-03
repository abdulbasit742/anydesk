import { useState, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 },
  card: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function RoleManager({ onNav }) {
  const [users, setUsers] = useState([
    { id: 1, name: "Alice", role: "Admin", permissions: "Full Access" },
    { id: 2, name: "Bob", role: "Developer", permissions: "Tunnels & Terminal Only" },
    { id: 3, name: "Charlie", role: "Viewer", permissions: "Dashboard Only" },
  ]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const updateRole = (id, newRole) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
    showToast(`✓ Updated role permissions for User ID #${id}!`);
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>👥 Team Access & Role Manager</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Configure granular permissions, assign user roles (Admin, Dev, Viewer), and manage API token scopes.</div>
        </div>
      </div>

      <div style={S.grid}>
        
        {/* Roles list */}
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Workspace Members</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {users.map(u => (
              <div key={u.id} style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", padding: 12, borderRadius: 10, display: "flex", justifyContents: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5" }}>{u.name}</div>
                  <div style={{ fontSize: 9, color: "#6e7191" }}>Permissions: {u.permissions}</div>
                </div>

                <select
                  value={u.role}
                  onChange={e => updateRole(u.id, e.target.value)}
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#f0f0f5", fontSize: 11, padding: "4px 8px" }}
                >
                  <option value="Admin">Admin</option>
                  <option value="Developer">Developer</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Global Security Audit */}
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Workspace Token Security</div>
          <div style={{ fontSize: 12, color: "#a0aec0", lineHeight: 1.6 }}>
            <div>Active SSH sessions: <b>1</b></div>
            <div style={{ marginTop: 10 }}>Webhook event listeners active: <b>2</b></div>
            <div style={{ marginTop: 10 }}>Session audit trail logs: <b>Enabled</b></div>
          </div>
        </div>

      </div>

      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}

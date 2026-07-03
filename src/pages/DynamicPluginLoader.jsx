import { useState, useCallback } from "react";

const INITIAL_PLUGINS = [
  { id: "pl1", name: "Custom Telegram Bot Linker", author: "DevTeam", version: "1.0.0", status: "active", code: "console.log('Telegram plugin active.');" },
  { id: "pl2", name: "Shopify Stock Auto-Sync", author: "LogisticsDept", version: "1.2.1", status: "disabled", code: "console.log('Shopify sync loaded.');" },
];

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 },
  codePanel: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 },
  sidebar: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 16 },
  
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f0f5", fontSize: 12, padding: "8px 12px", width: "100%", boxSizing: "border-box", outline: "none" },
  label: { fontSize: 10, color: "#6e7191", marginBottom: 4, display: "block" },
  primaryBtn: (c) => ({ padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }),
  
  pluginCard: (active) => ({
    background: active ? "rgba(34,211,238,0.05)" : "rgba(255,255,255,0.01)",
    border: `1px solid ${active ? "#22d3ee" : "rgba(255,255,255,0.06)"}`,
    borderRadius: 10, padding: 12, display: "flex", justifyContents: "space-between", alignItems: "center", cursor: "pointer", transition: "all 0.25s",
  }),
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function DynamicPluginLoader({ onNav }) {
  const [plugins, setPlugins] = useState(INITIAL_PLUGINS);
  const [activePlugin, setActivePlugin] = useState(INITIAL_PLUGINS[0]);
  const [newPlugin, setNewPlugin] = useState({ name: "", author: "Admin", version: "1.0.0", code: "" });
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const registerPlugin = () => {
    if (!newPlugin.name || !newPlugin.code) {
      showToast("Name and JS Code are required!");
      return;
    }
    const created = {
      id: `pl_${Date.now()}`,
      name: newPlugin.name,
      author: newPlugin.author,
      version: newPlugin.version,
      status: "active",
      code: newPlugin.code,
    };
    setPlugins(prev => [...prev, created]);
    setActivePlugin(created);
    setNewPlugin({ name: "", author: "Admin", version: "1.0.0", code: "" });
    showToast("Dynamic plugin injected at runtime!");
  };

  const togglePluginStatus = (id, e) => {
    e.stopPropagation();
    setPlugins(prev => prev.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === "active" ? "disabled" : "active";
        showToast(`Plugin status updated to ${nextStatus}`);
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  const deletePlugin = (id, e) => {
    e.stopPropagation();
    setPlugins(prev => prev.filter(p => p.id !== id));
    if (activePlugin?.id === id) {
      setActivePlugin(null);
    }
    showToast("Plugin removed.");
  };

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🔌 Dynamic Plugin Loader</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Inject custom JavaScript plugins at runtime to register sidebar navigation routes and actions dynamically.</div>
        </div>
      </div>

      {/* Grid */}
      <div style={S.grid}>
        
        {/* Code Editor Panel */}
        <div style={S.codePanel}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", marginBottom: 14 }}>Register New Runtime Plugin</div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 10 }}>
            <div>
              <label style={S.label}>Plugin Name</label>
              <input
                value={newPlugin.name}
                onChange={e => setNewPlugin(p => ({ ...p, name: e.target.value }))}
                placeholder="My Custom Action"
                style={S.input}
              />
            </div>
            <div>
              <label style={S.label}>Author</label>
              <input
                value={newPlugin.author}
                onChange={e => setNewPlugin(p => ({ ...p, author: e.target.value }))}
                placeholder="Admin"
                style={S.input}
              />
            </div>
            <div>
              <label style={S.label}>Version</label>
              <input
                value={newPlugin.version}
                onChange={e => setNewPlugin(p => ({ ...p, version: e.target.value }))}
                placeholder="1.0.0"
                style={S.input}
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>JavaScript Code Block</label>
            <textarea
              value={newPlugin.code}
              onChange={e => setNewPlugin(p => ({ ...p, code: e.target.value }))}
              placeholder="// Execute arbitrary code upon active menu item click...&#10;console.log('My custom dynamic plugin loaded!');"
              style={{ ...S.input, height: 180, fontFamily: "monospace", fontSize: 11, resize: "none" }}
            />
          </div>

          <button style={S.primaryBtn("#22d3ee")} onClick={registerPlugin}>
            Inject Plugin Component
          </button>
        </div>

        {/* Sidebar */}
        <div style={S.sidebar}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5", marginBottom: 12 }}>Active Plugin Registry ({plugins.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {plugins.map(p => {
                const active = activePlugin?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setActivePlugin(p)}
                    style={S.pluginCard(active)}
                  >
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5" }}>{p.name}</div>
                      <div style={{ fontSize: 10, color: "#6e7191" }}>v{p.version} | by {p.author}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <button
                        onClick={(e) => togglePluginStatus(p.id, e)}
                        style={{
                          background: "none", border: "none", cursor: "pointer", fontSize: 9,
                          color: p.status === "active" ? "#10b981" : "#6e7191",
                          fontWeight: 600,
                        }}
                      >
                        {p.status === "active" ? "active" : "disabled"}
                      </button>
                      <button
                        onClick={(e) => deletePlugin(p.id, e)}
                        style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 11 }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {activePlugin && (
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#6e7191" }}>Execution Log Preview</span>
              <pre style={{ margin: "10px 0 0", background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: 12, fontSize: 10, color: "#a78bfa", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
                {activePlugin.code}
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

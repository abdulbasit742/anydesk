import { useState, useCallback } from "react";

const INITIAL_LOCAL = [
  { name: "package.json", size: "1.4 KB", type: "file" },
  { name: "src", size: "DIR", type: "dir" },
  { name: "public", size: "DIR", type: "dir" },
  { name: "vite.config.js", size: "840 B", type: "file" },
];

const INITIAL_REMOTE = [
  { name: "server.js", size: "4.2 KB", type: "file" },
  { name: "node_modules", size: "DIR", type: "dir" },
  { name: "assets", size: "DIR", type: "dir" },
  { name: ".env", size: "120 B", type: "file" },
];

const S = {
  page: { minHeight: "100vh", background: "#0a0a1a", color: "#f0f0f5", fontFamily: "'Inter', sans-serif", padding: 30, boxSizing: "border-box" },
  header: { display: "flex", justifyContents: "space-between", alignItems: "center", marginBottom: 24 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 },
  pane: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 14 },
  paneHeader: { display: "flex", justifyContents: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 10 },
  
  fileItem: (selected) => ({
    display: "flex", justifyContents: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: 8, background: selected ? "rgba(34,211,238,0.08)" : "transparent",
    border: `1px solid ${selected ? "#22d3ee" : "transparent"}`, cursor: "pointer", transition: "all 0.15s",
  }),
  
  queueCard: { background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 12, padding: 16 },
  
  primaryBtn: (c) => ({ padding: "6px 14px", borderRadius: 7, border: "none", background: `linear-gradient(135deg, ${c}, ${c}b3)`, color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }),
  toast: (v) => ({ position: "fixed", bottom: 24, right: 24, background: "#111122", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, padding: "12px 20px", color: "#f0f0f5", fontSize: 13, fontWeight: 600, zIndex: 9999, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(12px)", transition: "all 0.25s" }),
};

export default function FileTransfer({ onNav }) {
  const [localFiles, setLocalFiles] = useState(INITIAL_LOCAL);
  const [remoteFiles, setRemoteFiles] = useState(INITIAL_REMOTE);
  
  const [selectedLocal, setSelectedLocal] = useState(null);
  const [selectedRemote, setSelectedRemote] = useState(null);
  
  const [transfers, setTransfers] = useState([]);
  const [transferring, setTransferring] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  }, []);

  const uploadFile = () => {
    if (!selectedLocal) {
      showToast("Select a local file first!");
      return;
    }
    const file = selectedLocal;
    setTransfers(prev => [...prev, { name: file.name, direction: "Upload ➔", progress: 0, status: "pending" }]);
    showToast(`Added ${file.name} to upload queue`);
    setSelectedLocal(null);
    triggerQueueProcess();
  };

  const downloadFile = () => {
    if (!selectedRemote) {
      showToast("Select a remote file first!");
      return;
    }
    const file = selectedRemote;
    setTransfers(prev => [...prev, { name: file.name, direction: "Download ⬅", progress: 0, status: "pending" }]);
    showToast(`Added ${file.name} to download queue`);
    setSelectedRemote(null);
    triggerQueueProcess();
  };

  const triggerQueueProcess = () => {
    if (transferring) return;
    setTransferring(true);
    
    const interval = setInterval(() => {
      setTransfers(prev => {
        const pendingIdx = prev.findIndex(t => t.status === "pending" || t.status === "running");
        if (pendingIdx === -1) {
          clearInterval(interval);
          setTransferring(false);
          return prev;
        }
        
        const next = [...prev];
        const task = { ...next[pendingIdx], status: "running" };
        task.progress += 20;
        
        if (task.progress >= 100) {
          task.status = "done";
          // Add to opposite file list
          if (task.direction.includes("Upload")) {
            setRemoteFiles(r => {
              if (r.some(f => f.name === task.name)) return r;
              return [...r, { name: task.name, size: "1.4 KB", type: "file" }];
            });
          } else {
            setLocalFiles(l => {
              if (l.some(f => f.name === task.name)) return l;
              return [...l, { name: task.name, size: "4.2 KB", type: "file" }];
            });
          }
        }
        
        next[pendingIdx] = task;
        return next;
      });
    }, 400);
  };

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>📁 Remote File Transfer</h1>
          <div style={{ fontSize: 11, color: "#6e7191", marginTop: 4 }}>Synchronize and transfer source codes, logs, and assets between local host system and remote devices.</div>
        </div>
      </div>

      {/* Main Panes Grid */}
      <div style={S.grid}>
        
        {/* Local Pane */}
        <div style={S.pane}>
          <div style={S.paneHeader}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>💻 Local Host Filesystem</span>
            {selectedLocal && (
              <button style={S.primaryBtn("#22d3ee")} onClick={uploadFile}>
                Upload ➔
              </button>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {localFiles.map(f => (
              <div
                key={f.name}
                onClick={() => setSelectedLocal(f)}
                style={S.fileItem(selectedLocal?.name === f.name)}
              >
                <span style={{ fontSize: 12, fontWeight: 600 }}>{f.type === "dir" ? "📁" : "📄"} {f.name}</span>
                <span style={{ fontSize: 10, color: "#6e7191" }}>{f.size}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Remote Pane */}
        <div style={S.pane}>
          <div style={S.paneHeader}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>🖥️ Remote Client Filesystem</span>
            {selectedRemote && (
              <button style={S.primaryBtn("#a78bfa")} onClick={downloadFile}>
                ⬅ Download
              </button>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {remoteFiles.map(f => (
              <div
                key={f.name}
                onClick={() => setSelectedRemote(f)}
                style={S.fileItem(selectedRemote?.name === f.name)}
              >
                <span style={{ fontSize: 12, fontWeight: 600 }}>{f.type === "dir" ? "📁" : "📄"} {f.name}</span>
                <span style={{ fontSize: 10, color: "#6e7191" }}>{f.size}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Transfer Queue */}
      <div style={S.queueCard}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5", marginBottom: 12 }}>Transfer Queue ({transfers.filter(t => t.status !== "done").length} active)</div>
        {transfers.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {transfers.map((t, idx) => (
              <div key={idx} style={{ display: "flex", justifyContents: "space-between", alignItems: "center", fontSize: 11, background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", padding: "8px 12px", borderRadius: 8 }}>
                <div style={{ display: "flex", gap: 14 }}>
                  <span style={{ color: "#22d3ee", fontWeight: 700 }}>{t.direction}</span>
                  <span style={{ fontWeight: 600 }}>{t.name}</span>
                </div>

                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: "#6e7191" }}>{t.progress}%</span>
                  <span style={{ fontSize: 10, color: t.status === "done" ? "#10b981" : t.status === "running" ? "#f59e0b" : "#6e7191" }}>
                    {t.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: "#6e7191", fontSize: 11, fontStyle: "italic" }}>
            Queue empty. Select file targets above and start uploads or downloads.
          </div>
        )}
      </div>

      {/* TOAST */}
      <div style={S.toast(toast.show)}>{toast.msg}</div>
    </div>
  );
}

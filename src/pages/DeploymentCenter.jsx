import { useState } from "react";

const C = {
  gold: "#f5b731",
  teal: "#22d3ee",
  purple: "#a78bfa",
  surface: "#0e0e16",
  surface2: "#16161e",
  surface3: "#1d1d28",
  border: "rgba(255,255,255,0.07)",
  muted: "#6e7191",
  red: "#ef4444",
  green: "#22c55e",
  text: "#e2e8f0",
  white: "#ffffff",
};

const css = {
  page: {
    background: C.surface,
    minHeight: "100vh",
    fontFamily: "'DM Mono', 'Courier New', monospace",
    color: C.text,
    padding: "0 0 60px 0",
  },
  hero: {
    background: `linear-gradient(135deg, ${C.surface2} 0%, #0a0a14 60%, #12101e 100%)`,
    borderBottom: `1px solid ${C.border}`,
    padding: "48px 40px 36px",
    position: "relative",
    overflow: "hidden",
  },
  heroGlow: {
    position: "absolute",
    top: "-80px",
    right: "-80px",
    width: "340px",
    height: "340px",
    background: `radial-gradient(circle, ${C.gold}22 0%, transparent 70%)`,
    pointerEvents: "none",
  },
  heroTitle: {
    fontSize: "2.2rem",
    fontWeight: 700,
    fontFamily: "'Syne', sans-serif",
    background: `linear-gradient(90deg, ${C.gold}, ${C.teal})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0 0 14px 0",
  },
  badge: (color) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: `${color}18`,
    border: `1px solid ${color}44`,
    color: color,
    borderRadius: "20px",
    padding: "4px 12px",
    fontSize: "0.72rem",
    fontWeight: 600,
    marginRight: "10px",
    letterSpacing: "0.04em",
  }),
  section: {
    margin: "32px 40px 0",
  },
  sectionTitle: {
    fontSize: "0.8rem",
    fontWeight: 700,
    color: C.muted,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  card: {
    background: C.surface2,
    border: `1px solid ${C.border}`,
    borderRadius: "12px",
    padding: "20px",
  },
  btn: (color = C.gold, ghost = false) => ({
    background: ghost ? "transparent" : `${color}18`,
    border: `1px solid ${color}55`,
    color: color,
    borderRadius: "8px",
    padding: "8px 18px",
    fontSize: "0.75rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Mono', monospace",
    letterSpacing: "0.05em",
    transition: "all 0.18s",
  }),
  input: {
    background: C.surface3,
    border: `1px solid ${C.border}`,
    borderRadius: "8px",
    color: C.text,
    padding: "8px 12px",
    fontSize: "0.8rem",
    fontFamily: "'DM Mono', monospace",
    outline: "none",
  },
};

// ── STEP INDICATOR ──────────────────────────────────────────────
function StepBar({ step }) {
  const steps = ["Project", "Platform", "Config", "Deploy"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0", marginBottom: "28px" }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "none" }}>
            <div style={{
              width: "34px", height: "34px", borderRadius: "50%",
              background: i <= step ? `linear-gradient(135deg, ${C.gold}, ${C.teal})` : C.surface3,
              border: `2px solid ${i <= step ? C.gold : C.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.75rem", fontWeight: 700, color: i <= step ? "#000" : C.muted,
              transition: "all 0.3s",
            }}>{i < step ? "✓" : i + 1}</div>
            <span style={{ fontSize: "0.65rem", color: i === step ? C.gold : C.muted, marginTop: "5px", whiteSpace: "nowrap" }}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              flex: 1, height: "2px", margin: "0 4px",
              background: i < step ? `linear-gradient(90deg, ${C.gold}, ${C.teal})` : C.surface3,
              transition: "all 0.3s", marginBottom: "18px",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── DEPLOY WIZARD ───────────────────────────────────────────────
const PROJECTS = [
  { id: 1, name: "NeuralChat UI", lang: "React", size: "2.3 MB" },
  { id: 2, name: "DataVault API", lang: "Node.js", size: "1.1 MB" },
  { id: 3, name: "VisionBoard", lang: "Next.js", size: "4.7 MB" },
  { id: 4, name: "CryptoTracker", lang: "Vue", size: "3.2 MB" },
  { id: 5, name: "AudioForge", lang: "SvelteKit", size: "5.8 MB" },
  { id: 6, name: "DocuMind", lang: "Python/Flask", size: "0.9 MB" },
];
const PLATFORMS = [
  { id: "vercel", name: "Vercel", color: C.white, icon: "▲" },
  { id: "netlify", name: "Netlify", color: C.teal, icon: "N" },
  { id: "railway", name: "Railway", color: C.purple, icon: "⟐" },
  { id: "render", name: "Render", color: C.green, icon: "R" },
  { id: "flyio", name: "Fly.io", color: "#fb923c", icon: "✈" },
  { id: "ghpages", name: "GitHub Pages", color: C.muted, icon: "⬡" },
];
const DEPLOY_STEPS_DEF = [
  "Clone Repository",
  "Install Dependencies",
  "Build Project",
  "Optimize Assets",
  "Upload to CDN",
  "Go Live! 🚀",
];

function DeployWizard() {
  const [step, setStep] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [envVars, setEnvVars] = useState([
    { key: "NODE_ENV", value: "production" },
    { key: "API_URL", value: "https://api.example.com" },
  ]);
  const [buildCmd, setBuildCmd] = useState("npm run build");
  const [deployRunning, setDeployRunning] = useState(false);
  const [deployProgress, setDeployProgress] = useState([]);
  const [deployDone, setDeployDone] = useState(false);
  const projName = PROJECTS.find((p) => p.id === selectedProject)?.name || "neural-chat";
  const fakeUrl = `https://${projName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.vercel.app`;

  const addEnvVar = () => setEnvVars((v) => [...v, { key: "", value: "" }]);
  const removeEnvVar = (i) => setEnvVars((v) => v.filter((_, idx) => idx !== i));
  const updateEnv = (i, field, val) =>
    setEnvVars((v) => v.map((row, idx) => (idx === i ? { ...row, [field]: val } : row)));

  const startDeploy = () => {
    setDeployRunning(true);
    setDeployProgress([]);
    setDeployDone(false);
    DEPLOY_STEPS_DEF.forEach((_, i) => {
      setTimeout(() => {
        setDeployProgress((p) => [...p, i]);
        if (i === DEPLOY_STEPS_DEF.length - 1) {
          setTimeout(() => setDeployDone(true), 600);
        }
      }, i * 1100 + 300);
    });
  };

  return (
    <div style={{ ...css.card, marginTop: "8px" }}>
      <StepBar step={step} />

      {/* Step 1 */}
      {step === 0 && (
        <div>
          <p style={{ color: C.muted, fontSize: "0.8rem", marginBottom: "16px" }}>Select a project to deploy:</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {PROJECTS.map((p) => (
              <div key={p.id} onClick={() => setSelectedProject(p.id)}
                style={{
                  background: selectedProject === p.id ? `${C.gold}14` : C.surface3,
                  border: `1px solid ${selectedProject === p.id ? C.gold : C.border}`,
                  borderRadius: "10px", padding: "14px", cursor: "pointer", transition: "all 0.2s",
                }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: C.text, marginBottom: "6px" }}>{p.name}</div>
                <div style={{ fontSize: "0.7rem", color: C.muted }}>{p.lang} · {p.size}</div>
                {selectedProject === p.id && <div style={{ color: C.gold, fontSize: "0.7rem", marginTop: "6px" }}>✓ Selected</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 1 && (
        <div>
          <p style={{ color: C.muted, fontSize: "0.8rem", marginBottom: "16px" }}>Choose deployment target:</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {PLATFORMS.map((p) => (
              <div key={p.id} onClick={() => setSelectedPlatform(p.id)}
                style={{
                  background: selectedPlatform === p.id ? `${p.color}14` : C.surface3,
                  border: `1px solid ${selectedPlatform === p.id ? p.color : C.border}`,
                  borderRadius: "10px", padding: "18px", cursor: "pointer",
                  transition: "all 0.2s", textAlign: "center",
                }}>
                <div style={{ fontSize: "1.6rem", marginBottom: "8px", color: p.color }}>{p.icon}</div>
                <div style={{ fontSize: "0.82rem", fontWeight: 600, color: p.color }}>{p.name}</div>
                {selectedPlatform === p.id && <div style={{ color: p.color, fontSize: "0.65rem", marginTop: "4px" }}>✓ Selected</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 2 && (
        <div>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "0.75rem", color: C.muted, display: "block", marginBottom: "6px" }}>Build Command</label>
            <input value={buildCmd} onChange={(e) => setBuildCmd(e.target.value)}
              style={{ ...css.input, width: "100%", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontSize: "0.75rem", color: C.muted }}>Environment Variables</span>
            <button onClick={addEnvVar} style={css.btn(C.teal)}>+ Add Variable</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {envVars.map((row, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input placeholder="KEY" value={row.key} onChange={(e) => updateEnv(i, "key", e.target.value)}
                  style={{ ...css.input, flex: 1 }} />
                <input placeholder="value" value={row.value} onChange={(e) => updateEnv(i, "value", e.target.value)}
                  style={{ ...css.input, flex: 2 }} />
                <button onClick={() => removeEnvVar(i)}
                  style={{ ...css.btn(C.red), padding: "8px 12px" }}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 4 */}
      {step === 3 && (
        <div>
          {!deployRunning && !deployDone && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🚀</div>
              <p style={{ color: C.muted, fontSize: "0.82rem", marginBottom: "20px" }}>
                Ready to deploy <strong style={{ color: C.text }}>{PROJECTS.find((p) => p.id === selectedProject)?.name || "project"}</strong> to <strong style={{ color: C.text }}>{PLATFORMS.find((p) => p.id === selectedPlatform)?.name || "platform"}</strong>.
              </p>
              <button onClick={startDeploy} style={{ ...css.btn(C.gold), padding: "12px 32px", fontSize: "0.85rem" }}>
                Start Deployment
              </button>
            </div>
          )}
          {deployRunning && (
            <div>
              {/* Progress bar */}
              <div style={{ background: C.surface3, borderRadius: "99px", height: "6px", marginBottom: "20px", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: "99px",
                  width: `${(deployProgress.length / DEPLOY_STEPS_DEF.length) * 100}%`,
                  background: `linear-gradient(90deg, ${C.gold}, ${C.teal})`,
                  transition: "width 0.6s ease",
                }} />
              </div>
              {DEPLOY_STEPS_DEF.map((s, i) => {
                const done = deployProgress.includes(i);
                const active = deployProgress.length === i;
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "10px 14px", borderRadius: "8px",
                    background: done ? `${C.green}10` : active ? `${C.gold}10` : "transparent",
                    marginBottom: "6px", transition: "all 0.3s",
                  }}>
                    <span style={{ fontSize: "1rem" }}>
                      {done ? "✅" : active ? (
                        <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⟳</span>
                      ) : "○"}
                    </span>
                    <span style={{ fontSize: "0.8rem", color: done ? C.green : active ? C.gold : C.muted }}>{s}</span>
                  </div>
                );
              })}
              {deployDone && (
                <div style={{
                  marginTop: "20px", padding: "16px 20px", borderRadius: "10px",
                  background: `${C.green}14`, border: `1px solid ${C.green}44`,
                  display: "flex", flexDirection: "column", gap: "8px",
                }}>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: C.green }}>🎉 Deployment Successful!</div>
                  <a href="#" style={{ fontSize: "0.75rem", color: C.teal, textDecoration: "none" }}>{fakeUrl}</a>
                  <div style={{ fontSize: "0.7rem", color: C.muted }}>Build time: 2m 07s · 99 / 100 Lighthouse score</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
        <button onClick={() => { setStep((s) => Math.max(0, s - 1)); setDeployRunning(false); setDeployDone(false); }}
          disabled={step === 0}
          style={{ ...css.btn(C.muted, true), opacity: step === 0 ? 0.3 : 1 }}>← Back</button>
        {step < 3 && (
          <button onClick={() => setStep((s) => Math.min(3, s + 1))}
            style={css.btn(C.gold)}>Next →</button>
        )}
      </div>
    </div>
  );
}

// ── ACTIVE DEPLOYMENTS TABLE ─────────────────────────────────────
const DEPLOYMENTS = [
  { project: "NeuralChat UI", platform: "Vercel", status: "Live", url: "neural-chat.vercel.app", time: "2m ago" },
  { project: "DataVault API", platform: "Railway", status: "Live", url: "datavault.railway.app", time: "14m ago" },
  { project: "VisionBoard", platform: "Netlify", status: "Building", url: "visionboard.netlify.app", time: "Just now" },
  { project: "CryptoTracker", platform: "Render", status: "Live", url: "cryptotracker.onrender.com", time: "1h ago" },
  { project: "AudioForge", platform: "Fly.io", status: "Failed", url: "audioforge.fly.dev", time: "2h ago" },
  { project: "DocuMind", platform: "Vercel", status: "Live", url: "documind.vercel.app", time: "3h ago" },
  { project: "SketchAI", platform: "GitHub Pages", status: "Live", url: "user.github.io/sketchai", time: "1d ago" },
  { project: "MetricsHub", platform: "Netlify", status: "Building", url: "metricshub.netlify.app", time: "5m ago" },
];

function statusColor(s) {
  if (s === "Live") return C.green;
  if (s === "Building") return C.gold;
  if (s === "Failed") return C.red;
  return C.muted;
}

function ActiveDeployments() {
  return (
    <div style={{ ...css.card, overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.border}` }}>
            {["Project", "Platform", "Status", "URL", "Deployed", "Actions"].map((h) => (
              <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: C.muted, fontWeight: 600, letterSpacing: "0.05em" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DEPLOYMENTS.map((d, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, transition: "background 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.surface3)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              <td style={{ padding: "11px 12px", color: C.text, fontWeight: 600 }}>{d.project}</td>
              <td style={{ padding: "11px 12px", color: C.muted }}>{d.platform}</td>
              <td style={{ padding: "11px 12px" }}>
                <span style={{
                  background: `${statusColor(d.status)}18`, border: `1px solid ${statusColor(d.status)}44`,
                  color: statusColor(d.status), borderRadius: "20px", padding: "3px 10px", fontSize: "0.68rem", fontWeight: 700,
                }}>{d.status === "Building" ? "⟳ " : ""}{d.status}</span>
              </td>
              <td style={{ padding: "11px 12px" }}>
                <a href="#" style={{ color: C.teal, textDecoration: "none", fontSize: "0.72rem" }}>{d.url}</a>
              </td>
              <td style={{ padding: "11px 12px", color: C.muted }}>{d.time}</td>
              <td style={{ padding: "11px 12px" }}>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button style={{ ...css.btn(C.purple), padding: "4px 10px", fontSize: "0.68rem" }}>Rollback</button>
                  <button style={{ ...css.btn(C.teal), padding: "4px 10px", fontSize: "0.68rem" }}>Redeploy</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── PLATFORM STATUS ──────────────────────────────────────────────
const PLATFORM_STATUS = [
  { name: "Vercel", status: "Operational", spark: [80, 85, 78, 90, 88] },
  { name: "Netlify", status: "Operational", spark: [70, 75, 80, 72, 77] },
  { name: "Railway", status: "Degraded", spark: [90, 60, 45, 55, 62] },
  { name: "Render", status: "Operational", spark: [88, 82, 90, 87, 91] },
  { name: "Fly.io", status: "Operational", spark: [76, 80, 78, 82, 79] },
  { name: "GitHub Pages", status: "Operational", spark: [95, 96, 94, 97, 95] },
];

function Sparkline({ data, color }) {
  const w = 80, h = 28, pad = 3;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((v, i) => {
        const x = pad + (i / (data.length - 1)) * (w - pad * 2);
        const y = h - pad - ((v - min) / range) * (h - pad * 2);
        return <circle key={i} cx={x} cy={y} r="2.5" fill={color} />;
      })}
    </svg>
  );
}

function PlatformStatus() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
      {PLATFORM_STATUS.map((p) => {
        const op = p.status === "Operational";
        return (
          <div key={p.name} style={{ ...css.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 600, color: C.text, marginBottom: "6px" }}>{p.name}</div>
              <span style={{
                background: `${op ? C.green : C.gold}18`, border: `1px solid ${op ? C.green : C.gold}44`,
                color: op ? C.green : C.gold, borderRadius: "20px", padding: "2px 9px", fontSize: "0.65rem", fontWeight: 700,
              }}>{p.status}</span>
            </div>
            <Sparkline data={p.spark} color={op ? C.teal : C.gold} />
          </div>
        );
      })}
    </div>
  );
}

// ── DEPLOYMENT METRICS ───────────────────────────────────────────
const METRICS = [
  { label: "Deploy Freq", value: "3.2/day", icon: "📈", color: C.teal },
  { label: "Success Rate", value: "97.8%", icon: "✅", color: C.green },
  { label: "Avg Build Time", value: "2m 14s", icon: "⏱", color: C.gold },
  { label: "CO₂ Saved", value: "1.2 kg", icon: "🌱", color: "#4ade80" },
];

function DeployMetrics() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
      {METRICS.map((m) => (
        <div key={m.label} style={{
          ...css.card,
          background: `linear-gradient(135deg, ${C.surface2} 60%, ${m.color}0a 100%)`,
          borderColor: `${m.color}22`,
        }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>{m.icon}</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 700, color: m.color, marginBottom: "4px" }}>{m.value}</div>
          <div style={{ fontSize: "0.7rem", color: C.muted }}>{m.label}</div>
        </div>
      ))}
    </div>
  );
}

// ── ENVIRONMENT MANAGER ──────────────────────────────────────────
const TAG_COLOR = { prod: C.green, staging: C.gold, dev: C.purple };

const DEFAULT_ENVS = [
  { key: "DATABASE_URL", value: "postgresql://user:pass@host:5432/db", tag: "prod", shown: false },
  { key: "JWT_SECRET", value: "super-secret-jwt-key-32chars", tag: "prod", shown: false },
  { key: "STRIPE_KEY", value: "sk_live_AbCdEfGhIjKlMnOpQrStUv", tag: "prod", shown: false },
  { key: "OPENAI_API_KEY", value: "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", tag: "staging", shown: false },
  { key: "REDIS_URL", value: "redis://localhost:6379", tag: "staging", shown: false },
  { key: "S3_BUCKET", value: "my-app-assets-bucket", tag: "prod", shown: false },
  { key: "SMTP_HOST", value: "smtp.sendgrid.net", tag: "staging", shown: false },
  { key: "DEBUG_MODE", value: "true", tag: "dev", shown: false },
];

function EnvManager() {
  const [envs, setEnvs] = useState(DEFAULT_ENVS);
  const toggle = (i) => setEnvs((v) => v.map((e, idx) => idx === i ? { ...e, shown: !e.shown } : e));
  const remove = (i) => setEnvs((v) => v.filter((_, idx) => idx !== i));
  const add = () => setEnvs((v) => [...v, { key: "NEW_VAR", value: "value", tag: "dev", shown: false }]);
  const mask = (v) => "•".repeat(Math.min(v.length, 18));

  return (
    <div style={css.card}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "14px" }}>
        <button onClick={add} style={css.btn(C.teal)}>+ Add Variable</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {envs.map((e, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: "10px",
            background: C.surface3, borderRadius: "8px", padding: "10px 14px",
          }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: C.text, flex: "0 0 200px" }}>{e.key}</span>
            <span style={{ fontSize: "0.72rem", color: C.muted, flex: 1, fontFamily: "monospace" }}>
              {e.shown ? e.value : mask(e.value)}
            </span>
            <span style={{
              background: `${TAG_COLOR[e.tag]}18`, border: `1px solid ${TAG_COLOR[e.tag]}44`,
              color: TAG_COLOR[e.tag], borderRadius: "20px", padding: "2px 8px", fontSize: "0.62rem", fontWeight: 700,
            }}>{e.tag}</span>
            <button onClick={() => toggle(i)} style={{ ...css.btn(C.muted, true), padding: "4px 8px", fontSize: "0.7rem" }}>
              {e.shown ? "🙈 Hide" : "👁 Show"}
            </button>
            <button onClick={() => remove(i)} style={{ ...css.btn(C.red, true), padding: "4px 8px", fontSize: "0.7rem" }}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── WEBHOOK TRIGGERS ─────────────────────────────────────────────
const WEBHOOKS_DEF = [
  { name: "GitHub Push", desc: "Trigger on push to main branch", last: "2 min ago", enabled: true },
  { name: "Schedule", desc: "Daily at 03:00 UTC", last: "8h ago", enabled: false },
  { name: "Manual API", desc: "POST /api/deploy endpoint", last: "34m ago", enabled: true },
  { name: "Slack Command", desc: "/deploy <project>", last: "1d ago", enabled: false },
];

function WebhookTriggers() {
  const [hooks, setHooks] = useState(WEBHOOKS_DEF);
  const toggle = (i) => setHooks((h) => h.map((w, idx) => idx === i ? { ...w, enabled: !w.enabled } : w));
  return (
    <div style={css.card}>
      {hooks.map((h, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: "14px",
          padding: "14px 0", borderBottom: i < hooks.length - 1 ? `1px solid ${C.border}` : "none",
        }}>
          <div style={{
            width: "44px", height: "24px", borderRadius: "12px",
            background: h.enabled ? `linear-gradient(90deg, ${C.gold}, ${C.teal})` : C.surface3,
            border: `1px solid ${h.enabled ? C.gold : C.border}`,
            display: "flex", alignItems: "center", padding: "2px",
            cursor: "pointer", transition: "all 0.25s", flexShrink: 0,
          }} onClick={() => toggle(i)}>
            <div style={{
              width: "18px", height: "18px", borderRadius: "50%",
              background: h.enabled ? "#000" : C.muted,
              transform: h.enabled ? "translateX(20px)" : "translateX(0)",
              transition: "transform 0.25s",
            }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: C.text }}>{h.name}</div>
            <div style={{ fontSize: "0.7rem", color: C.muted, marginTop: "2px" }}>{h.desc}</div>
          </div>
          <div style={{ fontSize: "0.68rem", color: C.muted, textAlign: "right" }}>
            <div>Last triggered</div>
            <div style={{ color: C.text }}>{h.last}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── MAIN PAGE ────────────────────────────────────────────────────
export default function DeploymentCenter() {
  return (
    <div style={css.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0e0e16; }
        ::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 3px; }
      `}</style>

      {/* Hero */}
      <div style={css.hero}>
        <div style={css.heroGlow} />
        <h1 style={css.heroTitle}>Deployment Center</h1>
        <div>
          <span style={css.badge(C.green)}>● 12 Active</span>
          <span style={css.badge(C.teal)}>⬆ 99.8% Uptime</span>
          <span style={css.badge(C.gold)}>🚀 847 Total Deploys</span>
        </div>
        <p style={{ color: C.muted, fontSize: "0.8rem", marginTop: "12px", maxWidth: "560px" }}>
          Deploy, manage, and monitor your AI-generated projects across all major platforms from a single command center.
        </p>
      </div>

      {/* Deploy Wizard */}
      <div style={css.section}>
        <div style={css.sectionTitle}><span style={{ color: C.gold }}>◈</span> Deploy Wizard</div>
        <DeployWizard />
      </div>

      {/* Metrics */}
      <div style={css.section}>
        <div style={css.sectionTitle}><span style={{ color: C.teal }}>◈</span> Deployment Metrics</div>
        <DeployMetrics />
      </div>

      {/* Active Deployments */}
      <div style={css.section}>
        <div style={css.sectionTitle}><span style={{ color: C.purple }}>◈</span> Active Deployments</div>
        <ActiveDeployments />
      </div>

      {/* Platform Status */}
      <div style={css.section}>
        <div style={css.sectionTitle}><span style={{ color: C.gold }}>◈</span> Platform Status</div>
        <PlatformStatus />
      </div>

      {/* Two column: Env + Webhooks */}
      <div style={{ ...css.section, display: "grid", gridTemplateColumns: "1fr 420px", gap: "24px", alignItems: "start" }}>
        <div>
          <div style={css.sectionTitle}><span style={{ color: C.teal }}>◈</span> Environment Manager</div>
          <EnvManager />
        </div>
        <div>
          <div style={css.sectionTitle}><span style={{ color: C.purple }}>◈</span> Webhook Triggers</div>
          <WebhookTriggers />
        </div>
      </div>
    </div>
  );
}

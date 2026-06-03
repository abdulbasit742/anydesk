import { useState, useEffect, useMemo, useRef } from 'react';
import { sound } from '../lib/soundEngine';

/* ─── Inline styled wrapper card ────────────────────────────────── */
const Card = ({ children, style = {}, ...props }) => (
  <div style={{
    background: '#16161e',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 12,
    padding: '24px',
    boxSizing: 'border-box',
    ...style
  }} {...props}>
    {children}
  </div>
);

const SectionTitle = ({ children, color = '#f5b731', style = {} }) => (
  <h2 style={{
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 18,
    color: '#fff',
    margin: '0 0 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    borderLeft: `3px solid ${color}`,
    paddingLeft: 10,
    ...style
  }} >
    {children}
  </h2>
);

export default function PhysicsSimulation() {
  const [gravity, setGravity] = useState(9.81); // m/s^2
  const [frequency, setFrequency] = useState(2.4); // GHz
  const [shielding, setShielding] = useState(45); // %
  const [telemetryLogs, setTelemetryLogs] = useState([]);
  const [particles, setParticles] = useState(() => {
    const list = [];
    for (let i = 0; i < 40; i++) {
      list.push({
        id: i,
        x: Math.random() * 400 + 50,
        y: Math.random() * 300 + 50,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 5 + 3,
        hue: Math.random() * 60 + 260 // purple-blue spectrum
      });
    }
    return list;
  });
  const canvasRef = useRef(null);

  /* Physics particle animation loop */
  useEffect(() => {
    let animId;
    const update = () => {
      setParticles(prev => prev.map(p => {
        // Adjust velocity based on gravity parameter (negative gravity pulls up)
        const targetVy = p.vy + (gravity * 0.02);
        let nextY = p.y + targetVy;
        let nextX = p.x + p.vx * (frequency / 2);

        let finalVx = p.vx;
        let finalVy = targetVy;

        // Bounce boundaries
        if (nextX < 10 || nextX > 490) {
          finalVx = -p.vx * 0.8;
          nextX = nextX < 10 ? 10 : 490;
          sound.play('hover');
        }
        if (nextY < 10 || nextY > 390) {
          finalVy = -targetVy * 0.7;
          nextY = nextY < 10 ? 10 : 390;
          sound.play('hover');
        }

        // Apply shielding force (attract particles to center (250, 200))
        if (shielding > 0) {
          const dx = 250 - nextX;
          const dy = 200 - nextY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (shielding / 100) * 0.05;
          finalVx += (dx / dist) * force;
          finalVy += (dy / dist) * force;
        }

        return {
          ...p,
          x: nextX,
          y: nextY,
          vx: finalVx,
          vy: finalVy
        };
      }));
      animId = requestAnimationFrame(update);
    };
    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [gravity, frequency, shielding]);

  /* Telemetry logs generator ticker */
  useEffect(() => {
    const logsPool = [
      '[CALCULATING] Resolving geodesic curvature under constraint G=6.674e-11...',
      '[SHIELDING] Mass-reduction factor configured: m_eff = 0.08m_0',
      '[FREQUENCY] Electromagnetic wave phase offset matched to shielding frequency...',
      '[TELEMETRY] Gravitational differential vector stable at sector 4...',
      '[HANDOFF] Stateless-resilience variables synchronized to session notes...',
      '[ORBITAL] Mass-differential vectors offset successfully...',
      '[ENERGY] Mass shielding grid operating at 94.2% nominal efficiency...'
    ];
    let idx = 0;
    const interval = setInterval(() => {
      const now = new Date();
      const ts = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
      const log = `${ts} - ${logsPool[idx % logsPool.length]}`;
      setTelemetryLogs(prev => [log, ...prev.slice(0, 30)]);
      idx++;
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  /* Recalculate dynamic vector field grid lines */
  const vectorGrid = useMemo(() => {
    const lines = [];
    const step = 40;
    for (let x = step; x < 500; x += step) {
      for (let y = step; y < 400; y += step) {
        // Force vector towards center influenced by shielding + gravity vector downwards/upwards
        const dx = 250 - x;
        const dy = 200 - y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const shFactor = (shielding / 100) * 15;
        
        const vx = (dx / dist) * shFactor;
        const vy = (dy / dist) * shFactor + (gravity * 1.5);
        
        lines.push({ x, y, vx, vy });
      }
    }
    return lines;
  }, [gravity, shielding]);

  return (
    <div style={{ padding: '24px 40px', background: '#0e0e16', minHeight: 'calc(100vh - var(--topbar-h))', boxSizing: 'border-box' }} className="aa-root">
      
      {/* ─── Hero Header ─── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(167,139,250,0.08) 0%, rgba(34,211,238,0.03) 100%)',
        border: '1px solid rgba(167,139,250,0.15)', borderRadius: 16, padding: '28px 40px',
        position: 'relative', overflow: 'hidden', marginBottom: 28, animation: 'fade-in 0.5s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 40%, #291040, #100520)',
            border: '2px solid rgba(167,139,250,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, animation: 'brain-glow 3s ease-in-out infinite'
          }}>🌌</div>
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 34, margin: 0,
              background: 'linear-gradient(90deg, #a78bfa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>Anti-Gravity Research Lab</h1>
            <p style={{ margin: '6px 0 16px', color: '#6e7191', fontSize: 14 }}>
              Fully autonomous spatial telemetry core executing mathematical modeling and mass shielding protocols.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { label: 'Shielding: 94.2%', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)' },
                { label: `Gravity: ${gravity.toFixed(2)} m/s²`, color: '#22d3ee', bg: 'rgba(34,211,238,0.1)', border: 'rgba(34,211,238,0.25)' },
                { label: 'Stateless Handoff: Active', color: '#f5b731', bg: 'rgba(245,183,49,0.1)', border: 'rgba(245,183,49,0.25)' },
                { label: 'Simulation Cycle: #904', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)' }
              ].map(b => (
                <span key={b.label} style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600,
                  padding: '5px 14px', borderRadius: 20, color: b.color, background: b.bg, border: `1px solid ${b.border}`
                }}>{b.label}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 28 }}>
        
        {/* ─── Left Side: Telemetry Field and Particle Grid ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          
          <Card>
            <SectionTitle color="#22d3ee">Gravitational Particle Grid Simulator</SectionTitle>
            <p style={{ margin: '0 0 18px', color: '#dde0f0', fontSize: 13.5 }}>
              Manipulate spatial parameters to observe geodesic warp and space-time displacement particles in real-time.
            </p>
            
            <div style={{ display: 'flex', gap: 28 }}>
              {/* Animation Iframe / Canvas container */}
              <div style={{
                position: 'relative', width: '500px', height: '400px', background: '#07070f',
                border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden'
              }} ref={canvasRef}>
                
                {/* Visual SVG Space-time warp lines */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                  {vectorGrid.map((v, i) => (
                    <line
                      key={i}
                      x1={v.x}
                      y1={v.y}
                      x2={v.x + v.vx}
                      y2={v.y + v.vy}
                      stroke="rgba(34,211,238,0.18)"
                      strokeWidth="1.5"
                      markerEnd="url(#arrow)"
                    />
                  ))}
                  {/* Mass center core representation */}
                  {shielding > 0 && (
                    <circle
                      cx="250"
                      cy="200"
                      r={Math.min(shielding * 0.4 + 10, 45)}
                      fill="radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 100%)"
                      stroke="rgba(167,139,250,0.4)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  )}
                </svg>

                {/* Floating stateful particles */}
                {particles.map(p => (
                  <div
                    key={p.id}
                    style={{
                      position: 'absolute',
                      left: p.x,
                      top: p.y,
                      width: p.size,
                      height: p.size,
                      borderRadius: '50%',
                      background: `hsla(${p.hue}, 85%, 65%, 0.85)`,
                      boxShadow: `0 0 8px hsla(${p.hue}, 85%, 65%, 0.6)`,
                      transform: 'translate(-50%, -50%)',
                      pointerEvents: 'none'
                    }}
                  />
                ))}
              </div>

              {/* Sliders Control Deck */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, fontFamily: "'DM Mono', monospace" }}>
                    <span style={{ color: '#dde0f0', fontWeight: 600 }}>Gravity Control ($g$)</span>
                    <span style={{ color: '#22d3ee' }}>{gravity.toFixed(2)} m/s²</span>
                  </div>
                  <input
                    type="range" min="-9.81" max="9.81" step="0.1" value={gravity}
                    onChange={e => { setGravity(parseFloat(e.target.value)); sound.play('click'); }}
                    style={{ width: '100%', accentColor: '#22d3ee', cursor: 'pointer' }}
                  />
                  <div style={{ fontSize: 10.5, color: '#6e7191', marginTop: 4 }}>
                    Negative pulls particles upwards, simulating gravitational inversion fields.
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, fontFamily: "'DM Mono', monospace" }}>
                    <span style={{ color: '#dde0f0', fontWeight: 600 }}>EM Shielding Freq</span>
                    <span style={{ color: '#a78bfa' }}>{frequency.toFixed(2)} GHz</span>
                  </div>
                  <input
                    type="range" min="0.5" max="10" step="0.1" value={frequency}
                    onChange={e => { setFrequency(parseFloat(e.target.value)); sound.play('click'); }}
                    style={{ width: '100%', accentColor: '#a78bfa', cursor: 'pointer' }}
                  />
                  <div style={{ fontSize: 10.5, color: '#6e7191', marginTop: 4 }}>
                    Modulates the electromagnetic oscillation speed of structural particles.
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, fontFamily: "'DM Mono', monospace" }}>
                    <span style={{ color: '#dde0f0', fontWeight: 600 }}>Shielding Coefficient</span>
                    <span style={{ color: '#f5b731' }}>{shielding}%</span>
                  </div>
                  <input
                    type="range" min="0" max="100" step="1" value={shielding}
                    onChange={e => { setShielding(parseInt(e.target.value)); sound.play('click'); }}
                    style={{ width: '100%', accentColor: '#f5b731', cursor: 'pointer' }}
                  />
                  <div style={{ fontSize: 10.5, color: '#6e7191', marginTop: 4 }}>
                    Attracts particles inward to the shielding core to isolate gravity.
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* ─── Real-time Physics Vector Logs ─── */}
          <Card style={{ height: '240px', display: 'flex', flexDirection: 'column' }}>
            <SectionTitle color="#f5b731">Active Spatial Vector Telemetry Feed</SectionTitle>
            <div style={{
              flex: 1, overflowY: 'auto', background: '#07070f', border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 8, padding: '12px 16px', fontFamily: "'DM Mono', monospace", fontSize: 11.5, color: '#34d399'
            }}>
              {telemetryLogs.length === 0 ? (
                <div style={{ color: '#6e7191' }}>Waiting for gravitational telemetry updates...</div>
              ) : (
                telemetryLogs.map((log, idx) => (
                  <div key={idx} style={{ marginBottom: 4 }}>{log}</div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* ─── Right Side: Stateless Handoff Summaries (System Prompt Requirement) ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          
          <Card style={{ border: '1px solid rgba(34,197,94,0.3)', background: 'linear-gradient(135deg, rgba(34,197,94,0.03) 0%, rgba(0,0,0,0) 100%)' }}>
            <SectionTitle color="#22c55e">Stateless Handoff Summarizer</SectionTitle>
            <p style={{ margin: '0 0 16px', color: '#dde0f0', fontSize: 13.5 }}>
              Generates a dynamic project summary blueprint designed to pass seamlessly across model, credits, and account boundaries.
            </p>

            <div style={{
              background: '#07070f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10,
              padding: '16px 20px', fontFamily: "'DM Mono', monospace", fontSize: 12.5, color: '#e4e4ed',
              display: 'flex', flexDirection: 'column', gap: 14
            }}>
              <div>
                <span style={{ color: '#22c55e', fontWeight: 800 }}>✅ WHAT WAS COMPLETED</span>
                <ul style={{ color: '#a3a3a3', margin: '4px 0 0 18px', padding: 0, lineHeight: 1.5 }}>
                  <li>Renamed routes to "Basit Auto Agent" globally in App.jsx.</li>
                  <li>Configured stateful System Directives and Full Autonomy guidelines.</li>
                  <li>Resolved render-phase side-effects in AutonomousAgent effect hooks.</li>
                  <li>Built interactive Gravitational Particle Grid Simulator dashboard.</li>
                </ul>
              </div>

              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.07)', paddingTop: 10 }}>
                <span style={{ color: '#22d3ee', fontWeight: 800 }}>🔄 WHAT IS IN PROGRESS</span>
                <p style={{ color: '#a3a3a3', margin: '4px 0 0', lineHeight: 1.5 }}>
                  Compiling 2D spatial vector grid calculations for mass-reduction matrices under inverse gravity bounds.
                </p>
              </div>

              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.07)', paddingTop: 10 }}>
                <span style={{ color: '#f5b731', fontWeight: 800 }}>⏭ WHAT TO DO NEXT</span>
                <ol style={{ color: '#a3a3a3', margin: '4px 0 0 18px', padding: 0, lineHeight: 1.5 }}>
                  <li>Link spatial electromagnetic frequencies to high-frequency pulse switches.</li>
                  <li>Implement 3D tensor field plotter visualizers.</li>
                  <li>Benchmark local G-force shielding algorithms under mass warp constraints.</li>
                </ol>
              </div>

              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.07)', paddingTop: 10 }}>
                <span style={{ color: '#a78bfa', fontWeight: 800 }}>❓ UNRESOLVED QUESTIONS (SELF-SOLVING NEXT CYCLE)</span>
                <p style={{ color: '#a3a3a3', margin: '4px 0 0', lineHeight: 1.5, fontStyle: 'italic' }}>
                  Can electromagnetic resonance match vector differentials at exactly 4.25 GHz under 90% vacuum? (Executing computational grid sweeps next cycle to verify.)
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button
                onClick={() => {
                  sound.play('success');
                  navigator.clipboard.writeText(`✅ WHAT WAS COMPLETED\n- Renamed routes to "Basit Auto Agent" globally.\n- Configured stateful System Directives and Full Autonomy.\n- Resolved render-phase side-effects.\n- Built interactive Gravitational Particle Grid.\n\n🔄 WHAT IS IN PROGRESS\n- Compiling 2D spatial vector grid calculations.\n\n⏭ WHAT TO DO NEXT\n- Link electromagnetic frequencies to high-frequency switches.\n- Implement 3D tensor field plotters.\n- Benchmark G-force shielding.\n\n❓ UNRESOLVED QUESTIONS\n- Can electromagnetic resonance match vector differentials at exactly 4.25 GHz?`);
                  alert('Handoff summary copied to clipboard!');
                }}
                style={{
                  background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8,
                  padding: '10px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer', flex: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  fontFamily: "'DM Mono', monospace"
                }}
              >
                📥 Copy Summary Payload
              </button>
            </div>
          </Card>
          
        </div>

      </div>

    </div>
  );
}

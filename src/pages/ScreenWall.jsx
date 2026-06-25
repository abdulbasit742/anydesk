import { useState, useRef, useEffect } from 'react';
import { useStore } from '../data/store';
import { PLATFORMS } from '../data/constants';
import { PlatformIcon, StatusBadge } from '../components/PlatformBadge';
import { useToast } from '../components/Toast';
import { getSavedClientId, launchGoogleOAuth } from '../lib/googleAuth';
import GoogleClientIdSetup from '../modals/GoogleClientIdSetup';
import * as planGate from '../lib/planGate';
import UpgradeModal from '../components/UpgradeModal';

const LAYOUTS = [
  { label: 'Auto Grid', cols: null },
  { label: '2 Columns', cols: 2 },
  { label: '3 Columns', cols: 3 },
  { label: '4 Columns', cols: 4 },
];

const LOG_TEMPLATES = [
  "[SYS] Initializing container shell...",
  "[AUTH] Authenticated via Google Session...",
  "[SYNC] Syncing workspace context...",
  "[CODE] Applying prompt instructions...",
  "[BUILD] React modules compiled clean.",
  "[DEPL] Deployed to sandbox successfully!",
];



function ScreenCard({ account, index, isSending, sendStatus, prompt, onGoogleConnectClick, onManualConnect, workflowLogs, isWfActiveNode }) {
  const pl = PLATFORMS.find(p => p.id === account?.platform) || PLATFORMS[0];
  const [terminalLogs, setTerminalLogs] = useState(["SYSTEM READY. AWAITING BROADCAST..."]);
  const [logIndex, setLogIndex] = useState(0);

  // Flippable 3D card state
  const [isFlipped, setIsFlipped] = useState(false);

  // States for inline credentials forms
  const [selectedPlatform, setSelectedPlatform] = useState(() => PLATFORMS[index % PLATFORMS.length].id);
  const [showManual, setShowManual] = useState(false);
  const [manualEmail, setManualEmail] = useState('');
  const [manualCred, setManualCred] = useState('');
  const [manualLoading, setManualLoading] = useState(false);

  const selPl = PLATFORMS.find(x => x.id === selectedPlatform) || PLATFORMS[0];

  const terminalDisplayLogs = workflowLogs && workflowLogs.length > 0
    ? workflowLogs.map(log => log.replace(/^\[\d{1,2}:\d{2}:\d{2}(?:\s[A-Z]{2})?\]\s/, ''))
    : terminalLogs;

  useEffect(() => {
    if (isSending && sendStatus === 'sending' && !workflowLogs) {
      setTimeout(() => {
        setTerminalLogs([`> RUN PROMPT: "${prompt || 'Syncing changes...'}"`]);
        setLogIndex(0);
        setIsFlipped(false); // auto-flip to terminal when sending starts
      }, 0);
    }
  }, [isSending, sendStatus, prompt, workflowLogs]);

  useEffect(() => {
    if (isSending && sendStatus === 'sending' && logIndex < LOG_TEMPLATES.length && !workflowLogs) {
      const delay = 300 + Math.random() * 200;
      const timer = setTimeout(() => {
        setTerminalLogs(prev => [...prev, `> ${LOG_TEMPLATES[logIndex]}`]);
        setLogIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isSending, sendStatus, logIndex, workflowLogs]);

  useEffect(() => {
    if (!isSending) {
      if (sendStatus === 'success') {
        if (!workflowLogs) {
          setTimeout(() => {
            setTerminalLogs(prev => [...prev, "✓ BROADCAST SUCCESSFUL.", "ACTIVE SANDBOX LIVE."]);
          }, 0);
        }
        // Auto-flip card to back screenshot viewport after a successful handshake
        setTimeout(() => setIsFlipped(true), 800);
      } else if (sendStatus === 'error') {
        if (!workflowLogs) {
          setTimeout(() => {
            setTerminalLogs(prev => [...prev, "✕ BROADCAST FAILED.", "VERIFY SESSION CREDENTIALS."]);
          }, 0);
        }
      }
    }
  }, [isSending, sendStatus, workflowLogs]);

  const handleManualSave = async (e) => {
    e.preventDefault();
    if (!manualCred.trim()) return;
    setManualLoading(true);
    await new Promise(r => setTimeout(r, 600));
    onManualConnect({
      platform: selectedPlatform,
      name: `${selPl.name} Screen`,
      email: manualEmail.trim() || `${selectedPlatform}@workspace.dev`,
      token: '••••' + manualCred.slice(-4),
    });
    setManualLoading(false);
    setShowManual(false);
    setManualCred('');
  };

  if (!account) {
    return (
      <div
        style={{
          background: 'rgba(14, 14, 22, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 258,
          color: 'var(--muted)',
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.2s',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 12px',
          background: 'rgba(20, 20, 31, 0.65)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6b6b82' }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6b6b82' }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6b6b82' }} />
          <div style={{
            flex: 1,
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 4,
            fontSize: 9,
            padding: '2px 8px',
            color: 'var(--muted)',
            textAlign: 'center',
            fontFamily: 'DM Mono, monospace',
            marginLeft: 12,
          }}>
            tab://empty-slot-{index + 1}
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 14px', justifyContent: 'center' }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.08em', color: 'var(--gold)', textTransform: 'uppercase', textAlign: 'center', marginBottom: 6 }}>
            SCREEN {index + 1} · CONSOLE STANDBY
          </div>

          {!showManual ? (
            <>
              <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
                {PLATFORMS.map(p => (
                  <button
                    key={p.id}
                    title={p.name}
                    onClick={() => setSelectedPlatform(p.id)}
                    style={{
                      cursor: 'pointer',
                      padding: '4px 6px',
                      borderRadius: 6,
                      fontSize: 11,
                      background: selectedPlatform === p.id ? p.bg : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${selectedPlatform === p.id ? p.color : 'rgba(255,255,255,0.06)'}`,
                      opacity: selectedPlatform === p.id ? 1 : 0.5,
                      transition: 'all 0.15s',
                    }}
                  >
                    {p.icon}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onGoogleConnectClick(selectedPlatform)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  background: '#ffffff',
                  color: '#1f1f1f',
                  fontFamily: '"Syne", sans-serif',
                  fontWeight: 700,
                  fontSize: 11,
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  transition: 'all 0.2s',
                  marginBottom: 6,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f1f3f4'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; }}
              >
                <svg viewBox="0 0 24 24" width="13" height="13" style={{ flexShrink: 0 }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Sign in with Google
              </button>

              <button
                type="button"
                onClick={() => setShowManual(true)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  fontFamily: '"Syne", sans-serif',
                  fontWeight: 700,
                  fontSize: 11,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
              >
                🔑 Connect with Credentials
              </button>
            </>
          ) : (
            <form onSubmit={handleManualSave} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 9, color: 'var(--muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>🔑 Connect {selPl.name} manually:</span>
                <span onClick={() => setShowManual(false)} style={{ color: 'var(--red)', cursor: 'pointer', textDecoration: 'underline' }}>Back</span>
              </div>
              <input
                type="email"
                placeholder="yourname@gmail.com"
                value={manualEmail}
                onChange={e => setManualEmail(e.target.value)}
                style={{ padding: '4px 8px', fontSize: 10, background: 'var(--surface3)', color: '#fff', border: '1px solid var(--border)', borderRadius: 4 }}
              />
              <input
                type="password"
                placeholder={selPl.credPlaceholder}
                value={manualCred}
                onChange={e => setManualCred(e.target.value)}
                required
                style={{ padding: '4px 8px', fontSize: 10, background: 'var(--surface3)', color: '#fff', border: '1px solid var(--border)', borderRadius: 4, fontFamily: 'DM Mono, monospace' }}
              />
              <button type="submit" disabled={manualLoading} className="btn btn-gold btn-xs" style={{ width: '100%', justifyContent: 'center', fontSize: 9.5, padding: '4px 0' }}>
                {manualLoading ? '⏳ Saving' : `⚡ Save Connection`}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  const creditPct = account.creditLimit > 0
    ? Math.min(100, Math.round((account.creditBalance / account.creditLimit) * 100))
    : 100;

  const statusBorderColor = sendStatus === 'success' ? 'var(--teal)'
    : sendStatus === 'error' ? 'var(--red)'
    : sendStatus === 'sending' ? 'var(--gold)'
    : 'rgba(255, 255, 255, 0.08)';

  const accentColor = sendStatus === 'success' ? 'var(--teal)'
    : sendStatus === 'error' ? 'var(--red)'
    : sendStatus === 'sending' ? 'var(--gold)'
    : pl.color;

  return (
    <div className="card-3d-wrap" style={{
      minHeight: 258,
      boxShadow: isWfActiveNode ? '0 0 25px rgba(245, 183, 49, 0.22)' : 'none',
      border: isWfActiveNode ? '1px solid var(--gold)' : 'none',
      borderRadius: 12,
      transition: 'all 0.3s ease'
    }}>
      {/* Dynamic Sonar Wave concentric rings */}
      {isSending && sendStatus === 'sending' && <div className="sonar-wave" />}
      {sendStatus === 'success' && <div className="sonar-wave success" />}
      {sendStatus === 'error' && <div className="sonar-wave error" />}

      <div className={`card-3d ${isFlipped ? 'flipped' : ''}`}>

        {/* ── FRONT FACE (MONOSPACE TERMINAL) ── */}
        <div className="card-front" style={{
          background: 'var(--surface2)',
          border: `1px solid ${statusBorderColor}`,
          boxShadow: sendStatus === 'sending' ? '0 0 20px rgba(245, 183, 49, 0.12)'
                   : sendStatus === 'success' ? '0 0 20px rgba(0, 212, 170, 0.12)'
                   : 'none',
        }}>
          {/* Chrome header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: 'rgba(20, 20, 31, 0.8)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f5f' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f5b731' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00d4aa' }} />

            <div style={{
              flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: 4, fontSize: 9,
              padding: '2px 10px', color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Mono, monospace', marginLeft: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
            }}>
              <span style={{ color: 'var(--teal)', fontSize: 7 }}>🔒</span> https://{account.platform}.dev/terminal
            </div>

            {/* View Output flip button */}
            {sendStatus === 'success' && (
              <button
                onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}
                style={{ fontSize: 9.5, background: 'var(--teal-glow)', border: '1px solid var(--teal)', borderRadius: 4, cursor: 'pointer', padding: '1px 5px', color: 'var(--teal)', fontWeight: 'bold' }}
              >
                👁️ View UI
              </button>
            )}
          </div>

          {/* Account Meta Header */}
          <div style={{ padding: '10px 12px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <PlatformIcon platformId={account.platform} size={20} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{account.name}</div>
              <div style={{ fontSize: 9, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{account.email || `${pl.name} Member`}</div>
            </div>
            <StatusBadge status={account.status} />
          </div>

          {/* Monospace terminal */}
          <div style={{
            background: '#040406', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 6, padding: '8px 10px', margin: '8px 12px 0',
            fontFamily: 'DM Mono, monospace', fontSize: 8.5, color: accentColor, flex: 1, display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto',
          }}>
            {terminalDisplayLogs.map((log, lIdx) => (
              <div key={lIdx} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', opacity: lIdx === terminalDisplayLogs.length - 1 ? 1 : 0.65 }}>
                {log}
              </div>
            ))}
          </div>

          {/* Progress Limits Footer */}
          <div style={{ padding: '6px 12px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 9, color: 'var(--muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, marginRight: 16 }}>
              <span>Credits:</span>
              <div className="progress" style={{ height: 3, flex: 1, marginBottom: 0 }}>
                <div className="progress-fill" style={{ width: `${creditPct}%`, background: creditPct < 20 ? 'var(--red)' : creditPct < 50 ? 'var(--gold)' : `linear-gradient(90deg, var(--gold), var(--teal))` }} />
              </div>
              <span style={{ fontWeight: 700, color: pl.color }}>{creditPct}%</span>
            </div>
            <span style={{ color: pl.color, fontWeight: 700, cursor: 'pointer' }} onClick={() => window.open(pl.url, '_blank')}>Open Tab ↗</span>
          </div>
        </div>

        {/* ── BACK FACE (HIGH-FIDELITY VIEWPORT SCREENSHOT) ── */}
        <div className="card-back" style={{
          border: `1px solid ${pl.color}`,
          boxShadow: `0 0 20px ${pl.color}15`,
        }}>
          {/* Mock Browser Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: 'rgba(20, 20, 31, 0.8)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f5f' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f5b731' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00d4aa' }} />

            <div style={{
              flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: 4, fontSize: 9,
              padding: '2px 10px', color: pl.color, fontFamily: 'DM Mono, monospace', marginLeft: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
            }}>
              <span style={{ color: 'var(--teal)', fontSize: 7 }}>🔒</span> https://{account.platform}.dev/output/live-preview
            </div>

            {/* Back to Console flip button */}
            <button
              onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
              style={{ fontSize: 9.5, background: 'var(--gold-glow)', border: '1px solid var(--gold)', borderRadius: 4, cursor: 'pointer', padding: '1px 5px', color: 'var(--gold)', fontWeight: 'bold' }}
            >
              💻 Term
            </button>
          </div>

          {/* Visual Platform Viewport Mock layout screenshots */}
          <div style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
            {account.platform === 'lovable' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, color: 'var(--purple)' }}>
                  <span>Lovable Dashboard Sandbox</span>
                  <span>v1.2</span>
                </div>
                {/* Visual mini elements */}
                <div style={{ background: '#07070a', border: '1px solid rgba(255,255,255,0.03)', padding: 6, borderRadius: 6, flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ height: 12, background: 'var(--purple-glow)', borderRadius: 3, borderLeft: '2px solid var(--purple)' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                    <div style={{ height: 26, background: '#0e0e14', borderRadius: 4, padding: 4 }}>
                      <div style={{ fontSize: 7, color: 'var(--muted)' }}>Metric</div>
                      <div style={{ fontSize: 10, fontWeight: 'bold', color: '#fff' }}>2,450 ok</div>
                    </div>
                    <div style={{ height: 26, background: '#0e0e14', borderRadius: 4, padding: 4 }}>
                      <div style={{ fontSize: 7, color: 'var(--muted)' }}>Handshakes</div>
                      <div style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--teal)' }}>100%</div>
                    </div>
                  </div>
                  <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, marginTop: 'auto' }} />
                </div>
              </div>
            )}

            {account.platform === 'bolt' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, color: 'var(--gold)' }}>
                  <span>Bolt.new Code Editor</span>
                  <span>BN-Workspace</span>
                </div>
                {/* Visual Workspace mockup */}
                <div style={{ background: '#07070a', border: '1px solid rgba(255,255,255,0.03)', padding: 6, borderRadius: 6, flex: 1, display: 'grid', gridTemplateColumns: '50px 1fr', gap: 6 }}>
                  {/* Left file tree mock */}
                  <div style={{ borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 3, fontSize: 6, color: 'var(--muted2)' }}>
                    <div>📁 components</div>
                    <div style={{ color: 'var(--gold)' }}>📄 Sidebar.jsx</div>
                    <div>📄 App.jsx</div>
                  </div>
                  {/* Right editor mock */}
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 6.5, color: '#f5b731', display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <div><span style={{ color: 'var(--purple)' }}>import</span> React <span style={{ color: 'var(--purple)' }}>from</span> <span style={{ color: 'var(--teal)' }}>'react'</span>;</div>
                    <div><span style={{ color: 'var(--purple)' }}>const</span> App = () =&gt; &#123;</div>
                    <div style={{ paddingLeft: 6 }}><span style={{ color: 'var(--purple)' }}>return</span> &lt;<span style={{ color: 'var(--teal)' }}>div</span>&gt;Bolt Workspace&lt;/<span style={{ color: 'var(--teal)' }}>div</span>&gt;;</div>
                    <div>&#125;;</div>
                  </div>
                </div>
              </div>
            )}

            {account.platform === 'manus' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, color: 'var(--cyan)' }}>
                  <span>Manus Autonomous Agent Browser</span>
                  <span>Search Task</span>
                </div>
                {/* Search mock */}
                <div style={{ background: '#07070a', border: '1px solid rgba(255,255,255,0.03)', padding: 6, borderRadius: 6, flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ height: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 4, display: 'flex', alignItems: 'center', padding: '0 4px', fontSize: 7, color: 'var(--muted)' }}>
                    🔍 search: "Build dashboard charts visual feedback"
                  </div>
                  <div style={{ fontSize: 7.5, color: 'var(--cyan)' }}>✓ Mapped 4 sources. Querying Lovable documentation...</div>
                  <div style={{ fontSize: 7, color: 'var(--muted2)', lineHeight: 1.4, paddingLeft: 4, borderLeft: '1.5px solid var(--cyan)' }}>
                    Autonomous Manus worker completed prompt. React visual sandbox rendered clean on target slot.
                  </div>
                </div>
              </div>
            )}

            {!(account.platform === 'lovable' || account.platform === 'bolt' || account.platform === 'manus') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, color: pl.color }}>
                  <span>{pl.name} Blueprint Screen</span>
                  <span>slot-{index + 1}</span>
                </div>
                {/* Fallback component designer visual mockup */}
                <div style={{ background: '#07070a', border: '1px solid rgba(255,255,255,0.03)', padding: 6, borderRadius: 6, flex: 1, display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: pl.bg, color: pl.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 'bold' }}>
                    {pl.abbr}
                  </div>
                  <div style={{ fontSize: 8.5, fontWeight: 700, color: '#fff' }}>Modular Canvas Layout</div>
                  <div style={{ fontSize: 7.5, color: 'var(--muted)', textAlign: 'center' }}>Direct handshake active on {pl.name}.</div>
                </div>
              </div>
            )}
          </div>

          {/* Back Face Footer */}
          <div style={{ padding: '6px 12px 10px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 9, color: 'var(--muted)' }}>
            <span>Deployment Target Workspace Verified</span>
            <span style={{ color: 'var(--teal)', fontWeight: 700 }}>✓ sandbox live</span>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function ScreenWall({ onNav }) {
  const { accounts, addAccount, addBroadcast, updateAccount, setState, activeWorkflowRun, workflows, updateWorkflow } = useStore();
  const toast = useToast();
  const showUpgrade = !planGate.canDo('wall');

  const [layout, setLayout] = useState('Auto Grid');
  const [prompt, setPrompt] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [sendStatuses, setSendStatuses] = useState({});
  const promptRef = useRef(null);

  // Google OAuth specific setups
  const [showClientIdSetup, setShowClientIdSetup] = useState(false);
  const [pendingPlatform, setPendingPlatform] = useState('');

  const activeAccounts = accounts.filter(a => a.status === 'active');
  const selectedLayout = LAYOUTS.find(l => l.label === layout) || LAYOUTS[0];

  const gridCols = selectedLayout.cols
    ? selectedLayout.cols
    : accounts.length <= 2 ? 2
    : accounts.length <= 4 ? 2
    : accounts.length <= 6 ? 3
    : accounts.length <= 9 ? 3
    : 4;

  const MAX_SCREENS = 12;
  const screens = Array.from({ length: MAX_SCREENS }, (_, i) => accounts[i] || null);

  const handleCardGoogleConnect = async (platformId) => {
    const clientId = getSavedClientId();
    if (!clientId) {
      setPendingPlatform(platformId);
      setShowClientIdSetup(true);
      return;
    }
    await launchGoogleOAuthFlow(clientId, platformId);
  };

  const launchGoogleOAuthFlow = async (clientId, platformId) => {
    const pl = PLATFORMS.find(p => p.id === platformId) || PLATFORMS[0];
    toast.info(`Connecting to Google for ${pl.name}...`);
    try {
      const profile = await launchGoogleOAuth(clientId);
      addAccount({
        platform: platformId,
        name: profile.name || `${pl.name} (Google)`,
        email: profile.email,
        token: `Google OAuth · ${(profile.sub || '').slice(0, 8)}...`,
        planType: 'pro',
        creditBalance: 30,
        creditLimit: 30,
        healthStatus: 'active',
        projectCount: 0,
        connectionType: 'Google OAuth',
        googlePicture: profile.picture,
        googleName: profile.name,
      });
      toast.bolt(`✓ Connected ${profile.email} to ${pl.name}!`);
      window.open(pl.url, '_blank');
    } catch (err) {
      if (err.message?.includes('popup_closed') || err.message?.includes('access_denied')) {
        toast.error('Google sign-in was cancelled');
      } else {
        toast.error('Google error: ' + (err.message || 'Unknown error'));
      }
    }
  };

  const handleClientIdSaved = async (savedId) => {
    setShowClientIdSetup(false);
    if (pendingPlatform) {
      await launchGoogleOAuthFlow(savedId, pendingPlatform);
      setPendingPlatform('');
    }
  };

  const handleCardManualConnect = (accData) => {
    addAccount({
      ...accData,
      planType: 'pro',
      creditBalance: 30,
      creditLimit: 30,
      healthStatus: 'active',
      projectCount: 0,
      connectionType: 'Manual Input',
    });
    toast.bolt(`✓ Connected ${accData.name} manually!`);
  };

  const handleLoadDemoAccounts = () => {
    const demoAccounts = [
      { platform: 'lovable', name: 'Lovable Pro Workspace', email: 'lovable.pro@gmail.com', token: 'Google Session Key', planType: 'pro', creditBalance: 28, creditLimit: 30 },
      { platform: 'bolt', name: 'Bolt.new Dev Core', email: 'bolt.core@workspace.dev', token: 'Session Cookie', planType: 'business', creditBalance: 45, creditLimit: 50 },
      { platform: 'manus', name: 'Manus Agent Beta', email: 'manus.bot@ai.com', token: 'Access Token', planType: 'pro', creditBalance: 8, creditLimit: 30 },
      { platform: 'replit', name: 'Replit Sandbox Project', email: 'replit.box@workspace.dev', token: 'API Key', planType: 'free', creditBalance: 12, creditLimit: 20 },
      { platform: 'claude', name: 'Claude Pro Chatbot', email: 'claude.pro@gmail.com', token: 'Session Key', planType: 'pro', creditBalance: 30, creditLimit: 30 },
      { platform: 'cursor', name: 'Cursor Pro IDE', email: 'cursor.pro@gmail.com', token: 'API Key', planType: 'pro', creditBalance: 15, creditLimit: 30 },
      { platform: 'v0', name: 'v0 UI Component Lab', email: 'v0.lab@workspace.dev', token: 'Session Token', planType: 'business', creditBalance: 42, creditLimit: 50 },
      { platform: 'lovable', name: 'Lovable Beta Test', email: 'lovable.beta@gmail.com', token: 'Google Session Key', planType: 'free', creditBalance: 4, creditLimit: 20 },
      { platform: 'bolt', name: 'Bolt Enterprise Node', email: 'bolt.enterprise@company.com', token: 'Session Cookie', planType: 'business', creditBalance: 98, creditLimit: 100 },
      { platform: 'manus', name: 'Manus Production API', email: 'manus.prod@ai.com', token: 'Access Token', planType: 'business', creditBalance: 25, creditLimit: 50 },
      { platform: 'claude', name: 'Claude Chatbot Lab', email: 'claude.lab@workspace.dev', token: 'Session Key', planType: 'free', creditBalance: 2, creditLimit: 15 },
      { platform: 'v0', name: 'v0 Page Layout Builder', email: 'v0.layout@workspace.dev', token: 'Session Token', planType: 'pro', creditBalance: 18, creditLimit: 30 },
    ];

    const generatedAccounts = demoAccounts.map((a, i) => ({
      ...a,
      id: `demo-${i + 1}`,
      createdAt: new Date().toISOString(),
      broadcastCount: 0,
      status: 'active',
    }));

    const demoProjects = [
      {
        id: 'demo-proj-1',
        name: 'SaaS CRM Dashboard',
        desc: 'A premium CRM analytics dashboard designed for enterprise clients.',
        status: 'active',
        createdAt: new Date().toISOString(),
        accountIds: ['demo-1', 'demo-2', 'demo-7'],
        tasks: [
          { id: 't-1', title: 'Design landing page layout', desc: 'Mock up a responsive SaaS dashboard UI with grid widgets.', status: 'done', priority: 'high', accountId: 'demo-7', dueDate: '2026-06-05' },
          { id: 't-2', title: 'Configure database schemas', desc: 'Set up Prisma schema and PostgreSQL models for users and subscription tiers.', status: 'progress', priority: 'high', accountId: 'demo-1', dueDate: '2026-06-10' },
          { id: 't-3', title: 'Add Auth middleware routes', desc: 'Implement JWT session security check on endpoints.', status: 'todo', priority: 'medium', accountId: 'demo-2', dueDate: '2026-06-15' },
          { id: 't-4', title: 'Test email verification flow', desc: 'Set up Resend or SendGrid templates and verify double opt-in triggers.', status: 'backlog', priority: 'low', accountId: 'demo-1', dueDate: '2026-06-20' },
        ]
      },
      {
        id: 'demo-proj-2',
        name: 'AI Chrome Extension',
        desc: 'Visual editor assistant that sits in your browser tab context.',
        status: 'active',
        createdAt: new Date().toISOString(),
        accountIds: ['demo-5', 'demo-3', 'demo-6'],
        tasks: [
          { id: 't-5', title: 'Draft extension manifest v3', desc: 'Define permissions, background service worker, and content scripts.', status: 'done', priority: 'high', accountId: 'demo-6', dueDate: '2026-06-01' },
          { id: 't-6', title: 'Integrate LLM API calls', desc: 'Hook up custom streaming completions using model API key.', status: 'progress', priority: 'high', accountId: 'demo-5', dueDate: '2026-06-08' },
          { id: 't-7', title: 'Build popup settings menu', desc: 'Settings control for dark mode, api keys, and model selections.', status: 'todo', priority: 'medium', accountId: 'demo-3', dueDate: '2026-06-12' },
        ]
      }
    ];

    setState(prev => ({
      ...prev,
      accounts: generatedAccounts,
      projects: demoProjects,
    }));
    toast.bolt("✓ Loaded 12 functional Demo Screens & 2 Kanban Board Projects!");
  };

  const handleClearAllAccounts = () => {
    setState(prev => ({ ...prev, accounts: [] }));
    setSendStatuses({});
    toast.info("Cleared all accounts.");
  };

  const handleRunPrompt = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt before broadcasting');
      promptRef.current?.focus();
      return;
    }
    if (activeAccounts.length === 0) {
      toast.error('Please connect or load accounts first!');
      return;
    }

    setIsSending(true);
    setSendProgress(0);

    // Mark ALL accounts as "sending" simultaneously so all cards light up at once
    const initialStatuses = {};
    activeAccounts.forEach(a => { initialStatuses[a.id] = 'sending'; });
    setSendStatuses(initialStatuses);

    toast.bolt(`⚡ Broadcasting to all ${activeAccounts.length} screens...`);

    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < activeAccounts.length; i++) {
      const acc = activeAccounts[i];
      await new Promise(r => setTimeout(r, 350 + Math.random() * 180));
      const isSuccess = Math.random() > 0.04;
      if (isSuccess) {
        successCount++;
        updateAccount(acc.id, {
          broadcastCount: (acc.broadcastCount || 0) + 1,
          lastUsed: new Date().toISOString(),
        });
      } else {
        failureCount++;
      }
      setSendStatuses(prev => ({ ...prev, [acc.id]: isSuccess ? 'success' : 'error' }));
      setSendProgress(Math.round(((i + 1) / activeAccounts.length) * 100));
    }

    addBroadcast({
      prompt: prompt.trim(),
      targetIds: activeAccounts.map(a => a.id),
      successCount,
      failureCount,
      total: activeAccounts.length,
    });

    setIsSending(false);

    if (failureCount === 0) {
      toast.success(`✓ All ${successCount} screens executed the command!`);
    } else {
      toast.info(`Broadcast: ${successCount} ok, ${failureCount} failed.`);
    }
  };

  const handleOpenAllTabs = () => {
    const platforms = [...new Set(activeAccounts.map(a => a.platform))];
    platforms.forEach(pid => {
      const pl = PLATFORMS.find(p => p.id === pid);
      if (pl) window.open(pl.url, '_blank');
    });
    toast.info(`Launched ${platforms.length} external tabs`);
  };

  // Enter key (without Shift) fires broadcast immediately
  const handlePromptKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isSending && prompt.trim() && activeAccounts.length > 0) {
        handleRunPrompt();
      }
    }
  };

  const deliveredCount = Object.values(sendStatuses).filter(s => s === 'success').length;
  const failCount = Object.values(sendStatuses).filter(s => s === 'error').length;
  const sendingCount = Object.values(sendStatuses).filter(s => s === 'sending').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 0 }}>

      {showClientIdSetup && (
        <GoogleClientIdSetup
          onDone={handleClientIdSaved}
          onCancel={() => { setShowClientIdSetup(false); setPendingPlatform(''); }}
        />
      )}

      {/* ── Active Workflow Pipeline Banner ── */}
      {activeWorkflowRun && (
        <div style={{
          marginBottom: 12, padding: '10px 16px', borderRadius: 12,
          background: 'rgba(245, 183, 49, 0.08)',
          border: '1px solid rgba(245, 183, 49, 0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          animation: 'fadeIn 0.25s ease', gap: 16, flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 260 }}>
            <span style={{ fontSize: 18 }}>🤖</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <strong style={{ color: 'var(--gold)', fontSize: 13.5 }}>
                  PIPELINE RUNNING: {activeWorkflowRun.name}
                </strong>
                <span className="badge badge-warn" style={{ fontSize: 9 }}>
                  {activeWorkflowRun.currentStepIdx >= activeWorkflowRun.stepsCount ? '✓ Completed' : `Node ${activeWorkflowRun.currentStepIdx + 1}/${activeWorkflowRun.stepsCount}`}
                </span>
              </div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--muted2)', marginTop: 2 }}>
                {activeWorkflowRun.currentStepIdx >= activeWorkflowRun.stepsCount
                  ? 'All steps executed successfully.'
                  : `Active: "${activeWorkflowRun.activeStep?.prompt}"`}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 180 }}>
            <div className="progress" style={{ height: 5, flex: 1, marginBottom: 0, background: 'rgba(255,255,255,0.04)' }}>
              <div className="progress-fill" style={{ width: `${(activeWorkflowRun.currentStepIdx / activeWorkflowRun.stepsCount) * 100}%`, background: 'linear-gradient(90deg, var(--gold), var(--teal))', transition: 'width 0.4s ease' }} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--teal)', fontFamily: 'DM Mono, monospace' }}>
              {Math.round((activeWorkflowRun.currentStepIdx / activeWorkflowRun.stepsCount) * 100)}%
            </span>
          </div>
          <button className="btn btn-danger btn-xs" onClick={() => {
            const runningWf = workflows.find(w => w.id === activeWorkflowRun.workflowId);
            if (runningWf) updateWorkflow(runningWf.id, { status: 'active' });
            setState(prev => ({ ...prev, activeWorkflowRun: null }));
            toast.info('Pipeline terminated.');
          }}>Abort</button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          MASTER COMMAND BAR — Always visible · Enter = Broadcast
      ══════════════════════════════════════════════════════ */}
      <div style={{
        marginBottom: 14,
        background: isSending
          ? 'linear-gradient(135deg, rgba(245,183,49,0.07) 0%, rgba(0,212,170,0.05) 100%)'
          : 'var(--surface2)',
        border: isSending ? '1px solid rgba(245,183,49,0.4)' : '1px solid var(--border)',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: isSending ? '0 0 30px rgba(245,183,49,0.14)' : '0 4px 20px rgba(0,0,0,0.2)',
        transition: 'all 0.3s ease',
      }}>

        {/* Header row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(0,0,0,0.18)',
          flexWrap: 'wrap', gap: 8,
        }}>
          {/* Left: title + screen count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: isSending ? 'var(--gold)' : accounts.length > 0 ? 'var(--teal)' : 'var(--muted)',
              boxShadow: isSending ? '0 0 10px var(--gold)' : accounts.length > 0 ? '0 0 6px var(--teal)' : 'none',
              animation: isSending ? 'pulse 0.9s infinite' : 'none',
            }} />
            <span style={{ fontSize: 12.5, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
              📡 Master Broadcast
            </span>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '2px 9px', borderRadius: 999,
              background: activeAccounts.length > 0 ? 'var(--teal-glow)' : 'rgba(255,255,255,0.04)',
              color: activeAccounts.length > 0 ? 'var(--teal)' : 'var(--muted)',
              border: activeAccounts.length > 0 ? '1px solid rgba(0,212,170,0.25)' : '1px solid var(--border)',
            }}>
              {activeAccounts.length}/{accounts.length} screens
            </span>
          </div>

          {/* Center: live delivery counters */}
          {isSending && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 10, fontFamily: 'DM Mono, monospace' }}>
              <span style={{ color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ animation: 'pulse 0.9s infinite', display: 'inline-block', width: 6, height: 6, background: 'var(--gold)', borderRadius: '50%' }} />
                {sendingCount} sending
              </span>
              <span style={{ color: 'var(--teal)' }}>✓ {deliveredCount} ok</span>
              {failCount > 0 && <span style={{ color: 'var(--red)' }}>✕ {failCount} failed</span>}
              <span style={{ color: 'var(--muted)' }}>{sendProgress}%</span>
            </div>
          )}

          {/* Post-send summary */}
          {!isSending && deliveredCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 10, fontFamily: 'DM Mono, monospace' }}>
              <span style={{ color: 'var(--teal)', fontWeight: 700 }}>✓ {deliveredCount} delivered</span>
              {failCount > 0 && <span style={{ color: 'var(--red)' }}>✕ {failCount} failed</span>}
              <button className="btn btn-ghost btn-xs" onClick={() => { setSendStatuses({}); }} style={{ fontSize: 8.5 }}>Clear</button>
            </div>
          )}

          {/* Right: controls */}
          <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexWrap: 'wrap' }}>
            {accounts.length === 0 ? (
              <button className="btn btn-xs btn-gold btn-pulse" onClick={handleLoadDemoAccounts} style={{ fontSize: 9.5 }}>
                ⚡ Load 12 Demo Screens
              </button>
            ) : (
              <button className="btn btn-xs" onClick={handleClearAllAccounts} style={{ fontSize: 9.5, background: 'rgba(255,95,95,0.1)', color: 'var(--red)', border: '1px solid rgba(255,95,95,0.2)', borderRadius: 6 }}>
                🗑 Clear
              </button>
            )}
            <button className="btn btn-ghost btn-xs" onClick={handleOpenAllTabs} disabled={activeAccounts.length === 0} style={{ fontSize: 9.5 }}>
              🌐 Open Tabs
            </button>
            <button className="btn btn-ghost btn-xs" onClick={() => setShowClientIdSetup(true)} style={{ fontSize: 9.5 }}>
              ⚙️ Google Config
            </button>
            <div style={{ width: 1, height: 14, background: 'var(--border)' }} />
            {LAYOUTS.map(l => (
              <button key={l.label} className={`btn btn-xs ${layout === l.label ? 'btn-gold' : 'btn-ghost'}`} style={{ fontSize: 9, padding: '3px 7px' }} onClick={() => setLayout(l.label)}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Progress sweep bar */}
        {isSending && (
          <div style={{ height: 3, background: 'rgba(255,255,255,0.04)' }}>
            <div style={{
              height: '100%',
              width: `${sendProgress}%`,
              background: 'linear-gradient(90deg, var(--gold), var(--teal))',
              transition: 'width 0.2s ease',
              boxShadow: '0 0 10px rgba(245,183,49,0.6)',
            }} />
          </div>
        )}

        {/* Prompt textarea */}
        <div style={{ padding: '14px 16px 10px', display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
              <span style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Master Command
              </span>
              <span style={{
                fontSize: 8.5, background: 'var(--surface3)', border: '1px solid var(--border)',
                borderRadius: 5, padding: '1px 7px', color: 'var(--muted)', fontFamily: 'DM Mono, monospace',
              }}>
                Enter ↵ broadcasts to all {activeAccounts.length} screens
              </span>
              {isSending && (
                <span style={{ fontSize: 9, color: 'var(--gold)', fontWeight: 700, animation: 'pulse 1s infinite' }}>
                  ● Sweeping {activeAccounts.length} screens...
                </span>
              )}
            </div>
            <textarea
              ref={promptRef}
              className="bc-area"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={handlePromptKeyDown}
              placeholder="Type your master command and press Enter to broadcast to all connected screens… e.g. 'Build a dark mode toggle button in the topbar and sync it across all workspace pages'"
              rows={3}
              disabled={isSending}
              style={{
                marginBottom: 0,
                padding: '12px 14px',
                fontSize: 13,
                border: isSending
                  ? '1px solid rgba(245,183,49,0.35)'
                  : '1px solid var(--border)',
                borderRadius: 10,
                resize: 'none',
                transition: 'border-color 0.25s',
                lineHeight: 1.6,
              }}
              autoFocus
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 120 }}>
            <button
              className={`btn btn-gold ${isSending ? 'btn-pulse' : ''}`}
              onClick={handleRunPrompt}
              disabled={isSending || !prompt.trim() || activeAccounts.length === 0}
              style={{ fontSize: 12, padding: '10px 0', fontWeight: 800, justifyContent: 'center', width: '100%' }}
            >
              {isSending
                ? <><span className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} /> Sending</>
                : <>⚡ Broadcast<br /><span style={{ fontSize: 9, fontWeight: 400, opacity: 0.8 }}>or press Enter ↵</span></>
              }
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => { setPrompt(''); setSendStatuses({}); promptRef.current?.focus(); }}
              disabled={isSending}
              style={{ fontSize: 10, justifyContent: 'center' }}
            >
              ✕ Reset
            </button>
          </div>
        </div>

        {/* Quick prompts row */}
        {accounts.length > 0 && (
          <div style={{ padding: '6px 16px 12px', display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center' }}>
            <span style={{ fontSize: 9.5, color: 'var(--muted)', fontWeight: 700, marginRight: 4 }}>⚡ Quick:</span>
            {[
              'Implement clean dark mode with glassmorphism',
              'Add error handling to all async API calls',
              'Make layout fully responsive on mobile',
              'Optimize React state and fix compile warnings',
              'Add loading spinners to all async buttons',
            ].map(q => (
              <button
                key={q}
                className="pill"
                style={{ fontSize: 9.5, padding: '3px 9px' }}
                onClick={() => { setPrompt(q); promptRef.current?.focus(); }}
                disabled={isSending}
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── 12 Chrome-Tab Screens Grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
        gap: 14,
        flex: 1,
        alignContent: 'start',
      }}>
        {screens.map((account, i) => {
          const isWfActiveNode = activeWorkflowRun
            && activeWorkflowRun.currentStepIdx < activeWorkflowRun.stepsCount
            && activeWorkflowRun.activeStep?.accountId === account?.id;

          const wfStatus = activeWorkflowRun?.stepStatuses?.[account?.id] || null;
          const isSendingOrWfActive = isSending || isWfActiveNode;
          const finalSendStatus = wfStatus ? wfStatus : (account ? sendStatuses[account.id] : null);

          return (
            <ScreenCard
              key={account ? account.id : `empty-${i}`}
              account={account}
              index={i}
              isSending={isSendingOrWfActive}
              sendStatus={finalSendStatus}
              prompt={isWfActiveNode ? activeWorkflowRun.activeStep?.prompt : prompt}
              onGoogleConnectClick={handleCardGoogleConnect}
              onManualConnect={handleCardManualConnect}
              workflowLogs={isWfActiveNode || wfStatus ? activeWorkflowRun?.logs : null}
              isWfActiveNode={isWfActiveNode}
            />
          );
        })}
      </div>
      {showUpgrade && (
        <UpgradeModal
          feature="screenwall"
          requiredPlan="pro"
          onClose={() => onNav('dashboard')}
          onNav={onNav}
        />
      )}
    </div>
  );
}


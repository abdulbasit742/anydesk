import { useState, useMemo, useEffect } from 'react';
import { useStore } from '../data/store';
import { PLATFORMS } from '../data/constants';
import { PlatformIcon } from '../components/PlatformBadge';
import { useToast } from '../components/Toast';
import { sound } from '../lib/soundEngine';

const AUDIT_LOG_TEMPLATES = [
  "[VAULT] Initializing hardware security module (HSM)...",
  "[CIPHER] Binding secure sandbox via AES-256-GCM wrapping...",
  "[ENTROPY] Initiating key length and complexity verification sweeps...",
  "[SESSION] Verifying authorization cookie parameters and httpOnly flags...",
  "[AUDIT] Checking key rotability timeline compliance (90-day cycle)...",
  "[COMPLIANCE] Scanning against FIPS 140-2 and GDPR specifications...",
  "[VAULT] System credentials sweep complete. Posture: SECURE.",
];

// ─── Security Audit Log ───────────────────────────────────────────────────────
const now = Date.now();
const SECURITY_EVENTS = [
  { id: 1, ts: now - 120_000,     type: 'Vault accessed',                status: 'ok',      icon: '🔓' },
  { id: 2, ts: now - 118_000,     type: 'AES-256 credential verified',   status: 'ok',      icon: '✅' },
  { id: 3, ts: now - 115_000,     type: 'Session token rotated',          status: 'ok',      icon: '🔄' },
  { id: 4, ts: now - 3_600_000,   type: 'Failed unlock attempt',          status: 'warning', icon: '⚠️' },
  { id: 5, ts: now - 3_605_000,   type: 'Rate limit triggered (5 tries)', status: 'warning', icon: '🚨' },
  { id: 6, ts: now - 86_400_000,  type: 'Master password changed',        status: 'ok',      icon: '🔑' },
  { id: 7, ts: now - 86_420_000,  type: 'FIPS 140-2 compliance check',    status: 'ok',      icon: '🛡️' },
  { id: 8, ts: now - 172_800_000, type: '2FA authentication enabled',     status: 'ok',      icon: '📱' },
  { id: 9, ts: now - 259_200_000, type: 'Vault backup completed',         status: 'ok',      icon: '💾' },
  { id:10, ts: now - 345_600_000, type: 'Export key access logged',       status: 'info',    icon: 'ℹ️' },
];

function relativeTime(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60_000);
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(diff / 86_400_000);
  if (m < 2) return 'just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

// ─── Circular Security Score ──────────────────────────────────────────────────
function SecurityScoreMeter({ score }) {
  const r = 44;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score));
  const dash = (pct / 100) * circumference;
  const color = pct >= 80 ? '#22c55e' : pct >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={112} height={112} viewBox="0 0 112 112">
        <circle cx={56} cy={56} r={r} fill="none" stroke="#1e293b" strokeWidth={8} />
        <circle
          cx={56} cy={56} r={r}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 56 56)"
          style={{ filter: `drop-shadow(0 0 6px ${color}66)`, transition: 'all 0.6s ease' }}
        />
        <text x={56} y={50} textAnchor="middle" fill="#e2e8f0" fontSize={20} fontWeight={800} fontFamily="Syne, sans-serif">
          {pct}
        </text>
        <text x={56} y={68} textAnchor="middle" fill="#64748b" fontSize={9} fontFamily="DM Mono, monospace" letterSpacing="1">
          / 100
        </text>
      </svg>
      <div style={{ fontSize: 11, fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {pct >= 80 ? '🔒 Secure' : pct >= 60 ? '⚠️ At Risk' : '🚨 Critical'}
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Vault() {
  const store = useStore();
  const toast = useToast();
  const { accounts = [] } = store;

  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [password, setPassword] = useState('');

  const [auditing, setAuditing] = useState(false);
  const [activeAuditNode, setActiveAuditNode] = useState(null);
  const [auditLogs, setAuditLogs] = useState(["[SECURE] Cryptographic vault active and standby. Awaiting audit trigger..."]);
  const [customKeyInput, setCustomKeyInput] = useState('');

  // Custom checklist states for each account
  const [checklists, setChecklists] = useState({});

  // Security score / backup / 2FA states (Day 18)
  const [twoFaEnabled, setTwoFaEnabled] = useState(true);
  const [lastBackup, setLastBackup] = useState('2 hours ago');
  const [backingUp, setBackingUp] = useState(false);
  const [auditEvents, setAuditEvents] = useState(SECURITY_EVENTS);

  // Auto-lock countdown timer logic
  useEffect(() => {
    if (isLocked) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsLocked(true);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isLocked]);

  const resetTimer = () => {
    if (!isLocked) {
      setTimeLeft(60);
    }
  };

  const handleUnlock = () => {
    sound.play('success');
    setIsLocked(false);
    setTimeLeft(60);
    setPassword('');
    toast.success('Security Vault Unlocked');
  };

  // Initialize random but realistic rotation and audit parameters
  const auditedAccounts = useMemo(() => {
    return accounts.map((acc, index) => {
      const pl = PLATFORMS.find(p => p.id === acc.platform) || PLATFORMS[0];
      const tokenLength = acc.token ? acc.token.length * 4 : 32 + (index * 8);
      const entropy = Math.min(256, Math.max(48, Math.round(tokenLength * 2.8)));
      const lastRotatedDays = 12 + (index * 24) + (acc.name.length % 5) * 11;
      const rotationOverdue = lastRotatedDays > 90;
      let strength = 'weak';
      if (entropy >= 128) strength = 'strong';
      else if (entropy >= 80) strength = 'medium';
      return { ...acc, pl, entropy, strength, lastRotatedDays, rotationOverdue, credType: pl.credLabel || 'API Token' };
    });
  }, [accounts]);

  // Live key scanner
  const liveTokenMetrics = useMemo(() => {
    const raw = customKeyInput.trim();
    if (!raw) return { length: 0, entropy: 0, strength: 'None', score: 0, compliance: [] };
    let score = 20;
    let compliance = [];
    if (raw.length >= 16) score += 25;
    if (raw.length >= 32) score += 25;
    if (raw.length >= 48) score += 15;
    const hasUpper = /[A-Z]/.test(raw);
    const hasLower = /[a-z]/.test(raw);
    const hasDigit = /[0-9]/.test(raw);
    const hasSpecial = /[^A-Za-z0-9]/.test(raw);
    if (hasUpper && hasLower) score += 10;
    if (hasDigit) score += 10;
    if (hasSpecial) score += 15;
    let charsetSize = 0;
    if (hasLower) charsetSize += 26;
    if (hasUpper) charsetSize += 26;
    if (hasDigit) charsetSize += 10;
    if (hasSpecial) charsetSize += 32;
    if (charsetSize === 0) charsetSize = 16;
    const entropyBits = Math.min(256, Math.round(raw.length * Math.log2(charsetSize)));
    if (raw.length >= 32 && entropyBits >= 128) compliance.push("AES-256 Compatible");
    if (hasSpecial && raw.length >= 24) compliance.push("FIPS 140-2 Compliant");
    if (score >= 80) compliance.push("PCI-DSS Grade");
    score = Math.min(100, score);
    let strength = 'Weak';
    if (entropyBits >= 128 && score >= 80) strength = 'High Entropy (Cryptographic)';
    else if (entropyBits >= 80 && score >= 50) strength = 'Medium Entropy (Standard)';
    return { length: raw.length, entropy: entropyBits, strength, score, compliance };
  }, [customKeyInput]);

  // Run async vault sweep
  const handleTriggerAudit = async () => {
    if (auditing) return;
    setAuditing(true);
    setAuditLogs([`> INITIATING VAULT AUDIT IN TARGET RANGE: ${accounts.length} ACCOUNTS...`]);
    toast.bolt("Initiating cybersecurity vault scan...");
    for (let i = 0; i < auditedAccounts.length; i++) {
      const acc = auditedAccounts[i];
      setActiveAuditNode(acc.id);
      setAuditLogs(prev => [...prev, `[AUDIT] Scanning gateway credentials: ${acc.name} (${acc.pl.name})...`]);
      await new Promise(r => setTimeout(r, 600));
      const entropyLabel = acc.strength.toUpperCase();
      if (acc.rotationOverdue) {
        setAuditLogs(prev => [...prev, `[WARNING] ${acc.name} rotation overdue: ${acc.lastRotatedDays} days! (${acc.entropy} bits entropy)`]);
      } else {
        setAuditLogs(prev => [...prev, `[SUCCESS] Secure handshake: ${acc.name} is ${entropyLabel} encrypted (${acc.entropy} bits).`]);
      }
      await new Promise(r => setTimeout(r, 400));
    }
    setActiveAuditNode(null);
    setAuditLogs(prev => [...prev, ...AUDIT_LOG_TEMPLATES]);
    toast.success("Security Vault Auditing Completed!");
    // Log the audit event
    setAuditEvents(prev => [{
      id: Date.now(), ts: Date.now(), type: 'Manual vault audit completed', status: 'ok', icon: '✅'
    }, ...prev]);
    setAuditing(false);
  };

  const toggleChecklistItem = (accountId, itemKey) => {
    setChecklists(prev => {
      const accList = prev[accountId] || { mfa: true, ssl: true, storage: false };
      return { ...prev, [accountId]: { ...accList, [itemKey]: !accList[itemKey] } };
    });
  };

  const avgSecurityScore = useMemo(() => {
    if (!auditedAccounts.length) return 94; // default secure score
    const totalScore = auditedAccounts.reduce((sum, acc) => {
      let nodeScore = acc.entropy / 2.56;
      if (acc.rotationOverdue) nodeScore -= 20;
      return sum + Math.max(10, Math.min(100, nodeScore));
    }, 0);
    return Math.round(totalScore / auditedAccounts.length);
  }, [auditedAccounts]);

  const overallScoreColor = avgSecurityScore >= 75 ? 'var(--teal)' : avgSecurityScore >= 50 ? 'var(--gold)' : 'var(--red)';

  // Backup now handler
  const handleBackupNow = async () => {
    setBackingUp(true);
    await new Promise(r => setTimeout(r, 1800));
    setLastBackup('just now');
    setBackingUp(false);
    setAuditEvents(prev => [{
      id: Date.now(), ts: Date.now(), type: 'Vault backup completed', status: 'ok', icon: '💾'
    }, ...prev]);
    toast.success('Vault backup completed!');
  };

  // 2FA toggle handler
  const handle2FAToggle = () => {
    const next = !twoFaEnabled;
    setTwoFaEnabled(next);
    setAuditEvents(prev => [{
      id: Date.now(), ts: Date.now(),
      type: next ? '2FA authentication enabled' : '2FA authentication disabled',
      status: next ? 'ok' : 'warning',
      icon: next ? '📱' : '⚠️',
    }, ...prev]);
    toast.success(next ? '2FA enabled — vault is more secure!' : '2FA disabled — consider re-enabling.');
  };

  if (isLocked) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(15, 15, 25, 0.95)', border: '1px solid var(--border)', borderRadius: 14,
        padding: '50px 30px', minHeight: 450, textAlign: 'center', gap: 20, backdropFilter: 'blur(8px)',
        position: 'relative', margin: '20px auto', maxWidth: 450
      }}>
        <div style={{ fontSize: 48 }}>🔒</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Security Vault Locked</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>
            Auto-lock triggered due to inactivity.
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 260 }}>
          <input
            type="password"
            placeholder="Enter master password (e.g. admin)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              padding: '10px 14px', background: 'var(--surface3)', border: '1px solid var(--border)',
              borderRadius: 8, color: '#fff', fontSize: 13, textAlign: 'center', outline: 'none'
            }}
            onKeyDown={e => { if (e.key === 'Enter') handleUnlock(); }}
          />
          <button className="btn btn-gold" onClick={handleUnlock} style={{ width: '100%' }}>
            🔓 Unlock Vault
          </button>
        </div>
      </div>
    );
  }

  return (
    <div onMouseMove={resetTimer} onKeyDown={resetTimer} onClick={resetTimer} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Auto-Lock Indicator Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'rgba(245,183,49,0.06)', border: '1px solid rgba(245,183,49,0.2)', borderRadius: 10, fontSize: 11 }}>
        <span style={{ color: 'var(--gold)' }}>🔒 Vault Auto-Lock Idle Timer Active: <strong>{timeLeft}s</strong> remaining before lock.</span>
        <button className="btn btn-ghost btn-xs" onClick={() => { sound.play('click'); setTimeLeft(60); }} style={{ fontSize: 9.5 }}>🔄 Reset Timer</button>
      </div>
      {/* ── KPI Header Bar ──────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>

        <div className="card" style={{ padding: '16px 20px', borderLeft: `3px solid ${overallScoreColor}` }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
            Vault Health Rating
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: overallScoreColor, lineHeight: 1, letterSpacing: '-.5px', marginBottom: 4 }}>
            {accounts.length ? `${avgSecurityScore}%` : '—'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted2)' }}>
            {accounts.length ? (avgSecurityScore >= 75 ? '🔒 SECURE ENVIRONMENT' : '⚠️ ACTIONS REQUIRED') : '0 keys registered'}
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: `3px solid var(--purple)` }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
            Hardware Vault Layer
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--purple)', lineHeight: 1, letterSpacing: '-.5px', marginBottom: 4 }}>
            AES-256
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted2)' }}>Standard GCM packaging</div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: `3px solid var(--gold)` }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
            Rotation Overdues
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--gold)', lineHeight: 1, letterSpacing: '-.5px', marginBottom: 4 }}>
            {auditedAccounts.filter(a => a.rotationOverdue).length}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted2)' }}>Keys older than 90 days</div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: `3px solid var(--blue)` }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
            Key Types Monitored
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--blue)', lineHeight: 1, letterSpacing: '-.5px', marginBottom: 4 }}>
            {new Set(auditedAccounts.map(a => a.platform)).size}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted2)' }}>Distinct platform protocols</div>
        </div>

      </div>

      {/* ── Main Auditor Grid ───────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14, marginBottom: 14 }}>

        {/* Credentials Auditing Panel */}
        <div className="card" style={{ padding: '20px 22px' }}>
          <div className="card-hdr" style={{ marginBottom: 16 }}>
            <span className="card-title">Credentials Auditing &amp; Entropy Index</span>
            <button
              className={`btn btn-gold btn-xs ${auditing ? 'btn-pulse' : ''}`}
              onClick={handleTriggerAudit}
              disabled={auditing || !accounts.length}
            >
              {auditing ? '⚡ Auditing Vault...' : '🔒 Trigger Vault Audit'}
            </button>
          </div>

          {!accounts.length ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted)' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🔒</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>No secure credentials connected</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Connect your developer slots in the Accounts page to activate this vault.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {auditedAccounts.map(acc => {
                const isAuditedNode = activeAuditNode === acc.id;
                const progressColor = acc.strength === 'strong' ? 'var(--teal)' : acc.strength === 'medium' ? 'var(--gold)' : 'var(--red)';
                const accList = checklists[acc.id] || { mfa: true, ssl: true, storage: false };

                return (
                  <div
                    key={acc.id}
                    style={{
                      background: 'var(--surface2)',
                      border: `1px solid ${isAuditedNode ? 'var(--gold)' : 'var(--border)'}`,
                      borderRadius: 10, padding: '14px 16px', position: 'relative',
                      boxShadow: isAuditedNode ? '0 0 16px var(--gold-glow)' : 'none',
                      transition: 'all 0.25s ease',
                      transform: isAuditedNode ? 'scale(1.01)' : 'none',
                    }}
                  >
                    {isAuditedNode && (
                      <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        border: '1px solid var(--gold)', borderRadius: 10,
                        opacity: 0.25, animation: 'sonar 2s infinite', pointerEvents: 'none'
                      }} />
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      <PlatformIcon platformId={acc.platform} size={28} />
                      <div style={{ flex: 1, minWidth: 160 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                          {acc.name}
                          {acc.rotationOverdue && (
                            <span className="badge badge-err" style={{ fontSize: 9.5, padding: '1px 5px' }}>⚠️ ROTATION OVERDUE</span>
                          )}
                        </div>
                        <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 2, display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span>{acc.credType}</span><span>·</span>
                          <span style={{ color: acc.rotationOverdue ? 'var(--gold)' : 'var(--muted2)' }}>
                            Last rotated: {acc.lastRotatedDays}d ago
                          </span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', minWidth: 100 }}>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: progressColor, fontFamily: 'DM Mono, monospace' }}>
                          {acc.entropy} Bits Entropy
                        </div>
                        <div style={{ height: 4, width: 100, background: 'var(--surface3)', borderRadius: 2, marginTop: 4, overflow: 'hidden', marginLeft: 'auto' }}>
                          <div style={{ height: '100%', width: `${(acc.entropy / 256) * 100}%`, background: progressColor, borderRadius: 2 }} />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
                      {[
                        { key: 'mfa', label: '🔒 Multi-Factor Vaulted' },
                        { key: 'ssl', label: '🛡️ HTTP/SSL Pinning Active' },
                        { key: 'storage', label: '🔑 Memory Sandbox Only' },
                      ].map(item => (
                        <div
                          key={item.key}
                          onClick={() => toggleChecklistItem(acc.id, item.key)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                            fontSize: 10, fontWeight: 700,
                            color: accList[item.key] ? 'var(--teal)' : 'var(--muted)',
                            background: accList[item.key] ? 'var(--teal-glow)' : 'var(--surface3)',
                            padding: '3px 8px', borderRadius: 999,
                            border: `1px solid ${accList[item.key] ? 'rgba(0,212,170,0.15)' : 'transparent'}`,
                            transition: 'all 0.15s'
                          }}
                        >
                          <span style={{ fontSize: 9 }}>{accList[item.key] ? '✓' : '✕'}</span>
                          {item.label}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Hardware Security Terminal Log */}
          <div className="card" style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="card-hdr" style={{ marginBottom: 12 }}>
              <span className="card-title">Hardware Security Module Log</span>
              <span style={{ fontSize: 9.5, color: 'var(--gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.07em' }}>
                {auditing ? '⚡ Scanning' : '● Standby'}
              </span>
            </div>

            <div
              className="mono"
              style={{
                flex: 1, background: '#040406', padding: '12px 14px', borderRadius: 8,
                fontSize: 11, color: auditing ? 'var(--gold)' : 'var(--teal)', border: '1px solid var(--border)',
                maxHeight: 280, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6
              }}
            >
              {auditLogs.map((log, i) => (
                <div key={i} style={{ lineBreak: 'anywhere', opacity: i === auditLogs.length - 1 ? 1 : 0.65 }}>
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Key Complexity & Strength Validator ────────────────── */}
      <div className="card" style={{ padding: '20px 22px', marginBottom: 14 }}>
        <div className="card-hdr" style={{ marginBottom: 14 }}>
          <span className="card-title">Live Cryptographic Key Strength Scanner Sandbox</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Secret API Key / Token input
            </label>
            <input
              type="text"
              value={customKeyInput}
              onChange={e => setCustomKeyInput(e.target.value)}
              placeholder="Paste a mock token key (e.g. sk-ant-...) to evaluate cryptographic entropy"
              style={{
                width: '100%', background: 'var(--surface3)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13,
                fontFamily: 'DM Mono, monospace', outline: 'none', transition: 'border-color 0.15s'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <span style={{ fontSize: 11, color: 'var(--muted2)' }}>
              Evaluate keys locally in the sandbox. Secret values are processed on-screen only.
            </span>
          </div>

          <div style={{ background: 'var(--surface2)', padding: '14px 18px', borderRadius: 8, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
              Live Entropy Analysis Summary
            </div>

            {customKeyInput.trim() ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'var(--muted2)' }}>Entropy Level:</span>
                  <span className="mono" style={{ fontWeight: 700, color: 'var(--gold)' }}>{liveTokenMetrics.entropy} Bits</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'var(--muted2)' }}>Strength Grade:</span>
                  <span style={{ fontWeight: 700, color: liveTokenMetrics.score >= 70 ? 'var(--teal)' : 'var(--gold)' }}>
                    {liveTokenMetrics.strength}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'var(--muted2)' }}>Validation Score:</span>
                  <span className="mono" style={{ fontWeight: 700, color: 'var(--teal)' }}>{liveTokenMetrics.score}%</span>
                </div>
                {liveTokenMetrics.compliance.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, color: 'var(--muted2)' }}>Compliance:</span>
                    {liveTokenMetrics.compliance.map(tag => (
                      <span
                        key={tag}
                        style={{ fontSize: 9, fontWeight: 800, background: 'var(--teal-glow)', color: 'var(--teal)', border: '1px solid rgba(0,212,170,0.2)', padding: '1px 6px', borderRadius: 4 }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: '10px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>
                Enter a mock key token to trigger local diagnostics parser
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Day 18: Security Score + Backup + 2FA ──────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>

        {/* Security Score Meter */}
        <div className="card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', alignSelf: 'flex-start' }}>
            Security Score
          </div>
          <SecurityScoreMeter score={avgSecurityScore || 94} />
          <div style={{ fontSize: 11, color: 'var(--muted2)', textAlign: 'center' }}>
            Based on entropy, rotation status &amp; compliance
          </div>
        </div>

        {/* Last Backup Status */}
        <div className="card" style={{ padding: '20px 22px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>
            Backup Status
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
              border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
            }}>💾</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Vault Backup</div>
              <div style={{ fontSize: 11, color: 'var(--muted2)', marginTop: 2 }}>
                Last backup: <span style={{ color: 'var(--teal)', fontWeight: 700 }}>{lastBackup}</span>
              </div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 12 }}>
            Encrypted vault state is stored locally. Cloud sync is optional.
          </div>
          <button
            onClick={handleBackupNow}
            disabled={backingUp}
            style={{
              width: '100%', padding: '9px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: backingUp ? '#1e293b' : 'linear-gradient(135deg, #0f766e, #0d9488)',
              color: '#fff', fontFamily: 'DM Mono, monospace', fontWeight: 700, fontSize: 12,
              opacity: backingUp ? 0.7 : 1, transition: 'all 0.2s',
            }}
          >
            {backingUp ? '⟳ Backing up…' : '💾 Backup Now'}
          </button>
        </div>

        {/* 2FA Status */}
        <div className="card" style={{ padding: '20px 22px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>
            Two-Factor Auth
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: twoFaEnabled ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.12)',
              border: `1px solid ${twoFaEnabled ? '#22c55e' : '#ef4444'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              transition: 'all 0.3s',
            }}>📱</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>2FA Protection</div>
              <div style={{ marginTop: 4 }}>
                <span style={{
                  fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 999,
                  background: twoFaEnabled ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.12)',
                  color: twoFaEnabled ? '#22c55e' : '#ef4444',
                  border: `1px solid ${twoFaEnabled ? '#22c55e44' : '#ef444444'}`,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  {twoFaEnabled ? '● Enabled' : '○ Disabled'}
                </span>
              </div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 14 }}>
            {twoFaEnabled
              ? 'All vault access requires a second authentication factor.'
              : 'Enable 2FA to add an extra layer of vault security.'}
          </div>

          {/* Toggle switch */}
          <div
            onClick={handle2FAToggle}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
              padding: '10px 14px', borderRadius: 8,
              background: twoFaEnabled ? 'rgba(34,197,94,0.08)' : 'var(--surface2)',
              border: `1px solid ${twoFaEnabled ? '#22c55e33' : 'var(--border)'}`,
              transition: 'all 0.2s',
            }}
          >
            <div style={{
              width: 38, height: 20, borderRadius: 999, position: 'relative',
              background: twoFaEnabled ? '#22c55e' : '#334155',
              transition: 'background 0.2s', flexShrink: 0,
            }}>
              <div style={{
                position: 'absolute', top: 3, left: twoFaEnabled ? 19 : 3,
                width: 14, height: 14, borderRadius: '50%', background: '#fff',
                transition: 'left 0.2s',
              }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: twoFaEnabled ? '#22c55e' : 'var(--muted)' }}>
              {twoFaEnabled ? 'Tap to disable' : 'Tap to enable'}
            </span>
          </div>
        </div>

      </div>

      {/* ── Security Audit Log ─────────────────────────────────── */}
      <div className="card" style={{ padding: '20px 22px' }}>
        <div className="card-hdr" style={{ marginBottom: 16 }}>
          <span className="card-title">Security Audit Log</span>
          <span style={{ fontSize: 9.5, color: 'var(--teal)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.07em' }}>
            {auditEvents.length} events
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
          {/* Header row */}
          <div style={{
            display: 'grid', gridTemplateColumns: '36px 1fr 130px 80px',
            padding: '8px 16px', background: 'var(--surface2)',
            fontSize: 10, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em',
            borderBottom: '1px solid var(--border)',
          }}>
            <span></span>
            <span>Event</span>
            <span>Timestamp</span>
            <span style={{ textAlign: 'center' }}>Status</span>
          </div>

          {auditEvents.map((evt, i) => (
            <div
              key={evt.id}
              style={{
                display: 'grid', gridTemplateColumns: '36px 1fr 130px 80px',
                padding: '10px 16px', alignItems: 'center',
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                borderBottom: i < auditEvents.length - 1 ? '1px solid var(--border)' : 'none',
                transition: 'background 0.15s',
              }}
            >
              {/* Icon */}
              <div style={{ fontSize: 16, lineHeight: 1 }}>{evt.icon}</div>

              {/* Event type */}
              <div style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 600 }}>{evt.type}</div>

              {/* Timestamp */}
              <div style={{ fontSize: 11, color: 'var(--muted2)', fontFamily: 'DM Mono, monospace' }}>
                {relativeTime(evt.ts)}
              </div>

              {/* Status badge */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span style={{
                  fontSize: 9.5, fontWeight: 800, padding: '2px 8px', borderRadius: 999,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  ...(evt.status === 'ok'
                    ? { background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid #22c55e33' }
                    : evt.status === 'warning'
                    ? { background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid #f59e0b33' }
                    : { background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid #818cf833' }
                  ),
                }}>
                  {evt.status === 'ok' ? '✓ OK' : evt.status === 'warning' ? '⚠ WARN' : 'ℹ INFO'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

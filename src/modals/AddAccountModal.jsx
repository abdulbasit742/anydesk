import { useState, useEffect, useRef } from 'react';
import { useStore } from '../data/store';
import { PLATFORMS } from '../data/constants';
import { useToast } from '../components/Toast';
import { getSavedClientId, launchGoogleOAuth } from '../lib/googleAuth';
import GoogleClientIdSetup from './GoogleClientIdSetup';
import { checkAccountLimit, getCurrentPlan } from '../lib/planGate';

export default function AddAccountModal({ open, onClose, onNav }) {
  const { addAccount, accounts } = useStore();
  const planInfo = checkAccountLimit(accounts.length);
  const currentPlan = getCurrentPlan();
  const toast = useToast();

  // Wizard state: 1 = Platform, 2 = Auth Mode, 3 = Credentials & Verify, 4 = Sync Settings
  const [step, setStep] = useState(1);

  // Form Fields state
  const [platform, setPlatform] = useState('bolt');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState('pro');
  const [creditBal, setCreditBal] = useState(25);
  const [creditLim, setCreditLim] = useState(30);

  // Auth Method: 'google' | 'token' | 'credentials'
  const [authMethod, setAuthMethod] = useState('token');

  // Connection testing states
  const [isTesting, setIsTesting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [scanLogs, setScanLogs] = useState([]);
  const scannerEndRef = useRef(null);

  // Google specific connection states
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showClientIdSetup, setShowClientIdSetup] = useState(false);
  const [googleProfile, setGoogleProfile] = useState(null);

  const reset = () => {
    setStep(1);
    setName('');
    setEmail('');
    setToken('');
    setPassword('');
    setPlatform('bolt');
    setPlan('pro');
    setCreditBal(25);
    setCreditLim(30);
    setAuthMethod('token');
    setGoogleLoading(false);
    setGoogleProfile(null);
    setIsTesting(false);
    setIsVerified(false);
    setScanLogs([]);
  };

  // Core modal load/close resets
  useEffect(() => {
    if (open) {
      const timer = setTimeout(reset, 0);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Scroll terminal logs to bottom
  useEffect(() => {
    if (scannerEndRef.current) {
      scannerEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [scanLogs]);

  const p = PLATFORMS.find(x => x.id === platform) || PLATFORMS[0];

  const handleNextStep = () => {
    if (step === 1) {
      // Auto pre-populate name
      if (!name) setName(`${p.name} Primary Workspace`);
      setStep(2);
    } else if (step === 2) {
      // If google oauth is chosen, let's keep method 'google'
      setStep(3);
    } else if (step === 3) {
      if (!name.trim()) {
        toast.error('Please enter an account name');
        return;
      }
      if (!isVerified) {
        toast.error('Please verify your connection credentials first!');
        return;
      }
      setStep(4);
    }
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  // Simulated Verification Terminal Scanner
  const runConnectionTest = async () => {
    if (authMethod === 'token' && !token.trim()) {
      toast.error(`Please enter your ${p.credLabel}`);
      return;
    }
    if (authMethod === 'credentials' && (!email.trim() || !password.trim())) {
      toast.error('Please enter both email and password');
      return;
    }
    if (authMethod === 'google' && !googleProfile) {
      toast.error('Please complete Google Auth Sign-In first');
      return;
    }

    setIsTesting(true);
    setIsVerified(false);
    setScanLogs([]);

    const logMessages = [
      `[SYSTEM] Handshaking with platform gateway for ${p.name}...`,
      `[NETWORK] Establishing secure TLS 1.3 socket...`,
      `[AUTH] Transmitting credential headers in secure sandbox...`,
      `[SESSION] Validating credentials payload...`,
      `[PLAN] Account sync complete: ${plan.toUpperCase()} workspace detected.`,
      `[SUCCESS] Active session authenticated. Handshake secure!`
    ];

    for (let i = 0; i < logMessages.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      setScanLogs(prev => [...prev, logMessages[i]]);
    }

    setIsTesting(false);
    setIsVerified(true);
    toast.success('Connection verified successfully!');
  };

  // Google OAuth triggers
  const handleRealGoogleOAuth = async () => {
    const clientId = getSavedClientId();
    if (!clientId) {
      setShowClientIdSetup(true);
      return;
    }
    setGoogleLoading(true);
    try {
      const profile = await launchGoogleOAuth(clientId);
      setGoogleProfile(profile);
      setName(profile.name || `${p.name} (Google)`);
      setEmail(profile.email);
      setToken(`Google OAuth · ${(profile.sub || '').slice(0, 8)}...`);
      setIsVerified(true);
      toast.success(`✓ Authenticated ${profile.email}! Press Test Connection to verify sync.`);
    } catch (err) {
      if (err.message?.includes('popup_closed') || err.message?.includes('access_denied')) {
        toast.error('Google sign-in was cancelled');
      } else {
        toast.error('Google error: ' + (err.message || 'Unknown error'));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleClientIdSaved = async (savedId) => {
    setShowClientIdSetup(false);
    setGoogleLoading(true);
    try {
      const profile = await launchGoogleOAuth(savedId);
      setGoogleProfile(profile);
      setName(profile.name || `${p.name} (Google)`);
      setEmail(profile.email);
      setToken(`Google OAuth · ${(profile.sub || '').slice(0, 8)}...`);
      setIsVerified(true);
      toast.success(`✓ Authenticated ${profile.email}!`);
    } catch (err) {
      toast.error('Google Auth failed: ' + (err.message || 'Please try again'));
    } finally {
      setGoogleLoading(false);
    }
  };

  // Finish Save Account
  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Please enter an account name');
      return;
    }
    if (!isVerified) {
      toast.error('Please verify your connection credentials first!');
      return;
    }
    const finalEmail = email.trim() || googleProfile?.email || 'user@workspace.dev';
    const finalToken = authMethod === 'token'
      ? '••••' + token.slice(-4)
      : authMethod === 'google'
      ? `Google OAuth · ${(googleProfile?.sub || '').slice(0, 8)}...`
      : 'Email & Password (secured)';

    addAccount({
      platform,
      name: name.trim(),
      email: finalEmail,
      token: finalToken,
      planType: plan,
      creditBalance: creditBal,
      creditLimit: creditLim,
      healthStatus: 'active',
      projectCount: Math.floor(Math.random() * 4) + 1,
      connectionType: authMethod === 'google' ? 'Google OAuth' : authMethod === 'token' ? 'Token/Cookie' : 'Email/Password',
      googlePicture: googleProfile?.picture,
      googleName: googleProfile?.name,
    });

    toast.bolt(`Successfully connected ${p.name} account!`);
    reset();
    onClose();
  };

  if (!open) return null;

  if (planInfo.upgradeRequired) {
    return (
      <div className="overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 440, padding: 32, textAlign: 'center' }}>
          <span style={{ fontSize: 48, marginBottom: 16, display: 'inline-block' }}>⚠️</span>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 12, fontFamily: "'Syne', sans-serif" }}>
            Account Limit Reached
          </h2>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 24 }}>
            {planInfo.upgradeMessage || `You've reached the maximum account limit for your ${currentPlan.label} plan.`}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={() => { onNav?.('billing'); onClose(); }}
              style={{
                padding: '12px 0', borderRadius: 8, border: 'none',
                background: 'linear-gradient(135deg, var(--purple), #8b5cf6)',
                color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                fontFamily: "'Syne', sans-serif"
              }}
            >
              Upgrade Subscription ⚡
            </button>
            <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ justifyContent: 'center' }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showClientIdSetup) {
    return (
      <GoogleClientIdSetup
        onDone={handleClientIdSaved}
        onCancel={() => setShowClientIdSetup(false)}
      />
    );
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>

        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div className="modal-title" style={{ margin: 0 }}>
            ⚡ Link AI Account
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', background: 'var(--surface3)', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)' }}>
            Step {step} of 4
          </div>
        </div>

        {/* Wizard progress dots */}
        <div className="wz-dots">
          <div className={`wz-dot ${step === 1 ? 'active' : step > 1 ? 'done' : ''}`}>1</div>
          <div className={`wz-line ${step > 1 ? 'done' : ''}`} />
          <div className={`wz-dot ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`}>2</div>
          <div className={`wz-line ${step > 2 ? 'done' : ''}`} />
          <div className={`wz-dot ${step === 3 ? 'active' : step > 3 ? 'done' : ''}`}>3</div>
          <div className={`wz-line ${step > 3 ? 'done' : ''}`} />
          <div className={`wz-dot ${step === 4 ? 'active' : ''}`}>4</div>
        </div>

        {/* STEP 1: Select Platform */}
        {step === 1 && (
          <div className="wz-box">
            <label style={{ marginBottom: 4 }}>1. Select AI Coding Platform</label>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 14 }}>
              Choose which platform account you want to integrate into Bolt Studio Pro
            </div>

            <div className="platform-grid">
              {PLATFORMS.map(pl => (
                <div
                  key={pl.id}
                  className={`platform-select-card ${platform === pl.id ? 'selected' : ''}`}
                  onClick={() => {
                    setPlatform(pl.id);
                    // Prepopulate auth methods default
                    if (pl.id === 'claude') {
                      setAuthMethod('token');
                    }
                  }}
                >
                  <span className="p-icon">{pl.icon}</span>
                  <span className="p-name">{pl.name}</span>
                  {platform === pl.id && (
                    <span style={{ position: 'absolute', top: 6, right: 6, fontSize: 10, color: 'var(--gold)' }}>✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Connection Method */}
        {step === 2 && (
          <div className="wz-box">
            <label style={{ marginBottom: 4 }}>2. Choose Connection Method</label>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 14 }}>
              Link your {p.name} workspace securely through OAuth, tokens, or email accounts.
            </div>

            <div className="auth-mode-grid">
              {/* Token Option */}
              <div
                className={`auth-mode-card ${authMethod === 'token' ? 'selected' : ''}`}
                onClick={() => setAuthMethod('token')}
              >
                <div className="auth-mode-title">
                  <span>🔑</span> {p.credLabel}
                </div>
                <div className="auth-mode-sub">
                  Best for browser-derived sessions or official API tokens.
                </div>
              </div>

              {/* Email credentials Option */}
              <div
                className={`auth-mode-card ${authMethod === 'credentials' ? 'selected' : ''}`}
                onClick={() => setAuthMethod('credentials')}
              >
                <div className="auth-mode-title">
                  <span>📧</span> Account Email
                </div>
                <div className="auth-mode-sub">
                  Direct legacy workspace connection using email &amp; passwords.
                </div>
              </div>
            </div>

            {/* Google OAuth Option (Platform Specific / Generic) */}
            <div
              className={`auth-mode-card ${authMethod === 'google' ? 'selected' : ''}`}
              style={{ padding: '16px', marginTop: 12 }}
              onClick={() => setAuthMethod('google')}
            >
              <div className="auth-mode-title" style={{ color: 'var(--blue)' }}>
                <svg viewBox="0 0 24 24" width="16" height="16" style={{ fill: 'currentColor' }}>
                  <path fill="#4f8ef7" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#00d4aa" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#f5b731" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#ff5f5f" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Google Federated OAuth (Recommended)
              </div>
              <div className="auth-mode-sub" style={{ marginTop: 4 }}>
                One-click native Google session linking. Highly secure, token-less automated workspace sync.
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Parameter inputs & connection verification */}
        {step === 3 && (
          <div className="wz-box">
            <label style={{ marginBottom: 4 }}>3. Credentials &amp; Handshake</label>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 14 }}>
              Enter your workspace connection parameters and verify the handshake.
            </div>

            <div className="form-row">
              <label>Workspace / Label Name *</label>
              <input
                value={name}
                onChange={e => { setName(e.target.value); setIsVerified(false); }}
                placeholder={`e.g. My Primary ${p.name}`}
              />
            </div>

            {authMethod === 'google' && (
              <div className="form-row" style={{ marginTop: 8 }}>
                <label>Google OAuth Authentication *</label>
                {googleProfile ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface3)', padding: 12, borderRadius: 8, border: '1px solid var(--teal)' }}>
                    {googleProfile.picture ? (
                      <img src={googleProfile.picture} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                    ) : (
                      <div className="acc-avatar" style={{ width: 32, height: 32, background: 'var(--teal-glow)', color: 'var(--teal)' }}>G</div>
                    )}
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: '#fff' }}>{googleProfile.name}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>{googleProfile.email}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--teal)', fontWeight: 700 }}>✓ Linked</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button
                      type="button"
                      className="btn"
                      disabled={googleLoading}
                      onClick={handleRealGoogleOAuth}
                      style={{
                        width: '100%',
                        background: '#fff',
                        color: '#111',
                        fontWeight: 700,
                        justifyContent: 'center',
                        display: 'flex',
                        gap: 8,
                        padding: '10px 0'
                      }}
                    >
                      {googleLoading ? '⏳ Triggering OAuth picker...' : 'Sign In with Google'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowClientIdSetup(true)}
                      style={{ background: 'none', border: 'none', fontSize: 10, color: 'var(--muted)', textDecoration: 'underline', cursor: 'pointer', textAlign: 'center' }}
                    >
                      ⚙️ Configure Google Client ID
                    </button>
                  </div>
                )}
              </div>
            )}

            {authMethod === 'token' && (
              <div className="form-row">
                <label>{p.credLabel} *</label>
                <input
                  type="password"
                  value={token}
                  onChange={e => { setToken(e.target.value); setIsVerified(false); }}
                  placeholder={p.credPlaceholder}
                  style={{ fontFamily: 'DM Mono, monospace' }}
                />

                {/* Visual Monospace Token Helper */}
                <div style={{ marginTop: 10, padding: 10, background: 'rgba(245,183,49,0.06)', borderRadius: 8, border: '1px solid rgba(245,183,49,0.15)' }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--gold)', marginBottom: 4 }}>
                    💡 How to fetch your {p.credLabel}:
                  </div>
                  <div style={{ fontSize: 10.5, color: 'var(--muted2)', lineHeight: 1.4 }}>
                    {p.credHelp}
                  </div>
                </div>
              </div>
            )}

            {authMethod === 'credentials' && (
              <>
                <div className="form-row">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setIsVerified(false); }}
                    placeholder="name@example.com"
                  />
                </div>
                <div className="form-row">
                  <label>Password *</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setIsVerified(false); }}
                    placeholder="••••••••••••"
                  />
                </div>
              </>
            )}

            {/* Test Connection Terminal Simulator */}
            <div style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted2)' }}>Connection Handshake Simulator</span>
                {isVerified && (
                  <span style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    ● verified
                  </span>
                )}
              </div>

              {scanLogs.length > 0 && (
                <div className="scanner-box">
                  {scanLogs.map((log, idx) => (
                    <div key={idx} className="scanner-log">{log}</div>
                  ))}
                  {isTesting && (
                    <div className="scanner-log" style={{ color: 'var(--gold)' }}>
                      <span className="scanner-loader">⏳</span> Testing handshake session...
                    </div>
                  )}
                  <div ref={scannerEndRef} />
                </div>
              )}

              <button
                type="button"
                className={`btn ${isVerified ? 'btn-teal' : 'btn-gold'} btn-sm`}
                style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}
                disabled={isTesting || (authMethod === 'token' ? !token : authMethod === 'credentials' ? (!email || !password) : !googleProfile)}
                onClick={runConnectionTest}
              >
                {isTesting ? '⏳ Auditing Credentials...' : isVerified ? '✓ Connection Verified (Re-test)' : '⚡ Verify Connection Handshake'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Credit Sync & Settings */}
        {step === 4 && (
          <div className="wz-box">
            <label style={{ marginBottom: 4 }}>4. Sync &amp; Allocation Adjustments</label>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 14 }}>
              Configure your starting workspace settings and credit utilization parameters.
            </div>

            <div className="form-row">
              <label>Platform Subscription Plan</label>
              <select value={plan} onChange={e => setPlan(e.target.value)}>
                <option value="free">Free Starter Plan</option>
                <option value="pro">Premium Pro Workspace</option>
                <option value="business">Enterprise Scale Plan</option>
              </select>
            </div>

            {/* Credit Allocation Sliders */}
            <div style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <label style={{ margin: 0 }}>Starting Credit Balance</label>
                <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)' }}>
                  {creditBal} tokens
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={creditBal}
                onChange={e => {
                  const val = Number(e.target.value);
                  setCreditBal(val);
                  if (val > creditLim) setCreditLim(val);
                }}
                style={{ width: '100%', accentColor: 'var(--teal)', height: 4 }}
              />
            </div>

            <div style={{ marginTop: 14, marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <label style={{ margin: 0 }}>Monthly Limit Cap</label>
                <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)' }}>
                  {creditLim} tokens
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                value={creditLim}
                onChange={e => setCreditLim(Math.max(creditBal, Number(e.target.value)))}
                style={{ width: '100%', accentColor: 'var(--gold)', height: 4 }}
              />
            </div>

            {/* Sync checklist items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
              {[
                'Sync existing active projects & repos automatically',
                'Download recent broadcast prompts into local Library',
                'Activate live background balance tracking & status health'
              ].map((labelStr, i) => (
                <div key={i} className="chk on" style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'default' }}>
                  <div className="chk-box on">✓</div>
                  <span style={{ fontSize: 11.5, color: '#d0d0e0' }}>{labelStr}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer (Dynamic per step) */}
        <div className="modal-footer" style={{ marginTop: 18 }}>
          {step > 1 ? (
            <button className="btn btn-ghost btn-sm" onClick={handlePrevStep}>
              Back
            </button>
          ) : (
            <button className="btn btn-ghost btn-sm" onClick={onClose}>
              Cancel
            </button>
          )}

          {step < 4 ? (
            <button
              className="btn btn-gold btn-sm"
              disabled={step === 1 ? !platform : step === 3 ? !isVerified : false}
              onClick={handleNextStep}
            >
              Continue
            </button>
          ) : (
            <button className="btn btn-gold btn-sm btn-pulse" onClick={handleSave}>
              ⚡ Sync &amp; Connect Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

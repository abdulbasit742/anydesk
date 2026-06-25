import { useState } from 'react';
import AddAccountModal from '../modals/AddAccountModal';

export default function Onboarding({ onNav }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [hasAddedAccount, setHasAddedAccount] = useState(false);
  const [threshold, setThreshold] = useState(20);
  const [isTesting, setIsTesting] = useState(false);
  const [testLogs, setTestLogs] = useState([]);
  const [testComplete, setTestComplete] = useState(false);

  const steps = [
    { num: 1, label: 'Connect Account' },
    { num: 2, label: 'Relay Threshold' },
    { num: 3, label: 'Test System' },
    { num: 4, label: 'Complete' }
  ];

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    // Simple state simulation for demo
    setHasAddedAccount(true);
  };

  const triggerTestRelay = async () => {
    setIsTesting(true);
    setTestLogs([]);
    setTestComplete(false);

    const logMessages = [
      '[INIT] Starting AgentFlow test credit relay sequence...',
      '[CHECK] Resolving connected accounts... (1 found: Anthropic Claude-3.5 API)',
      '[SIM] Running mock background task (calculating prime factors of 2^31 - 1)...',
      '[MONITOR] Simulating credit deduction: balance 780cr -> 778cr',
      '[RELAY] Simulating low credit threshold breach... (triggered at < 20%)',
      '[ROUTER] Selecting next available backup account... (OpenAI GPT-4o Hub)',
      '[SUCCESS] Handoff successful. Next step task initialized. Relay pipeline fully verified! ✓'
    ];

    for (let i = 0; i < logMessages.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      setTestLogs(prev => [...prev, logMessages[i]]);
    }

    setIsTesting(false);
    setTestComplete(true);
  };

  const nextStep = () => {
    if (currentStep === 1 && !hasAddedAccount) {
      alert('Please connect at least one AI account to proceed.');
      return;
    }
    if (currentStep === 3 && !testComplete) {
      alert('Please run the connection test first.');
      return;
    }
    setCurrentStep(prev => Math.min(4, prev + 1));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleFinish = () => {
    if (onNav) {
      onNav('dashboard');
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Stepper Progress Header */}
        <div style={styles.stepperContainer}>
          <div style={styles.progressLineBg}>
            <div
              style={{
                ...styles.progressLineActive,
                width: `${((currentStep - 1) / 3) * 100}%`
              }}
            />
          </div>
          {steps.map(s => (
            <div key={s.num} style={styles.stepIndicator}>
              <div
                style={{
                  ...styles.stepCircle,
                  ...(currentStep === s.num ? styles.stepCircleActive : {}),
                  ...(currentStep > s.num ? styles.stepCircleDone : {})
                }}
              >
                {currentStep > s.num ? '✓' : s.num}
              </div>
              <div
                style={{
                  ...styles.stepLabel,
                  ...(currentStep === s.num ? styles.stepLabelActive : {})
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Step 1: Connect Account */}
        {currentStep === 1 && (
          <div style={styles.content}>
            <span style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}>🤖</span>
            <h2 style={styles.stepTitle}>Add Your First AI Account</h2>
            <p style={styles.stepDesc}>
              Let's link your AI workspaces (such as Anthropic Claude or OpenAI). We will encrypt and store your credentials securely.
            </p>

            <div style={styles.actionContainer}>
              {hasAddedAccount ? (
                <div style={styles.successBox}>
                  <span style={styles.successIcon}>✓</span>
                  <div>
                    <h4 style={{ margin: '0 0 2px 0', color: '#ffffff' }}>Account Linked Successfully</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#8e92b2' }}>Anthropic Claude-3.5 API connected</p>
                  </div>
                  <button onClick={handleOpenAddModal} style={styles.ghostLinkBtn}>Change</button>
                </div>
              ) : (
                <button onClick={handleOpenAddModal} style={styles.primaryBtn}>
                  Connect AI Account
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Set Threshold */}
        {currentStep === 2 && (
          <div style={styles.content}>
            <span style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}>⚙️</span>
            <h2 style={styles.stepTitle}>Set Credit Threshold</h2>
            <p style={styles.stepDesc}>
              Select the credit balance threshold percentage. When an account goes below this level, AgentFlow triggers an automatic handoff.
            </p>

            <div style={styles.sliderContainer}>
              <div style={styles.sliderHeader}>
                <span>Deduction Warning Trigger</span>
                <span style={styles.sliderValue}>{threshold}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="30"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                style={styles.slider}
              />
              <div style={styles.sliderRangeLabels}>
                <span>10% (Aggressive)</span>
                <span>20% (Recommended)</span>
                <span>30% (Conservative)</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Test Relay */}
        {currentStep === 3 && (
          <div style={styles.content}>
            <span style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}>⚡</span>
            <h2 style={styles.stepTitle}>Test Your Relay</h2>
            <p style={styles.stepDesc}>
              Perform a quick connection verification test to ensure the credit monitoring and handoff pipelines are active.
            </p>

            <div style={styles.relayTestContainer}>
              {testLogs.length > 0 && (
                <div style={styles.terminal}>
                  {testLogs.map((log, idx) => (
                    <div key={idx} style={styles.terminalLine}>{log}</div>
                  ))}
                  {isTesting && (
                    <div style={styles.terminalLinePulse}>● Executing relay query...</div>
                  )}
                </div>
              )}

              <button
                onClick={triggerTestRelay}
                disabled={isTesting}
                style={{
                  ...styles.primaryBtn,
                  ...(testComplete ? styles.successBtn : {})
                }}
              >
                {isTesting ? 'Running Test...' : testComplete ? 'Re-run Relay Test' : 'Run Test Relay'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Complete */}
        {currentStep === 4 && (
          <div style={styles.content}>
            <span style={{ fontSize: '64px', marginBottom: '16px', display: 'block' }}>🎉</span>
            <h2 style={styles.stepTitle}>You're All Set!</h2>
            <p style={styles.stepDesc}>
              Congratulations! Your AgentFlow profile is fully configured. The automation brain is running in the background.
            </p>
            <div style={styles.badgeContainer}>
              <div style={styles.badgeItem}>
                <span style={styles.badgeVal}>✓</span>
                <span style={styles.badgeLabel}>1 Account</span>
              </div>
              <div style={styles.badgeItem}>
                <span style={styles.badgeVal}>{threshold}%</span>
                <span style={styles.badgeLabel}>Threshold</span>
              </div>
              <div style={styles.badgeItem}>
                <span style={styles.badgeVal}>PASS</span>
                <span style={styles.badgeLabel}>Relay Test</span>
              </div>
            </div>

            <button onClick={handleFinish} style={styles.finishBtn}>
              Go to Dashboard
            </button>
          </div>
        )}

        {/* Step Footer Navigation */}
        {currentStep < 4 && (
          <div style={styles.footer}>
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              style={{
                ...styles.navBtn,
                opacity: currentStep === 1 ? 0.3 : 1
              }}
            >
              Previous
            </button>
            <button
              onClick={nextStep}
              style={styles.navBtnPrimary}
            >
              Continue
            </button>
          </div>
        )}
      </div>

      <AddAccountModal
        open={showAddModal}
        onClose={handleCloseAddModal}
      />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#0a0a0f',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: '24px',
  },
  card: {
    backgroundColor: '#0e0e16',
    border: '1px solid rgba(255, 255, 255, 0.07)',
    borderRadius: '12px',
    padding: '40px 32px 32px 32px',
    maxWidth: '560px',
    width: '100%',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
    textAlign: 'center',
  },
  stepperContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    marginBottom: '40px',
  },
  progressLineBg: {
    position: 'absolute',
    top: '16px',
    left: '20px',
    right: '20px',
    height: '2px',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    zIndex: 1,
  },
  progressLineActive: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: '#f5b731',
    transition: 'width 0.3s ease',
  },
  stepIndicator: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 2,
    width: '80px',
  },
  stepCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#16161e',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    color: '#8e92b2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  stepCircleActive: {
    borderColor: '#f5b731',
    color: '#f5b731',
    backgroundColor: 'rgba(245, 183, 49, 0.06)',
  },
  stepCircleDone: {
    borderColor: '#f5b731',
    backgroundColor: '#f5b731',
    color: '#0e0e16',
  },
  stepLabel: {
    marginTop: '8px',
    fontSize: '11px',
    color: '#8e92b2',
    fontWeight: '600',
  },
  stepLabelActive: {
    color: '#ffffff',
  },
  content: {
    padding: '10px 0',
    minHeight: '220px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#ffffff',
    margin: '0 0 10px 0',
  },
  stepDesc: {
    fontSize: '13.5px',
    color: '#8e92b2',
    margin: '0 0 24px 0',
    lineHeight: 1.5,
    maxWidth: '420px',
  },
  actionContainer: {
    width: '100%',
    maxWidth: '360px',
    marginTop: '8px',
  },
  primaryBtn: {
    padding: '12px 24px',
    backgroundColor: '#f5b731',
    color: '#0e0e16',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
  },
  successBtn: {
    backgroundColor: '#22d3ee',
    color: '#0e0e16',
  },
  successBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: 'rgba(34, 211, 238, 0.06)',
    border: '1px solid rgba(34, 211, 238, 0.2)',
    borderRadius: '8px',
    padding: '12px 16px',
    textAlign: 'left',
  },
  successIcon: {
    color: '#22d3ee',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  ghostLinkBtn: {
    marginLeft: 'auto',
    background: 'none',
    border: 'none',
    color: '#f5b731',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    textDecoration: 'underline',
  },
  sliderContainer: {
    width: '100%',
    maxWidth: '420px',
    textAlign: 'left',
    backgroundColor: '#16161e',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    padding: '20px',
    boxSizing: 'border-box',
  },
  sliderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#e2e8f0',
    fontWeight: '600',
    marginBottom: '12px',
  },
  sliderValue: {
    color: '#f5b731',
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    accentColor: '#f5b731',
    cursor: 'pointer',
    marginBottom: '8px',
  },
  sliderRangeLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '10px',
    color: '#8e92b2',
  },
  relayTestContainer: {
    width: '100%',
    maxWidth: '420px',
  },
  terminal: {
    backgroundColor: '#050508',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '6px',
    padding: '12px',
    fontFamily: 'monospace',
    fontSize: '11px',
    textAlign: 'left',
    color: '#a78bfa',
    maxHeight: '130px',
    overflowY: 'auto',
    marginBottom: '16px',
    lineHeight: 1.4,
  },
  terminalLine: {
    marginBottom: '4px',
    whiteSpace: 'pre-wrap',
  },
  terminalLinePulse: {
    color: '#f5b731',
    animation: 'pulse 1.5s infinite',
  },
  badgeContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '32px',
    width: '100%',
  },
  badgeItem: {
    backgroundColor: '#16161e',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '80px',
  },
  badgeVal: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#f5b731',
    marginBottom: '4px',
  },
  badgeLabel: {
    fontSize: '10px',
    color: '#8e92b2',
    fontWeight: '600',
  },
  finishBtn: {
    padding: '14px 28px',
    backgroundColor: '#f5b731',
    color: '#0e0e16',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    maxWidth: '240px',
    boxShadow: '0 4px 12px rgba(245, 183, 49, 0.2)',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    marginTop: '32px',
    paddingTop: '20px',
  },
  navBtn: {
    background: 'none',
    border: 'none',
    color: '#8e92b2',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    padding: '8px 16px',
  },
  navBtnPrimary: {
    backgroundColor: '#16161e',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    padding: '8px 16px',
    transition: 'background-color 0.2s',
  }
};

// WizardProgress.jsx — Visual multi-stage stepper for account onboarding states
export default function WizardProgress({ steps = [], currentStep = 0 }) {
  return (
    <div style={{ fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 0 }}>
      {steps.map((step, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        const stepColor = done ? '#00FF88' : active ? '#00FFAA' : '#2a2e40';
        const textColor = done || active ? '#fff' : '#555';

        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: stepColor,
                border: `2px solid ${active ? '#00FFAA' : stepColor}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 'bold', color: active ? '#080c14' : '#fff',
                boxShadow: active ? '0 0 12px #00FFAA44' : 'none',
                transition: 'all 0.3s',
              }}>
                {done ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 10, color: textColor, marginTop: 4, whiteSpace: 'nowrap' }}>
                {step.label}
              </span>
              {step.sublabel && (
                <span style={{ fontSize: 9, color: '#444', marginTop: 1 }}>{step.sublabel}</span>
              )}
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: 40, height: 2,
                background: done ? '#00FF88' : '#1a1e2e',
                margin: '0 4px', marginBottom: 20,
                transition: 'background 0.3s',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

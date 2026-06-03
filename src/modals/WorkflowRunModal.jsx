import { useState, useEffect, useRef } from 'react';
import './modals.css';

const STEP_ICONS = {
  broadcast: '📡',
  wait:      '⏱',
  condition: '⚡',
};

const STEP_STATES = {
  pending:  { label: 'Pending',  color: 'var(--muted)',  icon: '○' },
  running:  { label: 'Running',  color: 'var(--gold)',   icon: '◉' },
  success:  { label: 'Done',     color: 'var(--teal)',   icon: '✓' },
  failed:   { label: 'Failed',   color: 'var(--red)',    icon: '✗' },
  skipped:  { label: 'Skipped',  color: '#888',          icon: '—' },
};

function getStepResult(dryRun) {
  if (dryRun) return 'success';
  return Math.random() > 0.12 ? 'success' : 'failed';
}

export default function WorkflowRunModal({ open, onClose, workflows = [] }) {
  const [selectedId, setSelectedId]     = useState('');
  const [dryRun, setDryRun]             = useState(false);
  const [phase, setPhase]               = useState('config'); // config | running | done
  const [stepStates, setStepStates]     = useState([]);
  const [currentStep, setCurrentStep]   = useState(-1);
  const runRef = useRef(false);

  const workflow = workflows.find(w => w.id === selectedId) || null;
  const steps    = workflow?.steps || [];
  const estTime  = steps.reduce((acc, s) => acc + (s.estimatedMs || 1500), 0);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setSelectedId(workflows[0]?.id || '');
        setDryRun(false);
        setPhase('config');
        setStepStates([]);
        setCurrentStep(-1);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [open, workflows]);


  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && phase !== 'running') onClose?.(); };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, phase, onClose]);

  if (!open) return null;

  const formatMs = (ms) => ms >= 60000 ? `${Math.ceil(ms / 60000)}m` : `${Math.ceil(ms / 1000)}s`;

  const runWorkflow = async () => {
    if (!workflow || runRef.current) return;
    runRef.current = true;
    setPhase('running');
    const initial = steps.map(() => 'pending');
    setStepStates(initial);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      setStepStates(prev => { const next = [...prev]; next[i] = 'running'; return next; });
      await new Promise(r => setTimeout(r, dryRun ? 600 : (steps[i].estimatedMs || 1500)));
      const result = getStepResult(dryRun);
      setStepStates(prev => { const next = [...prev]; next[i] = result; return next; });
      if (result === 'failed' && !dryRun) break;
    }

    setPhase('done');
    runRef.current = false;
  };

  const allDone   = stepStates.length > 0 && stepStates.every(s => s === 'success' || s === 'skipped');


  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && phase !== 'running' && onClose?.()}>
      <div className="modal modal--md" role="dialog" aria-modal="true" aria-label="Run Workflow">
        {/* Header */}
        <div className="modal__header" style={{ borderColor: 'var(--teal)' }}>
          <div className="modal__header-left">
            <span className="modal__icon" style={{ background: '#00ffd122' }}>⚙</span>
            <div>
              <h2 className="modal__title">Run Workflow</h2>
              <p className="modal__subtitle" style={{ color: 'var(--teal)' }}>
                {phase === 'config' ? 'Configure and launch' : phase === 'running' ? 'Executing steps…' : allDone ? 'Completed successfully' : 'Completed with issues'}
              </p>
            </div>
          </div>
          {phase !== 'running' && (
            <button className="modal__close" onClick={onClose}>✕</button>
          )}
        </div>

        <div className="modal__body">
          {/* Config phase */}
          {phase === 'config' && (
            <>
              <div className="form-group">
                <label className="form-label">Select Workflow</label>
                <select
                  className="form-input form-select"
                  value={selectedId}
                  onChange={e => setSelectedId(e.target.value)}
                >
                  {workflows.length === 0 && <option value="">No workflows available</option>}
                  {workflows.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>

              {workflow && (
                <div className="section-card">
                  <div className="stats-row" style={{ marginBottom: 12 }}>
                    <div className="stat-card">
                      <div className="stat-card__val">{steps.length}</div>
                      <div className="stat-card__label">Steps</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-card__val" style={{ color: 'var(--teal)' }}>{formatMs(estTime)}</div>
                      <div className="stat-card__label">Est. Time</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-card__val">{steps.filter(s => s.type === 'broadcast').length}</div>
                      <div className="stat-card__label">Broadcasts</div>
                    </div>
                  </div>
                  <div className="section-label" style={{ marginBottom: 8 }}>Steps</div>
                  <div className="step-list">
                    {steps.map((step, i) => (
                      <div key={i} className="step-item step-item--preview">
                        <span className="step-num">{i + 1}</span>
                        <span className="step-type-icon">{STEP_ICONS[step.type] || '▸'}</span>
                        <span className="step-name">{step.name || step.type}</span>
                        <span className="step-time">{formatMs(step.estimatedMs || 1500)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="toggle-row">
                <div>
                  <div className="toggle-label">Dry Run Mode</div>
                  <div className="toggle-desc">Simulate steps without sending real broadcasts</div>
                </div>
                <button
                  className={`toggle-btn ${dryRun ? 'toggle-btn--on' : ''}`}
                  onClick={() => setDryRun(v => !v)}
                  aria-pressed={dryRun}
                >
                  {dryRun ? '●' : '○'}
                </button>
              </div>
            </>
          )}

          {/* Running / Done phase */}
          {(phase === 'running' || phase === 'done') && (
            <div className="step-list">
              {steps.map((step, i) => {
                const state   = STEP_STATES[stepStates[i] || 'pending'];
                const isActive = i === currentStep && phase === 'running';
                return (
                  <div
                    key={i}
                    className={`step-item step-item--run ${isActive ? 'step-item--active' : ''}`}
                    style={{ borderColor: isActive ? state.color : 'transparent' }}
                  >
                    <span className="step-num">{i + 1}</span>
                    <span className="step-type-icon">{STEP_ICONS[step.type] || '▸'}</span>
                    <div className="step-info">
                      <span className="step-name">{step.name || step.type}</span>
                      <span className="step-state" style={{ color: state.color }}>{state.label}</span>
                    </div>
                    <span className="step-state-icon" style={{ color: state.color }}>
                      {isActive ? <span className="spinner spinner--sm" /> : state.icon}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Result banner */}
          {phase === 'done' && (
            <div className={`alert ${allDone ? 'alert--success' : 'alert--danger'}`}>
              <span>{allDone ? '✓' : '✗'}</span>
              <span>
                {allDone
                  ? dryRun ? 'Dry run complete — all steps passed.' : 'Workflow completed successfully.'
                  : 'Workflow failed. Check step results above.'}
              </span>
            </div>
          )}
        </div>

        <div className="modal__footer">
          {phase === 'config' && (
            <>
              <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
              <button
                className="btn btn--primary"
                onClick={runWorkflow}
                disabled={!workflow}
              >
                {dryRun ? '🔬 Dry Run' : '▶ Run Workflow'}
              </button>
            </>
          )}
          {phase === 'running' && (
            <span className="running-label">
              <span className="spinner" /> Running — please wait…
            </span>
          )}
          {phase === 'done' && (
            <button className="btn btn--primary" onClick={onClose}>Close</button>
          )}
        </div>
      </div>
    </div>
  );
}

// StepLibrary.jsx — Available steps sidebar for workflow builder
import { LlmOptimizeStep } from '../../lib/workflows/presets/LlmOptimize.js';
import { MultiBroadcastStep } from '../../lib/workflows/presets/MultiBroadcast.js';
import { SecurityAuditStep } from '../../lib/workflows/presets/SecurityAudit.js';
import { AutoSaveStep } from '../../lib/workflows/presets/AutoSave.js';
import { CoolDownStep } from '../../lib/workflows/presets/CoolDown.js';
import { AuthHandshakeStep } from '../../lib/workflows/presets/AuthHandshake.js';

const ALL_STEPS = [LlmOptimizeStep, MultiBroadcastStep, SecurityAuditStep, AutoSaveStep, CoolDownStep, AuthHandshakeStep];

export function StepLibrary({ onAdd }) {
  return (
    <div style={{ fontFamily: 'monospace' }}>
      <div style={{ color: '#555', fontSize: 12, marginBottom: 12 }}>STEP LIBRARY</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {ALL_STEPS.map(step => (
          <div key={step.id} style={{ background: '#080c14', border: '1px solid #1e2340', borderRadius: 8, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }}>{step.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#ccc', fontSize: 12 }}>{step.name}</div>
              <div style={{ color: '#444', fontSize: 10 }}>{step.type}</div>
            </div>
            <button onClick={() => onAdd?.(step)} style={{ background: '#00FFAA22', border: '1px solid #00FFAA44', borderRadius: 6, color: '#00FFAA', fontSize: 11, padding: '4px 8px', cursor: 'pointer' }}>+</button>
          </div>
        ))}
      </div>
    </div>
  );
}

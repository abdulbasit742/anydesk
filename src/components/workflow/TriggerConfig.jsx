// TriggerConfig.jsx — Workflow trigger settings (manual, schedule, webhook)
import { useState } from 'react';

const TRIGGER_TYPES = [
  { id: 'manual', label: 'Manual', description: 'Run by clicking the Run button', icon: '▶' },
  { id: 'schedule', label: 'Scheduled', description: 'Run on a cron schedule', icon: '🕐' },
  { id: 'webhook', label: 'Webhook', description: 'Triggered by HTTP webhook', icon: '⚡' },
];

export function TriggerConfig({ trigger = {}, onChange }) {
  const [type, setType] = useState(trigger.type || 'manual');

  const update = (t) => { setType(t); onChange?.({ ...trigger, type: t }); };

  return (
    <div style={{ fontFamily: 'monospace' }}>
      <div style={{ color: '#888', fontSize: 12, marginBottom: 10 }}>TRIGGER TYPE</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
        {TRIGGER_TYPES.map(t => (
          <div key={t.id} onClick={() => update(t.id)} style={{ background: type === t.id ? '#0d1520' : '#080c14', border: `1px solid ${type === t.id ? '#00FFAA44' : '#1e2340'}`, borderRadius: 8, padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>{t.icon}</span>
            <div>
              <div style={{ color: type === t.id ? '#00FFAA' : '#ccc', fontSize: 13 }}>{t.label}</div>
              <div style={{ color: '#444', fontSize: 11 }}>{t.description}</div>
            </div>
          </div>
        ))}
      </div>
      {type === 'schedule' && (
        <div>
          <label style={{ color: '#888', fontSize: 12, display: 'block', marginBottom: 6 }}>Cron Expression</label>
          <input defaultValue={trigger.cron || '0 9 * * *'} onChange={e => onChange?.({ ...trigger, cron: e.target.value })} placeholder="0 9 * * *" style={{ width: '100%', background: '#080c14', border: '1px solid #1e2340', borderRadius: 6, color: '#e0e0e0', padding: '8px 12px', fontSize: 13, fontFamily: 'monospace', boxSizing: 'border-box', outline: 'none' }} />
          <p style={{ color: '#444', fontSize: 11, marginTop: 4 }}>Example: 0 9 * * * = daily at 9am</p>
        </div>
      )}
    </div>
  );
}

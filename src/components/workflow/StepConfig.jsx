// StepConfig.jsx — Workflow step configuration panel
export function StepConfig({ step, config, onChange }) {
  if (!step?.configSchema) return <div style={{ color: '#333', fontFamily: 'monospace', fontSize: 12 }}>No configuration options</div>;

  return (
    <div style={{ fontFamily: 'monospace' }}>
      <h4 style={{ color: '#ccc', fontSize: 13, margin: '0 0 16px' }}>{step.icon} {step.name} — Config</h4>
      {Object.entries(step.configSchema).map(([key, schema]) => (
        <div key={key} style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', color: '#888', fontSize: 12, marginBottom: 6 }}>{key}</label>
          {schema.type === 'boolean' ? (
            <input type="checkbox" checked={!!config[key]} onChange={e => onChange({ ...config, [key]: e.target.checked })} />
          ) : schema.options ? (
            <select value={config[key] ?? schema.default} onChange={e => onChange({ ...config, [key]: e.target.value })} style={{ background: '#080c14', border: '1px solid #1e2340', borderRadius: 6, color: '#e0e0e0', padding: '6px 10px', fontSize: 12, fontFamily: 'monospace', width: '100%' }}>
              {schema.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <input type={schema.type === 'number' ? 'number' : 'text'} value={config[key] ?? schema.default ?? ''} min={schema.min} max={schema.max} onChange={e => onChange({ ...config, [key]: schema.type === 'number' ? Number(e.target.value) : e.target.value })} style={{ width: '100%', background: '#080c14', border: '1px solid #1e2340', borderRadius: 6, color: '#e0e0e0', padding: '6px 10px', fontSize: 12, fontFamily: 'monospace', boxSizing: 'border-box', outline: 'none' }} />
          )}
        </div>
      ))}
    </div>
  );
}

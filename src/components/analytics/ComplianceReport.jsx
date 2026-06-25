// ComplianceReport.jsx — Security compliance summary view
import { auditAllKeys } from '../../lib/security/FipsAudit.js';

export function ComplianceReport({ accounts = [] }) {
  const results = auditAllKeys(accounts);
  const compliant = results.filter(r => r.audit.compliant).length;

  if (!accounts.length) return <p style={{ color: '#333', fontSize: 12, fontFamily: 'monospace' }}>Add accounts to see compliance</p>;

  return (
    <div style={{ fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#00FF88', fontSize: 28, fontWeight: 'bold' }}>{compliant}</div>
          <div style={{ color: '#555', fontSize: 11 }}>Compliant</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#FF4D4D', fontSize: 28, fontWeight: 'bold' }}>{results.length - compliant}</div>
          <div style={{ color: '#555', fontSize: 11 }}>Issues</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {results.map(r => (
          <div key={r.accountId} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #111a30' }}>
            <span style={{ color: '#aaa', fontSize: 12 }}>{r.label}</span>
            <span style={{ color: r.audit.compliant ? '#00FF88' : '#FF4D4D', fontSize: 12 }}>{r.audit.score}/100</span>
          </div>
        ))}
      </div>
    </div>
  );
}

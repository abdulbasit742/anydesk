// RunLog.jsx — Workflow execution log display

import DiagnosticConsole from '../telemetry/DiagnosticConsole.jsx';

export function RunLog({ logs = [], running }) {
  return (
    <div style={{ fontFamily: 'monospace' }}>
      {logs.length === 0 && !running && (
        <div style={{ background: '#0d1020', border: '1px solid #1e2340', borderRadius: 12, padding: 40, textAlign: 'center', color: '#333', fontSize: 13 }}>
          Select and run a workflow to see execution logs
        </div>
      )}
      {(logs.length > 0 || running) && <DiagnosticConsole logs={logs} height={220} />}
    </div>
  );
}

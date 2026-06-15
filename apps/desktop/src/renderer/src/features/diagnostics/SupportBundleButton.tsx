import React, { useState } from 'react';
import type { DiagnosticsState } from '../../state/diagnosticsStore.js';
import { exportSupportBundle } from '../../services/supportBundle.js';

export function SupportBundleButton({ sessionId, deviceId, diagnostics }: { sessionId: string; deviceId: string; diagnostics: DiagnosticsState }): JSX.Element {
  const [status, setStatus] = useState<string>('');
  const onClick = async (): Promise<void> => {
    const result = await exportSupportBundle({ sessionId, deviceId, diagnostics });
    setStatus(result.accepted ? `Exported support bundle${result.path ? ` to ${result.path}` : ''}` : 'Export cancelled');
  };
  return <div><button type="button" onClick={() => void onClick()}>Export support bundle</button>{status ? <p className="rd-muted">{status}</p> : null}</div>;
}

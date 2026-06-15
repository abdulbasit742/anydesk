import React, { useEffect, useState } from 'react';
import type { DesktopAuditEmitter } from '../../services/auditEmitter.js';
import { InputPermissionBanner } from './InputPermissionBanner.js';

export interface RemoteInputControlsProps {
  sessionId: string;
  audit?: DesktopAuditEmitter;
}

export function RemoteInputControls({ sessionId, audit }: RemoteInputControlsProps): JSX.Element {
  const [enabled, setEnabled] = useState(false);
  const [emergencyStopped, setEmergencyStopped] = useState(false);

  useEffect(() => {
    void window.remoteDeskInput?.getRemoteInputState({ sessionId }).then((state) => {
      setEnabled(state.enabled);
      setEmergencyStopped(state.emergencyStopped);
    });
  }, [sessionId]);

  const updateEnabled = async (next: boolean): Promise<void> => {
    const state = await window.remoteDeskInput?.setRemoteInputEnabled({ sessionId, enabled: next });
    setEnabled(Boolean(state?.enabled));
    setEmergencyStopped(Boolean(state?.emergencyStopped));
    void audit?.emit({ type: next ? 'remote_input.enabled' : 'remote_input.disabled', category: 'remote_input', metadata: { nativeExecutionEnabled: false } });
  };

  const emergencyStop = async (): Promise<void> => {
    const state = await window.remoteDeskInput?.emergencyStop({ sessionId, reason: 'host clicked emergency stop' });
    setEnabled(Boolean(state?.enabled));
    setEmergencyStopped(true);
    void audit?.emit({ type: 'remote_input.emergency_stop', category: 'remote_input', severity: 'critical', metadata: { source: 'host_control' } });
  };

  return (
    <section className="rd-remote-input-controls">
      <h2>Remote input</h2>
      <InputPermissionBanner enabled={enabled} emergencyStopped={emergencyStopped} />
      <label className="rd-toggle-row">
        <input type="checkbox" checked={enabled} disabled={emergencyStopped} onChange={(event) => void updateEnabled(event.currentTarget.checked)} />
        <span>
          <strong>Allow viewer input for this session</strong>
          <small>Native execution remains disabled unless a reviewed platform executor is explicitly wired.</small>
        </span>
      </label>
      <button type="button" className="danger" onClick={() => void emergencyStop()}>Emergency stop</button>
    </section>
  );
}

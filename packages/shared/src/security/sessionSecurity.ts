export type RemoteInputPermissionState = 'disabled' | 'host-prompt-required' | 'enabled' | 'blocked-by-policy' | 'emergency-stopped';

export function canExecuteRemoteInput(state: RemoteInputPermissionState): boolean {
  return state === 'enabled';
}

export function nextRemoteInputState(current: RemoteInputPermissionState, action: 'host-enable' | 'host-disable' | 'policy-block' | 'emergency-stop'): RemoteInputPermissionState {
  if (action === 'policy-block') return 'blocked-by-policy';
  if (action === 'emergency-stop') return 'emergency-stopped';
  if (action === 'host-enable' && current !== 'blocked-by-policy') return 'enabled';
  if (action === 'host-disable') return 'disabled';
  return current;
}

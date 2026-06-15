import React from 'react';

export function InputPermissionBanner({ enabled, emergencyStopped }: { enabled: boolean; emergencyStopped: boolean }): JSX.Element {
  if (emergencyStopped) {
    return <div className="rd-banner rd-banner--danger">Emergency stop is active. Remote input is blocked until the host resets it.</div>;
  }
  if (!enabled) {
    return <div className="rd-banner rd-banner--warning">Remote input is disabled. The viewer can watch but cannot control this desktop.</div>;
  }
  return <div className="rd-banner rd-banner--success">Remote input is enabled for this session only.</div>;
}

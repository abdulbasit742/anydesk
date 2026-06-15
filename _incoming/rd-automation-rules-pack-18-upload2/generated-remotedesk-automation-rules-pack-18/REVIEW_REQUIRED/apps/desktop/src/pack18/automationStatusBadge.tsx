import React from "react";

export function AutomationStatusBadge(props: { enabled: boolean; failedRuns: number }): JSX.Element {
  return <span data-automation-enabled={props.enabled}>Automation: {props.enabled ? "enabled" : "disabled"} · failed runs {props.failedRuns}</span>;
}

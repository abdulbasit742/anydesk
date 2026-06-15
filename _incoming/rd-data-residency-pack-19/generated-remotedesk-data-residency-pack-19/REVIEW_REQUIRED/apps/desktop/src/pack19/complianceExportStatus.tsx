import React from "react";

export function ComplianceExportStatus(props: { status: "queued" | "running" | "completed" | "failed"; scope: string }): JSX.Element {
  return <span data-export-status={props.status}>{props.scope} export: {props.status}</span>;
}

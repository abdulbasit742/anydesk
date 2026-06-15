import React from "react";

export function ReportExportStatus(props: { status: "queued" | "running" | "completed" | "failed"; rows?: number }): JSX.Element {
  return <span data-report-status={props.status}>Report export: {props.status}{typeof props.rows === "number" ? ` · ${props.rows} rows` : ""}</span>;
}

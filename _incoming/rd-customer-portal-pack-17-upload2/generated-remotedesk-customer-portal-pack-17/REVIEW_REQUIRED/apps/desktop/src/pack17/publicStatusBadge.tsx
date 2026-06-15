import React from "react";

export function PublicStatusBadge(props: { status: "operational" | "degraded" | "partial_outage" | "major_outage" | "maintenance" }): JSX.Element {
  return <span data-public-status={props.status}>Service status: {props.status}</span>;
}

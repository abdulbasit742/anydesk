import React from "react";

export function DataRegionBadge(props: { region: string; purpose: "primary" | "backup" | "archive" }): JSX.Element {
  return <span data-region-purpose={props.purpose}>Data region: {props.region} · {props.purpose}</span>;
}

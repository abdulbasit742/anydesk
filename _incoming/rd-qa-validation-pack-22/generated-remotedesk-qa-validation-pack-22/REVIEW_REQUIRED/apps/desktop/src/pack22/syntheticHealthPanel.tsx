import React from "react";

export function SyntheticHealthPanel(props: { probes: Array<{ key: string; ok: boolean; latencyMs: number }> }): JSX.Element {
  return <section><h3>Synthetic health</h3><ul>{props.probes.map((probe) => <li key={probe.key}>{probe.key}: {probe.ok ? "ok" : "failed"} · {probe.latencyMs}ms</li>)}</ul></section>;
}

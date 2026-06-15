import React from "react";

export function ManualQaChecklistPanel(props: { items: Array<{ id: string; label: string; checked: boolean }>; onToggle: (id: string) => void }): JSX.Element {
  return <section><h3>Manual QA</h3><ul>{props.items.map((item) => <li key={item.id}><label><input type="checkbox" checked={item.checked} onChange={() => props.onToggle(item.id)} /> {item.label}</label></li>)}</ul></section>;
}

import React from "react";

export function KeyboardShortcutHelp(props: { shortcuts: Array<{ label: string; action: string }> }): JSX.Element {
  return <section><h3>Keyboard shortcuts</h3><ul>{props.shortcuts.map((item) => <li key={item.action}>{item.label}: {item.action}</li>)}</ul></section>;
}

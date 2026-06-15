import React from "react";

export function ViewerRosterPopover(props: { viewers: Array<{ id: string; name: string; role: string }> }): JSX.Element {
  return (
    <aside>
      <h3>Connected viewers</h3>
      <ul>{props.viewers.map((viewer) => <li key={viewer.id}>{viewer.name} · {viewer.role}</li>)}</ul>
    </aside>
  );
}

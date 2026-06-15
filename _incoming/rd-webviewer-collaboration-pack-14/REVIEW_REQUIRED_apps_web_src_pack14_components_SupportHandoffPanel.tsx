import React from "react";

export interface SupportHandoffPanelRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function SupportHandoffPanel(props: { rows: SupportHandoffPanelRow[]; onAction?: (id: string) => void }): JSX.Element {
  return (
    <section>
      <h2>Support handoff</h2>
      {props.rows.length === 0 ? <p>No records.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onAction && <button type="button" onClick={() => props.onAction?.(row.id)}>Open</button>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

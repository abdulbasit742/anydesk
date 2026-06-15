import React from "react";

export interface PortalAuditPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function PortalAuditPage(props: { rows: PortalAuditPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Portal audit</h1>
      {props.rows.length === 0 ? <p>No portal records.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onOpen && <button type="button" onClick={() => props.onOpen?.(row.id)}>Open</button>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

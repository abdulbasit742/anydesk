import React from "react";

export interface TenantIsolationChecksPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function TenantIsolationChecksPage(props: { rows: TenantIsolationChecksPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Tenant isolation checks</h1>
      {props.rows.length === 0 ? <p>No residency records.</p> : (
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

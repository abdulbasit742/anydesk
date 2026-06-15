import React from "react";

export interface ZendeskMappingsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function ZendeskMappingsPage(props: { rows: ZendeskMappingsPageRow[]; onConfigure?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Zendesk mappings</h1>
      {props.rows.length === 0 ? <p>No connector records yet.</p> : (
        <ul>
          {props.rows.map((row) => (
            <li key={row.id} data-status={row.status}>
              <strong>{row.title}</strong> · {row.status} {row.detail && <span>· {row.detail}</span>}
              {props.onConfigure && <button type="button" onClick={() => props.onConfigure?.(row.id)}>Configure</button>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

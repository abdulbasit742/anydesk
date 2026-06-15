import React from "react";

export interface OAuthConnectionsPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function OAuthConnectionsPage(props: { rows: OAuthConnectionsPageRow[]; onConfigure?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>OAuth connections</h1>
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

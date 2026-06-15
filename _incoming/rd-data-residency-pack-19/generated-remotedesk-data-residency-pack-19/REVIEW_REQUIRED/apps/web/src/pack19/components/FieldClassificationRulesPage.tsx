import React from "react";

export interface FieldClassificationRulesPageRow {
  id: string;
  title: string;
  status: string;
  detail?: string;
}

export function FieldClassificationRulesPage(props: { rows: FieldClassificationRulesPageRow[]; onOpen?: (id: string) => void }): JSX.Element {
  return (
    <main>
      <h1>Field classification rules</h1>
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

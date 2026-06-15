import React from "react";
import type { DesktopConnectorStatus } from "./connectorStatusStore.js";

export function ConnectorStatusPanel(props: { statuses: DesktopConnectorStatus[]; onReconnect: (key: string) => void }): JSX.Element {
  return (
    <section>
      <h3>Integrations</h3>
      <ul>
        {props.statuses.map((status) => (
          <li key={status.connectorKey} data-state={status.state}>
            <strong>{status.connectorKey}</strong> · {status.state}
            {(status.state === "expired" || status.state === "error") && <button onClick={() => props.onReconnect(status.connectorKey)}>Reconnect</button>}
          </li>
        ))}
      </ul>
    </section>
  );
}

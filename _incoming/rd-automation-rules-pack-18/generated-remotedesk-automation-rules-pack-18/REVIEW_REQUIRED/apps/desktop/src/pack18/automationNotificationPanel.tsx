import React from "react";

export function AutomationNotificationPanel(props: { notifications: Array<{ id: string; title: string; status: string }>; onOpen: (id: string) => void }): JSX.Element {
  return (
    <section>
      <h3>Automation notifications</h3>
      <ul>{props.notifications.map((item) => <li key={item.id}>{item.title} · {item.status} <button onClick={() => props.onOpen(item.id)}>Open</button></li>)}</ul>
    </section>
  );
}

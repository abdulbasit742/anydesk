export interface IntegrationNotification {
  id: string;
  connectorKey: string;
  title: string;
  body: string;
  createdAt: string;
}

export function filterConnectorNotifications(items: readonly IntegrationNotification[], connectorKey: string): IntegrationNotification[] {
  return items.filter((item) => item.connectorKey === connectorKey);
}

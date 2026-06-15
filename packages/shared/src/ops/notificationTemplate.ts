export interface NotificationTemplateVariables {
  userName?: string;
  teamName?: string;
  incidentTitle?: string;
  sessionId?: string;
  actionUrl?: string;
}

export function renderNotificationTemplate(template: string, variables: NotificationTemplateVariables): string {
  return template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_match, key: keyof NotificationTemplateVariables) => {
    const value = variables[key];
    return value === undefined ? "" : String(value);
  });
}

import type { ConnectorDefinitionDto } from "./types.js";

export const defaultConnectorCatalog: ConnectorDefinitionDto[] = [
  {
    key: "slack",
    name: "Slack",
    category: "communication",
    availability: "available",
    description: "Send session and support notifications into selected Slack channels.",
    capabilities: ["notify", "support_handoff"],
    docsUrl: "https://api.slack.com/"
  },
  {
    key: "teams",
    name: "Microsoft Teams",
    category: "communication",
    availability: "available",
    description: "Send collaboration and escalation notifications into Teams.",
    capabilities: ["notify", "support_handoff"],
    docsUrl: "https://learn.microsoft.com/microsoftteams/platform/"
  },
  {
    key: "jira",
    name: "Jira",
    category: "support",
    availability: "available",
    description: "Create issue placeholders from support escalations and audit events.",
    capabilities: ["create_ticket", "sync_tickets"],
    docsUrl: "https://developer.atlassian.com/cloud/jira/platform/"
  },
  {
    key: "zendesk",
    name: "Zendesk",
    category: "support",
    availability: "available",
    description: "Prepare support ticket sync with strict redaction before provider calls.",
    capabilities: ["create_ticket", "sync_tickets"],
    docsUrl: "https://developer.zendesk.com/"
  },
  {
    key: "s3",
    name: "S3-compatible storage",
    category: "storage",
    availability: "coming_soon",
    description: "Future storage target for support bundles and compliance exports.",
    capabilities: ["store_bundle", "export_archive"]
  },
  {
    key: "siem-webhook",
    name: "SIEM webhook",
    category: "security",
    availability: "coming_soon",
    description: "Future outbound security event stream for enterprise SIEM tools.",
    capabilities: ["audit_stream", "security_alert"]
  }
];

export function findDefaultConnector(key: string) {
  return defaultConnectorCatalog.find((connector) => connector.key === key);
}

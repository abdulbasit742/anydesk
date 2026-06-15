export const DEFAULT_CONNECTOR_CATALOG = [
  { key: "slack", name: "Slack", category: "communication" },
  { key: "microsoft-teams", name: "Microsoft Teams", category: "communication" },
  { key: "jira", name: "Jira", category: "support" },
  { key: "zendesk", name: "Zendesk", category: "support" },
  { key: "splunk", name: "Splunk", category: "security" },
  { key: "s3", name: "Amazon S3", category: "storage" }
] as const;

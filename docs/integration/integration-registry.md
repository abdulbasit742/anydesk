# Integration Registry

## Official Integrations
| Integration | Type | Status | Documentation |
|-------------|------|--------|---------------|
| Slack | Notification | Available | slack-integration.md |
| Microsoft Teams | Tab App | Planned | teams-integration.md |
| Zapier | Automation | Planned | zapier-integration.md |
| REST API | API | Available | rest-examples.md |
| Webhooks | Event | Available | webhook-event-catalog.md |

## Third-Party Integrations
| Integration | Category | Provider |
|-------------|----------|----------|
| Stripe | Billing | Official |
| SendGrid | Email | Official |
| S3 | Storage | Official |

## Requesting New Integrations
1. Open feature request at https://remotedesk.io/feedback
2. Include use case and expected workflow
3. Vote on existing requests

## Building Custom Integrations
Use our REST API and Webhooks:
- API Base: https://api.remotedesk.io
- Webhooks: Configure in dashboard
- SDK: @remotedesk/shared

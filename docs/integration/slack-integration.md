# Slack Integration

## Overview
Receive RemoteDesk notifications in Slack channels.

## Setup
1. Go to Settings > Integrations > Slack
2. Click "Connect to Slack"
3. Select workspace and channel
4. Authorize permissions

## Events Sent to Slack
- Session started
- Session ended
- Device came online/offline
- Payment succeeded/failed
- New team member joined

## Message Format
```
RemoteDesk: Session Started
From: John\'s Laptop (123456789)
To: Jane\'s Desktop (987654321)
Duration: 1h 23m
```

## Slash Commands
```
/remotedesk connect <remote-desk-id>
/remotedesk status
/remotedesk devices
```

## Implementation
```typescript
// apps/api/src/integrations/slack.ts
export async function sendSlackNotification(webhookUrl: string, event: WebhookEvent) {
  const blocks = formatEventForSlack(event);
  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ blocks }),
  });
}
```

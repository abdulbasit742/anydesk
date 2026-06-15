# Webhook Dashboard UI Specification

## Overview
Admin dashboard page for managing webhook subscriptions.

## Layout
```
+------------------------------------------+
| Webhooks                          [+ New] |
+------------------------------------------+
| URL              Events        Status    |
| ---------------------------------------- |
| https://...      session.*     Active    |
| https://...      user.*        Active    |
| https://...      device.*      Paused    |
+------------------------------------------+
```

## Components

### Webhook List
- URL (truncated with full on hover)
- Subscribed events (badges)
- Status indicator (active/paused/failing)
- Success rate (last 24h)
- Last delivery timestamp
- Actions: Edit, Pause, Delete

### Create/Edit Modal
- URL input (validated)
- Event selection (checkbox tree)
- Secret generation
- Test delivery button
- SSL verification toggle

### Delivery Log
- Timestamp
- Event type
- Status (delivered/failed)
- HTTP response code
- Response body (truncated)
- Retry count

## Features
- Filter by event type
- Filter by status
- Bulk pause/resume
- Export configuration
- Delivery statistics

# Microsoft Teams Integration

## Overview
RemoteDesk tab app for Microsoft Teams.

## Features
- View dashboard in Teams tab
- Start sessions from Teams
- Receive notifications as Teams activity
- Share RemoteDesk ID in chat

## Setup
1. Upload app manifest to Teams admin
2. Configure RemoteDesk API endpoint
3. Users authenticate with RemoteDesk account

## App Manifest
```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/teams/v1.16/MicrosoftTeams.schema.json",
  "manifestVersion": "1.16",
  "version": "1.0.0",
  "id": "${{TEAMS_APP_ID}}",
  "developer": {
    "name": "RemoteDesk",
    "websiteUrl": "https://remotedesk.io",
    "privacyUrl": "https://remotedesk.io/privacy",
    "termsOfUseUrl": "https://remotedesk.io/terms"
  },
  "name": { "short": "RemoteDesk", "full": "RemoteDesk Remote Desktop" },
  "description": { "short": "Remote desktop access", "full": "Secure remote desktop for teams" },
  "icons": { "outline": "outline.png", "color": "color.png" },
  "accentColor": "#3b82f6",
  "staticTabs": [
    {
      "entityId": "dashboard",
      "name": "Dashboard",
      "contentUrl": "https://app.remotedesk.io/teams",
      "websiteUrl": "https://app.remotedesk.io",
      "scopes": ["personal"]
    }
  ]
}
```

## SSO
Uses Teams SSO to get user context, then links to RemoteDesk account.

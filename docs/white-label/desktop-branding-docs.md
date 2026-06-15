# RemoteDesk Desktop App Branding

## Customizable Elements

### Application
| Element | Configurable | Notes |
|---------|-------------|-------|
| App name | Yes | Menu bar, title bar |
| App icon | Yes | .icns (mac), .ico (win), .png (linux) |
| Version string | Yes | "Acme Remote v1.0.0" |

### Splash Screen
- Logo (centered)
- Loading indicator
- Background color
- Optional: tagline

### About Dialog
- Company name
- App name
- Version
- Copyright notice
- Support link

### Menu Bar (macOS)
```
{AppName}
  About {AppName}
  Preferences...
  Check for Updates
  -----------------
  Quit {AppName}
```

### System Tray
- Icon (16x16, 32x32)
- Tooltip: "{AppName} - Connected"
- Context menu items

## Build Configuration
```json
{
  "productName": "Acme Remote",
  "appId": "com.acme.remote",
  "directories": {
    "buildResources": "build"
  },
  "mac": {
    "icon": "build/icon.icns",
    "category": "public.app-category.utilities"
  },
  "win": {
    "icon": "build/icon.ico",
    "target": "nsis"
  },
  "linux": {
    "icon": "build/icons",
    "category": "Network"
  }
}
```

## Auto-Updater
- Check URL: branded endpoint
- Dialog text: uses app name
- Download page: custom domain

## Code Signing
- Windows: EV certificate recommended
- macOS: Apple Developer ID
- Linux: GPG signature

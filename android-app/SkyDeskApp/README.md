# SkyDesk Android App

**SkyDesk** is a professional AnyDesk-style remote desktop Android client that connects to the RemoteDesk signaling server.

## Structure

```
SkyDeskApp/
├── app/
│   ├── src/main/
│   │   ├── java/com/skydesk/app/
│   │   │   ├── MainActivity.kt           — Entry point, Compose NavHost
│   │   │   ├── network/
│   │   │   │   └── SignalingClient.kt    — Socket.IO client (port 4000)
│   │   │   └── ui/
│   │   │       ├── theme/Theme.kt        — Dark blue SkyDesk theme
│   │   │       └── screens/
│   │   │           ├── HomeScreen.kt     — ID display, connect bar, recent/favorites
│   │   │           ├── SessionScreen.kt  — Active session, file transfer
│   │   │           └── SettingsScreen.kt — Server URL, toggles, about
│   │   ├── AndroidManifest.xml
│   │   └── res/values/
│   │       ├── strings.xml
│   │       └── themes.xml
│   ├── build.gradle.kts
│   └── proguard-rules.pro
├── gradle/libs.versions.toml
├── build.gradle.kts
└── settings.gradle.kts
```

## Build & Run

1. Open **SkyDeskApp** in Android Studio
2. Let Gradle sync complete
3. Run on emulator or real device

## Server Connection

- **Emulator**: `http://10.0.2.2:4000` (default)
- **Real phone**: Change to your PC's LAN IP in Settings screen
  - Example: `http://10.25.40.35:4000`

Start the server first:
```powershell
node C:\RemoteDeskLive\server\server.js
```

## WebRTC Crash Fix

The `org.webrtc.Environment` crash was caused by a broken `io.getstream.webrtc` dependency.
This project uses **Socket.IO + OkHttp only** (no webrtc dependency) to avoid the crash.
WebRTC screen sharing can be added later via `io.getstream:stream-webrtc-android:1.0.4`.

## Features

- ✅ Large SkyDesk ID display
- ✅ Enter Remote Address bar
- ✅ Recent sessions list
- ✅ Favorites tab
- ✅ Settings menu (editable server URL)
- ✅ Account panel dialog
- ✅ File transfer dialog
- ✅ Session history tab
- ✅ Network settings
- ✅ Socket.IO connection to port 4000
- ✅ Incoming connection accept/reject dialog
- ✅ Real-time connected status indicator

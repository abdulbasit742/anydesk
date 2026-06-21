# Mobile Camera Remote Chrome Extension

## Overview
A **premium‑styled** Chrome extension that allows you to connect your Android phone’s camera to your PC via USB, launch a lightweight remote‑desktop window using **scrcpy**, and **mock a physical webcam** in the browser for identity verification platforms (such as Persona, Stripe Identity, or Jumio).

The extension communicates with a native‑messaging host wrapper on Windows which drives a Python execution script.

## Features
- **Virtual Webcam Mocking:** Injects your phone screen's live camera feed as a physical webcam named "Mobile Camera (Virtual USB)" across all pages.
- **One‑click Connect:** Simple popup button to start the native host and verify tool states.
- **Auto-launch Settings:** Configure whether the external remote-desktop window (`scrcpy`) opens automatically upon connection.
- **High-Performance Canvas Rendering:** Uses hardware-accelerated 2D canvas drawing to display stream frames in the popup with zero stream setup delay.
- **Visual Snow Effect:** Premium festive snow animation overlay that doesn't block click events.

## Directory Structure
```
extension-root/
 ┣ 📜 manifest.json               # Chrome extension manifest (v3)
 ┣ 📜 background.js                # Service worker handling native messaging
 ┣ 📜 content.js                   # Page-level frame receiver and hook relay
 ┣ 📜 inject.js                    # Web API mediaDevices hook injector
 ┣ 📜 popup.html                   # Popup UI with canvas display
 ┣ 📜 popup.css                    # Premium dark styling and animations
 ┣ 📜 popup.js                     # UI actions and snow particle system
 ┣ 📜 native_host.bat              # Windows CreateProcess batch wrapper
 ┣ 📜 native_host_stub.py          # ADB execution script and capture loop
 ┣ 📜 native_host_manifest.json    # Chrome native‑messaging registry manifest
 ┣ 📁 icons/                       # Extension icons (16, 48, 128 px)
 ┗ 📜 README.md                    # This file
```

## Setup Instructions
1. **Install Python 3.8+** and ensure it is on your `PATH`.
2. **Install scrcpy** – follow the official guide: https://github.com/Genymobile/scrcpy#installation
3. **Register the native host (Windows)**:
   Open PowerShell as administrator and execute:
   ```powershell
   $manifestPath = "C:\Users\absh5\Documents\antigravity\fervent-planck\native_host_manifest.json"
   New-Item -Path "HKCU:\Software\Google\Chrome\NativeMessagingHosts\com.example.mobile_camera_host" -Force -Value $manifestPath
   ```
4. **Load the extension in Chrome**:
   - Open `chrome://extensions/` → enable **Developer mode** → **Load unpacked** → select the folder containing `manifest.json`.
5. Connect your phone via USB with USB Debugging enabled, click the extension icon, and press **Connect**.

## Usage
- **Webcam Mocking:** Simply load any page requiring a webcam. Select `"Mobile Camera (Virtual USB)"` from the source list. The page will start receiving the live phone screen stream automatically.
- **Remote Desktop:** Toggle `"Auto-launch Window"` if you want scrcpy to mirror the full phone screen on connect, or click `"Start Remote Desktop"` manually.

## License
MIT – feel free to fork and improve!

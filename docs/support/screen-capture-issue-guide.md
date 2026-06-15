# Troubleshooting Screen Capture Issues

## Cannot Start Screen Share

### macOS
1. System Preferences -> Security & Privacy -> Screen Recording
2. Ensure RemoteDesk is checked
3. Restart RemoteDesk app
4. If using browser: grant permission in browser

### Windows
1. No special permission needed for app
2. For browser: allow when prompted
3. Check if other app is using display capture

### Linux
1. Requires PipeWire on Wayland
2. X11 works without extra setup
3. Check portal permissions

## Black Screen on Share
- macOS: Cannot capture DRM content (Netflix, etc.)
- Windows: Some full-screen games block capture
- Try sharing specific window instead of entire screen
- Update graphics drivers

## Low Quality Capture
1. Check capture settings (gear icon)
2. Increase resolution limit
3. Ensure sufficient bandwidth
4. Close other GPU-intensive apps

## Audio Not Captured
- System audio capture requires separate permission
- macOS: Need BlackHole or similar virtual audio device
- Windows: Stereo Mix or virtual audio cable
- Browser: Tab audio capture works

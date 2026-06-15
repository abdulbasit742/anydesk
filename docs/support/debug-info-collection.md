# Debug Information Collection

## Desktop Client
### Automatic Collection
- OS version
- RemoteDesk version
- Network type (WiFi/Ethernet)
- Log file (last 1000 lines)
- Settings (sanitized)

### Manual Collection
1. Open RemoteDesk Desktop
2. Click Help > Export Debug Info
3. Save `.zip` file
4. Attach to support ticket

### Log Location
- Windows: `%APPDATA%\RemoteDesk\logs\`
- macOS: `~/Library/Logs/RemoteDesk/`
- Linux: `~/.config/RemoteDesk/logs/`

## Web Client
### Browser Console
1. Open browser dev tools (F12)
2. Go to Console tab
3. Right-click > Save as
4. Attach to ticket

### Network Logs
1. Open dev tools
2. Go to Network tab
3. Reproduce issue
4. Export HAR file

## Information to Include
- [ ] RemoteDesk ID(s)
- [ ] Description of issue
- [ ] Steps to reproduce
- [ ] Expected vs actual behavior
- [ ] Screenshots/recordings
- [ ] Debug logs
- [ ] Time of issue
- [ ] Network conditions

# Troubleshooting Remote Input Issues

## Keyboard Not Working
1. Check if host enabled remote input
2. Verify focus is on remote window
3. Try clicking in remote window first
4. Some keys may be intercepted by OS:
   - Windows key, Cmd key
   - Alt-Tab, Cmd-Tab
   - Ctrl+Alt+Del (requires unattended access)

## Mouse Not Working
1. Click inside remote view to capture
2. Check if host allowed remote input
3. Multi-monitor: mouse may be on wrong screen
4. Scroll direction may differ (natural scroll)

## Special Keys
| Key | Behavior |
|-----|----------|
| Ctrl+Alt+Del | Blocked by OS (use menu) |
| Cmd+Space | May trigger local Spotlight |
| Alt+Tab | May switch local windows |
| Print Screen | Captures local screen |

## Permission Issues
- Host must explicitly enable remote input
- Enterprise policy may block it
- Admin can override for support sessions
- Audit log records all remote input events

# Desktop QA Test Scripts

## Environment
- OS: Windows 11, macOS 14, Ubuntu 22.04
- Electron: 28.x

## Installation Tests
1. Download installer from website
2. Install completes without errors
3. App launches after install
4. Desktop shortcut created
5. Uninstall removes all files

## Login Tests
1. Enter valid credentials -> success
2. Enter invalid credentials -> error message
3. Click "Forgot password" -> opens browser
4. Remember me checkbox persists
5. Token refresh works silently

## Screen Sharing Tests
1. Click "Share Screen" -> source picker opens
2. Select monitor -> preview shown
3. Select window -> correct window shown
4. Select tab -> correct tab shown
5. Cancel -> returns to dashboard

## Connection Tests
1. Enter valid desk ID -> session request sent
2. Host accepts -> connection established
3. Host rejects -> appropriate message
4. Invalid desk ID -> error
5. Connection lost -> reconnect dialog

## Feature Tests
1. Remote input works (mouse + keyboard)
2. Clipboard sync works both ways
3. File transfer completes
4. Chat messages delivered
5. Session recording starts/stops

## Performance Tests
1. CPU usage < 10% idle
2. Memory usage < 200MB idle
3. Connection establishes < 5s
4. Frame rate > 15fps on LAN
5. Latency < 100ms on LAN

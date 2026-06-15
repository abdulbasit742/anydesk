# Touch Input Contracts

## Event Types

### Tap
```json
{
  "to": "123456789",
  "type": "touch",
  "action": "tap",
  "x": 100,
  "y": 200,
  "fingers": 1,
  "timestamp": 1234567890
}
```
Maps to: `mousemove` + `mousedown` + `mouseup` at (x, y)

### Long Press
```json
{
  "to": "123456789",
  "type": "touch",
  "action": "longpress",
  "x": 100,
  "y": 200,
  "duration": 800,
  "timestamp": 1234567890
}
```
Maps to: Right-click at (x, y)

### Drag
```json
{
  "to": "123456789",
  "type": "touch",
  "action": "drag",
  "startX": 100,
  "startY": 200,
  "endX": 150,
  "endY": 250,
  "velocity": 0.5,
  "timestamp": 1234567890
}
```
Maps to: Mouse move from (startX, startY) to (endX, endY)

### Pinch
```json
{
  "to": "123456789",
  "type": "touch",
  "action": "pinch",
  "centerX": 200,
  "centerY": 200,
  "scale": 1.5,
  "timestamp": 1234567890
}
```
Maps to: Scroll wheel event

## Coordinate Mapping
Touch coordinates must be mapped to remote screen resolution:
```
remoteX = (touchX / localWidth) * remoteWidth
remoteY = (touchY / localHeight) * remoteHeight
```

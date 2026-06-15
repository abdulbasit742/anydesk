# Touch Input Protocol

## Coordinate Mapping
```
remoteX = touch.x * remoteWidth
remoteY = touch.y * remoteHeight
```

## Events
- touchstart: Finger placed
- touchmove: Finger moved
- touchend: Finger lifted

## Multi-touch
Up to 5 simultaneous touches tracked by ID.

## Gestures
- pinch: Scale factor for zoom
- pan: Translation delta
- longpress: 500ms hold
- doubletap: Two taps within 300ms

## Performance
Events batched at 60fps max to reduce network overhead.

# Mobile Remote Control QA Checklist

## Touch
- [ ] Single tap = left click
- [ ] Long press (>500ms) = right click
- [ ] Two-finger drag = scroll
- [ ] Pinch = zoom viewport (no remote effect)
- [ ] Pan = mouse move

## Keyboard
- [ ] Keyboard overlay opens
- [ ] Typed text sends as input action
- [ ] Enter key sends
- [ ] Dismiss keyboard hides overlay

## Edge Cases
- [ ] Rapid taps don't crash
- [ ] Multi-touch ignored safely
- [ ] Gesture outside bounds handled
- [ ] Low latency (< 150ms) on LAN

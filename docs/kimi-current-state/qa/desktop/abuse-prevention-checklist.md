# Abuse Prevention Checklist

**Status:** SAFE_DIRECT_COPY  
**Last Updated:** 2026-06-12  
**Scope:** Abuse Prevention and Rate Limiting QA

---

## Rate Limiting

- [ ] Default rate limits enforced (60 cmd/s)
- [ ] Mouse move coalescing active (120 moves/s)
- [ ] Wheel delta clamping active (1000 max)
- [ ] Keyboard repeat guard active (30Hz)
- [ ] Violation threshold triggers throttle (10 violations)
- [ ] Throttle duration is 5 seconds
- [ ] Rate limits configurable per deployment

## Suspicious Pattern Detection

- [ ] Corner flood pattern detected (>10 corner moves in 2s)
- [ ] Rapid click pattern detected (>15 clicks in 1s)
- [ ] Keyboard spam detected (>30 keys in 1s)
- [ ] Modifier abuse detected (Ctrl+Alt combos)
- [ ] Detections logged with evidence
- [ ] Detections don't block legitimate use

## Input Sanitization

- [ ] Coordinates clamped to [-65535, 65535]
- [ ] Non-finite coordinates become 0
- [ ] Invalid button types sanitized to 'left'
- [ ] Invalid key codes clamped to [0, 255]
- [ ] Unknown command types rejected
- [ ] Invalid actions sanitized to safe defaults

## Audit and Forensics

- [ ] All blocked commands logged
- [ ] All executed commands logged
- [ ] Emergency stops logged
- [ ] Permission changes logged
- [ ] Logs contain no sensitive data
- [ ] Logs available for support review
- [ ] Tamper-evident log format

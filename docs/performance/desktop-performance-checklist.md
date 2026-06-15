# Desktop Performance Checklist

## Startup
- [ ] Cold start < 3 seconds
- [ ] Warm start < 1 second
- [ ] Memory usage < 200MB at idle

## Session
- [ ] Frame capture > 30fps on 1080p
- [ ] Encoding latency < 50ms
- [ ] End-to-end latency < 100ms on LAN
- [ ] CPU usage < 30% during session

## Streaming
- [ ] Adaptive bitrate works
- [ ] Quality degradation smooth
- [ ] Recovery from packet loss < 2s

## Resources
- [ ] No memory leaks over 1 hour
- [ ] GPU memory freed on disconnect
- [ ] File transfer doesn't block UI

## Benchmarks
Run `apps/desktop/tests/perf/benchmark.js` for automated measurements.

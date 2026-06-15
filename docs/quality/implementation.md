# Quality Monitoring Implementation

## Stats Collection
Collects every 2 seconds via `pc.getStats()`:
- inbound-rtp: bitrate, packetLoss, jitter, framesDecoded
- candidate-pair: roundTripTime
- track: frameWidth, frameHeight

## Trend Charts
SVG-based sparklines showing last 60 data points.
Color-coded by metric type.

## Warning Banner
Shown when overall score drops below 60.
Provides actionable guidance to user.

## Future Enhancements
- Adaptive bitrate based on score
- Automatic quality reduction
- Bandwidth estimation
- Congestion control feedback
